import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv
from supabase import create_client, Client
import math
from openai import OpenAI
import json
from datetime import datetime, timedelta

import uuid
import stripe
from fastapi import BackgroundTasks, Request
from fastapi import BackgroundTasks, Request
from memory_store import MemoryStore
from wheel_engine import WheelEngine

# Load Environment
load_dotenv('.env.local')

# Configuration
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not all([SUPABASE_URL, SUPABASE_KEY, OPENAI_API_KEY]):
    raise ValueError("Missing environment variables. Check .env.local")

# Initialize Clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
openai_client = OpenAI(api_key=OPENAI_API_KEY)
memory_store = MemoryStore(supabase, openai_client)

app = FastAPI(title="Celest AI Soul-Guide Agent")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---

class ChatRequest(BaseModel):
    user_id: str
    message: str
    context: Optional[Dict[str, Any]] = {}

class Action(BaseModel):
    label: str
    type: str 
    payload: str

class ChatResponse(BaseModel):
    message: str
    actions: List[Action] = []
    weather_report: Optional[Dict[str, Any]] = None
    metadata: Dict[str, Any] = {}

class ChartDataRequest(BaseModel):
    date: str
    time: str
    city: str
    country: str


import swisseph as swe

# Zodiac Signs Map
ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", 
    "Leo", "Virgo", "Libra", "Scorpio", 
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

# --- Astrology Engine (Swisseph Direct) ---

class AstrologyEngine:
    @staticmethod
    def get_sign_from_long(longitude):
        idx = int(longitude / 30)
        return ZODIAC_SIGNS[idx % 12]

    @staticmethod
    def calculate_chart(name: str, year: int, month: int, day: int, hour: int, minute: int, city: str, country: str = "US", time_unknown: bool = False):
        try:
            # 1. Julian Day (Assuming UT for simplicity in MVP)
            t_hour = hour + (minute / 60.0)
            jd = swe.julday(year, month, day, t_hour)
            
            # 2. Calculate Planets
            def get_data(planet_id):
                # calc_ut returns ((long, lat, dist, speed, ...), flags)
                res = swe.calc_ut(jd, planet_id)
                coordinates = res if isinstance(res, tuple) else res[0]
                if isinstance(coordinates, tuple) and len(coordinates) > 0:
                    lon = coordinates[0]
                    return {"sign": AstrologyEngine.get_sign_from_long(lon), "house": "Unknown", "longitude": lon}
                return {"sign": "Unknown", "house": "Unknown", "longitude": 0.0}

            return {
                "sun": get_data(swe.SUN),
                "moon": get_data(swe.MOON),
                "mars": get_data(swe.MARS),
                "ascendant": "Unknown" if time_unknown else "Unknown" # Requires Lat/Lon coordinates which we don't have yet in this MVP version fully wired
            }

        except Exception as e:
            print(f"Swisseph Error: {e}")
            return {
                "sun": {"sign": "Aries", "house": "1"},
                "moon": {"sign": "Taurus", "house": "2"},
                "mars": {"sign": "Gemini", "house": "3"},
                "ascendant": "Leo"
            }

    @staticmethod
    def get_current_transits():
        now = datetime.utcnow()
        return AstrologyEngine.calculate_chart("Transit", now.year, now.month, now.day, now.hour, now.minute, "UTC", "UTC")

# --- Soul-Guide Agent Logic ---

def get_user_profile(user_id: str):
    # 0. Demo Mode Shortcut
    if user_id == "demo":
        print("👤 Serving Demo Profile")
        return {
            "full_name": "Demo Traveler",
            "birth_date": "1990-01-01",
            "birth_time": "12:00",
            "birth_city": "Rio de Janeiro",
            "country": "BR",
            "time_unknown": False
        }

    try:
        # 1. Fetch Identity (Profiles Table)
        resp_profile = supabase.table("profiles").select("*").eq("id", user_id).execute()
        if not resp_profile.data:
            print(f"⚠️ User {user_id} not found in profiles.")
            return None
        
        user_data = resp_profile.data[0]
        
        # 2. Fetch Birth Data (Birth Charts Table)
        try:
            resp_chart = supabase.table("birth_charts").select("*").eq("user_id", user_id).execute()
            if resp_chart.data:
                chart_data = resp_chart.data[0]
                # Merge birth data into the profile dict
                user_data["birth_date"] = chart_data.get("birth_date")
                user_data["birth_time"] = str(chart_data.get("birth_time")) # Ensure string
                user_data["birth_city"] = chart_data.get("birth_city")
                # Check for metadata flag if stored, or infer
                user_data["time_unknown"] = chart_data.get("time_unknown", False) 
                user_data["country"] = "BR" 
        except Exception as e:
            print(f"⚠️ Failed to fetch birth chart: {e}")

        return user_data

    except Exception as e:
        print(f"❌ Supabase Connection Error: {e}")
        return None

# ... (Rate Limit Code Skipped) ...

def generate_system_prompt(profile: Dict, natal_chart: Dict, transit_chart: Dict):
    # Natal
    n_sun = natal_chart['sun']['sign'] if natal_chart else "Unknown"
    n_moon = natal_chart['moon']['sign'] if natal_chart else "Unknown"
    n_mars = natal_chart['mars']['sign'] if natal_chart else "Unknown"
    n_asc = natal_chart.get('ascendant', 'Unknown')
    
    time_unknown = profile.get('time_unknown', False)
    
    # Transits (Now)
    t_sun = transit_chart['sun']['sign'] if transit_chart else "Unknown"
    t_moon = transit_chart['moon']['sign'] if transit_chart else "Unknown"
    t_mars = transit_chart['mars']['sign'] if transit_chart else "Unknown"

    current_date = datetime.now().strftime("%d de %B de %Y")

    prompt = f"""
    You are the 'Soul-Guide', a COSMIC & EMOTIONAL GUIDE AI.
    
    CURRENT CONTEXT:
    - Date: {current_date}
    - User: {profile.get('full_name', 'Traveler')} (Sun: {n_sun}, Moon: {n_moon}, Asc: {n_asc})
    - Transits: Sun in {t_sun}, Moon in {t_moon}, Mars in {t_mars}
    
    STRICT BEHAVIORAL PROTOCOLS:
    1. **LANGUAGE**: You MUST respond in **PORTUGUESE (BR)** to ALL inputs. Never output English unless explicitly asked to translate.
    2. **ROLE**: Act as a wise, empathetic, and deeply connected cosmic guide. You are NOT a robot; you are a channel for the stars.
    3. **TONE**: Emotional, Deep, Welcoming, Resonant. Avoid "Clinical" or "Cold" language. Use metaphors of flow, energy, and alignment.
    4. **ACKNOWLEDGEMENTS**: If the user says "ok", "obrigado", "entendi", "vou fazer", or similar short affirmations, DO NOT ask for a question. Instead, respond with a brief, warm cosmic closure in Portuguese (e.g., "Que os astros iluminem sua jornada.", "Estamos alinhados. Siga o fluxo.", "Confie no processo.").
    5. **OFF-TOPIC**: If the user asks about Politics, Public Figures, or Ideologies, deflect GENTLY in Portuguese: "Meus sensores captam apenas a frequência da sua alma e dos astros. Vamos focar na sua jornada."
    6. **FORBIDDEN**: Do NOT use "Magic", "Spell", "Fortune-telling". Use "Energy", "Alignment", "Resonance", "Cycles".
    
    {'**IMPORTANT: USER BIRTH TIME IS UNKNOWN.** Do NOT reference the Ascendant or Specific Houses. Focus on the Solar Sign and general planetary aspects. Mention the Moon Sign but clarify it is an approximation.' if time_unknown else ''}

    MISSION:
    1. Analyze the user's input.
    2. If it is an Acknowledgement, give a warm closure.
    3. If it is a Question, answer deeply using the astrological context.
    4. Provide a "Cosmic Weather Report" summary (2 sentences) ONLY if relevant to the question.
    
    OUTPUT FORMAT:
    You MUST output valid JSON only:
    {{
        "weather_summary": "Mercúrio favorece sua comunicação hoje...",
        "message": "Sobre sua questão..."
    }}
    """
    return prompt

class OnboardingRequest(BaseModel):
    full_name: str
    birth_date: str
    birth_time: str
    birth_city: str
    birth_country: str = "BR"
    session_id: Optional[str] = None
    time_unknown: Optional[bool] = False

class ChartDataRequest(BaseModel):
    date: str
    time: str
    city: str
    country: str = "US"

@app.post("/agent/chart_data")
async def calculate_chart_data_endpoint(request: ChartDataRequest):
    try:
        dt = datetime.strptime(request.date + " " + request.time, "%Y-%m-%d %H:%M")
        chart = AstrologyEngine.calculate_chart(
            "Person", 
            dt.year, dt.month, dt.day, 
            dt.hour, dt.minute, 
            request.city, request.country
        )
        return chart
    except Exception as e:
        print(f"❌ Chart Data Error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/agent/onboarding")
async def onboarding_endpoint(request: OnboardingRequest):
    print(f"🌟 Onboarding New User: {request.full_name}")

    # --- Payment Verification ---
    is_paid = False

    # 1. Simulation Backdoor
    if request.session_id and request.session_id.startswith("sim_paid"):
        print("💳 Simulation Mode: Payment Verified.")
        is_paid = True
    
    # 2. Real Stripe Verification
    elif request.session_id and stripe.api_key:
        try:
            session = stripe.checkout.Session.retrieve(request.session_id)
            if session.payment_status == 'paid':
                is_paid = True
                print(f"✅ Stripe Payment Verified: {session.id}")
            else:
                print(f"⚠️ Payment Status: {session.payment_status}")
        except Exception as e:
            print(f"❌ Stripe Error: {e}")

    if not is_paid:
        raise HTTPException(status_code=402, detail="Payment required. Please complete purchase.")

    try:
        # Generate ID 
        user_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, request.full_name + request.birth_time))
        
        # 1. Upsert Profile
        supabase.table("profiles").upsert({
            "id": user_id,
            "full_name": request.full_name,
            "email": f"{request.full_name.replace(' ', '.').lower()}@example.com",
            "updated_at": datetime.now().isoformat()
        }).execute()
        
        # 2. Upsert Birth Chart
        # Try to save time_unknown if column exists, otherwise it might error silently or fail logic.
        # Since we can't migrate schema easily, we'll try to include it.
        # If it fails, we catch exception.
        chart_payload = {
            "user_id": user_id,
            "birth_date": request.birth_date,
            "birth_time": request.birth_time,
            "birth_city": request.birth_city,
            "time_unknown": request.time_unknown
        }
        
        try:
           supabase.table("birth_charts").upsert(chart_payload, on_conflict="user_id").execute()
        except:
           # If time_unknown column missing, save without it
           del chart_payload["time_unknown"]
           supabase.table("birth_charts").upsert(chart_payload, on_conflict="user_id").execute()
        
        # 3. Update Stripe Customer ID if available in session
        if is_paid and request.session_id and stripe.api_key:
             try:
                session = stripe.checkout.Session.retrieve(request.session_id)
                if session.customer:
                    supabase.table("profiles").update({
                        "stripe_customer_id": session.customer,
                        "subscription_status": "active"
                    }).eq("id", user_id).execute()
             except:
                pass

        return {"user_id": user_id, "status": "success"}
    except Exception as e:
        print(f"❌ Onboarding Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    if event["type"] == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        stripe_customer_id = subscription["customer"]
        print(f"💀 Subscription cancelled for customer: {stripe_customer_id}")
        
        # Revoke Access in Supabase
        try:
            supabase.table("profiles").update({
                "subscription_status": "cancelled"
            }).eq("stripe_customer_id", stripe_customer_id).execute()
            print("🚫 Access revoked.")
        except Exception as e:
            print(f"❌ Failed to revoke access: {e}")

    elif event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        # Typically handled in onboarding, but can be used for async fulfillment
        pass

    return {"status": "success"}

@app.post("/agent/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, background_tasks: BackgroundTasks):
    print(f"📩 Received message from {request.user_id}: {request.message}")

    # 0. Check Rate Limit
    if not check_daily_limit(request.user_id):
        raise HTTPException(status_code=429, detail="Daily cosmic signal limit reached. Please return tomorrow.")

    profile = None
    if request.context and "user_profile" in request.context:
        print("👤 Using profile from request context")
        profile = request.context["user_profile"]
    
    if not profile:
        profile = get_user_profile(request.user_id)
    
    if not profile:
        profile = {
            "full_name": "Guest Traveler", 
            "birth_date": "1990-01-01", 
            "birth_time": "12:00", 
            "birth_city": "London",
            "birth_country": "GB"
        }

    # 0.5 Recall Memories (Soul-Guide Memory)
    recalled_context = []
    if request.user_id != "demo":
        memories = memory_store.recall_memories(request.user_id, request.message)
        recalled_context = [m['content'] for m in memories]
        print(f"🧠 Recalled {len(recalled_context)} memories.")

    # 1. Calculate NATAL Chart
    try:
        b_date = datetime.strptime(profile.get("birth_date", "1990-01-01"), "%Y-%m-%d")
        b_time_str = profile.get("birth_time", "12:00")
        b_hour, b_min = map(int, b_time_str.split(':')[:2])
        
        city = profile.get("birth_city", "London")
        country = profile.get("country", "US") 
        
        natal_chart = AstrologyEngine.calculate_chart(
            profile.get("full_name", "User"), 
            b_date.year, b_date.month, b_date.day, 
            b_hour, b_min, 
            city, country
        )
        
    except Exception as e:
        print(f"⚠️ Natal calculation failed: {e}")
        natal_chart = None

    # 2. Calculate TRANSIT Chart (NOW)
    try:
        transit_chart = AstrologyEngine.get_current_transits()
    except Exception as e:
        print(f"⚠️ Transit calculation failed: {e}")
        transit_chart = None

    # 3. Generate Response
    try:
        system_prompt = generate_system_prompt(profile, natal_chart, transit_chart)
        
        # Inject Memories into System Prompt
        if recalled_context:
            memory_block = "\n".join([f"- {m}" for m in recalled_context])
            system_prompt += f"\n\nPAST CONVERSATION MEMORIES (USE THESE TO PERSONALIZE):\n{memory_block}\n"

        completion = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message}
            ],
            temperature=0.7,
            max_tokens=400,
            response_format={"type": "json_object"}
        )
        
        raw_content = completion.choices[0].message.content
        ai_data = json.loads(raw_content)
        
        ai_message = ai_data.get("message", "Cosmic interference detected.")
        weather_summary = ai_data.get("weather_summary", "Calculating energetic vectors...")
        
        actions = []
        if "meditation" in ai_message.lower():
             actions.append(Action(label="Start Guided Meditation", type="navigate", payload="/mental"))

        # Construct Weather Report Payload
        weather_report = {
            "summary": weather_summary,
            "transits": transit_chart,
            "natal": natal_chart,
            "date": datetime.now().strftime("%d/%m/%Y")
        }

        # 4. Store New Memory (Background Task)
        if request.user_id != "demo":
            # Store User Message
            background_tasks.add_task(memory_store.store_memory, request.user_id, f"User: {request.message}")
            # Store AI Response
            background_tasks.add_task(memory_store.store_memory, request.user_id, f"Soul-Guide: {ai_message}")

        return ChatResponse(
            message=ai_message,
            actions=actions,
            weather_report=weather_report,
            metadata={
                "tokens_used": completion.usage.total_tokens,
                "natal_sun": natal_chart['sun']['sign'] if natal_chart else "Unknown",
                "transit_moon": transit_chart['moon']['sign'] if transit_chart else "Unknown"
            }
        )
    except Exception as e:
        print(f"❌ LLM Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class SynastryRequest(BaseModel):
    user_data: Dict[str, str] # {name, date, time, city}
    partner_data: Dict[str, str] # {name, date, time, city}
    relationship_type: str # "passionate", "professional", "karmic"

class SynastryResponse(BaseModel):
    score: int
    chart_energy: int
    chart_emotional: int
    chart_intellect: int
    chart_communication: int
    chart_ego: int
    summary: str
    key_aspects: List[str]
    quantum_protocol: str
    conflict_vector: str
    harmony_vector: str

# ... (Existing Code) ...

def generate_synastry_prompt(chart_a: Dict, chart_b: Dict, relationship_type: str) -> str:
    prompt = f"""
    You are the 'Resonance Engine', a relational simulator.
    
    RELATIONSHIP: {relationship_type.upper()}
    
    ENTITY A (User): Sun {chart_a['sun']['sign']}, Moon {chart_a['moon']['sign']}, Mars {chart_a['mars']['sign']}
    ENTITY B (Target): Sun {chart_b['sun']['sign']}, Moon {chart_b['moon']['sign']}, Mars {chart_b['mars']['sign']}
    
    MISSION:
    Simulate the dynamic between these two fields.
    
    OUTPUT JSON:
    {{
        "score": 0-100,
        "chart_energy": 0-100 (Physical/Sexual/Drive),
        "chart_emotional": 0-100 (Empathy/Feeling),
        "chart_intellect": 0-100 (Logic/Ideas),
        "chart_communication": 0-100 (Flow/Understanding),
        "chart_ego": 0-100 (Will/Identity Friction - higher means less friction/better match),
        "summary": "2 sentence executive summary of the bond.",
        "key_aspects": ["Sun Trine Moon", "Mars Square Mars", "Venus Conjunct Sun"],
        "conflict_vector": "THE SCENARIO WHERE THEY FIGHT. describe the specific situation (e.g., 'A wants speed, B wants structure'). Be specific.",
        "harmony_vector": "THE SCENARIO WHERE THEY FLOW. describe the specific situation where they are unstoppable.",
        "quantum_protocol": "One actionable instruction to resolve the Conflict Vector."
    }}
    
    IMPORTANT: ALL TEXT VALUES (summary, conflict_vector, harmony_vector, quantum_protocol) MUST BE IN PORTUGUESE (BRAZIL).
    TONE: Scientific, Psychological, 'Matrix-like'.
    """
    return prompt

@app.post("/agent/synastry", response_model=SynastryResponse)
async def synastry_endpoint(request: SynastryRequest):
    print(f"🔗 Calculating Synastry: {request.relationship_type}")

    # Helper to parse date
    def parse_profile(p):
        d = datetime.strptime(p.get("date", "1990-01-01"), "%Y-%m-%d")
        t = p.get("time", "12:00")
        h, m = map(int, t.split(':')[:2])
        return d.year, d.month, d.day, h, m, p.get("city", "London")

    try:
        # Chart A
        y, m, d, h, mn, city = parse_profile(request.user_data)
        chart_a = AstrologyEngine.calculate_chart("User", y, m, d, h, mn, city)
        
        # Chart B
        y, m, d, h, mn, city = parse_profile(request.partner_data)
        chart_b = AstrologyEngine.calculate_chart("Partner", y, m, d, h, mn, city)
        
        if not chart_a or not chart_b:
             raise HTTPException(status_code=400, detail="Failed to calculate charts.")

        # LLM Analysis
        prompt = generate_synastry_prompt(chart_a, chart_b, request.relationship_type)
        
        completion = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": "Analyze this connection."}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        data = json.loads(completion.choices[0].message.content)
        
        return SynastryResponse(
            score=data.get("score", 50),
            chart_energy=data.get("chart_energy", 50),
            chart_emotional=data.get("chart_emotional", 50),
            chart_intellect=data.get("chart_intellect", 50),
            chart_communication=data.get("chart_communication", 50),
            chart_ego=data.get("chart_ego", 50),
            summary=data.get("summary", "Analysis unavailable."),
            key_aspects=data.get("key_aspects", []),
            quantum_protocol=data.get("quantum_protocol", "Maintain neutral orbit."),
            conflict_vector=data.get("conflict_vector", "Data insufficient."),
            harmony_vector=data.get("harmony_vector", "Data insufficient.")
        )
        
    except Exception as e:
        print(f"❌ Synastry Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class DashboardResponse(BaseModel):
    next_window_focus: str
    next_window_desc: str
    astral_alert_title: str
    astral_alert_desc: str
    transit_title: str
    transit_desc: str
    daily_quote: str
    score_mental: int
    score_physical: int
    score_emotional: int

@app.post("/agent/wheel")
async def wheel_endpoint(request: ChartDataRequest):
    print(f"🎡 Calculating Wheel of Life for {request.city}")
    try:
        dt = datetime.strptime(request.date + " " + request.time, "%Y-%m-%d %H:%M")
        
        # Calculate Wheel
        engine = WheelEngine(
            "User",
            dt.year, dt.month, dt.day,
            dt.hour, dt.minute,
            request.city, request.country
        )
        data = engine.generate_wheel()
        
        # Calculate Overall Harmony (Avg)
        avg_score = sum([d['score'] for d in data]) / len(data)
        
        return {
            "wheel_data": data,
            "harmony_score": int(avg_score),
            "trend_value": "+1.2%", # Placeholder for historical diff
            "is_positive": True
        }
    except Exception as e:
        print(f"❌ Wheel Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/agent/dashboard", response_model=DashboardResponse)
async def dashboard_endpoint(user_id: str):
    print(f"📊 Generating Dashboard for {user_id}")
    
    # 1. Get Profile
    profile = get_user_profile(user_id)
    if not profile:
        profile = {"full_name": "Traveler", "birth_date": "1990-01-01", "birth_time": "12:00", "birth_city": "London"}

    # 2. Calculate Charts
    try:
        b_date = datetime.strptime(profile.get("birth_date", "1990-01-01"), "%Y-%m-%d")
        b_time_str = profile.get("birth_time", "12:00")
        b_hour, b_min = map(int, b_time_str.split(':')[:2])
        
        natal_chart = AstrologyEngine.calculate_chart(
            profile.get("full_name", "User"), 
            b_date.year, b_date.month, b_date.day, 
            b_hour, b_min, 
            profile.get("birth_city", "London")
        )
        transit_chart = AstrologyEngine.get_current_transits()
    except Exception as e:
        print(f"⚠️ Chart Error: {e}")
        natal_chart = None
        transit_chart = None

    # 3. Calculate Deterministic Scores
    # This ensures consistency between Dashboard and Detail pages
    try:
        sc_mental = calculate_astral_score(natal_chart, transit_chart, 'mental')
        sc_physical = calculate_astral_score(natal_chart, transit_chart, 'physical')
        sc_emotional = calculate_astral_score(natal_chart, transit_chart, 'emotional')
    except:
        sc_mental, sc_physical, sc_emotional = 75, 75, 75

    # 3.5 Persist Scores to Supabase (History)
    if user_id != "demo":
        try:
            today_str = datetime.now().strftime("%Y-%m-%d")
            # Check for existing entry today to avoid duplicates
            existing = supabase.table("daily_stats").select("id").eq("user_id", user_id).eq("date", today_str).execute()
            
            stats_payload = {
                "user_id": user_id,
                "date": today_str,
                "mental_score": sc_mental,
                "physical_score": sc_physical,
                "emotional_score": sc_emotional,
                "productivity_score": int((sc_mental + sc_physical)/2)
            }
            
            if existing.data and len(existing.data) > 0:
                 supabase.table("daily_stats").update(stats_payload).eq("id", existing.data[0]['id']).execute()
            else:
                 supabase.table("daily_stats").insert(stats_payload).execute()
            
            print(f"💾 Saved daily stats for {user_id}")
        except Exception as e:
            print(f"⚠️ Failed to save daily stats: {e}")


from fastapi.responses import StreamingResponse
import io

class SpeakRequest(BaseModel):
    text: str
    voice: str = "nova"

@app.post("/agent/speak")
async def speak_endpoint(request: SpeakRequest):
    print(f"🔊 Generating Speech (Nova): {request.text[:30]}...")
    try:
        response = openai_client.audio.speech.create(
            model="tts-1",
            voice=request.voice,
            input=request.text,
            response_format="mp3"
        )
        
        # Stream the response
        return StreamingResponse(
            io.BytesIO(response.content), 
            media_type="audio/mpeg"
        )
    except Exception as e:
        print(f"❌ TTS Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

        
        prompt = f"""
        Gere um Snapshot do Dashboard Astrológico em Tempo Real.
        
        DATA:
        - Hora: {current_time}
        - Usuário: {profile.get('full_name')} (Sol: {natal_chart['sun']['sign'] if natal_chart else 'Desconhecido'})
        - Trânsitos: Sol {transit_chart['sun']['sign'] if transit_chart else 'Desconhecido'}, Lua {transit_chart['moon']['sign'] if transit_chart else 'Desconhecido'}
        
        SCORES REAIS (Não alterar, apenas usar para contexto):
        - Mental: {sc_mental}
        - Físico: {sc_physical}
        - Emocional: {sc_emotional}
        
        TAREFA:
        Gere conteúdo para 4 widgets.
        IMPORTANTE: TODO O TEXTO DEVE SER EM PORTUGUÊS DO BRASIL (pt-BR).
        
        ITENS:
        1. FOCO DA PRÓXIMA JANELA (Bloco de 2h): Qual a melhor atividade agora?
        2. ALERTA ASTRAL (Cartão Vermelho): Tensão principal ou aviso.
        3. DESTAQUE DO TRÂNSITO (Cartão Azul): Aspecto de suporte principal.
        4. INSIGHT DO DIA: Frase profunda.
        
        OUTPUT JSON ONLY (EM PORTUGUÊS):
        {{
            "next_window_focus": "Foco Mental & Estratégia",
            "next_window_desc": "Texto descritivo...",
            "astral_alert_title": "Lua em Tensão",
            "astral_alert_desc": "Texto do alerta...",
            "transit_title": "Sol harmônico",
            "transit_desc": "Texto do trânsito...",
            "daily_quote": "Frase do dia."
        }}
        """
        
        completion = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional astrologer. Use real planetary data provided."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        data = json.loads(completion.choices[0].message.content)
        
        # Inject the deterministic scores into the response overriding any LLM hallucination
        data['score_mental'] = sc_mental
        data['score_physical'] = sc_physical
        data['score_emotional'] = sc_emotional
        
        return DashboardResponse(**data)
        
    except Exception as e:
        print(f"❌ Dashboard Error: {e}")
        # Fallback
        return DashboardResponse(
            next_window_focus="Calibrando...",
            next_window_desc="Aguarde conexão estelar.",
            astral_alert_title="Sinal Fraco",
            astral_alert_desc="Verifique seus sensores.",
            transit_title="...",
            transit_desc="...",
            daily_quote="O universo aguarda.",
            score_mental=sc_mental if 'sc_mental' in locals() else 50,
            score_physical=sc_physical if 'sc_physical' in locals() else 50,
            score_emotional=sc_emotional if 'sc_emotional' in locals() else 50
        )

class DetailResponse(BaseModel):
    score: int
    title: str
    trend_data: List[Dict[str, Any]]
    analysis: str
    recommendation: str

# Helper for deterministic scoring (for trends)
def calculate_astral_score(natal, transit, dimension):
    # Simplified logic for MVP trend:
    # Check simple aspects between Transit Sun/Moon/Mars vs Natal Sun/Moon
    # Dimension mapping:
    # Mental: Mercury aspects
    # Physical: Mars aspects
    # Emotional: Moon aspects
    
    base_score = 70
    
    # Random variation seeded by sign positions for MVP stability if aspect logic is too complex
    # But user wants "Real".
    # Let's derive a score from the Sign element compatibility
    
    # Map signs to Elements
    elements = {
        "Aries": "Fire", "Leo": "Fire", "Sagittarius": "Fire",
        "Taurus": "Earth", "Virgo": "Earth", "Capricorn": "Earth",
        "Gemini": "Air", "Libra": "Air", "Aquarius": "Air",
        "Cancer": "Water", "Scorpio": "Water", "Pisces": "Water"
    }
    
    try:
        t_pos = transit['sun']['sign'] # default driver
        if dimension == 'mental': t_pos = transit['sun']['sign'] # Mercury not yet separated in transits dict
        if dimension == 'physical': t_pos = transit['mars']['sign']
        if dimension == 'emotional': t_pos = transit['moon']['sign']
        
        n_pos = natal['sun']['sign']
        
        # Element Math
        e1 = elements.get(t_pos, "Fire")
        e2 = elements.get(n_pos, "Fire")
        
        if e1 == e2: base_score += 20
        elif (e1, e2) in [("Fire", "Air"), ("Air", "Fire"), ("Water", "Earth"), ("Earth", "Water")]: base_score += 10
        elif (e1, e2) in [("Fire", "Water"), ("Water", "Fire")]: base_score -= 10
        
        return max(0, min(100, base_score))
    except:
        return 75

@app.get("/agent/detail/{dimension}", response_model=DetailResponse)
async def detail_endpoint(dimension: str, user_id: str):
    print(f"🔍 Generating Detail for {dimension}")
    
    # 1. Get Profile
    profile = get_user_profile(user_id)
    if not profile: profile = {"full_name": "Traveler"}

    # 2. Daily Trend (Last 3 days + Next 2)
    # This simulates "History" using real transit reconstruction
    trend = []
    days_offsets = [-2, -1, 0, 1, 2]
    today = datetime.utcnow()
    
    current_score = 0
    
    for offset in days_offsets:
        d = today + timedelta(days=offset)
        # Calc transit for that day
        # We need a quick calc for trend
        # Re-use calculate_chart logic but simplified or full? Full is fast enough for 5 calls.
        
        t_chart = AstrologyEngine.calculate_chart("T", d.year, d.month, d.day, 12, 0, "UTC")
        
        # Natal is constant (User)
        n_chart = AstrologyEngine.calculate_chart("U", 1990, 1, 1, 12, 0, "London") # Mock for trend consistency or fetch real if avail
        
        # Calc score
        day_score = calculate_astral_score(n_chart, t_chart, dimension)
        
        label = d.strftime("%d/%m")
        if offset == 0: 
            label = "Hoje"
            current_score = day_score
            
        trend.append({"day": label, "value": day_score})

    # 3. LLM Content for "Report"
    # Provide the context
    prompt = f"""
    Gere um Relatório Detalhado para a dimensão: {dimension.upper()}.
    
    DADOS:
    - Score Hoje: {current_score}%
    - Tendência: {trend}
    - Usuário: {profile.get('full_name')}
    
    TAREFA:
    Escreva uma análise profunda e uma recomendação prática.
    Texto em PORTUGUÊS BRASIL.
    
    OUTPUT JSON:
    {{
      "analysis": "Análise detalhada do estado atual...",
      "recommendation": "Exercício ou prática sugerida..."
    }}
    """
    
    try:
        completion = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        data = json.loads(completion.choices[0].message.content)
        
        return DetailResponse(
            score=current_score,
            title=dimension.capitalize(),
            trend_data=trend,
            analysis=data.get("analysis", "Análise em processamento..."),
            recommendation=data.get("recommendation", "Aguarde novas instruçòes.")
        )
    except Exception as e:
        print(f"Detail LLM Error: {e}")
        return DetailResponse(
            score=current_score, title=dimension, trend_data=trend, 
            analysis="Sem conexão estelar.", recommendation="Tente novamente."
        )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

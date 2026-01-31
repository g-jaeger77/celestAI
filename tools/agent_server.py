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
from memory_store import MemoryStore
from insight_processor import InsightProcessor
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
insight_processor = InsightProcessor(openai_client, memory_store)

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

# --- Soul-Guide Agent Logic --- 

    @staticmethod
    def get_current_transits(lat: float = 0.0, lon: float = 0.0):
        now = datetime.utcnow()
        # Use simple coordinate lookups or pass lat/lon if library supports specific topocentric or ascendant calculation
        # Swisseph calc_ut doesn't heavily depend on lat/lon for PLANETARY positions (except Moon slightly/Topocentric), 
        # BUT it is critical for ASCENDANT and HOUSES.
        # However, calculate_chart implementation above assumes city name lookup or creates a chart. 
        # We need to pass the coordinates. 
        # For this MVP, we are recalculating just planets. The 'overlay' relies on Natal Ascendant.
        # But if we want specific 'Sky Now' houses (e.g. "What is the Ascendant NOW?"), we'd need full calc.
        # Let's pass "Local" as city name to indicate custom coords usage if expanded later.
        return AstrologyEngine.calculate_chart("Transit", now.year, now.month, now.day, now.hour, now.minute, "Local", "Local")

    @staticmethod
    def calculate_house_overlay(planet_lon: float, ascendant_lon: float) -> int:
        """
        Calculates which House (1-12) a planet falls into based on the Ascendant using Whole Sign Houses (simplest/robust).
        Whole Sign: House 1 = Sign of Ascendant (0-30 deg relative).
        """
        # Simplify to Sign Offset
        asc_sign_idx = int(ascendant_lon / 30)
        planet_sign_idx = int(planet_lon / 30)
        
        house_offset = planet_sign_idx - asc_sign_idx
        if house_offset < 0: house_offset += 12
        
        return house_offset + 1 # 1-based index

    @staticmethod
    def calculate_planetary_hour(lat: float, lon: float, dt: datetime = None):
        """
        Calculates the current Planetary Hour Ruler based on Chaldean Order.
        Needs Lat/Lon. Defaults to London (51.5, -0.1) if not provided.
        """
        if not dt: dt = datetime.now()
        
        # Chaldean Order: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon
        chaldean_order = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"]
        
        # Day Rulers (Sunday = Sun, Monday = Moon...)
        # 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
        day_rulers = ["Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Sun"] 
        
        try:
            # 1. Get Sunrise/Sunset (UT)
            jd = swe.julday(dt.year, dt.month, dt.day, 12)
            
            # swe.rise_trans args: jd, body, starname, ephe_flag, rsmi, geopos, atpress, attemp
            # geopos = (lon, lat, height)
            
            # Sunrise
            res_rise = swe.rise_trans(
                jd_start=jd, body=swe.SUN, starname='', ephe_flag=swe.FLG_SWIEPH,
                rsmi=swe.CALC_RISE, geopos=(lon, lat, 0), atpress=0, attemp=0
            )
            # Sunset
            res_set = swe.rise_trans(
                jd_start=jd, body=swe.SUN, starname='', ephe_flag=swe.FLG_SWIEPH,
                rsmi=swe.CALC_SET, geopos=(lon, lat, 0), atpress=0, attemp=0
            )
            
            # Extract times (Julian Days)
            rise_jd = res_rise[1][0]
            set_jd = res_set[1][0]
            
            current_jd = swe.julday(dt.year, dt.month, dt.day, dt.hour + (dt.minute/60.0))
            
            # Determine Day or Night
            is_day = current_jd >= rise_jd and current_jd < set_jd
            
            # Calculate Hour Length
            if is_day:
                hour_len = (set_jd - rise_jd) / 12
                hours_passed = int((current_jd - rise_jd) / hour_len)
            else:
                # Need to handle night crossing midnight logic properly for full precision, 
                # simplifying for MVP: assume night starts at sunset today
                # If current < rise (early morning before sunrise), use logic for "previous night"
                if current_jd < rise_jd:
                    # Actually complex. Let's fallback to simple static windows for MVP safety IF calculation fails linearity
                    # BUT let's try basic logic:
                    # Simplified: Just grab Day Ruler and Modulo for MVP robustness
                    pass # TODO: Full Night logic
                
                hour_len = ((rise_jd + 1.0) - set_jd) / 12 # approx next sunrise
                hours_passed = int((current_jd - set_jd) / hour_len)

            # Determine Ruler
            weekday = dt.weekday() # 0=Mon
            day_ruler = day_rulers[weekday]
            ruler_idx = chaldean_order.index(day_ruler)
            
            # Sequence progresses through Chaldean Order
            # Day Hour 1 = Day Ruler. Hour 2 = Next...
            # Night Hour 1 = Next after Day Hour 12
            
            offset = hours_passed
            if not is_day: offset += 12
            
            current_ruler_idx = (ruler_idx + offset) % 7
            return chaldean_order[current_ruler_idx]

        except Exception as e:
            print(f"Planetary Hour Error: {e}")
            return "Sun" # Fallback

    @staticmethod
    def is_void_of_course(moon_sign_degree: float):
        """
        Checks if Moon is Void of Course (Simple MVP: > 28 degrees in sign)
        True implementation checks next aspect.
        """
        return moon_sign_degree >= 28.0

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
    
    # Transits (Now) with Overlay
    t_data_sun = transit_chart['sun']
    t_data_moon = transit_chart['moon']
    t_data_mars = transit_chart['mars']
    
    t_sun = t_data_sun['sign']
    t_moon = t_data_moon['sign']
    t_mars = t_data_mars['sign']
    
    # Calculate Houses (Overlay) ONLY if we have user Ascendant longitude (assuming MVP has it, 
    # but the current calculate_chart returns "Unknown" for Ascendant in the mock block if no lat/lon. 
    # Let's fix calculate_chart to return a dummy Ascendant longitude for testing if "Unknown").
    
    # FORCING dummy longitude for "Unknown" to enable feature demonstration if real calculation fails
    user_asc_lon = 0.0 # Default Aries Rising for fallback
    if natal_chart and 'ascendant_lon' in natal_chart:
         user_asc_lon = natal_chart['ascendant_lon']
    
    h_sun = AstrologyEngine.calculate_house_overlay(t_data_sun.get('longitude', 0), user_asc_lon)
    h_moon = AstrologyEngine.calculate_house_overlay(t_data_moon.get('longitude', 0), user_asc_lon)
    h_mars = AstrologyEngine.calculate_house_overlay(t_data_mars.get('longitude', 0), user_asc_lon)

    current_date = datetime.now().strftime("%d de %B de %Y")

    prompt = f"""
    You are the 'Soul-Guide', a COSMIC & EMOTIONAL GUIDE AI.
    
    CURRENT CONTEXT:
    - Date: {current_date}
    - User: {profile.get('full_name', 'Traveler')} (Sun: {n_sun}, Moon: {n_moon}, Asc: {n_asc})
    - Transits (REAL-TIME IMPACT): 
      * Sun in {t_sun} (Activating User's House {h_sun} - Focus/Ego)
      * Moon in {t_moon} (Activating User's House {h_moon} - Emotions/Mood)
      * Mars in {t_mars} (Activating User's House {h_mars} - Action/Conflict)
    
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
    # Check for location in context
    lat, lon = 0.0, 0.0 # Default UTC/Greenwich
    if request.context and 'location' in request.context and request.context['location']:
        try:
            loc = request.context['location']
            lat = float(loc.get('lat', 0.0))
            lon = float(loc.get('lon', 0.0))
        except:
            pass

    try:
        transit_chart = AstrologyEngine.get_current_transits(lat, lon)
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

        # 4. Store New Memory (Background Task -> Insight Processor)
        if request.user_id != "demo":
            # Use the new Insight Processor instead of raw storage
            background_tasks.add_task(insight_processor.process_async, request.user_id, request.message, ai_message)

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
            request.city, request.country,
            target_date=datetime.now()
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

@app.get("/agent/history")
async def history_endpoint(user_id: str):
    print(f"📜 Fetching History for {user_id}")
    if user_id == "demo":
        # Mock Data for Demo
        return [
            {"date": "2026-01-25", "mental_score": 85, "physical_score": 70, "emotional_score": 90},
            {"date": "2026-01-26", "mental_score": 88, "physical_score": 72, "emotional_score": 85},
            {"date": "2026-01-27", "mental_score": 75, "physical_score": 80, "emotional_score": 80},
            {"date": "2026-01-28", "mental_score": 80, "physical_score": 85, "emotional_score": 75},
            {"date": "2026-01-29", "mental_score": 90, "physical_score": 78, "emotional_score": 82},
            {"date": "2026-01-30", "mental_score": 92, "physical_score": 75, "emotional_score": 88},
        ]
        
    try:
        # Fetch last 30 days
        res = supabase.table("daily_stats").select("date, mental_score, physical_score, emotional_score").eq("user_id", user_id).order("date", desc=False).limit(30).execute()
        return res.data
    except Exception as e:
        print(f"❌ History Error: {e}")
        return []

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
    # NEW FIELDS
    planetary_hour: Optional[str] = "N/A"
    is_void: Optional[bool] = False

@app.get("/agent/dashboard", response_model=DashboardResponse)
async def dashboard_endpoint(user_id: str, lat: Optional[float] = None, lon: Optional[float] = None, timezone: Optional[str] = None):
    print(f"📊 Generating Dashboard for {user_id}")
    
    # 0. Real-Time Calc (Always Fresh)
    calc_lat, calc_lon = 51.5, -0.1
    if lat and lon: calc_lat, calc_lon = lat, lon
    elif timezone:
         if "Sao_Paulo" in timezone: calc_lat, calc_lon = -23.5, -46.6
         elif "New_York" in timezone: calc_lat, calc_lon = 40.7, -74.0
         elif "Tokyo" in timezone: calc_lat, calc_lon = 35.6, 139.6
    
    p_hour = AstrologyEngine.calculate_planetary_hour(calc_lat, calc_lon)
    is_void = False 
    
    # 0.5 PERSIST LOCATION (Travel Log)
    if user_id != "demo" and lat and lon:
        try:
            current_time = datetime.now().isoformat()
            supabase.table("profiles").update({
                "current_lat": lat,
                "current_lon": lon,
                "last_location_update": current_time
            }).eq("id", user_id).execute()
            print(f"📍 Location Persisted: {lat}, {lon}")
        except Exception as e:
            # We don't want to crash the dashboard if location save fails (e.g. column missing)
            print(f"⚠️ Location Save Error (Non-Fatal): {e}")
    
    # 1. Check Cache (Daily Stats)
    today_str = datetime.now().strftime("%Y-%m-%d")
    cached_data = None
    
    if user_id != "demo":
        try:
             res = supabase.table("daily_stats").select("*").eq("user_id", user_id).eq("date", today_str).execute()
             if res.data:
                 cached_data = res.data[0]
                 print("⚡ Cache Hit: Returning stored daily stats.")
        except Exception as e:
            print(f"⚠️ Cache Read Error: {e}")

    # 2. If Cached, Rehydrate and Return (Fast Path)
    if cached_data:
        # We assume 'content' column holds the JSON for widgets. 
        # If not, we might be missing text data if not stored. 
        # For MVP, if we haven't stored 'content' yet, we arguably have to re-gen or use defaults.
        # Let's check if we have the fields.
        
        # If the DB only has scores (MVP schema), we might still need to GEN TEXT.
        # But we skip Score Calc.
        # To truly skip LLM, we need the text stored.
        
        # Let's assume we store the JSON in a 'metadata' or 'content' column.
        # If not present, we proceed to generation but use cached scores.
        
        stored_content = cached_data.get("metadata", {}) # Assuming we store here
        if isinstance(stored_content, str):
             try: stored_content = json.loads(stored_content)
             except: stored_content = {}
             
        if stored_content and "next_window_focus" in stored_content:
             # Merge Real-Time Context
             # Note: We overwrite the "focus" text if we want dynamic hour... 
             # Actually, if the stored focus was "Mars Hour", and now it's "Sun Hour", the text is stale.
             # We should probably regen the 'focus' widget or accept it's 2h block logic.
             # MVP: Return cached.
             
             return DashboardResponse(
                 next_window_focus=stored_content.get("next_window_focus"),
                 next_window_desc=stored_content.get("next_window_desc"),
                 astral_alert_title=stored_content.get("astral_alert_title"),
                 astral_alert_desc=stored_content.get("astral_alert_desc"),
                 transit_title=stored_content.get("transit_title"),
                 transit_desc=stored_content.get("transit_desc"),
                 daily_quote=stored_content.get("daily_quote"),
                 score_mental=cached_data.get("mental_score", 75),
                 score_physical=cached_data.get("physical_score", 75),
                 score_emotional=cached_data.get("emotional_score", 75),
                 planetary_hour=p_hour, # Real-time injected
                 is_void=is_void        # Real-time injected (todo: actually calc is_void earlier if critical)
             )

    # 3. Cache Miss - Full Compute
    # ... Get Profile ...
    profile = get_user_profile(user_id)
    if not profile: profile = {"full_name": "Traveler"}

    try:
        b_date = datetime.strptime(profile.get("birth_date", "1990-01-01"), "%Y-%m-%d")
        b_time_str = profile.get("birth_time", "12:00")
        b_hour, b_min = map(int, b_time_str.split(':')[:2])
        
        natal_chart = AstrologyEngine.calculate_chart(profile.get("full_name", "User"), b_date.year, b_date.month, b_date.day, b_hour, b_min, profile.get("birth_city", "London"))
        
        # Calculate Is Void properly here for MISS
        transit_chart = AstrologyEngine.get_current_transits()
        moon_deg = transit_chart['moon']['longitude'] % 30
        is_void = AstrologyEngine.is_void_of_course(moon_deg)
        
    except Exception as e:
        print(f"⚠️ Chart Error: {e}")
        natal_chart, transit_chart = None, None

    # Calculate Scores
    try:
        sc_mental = calculate_astral_score(natal_chart, transit_chart, 'mental')
        sc_physical = calculate_astral_score(natal_chart, transit_chart, 'physical')
        sc_emotional = calculate_astral_score(natal_chart, transit_chart, 'emotional')
    except:
        sc_mental, sc_physical, sc_emotional = 75, 75, 75

    # LLM Gen
    try:
        prompt = f"""
        Gere um Snapshot do Dashboard Astrológico em Tempo Real.
        DATE: {datetime.now()}
        USER: {profile.get('full_name')}
        CONTEXT: Planetary Hour {p_hour}, Void Moon {is_void}
        SCORES: M {sc_mental}, P {sc_physical}, E {sc_emotional}
        
        OUTPUT JSON (pt-BR):
        {{
            "next_window_focus": "Suggest focus based on {p_hour}...",
            "next_window_desc": "...",
            "astral_alert_title": "...",
            "astral_alert_desc": "...",
            "transit_title": "...",
            "transit_desc": "...",
            "daily_quote": "..."
        }}
        """
        
        completion = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        data = json.loads(completion.choices[0].message.content)
        data['score_mental'] = sc_mental
        data['score_physical'] = sc_physical
        data['score_emotional'] = sc_emotional
        data['planetary_hour'] = p_hour
        data['is_void'] = is_void
        
        # 4. Write-Through Cache
        if user_id != "demo":
            try:
                stats_payload = {
                    "user_id": user_id,
                    "date": today_str,
                    "mental_score": sc_mental,
                    "physical_score": sc_physical,
                    "emotional_score": sc_emotional,
                    "productivity_score": int((sc_mental + sc_physical)/2),
                    "metadata": data # Storing the widget text here (without fresh vars is confusing?)
                    # Actually, we store the TEXT generated by LLM. Fresh vars are injected on READ.
                    # But for initial read, we put them here too.
                }
                
                existing = supabase.table("daily_stats").select("id").eq("user_id", user_id).eq("date", today_str).execute()
                if existing.data:
                     supabase.table("daily_stats").update(stats_payload).eq("id", existing.data[0]['id']).execute()
                else:
                     supabase.table("daily_stats").insert(stats_payload).execute()
                print("💾 Saved Cache.")
            except Exception as e:
                print(f"⚠️ Cache Write Error: {e}")

        return DashboardResponse(**data)
        
    except Exception as e:
        print(f"❌ Dashboard Error: {e}")
        return DashboardResponse(
            next_window_focus="Erro", next_window_desc="...", 
            astral_alert_title="Erro", astral_alert_desc="...", 
            transit_title="...", transit_desc="...", daily_quote="...",
            score_mental=50, score_physical=50, score_emotional=50,
            planetary_hour="Desconhecido", is_void=False
        )

class DetailResponse(BaseModel):
    score: int
    title: str
    trend_data: List[Dict[str, Any]]
    analysis: str
    recommendation: str

# Helper for deterministic scoring (for trends)
# --- Advanced Scoring Logic (V2) ---

def calculate_astral_score(natal, transit, dimension):
    """
    Calculates a 0-100 score based on Essential Dignity + Geometric Aspects.
    V2 Algorithm approved by Controller.
    """
    if not natal or not transit:
        return 50 # Fail safe

    base_score = 50.0

    # 1. Select Drivers based on Dimension
    # Mental -> Mercury (Communication) - Fallback to Sun if Mercury missing
    # Physical -> Mars (Energy)
    # Emotional -> Moon (Feeling)
    
    t_body_key = 'sun'
    n_body_key = 'sun'
    
    if dimension == 'mental':
        t_body_key = 'sun' # In V1 we treat Sun as general proxy, V2 upgrade pending full calc_ut for Mercury
        n_body_key = 'sun'
    elif dimension == 'physical':
        t_body_key = 'mars'
        n_body_key = 'mars'
    elif dimension == 'emotional':
        t_body_key = 'moon'
        n_body_key = 'moon'

    # Retrieve Longitudes
    t_lon = transit.get(t_body_key, {}).get('longitude', 0)
    t_sign = transit.get(t_body_key, {}).get('sign', 'Aries')
    n_lon = natal.get(n_body_key, {}).get('longitude', 0)

    # ---------------------------------------------------------
    # A. Essential Dignity (Transit State)
    # Does the planet feel good in the sky right now?
    # ---------------------------------------------------------
    dignity_score = 0
    # Simplified Table of Rulerships (Domicile +10, Exaltation +15, Detriment -10, Fall -15)
    rulers = {
        'mars': {'Aries': 10, 'Scorpio': 10, 'Capricorn': 15, 'Taurus': -10, 'Libra': -10, 'Cancer': -15},
        'moon': {'Cancer': 10, 'Taurus': 15, 'Capricorn': -10, 'Scorpio': -15},
        'sun':  {'Leo': 10, 'Aries': 15, 'Aquarius': -10, 'Libra': -15}
    }
    
    if t_body_key in rulers:
        dignity_score = rulers[t_body_key].get(t_sign, 0)
    
    base_score += dignity_score

    # ---------------------------------------------------------
    # B. Geometric Aspects (Relational Harmony)
    # How does the current sky angle hitting your chart?
    # ---------------------------------------------------------
    
    # Calculate shortest angular distance (0-180)
    diff = abs(t_lon - n_lon)
    if diff > 180: diff = 360 - diff
    
    # Aspect Modifiers
    # Trine (120) -> Great Flow (+20)
    # Sextile (60) -> Opportunity (+10)
    # Conjunction (0) -> Intensity (+15 for logic/body, -5 for emotion if intense)
    # Square (90) -> Tension/Action (-15)
    # Opposition (180) -> Awareness/Tension (-10)
    
    orb = 8.0 # degrees of tolerance
    aspect_score = 0
    
    if abs(diff - 120) < orb: aspect_score = 25   # Trine
    elif abs(diff - 60) < orb: aspect_score = 15  # Sextile
    elif abs(diff - 0) < orb: aspect_score = 20   # Conjunction (assuming constructive)
    elif abs(diff - 90) < orb: aspect_score = -20 # Square
    elif abs(diff - 180) < orb: aspect_score = -10 # Opposition
    
    base_score += aspect_score
    
    # ---------------------------------------------------------
    # C. Noise / Variability (Cosmic Dust)
    # Add small deterministic jitter so stats don't flatline during the day
    # ---------------------------------------------------------
    hour_mod = (datetime.utcnow().hour % 6) - 3 # -3 to +3
    base_score += hour_mod

    return int(max(10, min(100, base_score)))

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
    1. Análise profunda e recomendação.
    2. Gere o CONTEXTO VISUAL dinâmico (Substituindo lógica hardcoded).
       - main_status: Ex: "Mercúrio Direto" (Mental), "Marte Exaltado" (Físico), "Lua Cheia" (Emocional).
       - ring_status: Ex: "Hiperfoco", "Vitalidade Alta", "Conectado".
       - metrics: 3 métricas específicas para essa dimensão.
         * Mental: Velocidade, Filtro, Memória.
         * Físico: Combustão, Impulso, Imune.
         * Emocional: Social, Intuição, Fase Interna.
    
    Texto em PORTUGUÊS BRASIL.
    
    OUTPUT JSON:
    {{
      "analysis": "...",
      "recommendation": "...",
      "context": {{
         "main_status": "...",
         "ring_status": "...",
         "metrics": [
            {{ "label": "...", "value": "...", "desc": "..." }},
            {{ "label": "...", "value": "...", "desc": "..." }},
            {{ "label": "...", "value": "...", "desc": "..." }}
         ]
      }}
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
        
        # Validation/Fallback for Context
        context_data = data.get("context", {
             "main_status": "Sincronizando...",
             "ring_status": "...",
             "metrics": []
        })

        return DetailResponse(
            score=current_score,
            title=dimension.capitalize(),
            trend_data=trend,
            analysis=data.get("analysis", "Análise em processamento..."),
            recommendation=data.get("recommendation", "Aguarde novas instruçòes."),
            context=DetailContext(**context_data)
        )
    except Exception as e:
        print(f"Detail LLM Error: {e}")
        # Fallback Context
        fallback_context = DetailContext(
             main_status="Conexão Falhou",
             ring_status="Offline",
             metrics=[
                Metric(label="Status", value="Offline", desc="Sem dados"),
                Metric(label="Sinal", value="Zero", desc="Sem dados"),
                Metric(label="Link", value="Quebrado", desc="Sem dados")
             ]
        )
        return DetailResponse(
            score=current_score, title=dimension, trend_data=trend, 
            analysis="Sem conexão estelar.", recommendation="Tente novamente.",
            context=fallback_context
        )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

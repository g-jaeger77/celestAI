import asyncio
import uuid
import json
import agent_server
from agent_server import chat_endpoint, ChatRequest, memory_store, AstrologyEngine

# --- 1. MOCK DAILY LIMIT ---
agent_server.check_daily_limit = lambda user_id: True

# --- 2. MOCK BACKGROUND TASKS ---
class MockBackgroundTasks:
    def add_task(self, func, *args, **kwargs):
        pass # Do nothing (we don't need to store new memories for this test)

# --- 3. MOCK ASTROLOGY ENGINE ---
def mock_get_current_transits(lat=0.0, lon=0.0):
    return {
        "sun": {"sign": "Pisces", "house": 9, "longitude": 345.0},
        "moon": {"sign": "Scorpio", "house": 5, "longitude": 220.0},
        "mars": {"sign": "Capricorn", "house": 7, "longitude": 280.0},
        "mercury": {"sign": "Pisces", "house": 9, "longitude": 350.0} # Direct
    }
def mock_calculate_chart(*args, **kwargs):
    return {
        "sun": {"sign": "Aries", "house": 1, "longitude": 10.0},
        "moon": {"sign": "Taurus", "house": 2, "longitude": 40.0},
        "mars": {"sign": "Leo", "house": 5, "longitude": 130.0},
        "ascendant": "Cancer", "ascendant_lon": 100.0
    }
AstrologyEngine.get_current_transits = mock_get_current_transits
AstrologyEngine.calculate_chart = mock_calculate_chart

# --- 4. MOCK MEMORY STORE (RAG) ---
# We mock the method that retrieves memories
class MockMemoryStore:
    def recall_memories(self, user_id, query, limit=3):
        print(f"🧠 [MockRetrieve] Searching for: '{query}'")
        if "semana passada" in query.lower() or "conversamos" in query.lower():
            # Return our "seeded" memory
            return [{"content": "User sentiu muita pressão do chefe sobre prazos na semana passada."}]
        return []
    
    def store_memory(self, *args, **kwargs):
        pass

# Replace real memory_store with Mock
agent_server.memory_store = MockMemoryStore()
agent_server.get_user_profile = lambda uid: {"full_name": "Test User", "birth_city": "Sao Paulo"} # Mock Profile fetch

# --- SCENARIO RUNNER ---

async def run_scenario():
    print("\n🎬 --- CENÁRIO: TESTE DE LÓGICA (MOCKED DB) ---")
    user_id = "mock_user_123"

    # 1. STEP 1: Current Anxiety
    print("\n🗣️ 1. User: 'Hoje estou me sentindo muito ansioso com meu trabalho.'")
    req1 = ChatRequest(user_id=user_id, message="Hoje estou me sentindo muito ansioso com meu trabalho.", context={"location": {"lat": -23.55, "lon": -46.63}})
    bg1 = MockBackgroundTasks() 
    
    try:
        resp1 = await chat_endpoint(req1, bg1)
        print(f"🤖 AI: {resp1.message[:150]}...")
    except Exception as e:
        print(f"❌ Erro no Step 1: {e}")

    # 2. STEP 2: Memory Recall
    print("\n🗣️ 2. User: 'Isso tem a ver com o que conversamos semana passada?'")
    req2 = ChatRequest(user_id=user_id, message="Isso tem a ver com o que conversamos semana passada?", context={"location": {"lat": -23.55, "lon": -46.63}})
    
    try:
        resp2 = await chat_endpoint(req2, bg1)
        print(f"🤖 AI: {resp2.message}")
        
        # Check output for keywords
        msg_lower = resp2.message.lower()
        if "chefe" in msg_lower or "prazos" in msg_lower or "pressão" in msg_lower:
            print("✅ RAG SUCESSO: A IA conectou com 'Pressão do Chefe'.")
        else:
            print("❌ RAG FALHA: A IA não usou a memória mockada.")
    except Exception as e:
        print(f"❌ Erro no Step 2: {e}")

    # 3. STEP 3: Astrological Grounding
    print("\n🗣️ 3. User: 'E os astros explicam isso hoje?'")
    req3 = ChatRequest(user_id=user_id, message="E os astros explicam isso hoje?", context={"location": {"lat": -23.55, "lon": -46.63}})
    
    try:
        resp3 = await chat_endpoint(req3, bg1)
        print(f"🤖 AI: {resp3.message}")
        
        if "retrógrado" in resp3.message.lower():
             print("⚠️ GROUNDING FALHA: A IA alucinou 'Retrógrado'.")
        else:
             print("✅ GROUNDING SUCESSO: Sem alucinações.")
             
    except Exception as e:
        print(f"❌ Erro no Step 3: {e}")

if __name__ == "__main__":
    asyncio.run(run_scenario())

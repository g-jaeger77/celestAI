import asyncio
from agent_server import chat_endpoint, ChatRequest, memory_store, AstrologyEngine
from datetime import datetime
import json
import uuid

import agent_server

# MOCK: Bypass daily limit check
agent_server.check_daily_limit = lambda user_id: True

# Mock Request Object
class MockRequest:
    def __init__(self, user_id, message, context=None):
        self.user_id = user_id
        self.message = message
        self.context = context or {}

# Mock BackgroundTasks
class MockBackgroundTasks:
    def add_task(self, func, *args, **kwargs):
        # Synchronous execution for test
        if asyncio.iscoroutinefunction(func):
             loop = asyncio.get_event_loop()
             loop.run_until_complete(func(*args, **kwargs))
        else:
             func(*args, **kwargs)

async def run_scenario():
    # Use a valid UUID for testing to satisfy Database constraints
    user_id = str(uuid.uuid4())
    print(f"🆔 Test User UUID: {user_id}")
    
    print("\n🎬 --- CENÁRIO: TESTE DE MEMÓRIA E GROUNDING ---")
    
    # 1. SEED MEMORY (Fake "Last Week")
    print("\n🌱 1. Plantando Memória ('Semana Passada')...")
    # We inject directly into vector store (or via store_memory with metadata)
    # Using store_memory directly
    memory_store.store_memory(user_id, "User is feeling huge pressure from their boss about deadlines.", metadata={"created_at": "2023-01-01"}) # Date doesn't matter for vector search usually, but content does.
    print("✅ Memória Injetada: 'Pressão do Chefe'.")

    # 2. STEP 1: Current Anxiety
    print("\n🗣️ 2. User: 'Hoje estou me sentindo muito ansioso com meu trabalho.'")
    req1 = ChatRequest(user_id=user_id, message="Hoje estou me sentindo muito ansioso com meu trabalho.", context={"location": {"lat": -23.55, "lon": -46.63}}) # Sao Paulo
    bg1 = MockBackgroundTasks()
    
    resp1 = await chat_endpoint(req1, bg1)
    print(f"🤖 AI: {resp1.message[:100]}...")
    
    # 3. STEP 2: Memory Recall
    print("\n🗣️ 3. User: 'Isso tem a ver com o que conversamos semana passada?'")
    req2 = ChatRequest(user_id=user_id, message="Isso tem a ver com o que conversamos semana passada?", context={"location": {"lat": -23.55, "lon": -46.63}})
    bg2 = MockBackgroundTasks()
    
    resp2 = await chat_endpoint(req2, bg2)
    print(f"🤖 AI: {resp2.message}")
    
    if "chefe" in resp2.message.lower() or "boss" in resp2.message.lower() or "pressão" in resp2.message.lower():
        print("✅ SUCESSO DE MEMÓRIA: A IA lembrou do chefe!")
    else:
        print("❌ FALHA DE MEMÓRIA: A IA não linkou com o chefe.")

    # 4. STEP 3: Astrological Grounding
    print("\n🗣️ 4. User: 'E os astros explicam isso hoje?'")
    req3 = ChatRequest(user_id=user_id, message="E os astros explicam isso hoje?", context={"location": {"lat": -23.55, "lon": -46.63}})
    bg3 = MockBackgroundTasks()
    
    resp3 = await chat_endpoint(req3, bg3)
    print(f"🤖 AI: {resp3.message}")
    
    # Verification: Check Mercury Status
    # We can ask swisseph directly via AstrologyEngine or check the text.
    print("\n🔍 VERIFICAÇÃO DE DADOS REAIS:")
    transits = AstrologyEngine.get_current_transits(-23.55, -46.63)
    # Check simple planets
    print(f"☀️ Sol Real: {transits['sun']['sign']}")
    print(f"🌑 Lua Real: {transits['moon']['sign']}")
    
    # Checking for Hallucinations
    if "retrógrado" in resp3.message.lower():
        print("⚠️ A IA mencionou 'Retrógrado'. Verifique se Mercúrio está retrógrado hoje!")
        # Implement retro check if needed in engine, but manual check is fine for this prompt.
    
if __name__ == "__main__":
    asyncio.run(run_scenario())

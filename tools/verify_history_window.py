import asyncio
import uuid
from agent_server import chat_endpoint, ChatRequest
import agent_server

# MOCK Everything to focus on History Logic
agent_server.check_daily_limit = lambda uid: True
agent_server.memory_store.recall_memories = lambda uid, q: [] # Force NO RAG to test pure Context Window
# Mock Transits with keys expected by generate_system_prompt
agent_server.AstrologyEngine.get_current_transits = lambda lat, lon: {
    "sun": {"sign": "Aries", "house": 1, "longitude": 0},
    "moon": {"sign": "Taurus", "house": 2, "longitude": 0},
    "mars": {"sign": "Gemini", "house": 3, "longitude": 0}
}
agent_server.AstrologyEngine.calculate_chart = lambda *args: {
    "sun": {"sign": "Aries", "house": 1},
    "moon": {"sign": "Taurus", "house": 2},
    "mars": {"sign": "Gemini", "house": 3},
    "ascendant": "Cancer"
}

async def run_history_test():
    print("\n🎬 --- TESTE: SLIDING WINDOW (MEMÓRIA DE CURTO PRAZO) ---")
    user_id = str(uuid.uuid4())
    
    # 1. Generate History of 10 messages (Spiritual Context to pass Guardrails)
    full_history = []
    # Ancient history (Index 0)
    full_history.append({"role": "user", "content": "My spirit animal is the Eagle."}) 
    full_history.append({"role": "assistant", "content": "The Eagle sees all."})
    
    # Filler
    for i in range(3):
        full_history.append({"role": "user", "content": "I am meditating on the void."})
        full_history.append({"role": "assistant", "content": "Embrace the silence."})

    # Recent history (Index 8, 9) - Inside Window
    full_history.append({"role": "user", "content": "I feel connected to the Moon."})
    full_history.append({"role": "assistant", "content": "The Moon guides your tides."})
    
    last_6_history = full_history[-6:]
    
    print("\n🧠 Teste 1: Memória Antiga (Deve falhar/Esquecer)")
    print(f"   Target: Eagle (Sent 10 msgs ago)")
    
    req1 = ChatRequest(
        user_id=user_id,
        message="What is my spirit animal?",
        history=last_6_history # Eagle is NOT here
    )
    
    # We need a proper Mock BackgroundTask (MockBG from previous cell or re-define if global scope issue)
    class MockBG:
        def add_task(self, *args): pass

    resp1 = await chat_endpoint(req1, MockBG())
    print(f"🤖 AI Response: {resp1.message}")
    
    if "eagle" in resp1.message.lower() or "águia" in resp1.message.lower():
        print("❌ FALHA: A IA lembrou da Águia (mas não devia, pois não enviamos).")
    else:
        print("✅ SUCESSO: A IA esqueceu a Águia (Amnésia Segura).")

    # 3. TEST 2: Ask about RECENT history (Should SUCCEED)
    print("\n🧠 Teste 2: Memória Recente (Deve funcionar)")
    print(f"   Target: Moon (Sent 2 msgs ago)")
    req2 = ChatRequest(
        user_id=user_id,
        message="What celestial body did I say I feel connected to?",
        history=last_6_history # Contains Moon
    )
    
    resp2 = await chat_endpoint(req2, MockBG())
    print(f"🤖 AI Response: {resp2.message}")
    
    if "moon" in resp2.message.lower() or "lua" in resp2.message.lower():
         print("✅ SUCESSO: A IA lembrou da Lua (Dentro da Janela).")
    else:
         print("❌ FALHA: A IA esqueceu a Lua.")

if __name__ == "__main__":
    asyncio.run(run_history_test())

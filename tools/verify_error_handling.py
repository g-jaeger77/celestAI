import asyncio
import uuid
import json
from agent_server import chat_endpoint, ChatRequest
import agent_server

# MOCK Everything 
agent_server.check_daily_limit = lambda uid: True
agent_server.memory_store.recall_memories = lambda uid, q: [] 
agent_server.AstrologyEngine.get_current_transits = lambda lat, lon: {
    "sun": {"sign": "Aries", "house": 1, "longitude": 0},
    "moon": {"sign": "Taurus", "house": 2, "longitude": 0},
    "mars": {"sign": "Gemini", "house": 0, "longitude": 0}
}
agent_server.AstrologyEngine.calculate_chart = lambda *args: {
    "sun": {"sign": "Aries", "house": 1},
    "moon": {"sign": "Taurus", "house": 2},
    "mars": {"sign": "Gemini", "house": 3},
    "ascendant": "Cancer"
}

# MOCK OPENAI to return BROKEN JSON
class MockOpenAIResponse:
    def __init__(self, content):
        self.choices = [type('obj', (object,), {'message': type('obj', (object,), {'content': content})})]
        self.usage = type('obj', (object,), {'total_tokens': 100})

class MockOpenAIClient:
    class chat:
        class completions:
            def create(*args, **kwargs):
                # Return PLAIN TEXT (Not JSON)
                return MockOpenAIResponse("Eu sou apenas um texto simples sem formato JSON. Mas a IA deve sobreviver.")

agent_server.openai_client = MockOpenAIClient()

async def run_error_test():
    print("\n🚨 --- TESTE: TRATAMENTO DE ERRO (BROKEN JSON) ---")
    user_id = str(uuid.uuid4())
    
    req = ChatRequest(user_id=user_id, message="Teste de Erro")
    
    class MockBG:
        def add_task(self, *args): pass

    try:
        print("⚡ Enviando resposta 'Quebrada' (Texto Plano)...")
        resp = await chat_endpoint(req, MockBG())
        
        print(f"🤖 Resposta da API: {resp.message}")
        
        if "simples sem formato" in resp.message:
            print("✅ SUCESSO: O Backend sobreviveu e usou o Fallback de Texto!")
        else:
            print("❌ FALHA: O Backend retornou algo inesperado.")
            
    except Exception as e:
        print(f"❌ CRASH DEU ERRO 500: {e}")

if __name__ == "__main__":
    asyncio.run(run_error_test())

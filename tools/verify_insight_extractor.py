from insight_processor import InsightProcessor
from memory_store import MemoryStore
from unittest.mock import MagicMock
import os
from openai import OpenAI
from dotenv import load_dotenv

# Mock MemoryStore to avoid writing to real Supabase during test if desired, 
# OR use real one if we want E2E. The user "Preço" implies value, let's use a mock to print what WOULD be saved.

class MockMemoryStore(MemoryStore):
    def __init__(self):
        pass
    def store_memory(self, user_id, content, metadata=None):
        print(f"✅ [MOCK DB] SAVED INSIGHT: {content} | Metadata: {metadata}")
        return True

def run_test():
    load_dotenv('.env.local')
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("❌ SKIPPING: No OpenAI Key found.")
        return

    client = OpenAI(api_key=api_key)
    mock_memory = MockMemoryStore()
    processor = InsightProcessor(client, mock_memory)

    print("\n🧠 TEST 1: NOISE (Should be ignored)")
    processor.extract_and_store("test_user", "Oi, tudo bem?", "Tudo ótimo, e você?")
    
    print("\n🧠 TEST 2: MEANINGFUL (Should be extracted)")
    processor.extract_and_store(
        "test_user", 
        "Estou muito ansioso com meu novo emprego, tenho medo de falhar.", 
        "É normal sentir medo. Mercúrio está retrógrado, o que causa confusão mental."
    )

if __name__ == "__main__":
    run_test()

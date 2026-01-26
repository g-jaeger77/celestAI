import os
from openai import OpenAI
from supabase import Client

class MemoryStore:
    def __init__(self, supabase_client: Client, openai_client: OpenAI):
        self.supabase = supabase_client
        self.openai = openai_client

    def get_embedding(self, text: str):
        text = text.replace("\n", " ")
        return self.openai.embeddings.create(input=[text], model="text-embedding-3-small").data[0].embedding

    def store_memory(self, user_id: str, content: str, metadata: dict = {}):
        try:
            vector = self.get_embedding(content)
            data = {
                "user_id": user_id,
                "content": content,
                "embedding": vector,
                "metadata": metadata
            }
            self.supabase.table("memories").insert(data).execute()
            print(f"🧠 Memory stored for {user_id}: {content[:30]}...")
            return True
        except Exception as e:
            print(f"❌ Failed to store memory: {e}")
            return False

    def recall_memories(self, user_id: str, query: str, limit: int = 3):
        try:
            query_vector = self.get_embedding(query)
            response = self.supabase.rpc(
                "match_memories",
                {
                    "query_embedding": query_vector,
                    "match_threshold": 0.5, # Adjust threshold as needed
                    "match_count": limit,
                    "p_user_id": user_id
                }
            ).execute()
            
            return response.data
        except Exception as e:
            print(f"❌ Failed to recall memories: {e}")
            return []

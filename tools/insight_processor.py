import json
from openai import OpenAI
from memory_store import MemoryStore

class InsightProcessor:
    def __init__(self, openai_client: OpenAI, memory_store: MemoryStore):
        self.openai = openai_client
        self.memory = memory_store

    def extract_and_store(self, user_id: str, user_message: str, ai_response: str):
        """
        Analyzes the interaction to extract pure psychological insights or facts.
        Stores them only if they are meaningful.
        """
        try:
            # 1. The Psychologist Prompt
            # We ask the LLM to act as a therapist taking notes.
            prompt = f"""
            ACT AS: An Expert Clinical Psychologist and Data Scientist.
            
            TASK: Analyze this interaction between a User and an AI (Soul-Guide).
            EXTRACT: New, permanent facts, psychological traits, or current emotional states.
            
            INTERACTION:
            User: "{user_message}"
            AI: "{ai_response}"
            
            RULES:
            1. IGNORE conversational noise (Greettings, small talk, "thank you", "ok").
            2. FOCUS on: 
               - Recurring patterns (e.g., "User is anxious about finance").
               - Explicit facts (e.g., "User's mother is named Maria").
               - Strong emotions (e.g., "User feels guilt").
            3. OUTPUT FORMAT: JSON with a list of "insights".
               Example: {{ "insights": ["User feels financial anxiety due to debt.", "User values autonomy."] }}
            4. IF NOTHING NEW/IMPORTANT: Return empty list [].
            
            Output ONLY valid JSON.
            """

            response = self.openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "system", "content": prompt}],
                response_format={"type": "json_object"},
                temperature=0.3 # Low temperature for factual extraction
            )
            
            data = json.loads(response.choices[0].message.content)
            insights = data.get("insights", [])
            
            # 2. Store only meaningful insights
            count = 0
            for insight in insights:
                if insight and len(insight) > 10: # Minimum length filter
                    # Store as "psych_profile" to distinguish from raw chat? 
                    # For now, just storing content is enough, the vector search will find it.
                    # We add a metadata tag.
                    self.memory.store_memory(user_id, insight, metadata={"type": "insight"})
                    count += 1
            
            if count > 0:
                print(f"🧠 InsightProcessor: Extracted {count} facts for {user_id}")
            else:
                print(f"🗑️ InsightProcessor: Interaction discarded (Noise).")
                
        except Exception as e:
            print(f"❌ InsightProcessor Error: {e}")

    async def process_async(self, user_id: str, user_message: str, ai_response: str):
        # Wrapper for BackgroundTasks (which expects a coroutine or just a func)
        # Since standard openai client is sync, we just run it. 
        # FastAPI BackgroundTasks runs sync functions in a threadpool automatically.
        self.extract_and_store(user_id, user_message, ai_response)

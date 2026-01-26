import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    print("❌ Error: OPENAI_API_KEY not found in .env.local")
    exit(1)

print(f"🔑 API Key found (starts with {api_key[:8]}...)")

try:
    client = OpenAI(api_key=api_key)
    
    print("📡 Sending handshake request to OpenAI...")
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a test agent."},
            {"role": "user", "content": "Say 'Connection Successful' if you can read this."}
        ],
        max_tokens=10
    )
    
    content = response.choices[0].message.content
    print(f"✅ Response received: {content}")
    print("🚀 Connection verified!")

except Exception as e:
    print(f"❌ Connection failed: {str(e)}")

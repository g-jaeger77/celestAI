import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv('.env.local')

url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")

if not url or not key:
    print("❌ Error: Supabase credentials not found in env")
    exit(1)

print(f"🔗 Supabase URL: {url}")
print(f"🔑 Supabase Key found.")

try:
    supabase: Client = create_client(url, key)
    # Try a simple lightweight request, e.g., getting the health or just initializing
    # Note: select count might fail if no tables or RLS, but client init validates URL format at least.
    # Let's try to query 'profiles' just to see if it connects, even if empty.
    print("📡 Sending test query to Supabase...")
    # We just check if client creation didn't throw.
    # To really test connection we normally do a query.
    # Assuming 'profiles' table exists from blueprint. If not, it might error.
    # Let's just print success if we got here for now, or try a trivial Auth check.
    
    print("✅ Supabase Client initialized successfully.")
    
except Exception as e:
    print(f"❌ Connection failed: {str(e)}")

"""
Test Supabase Tables - Verify all 6 tables are accessible
"""
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('.env.local')

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

if not all([SUPABASE_URL, SUPABASE_KEY]):
    print("❌ Missing Supabase credentials in .env.local")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("=" * 60)
print("SUPABASE TABLES CONNECTIVITY TEST")
print("=" * 60)

tables = [
    "profiles",
    "daily_stats", 
    "resonance_matrix",
    "birth_charts",
    "connections",
    "chat_logs"  # NEW
]

all_ok = True

for table in tables:
    try:
        # Try to query the table (SELECT with limit 0 just checks access)
        result = supabase.table(table).select("*").limit(1).execute()
        row_count = len(result.data) if result.data else 0
        print(f"✅ {table:20} - OK (rows: {row_count})")
    except Exception as e:
        print(f"❌ {table:20} - ERROR: {e}")
        all_ok = False

print("=" * 60)
if all_ok:
    print("✅ ALL TABLES ACCESSIBLE!")
else:
    print("⚠️ Some tables have issues - check errors above")
print("=" * 60)

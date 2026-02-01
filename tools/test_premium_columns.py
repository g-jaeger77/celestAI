"""
Test Premium Columns in Supabase profiles table
"""
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('.env.local')

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("=" * 60)
print("TESTING PREMIUM COLUMNS IN PROFILES TABLE")
print("=" * 60)

# Test 1: Query profiles with new columns
try:
    result = supabase.table("profiles").select(
        "id, full_name, status, valid_until, stripe_customer_id, premium_activated_at"
    ).limit(5).execute()
    
    print("\n✅ NEW COLUMNS ACCESSIBLE!")
    print(f"   Rows found: {len(result.data)}")
    
    if result.data:
        print("\n   Sample data:")
        for row in result.data:
            print(f"   - {row.get('full_name', 'N/A')}: status={row.get('status', 'N/A')}")
    else:
        print("   (No profiles yet)")
        
except Exception as e:
    print(f"\n❌ ERROR: {e}")

# Test 2: Verify column types
print("\n" + "=" * 60)
print("COLUMN VERIFICATION:")
print("=" * 60)

columns_expected = [
    "status",
    "valid_until", 
    "stripe_customer_id",
    "stripe_subscription_id",
    "premium_activated_at",
    "premium_deactivated_at"
]

for col in columns_expected:
    try:
        result = supabase.table("profiles").select(col).limit(1).execute()
        print(f"✅ {col:30} - EXISTS")
    except Exception as e:
        print(f"❌ {col:30} - MISSING")

print("\n" + "=" * 60)
print("TEST COMPLETE!")
print("=" * 60)

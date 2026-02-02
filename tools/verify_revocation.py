
import os
import requests
import time
from supabase import create_client
from dotenv import load_dotenv

# Load Environment from .env.local
load_dotenv('.env.local')

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("VITE_SUPABASE_SERVICE_ROLE_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Missing Supabase Credentials")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# 1. Setup Test User
import uuid
user_id = str(uuid.uuid4()) # Generate valid UUID
# user_id = "test-revocation-user-v1" # Invalid UUID format
email = "test-revocation@example.com"

# Upsert dummy user
try:
    # Check if exists
    res = supabase.table("profiles").select("*").eq("id", user_id).execute()
    if not res.data:
        # Create
        print(f"Creating test user {user_id}...")
        supabase.table("profiles").insert({
            "id": user_id,
            "full_name": "Test Revocation",
            "status": "premium",
            "valid_until": "2030-01-01T00:00:00Z",
            "stripe_payment_id": "pi_test_123"
        }).execute()
    else:
        # Reset to premium
        print(f"Resetting test user {user_id} to premium...")
        supabase.table("profiles").update({
            "status": "premium",
            "valid_until": "2030-01-01T00:00:00Z",
            "stripe_payment_id": "pi_test_123"
        }).eq("id", user_id).execute()
        
    print("✅ Test user ready and PREMIUM.")
    
except Exception as e:
    print(f"❌ Setup failed: {e}")
    exit(1)

# 2. Simulate Webhook
webhook_url = "http://localhost:8000/payments/webhook"
payload = {
    "type": "customer.subscription.deleted",
    "data": {
        "object": {
            "id": "sub_test_123",
            "payment_intent": "pi_test_123", 
            "metadata": {
                "user_id": user_id 
            }
        }
    }
}

print(f"📡 Sending Webhook to {webhook_url}...")
try:
    resp = requests.post(webhook_url, json=payload)
    print(f"Response: {resp.status_code} {resp.text}")
except Exception as e:
    print(f"❌ Webhook request failed: {e}")
    exit(1)

# 3. Verify Result
print("Thinking... (Waiting for background task)")
time.sleep(3)

print("🔍 Verifying status in Supabase...")
try:
    final_res = supabase.table("profiles").select("status, valid_until").eq("id", user_id).single().execute()
    status = final_res.data.get("status")
    print(f"Final Status: {status}")
    
    if status == "free":
        print("✅ SUCCESS: Subscription revoked successfully.")
    else:
        print(f"❌ FAILURE: Status is still {status}.")
        
except Exception as e:
    print(f"❌ Verification failed: {e}")

"""
Celest AI - Payment Routes (Stripe Integration)
One-time annual payment of R$97 for 1 year access (no recurrence)
"""
from fastapi import APIRouter, HTTPException, Request, BackgroundTasks
from pydantic import BaseModel
from datetime import datetime, timedelta
import stripe
import os
from supabase import create_client

# ============================================================
# CONFIGURATION
# ============================================================

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY") or os.getenv("SUPABASE_ANON_KEY")

# One-time price for annual access (R$97) - Celest AI - Acesso Vitalício
# Product: prod_TqHtXOKG2nP4lu
CELEST_AI_PRICE_ID = os.getenv("STRIPE_PRICE_ID", "price_1SsbK5E3DuJfO0DeiUZhSwvx")

router = APIRouter(prefix="/payments", tags=["payments"])

# ============================================================
# REQUEST MODELS
# ============================================================

class CheckoutRequest(BaseModel):
    user_id: str
    success_url: str = "http://localhost:5173/dashboard?payment=success"
    cancel_url: str = "http://localhost:5173/onboarding?payment=cancelled"

# ============================================================
# ROUTE 1: CREATE CHECKOUT SESSION (ONE-TIME PAYMENT)
# ============================================================

@router.post("/checkout")
async def create_checkout_session(request: CheckoutRequest):
    """
    Creates a Stripe Checkout Session for ONE-TIME annual payment.
    User pays R$97 once and gets 1 year of access.
    """
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe not configured. Set STRIPE_SECRET_KEY.")
    
    if not request.user_id:
        raise HTTPException(status_code=400, detail="user_id is required")
    
    try:
        # Create Stripe Checkout Session for ONE-TIME payment
        session = stripe.checkout.Session.create(
            mode="payment",  # ONE-TIME payment (not subscription)
            payment_method_types=["card"],
            line_items=[{
                "price": CELEST_AI_PRICE_ID,
                "quantity": 1
            }],
            # User identification
            client_reference_id=request.user_id,
            
            # Enable promo codes
            allow_promotion_codes=True,
            
            # Redirect URLs
            success_url=f"{request.success_url}&session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=request.cancel_url,
            
            # Metadata for tracking
            metadata={
                "user_id": request.user_id,
                "product": "celest_ai_annual",
                "access_days": "365"
            }
        )
        
        print(f"✅ Checkout session created: {session.id} for user {request.user_id}")
        
        return {
            "checkout_url": session.url,
            "session_id": session.id
        }
        
    except stripe.error.InvalidRequestError as e:
        print(f"❌ Stripe InvalidRequest: {e}")
        raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")
    except stripe.error.StripeError as e:
        print(f"❌ Stripe error: {e}")
        raise HTTPException(status_code=500, detail="Payment service unavailable")

# ============================================================
# ROUTE 2: WEBHOOK HANDLER
# ============================================================

@router.post("/webhook")
async def stripe_webhook(request: Request, background_tasks: BackgroundTasks):
    """
    Handles Stripe webhook events for one-time payments.
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    # Verify webhook signature
    if STRIPE_WEBHOOK_SECRET:
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError:
            raise HTTPException(status_code=400, detail="Invalid signature")
    else:
        # Development mode: parse without verification
        import json
        event = stripe.Event.construct_from(
            json.loads(payload), stripe.api_key
        )
    
    event_type = event.type
    data = event.data.object
    
    print(f"📨 Webhook received: {event_type}")
    
    # Handle: checkout.session.completed
    if event_type == "checkout.session.completed":
        user_id = data.get("client_reference_id") or data.get("metadata", {}).get("user_id")
        
        if user_id:
            background_tasks.add_task(
                activate_premium_status,
                user_id=user_id,
                payment_id=data.get("payment_intent")
            )
            print(f"✅ Payment completed for user: {user_id}")

    # Handle: charge.refunded or customer.subscription.deleted (Revocation)
    elif event_type in ["charge.refunded", "customer.subscription.deleted"]:
        # For charge.refunded, we need to look up the user via metadata or payment_intent
        # Note: metadata might not be directly on the charge object depending on how it was passed.
        # Ideally, we store stripe_payment_id in DB, and revoke by that ID.
        
        # Strategy: Use payment_intent ID to find user or use metadata if passed down
        payment_id = data.get("payment_intent") # For charge
        subscription_id = data.get("id") # For subscription
        
        # Try to find user_id in metadata
        user_id = data.get("metadata", {}).get("user_id")
        
        background_tasks.add_task(
            revoke_premium_status,
            user_id=user_id,
            payment_id=payment_id,
            subscription_id=subscription_id
        )
        print(f"🚫 revocation event flow triggered: {event_type}")

    return {"status": "ok"}

# ============================================================
# HELPER: ACTIVATE PREMIUM
# ============================================================

async def activate_premium_status(user_id: str, payment_id: str = None):
    """
    Activates premium status for 365 days (1 year).
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        print(f"❌ Supabase not configured")
        return
    
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Calculate expiration: 365 days from now
        valid_until = datetime.utcnow() + timedelta(days=365)
        
        # Update profiles table
        result = supabase.table("profiles").update({
            "status": "premium",
            "valid_until": valid_until.isoformat(),
            "stripe_payment_id": payment_id,
            "premium_activated_at": datetime.utcnow().isoformat()
        }).eq("id", user_id).execute()
        
        if result.data:
            print(f"✅ Premium activated for {user_id} until {valid_until.date()}")
        else:
            print(f"⚠️ User {user_id} not found")
            
    except Exception as e:
        print(f"❌ Error: {e}")

async def revoke_premium_status(user_id: str = None, payment_id: str = None, subscription_id: str = None):
    """
    Revokes premium status.
    Can attempt to find user by user_id OR by stripe_payment_id in DB.
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        print(f"❌ Supabase not configured")
        return

    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Logic: Update status to 'free'
        update_data = {
            "status": "free",
            "valid_until": None, # Clear expiration
            "premium_activated_at": None
        }
        
        query = supabase.table("profiles").update(update_data)
        
        if user_id:
            query = query.eq("id", user_id)
        elif payment_id:
            query = query.eq("stripe_payment_id", payment_id)
        # elif subscription_id:
        #    query = query.eq("stripe_subscription_id", subscription_id) # Future proofing
        else:
            print("⚠️ Cannot revoke: No identifier provided")
            return

        result = query.execute()

        if result.data:
            print(f"🚫 Premium revoked successfully.")
        else:
            print(f"⚠️ Revocation target not found/updated.")
            
    except Exception as e:
        print(f"❌ Revocation Error: {e}")

# ============================================================
# ROUTE 3: CHECK STATUS
# ============================================================

@router.get("/status/{user_id}")
async def get_subscription_status(user_id: str):
    """Returns current premium status."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        result = supabase.table("profiles").select(
            "status, valid_until"
        ).eq("id", user_id).single().execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        status = result.data.get("status", "free")
        valid_until = result.data.get("valid_until")
        
        # Check if expired
        if status == "premium" and valid_until:
            expiry = datetime.fromisoformat(valid_until.replace("Z", "+00:00"))
            if expiry < datetime.utcnow():
                status = "expired"
        
        return {
            "user_id": user_id,
            "status": status,
            "valid_until": valid_until
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

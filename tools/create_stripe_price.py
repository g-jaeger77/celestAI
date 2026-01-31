"""
Create recurring yearly price for Celest AI subscription
Uses Stripe API directly since MCP tool doesn't support recurring prices
"""
import stripe
import os
from dotenv import load_dotenv

load_dotenv('.env.local')

STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY") or os.getenv("VITE_STRIPE_SECRET_KEY")

if not STRIPE_SECRET_KEY:
    print("❌ Missing STRIPE_SECRET_KEY in .env.local")
    exit(1)

stripe.api_key = STRIPE_SECRET_KEY

# Product ID from previous step
PRODUCT_ID = "prod_TtaYVotJAvgNLO"

print("=" * 60)
print("CREATING RECURRING YEARLY PRICE FOR CELEST AI")
print("=" * 60)

try:
    # Create recurring price: R$ 97,00 / year
    price = stripe.Price.create(
        product=PRODUCT_ID,
        unit_amount=9700,  # R$ 97,00 in centavos
        currency="brl",
        recurring={
            "interval": "year",
            "interval_count": 1
        },
        nickname="Celest AI - Anual R$97"
    )
    
    print(f"✅ RECURRING PRICE CREATED!")
    print(f"   Price ID: {price.id}")
    print(f"   Amount: R$ {price.unit_amount / 100:.2f}")
    print(f"   Currency: {price.currency.upper()}")
    print(f"   Interval: {price.recurring.interval}")
    print(f"   Product: {price.product}")
    print("=" * 60)
    print(f"\n🎯 USE THIS PRICE_ID IN YOUR CODE:")
    print(f"   {price.id}")
    print("=" * 60)

except stripe.error.StripeError as e:
    print(f"❌ Stripe Error: {e}")
except Exception as e:
    print(f"❌ Error: {e}")

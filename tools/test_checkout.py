"""
Test the payment checkout endpoint
"""
import requests

url = "http://127.0.0.1:8000/payments/checkout"
payload = {"user_id": "test-user-123"}

print("Testing Stripe Payment Checkout...")
print(f"URL: {url}")
print(f"Payload: {payload}")
print("-" * 50)

try:
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")

import requests
import json

url = "http://localhost:8000/agent/onboarding"
payload = {
    "full_name": "Teste Ficticio",
    "birth_date": "1990-01-01",
    "birth_time": "12:00",
    "birth_city": "Sao Paulo"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")

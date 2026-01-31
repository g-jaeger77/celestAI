"""
Test dynamic geocoding with exotic cities worldwide.
"""
import requests
import json

url = 'http://127.0.0.1:8000/agent/synastry'

# Test with exotic cities that would never be in a static lookup
test_cities = [
    ("Blumenau", "BR"),
    ("Timbuktu", "Mali"),
    ("Reykjavik", "Iceland"),
    ("Ulaanbaatar", "Mongolia"),
    ("Ushuaia", "Argentina"),
]

print("=" * 60)
print("DYNAMIC GEOCODING TEST - ANY CITY WORLDWIDE")
print("=" * 60)

for city, country in test_cities:
    user = {
        'name': f'Pessoa de {city}',
        'date': '1990-01-01',
        'time': '06:00',
        'city': city,
        'country': country
    }
    partner = {
        'name': 'Referência SP',
        'date': '1990-01-01',
        'time': '06:00',
        'city': 'São Paulo',
        'country': 'BR'
    }
    
    try:
        res = requests.post(url, json={'user': user, 'partner': partner, 'context': 'love'}, timeout=15)
        data = res.json()
        print(f"✅ {city}, {country}: Score = {data.get('score', 'N/A')}")
    except Exception as e:
        print(f"❌ {city}, {country}: Error = {e}")

print("\n" + "=" * 60)
print("Test completed! Check server logs for geocoding output.")
print("=" * 60)

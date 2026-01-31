"""
Comprehensive test for astronomical precision:
1. Timezone/DST awareness (São Paulo Jan 1995 DST test)
2. City validation (Terra do Nunca should fail)
"""
import requests
import json

BASE_URL = 'http://127.0.0.1:8000'

print("=" * 70)
print("ASTRONOMICAL PRECISION TEST - SaaS Grade Validation")
print("=" * 70)

# Test 1: DST Awareness (São Paulo Jan 1995 was GMT-2, not GMT-3)
print("\n[TEST 1] DST AWARENESS - São Paulo, Jan 1, 1995, 06:00 local")
print("-" * 70)

user_sp_dst = {
    'name': 'Teste DST',
    'date': '1995-01-01',
    'time': '06:00',
    'city': 'São Paulo',
    'country': 'BR'
}
partner = {
    'name': 'Referência',
    'date': '1995-01-01',
    'time': '06:00',
    'city': 'London',
    'country': 'UK'
}

try:
    res = requests.post(f"{BASE_URL}/agent/synastry", json={
        'user': user_sp_dst,
        'partner': partner,
        'context': 'love'
    }, timeout=20)
    
    if res.status_code == 200:
        data = res.json()
        print(f"✅ Score: {data.get('score', 'N/A')}")
        print("   (Check server logs for timezone conversion output)")
    else:
        print(f"❌ Status {res.status_code}: {res.text[:200]}")
except Exception as e:
    print(f"❌ Request Error: {e}")

# Test 2: Invalid City Rejection (Terra do Nunca should FAIL)
print("\n[TEST 2] CITY VALIDATION - 'Terra do Nunca' should be REJECTED")
print("-" * 70)

user_invalid = {
    'name': 'Teste Inválido',
    'date': '1990-01-01',
    'time': '12:00',
    'city': 'Terra do Nunca',
    'country': 'Neverland'
}

try:
    res = requests.post(f"{BASE_URL}/agent/synastry", json={
        'user': user_invalid,
        'partner': partner,
        'context': 'love'
    }, timeout=20)
    
    if res.status_code >= 400:
        print(f"✅ CORRECTLY REJECTED with status {res.status_code}")
        print(f"   Message: {res.json().get('detail', res.text[:100])}")
    elif res.status_code == 200:
        data = res.json()
        if "erro" in str(data).lower() or "error" in str(data).lower():
            print(f"✅ Error returned in response: {data}")
        else:
            print(f"❌ INCORRECTLY ACCEPTED! Should have failed but got: {data.get('score', 'N/A')}")
    else:
        print(f"⚠️ Unexpected status {res.status_code}: {res.text[:200]}")
except Exception as e:
    print(f"❌ Request Error: {e}")

# Test 3: Valid exotic city (Timbuktu)
print("\n[TEST 3] VALID EXOTIC CITY - 'Timbuktu, Mali' should WORK")
print("-" * 70)

user_timbuktu = {
    'name': 'Teste Timbuktu',
    'date': '1990-01-01',
    'time': '12:00',
    'city': 'Timbuktu',
    'country': 'Mali'
}

try:
    res = requests.post(f"{BASE_URL}/agent/synastry", json={
        'user': user_timbuktu,
        'partner': partner,
        'context': 'love'
    }, timeout=20)
    
    if res.status_code == 200:
        data = res.json()
        print(f"✅ Score: {data.get('score', 'N/A')}")
    else:
        print(f"❌ Status {res.status_code}: {res.text[:200]}")
except Exception as e:
    print(f"❌ Request Error: {e}")

print("\n" + "=" * 70)
print("Check server terminal for 🕐 Timezone and 📍 Geocoding logs")
print("=" * 70)

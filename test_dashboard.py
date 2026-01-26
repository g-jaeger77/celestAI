import requests
import json

try:
    print("Fetching Dashboard Data...")
    res = requests.get('http://localhost:8000/agent/dashboard?user_id=demo')
    if res.status_code == 200:
        print("SUCCESS! Status 200")
        data = res.json()
        print(json.dumps(data, indent=2))
    else:
        print(f"FAILED: {res.status_code}")
        print(res.text)
except Exception as e:
    print(f"Error: {e}")

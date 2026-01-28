import requests
import json

try:
    url = "http://localhost:8000/agent/wheel"
    payload = {
        "date": "1990-01-01",
        "time": "12:00",
        "city": "London",
        "country": "GB"
    }
    print(f"Testing {url}...")
    res = requests.post(url, json=payload)
    print(f"Status: {res.status_code}")
    if res.status_code == 200:
        print("Success!")
        print(json.dumps(res.json(), indent=2))
    else:
        print("Failure")
        print(res.text)
except Exception as e:
    print(f"Error: {e}")

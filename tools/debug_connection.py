
import requests
import json
import socket

def check_port(host, port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex((host, port))
    sock.close()
    return result == 0

def test_endpoint():
    print("SEARCHING FOR ORACLE AT 127.0.0.1:8000...")
    
    if check_port("127.0.0.1", 8000):
        print("✅ Port 8000 is OPEN.")
    else:
        print("❌ Port 8000 is CLOSED. Server is NOT running.")
        return

    payload = {
        "full_name": "Test User",
        "birth_date": "2000-01-01",
        "birth_time": "12:00",
        "birth_city": "London",
        "birth_country": "GB",
        "time_unknown": False
    }

    try:
        response = requests.post("http://127.0.0.1:8000/agent/onboarding", json=payload, timeout=5)
        print(f"Server Response Code: {response.status_code}")
        print(f"Server Response Body: {response.text}")
        if response.status_code == 200:
             print("✅ Connection SUCCESS.")
        else:
             print("⚠️ Connection ERROR.")
    except Exception as e:
        print(f"❌ FETCH FAIL: {e}")

if __name__ == "__main__":
    test_endpoint()

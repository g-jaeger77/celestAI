import requests

def get_timezone_for_coords(lat: float, lon: float) -> str:
    """
    Get IANA timezone string for coordinates using lightweight API 
    (Replaces heavy TimezoneFinder library).
    Fallback to UTC on error.
    """
    try:
        url = f"https://timeapi.io/api/TimeZone/coordinate?latitude={lat}&longitude={lon}"
        print(f"Fetching: {url}")
        
        # Timeout is crucial for serverless
        resp = requests.get(url, timeout=10) # Increased timeout for local test
        if resp.status_code == 200:
            data = resp.json()
            return data.get("timeZone", "UTC")
        else:
            print(f"Error: {resp.status_code} - {resp.text}")
            
    except Exception as e:
        print(f"⚠️ Timezone API Error: {e}")
        
    return "UTC"

# Test Sao Paulo
tz_sp = get_timezone_for_coords(-23.5505, -46.6333)
print(f"Sao Paulo: {tz_sp}")

# Test New York
tz_ny = get_timezone_for_coords(40.7128, -74.0060)
print(f"New York: {tz_ny}")

import requests
import sys

# Set output to utf-8
sys.stdout.reconfigure(encoding='utf-8')

def test_nominatim(query):
    url = f"https://nominatim.openstreetmap.org/search"
    params = {
        "format": "json",
        "addressdetails": 1,
        "limit": 5,
        "q": query
    }
    headers = {
        "User-Agent": "CelestAI_Debug_Script/1.0",
        "Accept-Language": "pt-BR,pt,en"
    }
    
    print(f"Querying: {query}...")
    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        print(f"Results count: {len(data)}")
        
        for i, result in enumerate(data):
            dn = result.get('display_name', 'N/A')
            print(f"[{i+1}] {dn}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_nominatim("Blumenau")

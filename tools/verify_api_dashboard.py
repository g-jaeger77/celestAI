import json
import urllib.request

def verify_api():
    url = "http://localhost:8000/agent/dashboard?user_id=demo"
    print(f"📡 Verificando API: {url}")
    
    try:
        with urllib.request.urlopen(url) as response:
            if response.status != 200:
                print(f"❌ Erro HTTP: {response.status}")
                return
            
            data = json.loads(response.read().decode())
            print("✅ Resposta 200 OK")
            print(f"Mental: {data.get('score_mental')}")
            print(f"Physical: {data.get('score_physical')}")
            print(f"Emotional: {data.get('score_emotional')}")
            print(f"DEBUG Quote: {data.get('daily_quote')}")
                
    except Exception as e:
        print(f"❌ Erro de Conexão: {e}")

if __name__ == "__main__":
    verify_api()

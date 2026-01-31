from agent_server import AstrologyEngine, generate_system_prompt
import json

def run_test():
    print("\n🔍 --- VERIFICANDO TRANSIT OVERLAYS ---")

    # 1. Simular Mapa Natal (Ascendente em Câncer ~ 95 graus)
    # Câncer é o 4º signo. (3 * 30) = 90. Meio de Câncer = 105.
    natal_chart = {
        "sun": {"sign": "Aries", "house": "10"},
        "moon": {"sign": "Taurus", "house": "11"},
        "mars": {"sign": "Gemini", "house": "12"},
        "ascendant": "Cancer", 
        "ascendant_lon": 95.0 # Inicio de Cancer
    }
    profile = {"full_name": "Test User", "time_unknown": False}

    # 2. Simular Trânsito (Lua em Escorpião ~ 220 graus)
    # Escorpião é o 8º signo. (7 * 30) = 210. +10 = 220.
    # Distância Câncer (4) -> Escorpião (8) = 4 signos de diferença.
    # Casa esperada: Casa 5 (1=Can, 2=Leo, 3=Vir, 4=Lib, 5=Sco).
    
    transit_chart = {
        "sun": {"sign": "Pisces", "longitude": 340.0},
        "moon": {"sign": "Scorpio", "longitude": 220.0},
        "mars": {"sign": "Capricorn", "longitude": 280.0}
    }

    # 3. Gerar Prompt
    prompt = generate_system_prompt(profile, natal_chart, transit_chart)
    
    print("📜 Prompt Gerado (Trecho):")
    print("-" * 40)
    
    # Extrair e printar a parte dos Transits
    lines = prompt.split('\n')
    for line in lines:
        if "Transits" in line or "Activating" in line:
            print(line.strip())
            
    # 4. Validação Manual
    if "Moon in Scorpio" in prompt and "House 5" in prompt:
         print("\n✅ SUCESSO: Lua em Escorpião caiu corretamente na Casa 5 (para Asc em Câncer).")
    else:
         print("\n❌ FALHA: Cálculo incorreto.")
         # Debug Logic
         h_moon = AstrologyEngine.calculate_house_overlay(220.0, 95.0)
         print(f"Debug: Calc House = {h_moon} (Expected 5)")

if __name__ == "__main__":
    run_test()

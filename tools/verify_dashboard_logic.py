import sys
import os
sys.path.append(os.getcwd())

from tools.wheel_engine import WheelEngine
import json

def verify_dashboard():
    print("🔮 --- VERIFICAÇÃO DE LÓGICA DO DASHBOARD ---")
    
    # 1. Setup: Hypothetical Chart with Sun in 10th House (Noon birth)
    # 1990-01-01 at 12:00 in London usually puts Sun near MC (10th/9th)
    print("📅 Gerando Mapa de Teste: 01/01/1990 12:00 London")
    engine = WheelEngine("Tester", 1990, 1, 1, 12, 0, "London", "GB")
    
    # 2. Execute
    results = engine.generate_wheel()
    
    # 3. Analyze "Carreira" (Houses 10 & 6)
    career = next(item for item in results if item["label"] == "Carreira")
    
    print(f"\n💼 SETOR: Carreira")
    print(f"   Score: {career['score']}/100")
    print(f"   Motivos Encontrados: {json.dumps(career['reasons'], indent=2)}")
    
    # 4. Validation Criteria
    if career['score'] > 60:
        print("✅ SUCESSO: Score de Carreira reflete a posição do Sol (Meio do Céu).")
    else:
        print("⚠️ ALERTA: Score de Carreira baixo. Verifique se o Sol caiu na Casa 10 ou 9.")

    # 5. Analyze "Relacionamento" (House 7)
    relationships = next(item for item in results if item["label"] == "Relacionamento")
    print(f"\n❤️ SETOR: Relacionamento")
    print(f"   Score: {relationships['score']}/100")
    
    print("\n--- FIM DA VERIFICAÇÃO ---")

if __name__ == "__main__":
    verify_dashboard()

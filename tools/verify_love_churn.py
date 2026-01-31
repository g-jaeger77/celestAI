from wheel_engine import WheelEngine
from datetime import datetime, timedelta
import json

def run_churn_test():
    # Dados de Teste (Usuário Padrão - Capricórnio)
    name = "Tester"
    year, month, day = 1990, 1, 1
    hour, minute = 12, 00
    city, country = "Sao Paulo", "BR"

    print("\n🔮 --- INICIANDO TESTE DO 'PRODUTO SAAS' ---")
    
    # 1. HOJE
    now = datetime.now()
    engine_now = WheelEngine(name, year, month, day, hour, minute, city, country)
    # Force the engine to use NOW if not passed explicitly (though default is UTC now)
    # But explicitly passing target_date is cleaner for test
    engine_now = WheelEngine(name, year, month, day, hour, minute, city, country, target_date=now)
    
    data_now = engine_now.generate_wheel()
    love_now = next(item for item in data_now if item["label"] == "Relacionamento")
    
    # 2. FUTURO (+3 DIAS - Lua muda de signo a cada ~2.5 dias)
    future = now + timedelta(days=3)
    engine_future = WheelEngine(name, year, month, day, hour, minute, city, country, target_date=future)
    
    data_future = engine_future.generate_wheel()
    love_future = next(item for item in data_future if item["label"] == "Relacionamento")

    # 3. RELATÓRIO
    print(f"\n📅 DATA 1: {now.strftime('%d/%m/%Y')} (Hoje)")
    print(f"❤️ Score Amor: {love_now['score']}%")
    print("📝 Motivos:", json.dumps(love_now['reasons'], indent=2, ensure_ascii=False))
    
    print(f"\n" + "="*40 + "\n")
    
    print(f"📅 DATA 2: {future.strftime('%d/%m/%Y')} (+3 Dias)")
    print(f"❤️ Score Amor: {love_future['score']}%")
    print("📝 Motivos:", json.dumps(love_future['reasons'], indent=2, ensure_ascii=False))

    print(f"\n" + "="*40 + "\n")

    # 4. VEREDITO
    diff = love_future['score'] - love_now['score']
    if diff != 0:
        print(f"✅ SUCESSO! O Score mudou {diff:+d} pontos.")
        print("🚀 CONCLUSÃO: O produto é DINÂMICO (SaaS). O churn será baixo.")
    else:
        print(f"❌ FRACASSO. O Score permaneceu idêntico.")
        print("💀 CONCLUSÃO: O produto é ESTÁTICO (PDF). O churn será alto.")

if __name__ == "__main__":
    run_churn_test()

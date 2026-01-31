import sys
import os
sys.path.append(os.getcwd())
# Also add tools
sys.path.append(os.path.join(os.getcwd(), 'tools'))

from tools.wheel_engine import WheelEngine
import json

def debug_crash():
    print("🚑 DEBUGGING CRASH...")
    
    # Instantiate Engine
    engine = WheelEngine("CrashTest", 1990, 1, 1, 12, 0, "London", "GB")
    wheel_data = engine.generate_wheel()
    
    print(f"Type of wheel_data: {type(wheel_data)}")
    print(f"First item: {wheel_data[0]}")
    print(f"Score Type: {type(wheel_data[0]['score'])}")
    
    # Simulate Agent Server Logic
    def get_s(label):
        found = next((x for x in wheel_data if x['label'] == label), None)
        if found:
            print(f"Found {label}: {found['score']} (Type: {type(found['score'])})")
            return found['score']
        return 50
        
    s1 = get_s("Relacionamento")
    s2 = get_s("Espiritualidade")
    
    print(f"s1: {s1}, s2: {s2}")
    
    try:
        avg = (s1 + s2) / 2
        print(f"Average: {avg}")
        sc_emotional = int(avg)
        print(f"Final Int: {sc_emotional}")
        print("✅ SUCCESS: Logic works locally.")
    except Exception as e:
        print(f"❌ CRASH REPRODUCED: {e}")

if __name__ == "__main__":
    debug_crash()

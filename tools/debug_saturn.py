import sys
import os
# Add 'tools' folder to sys.path
sys.path.append(os.path.join(os.getcwd(), 'tools'))

from wheel_engine import WheelEngine, LifeWheelCalculator
import json

print("🪐 --- DEBUGGING SATURN DIGNITY ---")

# 1. Generate Chart where Saturn is DEFINITELY in Capricorn
# 1990-01-01: Saturn in Capricorn
engine = WheelEngine("Tester", 1990, 1, 1, 12, 0, "London", "GB")
natal_data = engine.natal_chart

saturn = natal_data['planets']['Saturn']
print(f"Saturn Data: {json.dumps(saturn, indent=2)}")

# 2. Check Score directly via Calculator
calc = LifeWheelCalculator(natal_data, {})
score = calc._get_planet_score("Saturn", natal_data)
print(f"Calculated Score (Base 50 + Dignity): {score}")

# 3. Check Occupant Logic Logic
# Mocking a list to capture reason
reasons = []
# House 10 in this chart is usually Capricorn (or Sag, let's check)
h10_sign = natal_data['houses'][10]['sign']
print(f"House 10 Sign: {h10_sign}")

# If House 10 has Saturn, run occupants score for it
if saturn['house'] == 10:
    print("Running Occupants Score for House 10...")
    score_mod = calc._get_occupants_score(10, natal_data, reasons, "Debug")
    print(f"Score Mod: {score_mod}")
    print(f"Reasons: {reasons}")
else:
    print(f"Saturn is in House {saturn['house']}, running for that house...")
    score_mod = calc._get_occupants_score(saturn['house'], natal_data, reasons, "Debug")
    print(f"Score Mod: {score_mod}")
    print(f"Reasons: {reasons}")

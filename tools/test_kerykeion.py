from kerykeion import KrInstance
import json

k = KrInstance("Test", 1990, 1, 1, 12, 0, "London", "GB")
# Try json_api which is likely the main export
try:
    data = k.json_api(dump=False)
    print("JSON Data keys:", data.keys())
    print("Sun Data:", data.get("sun"))
except Exception as e:
    print(f"JSON Error: {e}")

# Try accessing attributes after calling methods (just in case)
# k.planets()
# print(k.__dict__.keys())

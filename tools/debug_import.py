import kerykeion
print("Dir:", dir(kerykeion))
try:
    from kerykeion import KrInstance
    print("KrInstance found")
except ImportError as e:
    print(f"KrInstance Error: {e}")

try:
    import kerykeion.kr_instance
    print("kerykeion.kr_instance found")
except ImportError as e:
    print(f"kerykeion.kr_instance Error: {e}")

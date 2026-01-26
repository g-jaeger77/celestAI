import kerykeion
print("Dir of kerykeion:", dir(kerykeion))

try:
    from kerykeion import KrInstance
    print("Found KrInstance")
except:
    print("No KrInstance")

try:
    from kerykeion import Report
    print("Found Report")
except:
    print("No Report")

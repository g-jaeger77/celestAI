import swisseph as swe
import datetime

print("1. Testing Import... Success")

year, month, day = 1990, 1, 1
hour = 12.0

try:
    print("2. Calculating Julian Day...")
    jd = swe.julday(year, month, day, hour)
    print(f"   JD: {jd}")

    print("3. Calculating Sun Position (Moshier)...")
    flags = swe.FLG_MOSEPH | swe.FLG_SPEED
    res = swe.calc_ut(jd, swe.SUN, flags)
    print(f"   Result Raw: {res}")
    
    if isinstance(res, tuple):
        print(f"   Longitude: {res[0][0]}")
    else:
        print(f"   Longitude: {res[0]}")

    print("4. Calculating Sun Position (Default)...")
    try:
        res2 = swe.calc_ut(jd, swe.SUN)
        print(f"   Result Default: {res2}")
    except Exception as e:
        print(f"   Default Failed (Expected if no files): {e}")

except Exception as e:
    print(f"CRITICAL FAILURE: {e}")

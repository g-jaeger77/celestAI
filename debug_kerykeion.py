try:
    import swisseph as swe
    print("Swisseph imported! Version:", swe.version())
    # Test calc
    # Date to Julian
    jd = swe.julday(2000, 1, 1, 12.0)
    print("JD:", jd)
    # Calc Sun
    res = swe.calc_ut(jd, swe.SUN)
    print("Sun Pos:", res)
except Exception as e:
    print("Error:", e)

except Exception as e:
    print("Error:", e)

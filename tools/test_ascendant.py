"""
Direct test of calculate_chart with Ascendant calculation.
Tests that swe.houses() is working correctly with different cities.
"""
import sys
sys.path.insert(0, 'tools')

# Simulate the engine directly
import swisseph as swe

ZODIAC_SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

def get_sign_from_long(longitude):
    idx = int(longitude / 30)
    return ZODIAC_SIGNS[idx % 12]

def test_ascendant(city, lat, lon, year=1990, month=1, day=1, hour=6, minute=0):
    """Calculate chart with Ascendant for given location."""
    t_hour = hour + (minute / 60.0)
    jd = swe.julday(year, month, day, t_hour)
    
    # Calculate Houses (Placidus)
    try:
        cusps, ascmc = swe.houses(jd, lat, lon, b'P')
        asc_lon = ascmc[0]
        mc_lon = ascmc[1]
        asc_sign = get_sign_from_long(asc_lon)
        mc_sign = get_sign_from_long(mc_lon)
        
        print(f"\n📍 {city} ({lat:.2f}, {lon:.2f}) @ {hour:02d}:{minute:02d}")
        print(f"   Ascendant: {asc_sign} ({asc_lon:.2f}°)")
        print(f"   Midheaven: {mc_sign} ({mc_lon:.2f}°)")
        
        # Calculate Sun
        flags = swe.FLG_MOSEPH | swe.FLG_SPEED
        res = swe.calc_ut(jd, swe.SUN, flags)
        sun_lon = res[0][0]
        sun_sign = get_sign_from_long(sun_lon)
        
        # Find Sun's house
        for i in range(12):
            next_i = (i + 1) % 12
            cusp_start = cusps[i]
            cusp_end = cusps[next_i]
            if cusp_start > cusp_end:
                if sun_lon >= cusp_start or sun_lon < cusp_end:
                    print(f"   Sun: {sun_sign} in House {i+1}")
                    break
            else:
                if cusp_start <= sun_lon < cusp_end:
                    print(f"   Sun: {sun_sign} in House {i+1}")
                    break
        
        return True
    except Exception as e:
        print(f"❌ Error for {city}: {e}")
        return False

# Test different locations at sunrise (6 AM)
print("=" * 50)
print("ASCENDANT CALCULATION TEST")
print("=" * 50)

# São Paulo, Brazil
test_ascendant("São Paulo", -23.5505, -46.6333)

# Tokyo, Japan  
test_ascendant("Tokyo", 35.6762, 139.6503)

# London, UK
test_ascendant("London", 51.5074, -0.1278)

# New York, USA
test_ascendant("New York", 40.7128, -74.0060)

# Test different times same location
print("\n" + "=" * 50)
print("TIME VARIATION TEST (São Paulo)")
print("=" * 50)

for hour in [6, 12, 18, 0]:
    test_ascendant(f"SP @ {hour:02d}:00", -23.5505, -46.6333, hour=hour)

print("\n✅ All tests completed!")

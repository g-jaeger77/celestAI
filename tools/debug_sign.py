import ephem
import math
from datetime import datetime

ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

def get_sign(lon_rad):
    degrees = math.degrees(lon_rad) % 360
    index = int(degrees / 30)
    print(f"Rad: {lon_rad}, Deg: {degrees}, Index: {index}")
    return ZODIAC_SIGNS[index % 12]

# Test Case: May 22 1990
year, month, day = 1990, 5, 22
hour, minute = 15, 30

obs = ephem.Observer()
obs.date = datetime(year, month, day, hour, minute)
obs.lat = '51.5074' # London
obs.lon = '-0.1278'

sun = ephem.Sun()
sun.compute(obs)

print(f"Date: {year}-{month}-{day}")
print(f"Sun Longitude (rad): {sun.hlong}")
print(f"Calculated Sign: {get_sign(sun.hlong)}")

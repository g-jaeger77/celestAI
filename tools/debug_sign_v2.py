import ephem
import math
from datetime import datetime

year, month, day = 1990, 5, 22
hour, minute = 15, 30

obs = ephem.Observer()
# Ephem dates are UTC.
obs.date = datetime(year, month, day, hour, minute) 

sun = ephem.Sun()
sun.compute(obs)

# Convert to Ecliptic
ecl = ephem.Ecliptic(sun)
lon_deg = math.degrees(ecl.lon)

print(f"Date: {year}-{month}-{day}")
print(f"RA: {sun.ra}, Dec: {sun.dec}")
print(f"Ecliptic Lon (rad): {ecl.lon}")
print(f"Ecliptic Lon (deg): {lon_deg}")

# Ecliptic Logic
ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]
index = int(lon_deg / 30)
print(f"Sign: {ZODIAC_SIGNS[index % 12]}")

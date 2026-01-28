from kerykeion import AstrologicalSubject
from datetime import datetime
import json
import math

# Mapping of Planets to Dignities (Simplified)
DIGNITIES = {
    "Sun": {"domicile": ["Leo"], "exaltation": ["Aries"], "fall": ["Libra"], "detriment": ["Aquarius"]},
    "Moon": {"domicile": ["Cancer"], "exaltation": ["Taurus"], "fall": ["Scorpio"], "detriment": ["Capricorn"]},
    "Mercury": {"domicile": ["Gemini", "Virgo"], "exaltation": ["Virgo"], "fall": ["Pisces"], "detriment": ["Sagittarius", "Pisces"]},
    "Venus": {"domicile": ["Taurus", "Libra"], "exaltation": ["Pisces"], "fall": ["Virgo"], "detriment": ["Aries", "Scorpio"]},
    "Mars": {"domicile": ["Aries", "Scorpio"], "exaltation": ["Capricorn"], "fall": ["Cancer"], "detriment": ["Taurus", "Libra"]},
    "Jupiter": {"domicile": ["Sagittarius", "Pisces"], "exaltation": ["Cancer"], "fall": ["Capricorn"], "detriment": ["Gemini", "Virgo"]},
    "Saturn": {"domicile": ["Capricorn", "Aquarius"], "exaltation": ["Libra"], "fall": ["Aries"], "detriment": ["Cancer", "Leo"]},
    "Uranus": {"domicile": ["Aquarius"], "exaltation": ["Scorpio"], "fall": ["Taurus"], "detriment": ["Leo"]},
    "Neptune": {"domicile": ["Pisces"], "exaltation": ["Leo"], "fall": ["Aquarius"], "detriment": ["Virgo"]},
    "Pluto": {"domicile": ["Scorpio"], "exaltation": ["Aries"], "fall": ["Libra"], "detriment": ["Taurus"]}
}

class WheelEngine:
    def __init__(self, name, year, month, day, hour, minute, city, country="US", lat=0, lon=0):
        # Using AstrologicalSubject for v5.7.0+
        self.user = AstrologicalSubject(name, year, month, day, hour, minute, city, country)
        
        # Try to get data. Inspecting available methods if json_api fails
        try:
             # Some versions store data in attributes directly
             # We create a normalized chart dictionary
             self.chart = {}
             # Populate with basic planets
             planets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"]
             for p in planets:
                 obj = getattr(self.user, p.lower(), None) # .sun, .moon etc
                 if obj:
                     self.chart[p] = {
                         "sign": obj.sign,
                         "house": getattr(obj, 'house', 'Unknown'),
                         "name": p
                     }
                 else:
                     # Retry with dict access or other method if implemented
                     pass
             
             # Houses
             # Houses usually in .houses list or dict
             if hasattr(self.user, "houses_list"):
                 for h in self.user.houses_list:
                     # Logic to map which house has which sign?
                     # Ignoring for now, focusing on planet placement
                     pass
        except Exception as e:
            print(f"Init Error: {e}")
            self.chart = {}

    def _get_planet_score(self, planet_name):
        """Calculates a base strength score for a planet (Essential Dignity)."""
        p_data = self.chart.get(planet_name)
        if not p_data: return 50 # Neutral default
        
        sign = p_data['sign']
        score = 60 # Base
        
        dignity = DIGNITIES.get(planet_name, {})
        if sign in dignity.get("domicile", []): score += 30
        elif sign in dignity.get("exaltation", []): score += 20
        elif sign in dignity.get("fall", []): score -= 20
        elif sign in dignity.get("detriment", []): score -= 20
        
        return min(100, max(20, score))

    def _get_house_score(self, house_num_list):
        """
        Calculates score based on planets RESIDING in the house.
        """
        score_mod = 0
        nature = {
            "Sun": 5, "Moon": 2, "Mercury": 2, "Venus": 10, "Mars": -5,
            "Jupiter": 15, "Saturn": -10, "Uranus": 2, "Neptune": 0, "Pluto": -5
        }
        
        for p_key, p_val in self.chart.items():
            try:
                # Kerykeion house is often string "1", "2"...
                h_val = p_val.get('house')
                if h_val:
                    h_num = int(h_val)
                    if h_num in house_num_list:
                        n = nature.get(p_key, 0)
                        score_mod += n
            except:
                pass
                    
        return score_mod

    def calculate_sector(self, sector_name, primary_houses, rulers):
        """
        Triangulates data to score a life sector.
        """
        # 1. Ruler Strength
        ruler_scores = [self._get_planet_score(r) for r in rulers]
        ruler_avg = sum(ruler_scores) / len(ruler_scores) if ruler_scores else 50
        
        # 2. House Occupants
        occupant_mod = self._get_house_score(primary_houses)
        
        final_score = int((ruler_avg * 0.7) + 30 + occupant_mod)
        return min(100, max(20, final_score))

    def generate_wheel(self):
        # 8 Sectors Mapping
        sectors = [
            { "label": "Relacionamento", "houses": [7], "rulers": ["Venus"], "color": "#f472b6" },
            { "label": "Carreira", "houses": [10, 6], "rulers": ["Saturn", "Sun"], "color": "#fbbf24" },
            { "label": "Saúde Física", "houses": [6, 1], "rulers": ["Mars", "Mercury"], "color": "#ef4444" },
            { "label": "Saúde Mental", "houses": [3, 12], "rulers": ["Mercury", "Moon"], "color": "#60a5fa" },
            { "label": "Espiritualidade", "houses": [9, 12], "rulers": ["Jupiter", "Neptune"], "color": "#8b5cf6" },
            { "label": "Finanças", "houses": [2, 8], "rulers": ["Venus", "Jupiter"], "color": "#10b981" },
            { "label": "Lazer", "houses": [5], "rulers": ["Sun", "Venus"], "color": "#f97316" },
            { "label": "Desenv. Pessoal", "houses": [1, 9], "rulers": ["Sun", "Mars"], "color": "#14b8a6" }
        ]
        
        results = []
        for s in sectors:
            score = self.calculate_sector(s['label'], s['houses'], s['rulers'])
            results.append({
                "label": s['label'],
                "score": score,
                "fullMark": 100,
                "color": s['color']
            })
            
        return results

if __name__ == "__main__":
    try:
        # Test Run
        engine = WheelEngine("TestUser", 1990, 1, 1, 12, 0, "London", "GB")
        # print("Chart:", engine.chart) # Debug
        data = engine.generate_wheel()
        print(json.dumps(data, indent=2))
    except Exception as e:
        print(f"Error: {e}")

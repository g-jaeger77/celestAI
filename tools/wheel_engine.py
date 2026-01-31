from kerykeion import AstrologicalSubject
from datetime import datetime
import json
import math

class WheelEngine:
    """Wrapper para manter compatibilidade com o agent_server.py chamando a nova Calculadora REAL. (v2.1)"""
    def __init__(self, name, year, month, day, hour, minute, city, country="US", lat=0, lon=0, target_date=None):
        # 1. Mapa Natal (User)
        self.user = AstrologicalSubject(name, year, month, day, hour, minute, city, country)
        self.natal_chart = self._convert_to_json_structure(self.user)
        
        # 2. Mapa de Trânsito (Céu do Momento)
        if not target_date:
            target_date = datetime.utcnow()
            
        self.transit = AstrologicalSubject(
            "Transit", 
            target_date.year, target_date.month, target_date.day,
            target_date.hour, target_date.minute,
            city, country
        )
        self.transit_chart = self._convert_to_json_structure(self.transit)
        
        # Instancia a calculadora real
        self.calculator = LifeWheelCalculator(self.natal_chart, self.transit_chart)

    def _convert_to_json_structure(self, subject):
        """Converte dados do Kerykeion para dicionário estruturado com Casas e Planetas e GRAUS."""
        chart = {
            "houses": {},
            "planets": {}
        }
        
        # 1. Extrair Casas
        house_names = [
            "first_house", "second_house", "third_house", "fourth_house", 
            "fifth_house", "sixth_house", "seventh_house", "eighth_house", 
            "ninth_house", "tenth_house", "eleventh_house", "twelfth_house"
        ]
        
        for i, h_attr in enumerate(house_names):
            house_obj = getattr(subject, h_attr, None)
            if house_obj:
                chart["houses"][i+1] = {
                    "sign": house_obj.sign,
                    "abs_pos": getattr(house_obj, "abs_pos", 0) 
                }
            else:
                try:
                    h_data = subject.houses_list[i]
                    chart["houses"][i+1] = {"sign": h_data['sign'], "abs_pos": 0}
                except:
                    chart["houses"][i+1] = {"sign": "Aries", "abs_pos": 0}
        
        # 2. Extrair Planetas
        planets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"]
        
        for p in planets:
            p_obj = getattr(subject, p.lower(), None) # .sun, .moon
            if p_obj:
                chart["planets"][p] = {
                    "sign": p_obj.sign,
                    "house": getattr(p_obj, 'house', 1),
                    "abs_pos": getattr(p_obj, 'abs_pos', 0)
                }
        
        return chart

    def generate_wheel(self):
        return self.calculator.generate_wheel()


class LifeWheelCalculator:
    def __init__(self, natal_chart, transit_chart):
        self.natal = natal_chart
        self.transit = transit_chart
        
        self.SIGN_RULERS = {
            "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
            "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
            "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
        }

        self.DIGNITIES = {
            "Sun": {"Leo": 30, "Aries": 20, "Aquarius": -20, "Libra": -20},
            "Moon": {"Cancer": 30, "Taurus": 20, "Capricorn": -20, "Scorpio": -20},
            "Mercury": {"Gemini": 30, "Virgo": 35, "Sagittarius": -20, "Pisces": -20},
            "Venus": {"Taurus": 30, "Libra": 30, "Pisces": 20, "Scorpio": -20, "Aries": -20, "Virgo": -20},
            "Mars": {"Aries": 30, "Scorpio": 30, "Capricorn": 20, "Libra": -20, "Taurus": -20, "Cancer": -20},
            "Jupiter": {"Sagittarius": 30, "Pisces": 30, "Cancer": 20, "Gemini": -20, "Virgo": -20, "Capricorn": -20},
            "Saturn": {"Capricorn": 30, "Aquarius": 30, "Libra": 20, "Cancer": -20, "Leo": -20, "Aries": -20}
        }

    def _get_house_sign_natal(self, house_num):
        try:
            return self.natal['houses'][int(house_num)]['sign']
        except:
            return "Aries"

    def _normalize_sign(self, sign):
        # Map Kerykeion abbreviations to Full Names
        MAPPING = {
            "Ari": "Aries", "Tau": "Taurus", "Gem": "Gemini", "Can": "Cancer",
            "Leo": "Leo", "Vir": "Virgo", "Lib": "Libra", "Sco": "Scorpio",
            "Sag": "Sagittarius", "Cap": "Capricorn", "Aqu": "Aquarius", "Pis": "Pisces"
        }
        return MAPPING.get(sign, sign) # Return full name or original if not found

    def _get_dynamic_ruler_natal(self, house_num):
        cusp_sign = self._normalize_sign(self._get_house_sign_natal(house_num))
        return self.SIGN_RULERS.get(cusp_sign, "Mars")

    def _get_planet_score(self, planet_name, chart_source):
        if planet_name not in chart_source['planets']: return 50 
        planet_data = chart_source['planets'][planet_name]
        sign = self._normalize_sign(planet_data['sign'])
        
        score = 50
        dignity = self.DIGNITIES.get(planet_name, {}).get(sign, 0)
        return score + dignity

    def _get_occupants_score(self, house_num, chart_source, reasons_list, context_prefix):
        score_mod = 0
        benefics = ["Jupiter", "Venus", "Sun"]
        malefics = ["Saturn", "Mars", "Pluto"] 
        target_sign = self._get_house_sign_natal(house_num)
        
        for p_name, p_data in chart_source['planets'].items():
            if p_data['sign'] == target_sign:
                if p_name in benefics: 
                    score_mod += 20 
                    reasons_list.append(f"{context_prefix}: {p_name} na Casa (+20)")
                elif p_name in malefics:
                    p_score = self._get_planet_score(p_name, chart_source)
                    if p_score > 60: 
                        score_mod += 5  
                        reasons_list.append(f"{context_prefix}: {p_name} Digno (+5)")
                    else: 
                        score_mod -= 15 
                        reasons_list.append(f"{context_prefix}: {p_name} Tenso (-15)")
                else: 
                    score_mod += 5
                    reasons_list.append(f"{context_prefix}: {p_name} Neutro (+5)")
        return score_mod

    def _calculate_aspect_impact(self, house_num, reasons_list):
        impact = 0
        
        # 1. Identificar Regente Natal
        ruler_name = self._get_dynamic_ruler_natal(house_num)
        if ruler_name not in self.natal['planets']: return 0
        
        natal_ruler_pos = self.natal['planets'][ruler_name]['abs_pos']
        
        # 2. Varrer todos os planetas em Trânsito
        benefics = ["Jupiter", "Venus", "Sun"]
        malefics = ["Saturn", "Mars", "Pluto", "Uranus"] 
        
        for t_name, t_data in self.transit['planets'].items():
            transit_pos = t_data['abs_pos']
            
            # Distância angular (menor arco)
            diff = abs(transit_pos - natal_ruler_pos)
            if diff > 180: diff = 360 - diff
            
            orb = 8.0 # Orbe de tolerância
            
            # --- ASPECTOS ---
            
            # Conjunção (0°)
            if diff <= orb:
                if t_name in benefics: 
                    impact += 25
                    reasons_list.append(f"Aspecto: {t_name} Conjunção {ruler_name} (+25)")
                elif t_name in malefics: 
                    impact -= 20
                    reasons_list.append(f"Aspecto: {t_name} Conjunção {ruler_name} (-20)")
                else: 
                    impact += 5
                
            # Trígono (120°)
            elif abs(diff - 120) <= orb:
                if t_name in benefics: 
                    impact += 15
                    reasons_list.append(f"Aspecto: {t_name} Trígono {ruler_name} (+15)")
                elif t_name in malefics: 
                    impact += 5
                    reasons_list.append(f"Aspecto: {t_name} Trígono {ruler_name} (+5)")
                else: 
                    impact += 10
                    reasons_list.append(f"Aspecto: {t_name} Trígono {ruler_name} (+10)")
                
            # Quadratura (90°)
            elif abs(diff - 90) <= orb:
                if t_name in malefics: 
                    impact -= 25
                    reasons_list.append(f"Aspecto: {t_name} Quadratura {ruler_name} (-25)")
                else: 
                    impact -= 10
                    reasons_list.append(f"Aspecto: {t_name} Quadratura {ruler_name} (-10)")
            
            # Oposição (180°)
            elif abs(diff - 180) <= orb:
                impact -= 15
                reasons_list.append(f"Aspecto: {t_name} Oposição {ruler_name} (-15)")
                
        return impact

    def calculate_sector_score(self, houses):
        """
        Retorna (score, reasons_list)
        """
        reasons = []
        
        # 1. NATAL
        rulers = [self._get_dynamic_ruler_natal(h) for h in houses]
        ruler_scores = [self._get_planet_score(r, self.natal) for r in rulers]
        ruler_avg = sum(ruler_scores) / len(ruler_scores) if ruler_scores else 50
        
        # Ocupantes NATAL (FULL POWER - Removed 0.5 dampener)
        occupant_natal = sum([self._get_occupants_score(h, self.natal, reasons, "Natal") for h in houses])
        
        natal_score = (ruler_avg * 0.6) + 30 + occupant_natal
        
        # 2. TRÂNSITO (Ocupantes da Casa)
        transit_occupants = sum([self._get_occupants_score(h, self.transit, reasons, "Trânsito") for h in houses])
        
        # 3. ASPECTOS (Ao Regente da Casa)
        aspect_impact = sum([self._calculate_aspect_impact(h, reasons) for h in houses])
        
        # Final Formula: Increased Natal Weight (0.5 -> 0.6)
        final_score = (natal_score * 0.6) + (transit_occupants * 0.2) + aspect_impact + 20 
        
        return min(100, max(20, int(final_score))), list(set(reasons)) # Unique reasons

    def generate_wheel(self):
        sectors_map = [
            { "label": "Relacionamento", "houses": [7], "color": "#f472b6" },
            { "label": "Carreira", "houses": [10, 6], "color": "#fbbf24" },
            { "label": "Saúde Física", "houses": [6, 1], "color": "#ef4444" },
            { "label": "Saúde Mental", "houses": [3, 12], "color": "#60a5fa" },
            { "label": "Espiritualidade", "houses": [9, 12], "color": "#8b5cf6" },
            { "label": "Finanças", "houses": [2, 8], "color": "#10b981" },
            { "label": "Lazer", "houses": [5], "color": "#f97316" },
            { "label": "Desenv. Pessoal", "houses": [1, 9], "color": "#14b8a6" }
        ]
        
        results = []
        for s in sectors_map:
            score, reasons = self.calculate_sector_score(s['houses'])
            results.append({
                "label": s['label'],
                "score": score,
                "fullMark": 100,
                "color": s['color'],
                "reasons": reasons # NEW FIELD
            })
            
        return results

if __name__ == "__main__":
    try:
        print("Teste Metadados Explicativos:")
        engine = WheelEngine("User", 1990, 1, 1, 12, 0, "London", "GB")
        data = engine.generate_wheel()
        
        financas = [x for x in data if x['label'] == 'Finanças'][0]
        print(f"Score Finanças: {financas['score']}")
        print(f"Motivos: {json.dumps(financas['reasons'], indent=2)}")
        
    except Exception as e:
        print(f"Error: {e}")

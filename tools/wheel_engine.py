from kerykeion import AstrologicalSubject
from datetime import datetime
import json
import math

class WheelEngine:
    """Wrapper para manter compatibilidade com o agent_server.py chamando a nova Calculadora REAL."""
    def __init__(self, name, year, month, day, hour, minute, city, country="US", lat=0, lon=0, target_date=None):
        # 1. Mapa Natal (User)
        self.user = AstrologicalSubject(name, year, month, day, hour, minute, city, country)
        self.natal_chart = self._convert_to_json_structure(self.user)
        
        # 2. Mapa de Trânsito (Céu do Momento)
        # Se não for passado target_date, usa "agora"
        if not target_date:
            target_date = datetime.utcnow()
            
        # O "Transit Subject" é apenas o céu, localização idealmente deve ser a do usuário atual
        # mas para trânsito planetário (signo), a localização impacta pouco (apenas Lua muda rápido).
        # Vamos usar a mesma cidade do nascimento para simplicidade ou UTC se preferir.
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
        """Converte dados do Kerykeion para dicionário estruturado com Casas e Planetas."""
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
                chart["houses"][i+1] = {"sign": house_obj.sign}
            else:
                try:
                    h_data = subject.houses_list[i]
                    chart["houses"][i+1] = {"sign": h_data['sign']}
                except:
                    chart["houses"][i+1] = {"sign": "Aries"}
        
        # 2. Extrair Planetas
        planets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"]
        
        for p in planets:
            p_obj = getattr(subject, p.lower(), None) # .sun, .moon
            if p_obj:
                chart["planets"][p] = {
                    "sign": p_obj.sign,
                    "house": getattr(p_obj, 'house', 1)
                }
        
        return chart

    def generate_wheel(self):
        return self.calculator.generate_wheel()


class LifeWheelCalculator:
    def __init__(self, natal_chart, transit_chart):
        """
        Inicia a calculadora com o Mapa Natal E o Mapa de Trânsito.
        """
        self.natal = natal_chart
        self.transit = transit_chart
        
        # Mapeamento de Regência
        self.SIGN_RULERS = {
            "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
            "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
            "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
        }

        # Dignidades (Simplificado)
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
        """Retorna o signo da cúspide da casa NATAL."""
        try:
            return self.natal['houses'][int(house_num)]['sign']
        except:
            return "Aries"

    def _get_dynamic_ruler_natal(self, house_num):
        """Quem manda nesta casa natal?"""
        cusp_sign = self._get_house_sign_natal(house_num)
        return self.SIGN_RULERS.get(cusp_sign, "Mars")

    def _get_planet_score(self, planet_name, chart_source):
        """Calcula força do planeta (Natal ou Transito)."""
        if planet_name not in chart_source['planets']:
            return 50 
        
        planet_data = chart_source['planets'][planet_name]
        sign = planet_data['sign']
        
        score = 50
        dignity_table = self.DIGNITIES.get(planet_name, {})
        score += dignity_table.get(sign, 0)
        return score

    def _get_occupants_score(self, house_num, chart_source):
        """
        Calcula bônus/ônus por planetas nesta CASAS.
        IMPORTANTE: Se chart_source for TRANSITO, precisamos ver quais planetas de trânsito
        caem neste SIGNO DA CASA NATAL (Sobreposição).
        Se for NATAL, olhamos a casa direta.
        """
        score_mod = 0
        benefics = ["Jupiter", "Venus", "Sun"]
        malefics = ["Saturn", "Mars", "Pluto"] 
        
        target_sign_of_house = self._get_house_sign_natal(house_num)
        
        # Itera sobre planetas
        for p_name, p_data in chart_source['planets'].items():
            p_sign = p_data['sign']
            
            # Checa se o planeta está no signo desta casa (Método de Casas de Signo Inteiro ou Aproximado)
            # Para simplificar e ser robusto: Se o Signo do Planeta == Signo da Cúspide da Casa Natal
            if p_sign == target_sign_of_house:
                # Planeta está nesta casa!
                p_score = self._get_planet_score(p_name, chart_source)
                
                if p_name in benefics:
                    # Júpiter transitando na casa 2 = $$$
                    score_mod += 20 
                elif p_name in malefics:
                    if p_score > 60:
                        score_mod += 5  # Maléfico Digno = Trabalho duro
                    else:
                        score_mod -= 15 # Maléfico Ruim = Crise
                else:
                    score_mod += 5 # Neutros
        
        return score_mod

    def calculate_sector_score(self, houses):
        """
        Fórmula Mista: Natal (70%) + Trânsito (30%)
        """
        
        # --- PARTE 1: NATAL (ESSÊNCIA / POTENCIAL) ---
        rulers = [self._get_dynamic_ruler_natal(h) for h in houses]
        ruler_scores = [self._get_planet_score(r, self.natal) for r in rulers]
        ruler_avg = sum(ruler_scores) / len(ruler_scores) if ruler_scores else 50
        
        # Ocupantes NATAIS (Planetas que você nasceu com eles ali)
        occupant_natal = sum([self._get_occupants_score(h, self.natal) for h in houses]) * 0.5 # Peso menor para ocupantes natais vs regente
        
        natal_total = (ruler_avg * 0.7) + 30 + occupant_natal
        
        # --- PARTE 2: TRÂNSITOS (CLIMA ATUAL) ---
        # Quais planetas estão passando nessas casas AGORA?
        transit_impact = sum([self._get_occupants_score(h, self.transit) for h in houses])
        
        # Exemplo: Júpiter em trânsito na casa (+20) -> Impacto direto
        
        # --- FUSÃO ---
        # Base Natal + Impacto do Momento
        # Se natal for 80 e Jupiter passar (+20), vai a 100.
        # Se natal for 40 e Saturno passar (-15), vai a 25.
        
        final_score = int(natal_total + transit_impact)
        
        return min(100, max(20, final_score))

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
            score = self.calculate_sector_score(s['houses'])
            results.append({
                "label": s['label'],
                "score": score,
                "fullMark": 100,
                "color": s['color']
            })
            
        return results

if __name__ == "__main__":
    try:
        print("Teste 1: Hoje")
        engine_now = WheelEngine("User", 1990, 1, 1, 12, 0, "London", "GB")
        data_now = engine_now.generate_wheel()
        print(f"Finanças Hoje: {[x['score'] for x in data_now if x['label'] == 'Finanças'][0]}")

        print("Teste 2: Futuro (+5 anos)")
        future = datetime(2030, 1, 1)
        engine_future = WheelEngine("User", 1990, 1, 1, 12, 0, "London", "GB", target_date=future)
        data_future = engine_future.generate_wheel()
        print(f"Finanças 2030: {[x['score'] for x in data_future if x['label'] == 'Finanças'][0]}")
        
    except Exception as e:
        print(f"Error: {e}")

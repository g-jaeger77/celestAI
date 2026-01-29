from kerykeion import AstrologicalSubject
from datetime import datetime
import json
import math

class WheelEngine:
    """Wrapper para manter compatibilidade com o agent_server.py chamando a nova Calculadora REAL."""
    def __init__(self, name, year, month, day, hour, minute, city, country="US", lat=0, lon=0):
        # Gera o mapa usando Kerykeion
        self.user = AstrologicalSubject(name, year, month, day, hour, minute, city, country)
        
        # Converte o objeto Kerykeion para o formato JSON exigido pela LifeWheelCalculator
        self.natal_chart = self._convert_to_json_structure()
        
        # Instancia a calculadora real
        self.calculator = LifeWheelCalculator(self.natal_chart)

    def _convert_to_json_structure(self):
        """Converte dados do Kerykeion para dicionário estruturado com Casas e Planetas."""
        chart = {
            "houses": {},
            "planets": {}
        }
        
        # 1. Extrair Casas (Kerykeion guarda em user.houses_list ou similar, depende da versão)
        # Kerykeion v5.7+: user.first_house, user.second_house...
        # Vamos usar um fallback robusto iterando atributos
        house_names = [
            "first_house", "second_house", "third_house", "fourth_house", 
            "fifth_house", "sixth_house", "seventh_house", "eighth_house", 
            "ninth_house", "tenth_house", "eleventh_house", "twelfth_house"
        ]
        
        for i, h_attr in enumerate(house_names):
            house_obj = getattr(self.user, h_attr, None)
            if house_obj:
                chart["houses"][i+1] = {"sign": house_obj.sign}
            else:
                # Fallback se a estrutura for diferente (ex: lista)
                try:
                    h_data = self.user.houses_list[i]
                    chart["houses"][i+1] = {"sign": h_data['sign']}
                except:
                    chart["houses"][i+1] = {"sign": "Aries"} # Fallback último caso
        
        # 2. Extrair Planetas
        planets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"]
        
        for p in planets:
            p_obj = getattr(self.user, p.lower(), None) # .sun, .moon
            if p_obj:
                chart["planets"][p] = {
                    "sign": p_obj.sign,
                    "house": getattr(p_obj, 'house', 1)
                }
        
        return chart

    def generate_wheel(self):
        return self.calculator.generate_wheel()


class LifeWheelCalculator:
    def __init__(self, natal_chart):
        """
        Inicia a calculadora com o Mapa Natal Completo (JSON).
        natal_chart deve conter:
        - 'houses': {1: {'sign': 'Aries', ...}, 2: {...}}
        - 'planets': {'Sun': {'sign': 'Leo', 'house': 5, 'speed': ...}, ...}
        """
        self.chart = natal_chart
        
        # Mapeamento de Regência (Usa Regentes Tradicionais para melhor cálculo de Dignidade)
        self.SIGN_RULERS = {
            "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
            "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
            "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
        }

        # Tabela Simplificada de Pontuação Base (Dignidades)
        # 1 = Domicílio, 2 = Exaltação, -1 = Exílio, -2 = Queda
        self.DIGNITIES = {
            "Sun": {"Leo": 30, "Aries": 20, "Aquarius": -20, "Libra": -20},
            "Moon": {"Cancer": 30, "Taurus": 20, "Capricorn": -20, "Scorpio": -20},
            "Mercury": {"Gemini": 30, "Virgo": 35, "Sagittarius": -20, "Pisces": -20},
            "Venus": {"Taurus": 30, "Libra": 30, "Pisces": 20, "Scorpio": -20, "Aries": -20, "Virgo": -20},
            "Mars": {"Aries": 30, "Scorpio": 30, "Capricorn": 20, "Libra": -20, "Taurus": -20, "Cancer": -20},
            "Jupiter": {"Sagittarius": 30, "Pisces": 30, "Cancer": 20, "Gemini": -20, "Virgo": -20, "Capricorn": -20},
            "Saturn": {"Capricorn": 30, "Aquarius": 30, "Libra": 20, "Cancer": -20, "Leo": -20, "Aries": -20}
        }

    def _get_house_sign(self, house_num):
        """Retorna o signo da cúspide da casa especificada."""
        try:
            # Garante que house_num seja inteiro para buscar no dict
            return self.chart['houses'][int(house_num)]['sign']
        except (KeyError, ValueError):
            return "Aries" # Fallback seguro

    def _get_dynamic_ruler(self, house_num):
        """Descobre quem manda nesta casa baseado no signo da cúspide."""
        cusp_sign = self._get_house_sign(house_num)
        return self.SIGN_RULERS.get(cusp_sign, "Mars")

    def _get_planet_score(self, planet_name):
        """Calcula a força do planeta (Regente) no mapa."""
        if planet_name not in self.chart['planets']:
            return 50 # Planeta neutro/desconhecido
        
        planet_data = self.chart['planets'][planet_name]
        sign = planet_data['sign']
        
        # Base score (50 é neutro)
        score = 50
        
        # Aplica Dignidades
        dignity_table = self.DIGNITIES.get(planet_name, {})
        score += dignity_table.get(sign, 0)
        
        return score

    def _get_occupants_score(self, house_num):
        """Calcula bônus/ônus por planetas morando na casa."""
        score_mod = 0
        benefics = ["Jupiter", "Venus", "Sun"]
        malefics = ["Saturn", "Mars", "Pluto"] # Maléficos funcionais
        
        # Itera sobre planetas para ver quem está na casa
        for p_name, p_data in self.chart['planets'].items():
            # Converte para int para garantir match
            try:
                p_house = int(p_data.get('house', 0))
            except:
                p_house = 0
                
            if p_house == int(house_num):
                if p_name in benefics:
                    score_mod += 15
                elif p_name in malefics:
                    # Verifica se o maléfico está dignificado (ex: Saturno em Capricórnio ajuda)
                    p_score = self._get_planet_score(p_name)
                    if p_score > 60:
                        score_mod += 10 # Maléfico forte = Disciplina
                    else:
                        score_mod -= 15 # Maléfico fraco = Problema
                else:
                    score_mod += 5 # Mercúrio/Lua/Outros
        
        return score_mod

    def calculate_sector_score(self, houses):
        """
        Lógica de Triangulação Real:
        1. Identifica Regentes Reais das Casas.
        2. Calcula Força dos Regentes.
        3. Calcula Ocupantes.
        """
        # 1. Identificar Regentes Dinâmicos
        rulers = [self._get_dynamic_ruler(h) for h in houses]
        
        # 2. Calcular Força dos Regentes
        ruler_scores = [self._get_planet_score(r) for r in rulers]
        ruler_avg = sum(ruler_scores) / len(ruler_scores) if ruler_scores else 50
        
        # 3. Calcular Ocupantes das Casas
        occupant_mod = sum([self._get_occupants_score(h) for h in houses])
        
        # Fórmula Ponderada: Regente (Essência) vale 60% + Ocupantes (Circunstância) + Base
        final_score = int((ruler_avg * 0.6) + 30 + occupant_mod)
        
        # Limites (Clamp)
        return min(100, max(20, final_score))

    def generate_wheel(self):
        """Gera o JSON final para o gráfico."""
        # Definição dos Setores (Apenas quais casas compõem o setor)
        # Nota: Mantendo as cores originais da UI
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
        # Teste Rápido de Verificação
        print("Testando Engine Real...")
        engine = WheelEngine("TestUser", 1990, 1, 1, 12, 0, "London", "GB")
        data = engine.generate_wheel()
        print(json.dumps(data, indent=2))
    except Exception as e:
        print(f"Error: {e}")

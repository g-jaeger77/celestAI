import sys
import os
sys.path.append(os.path.dirname(__file__))

from agent_server import OnboardingRequest
from pydantic import ValidationError

payload = {
    "full_name": "Teste Usuario",
    "birth_date": "1977-10-15",
    "birth_time": "00:30",
    "birth_city": "Blumenau",
    "birth_country": "BR",
    "session_id": "bypass_123456789",
    "time_unknown": False
}

try:
    req = OnboardingRequest(**payload)
    print("✅ Validation PASSED locally.")
    print(req.dict())
except ValidationError as e:
    print(f"❌ Validation FAILED locally: {e}")
except Exception as e:
    print(f"❌ Unexpected Error: {e}")

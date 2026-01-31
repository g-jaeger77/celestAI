
from kerykeion import AstrologicalSubject
from datetime import datetime

try:
    # Create a dummy subject
    subject = AstrologicalSubject("Test", 1990, 1, 1, 12, 0, "London", "GB")
    
    print("--- Sun Attributes ---")
    print(dir(subject.sun))
    
    print("\n--- Sun Values ---")
    print(f"Sign: {subject.sun.sign}")
    print(f"Position: {subject.sun.position}")
    print(f"Abs Pos: {subject.sun.abs_pos}")
except Exception as e:
    print(f"Error: {e}")

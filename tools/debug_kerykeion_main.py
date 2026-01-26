try:
    from kerykeion import main
    print("Main module found")
    print(dir(main))
except ImportError:
    print("No main module")

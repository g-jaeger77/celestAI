from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add the tools directory to the python path to import agent_server
sys.path.append(os.path.join(os.path.dirname(__file__), '../tools'))

# Import the app from agent_server
# logic: agent_server.py initializes 'app'
from agent_server import app

# Vercel requires the app to be available as a variable named 'app'
# This file serves as the entry point for Vercel Serverless Functions

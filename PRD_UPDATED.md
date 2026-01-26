# Celest AI Soul-Guide - Product Requirements Document (Updated)

**Date:** 2026-01-21  
**Project:** Celest AI Soul-Guide

## 1. Product Overview
Celest AI is an AI-driven astrological Soul-Guide that provides precise, personalized, real-time cosmic and psychological insights using astronomical calculations and advanced language models, delivering therapeutic-level self-knowledge with a modern mystical user experience.

## 2. Core Goals
- **Precision:** Ensure astronomical calculation precision to the second using local libraries like kerykeion or swisseph.
- **Empathy:** Provide deep psychological interpretations with empathy and personal context via GPT-4o-mini LLM.
- **Sovereignty:** Achieve technological sovereignty by minimizing costly external astrology API use through backend calculations.
- **Experience:** Deliver a premium, immersive UI/UX that conveys modern mysticism and high perceived value through celestial aesthetics and interactive animations.

## 3. Key Features
- **Cosmic Onboarding:** Capture including birth date, time, and location, immediately computing a natal chart and generating an initial astrological profile.
- **AI Astrological Chat:** Interface providing contextual real-time guidance based on exact natal charts and current planetary transits with a caring, mystical personality.
- **Daily Dashboard:** Summarizing key planetary transits with personalized 'Astral Climate' insights highlighting focus areas, challenges, and opportunities.
- **Trends & Alignment:** Dynamic dashboard showing personal and relational (Synastry) alignment trends based on user and partner data.
- **Synastry/Resonance:** Relationship simulator calculating conflict and harmony vectors between users.
- **Backend Architecture:** Leveraging FastAPI and Python libraries for precision astrology calculations and OpenAI's GPT-4o-mini for nuanced astrological interpretation.
- **Monetization:** Stripe integration for subscription management unlocking premium features.

## 4. User Flow Summary
1.  **Onboarding:** User completes cosmic onboarding by submitting birth details, triggering natal chart calculation and profile creation.
2.  **Chat:** User enters chat interface to ask personalized astrological questions; system fetches natal chart and current transits from cache to construct enriched prompts for GPT-4o-mini.
3.  **Insights:** User views the daily dashboard to review summarized critical transits and personalized astral climate insights.
4.  **Trends:** User checks the Trends page to see daily/weekly alignment scores and partner synergy.
5.  **Subscription:** Subscription payments through Stripe are processed; premium status updates in Supabase.

## 5. Validation Criteria
- **Accuracy:** verified against reference ephemerides ensuring second-level precision.
- **Relevance:** LLM output responses are contextually relevant, empathetic, and strictly based on provided astrological data without hallucinations.
- **Performance:** System latency is effectively masked by UI animations.
- **Integrity:** User profile and chat history data integrity confirmed through Supabase consistency checks.
- **Payments:** All payment-related workflows correctly update user premium status.

## 6. Technical Stack
- **Frontend:** TypeScript, React, Vite, TailwindCSS (Celestial Theme).
- **Backend:** Python, FastAPI.
- **Database:** Supabase.
- **AI:** OpenAI GPT-4o-mini.
- **Charts:** Recharts (Energy Charts), Custom Vectors.

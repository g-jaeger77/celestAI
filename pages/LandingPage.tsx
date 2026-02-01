import React from 'react';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import SocialProof from '../components/landing/SocialProof';
import PainPoints from '../components/landing/PainPoints';
import HowItWorks from '../components/landing/HowItWorks';
import TargetAudience from '../components/landing/TargetAudience';
import Features from '../components/landing/Features';
import Pricing from '../components/landing/Pricing';
import FAQ from '../components/landing/FAQ';
import Footer from '../components/landing/Footer';
import { SEOHead } from '../components/SEOHead';

const LandingPage: React.FC = () => {
    // V4 Landing Page Implementation - Force Deploy
    return (
        <div className="relative flex flex-col w-full min-h-screen bg-background-dark text-white font-body selection:bg-primary selection:text-white">
            <SEOHead
                title="Celest AI | Seu Guia Astrológico"
                description="Descubra o poder da tecnologia estelar para autoconhecimento e evolução."
                path="/"
            />
            <Header />
            <main className="flex-grow group/design-root">
                <Hero />
                <SocialProof />
                <PainPoints />
                <HowItWorks />
                <TargetAudience />
                <Features />
                <Pricing />
                <FAQ />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;

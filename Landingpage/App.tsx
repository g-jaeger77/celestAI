import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SocialProof from './components/SocialProof';
import PainPoints from './components/PainPoints';
import HowItWorks from './components/HowItWorks';
import TargetAudience from './components/TargetAudience';
import Features from './components/Features';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="relative flex flex-col w-full min-h-screen bg-background-dark text-white">
      <Header />
      <main className="flex-grow">
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

export default App;
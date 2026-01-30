import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { SEOHead } from '../components/SEOHead';

const LandingPage: React.FC = () => {

    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleStart = () => {
        navigate('/onboarding');
    };

    return (
        <div className="min-h-screen bg-[#010409] text-white font-display overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
            <SEOHead
                title="O GPS da sua Alma"
                description="Astrologia de precisão suíça unida à inteligência artificial avançada. Descubra sua origem, entenda seu presente e navegue seu futuro."
                path="/"
            />

            {/* Background Ambient Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 blur-[120px] rounded-full opacity-50 animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-400/10 blur-[100px] rounded-full opacity-40 animate-pulse-slow delay-1000"></div>
                <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-purple-500/5 blur-[80px] rounded-full opacity-30"></div>
            </div>

            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#010409]/80 backdrop-blur-md py-4 border-b border-white/5' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="group flex items-center gap-3 cursor-pointer no-underline" onClick={handleStart}>
                        <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                            <div className="absolute inset-0 bg-[#D6582C] blur-[20px] opacity-40 group-hover:opacity-60 transition duration-500 rounded-full"></div>
                            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative w-full h-full drop-shadow-2xl">
                                <defs>
                                    <linearGradient id="copper_gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#FFCAA6" />
                                        <stop offset="40%" stopColor="#D6582C" />
                                        <stop offset="100%" stopColor="#803015" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M 85 25 L 50 5 L 10 28 V 72 L 50 95 L 85 75 V 58 L 68 68 L 50 78 L 28 65 V 35 L 50 22 L 68 32 V 25 L 85 25 Z"
                                    fill="url(#copper_gradient)"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="1"
                                />
                            </svg>
                        </div>

                        <div className="flex flex-col justify-center">
                            <span className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-white leading-none">
                                Celest<span className="font-light text-transparent bg-clip-text bg-gradient-to-r from-[#D6582C] to-[#FFCAA6]">AI</span>
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleStart}
                        className="hidden md:flex px-6 py-2 rounded-full border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/10 transition-all text-sm font-medium tracking-wide items-center gap-2"
                    >
                        LOGIN <Icon name="login" className="text-sm" />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative z-10 pt-32 pb-20 px-6 container mx-auto text-center flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in-up backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-xs font-semibold tracking-widest text-slate-300 uppercase">Vagas Limitadas para Beta</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500 animate-fade-in-up delay-100 max-w-4xl mx-auto">
                    O GPS da sua <br />
                    <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">Alma</span>
                </h1>

                <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
                    Astrologia de precisão suíça unida à inteligência artificial avançada.
                    Descubra sua origem, entenda seu presente e navegue seu futuro.
                </p>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto animate-fade-in-up delay-300">
                    <button
                        onClick={handleStart}
                        className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg tracking-tight hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
                    >
                        Fazer Mapa Astral Grátis
                        <Icon name="arrow_forward" />
                    </button>
                    <button
                        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-8 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors font-medium text-lg flex items-center justify-center"
                    >
                        Saiba Mais
                    </button>
                </div>

                {/* Floating Elements Illusion */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 opacity-20 hidden lg:block">
                    {/* Abstract lines or SVG here */}
                </div>
            </header>

            {/* Features Grid */}
            <section id="features" className="relative z-10 py-24 bg-[#010409]/50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Tecnologia Ancestral & Futuro</h2>
                        <p className="text-slate-400">Por que o Celest AI é diferente de tudo que você já viu.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon="stars"
                            title="Efemérides Suíças"
                            desc="Cálculos astronômicos com precisão de segundos, usados pela NASA e astrólogos profissionais."
                        />
                        <FeatureCard
                            icon="psychology"
                            title="Psicologia Junguiana"
                            desc="Interpretações baseadas em arquétipos profundos, focadas em autoconhecimento e não apenas previsão."
                        />
                        <FeatureCard
                            icon="auto_awesome"
                            title="IA Generativa"
                            desc="Um Oracle que conversa com você. Tire dúvidas, peça conselhos e receba guias personalizados em tempo real."
                        />
                    </div>
                </div>
            </section>

            {/* Social Proof / Stats */}
            <section className="relative z-10 py-20 border-y border-white/5 bg-gradient-to-r from-blue-900/10 to-transparent">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-around items-center gap-8 text-center">
                    <StatItem number="12k+" label="Mapas Gerados" />
                    <StatItem number="98%" label="Precisão Astronômica" />
                    <StatItem number="4.9/5" label="Satisfação dos Usuários" />
                </div>
            </section>

            {/* Pricing / Offer */}
            <section className="relative z-10 py-24 px-6 container mx-auto">
                <div className="max-w-4xl mx-auto bg-gradient-to-b from-slate-900 to-black border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                    {/* Glow Effect */}
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none"></div>

                    <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                        <div>
                            <h2 className="text-3xl font-bold mb-4 text-white">Oferta de Fundação</h2>
                            <p className="text-slate-400 mb-6">
                                Tenha acesso anual ao Celest AI Vigor durante nossa fase de lançamento.
                                Preço nunca mais será visto.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <CheckItem text="Mapa Astral Completo & Profundo" />
                                <CheckItem text="Previsões Diárias Personalizadas" />
                                <CheckItem text="Chat Ilimitado com Oracle AI" />
                                <CheckItem text="Análise de Compatibilidade (Sinastria)" />
                            </ul>
                            <div className="flex items-center gap-4">
                                <div className="text-3xl font-bold text-cyan-300">R$ 97,00 / ano</div>
                                <div className="text-sm text-slate-500 line-through">R$ 297,00</div>
                                <div className="text-xs font-bold bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">ANUAL</div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center">
                            <div className="w-full h-48 bg-white/5 rounded-xl mb-6 border border-white/5 flex items-center justify-center">
                                {/* Placeholder for App Screenshot or abstract visualization */}
                                <div className="text-center p-4">
                                    <Icon name="diamond" className="text-4xl text-cyan-400 mb-2 opacity-80 mx-auto" />
                                    <p className="text-sm text-slate-400 font-medium">Acesso Premium</p>
                                </div>
                            </div>
                            <button
                                onClick={handleStart}
                                className="w-full py-4 rounded-xl bg-cyan-400 text-black font-bold text-lg hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                            >
                                Garantir Acesso Agora
                            </button>
                            <p className="mt-4 text-xs text-slate-500 text-center">Garantia de 7 dias ou seu dinheiro de volta.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 border-t border-white/5 bg-[#010409]">
                <div className="container mx-auto px-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center opacity-60">
                    <div className="mb-4 md:mb-0">
                        <h3 className="font-bold text-lg mb-1">CELEST AI</h3>
                        <p className="text-xs text-slate-500">© 2026 Celest Technologies. Todos os direitos reservados.</p>
                    </div>
                    <div className="flex gap-6 text-sm text-slate-400">
                        <a href="#" className="hover:text-white transition-colors">Termos</a>
                        <a href="#" className="hover:text-white transition-colors">Privacidade</a>
                        <a href="#" className="hover:text-white transition-colors">Contato</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Subcomponent: Feature Card
const FeatureCard = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
    <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-400/30 hover:bg-white/10 transition-all group">
        <div className="w-12 h-12 rounded-lg bg-black/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Icon name={icon} className="text-cyan-400 text-2xl" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-200 transition-colors">{title}</h3>
        <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
    </div>
);

// Subcomponent: Stat Item
const StatItem = ({ number, label }: { number: string, label: string }) => (
    <div className="flex flex-col items-center">
        <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tighter">{number}</div>
        <div className="text-sm font-medium text-cyan-400 tracking-widest uppercase">{label}</div>
    </div>
);

// Subcomponent: Check Item
const CheckItem = ({ text }: { text: string }) => (
    <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <Icon name="check" className="text-xs text-cyan-400" />
        </div>
        <span className="text-slate-300 text-sm">{text}</span>
    </div>
);

export default LandingPage;

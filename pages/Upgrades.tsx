
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';

const Upgrades: React.FC = () => {
    const navigate = useNavigate(); // Add hook
    const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handlePurchase = (id: string) => {
        setLoadingId(id);
        // Mock Stripe Delay
        setTimeout(() => {
            setLoadingId(null);
            setPurchasedIds(prev => [...prev, id]);
            // If it's history, we could redirect immediately or let user click open
        }, 2000);
    };

    const openFeature = (id: string) => {
        if (id === 'history') navigate('/history');
    };


    const isPurchased = (id: string) => purchasedIds.includes(id);

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-32 font-sans selection:bg-amber-500/30">

            {/* Header */}
            <div className="pt-8 px-6 pb-4 flex items-center justify-between sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
                <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
                        Sexta-feira, 26 de Janeiro
                    </span>
                    <h1 className="text-3xl font-bold tracking-tight">
                        System Upgrades
                    </h1>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center border border-white/10">
                    <Icon name="rocket_launch" className="text-amber-400" />
                </div>
            </div>

            <div className="px-6 mt-6 space-y-12">

                {/* 1. HERO SECTION: THE CODEX (Upsell) */}
                <div className="relative group cursor-pointer">
                    {/* Cinematic Glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative overflow-hidden rounded-[32px] bg-[#1C1C1E] border border-white/10 shadow-2xl">
                        {/* Background / Image Placeholder */}
                        <div className="h-[420px] relative bg-gradient-to-br from-[#1a1a1a] to-black flex items-center justify-center overflow-hidden">
                            {/* Mystical Void Effect */}
                            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #d97706 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                            {/* 3D Book Mockup */}
                            <div className="relative z-10 w-48 h-64 bg-[#0a0a0a] rounded-r-xl rounded-l-sm shadow-[0_20px_50px_rgba(217,119,6,0.3)] border-r-4 border-amber-900 transform rotate-y-12 rotate-z-[-5deg] group-hover:scale-105 transition-transform duration-700">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 to-black rounded-r-xl p-6 flex flex-col justify-between border border-amber-500/20">
                                    <div className="w-8 h-8 rounded-full border border-amber-500/50 flex items-center justify-center">
                                        <Icon name="fingerprint" className="text-amber-500 text-xs" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-2xl font-serif text-amber-100/90 tracking-widest uppercase">Codex</h3>
                                        <div className="h-[1px] w-full bg-amber-500/30 my-2"></div>
                                        <span className="text-[10px] text-amber-500/60 uppercase tracking-[0.3em]">Master Blueprint</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[8px] text-amber-500/40">GEN: #8821</span>
                                    </div>
                                </div>
                                {/* Spine */}
                                <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-amber-800 to-amber-900 rounded-l-sm"></div>
                            </div>
                        </div>

                        {/* Content Overlay */}
                        <div className="p-8 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent pt-32">
                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-3 inline-block">
                                Premium Module
                            </span>
                            <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                                THE CODEX: Seu Manual de Instruções.
                            </h2>
                            <p className="text-gray-400 text-sm font-medium leading-relaxed mb-6 max-w-xs">
                                Uma análise de 60 páginas gerada exclusivamente para o seu DNA Cósmico. Carreira, Propósito e Finanças decodificados.
                            </p>

                            <button
                                onClick={() => handlePurchase('codex')}
                                disabled={isPurchased('codex')}
                                className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2
                                    ${isPurchased('codex')
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                        : 'bg-gradient-to-r from-amber-200 to-orange-500 text-black hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                            >
                                {loadingId === 'codex' ? (
                                    <Icon name="sync" className="animate-spin" />
                                ) : isPurchased('codex') ? (
                                    <>
                                        <Icon name="check_circle" className="text-lg" />
                                        <span>INSTALADO</span>
                                    </>
                                ) : (
                                    <>
                                        <span>GERAR CODEX AGORA</span>
                                        <span className="bg-black/10 px-2 py-0.5 rounded text-[10px] ml-1">R$ 97</span>
                                    </>
                                )}
                            </button>
                            <p className="text-center mt-3 text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                                {isPurchased('codex') ? "Disponível na sua Biblioteca" : "Download Imediato PDF • Acesso Vitalício"}
                            </p>
                        </div>

                        {/* CARD C: FUTURE SIGHT (Waitlist) */}
                        <div className="group bg-[#1C1C1E] p-4 rounded-3xl flex items-center gap-4 hover:bg-[#2C2C2E] transition-colors cursor-pointer border border-white/5 active:scale-[0.99]">
                            {/* Icon Box */}
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                                <Icon name="visibility" className="text-2xl text-purple-400" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-bold text-base truncate mb-1">Oráculo do Futuro</h4>
                                <p className="text-gray-500 text-xs font-medium leading-tight">
                                    Previsões de longo prazo (+6 meses). Algoritmo em fase beta.
                                </p>
                            </div>

                            {/* Button */}
                            <button
                                onClick={() => navigate('/waitlist?product=oracle')}
                                className="px-5 py-2 rounded-full text-xs font-bold transition-all min-w-[90px] flex items-center justify-center bg-white/5 text-purple-400 hover:bg-purple-500 hover:text-white border border-purple-500/30"
                            >
                                INTERESSE
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. PLUGINS DE PERFORMANCE (Order Bumps) */}
                <div>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-xl font-bold text-white">Plugins de Performance</h3>
                        <span className="text-xs text-blue-400 font-bold cursor-pointer hover:text-blue-300">Ver Todos</span>
                    </div>

                    <div className="space-y-4">
                        {/* CARD A: AUDIO */}
                        <div className="group bg-[#1C1C1E] p-4 rounded-3xl flex items-center gap-4 hover:bg-[#2C2C2E] transition-colors cursor-pointer border border-white/5 active:scale-[0.99]">
                            {/* Icon Box */}
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                                <Icon name="graphic_eq" className="text-2xl text-blue-400" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-bold text-base truncate mb-1">Neuro-Cosmic Waves™</h4>
                                <p className="text-gray-500 text-xs font-medium leading-tight">
                                    Sincronização Binaural. Áudios para foco e sono alinhados aos planetas.
                                </p>
                            </div>

                            {/* Button */}
                            <button
                                onClick={() => handlePurchase('waves')}
                                className={`px-5 py-2 rounded-full text-xs font-bold transition-all min-w-[90px] flex items-center justify-center
                                    ${isPurchased('waves')
                                        ? 'bg-white/10 text-gray-400'
                                        : 'bg-white/10 text-blue-400 hover:bg-blue-500 hover:text-white'
                                    }`}
                            >
                                {loadingId === 'waves' ? (
                                    <Icon name="sync" className="animate-spin" />
                                ) : isPurchased('waves') ? (
                                    "ABRIR"
                                ) : (
                                    "OBTER • R$ 27"
                                )}
                            </button>
                        </div>

                        {/* CARD B: KARMA */}
                        <div className="group bg-[#1C1C1E] p-4 rounded-3xl flex items-center gap-4 hover:bg-[#2C2C2E] transition-colors cursor-pointer border border-white/5 active:scale-[0.99]">
                            {/* Icon Box */}
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                                <Icon name="all_inclusive" className="text-2xl text-purple-400" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-bold text-base truncate mb-1">Karmic Debugger</h4>
                                <p className="text-gray-500 text-xs font-medium leading-tight">
                                    Relatório de Karma. Descubra padrões ocultos de vidas passadas.
                                </p>
                            </div>

                            {/* Button */}
                            <button
                                onClick={() => handlePurchase('karma')}
                                className={`px-5 py-2 rounded-full text-xs font-bold transition-all min-w-[90px] flex items-center justify-center
                                    ${isPurchased('karma')
                                        ? 'bg-white/10 text-gray-400'
                                        : 'bg-white/10 text-purple-400 hover:bg-purple-500 hover:text-white'
                                    }`}
                            >
                                {loadingId === 'karma' ? (
                                    <Icon name="sync" className="animate-spin" />
                                ) : isPurchased('karma') ? (
                                    "ABRIR"
                                ) : (
                                    "OBTER • R$ 37"
                                )}
                            </button>
                        </div>

                    </div>
                </div>

                {/* Footer Quote */}
                <div className="pt-8 pb-12 text-center opacity-40">
                    <Icon name="auto_awesome" className="text-amber-500 mb-2" />
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
                        Designed for your Evolution
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Upgrades;

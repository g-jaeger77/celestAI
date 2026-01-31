import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../components/Icon';
import { motion } from 'framer-motion';
import ErrorState from '../components/ErrorState';
import { agentApi, DetailResponse } from '../api/agent';

// Map score to context (Fallback/Visual Logic)
const getVisualContext = (score: number) => {
    let context = "Trânsito Neutro";
    let speed = "70%";
    let filter = "Médio";
    let memory = "75%";

    if (score > 80) {
        context = "Mercúrio em Conjunção";
        speed = "98%";
        filter = "Ultra";
        memory = "95%";
    } else if (score > 60) {
        context = "Mercúrio Direto";
        speed = "85%";
        filter = "Alto";
        memory = "80%";
    } else if (score > 40) {
        context = "Mercúrio Sombrio";
        speed = "50%";
        filter = "Baixo";
        memory = "60%";
    } else {
        context = "Mercúrio Retrógrado";
        speed = "30%";
        filter = "Ruído";
        memory = "40%";
    }
    return { context, speed, filter, memory };
};

export const MindDetail: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Allow pre-passing score from Dashboard for instant load (optimistic)
    const initialScore = location.state?.score;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DetailResponse | null>(null);
    const [error, setError] = useState(false);

    const fetchDetail = async () => {
        setLoading(true);
        setError(false);
        try {
            // Determine User ID
            let userId = "demo";
            try {
                const saved = localStorage.getItem('user_birth_data');
                if (saved) userId = JSON.parse(saved).user_id || "demo";
            } catch (e) { }

            const response = await agentApi.getDetail('mental', userId);
            setData(response);
        } catch (error) {
            console.error("Mind detail fetch error", error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, []);

    // Combine Data
    const displayScore = data?.score ?? initialScore ?? 0;
    const visuals = getVisualContext(displayScore);

    if (loading && !data && initialScore === undefined) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-[#32ADE6]/30 border-t-[#32ADE6] rounded-full animate-spin"></div>
                <p className="text-[#32ADE6] text-sm font-medium tracking-widest uppercase animate-pulse">Analisando Mercúrio...</p>
            </div>
        );
    }

    if (error && !data && initialScore === undefined) {
        return (
            <div className="min-h-screen bg-black flex flex-col pt-12">
                <div className="px-6 pb-4 flex justify-between items-center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center active:scale-95 transition-transform"
                    >
                        <Icon name="arrow_back" className="text-white/70" />
                    </button>
                    <h1 className="text-[21px] font-semibold tracking-tight text-cyan-400 text-center">Mente</h1>
                    <div className="w-10"></div>
                </div>
                <ErrorState onRetry={fetchDetail} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-cyan-500/30">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-[#000000]/80 backdrop-blur-md border-b border-white/5 pt-12 pb-2 px-6">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center active:scale-95 transition-transform"
                    >
                        <Icon name="arrow_back" className="text-white/70" />
                    </button>
                    {/* Title moved */}
                </div>
            </div>

            <div className="pt-16 pb-24 px-6 max-w-md mx-auto space-y-8">

                <h1 className="text-[21px] font-semibold tracking-tight text-cyan-400 text-center">Mente</h1>

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center relative"
                >
                    {/* Main Gauge */}
                    <div className="relative w-64 h-64 flex items-center justify-center">
                        {/* Outer Glow Ring - Reduced Intensity */}
                        <div className="absolute inset-0 rounded-full bg-cyan-500/5 blur-2xl animate-pulse-slow"></div>

                        {/* SVG Ring */}
                        <svg className="w-full h-full transform -rotate-90">
                            {/* Background Track */}
                            <circle
                                cx="128"
                                cy="128"
                                r="100"
                                stroke="currentColor"
                                strokeWidth="20"
                                fill="transparent"
                                className="text-white/10"
                                strokeOpacity={0.08}
                            />
                            {/* Active Value Ring - Reduced Shadow */}
                            <circle
                                cx="128"
                                cy="128"
                                r="100"
                                stroke="currentColor"
                                strokeWidth="20"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 100}
                                strokeDashoffset={2 * Math.PI * 100 * (1 - (displayScore || 0) / 100)}
                                className="text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.5)] transition-all duration-1000 ease-out"
                                strokeLinecap="round"
                            />
                        </svg>

                        {/* In-Ring Content */}
                        <div className="absolute flex flex-col items-center">
                            <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase mb-1 drop-shadow-sm">
                                {displayScore > 70 ? 'Hiperfoco' : (displayScore > 40 ? 'Ideias Leves' : 'Descanso')}
                            </span>
                            <span className="text-7xl font-light tracking-tighter text-white font-display">
                                {displayScore || '--'}
                            </span>
                            <span className="text-white/40 text-xs mt-2 uppercase tracking-widest">
                                Potencial
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Detailed Metrics Grid */}
                <div className="grid grid-cols-1 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/5"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-cyan-400`}>
                                    <Icon name="speed" className="text-lg" />
                                </div>
                                <div>
                                    <h3 className="text-white/90 text-[15px] font-bold tracking-tight">Velocidade</h3>
                                    <p className={`text-[11px] font-bold uppercase tracking-wider text-cyan-400`}>{visuals.speed}</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-[#8e8e93] text-[13px] leading-snug pl-[44px]">
                            {displayScore > 60 ? 'Processamento Rápido. Facilidade para conectar ideias.' : 'Fluxo mais lento. Exige revisão.'}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/5"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-blue-400`}>
                                    <Icon name="filter_alt" className="text-lg" />
                                </div>
                                <div>
                                    <h3 className="text-white/90 text-[15px] font-bold tracking-tight">Filtro</h3>
                                    <p className={`text-[11px] font-bold uppercase tracking-wider text-blue-400`}>{visuals.filter}</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-[#8e8e93] text-[13px] leading-snug pl-[44px]">
                            {displayScore > 60 ? 'Alta Precisão. Foco no essencial.' : 'Distrações altas. Cuidado com ruídos.'}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/5"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-indigo-400`}>
                                    <Icon name="psychology" className="text-lg" />
                                </div>
                                <div>
                                    <h3 className="text-white/90 text-[15px] font-bold tracking-tight">Memória</h3>
                                    <p className={`text-[11px] font-bold uppercase tracking-wider text-indigo-400`}>{visuals.memory}</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-[#8e8e93] text-[13px] leading-snug pl-[44px]">
                            {displayScore > 60 ? 'Retenção Alta. Ótimo para estudos.' : 'Evite sobrecarga de informações hoje.'}
                        </p>
                    </motion.div>
                </div>

                {/* Trend Chart (Visualizing Backend Trend) */}
                {data?.trend_data && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-[#1C1C1E] rounded-2xl p-6 border border-white/5"
                    >
                        <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-4 border-b border-white/5 pb-2">
                            Tendência (5 Dias)
                        </h3>
                        <div className="flex items-end justify-between h-[60px] gap-2">
                            {data.trend_data.map((t, i) => (
                                <div key={i} className="flex flex-col items-center gap-1 w-full">
                                    <div
                                        className={`w-full rounded-t-sm transition-all duration-1000 ${t.day === 'Hoje' ? 'bg-cyan-500 opacity-100' : 'bg-cyan-900 opacity-40'}`}
                                        style={{ height: `${t.value * 0.5}px` }}
                                    ></div>
                                    <span className="text-[9px] text-white/40 uppercase">{t.day}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Analysis Card */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-br from-cyan-900/20 to-blue-900/10 rounded-3xl p-6 border border-cyan-500/20 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Icon name="auto_awesome" className="text-cyan-400 text-4xl" />
                    </div>

                    <h3 className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Icon name="tips_and_updates" className="text-base" />
                        Análise Neural
                    </h3>

                    <p className="text-white/80 leading-relaxed text-[15px]">
                        {data?.analysis || 'Decodificando padrões estelares...'}
                    </p>

                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
                        <div className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/50 border border-white/5">
                            Mercúrio Retrógrado: Não
                        </div>
                        <div className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/50 border border-white/5">
                            Biorritmo: {displayScore}%
                        </div>
                    </div>
                </motion.div>

                {/* Recommendation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="bg-[#1C1C1E]/50 rounded-2xl p-6 border border-white/5"
                >
                    <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3 border-b border-white/5 pb-2">
                        Recomendação Prática
                    </h3>
                    <p className="text-white/60 text-xs leading-relaxed">
                        {data?.recommendation || "Aguardando transmissão..."}
                    </p>
                </motion.div>

            </div>
        </div>
    );
};

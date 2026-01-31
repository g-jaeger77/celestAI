import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../components/Icon';
import { motion } from 'framer-motion';
import ErrorState from '../components/ErrorState';
import { agentApi, DetailResponse } from '../api/agent';

export const MindDetail: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Optimistic Score for Ring Animation
    const initialScore = location.state?.score;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DetailResponse | null>(null);
    const [error, setError] = useState(false);

    const fetchDetail = async () => {
        setLoading(true);
        setError(false);
        try {
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

    const displayScore = data?.score ?? initialScore ?? 0;

    // Dynamic Context from Backend with Fallback
    const context = data?.context || {
        main_status: "Sincronizando...",
        ring_status: "...",
        metrics: [
            { label: "Velocidade", value: "...", desc: "Carregando..." },
            { label: "Filtro", value: "...", desc: "Carregando..." },
            { label: "Memória", value: "...", desc: "Carregando..." }
        ]
    };

    // Helper to map metric label to icon (Visual Layer only)
    const getMetricIcon = (label: string) => {
        const l = label.toLowerCase();
        if (l.includes('veloc') || l.includes('speed')) return 'speed';
        if (l.includes('filt')) return 'filter_alt';
        if (l.includes('mem') || l.includes('ram')) return 'psychology';
        return 'circle';
    };

    const getMetricColor = (index: number) => {
        if (index === 0) return 'text-cyan-400';
        if (index === 1) return 'text-blue-400';
        return 'text-indigo-400';
    };

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
                </div>
            </div>

            <div className="pt-16 pb-24 px-6 max-w-md mx-auto space-y-8">

                <h1 className="text-[21px] font-semibold tracking-tight text-cyan-400 text-center">
                    {data ? context.main_status : 'Mente'}
                </h1>

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center relative"
                >
                    {/* Main Gauge */}
                    <div className="relative w-64 h-64 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-cyan-500/5 blur-2xl animate-pulse-slow"></div>
                        <svg className="w-full h-full transform -rotate-90">
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
                                {context.ring_status}
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

                {/* Detailed Metrics Grid (Dynamic) */}
                <div className="grid grid-cols-1 gap-4">
                    {context.metrics.map((metric, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/5"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center ${getMetricColor(i)}`}>
                                        <Icon name={getMetricIcon(metric.label)} className="text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="text-white/90 text-[15px] font-bold tracking-tight">{metric.label}</h3>
                                        <p className={`text-[11px] font-bold uppercase tracking-wider ${getMetricColor(i)}`}>{metric.value}</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[#8e8e93] text-[13px] leading-snug pl-[44px]">
                                {metric.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Trend Chart */}
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
                            Status: {context.main_status}
                        </div>
                        <div className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/50 border border-white/5">
                            Score: {displayScore}%
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

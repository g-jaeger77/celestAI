import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../components/Icon';
import { motion } from 'framer-motion';
import ErrorState from '../components/ErrorState';
import { agentApi, DetailResponse } from '../api/agent';

export const EmotionalDetail: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

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

            const response = await agentApi.getDetail('emotional', userId);
            setData(response);
        } catch (error) {
            console.error("Emotional detail fetch error", error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, []);

    const displayScore = data?.score ?? initialScore ?? 0;

    const context = data?.context || {
        main_status: "Sintonizando...",
        ring_status: "...",
        metrics: [
            { label: "Social", value: "...", desc: "Carregando..." },
            { label: "Intuição", value: "...", desc: "Carregando..." },
            { label: "Fase Interna", value: "...", desc: "Carregando..." }
        ]
    };

    const getMetricIcon = (label: string) => {
        const l = label.toLowerCase();
        if (l.includes('soc')) return 'people';
        if (l.includes('intu')) return 'visibility';
        if (l.includes('fase') || l.includes('int')) return 'nightlight';
        return 'circle';
    };

    const getMetricColor = (index: number) => {
        if (index === 0) return 'text-purple-400';
        if (index === 1) return 'text-fuchsia-400';
        return 'text-pink-400';
    };

    if (loading && !data && initialScore === undefined) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-[#AF52DE]/30 border-t-[#AF52DE] rounded-full animate-spin"></div>
                <p className="text-[#AF52DE] text-sm font-medium tracking-widest uppercase animate-pulse">Sintonizando Frequências...</p>
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
                    <h1 className="text-[21px] font-semibold tracking-tight text-white/80 text-center">Alma</h1>
                    <div className="w-10"></div>
                </div>
                <ErrorState onRetry={fetchDetail} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-purple-500/30">
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

                <h1 className="text-[21px] font-semibold tracking-tight text-[#AF52DE] text-center">
                    {data ? context.main_status : 'Alma'}
                </h1>

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center relative"
                >
                    {/* Main Gauge */}
                    <div className="relative w-64 h-64 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-purple-500/5 blur-2xl animate-pulse-slow"></div>
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
                                className="text-[#AF52DE] drop-shadow-[0_0_4px_rgba(175,82,222,0.5)] transition-all duration-1000 ease-out"
                                strokeLinecap="round"
                            />
                        </svg>

                        {/* In-Ring Content */}
                        <div className="absolute flex flex-col items-center">
                            <span className="text-[#AF52DE] text-sm font-medium tracking-wider uppercase mb-1 drop-shadow-sm">
                                {context.ring_status}
                            </span>
                            <span className="text-7xl font-light tracking-tighter text-white font-display">
                                {displayScore || '--'}
                            </span>
                            <span className="text-white/40 text-xs mt-2 uppercase tracking-widest">
                                Ressonância
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Metrics Grid */}
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
                                        className={`w-full rounded-t-sm transition-all duration-1000 ${t.day === 'Hoje' ? 'bg-[#AF52DE] opacity-100' : 'bg-purple-900 opacity-40'}`}
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
                    className="bg-gradient-to-br from-[#AF52DE]/10 to-indigo-900/10 rounded-3xl p-6 border border-[#AF52DE]/20 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Icon name="water_drop" className="text-[#AF52DE] text-4xl" />
                    </div>

                    <h3 className="text-[#AF52DE] text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Icon name="auto_awesome" className="text-base" />
                        Análise Profunda
                    </h3>

                    <p className="text-white/80 leading-relaxed text-[15px]">
                        {data?.analysis || 'Acessando registros akáshicos...'}
                    </p>

                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
                        <div className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/50 border border-white/5">
                            Status: {context.main_status}
                        </div>
                        <div className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/50 border border-white/5">
                            Sensibilidade: {displayScore}%
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
                        Conselho Espiritual
                    </h3>
                    <p className="text-white/60 text-xs leading-relaxed">
                        {data?.recommendation || "Medite e aguarde."}
                    </p>
                </motion.div>

            </div>
        </div>
    );
};
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { motion } from 'framer-motion';
import ErrorState from '../components/ErrorState';
import { agentApi, DashboardResponse } from '../api/agent';

export const ActionDetail: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardResponse | null>(null);
    const [error, setError] = useState(false);

    const fetchDetail = async () => {
        setLoading(true);
        setError(false);
        try {
            // Actions often depend on main dashboard context
            let userId = "demo";
            try {
                const saved = localStorage.getItem('user_birth_data');
                if (saved) userId = JSON.parse(saved).user_id || "demo";
            } catch (e) { }

            const response = await agentApi.getDashboard(userId);
            setData(response);
        } catch (error) {
            console.error("Action detail fetch error", error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, []);

    // Derived State from Backend Data
    const focus = data?.next_window_focus || "Indefinido";
    const desc = data?.next_window_desc || "Analisando fluxo temporal...";

    // Simple logic to detect "Warning" vs "Opportunity" based on backend text
    // Adjust logic based on actual backend output keywords
    const isWarning = focus.toLowerCase().includes('cuidado') ||
        focus.toLowerCase().includes('atenção') ||
        focus.toLowerCase().includes('void');

    if (loading && !data) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
                <p className="text-yellow-400 text-sm font-medium tracking-widest uppercase animate-pulse">Sincronizando Relógio Cósmico...</p>
            </div>
        );
    }

    if (error && !data) {
        return (
            <div className="min-h-screen bg-black flex flex-col pt-12">
                <div className="px-6 pb-4 flex justify-between items-center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center active:scale-95 transition-transform"
                    >
                        <Icon name="arrow_back" className="text-white/70" />
                    </button>
                    <h1 className="text-[21px] font-semibold tracking-tight text-yellow-400 text-center">Ação</h1>
                    <div className="w-10"></div>
                </div>
                <ErrorState onRetry={fetchDetail} />
            </div>
        );
    }

    // Theme Colors
    const themeColor = isWarning ? "text-red-500" : "text-yellow-400";
    const bgColor = isWarning ? "selection:bg-red-500/30" : "selection:bg-yellow-500/30";
    const borderColor = isWarning ? "border-red-500/20" : "border-yellow-500/20";
    const iconName = isWarning ? "warning" : "stars";

    return (
        <div className={`min-h-screen bg-[#000000] text-white font-sans ${bgColor}`}>
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-[#000000]/80 backdrop-blur-md border-b border-white/5 pt-12 pb-4 px-6">
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

                <h1 className={`text-[21px] font-semibold tracking-tight ${data?.next_window_focus ? (isWarning ? 'text-red-500' : 'text-yellow-400') : 'text-white'} text-center`}>
                    {focus}
                </h1>

                {/* Hero: Cosmic Chronometer */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`bg-[#1C1C1E] rounded-3xl p-8 border ${borderColor} relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[260px]`}
                >
                    {/* Background Ambiance */}
                    <div className={`absolute top-0 left-0 w-full h-full opacity-10 bg-gradient-to-t ${isWarning ? 'from-red-900' : 'from-yellow-900'} to-transparent`}></div>

                    <h2 className={`${themeColor} text-xs font-bold uppercase tracking-widest mb-6 z-10 flex items-center gap-2`}>
                        <Icon name="schedule" className="text-base" />
                        Qualidade do Tempo
                    </h2>

                    {/* Pulsing Orb Visual */}
                    <div className="relative mb-6 z-10">
                        <div className={`w-24 h-24 rounded-full border-2 ${borderColor} flex items-center justify-center`}>
                            <div className={`w-20 h-20 rounded-full ${isWarning ? 'bg-red-500' : 'bg-yellow-400'} opacity-20 animate-pulse`}></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Icon name="history_toggle_off" className={`${themeColor} text-4xl`} />
                            </div>
                        </div>
                    </div>

                    <div className="z-10">
                        <h3 className="text-white text-2xl font-bold font-display tracking-tight mb-2">
                            {focus}
                        </h3>
                        <p className="text-white/60 text-sm leading-relaxed max-w-[280px] mx-auto">
                            "{desc}"
                        </p>
                    </div>
                </motion.div>

                {/* Detailed Metrics Grid (Visual Only or Placeholder until backend sends details) */}
                <div className="grid grid-cols-1 gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/5 relative overflow-hidden active:scale-[0.99] transition-transform"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center ${isWarning ? 'text-red-400' : 'text-yellow-400'}`}>
                                    <Icon name="dark_mode" className="text-lg" />
                                </div>
                                <div>
                                    <h3 className="text-white/90 text-[15px] font-bold tracking-tight">Estado da Lua</h3>
                                    <p className={`text-[11px] font-bold uppercase tracking-wider ${data?.is_void ? 'text-red-400' : 'text-green-400'}`}>
                                        {data?.is_void ? 'Fora de Curso' : 'Ativa'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p className="text-[#8e8e93] text-[13px] leading-snug pl-[44px]">
                            {data?.is_void ? 'Interrupção de fluxo. Aguarde.' : 'Fluxo contínuo e produtivo.'}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/5 relative overflow-hidden active:scale-[0.99] transition-transform"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-orange-400`}>
                                    <Icon name="hourglass_top" className="text-lg" />
                                </div>
                                <div>
                                    <h3 className="text-white/90 text-[15px] font-bold tracking-tight">Regente</h3>
                                    <p className={`text-[11px] font-bold uppercase tracking-wider text-orange-400`}>
                                        {data?.planetary_hour || 'Sol'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p className="text-[#8e8e93] text-[13px] leading-snug pl-[44px]">
                            {data?.planetary_hour ? `A energia de ${data.planetary_hour} domina esta hora.` : 'Calculando regência...'}
                        </p>
                    </motion.div>
                </div>

                {/* Logic / Context Card */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-[#1C1C1E]/50 rounded-2xl p-6 border border-white/5"
                >
                    <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3 border-b border-white/5 pb-2">
                        Status do Sistema
                    </h3>
                    <p className="text-white/60 text-xs leading-relaxed">
                        Dados sincronizados com efemérides em tempo real. A janela de ação é calculada cruzando aspectos lunares com o ascendente local.
                    </p>
                    <div className="mt-3 flex gap-2">
                        <span className={`px-2 py-1 rounded bg-white/5 text-[10px] font-medium border border-white/10 ${themeColor}`}>
                            {isWarning ? 'Manter Posição' : 'Avançar'}
                        </span>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

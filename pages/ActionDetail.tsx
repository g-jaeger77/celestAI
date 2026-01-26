import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { motion } from 'framer-motion';

import { calculateBioMetrics } from '../utils/calculateScores';

const getActionContent = () => {
    // 1. Get Score from Central Utility
    let userName = "User";
    try {
        const saved = localStorage.getItem('user_birth_data');
        if (saved) userName = JSON.parse(saved).full_name || "User";
    } catch (e) { }

    const scores = calculateBioMetrics(userName);
    const window = scores.actionWindow;
    const isWarning = window.type === 'WARNING';

    // 3. Extended Analysis Generation (5-7 lines)
    let extendedSummary = "";
    if (isWarning) {
        extendedSummary = "O universo impõe uma pausa obrigatória. A Lua está Fora de Curso (Void of Course) ou sob tensão de Saturno, criando um vácuo onde as intenções se perdem. Iniciar projetos agora é como semear no concreto: esforço máximo para resultado nulo. Reuniões tendem a ser improdutivas, e decisões importantes tomadas sob este céu precisarão ser refeitas. A energia pede conservação, não expansão. Use este tempo 'morto' para revisar o que já foi feito, limpar sua mesa ou simplesmente esperar. Não nade contra a correnteza do vazio; flutue até que a maré mude novamente.";
    } else {
        extendedSummary = "O sinal está verde no painel cósmico. A janela de oportunidade está escancarada, favorecida por aspectos harmoniosos de Vênus e Júpiter. A resistência do ambiente é mínima, e suas ações encontrarão solo fértil para crescer. É a hora exata para o 'pitch' importante, o envio daquele e-mail crucial ou o início de uma nova empreitada. A sorte protege os audazes neste momento. O fluxo está alinhado com sua vontade; o que você colocar em movimento agora terá uma inércia positiva duradoura. Não hesite. O tempo é um recurso precioso, e agora ele está trabalhando a seu favor.";
    }

    return {
        isWarning,
        score: isWarning ? 35 : 88,
        status: window.title,
        title: window.title,
        time: window.time,
        themeColor: isWarning ? "text-red-500" : "text-yellow-400",
        bgColor: isWarning ? "selection:bg-red-500/30" : "selection:bg-yellow-500/30",
        borderColor: isWarning ? "border-red-500/20" : "border-yellow-500/20",
        glowColor: isWarning ? "shadow-red-500/50" : "shadow-yellow-500/50",
        icon: isWarning ? "warning" : "stars",
        summary: extendedSummary,
        metrics: [
            {
                id: 'moon',
                label: 'Estado da Lua',
                value: isWarning ? 'Fora de Curso' : 'Em Curso',
                desc: isWarning ? 'Pausa Cósmica. Evite inícios.' : 'Conectada. Fluxo livre.',
                icon: 'dark_mode',
                color: isWarning ? 'text-red-400' : 'text-yellow-400'
            },
            {
                id: 'ruler',
                label: 'Regente da Hora',
                value: isWarning ? 'Saturno' : 'Mude',
                desc: isWarning ? 'Exige paciência e restrição.' : 'Favorece acordos e valores.',
                icon: 'hourglass_top',
                color: isWarning ? 'text-orange-400' : 'text-pink-400'
            },
            {
                id: 'window',
                label: 'Janela Atual',
                value: isWarning ? 'Fechada' : 'Aberta',
                desc: window.time,
                icon: 'schedule',
                color: 'text-white/80'
            }
        ],
        context: isWarning
            ? 'Triangulação: Lua Void + Hora de Saturno.'
            : 'Triangulação: Sol em Bom Aspecto + Hora de Vênus.'
    };
};

export const ActionDetail: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<ReturnType<typeof getActionContent> | null>(null);

    useEffect(() => {
        setData(getActionContent());
    }, []);

    return (
        <div className={`min-h-screen bg-[#000000] text-white font-sans ${data?.bgColor || ''}`}>
            {/* Header */}
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

                <h1 className={`text-[21px] font-semibold tracking-tight ${data?.isWarning ? 'text-red-500' : 'text-yellow-400'} text-center`}>
                    {data?.isWarning ? 'Cuidado' : 'Sorte'}
                </h1>

                {/* Hero: Cosmic Chronometer */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`bg-[#1C1C1E] rounded-3xl p-8 border ${data?.borderColor || 'border-white/10'} relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[260px]`}
                >
                    {/* Background Ambiance */}
                    <div className={`absolute top-0 left-0 w-full h-full opacity-10 bg-gradient-to-t ${data?.isWarning ? 'from-red-900' : 'from-yellow-900'} to-transparent`}></div>

                    <h2 className={`${data?.themeColor} text-xs font-bold uppercase tracking-widest mb-6 z-10 flex items-center gap-2`}>
                        <Icon name={data?.icon || 'schedule'} className="text-base" />
                        Qualidade do Tempo
                    </h2>

                    {/* Pulsing Orb Visual */}
                    <div className="relative mb-6 z-10">
                        <div className={`w-24 h-24 rounded-full border-2 ${data?.borderColor} flex items-center justify-center`}>
                            <div className={`w-20 h-20 rounded-full ${data?.themeColor === 'text-red-500' ? 'bg-red-500' : 'bg-yellow-400'} opacity-20 animate-pulse`}></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Icon name="history_toggle_off" className={`${data?.themeColor} text-4xl`} />
                            </div>
                        </div>
                    </div>

                    <div className="z-10">
                        <h3 className="text-white text-2xl font-bold font-display tracking-tight mb-2">
                            {data?.status || 'Sincronizando...'}
                        </h3>
                        <p className="text-white/60 text-sm leading-relaxed max-w-[280px] mx-auto">
                            "{data?.summary}"
                        </p>
                    </div>
                </motion.div>

                {/* Detailed Metrics Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {data?.metrics.map((metric, i) => (
                        <motion.div
                            key={metric.id}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                            className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/5 relative overflow-hidden active:scale-[0.99] transition-transform"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center ${metric.color}`}>
                                        <Icon name={metric.icon} className="text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="text-white/90 text-[15px] font-bold tracking-tight">{metric.label}</h3>
                                        <p className={`text-[11px] font-bold uppercase tracking-wider ${metric.color}`}>{metric.value}</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[#8e8e93] text-[13px] leading-snug pl-[44px]">
                                {metric.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Logic / Context Card */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-[#1C1C1E]/50 rounded-2xl p-6 border border-white/5"
                >
                    <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3 border-b border-white/5 pb-2">
                        Lógica do Cálculo
                    </h3>
                    <p className="text-white/60 text-xs leading-relaxed">
                        Este algoritmo monitora o movimento da <strong>Lua</strong> em tempo real. Quando ela fica sem aspectos antes de mudar de signo, entramos em um período "Void" (Vazio), onde a energia para novos começos é disperdiçada.
                    </p>
                    <div className="mt-3 flex gap-2">
                        <span className={`px-2 py-1 rounded bg-white/5 text-[10px] font-medium border border-white/10 ${data?.themeColor}`}>
                            {data?.context}
                        </span>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

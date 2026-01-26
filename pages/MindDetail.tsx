import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { motion } from 'framer-motion';

import { calculateBioMetrics } from '../utils/calculateScores';

// Calculate Mind Content based on Score
const getMindContent = () => {
    // 1. Get Score from Central Utility
    // Retrieve user name same as Dashboard
    let userName = "User";
    try {
        const saved = localStorage.getItem('user_birth_data');
        if (saved) userName = JSON.parse(saved).full_name || "User";
    } catch (e) { }

    const scores = calculateBioMetrics(userName);
    const score = scores.mindScore;

    // 2. Derive dynamic content based on score ranges (to simulate astrological context)
    // This logic enhances the raw number with specific "Mind" attributes
    let context = "Trânsito Neutro";
    let speed = "70%";
    let filter = "Médio";
    let memory = "75%";
    let summary = scores.neuralDesc;

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

    // 3. Extended Analysis Generation (5-7 lines)
    let extendedSummary = "";
    if (score > 80) {
        extendedSummary = "Seu intelecto está operando em uma frequência vibracional elevadíssima, impulsionado por uma conjunção favorável de Mercúrio. A clareza mental é absoluta, permitindo a conexão de ideias complexas que normalmente estariam fragmentadas. É um momento de 'download cósmico', onde insights profundos surgem sem esforço consciente. Aproveite este estado de hiperfoco para resolver problemas estruturais ou aprender novos sistemas. Sua capacidade de comunicação está magnética, mas cuidado para não atropelar o tempo de compreensão dos outros. A mente está rápida, precisa e letalmente eficiente.";
    } else if (score > 60) {
        extendedSummary = "O fluxo mental segue um ritmo constante e produtivo, favorecido pelo movimento direto de Mercúrio. Você possui clareza suficiente para tomar decisões lógicas sem se perder em ruídos emocionais. A capacidade de articular pensamentos está acima da média, tornando este um excelente momento para negociações e planejamento de médio prazo. Embora não esteja em um pico de genialidade súbita, sua consistência intelectual é sua maior arma hoje. Organize, planeje e execute com a segurança de quem vê o caminho completo.";
    } else if (score > 40) {
        extendedSummary = "Sua mente navega por águas mais profundas e subjetivas hoje. A lógica pura pode parecer nebulosa, dando lugar a uma intuição mais abstrata e criativa. Pode haver dificuldade em focar em planilhas ou dados frios, pois seu processador interno está priorizando padrões emocionais. Não force a produtividade linear; em vez disso, permita-se divagar e explorar ideias sem compromisso. É um período de incubação, onde o silêncio vale mais que a fala e a observação supera a ação direta.";
    } else {
        extendedSummary = "Estamos atravessando uma zona de turbulência cognitiva. Mercúrio retrógrado ou aspectos tensos criam um ambiente propenso a mal-entendidos e falhas de comunicação. O processamento de novas informações está lento e exige o dobro de energia. Evite assinar contratos importantes ou iniciar projetos complexos agora. É um convite do cosmos para a revisão, a pausa e a reflexão interna. Não lute contra a névoa; use-a para descansar o intelecto e focar em atividades mecânicas ou artísticas que não exijam lógica binária.";
    }

    return {
        score: score,
        status: scores.neuralState,
        context: context,
        metrics: [
            {
                id: 'speed',
                label: 'Velocidade',
                value: speed,
                desc: score > 60 ? 'Processamento Rápido. Facilidade para conectar ideias.' : 'Fluxo mais lento. Exige revisão.',
                icon: 'speed',
                color: 'text-cyan-400'
            },
            {
                id: 'filter',
                label: 'Filtro',
                value: filter,
                desc: score > 60 ? 'Alta Precisão. Foco no essencial.' : 'Distrações altas. Cuidado com ruídos.',
                icon: 'filter_alt',
                color: 'text-blue-400'
            },
            {
                id: 'memory',
                label: 'Memória',
                value: memory,
                desc: score > 60 ? 'Retenção Alta. Ótimo para estudos.' : 'Evite sobrecarga de informações hoje.',
                icon: 'psychology',
                color: 'text-indigo-400'
            }
        ],
        summary: extendedSummary
    };
};

export const MindDetail: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<ReturnType<typeof getMindContent> | null>(null);

    useEffect(() => {
        // No fake delay, instant sync
        setData(getMindContent());
    }, []);

    return (
        <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-cyan-500/30">
            {/* Header */}
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
                                strokeDashoffset={2 * Math.PI * 100 * (1 - (data?.score || 0) / 100)}
                                className="text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.5)] transition-all duration-1000 ease-out"
                                strokeLinecap="round"
                            />
                        </svg>

                        {/* In-Ring Content */}
                        <div className="absolute flex flex-col items-center">
                            <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase mb-1 drop-shadow-sm">
                                {data?.status || 'Calculando...'}
                            </span>
                            <span className="text-7xl font-light tracking-tighter text-white font-display">
                                {data?.score || '--'}
                            </span>
                            <span className="text-white/40 text-xs mt-2 uppercase tracking-widest">
                                Potencial
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Detailed Metrics Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {data?.metrics.map((metric, i) => (
                        <motion.div
                            key={metric.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                            className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/5"
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
                        {data?.summary || 'Carregando análise detalhada...'}
                    </p>

                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
                        <div className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/50 border border-white/5">
                            Mercúrio Retrógrado: Não
                        </div>
                        <div className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/50 border border-white/5">
                            Biorritmo: 92%
                        </div>
                    </div>
                </motion.div>

                {/* Logic / Context Card */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="bg-[#1C1C1E]/50 rounded-2xl p-6 border border-white/5"
                >
                    <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3 border-b border-white/5 pb-2">
                        Lógica do Cálculo
                    </h3>
                    <p className="text-white/60 text-xs leading-relaxed">
                        Esta métrica combina a posição atual de <strong>Mercúrio</strong> (Intelecto) com seu <strong>Ciclo Biorrítmico Intelectual</strong> e a variação da <strong>Lua</strong> (Foco emocional).
                    </p>
                    <div className="mt-3 flex gap-2">
                        <span className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-medium border border-cyan-500/20">Mercúrio Direto</span>
                        <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] font-medium border border-blue-500/20">Biorritmo Alto</span>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

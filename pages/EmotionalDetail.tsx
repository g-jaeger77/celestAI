import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { motion } from 'framer-motion';

import { calculateBioMetrics } from '../utils/calculateScores';

// Data Logic
const getEmotionalContent = () => {
    // 1. Get Score from Central Utility
    let userName = "User";
    try {
        const saved = localStorage.getItem('user_birth_data');
        if (saved) userName = JSON.parse(saved).full_name || "User";
    } catch (e) { }

    const scores = calculateBioMetrics(userName);
    const score = scores.soulScore;

    // 2. Dynamic content mapping
    // We map the numeric score to "context"
    let social = "Normal";
    let intuition = "Estável";
    let phase = "Crescente";
    let weather = "cloud";

    if (score > 80) {
        social = "Extrovertido";
        intuition = "Profética";
        phase = "Cheia";
        weather = "sun";
    } else if (score < 40) {
        social = "Baixa";
        intuition = "Alta"; // Often low social battery means high sensitivity
        phase = "Minguante";
        weather = "rainy";
    }

    // 3. Extended Analysis Generation (5-7 lines)
    let extendedSummary = "";
    if (score > 80) {
        extendedSummary = "Sua sensibilidade espiritual está radiante, operando como uma antena de alta fidelidade para as frequências sutis ao seu redor. A Lua está cheia e brilhante em sua casa emocional, proporcionando um magnetismo natural que atrai conexões profundas. É um momento de 'coração aberto', onde a empatia flui sem barreiras, permitindo curar velhas feridas apenas com a presença. Contudo, essa abertura exige discernimento: você está absorvendo tudo. Cerque-se de beleza e pessoas elevadas. Sua intuição não está apenas sussurrando; ela está gritando verdades que sua mente racional ainda vai demorar a processar. Confie no invisível.";
    } else if (score > 60) {
        extendedSummary = "As águas emocionais estão calmas e nutritivas. Existe um equilíbrio saudável entre dar e receber, permitindo que você navegue pelas interações sociais com graça e estabilidade. Sua bateria emocional está carregada o suficiente para oferecer suporte aos outros sem se drenar no processo. É um excelente momento para fortalecer laços familiares ou ter aquelas conversas que exigem tato e acolhimento. A sensibilidade está presente, mas sob controle, funcionando mais como uma ferramenta de conexão do que como um fardo. Aproveite para nutrir o que realmente importa.";
    } else if (score > 40) {
        extendedSummary = "O clima interno está nublado, pedindo recolhimento. Você pode se sentir mais vulnerável a críticas ou energias externas, como se sua 'pele psíquica' estivesse mais fina que o normal. Não é o momento para grandes exposições sociais ou confrontos desgastantes. A necessidade de segurança emocional é a prioridade agora. Busque refúgio em ambientes conhecidos e com pessoas que não exigem máscaras sociais. Permita-se sentir a melancolia ou a introspecção sem julgamento; elas são mensageiras necessárias para a limpeza do que já não serve mais.";
    } else {
        extendedSummary = "Modo Caverna ativado. Sua reserva emocional está operando no vermelho, e o isolamento não é apenas um desejo, é uma necessidade biológica. A sensibilidade está à flor da pele, podendo transformar pequenos ruídos em grandes tempestades internas. O mundo lá fora pode parecer agressivo ou caótico demais agora. Feche as cortinas, desligue as notificações e proteja seu campo energético. Não tente 'funcionar' socialmente hoje; qualquer tentativa será forçada e drenante. O silêncio e a solitude são seus únicos remédios eficazes neste ciclo de purificação profunda.";
    }

    return {
        score: score,
        status: scores.moodState,
        weather: weather,
        moodTitle: scores.moodState,
        summary: extendedSummary,
        metrics: [
            {
                id: 'social',
                label: 'Energia Social',
                value: social,
                desc: score > 40 ? 'Bateria social estável. Pode interagir sem drenar.' : 'Recolhimento Necessário. Recarregue longe de multidões.',
                icon: score > 40 ? 'groups' : 'battery_alert',
                color: 'text-purple-400'
            },
            {
                id: 'intuition',
                label: 'Sensibilidade',
                value: intuition,
                desc: score > 70 ? 'Radar ligado no máximo. Confie no seu instinto.' : 'Percepção emocional equilibrada.',
                icon: 'sensors',
                color: 'text-fuchsia-400'
            },
            {
                id: 'phase',
                label: 'Fase Interna',
                value: phase,
                desc: score > 50 ? 'Expansão e brilho.' : 'Introspecção e limpeza.',
                icon: 'dark_mode',
                color: 'text-violet-400'
            }
        ],
        context: {
            moon: "Trânsito",
            aspect: "Lua"
        }
    };
};

export const EmotionalDetail: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<ReturnType<typeof getEmotionalContent> | null>(null);

    useEffect(() => {
        setData(getEmotionalContent());
    }, []);

    const themeColor = 'text-[#AF52DE]';
    const ringColor = '#AF52DE';
    const glowColor = 'bg-[#AF52DE]';
    const dropShadow = 'drop-shadow-[0_0_10px_rgba(175,82,222,0.5)]';

    return (
        <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#AF52DE]/30">
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

                <h1 className={`text-[21px] font-semibold tracking-tight ${themeColor} text-center`}>Alma</h1>

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center relative"
                >
                    {/* Main Gauge */}
                    <div className="relative w-64 h-64 flex items-center justify-center">
                        {/* Outer Glow Ring - Reduced Intensity */}
                        <div className={`absolute inset-0 rounded-full ${glowColor}/5 blur-2xl animate-pulse-slow`}></div>

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
                                className={`${themeColor} drop-shadow-[0_0_4px_rgba(175,82,222,0.5)] transition-all duration-1000 ease-out`}
                                strokeLinecap="round"
                            />
                        </svg>

                        {/* In-Ring Content */}
                        <div className="absolute flex flex-col items-center">
                            <span className={`${themeColor} text-sm font-medium tracking-wider uppercase mb-1 drop-shadow-sm`}>
                                {data?.status || 'Calculando...'}
                            </span>
                            <span className="text-7xl font-light tracking-tighter text-white font-display">
                                {data?.score || '--'}
                            </span>
                            <span className="text-white/40 text-xs mt-2 uppercase tracking-widest">
                                Bateria Social
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
                    className="bg-gradient-to-br from-purple-900/20 to-fuchsia-900/10 rounded-3xl p-6 border border-purple-500/20 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Icon name="auto_awesome" className="text-purple-400 text-4xl" />
                    </div>

                    <h3 className="text-purple-400 text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Icon name="tips_and_updates" className="text-base" />
                        Análise Emocional
                    </h3>

                    <p className="text-white/80 leading-relaxed text-[15px]">
                        {data?.summary || 'Carregando análise detalhada...'}
                    </p>

                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
                        <div className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/50 border border-white/5">
                            Lua: {data?.context?.moon || '--'}
                        </div>
                        <div className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/50 border border-white/5">
                            Aspecto: {data?.context?.aspect || '--'}
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
                        O algoritmo analisa sua <strong>Lua Natal</strong> (Filtro Emocional), triangula com a <strong>Fase Lunar Atual</strong> e verifica aspectos de tensão com <strong>Netuno</strong> (Sensibilidade).
                    </p>
                    <div className="mt-3 flex gap-2">
                        <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 text-[10px] font-medium border border-purple-500/20">Lua: Câncer</span>
                        <span className="px-2 py-1 rounded bg-fuchsia-500/10 text-fuchsia-400 text-[10px] font-medium border border-fuchsia-500/20">Netuno: Tenso</span>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};
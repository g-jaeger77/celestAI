import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { motion } from 'framer-motion';

import { calculateBioMetrics } from '../utils/calculateScores';

const getPhysicalContent = () => {
    // 1. Get Score from Central Utility
    let userName = "User";
    try {
        const saved = localStorage.getItem('user_birth_data');
        if (saved) userName = JSON.parse(saved).full_name || "User";
    } catch (e) { }

    const scores = calculateBioMetrics(userName);
    const score = scores.bodyScore;

    // 2. Dynamic content mapping
    let marsSign = "Áries";
    let combustion = "Turbo";
    let impulse = "Alto";
    let immune = "Alta";

    if (score < 40) {
        marsSign = "Peixes (Baixa Energia)";
        combustion = "Lento";
        impulse = "Baixo";
        immune = "Em alerta";
    } else if (score < 70) {
        marsSign = "Touro (Construção)";
        combustion = "Estável";
        impulse = "Moderado";
        immune = "Normal";
    }

    // 3. Extended Analysis Generation (5-7 lines)
    let extendedSummary = "";
    if (score > 80) {
        extendedSummary = "O vigor físico atingiu seu ápice, alimentado por uma poderosa influência solar e marcial. Seus sistemas biológicos estão operando com máxima eficiência, convertendo energia em ação pura. É o dia perfeito para quebrar recordes pessoais, iniciar treinamentos intensos ou enfrentar desafios que exigem resistência bruta. A vitalidade transborda, criando uma aura de invencibilidade. Contudo, tanta energia exige canalização: se não for gasta, pode virar ansiedade ou tensão muscular. Mova-se, corra, construa. O corpo pede impacto e movimento.";
    } else if (score > 60) {
        extendedSummary = "Você dispõe de uma reserva energética sólida e confiável. O metabolismo está estável, permitindo um dia produtivo sem grandes oscilações de fadiga. É um momento de construção e manutenção, onde o corpo sustenta o ritmo sem reclamar. Ideal para atividades de resistência moderada e para cumprir rotinas exigentes. A saúde geral está protegida, mas não abuse. Diferente do pico máximo, hoje a energia é um recurso a ser gerenciado com sabedoria para durar até o fim do ciclo. Respeite as pausas estratégicas.";
    } else if (score > 40) {
        extendedSummary = "O corpo entra em um modo de conservação necessário. A bateria não está vazia, mas opera em 'modo econômico' para proteger funções vitais. Você pode sentir uma leve lentidão ao iniciar tarefas físicas, exigindo um aquecimento mais longo. Não é o dia para testar seus limites ou ignorar sinais de dor. A prioridade deve ser a ergonomia, a hidratação e o movimento suave. Atividades regenerativas como alongamento ou caminhada leve trarão mais benefícios do que o esforço intenso. Ouça o sussurro do cansaço antes que vire um grito.";
    } else {
        extendedSummary = "Alerta de bateria baixa. Seus níveis de vitalidade estão no limite inferior, exigindo recolhimento imediato. O sistema imunológico pode estar trabalhando nos bastidores, desviando recursos para defesa interna. Forçar a barra hoje é pedir por uma lesão ou esgotamento total amanhã. O melhor treino agora é o sono profundo e a nutrição reparadora. Cancele compromissos fisicamente exaustivos e permita que a biologia faça seu trabalho de restauração silenciosa. Respeitar este vale é a única forma de garantir o próximo pico.";
    }

    return {
        score: score,
        status: scores.batteryState,
        summary: extendedSummary,
        metrics: [
            {
                id: 'combustion',
                label: 'Combustão Calórica',
                value: combustion,
                desc: score > 60 ? 'Metabolismo acelerado. Bom para cardio.' : 'Metabolismo basal. Poupe energia.',
                icon: 'local_fire_department',
                color: 'text-orange-500'
            },
            {
                id: 'impulse',
                label: 'Nível de Impulso',
                value: impulse,
                desc: score > 60 ? 'Energia cinética alta. Cuidado com exageros.' : 'Controle motor estável. Bom para yoga.',
                icon: 'timeline',
                color: 'text-yellow-500'
            },
            {
                id: 'immune',
                label: 'Resposta Imune',
                value: immune,
                desc: score > 60 ? 'Escudos ativos. Vitalidade alta.' : 'Evite friagem e desgaste excessivo hoje.',
                icon: 'shield',
                color: 'text-green-500'
            }
        ],
        batteryLevel: score,
        marsSign: marsSign
    };
};

export const PhysicalDetail: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<ReturnType<typeof getPhysicalContent> | null>(null);

    useEffect(() => {
        setData(getPhysicalContent());
    }, []);

    return (
        <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#A4C400]/30">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-[#000000]/80 backdrop-blur-md border-b border-white/5 pt-12 pb-2 px-6">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center active:scale-95 transition-transform"
                    >
                        <Icon name="arrow_back" className="text-white/70" />
                    </button>
                    {/* Title moved to body for symmetry */}
                </div>
            </div>

            <div className="pt-16 pb-24 px-6 max-w-md mx-auto space-y-8">

                {/* Page Title - Moved here for equal spacing (32px) */}
                <h1 className="text-[21px] font-semibold tracking-tight text-[#A4C400] text-center">Corpo</h1>

                {/* Hero: Bio-Battery */}
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center relative"
                >
                    {/* Main Gauge */}
                    <div className="relative w-64 h-64 flex items-center justify-center">
                        {/* Outer Glow Ring - Reduced Intensity */}
                        <div className="absolute inset-0 rounded-full bg-[#A4C400]/5 blur-2xl animate-pulse-slow"></div>

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
                                className="text-[#A4C400] drop-shadow-[0_0_4px_rgba(164,196,0,0.5)] transition-all duration-1000 ease-out"
                                strokeLinecap="round"
                            />
                        </svg>

                        {/* In-Ring Content */}
                        <div className="absolute flex flex-col items-center">
                            <span className="text-[#A4C400] text-sm font-medium tracking-wider uppercase mb-1 drop-shadow-sm">
                                {data?.status || 'Carregando...'}
                            </span>
                            <span className="text-7xl font-light tracking-tighter text-white font-display">
                                {data?.score || '--'}
                            </span>
                            <span className="text-white/40 text-xs mt-2 uppercase tracking-widest">
                                Carga Vital
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

                {/* Analysis Card - Added for Consistency */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-br from-[#A4C400]/20 to-orange-900/10 rounded-3xl p-6 border border-[#A4C400]/20 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Icon name="auto_awesome" className="text-[#A4C400] text-4xl" />
                    </div>

                    <h3 className="text-[#A4C400] text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Icon name="tips_and_updates" className="text-base" />
                        Análise Corporal
                    </h3>

                    <p className="text-white/80 leading-relaxed text-[15px]">
                        {data?.summary || 'Carregando análise detalhada...'}
                    </p>

                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
                        <div className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/50 border border-white/5">
                            Marte: {data?.marsSign || '--'}
                        </div>
                        <div className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/50 border border-white/5">
                            Bateria: {data?.batteryLevel || '--'}%
                        </div>
                    </div>
                </motion.div>

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
                        Esta métrica triangula a posição atual de <strong>Marte</strong> (Motor de Ação) com o seu <strong>Sol Natal</strong> (Vitalidade Base) e o seu ciclo de <strong>Biorritmo Físico</strong> (23 dias).
                    </p>
                    <div className="mt-3 flex gap-2">
                        <span className="px-2 py-1 rounded bg-[#A4C400]/10 text-[#A4C400] text-[10px] font-medium border border-[#A4C400]/20">Marte em Áries</span>
                        <span className="px-2 py-1 rounded bg-orange-500/10 text-orange-400 text-[10px] font-medium border border-orange-500/20">Sol Vitalidade</span>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};
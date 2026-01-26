import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../components/Icon';
import BottomNav from '../components/BottomNav';

const CompatibilityResult: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { result, partnerName, type } = location.state || {};

    useEffect(() => {
        if (!result) {
            // Redirect if no data (direct access)
            navigate('/compatibility');
        }
    }, [result, navigate]);

    if (!result) return null;

    const { score, summary, quantum_protocol, conflict_vector, harmony_vector } = result;

    return (
        <div className="bg-black font-display text-white antialiased overflow-x-hidden min-h-screen pb-32">
            <header className="sticky top-0 z-50 flex items-center bg-black/80 backdrop-blur-md p-4 pb-2 justify-between border-b border-white/5 transition-colors">
                <button onClick={() => navigate('/compatibility')} className="text-white flex size-10 shrink-0 items-center justify-center rounded-full active:bg-white/10 transition-colors">
                    <Icon name="arrow_back_ios_new" />
                </button>
                <h2 className="text-white text-base font-semibold leading-tight tracking-tight opacity-0 transition-opacity duration-300">Sincronização Quântica</h2>
                <button className="text-primary-mental text-base font-semibold leading-normal tracking-wide shrink-0 active:opacity-70 transition-opacity">
                    Share
                </button>
            </header>

            <main className="flex-1 px-4 max-w-lg mx-auto w-full pt-6">
                <div className="pt-2 pb-6 flex flex-col items-center text-center">
                    <span className="text-[#8e8e93] text-[13px] font-bold uppercase tracking-wider mb-2">Análise de Ressonância</span>
                    <h1 className="text-white tracking-tight text-[30px] font-bold leading-none mb-1">Você & {partnerName}</h1>
                    <p className="text-white/40 text-[15px] font-medium leading-normal tracking-wide">
                        {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>

                <div className="bg-[#1C1C1E] rounded-[24px] p-6 mb-6 shadow-2xl shadow-black/50 border border-white/5 relative overflow-hidden ring-1 ring-white/5">
                    {/* Holographic Background Gradient */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#32ADE6]/5 to-[#AF52DE]/10 pointer-events-none"></div>

                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <div>
                            <h3 className="text-[#32ADE6] text-[15px] font-bold uppercase tracking-wider">Matriz de Sincronia</h3>
                            <span className="text-white/40 text-[11px] font-medium tracking-wide">Compatibilidade Geral</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                            <Icon name="stars" className="text-[#32ADE6]" style={{ fontSize: '16px' }} />
                            <span className="text-[20px] font-bold text-white tracking-tight">{score}%</span>
                        </div>
                    </div>

                    <div className="relative w-full aspect-square max-h-[320px] mx-auto flex items-center justify-center py-4">
                        {/* Labels positioned around the chart */}
                        <span className="absolute top-0 text-[10px] font-bold text-white/40 tracking-[0.15em] uppercase">Energia</span>
                        <span className="absolute bottom-0 text-[10px] font-bold text-white/40 tracking-[0.15em] uppercase">Ego</span>
                        <span className="absolute left-0 text-[10px] font-bold text-white/40 tracking-[0.15em] uppercase -translate-x-1">Emoção</span>
                        <span className="absolute right-0 text-[10px] font-bold text-white/40 tracking-[0.15em] uppercase translate-x-1">Mente</span>
                        <span className="absolute top-[25%] right-[5%] text-[10px] font-bold text-white/40 tracking-[0.15em] uppercase translate-x-2">Comunicação</span>

                        <svg className="w-full h-full overflow-visible" viewBox="0 0 200 200">
                            <defs>
                                <radialGradient id="holoGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                    <stop offset="0%" stopColor="#32ADE6" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#AF52DE" stopOpacity="0.1" />
                                </radialGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Spider Web Grid (Darker, thinner) */}
                            <g className="stroke-white/10 stroke-[0.5]" fill="none">
                                {/* Outer Pentagon */}
                                <polygon points="100,20 176,75 147,165 53,165 24,75"></polygon>
                                {/* Inner Pentagon (75%) */}
                                <polygon points="100,40 157,81.25 135.25,148.75 64.75,148.75 43,81.25" strokeOpacity="0.5"></polygon>
                                {/* Inner Pentagon (50%) */}
                                <polygon points="100,60 138,93.75 123.5,132.5 76.5,132.5 62,93.75" strokeOpacity="0.3"></polygon>
                                {/* Axes */}
                                <line x1="100" x2="100" y1="100" y2="20"></line>
                                <line x1="100" x2="176" y1="100" y2="75"></line>
                                <line x1="100" x2="147" y1="100" y2="165"></line>
                                <line x1="100" x2="53" y1="100" y2="165"></line>
                                <line x1="100" x2="24" y1="100" y2="75"></line>
                            </g>

                            {/* Dynamic Data Polygon */}
                            {(() => {
                                const scale = (val: number) => {
                                    const v = val || 50;
                                    return v / 100.0;
                                }

                                const c_energy = result?.chart_energy || 65;
                                const c_comm = result?.chart_communication || 70;
                                const c_intell = result?.chart_intellect || 80;
                                const c_emotional = result?.chart_emotional || 60;
                                const c_ego = result?.chart_ego || 40;

                                // Polygon Coordinates Calculation (Pentagon Geometry)
                                // Top (Energy)
                                const y1 = 100 - (scale(c_energy) * 80);
                                const x1 = 100;

                                // Top Right (Communication) ~72deg
                                const x2 = 100 + (scale(c_comm) * 76);
                                const y2 = 100 - (scale(c_comm) * 25);

                                // Bottom Right (Intellect)
                                const x3 = 100 + (scale(c_intell) * 47);
                                const y3 = 100 + (scale(c_intell) * 65);

                                // Bottom Left (Ego)
                                const x4 = 100 - (scale(c_ego) * 47);
                                const y4 = 100 + (scale(c_ego) * 65);

                                // Top Left (Emotional)
                                const x5 = 100 - (scale(c_emotional) * 76);
                                const y5 = 100 - (scale(c_emotional) * 25);

                                const points = `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4} ${x5},${y5}`;

                                return (
                                    <>
                                        <polygon
                                            points={points}
                                            fill="url(#holoGradient)"
                                            stroke="#32ADE6"
                                            strokeWidth="2"
                                            strokeLinejoin="round"
                                            filter="url(#glow)"
                                            className="opacity-90"
                                        >
                                            <animate attributeName="opacity" values="0.8;1;0.8" dur="4s" repeatCount="indefinite" />
                                        </polygon>
                                        {/* Vertices Dots */}
                                        <circle cx={x1} cy={y1} r="2" fill="white" />
                                        <circle cx={x2} cy={y2} r="2" fill="white" />
                                        <circle cx={x3} cy={y3} r="2" fill="white" />
                                        <circle cx={x4} cy={y4} r="2" fill="white" />
                                        <circle cx={x5} cy={y5} r="2" fill="white" />
                                    </>
                                );
                            })()}
                        </svg>
                    </div>
                </div>

                <div className="space-y-4 mb-20">
                    {/* Executive Summary Card */}
                    <div className="bg-[#1C1C1E] rounded-[22px] p-5 border border-white/5 flex flex-col gap-2 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                            <Icon name="psychology" className="text-[#32ADE6]" />
                            <h4 className="text-[#32ADE6] text-[13px] font-bold uppercase tracking-wider">Resumo Executivo</h4>
                        </div>
                        <p className="text-white text-[16px] leading-relaxed font-medium">
                            {summary}
                        </p>
                    </div>

                    {/* Harmony Vector - Grid Layout */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Harmony Card */}
                        <div className="bg-[#1C1C1E] rounded-[22px] p-5 border border-white/5 flex flex-col gap-2">
                            <div className="flex items-center gap-2 mb-1">
                                <Icon name="bolt" className="text-[#A4C400]" />
                                <h4 className="text-[#A4C400] text-[11px] font-bold uppercase tracking-wider">Força</h4>
                            </div>
                            <p className="text-white/80 text-[14px] leading-snug">
                                {harmony_vector}
                            </p>
                        </div>

                        {/* Conflict Card */}
                        <div className="bg-[#1C1C1E] rounded-[22px] p-5 border border-white/5 flex flex-col gap-2">
                            <div className="flex items-center gap-2 mb-1">
                                <Icon name="warning" className="text-[#FF453A]" />
                                <h4 className="text-[#FF453A] text-[11px] font-bold uppercase tracking-wider">Tensão</h4>
                            </div>
                            <p className="text-white/80 text-[14px] leading-snug">
                                {conflict_vector}
                            </p>
                        </div>
                    </div>

                    {/* Quantum Protocol - Featured Card */}
                    <div className="bg-[#1C1C1E] rounded-[22px] p-6 border border-[#AF52DE]/20 flex flex-col gap-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#AF52DE]/10 blur-3xl pointer-events-none -translate-y-10 translate-x-10"></div>
                        <div className="flex items-center gap-2 relative z-10">
                            <Icon name="auto_awesome" className="text-[#AF52DE]" />
                            <h4 className="text-[#AF52DE] text-[13px] font-bold uppercase tracking-wider">Conselho Quântico</h4>
                        </div>
                        <p className="text-white text-[18px] leading-relaxed font-semibold italic tracking-tight relative z-10">
                            "{quantum_protocol}"
                        </p>
                    </div>
                </div>
            </main>

            <BottomNav active="compatibility" />
        </div>
    );
};

export default CompatibilityResult;
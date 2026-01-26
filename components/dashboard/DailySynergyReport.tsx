import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../Icon';

interface SynergyData {
    globalScore: number;
    globalReasoning: string;
    pillars: {
        mind: {
            score: number;
            status: string;
            highlight: string;
        };
        body: {
            score: number;
            status: string;
            highlight: string;
        };
        soul: {
            score: number;
            status: string;
            highlight: string;
        };
    };
}

const DailySynergyReport: React.FC<SynergyData> = ({ globalScore, globalReasoning, pillars }) => {
    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in pb-24">
            {/* 1. Algorithmic Verdict Banner */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full overflow-hidden rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent opacity-50" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Left: Score */}
                    <div className="flex flex-col">
                        <span className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Score Geral</span>
                        <span className="text-5xl font-bold text-white tracking-tighter">{globalScore}%</span>
                    </div>

                    {/* Divider (Desktop) */}
                    <div className="hidden md:block w-px h-16 bg-white/10 mx-4" />

                    {/* Right: Reasoning */}
                    <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-2 tracking-tight">Veredito do Algoritmo</h3>
                        <p className="text-gray-300 text-sm leading-relaxed max-w-2xl text-left whitespace-pre-line">
                            {globalReasoning}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* 2. Three Pillars Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Mind Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="group relative rounded-2xl bg-[#1C1C1E] border border-white/5 p-6 hover:bg-white/5 transition-colors"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                                <Icon name="psychology" className="w-5 h-5" />
                            </div>
                            <h4 className="text-white font-semibold tracking-tight">{pillars.mind.status}</h4>
                        </div>
                        <span className="text-cyan-400 font-bold text-xl">{pillars.mind.score}%</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">
                        {pillars.mind.highlight}
                    </p>
                </motion.div>

                {/* Body Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="group relative rounded-2xl bg-[#1C1C1E] border border-white/5 p-6 hover:bg-white/5 transition-colors"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-lime-500/20 text-lime-400">
                                <Icon name="bolt" className="w-5 h-5" />
                            </div>
                            <h4 className="text-white font-semibold tracking-tight">{pillars.body.status}</h4>
                        </div>
                        <span className="text-lime-400 font-bold text-xl">{pillars.body.score}%</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">
                        {pillars.body.highlight}
                    </p>
                </motion.div>

                {/* Soul Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="group relative rounded-2xl bg-[#1C1C1E] border border-white/5 p-6 hover:bg-white/5 transition-colors"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                                <Icon name="water_drop" className="w-5 h-5" />
                            </div>
                            <h4 className="text-white font-semibold tracking-tight">{pillars.soul.status}</h4>
                        </div>
                        <span className="text-purple-400 font-bold text-xl">{pillars.soul.score}%</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">
                        {pillars.soul.highlight}
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default DailySynergyReport;

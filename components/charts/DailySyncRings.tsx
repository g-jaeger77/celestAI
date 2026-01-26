import React from 'react';
import { motion } from 'framer-motion';

interface MetricRingProps {
    score: number;
    color: string;
    radius: number;
    stroke: number;
    delay: number;
}

const MetricRing: React.FC<MetricRingProps> = ({ score, color, radius, stroke, delay }) => {
    const normalizedScore = Math.min(100, Math.max(0, score));
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

    return (
        <>
            {/* Background Track (Shadow) */}
            <circle
                cx="50%"
                cy="50%"
                r={radius}
                fill="none"
                stroke={color}
                strokeOpacity={0.08}
                strokeWidth={stroke}
            />
            {/* Active Value Ring */}
            <motion.circle
                cx="50%"
                cy="50%"
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut", delay }}
                style={{ transformOrigin: "center", rotate: "-90deg" }}
            />
        </>
    );
};

interface DailySyncRingsProps {
    mind: number;
    body: number;
    soul: number;
}

const DailySyncRings: React.FC<DailySyncRingsProps> = ({ mind, body, soul }) => {
    // Average Score
    const globalAlign = Math.round((mind + body + soul) / 3);

    return (
        <div className="relative w-full aspect-square max-w-[320px] mx-auto flex items-center justify-center">
            {/* Center Score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pb-1">
                <span className="text-4xl font-bold text-white tracking-tighter">{globalAlign}%</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 mt-0.5">Sincronia</span>
            </div>

            <svg className="w-full h-full" viewBox="0 0 240 240">
                <defs>
                    <linearGradient id="grad-mind" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00F0FF" />
                        <stop offset="100%" stopColor="#32ADE6" />
                    </linearGradient>
                    <linearGradient id="grad-body" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#A4C400" />
                        <stop offset="100%" stopColor="#C0EB00" />
                    </linearGradient>
                    <linearGradient id="grad-soul" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#AF52DE" />
                        <stop offset="100%" stopColor="#5E5CE6" />
                    </linearGradient>
                </defs>

                {/* Outer: Mind (Blue/Cyan) - Radius 100 */}
                <MetricRing score={mind} color="url(#grad-mind)" radius={100} stroke={20} delay={0.2} />

                {/* Middle: Body (Green/Blue) - Radius 75 */}
                <MetricRing score={body} color="url(#grad-body)" radius={75} stroke={20} delay={0.4} />

                {/* Inner: Soul (Purple) - Radius 50 */}
                <MetricRing score={soul} color="url(#grad-soul)" radius={50} stroke={20} delay={0.6} />
            </svg>
        </div>
    );
};

// Simple Icon component inline or imported (using simple placeholder if import fails, but we have Icon mock in context)
// Re-using the project's Icon component
import Icon from '../Icon';

export default DailySyncRings;

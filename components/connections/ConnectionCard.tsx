
import React from 'react';

type ConnectionType = 'love' | 'work' | 'social';

interface ConnectionCardProps {
    name: string;
    role: string;
    type: ConnectionType;
    score: number;
    onClick: () => void;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ name, role, type, score, onClick }) => {

    // Semantic Colors based on type
    const colors = {
        love: { ring: 'border-pink-500', text: 'text-pink-400', badge: 'bg-pink-500/10 text-pink-400', cardBg: 'bg-pink-500/5', cardBorder: 'border-pink-500/20' },
        work: { ring: 'border-blue-500', text: 'text-blue-400', badge: 'bg-blue-500/10 text-blue-400', cardBg: 'bg-blue-500/5', cardBorder: 'border-blue-500/20' },
        social: { ring: 'border-amber-500', text: 'text-amber-400', badge: 'bg-amber-500/10 text-amber-400', cardBg: 'bg-amber-500/5', cardBorder: 'border-amber-500/20' }
    };

    const color = colors[type];
    const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

    return (
        <div
            onClick={onClick}
            className={`group relative flex items-center gap-4 p-4 rounded-2xl active:scale-[0.98] transition-all cursor-pointer border hover:border-white/10 ${color.cardBg} ${color.cardBorder}`}
        >
            {/* Avatar with Type Ring */}
            <div className={`relative flex items-center justify-center w-12 h-12 rounded-full bg-[#2C2C2E] border-2 ${color.ring}`}>
                <span className="text-sm font-bold text-white tracking-wide">{initials}</span>
            </div>

            {/* Meta Data */}
            <div className="flex-1 flex flex-col">
                <span className="text-[17px] font-semibold text-white leading-tight">{name}</span>
                <span className={`text-[13px] font-medium ${color.text} opacity-80 uppercase tracking-wide`}>{role}</span>
            </div>

            {/* Score Gauge / Badge */}
            <div className="flex items-center justify-center">
                <div className={`px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider ${color.badge}`}>
                    {score}%
                </div>
                <div className="ml-3 text-gray-500">
                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

        </div>
    );
};

export default ConnectionCard;

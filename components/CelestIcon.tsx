import React from 'react';

interface CelestIconProps {
    className?: string;
    size?: number;
}

export const CelestIcon: React.FC<CelestIconProps> = ({ className = '', size = 48 }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            <img
                src="/assets/celest_icon.png"
                alt="Celest AI"
                className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(214,88,44,0.3)]"
            />
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-[#D6582C] opacity-20 blur-xl rounded-full -z-10"></div>
        </div>
    );
};

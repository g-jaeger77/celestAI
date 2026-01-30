import React from 'react';

interface CelestIconProps {
    className?: string;
    size?: number;
}

export const CelestIcon: React.FC<CelestIconProps> = ({ className = '', size = 48 }) => {
    // Generate 16 rays for the radial starburst effect
    const rays = Array.from({ length: 16 }).map((_, i) => (
        <rect
            key={i}
            x="47"
            y="5"
            width="6"
            height="32"
            rx="3"
            transform={`rotate(${i * 22.5} 50 50)`}
            fill="url(#celest-copper-gradient-icon)"
            className="origin-center"
        />
    ));

    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-[0_2px_8px_rgba(214,88,44,0.3)]"
            >
                <defs>
                    <linearGradient id="celest-copper-gradient-icon" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="10%" stopColor="#FFCAA6" />
                        <stop offset="50%" stopColor="#D6582C" />
                        <stop offset="90%" stopColor="#803015" />
                    </linearGradient>
                </defs>

                {/* Central Ring/Hole implicitly defined by the gap between rays, 
                    but we can add a small ring if needed. Based on the "flower" description, 
                    often the rays just meet distinctively. We'll stick to Rays only for the "Spark/Sun" look. */}

                {rays}

                {/* Optional: Inner Ring to define the void clearly if rays don't touch */}
                <circle cx="50" cy="50" r="12" stroke="url(#celest-copper-gradient-icon)" strokeWidth="0" fill="transparent" />
            </svg>

            {/* Optional ambient glow behind */}
            <div className="absolute inset-0 bg-[#D6582C] opacity-20 blur-xl rounded-full -z-10"></div>
        </div>
    );
};

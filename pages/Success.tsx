import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="relative flex h-screen w-full flex-col overflow-hidden items-center justify-between py-12 bg-black cursor-pointer"
      onClick={() => navigate('/dashboard')}
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0)_60%)] z-0"></div>

      <div className="flex flex-col items-center justify-center z-10 w-full px-6 pt-8 animate-fade-in">
        <h1 className="text-white tracking-tight text-[32px] font-bold leading-tight text-center">
          Sincronia Completa
        </h1>
        <p className="text-[#8E8E93] text-sm font-medium leading-normal pt-2 text-center uppercase tracking-wide">
          Seu mapa está pronto.
        </p>
      </div>

      <div className="flex-grow flex items-center justify-center w-full z-10 relative">
        <div className="relative w-[300px] h-[300px] flex items-center justify-center animate-[spin_20s_linear_infinite]">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {/* Cyan Ring */}
            <circle className="text-neutral-900 opacity-30" cx="100" cy="100" fill="transparent" r="86" stroke="currentColor" strokeWidth="14"></circle>
            <circle className="drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" cx="100" cy="100" fill="transparent" r="86" stroke="#22d3ee" strokeDasharray="540" strokeDashoffset="0" strokeLinecap="round" strokeWidth="14"></circle>
            
            {/* Orange Ring */}
            <circle className="text-neutral-900 opacity-30" cx="100" cy="100" fill="transparent" r="62" stroke="currentColor" strokeWidth="14"></circle>
            <circle className="drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]" cx="100" cy="100" fill="transparent" r="62" stroke="#fb923c" strokeDasharray="390" strokeDashoffset="0" strokeLinecap="round" strokeWidth="14"></circle>
            
            {/* Purple Ring */}
            <circle className="text-neutral-900 opacity-30" cx="100" cy="100" fill="transparent" r="38" stroke="currentColor" strokeWidth="14"></circle>
            <circle className="drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]" cx="100" cy="100" fill="transparent" r="38" stroke="#c084fc" strokeDasharray="240" strokeDashoffset="0" strokeLinecap="round" strokeWidth="14"></circle>
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_10px_rgba(255,255,255,0.3)] animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <div className="h-12 w-full z-10 flex items-center justify-center">
         <p className="text-xs text-white/30 animate-pulse">Tap to continue</p>
      </div>
    </div>
  );
};

export default Success;
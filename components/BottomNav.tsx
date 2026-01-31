import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './Icon';

interface BottomNavProps {
  active?: 'home' | 'trends' | 'astral' | 'profile';
  transparent?: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ active = 'home', transparent = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route: string) => path.includes(route) || (route === '/dashboard' && path === '/');

  const baseButtonClass = "flex flex-col items-center justify-center w-12 h-full gap-0.5 transition-colors";
  const activeClass = "text-white";
  const inactiveClass = "text-[#8e8e93] hover:text-white";

  const activeColors = {
    home: 'text-[#22d3ee]', // Cyan-400 (Mental)
    report: 'text-[#f59e0b]', // Amber-500 (Social/Fire)
    chat: 'text-teal-400', // Teal-400 (Spirit)
    synastry: 'text-[#ec4899]', // Pink-500 (Love)
    profile: 'text-white' // White (Neutral/Admin)
  };

  return (
    <nav className="w-full h-full flex items-center justify-around px-2 select-none" role="navigation" aria-label="Navegação principal">
      <button
        onClick={() => navigate('/dashboard')}
        className={`${baseButtonClass} ${isActive('/dashboard') ? activeColors.home : inactiveClass}`}
        aria-label="Ir para Dashboard"
        aria-current={isActive('/dashboard') ? 'page' : undefined}
      >
        <Icon name="grid_view" className="text-[24px]" aria-hidden="true" />
        <span className="text-[10px] font-medium tracking-tight">Hoje</span>
      </button>

      {/* Report / Alignment */}
      <button
        onClick={() => navigate('/trends')}
        className={`${baseButtonClass} ${isActive('/trends') ? activeColors.report : inactiveClass}`}
        aria-label="Ir para Alinhamento"
        aria-current={isActive('/trends') ? 'page' : undefined}
      >
        <Icon name="tune" className={`text-${isActive('/trends') ? 'xl' : 'lg'} mb-1`} aria-hidden="true" />
        <span className="text-[10px] font-medium tracking-tight">Alinhamento</span>
      </button>

      <button
        onClick={() => navigate('/chat')}
        className={`${baseButtonClass} ${isActive('/chat') ? activeColors.chat : inactiveClass}`}
        aria-label="Ir para Chat Astral"
        aria-current={isActive('/chat') ? 'page' : undefined}
      >
        <Icon name="chat_bubble" className="text-[24px]" aria-hidden="true" />
        <span className="text-[10px] font-medium tracking-tight">Astral</span>
      </button>

      <button
        onClick={() => navigate('/synastry')}
        className={`${baseButtonClass} ${isActive('/synastry') ? activeColors.synastry : inactiveClass}`}
        aria-label="Ir para Sincronia"
        aria-current={isActive('/synastry') ? 'page' : undefined}
      >
        <Icon name="auto_awesome" className="text-[24px]" aria-hidden="true" />
        <span className="text-[10px] font-medium tracking-tight">Sincronia</span>
      </button>

      <button
        onClick={() => navigate('/profile')}
        className={`${baseButtonClass} ${isActive('/profile') ? activeColors.profile : inactiveClass}`}
        aria-label="Ir para Perfil"
        aria-current={isActive('/profile') ? 'page' : undefined}
      >
        <Icon name="person" className="text-[24px]" aria-hidden="true" />
        <span className="text-[10px] font-medium tracking-tight">Perfil</span>
      </button>
    </nav>
  );
};


export default BottomNav;
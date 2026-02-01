import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import Icon from '../components/Icon';
import ShopPromoCard from '../components/ShopPromoCard';
import DailySyncRings from '../components/charts/DailySyncRings';
import ErrorState from '../components/ErrorState'; // New Component
import { agentApi, DashboardResponse } from '../api/agent';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState(false);

  // Retrieve user ID/Name
  const getUserProfile = () => {
    try {
      const saved = localStorage.getItem('user_birth_data');
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return { id: "demo", full_name: "User" };
  };

  const user = getUserProfile();

  // Retrieve Preloaded Data from Loading Screen
  const location = useLocation();
  const preloadedData = location.state?.preloadedData as DashboardResponse | undefined;

  const fetchData = async () => {
    // If we have fresh preloaded data, use it!
    if (preloadedData && !data) {
      setData(preloadedData);
      setLoading(false);
      // Clear state to avoid stale data on refresh? 
      // Actually navigate replace might be better but this works for now.
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const userId = user.user_id || "demo";
      const response = await agentApi.getDashboard(userId);
      setData(response);
    } catch (err) {
      console.error("Dashboard fetch failed", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (preloadedData) {
      setData(preloadedData);
      setLoading(false);
    } else {
      fetchData();
    }
  }, []);

  const today = new Date();
  const dateformatted = today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).toUpperCase().replace('.', '');

  // Tactical Window Logic (Client-Side Realtime for generic fallback, but we prefer backend)
  const currentHour = today.getHours();
  const isVoid = currentHour >= 14 && currentHour <= 16;
  const actionWindow = isVoid
    ? { type: 'WARNING', title: 'Cuidado', time: '14h - 16h', desc: 'Lua Void. Evite inícios.' }
    : { type: 'GOLD', title: 'Sorte', time: '09h - 11h', desc: 'Janela Aberta. Aproveite.' };


  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#32ADE6]/30 border-t-[#32ADE6] rounded-full animate-spin"></div>
        <p className="text-[#32ADE6] text-sm font-medium tracking-widest uppercase animate-pulse">Sincronizando...</p>
      </div>
    );
  }

  // Explicit Error State
  if (error || !data) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col pt-12">
        {/* Minimal Header */}
        <div className="px-6 pb-4 flex justify-between items-center">
          <h1 className="text-white text-[28px] font-bold tracking-tight leading-none">Dashboard</h1>
        </div>
        <ErrorState onRetry={fetchData} />
      </div>
    );
  }

  const displayData = data;

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-black text-white pb-32 overflow-hidden font-sans selection:bg-[#32ADE6]/30">
      <SEOHead
        title="Dashboard"
        description="Seu Dashboard Astrológico Diário."
        path="/dashboard"
      />

      {/* Main Content */}
      <div
        className="flex flex-col w-full animate-fade-in"
      >
        {/* Header */}
        <div className="px-6 pt-12 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-[#8e8e93] text-[13px] font-semibold uppercase tracking-wide mb-0.5">Visão Geral</h2>
            <h1 className="text-white text-[28px] font-bold tracking-tight leading-none">Sua Bússola</h1>
          </div>

          <div
            onClick={() => navigate('/onboarding')}
            className="size-12 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer hover:border-white/30 transition-colors active:scale-95"
          >
            <span className="text-xl font-bold text-white/80 w-full h-full flex items-center justify-center">
              {user.avatar ? <img src={user.avatar} alt="User" className="w-full h-full object-cover" /> : (user.full_name ? user.full_name.charAt(0).toUpperCase() : <Icon name="person" className="text-white/50" />)}
            </span>
          </div>
        </div>

        {/* HERO: Daily Sync Rings */}
        <div className="px-4 mb-6">
          <div className="bg-[#1C1C1E] rounded-[24px] p-6 shadow-2xl shadow-black/50 border border-white/5 relative overflow-hidden">

            <div className="flex justify-between items-start mb-2">
              <h3 className="text-[#32ADE6] text-[13px] font-bold uppercase tracking-wider">Seu Ritmo</h3>
              <span className="text-[#8e8e93] text-[13px] font-medium tracking-wide">{dateformatted}</span>
            </div>

            <DailySyncRings
              mind={displayData.score_mental}
              body={displayData.score_physical}
              soul={displayData.score_emotional}
            />

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#32ADE6]"></div>
                  <span className="text-[11px] uppercase font-bold text-[#8e8e93] tracking-wider">Mente</span>
                </div>
                <span className="text-white text-[16px] font-bold tracking-tight">{displayData.score_mental}%</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#A4C400]"></div>
                  <span className="text-[11px] uppercase font-bold text-[#8e8e93] tracking-wider">Corpo</span>
                </div>
                <span className="text-white text-[16px] font-bold tracking-tight">{displayData.score_physical}%</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#ec4899]"></div>
                  <span className="text-[11px] uppercase font-bold text-[#8e8e93] tracking-wider">Alma</span>
                </div>
                <span className="text-white text-[16px] font-bold tracking-tight">{displayData.score_emotional}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2x2 Bento Grid - The 4 Critical Cards */}
        <div className="px-4 grid grid-cols-2 gap-3 mb-3">

          {/* 1. MENTAL: Mente */}
          <div
            onClick={() => navigate('/mind', { state: { score: displayData.score_mental } })}
            className="bg-[#1C1C1E] rounded-[22px] p-5 border border-white/5 flex flex-col h-[160px] active:scale-[0.98] transition-all duration-300 relative cursor-pointer group hover:-translate-y-1 hover:border-[#D6582C]/50 hover:shadow-[0_4px_20px_rgba(214,88,44,0.2)]"
          >
            <div className="flex justify-between items-start mb-auto">
              <div className="flex items-center gap-2">
                <Icon name="psychology" className="text-[#32ADE6] text-[20px]" />
                <h4 className="text-[#32ADE6] text-[11px] font-bold uppercase tracking-wider">Mente</h4>
              </div>
            </div>
            <div className="mb-1">
              <span className="text-white text-[18px] font-bold tracking-tight leading-tight block mb-1 break-words">{displayData.next_window_focus || "Foco"}</span>
              <p className="text-[#8e8e93] text-[12px] font-medium leading-snug line-clamp-3">{displayData.next_window_desc}</p>
            </div>
          </div>

          {/* 2. PHYSICAL: Corpo */}
          <div
            onClick={() => navigate('/physical', { state: { score: displayData.score_physical } })}
            className="bg-[#1C1C1E] rounded-[22px] p-5 border border-white/5 flex flex-col h-[160px] active:scale-[0.98] transition-all duration-300 relative cursor-pointer group hover:-translate-y-1 hover:border-[#D6582C]/50 hover:shadow-[0_4px_20px_rgba(214,88,44,0.2)]"
          >
            <div className="flex justify-between items-start mb-auto">
              <div className="flex items-center gap-2">
                <Icon name="bolt" className="text-[#A4C400] text-[20px]" />
                <h4 className="text-[#A4C400] text-[11px] font-bold uppercase tracking-wider">Corpo</h4>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`w-1 h-2.5 rounded-[1px] ${i <= 3 ? 'bg-[#A4C400]' : 'bg-white/10'}`}></div>
                ))}
              </div>
            </div>
            <div className="mb-1">
              <span className="text-white text-[18px] font-bold tracking-tight leading-tight block mb-1 break-words">{displayData.transit_title || "Energia"}</span>
              <p className="text-[#8e8e93] text-[12px] font-medium leading-snug line-clamp-3">{displayData.transit_desc}</p>
            </div>
          </div>

          {/* 3. EMOTIONAL: Emoções */}
          <div
            onClick={() => navigate('/emotional', { state: { score: displayData.score_emotional } })}
            className="bg-[#1C1C1E] rounded-[22px] p-5 border border-white/5 flex flex-col h-[160px] active:scale-[0.98] transition-all duration-300 relative cursor-pointer group hover:-translate-y-1 hover:border-[#D6582C]/50 hover:shadow-[0_4px_20px_rgba(214,88,44,0.2)]"
          >
            <div className="flex justify-between items-start mb-auto">
              <div className="flex items-center gap-2">
                <Icon name="water_drop" className="text-[#ec4899] text-[20px]" />
                <h4 className="text-[#ec4899] text-[11px] font-bold uppercase tracking-wider">Alma</h4>
              </div>
            </div>
            <div className="mb-1">
              <span className="text-white text-[18px] font-bold tracking-tight leading-tight block mb-1 break-words">{displayData.astral_alert_title || "Emoção"}</span>
              <p className="text-[#8e8e93] text-[12px] font-medium leading-snug line-clamp-3">{displayData.astral_alert_desc}</p>
            </div>
          </div>

          {/* 4. TACTICAL: Melhor Horário (Kept Local for Realtime Clock visual, but could use backend) */}
          <div
            onClick={() => navigate('/action')}
            className="bg-[#1C1C1E] rounded-[22px] p-5 border border-white/5 flex flex-col h-[160px] active:scale-[0.98] transition-all duration-300 relative cursor-pointer group hover:-translate-y-1 hover:border-[#D6582C]/50 hover:shadow-[0_4px_20px_rgba(214,88,44,0.2)]"
          >
            <div className="flex justify-between items-start mb-auto">
              <div className="flex items-center gap-2">
                <Icon name={actionWindow.type === 'WARNING' ? 'warning' : 'stars'} className={actionWindow.type === 'WARNING' ? 'text-red-500' : 'text-white'} style={{ fontSize: '20px' }} />
                <h4 className={`${actionWindow.type === 'WARNING' ? 'text-red-500' : 'text-white/60'} text-[11px] font-bold uppercase tracking-wider`}>
                  {actionWindow.type === 'WARNING' ? 'Cuidado' : 'Horário Bom'}
                </h4>
              </div>
            </div>
            <div className="mb-1">
              <span className="text-white text-[22px] font-bold leading-none block mb-0.5 tracking-tighter whitespace-nowrap">{actionWindow.time}</span>
              <p className="text-[#8e8e93] text-[13px] font-medium leading-snug">
                {actionWindow.desc}
              </p>
            </div>
          </div>

        </div>

        {/* 5. INSIGHT OF THE DAY (Synthesis Card) */}
        <div className="px-4">
          <div className="bg-[#1C1C1E] rounded-[22px] p-6 border border-white/5 flex flex-col gap-3 relative overflow-hidden">
            {/* Subtle gradient accent at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#32ADE6] via-[#ec4899] to-[#A4C400] opacity-50"></div>

            <div className="flex items-center gap-2.5 mb-1">
              <Icon name="auto_awesome" className="text-white/80" />
              <h4 className="text-white/80 text-[13px] font-bold uppercase tracking-wider">Insight do Dia</h4>
            </div>
            <p className="text-white text-[20px] font-medium leading-relaxed font-display italic">
              "{displayData.daily_quote}"
            </p>
          </div>
        </div>

        {/* PROMO: System Upgrades (Bottom) */}
        <div className="px-4 mt-6">
          <ShopPromoCard />
        </div>

      </div>
    </div >
  );
};

export default Dashboard;
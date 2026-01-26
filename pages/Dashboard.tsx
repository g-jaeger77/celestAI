import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Icon from '../components/Icon';
import ShopPromoCard from '../components/ShopPromoCard';
import DailySyncRings from '../components/charts/DailySyncRings';
import { motion, AnimatePresence } from 'framer-motion';

import { calculateBioMetrics } from '../utils/calculateScores';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();


  // Retrieve user name for seeding the metrics
  const getUserName = () => {
    try {
      const saved = localStorage.getItem('user_birth_data');
      if (saved) return JSON.parse(saved).full_name || "User";
    } catch (e) { }
    return "User";
  };

  const scores = calculateBioMetrics(getUserName());

  const today = new Date();
  const dateformatted = today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).toUpperCase().replace('.', '');

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-black text-white pb-32 overflow-hidden font-sans selection:bg-[#32ADE6]/30">
      <Helmet>
        <title>Dashboard | Celest AI</title>
        <meta name="description" content="Seu Dashboard Astrológico Diário." />
      </Helmet>

      {/* Main Content */}
      <div
        className="flex flex-col w-full animate-fade-in"
      >
        {/* Header */}
        {/* Header */}
        <div className="px-6 pt-12 pb-4 flex justify-between items-center">
          {/* User Profile / Name - Click to Edit */}
          <div>
            <h2 className="text-[#8e8e93] text-[13px] font-semibold uppercase tracking-wide mb-0.5">Visão Geral</h2>
            {/* Dynamic Name or Default */}
            <h1 className="text-white text-[28px] font-bold tracking-tight leading-none">Sua Bússola</h1>
          </div>

          {/* Avatar - Syncs with Name Initial or Image - Click to Edit */}
          <div
            onClick={() => navigate('/onboarding')}
            className="size-12 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer hover:border-white/30 transition-colors active:scale-95"
          >
            {/* Dynamic Avatar or Initial */}
            <span className="text-xl font-bold text-white/80 w-full h-full flex items-center justify-center">
              {(() => {
                try {
                  const saved = localStorage.getItem('user_birth_data');
                  if (saved) {
                    const parsed = JSON.parse(saved);
                    // Check for Avatar Image first
                    if (parsed.avatar) {
                      return <img src={parsed.avatar} alt="User" className="w-full h-full object-cover" />;
                    }
                    // Fallback to Initial
                    return parsed.full_name ? parsed.full_name.charAt(0).toUpperCase() : <Icon name="person" className="text-white/50" />;
                  }
                } catch (e) { }
                return <Icon name="person" className="text-white/50" />;
              })()}
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
              mind={scores.mindScore || 0}
              body={scores.bodyScore || 0}
              soul={scores.soulScore || 0}
            />

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex flex-col items-center gap-1">
                {/* Mind Legend */}
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#32ADE6]"></div>
                  <span className="text-[11px] uppercase font-bold text-[#8e8e93] tracking-wider">Mente</span>
                </div>
                <span className="text-white text-[16px] font-bold tracking-tight">{scores.mindScore}%</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                {/* Body Legend */}
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#A4C400]"></div>
                  <span className="text-[11px] uppercase font-bold text-[#8e8e93] tracking-wider">Corpo</span>
                </div>
                <span className="text-white text-[16px] font-bold tracking-tight">{scores.bodyScore}%</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                {/* Soul Legend */}
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#AF52DE]"></div>
                  <span className="text-[11px] uppercase font-bold text-[#8e8e93] tracking-wider">Alma</span>
                </div>
                <span className="text-white text-[16px] font-bold tracking-tight">{scores.soulScore}%</span>
              </div>
            </div>
          </div>
        </div>





        {/* 2x2 Bento Grid - The 4 Critical Cards */}
        <div className="px-4 grid grid-cols-2 gap-3 mb-3">

          {/* 1. MENTAL: Mente */}
          <div
            onClick={() => navigate('/mind')}
            className="bg-[#1C1C1E] rounded-[22px] p-5 border border-white/5 flex flex-col h-[160px] active:scale-[0.98] transition-transform relative cursor-pointer hover:bg-white/5"
          >
            <div className="flex justify-between items-start mb-auto">
              <div className="flex items-center gap-2">
                <Icon name="psychology" className="text-[#32ADE6] text-[20px]" />
                <h4 className="text-[#32ADE6] text-[11px] font-bold uppercase tracking-wider">Mente</h4>
              </div>
            </div>
            <div className="mb-1">
              <span className="text-white text-[20px] font-bold tracking-tight leading-tight block mb-1">{scores.neuralState}</span>
              <p className="text-[#8e8e93] text-[13px] font-medium leading-snug">{scores.neuralDesc}</p>
            </div>
          </div>

          {/* 2. PHYSICAL: Corpo */}
          <div
            onClick={() => navigate('/physical')}
            className="bg-[#1C1C1E] rounded-[22px] p-5 border border-white/5 flex flex-col h-[160px] active:scale-[0.98] transition-transform relative cursor-pointer hover:bg-white/5"
          >
            <div className="flex justify-between items-start mb-auto">
              <div className="flex items-center gap-2">
                <Icon name="bolt" className="text-[#A4C400] text-[20px]" />
                <h4 className="text-[#A4C400] text-[11px] font-bold uppercase tracking-wider">Corpo</h4>
              </div>
              {/* Mini Battery bar visualization */}
              <div className="flex gap-0.5">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`w-1 h-2.5 rounded-[1px] ${i <= 3 ? 'bg-[#A4C400]' : 'bg-white/10'}`}></div>
                ))}
              </div>
            </div>
            <div className="mb-1">
              <span className="text-white text-[20px] font-bold tracking-tight leading-tight block mb-1">{scores.batteryState}</span>
              <p className="text-[#8e8e93] text-[13px] font-medium leading-snug line-clamp-2">{scores.batteryDesc}</p>
            </div>
          </div>

          {/* 3. EMOTIONAL: Emoções */}
          <div
            onClick={() => navigate('/emotional')}
            className="bg-[#1C1C1E] rounded-[22px] p-5 border border-white/5 flex flex-col h-[160px] active:scale-[0.98] transition-transform relative cursor-pointer hover:bg-white/5"
          >
            <div className="flex justify-between items-start mb-auto">
              <div className="flex items-center gap-2">
                <Icon name="water_drop" className="text-[#AF52DE] text-[20px]" />
                <h4 className="text-[#AF52DE] text-[11px] font-bold uppercase tracking-wider">Alma</h4>
              </div>
            </div>
            <div className="mb-1">
              <span className="text-white text-[20px] font-bold tracking-tight leading-tight block mb-1">{scores.moodState}</span>
              <p className="text-[#8e8e93] text-[13px] font-medium leading-snug line-clamp-2">{scores.moodDesc}</p>
            </div>
          </div>

          {/* 4. TACTICAL: Melhor Horário */}
          <div
            onClick={() => navigate('/action')}
            className="bg-[#1C1C1E] rounded-[22px] p-5 border border-white/5 flex flex-col h-[160px] active:scale-[0.98] transition-transform relative cursor-pointer hover:bg-white/5"
          >
            <div className="flex justify-between items-start mb-auto">
              <div className="flex items-center gap-2">
                <Icon name={scores.actionWindow?.type === 'WARNING' ? 'warning' : 'stars'} className={scores.actionWindow?.type === 'WARNING' ? 'text-red-500' : 'text-white'} style={{ fontSize: '20px' }} />
                <h4 className={`${scores.actionWindow?.type === 'WARNING' ? 'text-red-500' : 'text-white/60'} text-[11px] font-bold uppercase tracking-wider`}>
                  {scores.actionWindow?.type === 'WARNING' ? 'Cuidado' : 'Horário Bom'}
                </h4>
              </div>
            </div>
            <div className="mb-1">
              <span className="text-white text-[28px] font-bold leading-none block mb-0.5 tracking-tighter">{scores.actionWindow?.time}</span>
              <p className="text-[#8e8e93] text-[13px] font-medium leading-snug">
                {scores.actionWindow?.desc}
              </p>
            </div>
          </div>

        </div>

        {/* 5. INSIGHT OF THE DAY (Synthesis Card) */}
        <div className="px-4">
          <div className="bg-[#1C1C1E] rounded-[22px] p-6 border border-white/5 flex flex-col gap-3 relative overflow-hidden">
            {/* Subtle gradient accent at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#32ADE6] via-[#AF52DE] to-[#A4C400] opacity-50"></div>

            <div className="flex items-center gap-2.5 mb-1">
              <Icon name="auto_awesome" className="text-white/80" />
              <h4 className="text-white/80 text-[13px] font-bold uppercase tracking-wider">Insight do Dia</h4>
            </div>
            <p className="text-white text-[20px] font-medium leading-relaxed font-display italic">
              "{scores.dailyInsight}"
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
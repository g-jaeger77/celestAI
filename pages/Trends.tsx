import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import BottomNav from '../components/BottomNav';
import Icon from '../components/Icon';
import RadarChart from '../components/connections/RadarChart'; // Import existing Radar Component
import { calculateTrends } from '../utils/trendsLogic';

const Trends: React.FC = () => {
    const [trends, setTrends] = useState<any>(null);
    const [partnerName, setPartnerName] = useState<string | null>(null);

    useEffect(() => {
        // 1. Get User Data
        let userName = "User";
        try {
            const savedUser = localStorage.getItem('user_birth_data');
            if (savedUser) userName = JSON.parse(savedUser).full_name || "User";
        } catch (e) { }

        // 2. Get Partner Data (First connection)
        let foundPartner = null;
        try {
            const savedConns = localStorage.getItem('celest_connections');
            if (savedConns) {
                const conns = JSON.parse(savedConns);
                if (Array.isArray(conns) && conns.length > 0) {
                    foundPartner = conns[0].name; // Use the most recent/first partner
                    setPartnerName(foundPartner);
                }
            }
        } catch (e) { }

        // 3. Calculate Trends
        const data = calculateTrends(userName, new Date().toDateString(), foundPartner || undefined);
        setTrends(data);
    }, []);

    if (!trends) return <div className="min-h-screen bg-black" />;

    // --- TRANSFORM DATA FOR RADAR CHART (Projecting Current Moment) ---
    // User requested "Personal, Professional, Social" alignment for "today"
    // We will map the daily scores (Mental, Physical, Emotional) to these pillars for visualization
    const radarData = [
        { label: 'Pessoal', A: trends.weeklyData[6].emotional, B: 100, fullMark: 100 }, // Emotional -> Personal
        { label: 'Profissional', A: trends.weeklyData[6].mental, B: 100, fullMark: 100 }, // Mental -> Professional
        { label: 'Social', A: trends.weeklyData[6].physical, B: 100, fullMark: 100 },   // Physical -> Social (Action)
    ];

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-24 bg-black">
            <Helmet>
                <title>Tendências | Celest AI</title>
                <meta name="description" content="Acompanhe suas tendências de alinhamento cósmico diário." />
            </Helmet>

            <header className="px-5 pt-8 pb-2">
                <h1 className="text-[34px] font-bold leading-tight tracking-tight text-white mb-1">
                    Tendências
                </h1>
                {partnerName && (
                    <p className="text-xs text-slate-400 font-medium animate-fade-in flex items-center gap-1.5">
                        <Icon name="favorite" className="text-pink-500 text-[10px]" />
                        Sinergia com <span className="text-white">{partnerName}</span>
                    </p>
                )}
            </header>

            {/* Time filters removed as per user request for current moment focus */}
            <div className="px-5 pt-1 pb-4">
                <p className="text-xs text-slate-500 font-medium text-center uppercase tracking-widest">
                    Análise em Tempo Real
                </p>
            </div>

            <section className="flex flex-col gap-2 px-5 pt-2 pb-6">
                <div className="flex flex-col items-center mb-4">
                    <h2 className="text-[13px] font-semibold text-slate-400 uppercase tracking-wide text-center">
                        Alinhamento Atual
                    </h2>
                    <div className="flex items-baseline gap-3 mt-1 justify-center">
                        <span className="text-[56px] font-bold tracking-tight text-white leading-none">{trends.alignmentScore}%</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${trends.isPositive ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                        <Icon name={trends.isPositive ? "trending_up" : "trending_down"} className="text-[14px]" />
                        <span className="text-[12px] font-bold">{trends.trendValue}</span>
                    </div>
                </div>

                {/* RADAR CHART VISUALIZATION */}
                <div className="w-full h-[320px] flex items-center justify-center relative">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-cyan-500/10 blur-[50px] rounded-full pointer-events-none"></div>

                    <RadarChart
                        data={radarData}
                        theme="work" // Cyan theme
                        size={300}
                        userLabel="Você"
                        partnerLabel="" // Hide partner layer implicitly by data manipulation or if component supports single
                        showLegend={false}
                    />
                </div>

                {/* Labels/Legend Manually for Design */}
                <div className="flex justify-center gap-6 mt-[-20px] relative z-20">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Pessoal</span>
                        <span className="text-lg font-bold text-[#AF52DE]">{Math.round(trends.weeklyData[6].emotional)}%</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Profissional</span>
                        <span className="text-lg font-bold text-[#22d3ee]">{Math.round(trends.weeklyData[6].mental)}%</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Social</span>
                        <span className="text-lg font-bold text-[#f59e0b]">{Math.round(trends.weeklyData[6].physical)}%</span>
                    </div>
                </div>

            </section>

            <div className="mx-5 h-px bg-white/5"></div>

            <section className="flex flex-col px-5 py-6 gap-4">
                <h3 className="text-[15px] font-bold text-white uppercase tracking-wide">Insights do Momento</h3>

                {trends.insights.slice(0, 2).map((insight: any, i: number) => (
                    <div key={i} className="group relative flex items-start gap-4 rounded-[20px] bg-[#1C1C1E] p-5 border border-white/5 active:scale-[0.98] transition-all hover:bg-white/5">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-${insight.color}-500/10 text-${insight.color}-400 border border-${insight.color}-500/20`}>
                            <Icon name={insight.icon} className="text-[20px]" />
                        </div>

                        <div className="flex flex-col flex-1 gap-1">
                            <h4 className="text-[16px] font-bold text-white leading-tight">{insight.title}</h4>
                            <p className="text-[13px] text-slate-400 leading-relaxed font-medium">
                                {insight.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </section>

            <BottomNav active="report" />
        </div>
    );
};

export default Trends;
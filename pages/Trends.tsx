import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import BottomNav from '../components/BottomNav';
import Icon from '../components/Icon';
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

    // Generate Chart Path
    const width = 375;
    const height = 160;
    const points = trends.weeklyData.map((val: number, i: number) => {
        const x = (i / 6) * width;
        const y = height - (val / 100) * height; // Invert Y
        return `${x},${y}`;
    });

    // Cubic Bezier approximation for smoothness
    const pathD = `M ${points[0]} ` + points.slice(1).map((p: string, i: number) => {
        const [currX, currY] = p.split(',').map(Number);
        const [prevX, prevY] = points[i].split(',').map(Number);
        const cp1X = prevX + (currX - prevX) / 2;
        const cp1Y = prevY;
        const cp2X = prevX + (currX - prevX) / 2;
        const cp2Y = currY;
        return `C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${currX},${currY}`;
    }).join(' ');

    const fillPath = `${pathD} V ${height + 60} H 0 Z`;

    // Generate Dates
    const today = new Date();
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        dates.push(d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).split('.')[0]);
    }

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-24 bg-black">
            <Helmet>
                <title>Tendências | Celest AI</title>
                <meta name="description" content="Acompanhe suas tendências de alinhamento cósmico diário e semanal." />
            </Helmet>
            <header className="px-4 pt-8 pb-2">
                <h1 className="text-[34px] font-bold leading-tight tracking-tight text-white">
                    Tendências
                </h1>
                {partnerName && (
                    <p className="text-xs text-slate-400 font-medium mt-1 animate-fade-in">
                        Sinergia ativa com <span className="text-pink-400">{partnerName}</span>
                    </p>
                )}
            </header>

            <div className="px-4 py-4">
                <div className="flex h-9 w-full items-center justify-center rounded-lg bg-[#1C1C1E] p-0.5">
                    {['Semana', 'Mês', 'Ano'].map((t, i) => (
                        <button
                            key={t}
                            className={`flex cursor-pointer h-full flex-1 items-center justify-center rounded-[7px] transition-all duration-200 text-xs font-semibold leading-normal ${i === 0 ? 'bg-[#2C2C2E] text-white shadow-sm' : 'text-slate-400'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <section className="flex flex-col gap-1 px-4 pt-4 pb-8">
                <div className="flex flex-col">
                    <h2 className="text-base font-semibold text-slate-400">
                        {partnerName ? 'Alinhamento Conjunto' : 'Alinhamento Cósmico'}
                    </h2>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-[42px] font-bold tracking-tight text-white">{trends.alignmentScore}%</span>
                        <span className={`text-sm font-medium flex items-center ${trends.isPositive ? 'text-green-500' : 'text-rose-500'}`}>
                            <Icon name={trends.isPositive ? "trending_up" : "trending_down"} className="text-[16px] mr-0.5" />
                            {trends.trendValue}
                        </span>
                    </div>
                </div>

                <div className="relative w-full h-[220px] mt-6">
                    <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-600 font-medium pointer-events-none z-0">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <div key={i} className="border-b border-dashed border-slate-800 w-full h-0"></div>
                        ))}
                    </div>
                    <svg className="absolute inset-0 z-10 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox={`0 0 ${width} 220`}>
                        <defs>
                            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#0ddff2" stopOpacity="0.3"></stop>
                                <stop offset="100%" stopColor="#0ddff2" stopOpacity="0"></stop>
                            </linearGradient>
                            <filter height="140%" id="glow" width="140%" x="-20%" y="-20%">
                                <feGaussianBlur result="blur" stdDeviation="4"></feGaussianBlur>
                                <feComposite in="SourceGraphic" in2="blur" operator="over"></feComposite>
                            </filter>
                        </defs>
                        <path d={fillPath} fill="url(#chartGradient)"></path>
                        <path d={pathD} fill="none" filter="url(#glow)" stroke="#0ddff2" strokeLinecap="round" strokeWidth="3"></path>
                        {/* Dot on last point */}
                        <circle cx={width} cy={height - (trends.weeklyData[6] / 100 * height)} fill="#000000" r="6" stroke="#0ddff2" strokeWidth="3"></circle>
                    </svg>
                </div>
                <div className="flex justify-between px-2 pt-4">
                    {dates.filter((_, i) => i % 2 === 0 || i === 6).map(d => (
                        <p key={d} className="text-slate-500 text-[11px] font-bold uppercase tracking-wide">{d}</p>
                    ))}
                </div>
            </section>

            <div className="mx-4 h-px bg-slate-800"></div>

            <section className="flex flex-col px-4 py-6 gap-4">
                <h3 className="text-lg font-bold text-white">Destaques do Ciclo</h3>

                {trends.insights.map((insight: any, i: number) => (
                    <div key={i} className={`flex items-center gap-4 rounded-[24px] bg-[#1C1C1E] p-5 border border-white/5 animate-slide-up delay-${i * 100}`}>
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-${insight.color}-500/20 text-${insight.color}-400`}>
                            <Icon name={insight.icon} />
                        </div>
                        <div className="flex flex-col flex-1 gap-1">
                            <div className="flex justify-between items-center">
                                <h4 className="text-[17px] font-semibold text-white leading-tight">{insight.title}</h4>
                                <span className={`text-xs font-medium text-slate-500 bg-white/10 px-2 py-1 rounded-full`}>{insight.score}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-[15px] text-slate-400">{insight.desc} • {insight.duration}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            <BottomNav active="report" />
        </div>
    );
};

export default Trends;
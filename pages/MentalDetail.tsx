import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../components/Icon';

interface DetailData {
    score: number;
    title: string;
    trend_data: { day: string; value: number }[];
    analysis: string;
    recommendation: string;
}

const MentalDetail: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const initialScore = location.state?.score;

    const [data, setData] = useState<DetailData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cache Busting specific endpoint
        fetch(`http://localhost:8000/agent/detail/mental?user_id=demo&ts=${Date.now()}`)
            .then(res => res.json())
            .then(d => {
                setData(d);
                setLoading(false);
            })
            .catch(err => { console.error(err); setLoading(false); });
    }, []);

    const displayScore = initialScore !== undefined ? initialScore : (data?.score);

    return (
        <div className="text-slate-900 dark:text-white font-display transition-colors duration-200 min-h-screen bg-transparent">
            <header className="flex items-center px-4 pt-6 pb-2 justify-between bg-transparent">
                <button onClick={() => navigate(-1)} className="text-primary-mental flex size-10 items-center justify-center rounded-full hover:bg-gray-800 transition-colors">
                    <Icon name="arrow_back_ios_new" className="text-[28px]" />
                </button>
                <div className="flex items-center gap-3">
                    <button className="text-primary-mental flex size-10 items-center justify-center rounded-full hover:bg-gray-800 transition-colors">
                        <Icon name="calendar_today" className="text-[28px]" />
                    </button>
                </div>
            </header>

            <section className="px-6 pt-2 pb-6">
                <h2 className="text-primary-mental text-sm font-semibold tracking-wider uppercase mb-1">Vitalidade Cósmica</h2>
                <h1 className="text-white text-4xl font-extrabold leading-tight tracking-tight">Mental <span className="text-primary-mental">(Mercúrio)</span></h1>
            </section>

            <section className="px-6 pb-8">
                <div className="flex flex-col gap-1">
                    <span className="text-slate-400 text-lg font-medium">Status Atual</span>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-white tracking-tight text-[64px] font-bold leading-none">
                            {displayScore !== undefined ? displayScore : "--"}%
                        </h2>
                        <Icon name="check_circle" className="text-primary-mental animate-pulse" />
                    </div>
                </div>
            </section>

            <section className="px-4 pb-8">
                <div className="bg-card-dark rounded-3xl p-6 shadow-lg border border-white/5 relative bg-[#1C1C1E]">
                    <div className="flex justify-between items-end mb-6 relative z-10">
                        <div>
                            <p className="text-white text-lg font-semibold">Tendência (5 Dias)</p>
                            <p className="text-slate-400 text-sm">Passado & Futuro Próximo</p>
                        </div>
                    </div>

                    <div className="relative h-[160px] w-full pt-4">
                        {/* Background Grid Lines - Highly Visible */}
                        <div className="absolute inset-x-0 bottom-0 top-4 flex flex-col justify-between pointer-events-none z-0">
                            {[100, 75, 50, 25, 0].map((line, i) => (
                                <div key={i} className="w-full border-t border-white/10 relative">
                                    <span className="absolute -top-2.5 -right-4 text-[9px] text-white/20">{line}%</span>
                                </div>
                            ))}
                        </div>

                        {/* Bars Container */}
                        <div className="absolute inset-0 flex items-end justify-between px-4 pb-0 pt-4 z-10">
                            {loading && !data ? (
                                <p className="text-slate-500 w-full text-center self-center">Carregando...</p>
                            ) : (
                                data?.trend_data.map((item, i) => {
                                    const isToday = i === 2;
                                    return (
                                        <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group cursor-pointer relative h-full">
                                            {isToday && (
                                                <div className="absolute top-0 bg-[#33ade6] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg z-20 whitespace-nowrap mb-2 transform -translate-y-full">
                                                    Hoje: {displayScore !== undefined ? displayScore : item.value}%
                                                </div>
                                            )}
                                            <div
                                                className={`w-full max-w-[24px] rounded-t-sm transition-all duration-500`}
                                                style={{
                                                    height: `${isToday && displayScore !== undefined ? displayScore : item.value}%`,
                                                    backgroundColor: isToday ? '#33ade6' : '#33ade6',
                                                    opacity: isToday ? 1 : 0.2,
                                                    boxShadow: isToday ? '0 0 20px rgba(51, 173, 230, 0.4)' : 'none'
                                                }}
                                            ></div>
                                            <span className={`text-[10px] uppercase font-bold mt-2 ${isToday ? 'text-[#33ade6]' : 'text-slate-500'}`}>
                                                {item.day}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-4 pb-24">
                <div className="relative bg-card-dark rounded-3xl overflow-hidden shadow-lg border border-white/5">
                    <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 80% 20%, #32ADE6 0%, transparent 60%)' }}></div>
                    <div className="relative p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-2 mb-1">
                            <Icon name="auto_awesome" className="text-primary-mental text-xl" />
                            <h3 className="text-primary-mental text-sm font-bold uppercase tracking-wider">Insight Diário</h3>
                        </div>
                        <div>
                            <p className="text-white text-lg font-semibold leading-tight mb-3">Análise</p>
                            <p className="text-slate-300 text-[15px] leading-relaxed font-normal">
                                {loading ? "..." : data?.analysis}
                            </p>

                            <p className="text-white text-lg font-semibold leading-tight mt-6 mb-3">Prática</p>
                            <p className="text-slate-300 text-[15px] leading-relaxed font-normal">
                                {loading ? "..." : data?.recommendation}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MentalDetail;
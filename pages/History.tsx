
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { agentApi } from '../api/agent';

interface HistoryItem {
    date: string;
    mental_score: number;
    physical_score: number;
    emotional_score: number;
}

const History: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                // Get ID
                let userId = "demo";
                try {
                    const saved = localStorage.getItem('user_birth_data');
                    if (saved) userId = JSON.parse(saved).user_id || "demo";
                } catch { }

                // Fetch (We need to add this to api/agent.ts too, but for now assuming direct fetch or I'll update agent.ts next)
                const res = await fetch(`http://localhost:8000/agent/history?user_id=${userId}`);
                const json = await res.json();
                setData(json);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, []);

    const renderBar = (score: number, colorClass: string) => {
        // Height percentage
        return (
            <div className="flex-1 flex flex-col justify-end gap-1 group">
                <div
                    className={`w-full rounded-t-sm opacity-60 group-hover:opacity-100 transition-all ${colorClass}`}
                    style={{ height: `${score}%` }}
                ></div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans pb-10">
            {/* Header */}
            <header className="px-6 py-6 flex items-center gap-4 bg-[#050505]/80 backdrop-blur sticky top-0 z-50">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
                    <Icon name="arrow_back" className="text-white" />
                </button>
                <h1 className="text-xl font-bold tracking-tight">Time Travel Protocol</h1>
            </header>

            <div className="px-6 space-y-8">
                {/* Intro */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/20 to-black border border-indigo-500/20">
                    <div className="flex items-center gap-3 mb-2">
                        <Icon name="history" className="text-indigo-400" />
                        <h2 className="text-lg font-bold text-indigo-100">Registros Akáshicos</h2>
                    </div>
                    <p className="text-sm text-indigo-300/80 leading-relaxed">
                        Análise longitudinal da sua bio-energia. Identifique ciclos, padrões e anomalias temporais.
                    </p>
                </div>

                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <Icon name="sync" className="animate-spin text-gray-500 text-2xl" />
                    </div>
                ) : (
                    <>
                        {/* Mental Chart */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm px-1">
                                <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px]">Freq. Mental</span>
                                <span className="text-gray-600 text-[10px]">30 DIAS</span>
                            </div>
                            <div className="h-40 bg-[#111] rounded-xl border border-white/5 p-4 flex gap-1 items-end relative overflow-hidden">
                                {data.map((d, i) => (
                                    <div key={i} className="flex-1 h-full flex items-end tooltip" title={`${d.date}: ${d.mental_score}%`}>
                                        <div
                                            className="w-full bg-blue-500 hover:bg-blue-400 transition-all rounded-t-[2px]"
                                            style={{ height: `${d.mental_score}%`, opacity: 0.4 + (i / data.length) * 0.6 }}
                                        />
                                    </div>
                                ))}
                                {/* Grid Lines */}
                                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 opacity-20">
                                    <div className="border-t border-white/50 w-full"></div>
                                    <div className="border-t border-white/50 w-full"></div>
                                    <div className="border-t border-white/50 w-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Physical Chart */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm px-1">
                                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Vigor Físico</span>
                            </div>
                            <div className="h-40 bg-[#111] rounded-xl border border-white/5 p-4 flex gap-1 items-end relative overflow-hidden">
                                {data.map((d, i) => (
                                    <div key={i} className="flex-1 h-full flex items-end" title={`${d.date}: ${d.physical_score}%`}>
                                        <div
                                            className="w-full bg-emerald-500 hover:bg-emerald-400 transition-all rounded-t-[2px]"
                                            style={{ height: `${d.physical_score}%`, opacity: 0.4 + (i / data.length) * 0.6 }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Emotional Chart */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm px-1">
                                <span className="text-purple-400 font-bold uppercase tracking-wider text-[10px]">Campo Emocional</span>
                            </div>
                            <div className="h-40 bg-[#111] rounded-xl border border-white/5 p-4 flex gap-1 items-end relative overflow-hidden">
                                {data.map((d, i) => (
                                    <div key={i} className="flex-1 h-full flex items-end" title={`${d.date}: ${d.emotional_score}%`}>
                                        <div
                                            className="w-full bg-purple-500 hover:bg-purple-400 transition-all rounded-t-[2px]"
                                            style={{ height: `${d.emotional_score}%`, opacity: 0.4 + (i / data.length) * 0.6 }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default History;


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
    const [error, setError] = useState(false);

    const loadHistory = async () => {
        setLoading(true);
        setError(false);
        try {
            // Get ID
            let userId = "demo";
            try {
                const saved = localStorage.getItem('user_birth_data');
                if (saved) userId = JSON.parse(saved).user_id || "demo";
            } catch { }

            // Fetch
            const API_BASE = import.meta.env.VITE_API_URL || "";
            const res = await fetch(`${API_BASE}/agent/history?user_id=${userId}`);
            if (!res.ok) throw new Error("Falha no histórico");

            const json = await res.json();
            setData(json);
        } catch (e) {
            console.error(e);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    // Helper
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
            <Icon name="history_toggle_off" className="text-4xl text-gray-500 mb-2" />
            <p className="text-sm">Nenhum registro encontrado ainda.</p>
        </div>
    );

    if (error) {
        return (
            <div className="min-h-screen bg-[#050505] text-white pt-20 flex flex-col items-center">
                <div className="w-full max-w-sm px-6">
                    <div className="bg-[#1C1C1E] rounded-2xl p-6 text-center border border-red-500/10">
                        <Icon name="error_outline" className="text-red-400 text-3xl mb-3 mx-auto" />
                        <h3 className="text-white font-bold mb-1">Falha na Sincronização</h3>
                        <p className="text-white/50 text-xs mb-4">Não foi possível acessar seus registros akáshicos.</p>
                        <button onClick={loadHistory} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-xs font-bold transition-colors">
                            Tentar Novamente
                        </button>
                    </div>
                    <button onClick={() => navigate(-1)} className="mt-8 text-white/40 text-xs hover:text-white transition-colors">Voltar</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans pb-10">
            {/* Header */}
            <header className="px-6 py-6 flex items-center gap-4 bg-[#050505]/80 backdrop-blur sticky top-0 z-50">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
                    <Icon name="arrow_back" className="text-white" />
                </button>
                <h1 className="text-xl font-bold tracking-tight">Time Travel Protocol</h1>
            </header>

            <div className="px-6 space-y-8 animate-fade-in">
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
                ) : data.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        {/* Charts rendered only if data exists */}
                        {/* Mental Chart */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm px-1">
                                <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px]">Freq. Mental</span>
                                <span className="text-gray-600 text-[10px]">30 DIAS</span>
                            </div>
                            <div className="h-40 bg-[#111] rounded-xl border border-white/5 p-4 flex gap-1 items-end relative overflow-hidden">
                                {data.map((d, i) => (
                                    <div key={i} className="flex-1 h-full flex items-end tooltip group" title={`${d.date}: ${d.mental_score}%`}>
                                        <div
                                            className="w-full bg-blue-500 group-hover:bg-white transition-all rounded-t-[2px]"
                                            style={{ height: `${d.mental_score}%`, opacity: 0.4 + (i / data.length) * 0.6 }}
                                        />
                                    </div>
                                ))}
                                {/* Grid Lines */}
                                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 opacity-10">
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
                                    <div key={i} className="flex-1 h-full flex items-end group" title={`${d.date}: ${d.physical_score}%`}>
                                        <div
                                            className="w-full bg-emerald-500 group-hover:bg-white transition-all rounded-t-[2px]"
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
                                    <div key={i} className="flex-1 h-full flex items-end group" title={`${d.date}: ${d.emotional_score}%`}>
                                        <div
                                            className="w-full bg-purple-500 group-hover:bg-white transition-all rounded-t-[2px]"
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

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import BottomNav from '../components/BottomNav';
import Icon from '../components/Icon';
import RadarChart from '../components/connections/RadarChart';


// New Wheel of Life Page (replacing "Trends")
const Trends: React.FC = () => {
    const [wheelData, setWheelData] = useState<any[]>([]);
    const [harmony, setHarmony] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch Data from Backend
    useEffect(() => {
        const fetchWheel = async () => {
            try {
                // Get User Data
                let user;
                const savedUser = localStorage.getItem('user_birth_data');

                if (savedUser) {
                    user = JSON.parse(savedUser);
                } else {
                    // SECURITY: Removed Demo Fallback. Fail safely.
                    throw new Error("Dados do usuário não encontrados. Realize o Onboarding.");
                }

                // Payload
                const payload = {
                    date: user.birth_date,
                    time: user.birth_time,
                    city: user.birth_city,
                    country: user.country || "BR"
                };

                // Determine API URL (Local vs Prod)
                // Assuming Vite proxy or direct URL. If .env.local has URL use it.
                // For now assuming localhost:8000 based on standard setup or /api proxy
                const API_URL = import.meta.env.VITE_API_URL || "";

                const res = await fetch(`${API_URL}/agent/wheel`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) {
                    const errText = await res.text();
                    throw new Error(`Erro API: ${res.status} - ${errText}`);
                }

                const data = await res.json();
                setWheelData(data.wheel_data);
                setHarmony(data.harmony_score);
            } catch (err: any) {
                console.error(err);
                setError(`Erro: ${err.message || "Falha de Conexão"}`);
            } finally {
                setLoading(false);
            }
        };

        fetchWheel();
    }, []);

    // Transform for RadarChart
    // Existing RadarChart expects { label, A, B, fullMark }
    // A = User value
    const radarChartData = wheelData.map(d => ({
        label: d.label,
        A: d.score,
        B: 100, // Full scale
        fullMark: 100
    }));

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-10 bg-black text-white">
            <Helmet>
                <title>Roda da Vida | Celest AI</title>
                <meta name="description" content="Sua Roda da Vida Astrológica." />
            </Helmet>

            <header className="px-5 pt-8 pb-4">
                <h1 className="text-[32px] font-bold leading-tight">
                    Roda da Vida
                </h1>
                <p className="text-sm text-slate-400">
                    Alinhamento Cósmico por Área
                </p>
            </header>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            ) : error ? (
                <div className="p-5 flex flex-col items-center justify-center gap-4">
                    <div className="text-center text-rose-400 bg-rose-500/10 p-4 rounded-xl border border-rose-500/20">
                        {error}
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm hover:bg-slate-200 transition-colors"
                    >
                        Tentar Novamente
                    </button>
                    {error.includes("Failed to fetch") && (
                        <p className="text-xs text-slate-500 text-center max-w-[250px]">
                            Certifique-se que o backend está rodando: <br />
                            <code className="text-white bg-slate-800 px-1 py-0.5 rounded">python tools/agent_server.py</code>
                        </p>
                    )}
                </div>
            ) : (
                <>
                    <section className="flex flex-col items-center justify-center py-6 relative">
                        {/* Central Score */}
                        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 pointer-events-none">
                            <span className="text-4xl font-bold">{harmony}%</span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-400">Harmonia</span>
                        </div>

                        {/* Chart */}
                        <div className="w-full h-[360px] flex items-center justify-center">
                            <RadarChart
                                data={radarChartData}
                                theme="work"
                                size={340}
                                userLabel="Você"
                                partnerLabel=""
                                showLegend={false}
                            />
                        </div>
                    </section>

                    <div className="mx-5 h-px bg-white/10 my-4"></div>

                    {/* List View Details */}
                    <section className="px-5 flex flex-col gap-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                            Detalhamento das Áreas
                        </h3>
                        {wheelData.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                                <div
                                    className="w-2 h-10 rounded-full"
                                    style={{ backgroundColor: item.color || 'white' }}
                                ></div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">{item.label}</h4>
                                    <div className="w-full bg-black/50 h-1.5 rounded-full mt-1.5 overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${item.score}%`, backgroundColor: item.color || 'white' }}
                                        ></div>
                                    </div>
                                </div>
                                <span className="font-bold text-lg">{item.score}%</span>
                            </div>
                        ))}
                    </section>
                </>
            )}

            {/* BottomNav removed as requested */}
        </div>
    );
};

export default Trends;
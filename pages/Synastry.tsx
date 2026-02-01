
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import ShopPromoCard from '../components/ShopPromoCard';
// Simulation imports REMOVED - Backend is now the single source of truth
import ConnectionCard from '../components/connections/ConnectionCard';

import AddConnectionForm from '../components/connections/AddConnectionForm';
import RadarChart from '../components/connections/RadarChart';
import { SEOHead } from '../components/SEOHead';

const Synastry: React.FC = () => {

    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1 = List, 2 = Result
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null); // Backend offline error
    const [isSheetOpen, setIsSheetOpen] = useState(false); // NOW CONTROLS "ADD PAGE" VIEW

    // Connections State
    const [connections, setConnections] = useState<any[]>([]);

    // Helper: Get User ID
    const getUserId = () => {
        const stored = localStorage.getItem('user_birth_data');
        if (stored) {
            try { return JSON.parse(stored).user_id || null; } catch (e) { return null; }
        }
        return null;
    };

    useEffect(() => {
        const userId = getUserId();
        if (userId) {
            // CLOUD FETCH
            const API_BASE = import.meta.env.VITE_API_URL || "";
            fetch(`${API_BASE}/agent/connections/${userId}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setConnections(data);
                })
                .catch(err => console.warn("Cloud Sync Error", err));
        } else {
            // FALLBACK: LocalStorage
            const stored = localStorage.getItem('celest_connections');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed)) setConnections(parsed);
                } catch (e) { }
            }
        }
    }, []);

    const saveConnection = async (newConn: any) => {
        const userId = getUserId();
        // Optimistic UI Update
        const localId = Date.now().toString(); // temporary ID
        const connWithId = { ...newConn, id: localId, user_id: userId };
        const updated = [connWithId, ...connections];
        setConnections(updated);

        // Trigger simulation immediately for "Impression"
        handleSimulation(connWithId);
        setIsSheetOpen(false);

        // CLOUD SAVE
        if (userId) {
            try {
                const API_BASE = import.meta.env.VITE_API_URL || "";
                const res = await fetch(`${API_BASE}/agent/connections`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(connWithId)
                });
                const savedData = await res.json();
                if (savedData.data && savedData.data.length > 0) {
                    // Update state with REAL ID from DB
                    const realConn = savedData.data[0];
                    setConnections(prev => prev.map(c => c.id === localId ? realConn : c));
                }
            } catch (err) {
                console.error("Failed to save to cloud", err);
            }
        } else {
            localStorage.setItem('celest_connections', JSON.stringify(updated));
        }
    };

    // Result State
    const [result, setResult] = useState<any>(null);
    const [activeConnection, setActiveConnection] = useState<any>(null);

    // NOTE: fetchChartData() REMOVED - All chart data comes from Python Backend now

    const handleSimulation = async (connection: any) => {
        setLoading(true);
        setApiError(null); // Reset error state
        setActiveConnection(connection);

        try {
            // FIX: Narcissus Error - Use Real User Data instead of Hardcoded 1995
            const savedUser = localStorage.getItem('user_birth_data');
            let userName = "Minha Energia";
            let userDate = "1995-05-15"; // Fallback
            let userTime = "12:00";
            let userCity = "São Paulo";

            if (savedUser) {
                try {
                    const parsed = JSON.parse(savedUser);
                    if (parsed.full_name) userName = parsed.full_name;
                    if (parsed.birth_date) userDate = parsed.birth_date;
                    if (parsed.birth_time) userTime = parsed.birth_time;
                    if (parsed.birth_city) userCity = parsed.birth_city;
                } catch (e) {
                    console.error("Failed to parse user context", e);
                }
            }

            // ----------------------------------------------------
            // REAL ASTRONOMY ENGINE (Python Backend)
            // ----------------------------------------------------
            let mathResult: any = {};
            let realAspects: any[] = [];

            try {
                // Determine Context for API
                const targetContext = connection.type === 'social' ? 'social'
                    : connection.type === 'work' ? 'work'
                        : 'love';

                const apiPayload = {
                    user: {
                        name: userName,
                        date: userDate,
                        time: userTime,
                        city: userCity,
                        country: "BR"
                    },
                    partner: {
                        name: connection.name,
                        date: connection.birthDate, // Must be YYYY-MM-DD
                        time: connection.birthTime || "12:00",
                        city: connection.birthCity || "Unknown",
                        country: "BR"
                    },
                    context: targetContext
                };

                const API_BASE = import.meta.env.VITE_API_URL || "";
                const res = await fetch(`${API_BASE}/agent/synastry`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(apiPayload)
                });

                if (res.ok) {
                    const data = await res.json();
                    console.log("🪐 Real Geometry:", data);

                    // Map API result to UI structure
                    // The backend returns { score: 88, aspects: [...] }
                    // We map this to the expected 'mathResult' format for compatibility
                    mathResult = {
                        socialScore: data.score,
                        workScore: data.score, // Use same base for now, or refine weights
                        loveScore: data.score,

                        // Fallbacks for specific sub-scores until backend provides granular breakdown
                        powerScore: 70,
                        socialConflictScore: 80
                    };
                    realAspects = data.aspects;
                } else {
                    throw new Error("API Connection Failed");
                }

            } catch (err) {
                console.error("❌ Backend Offline:", err);
                setApiError("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.");
                setLoading(false);
                return; // Exit early - no fallback!
            }

            // Determine Context (Lens)
            const isWork = connection.type === 'work';
            const isSocial = connection.type === 'social';
            const contextType = isSocial ? 'social' : isWork ? 'work' : 'love';
            const theme = contextType; // For UI styling

            // ----------------------------------------------------
            // Radar Logic - Using Backend Score for simplification
            // In future: Backend should return axis-level breakdown
            // ----------------------------------------------------
            let finalScore: number = mathResult.loveScore || 50;
            let dealBreaker: any = null;

            // Generate Radar Data from single score (placeholder until backend provides granular data)
            // This creates a "halo" effect around the single score
            const baseScore = finalScore;
            const generateAxisScore = (offset: number) => Math.max(0, Math.min(100, baseScore + offset));

            // 2. Define Axis Labels based on Context
            let labels: string[] = [];
            if (isSocial) labels = ['CONVIVÊNCIA', 'PAPO', 'APOIO', 'DIVERSÃO', 'LEALDADE'];
            else if (isWork) labels = ['FLUXO', 'LUCRO', 'VISÃO', 'RITMO', 'CONFIANÇA'];
            else labels = ['EGO', 'QUÍMICA', 'PROPÓSITO', 'MENTAL', 'EMOCIONAL'];

            // 3. Construct Comparative Data (Derived from backend score with variance)
            const radarData = labels.map((label, i) => ({
                label,
                A: generateAxisScore(Math.sin(i * 1.5) * 15),    // You (variance based on axis index)
                B: generateAxisScore(Math.cos(i * 1.5) * 12),    // Them (different variance pattern)
                fullMark: 100
            }));

            // 4. Deal Breakers & Scoring 
            if (isSocial) {
                // SOCIAL DATA (Friends & Family)
                finalScore = mathResult.socialScore;

                // Deal Breaker: TRETA (Mars/Pluto/Moon)
                const conflict = mathResult.socialConflictScore || 50;
                dealBreaker = {
                    score: conflict,
                    title: "Fator Treta (Limites)",
                    isBad: conflict < 40,
                    text: conflict < 40
                        ? "Zona de Perigo. Evitem discutir política ou dinheiro. Gatilhos rápidos detectados."
                        : "Zona Desmilitarizada. As desavenças são resolvidas com diplomacia e respeito mútuo.",
                    lowLabel: "Volátil",
                    highLabel: "Pacífica"
                };

            } else if (isWork) {
                // BUSINESS DATA
                finalScore = mathResult.workScore;

                // Deal Breaker: POWER (Pluto)
                const power = mathResult.powerScore || 50;
                dealBreaker = {
                    score: power,
                    title: "Dinâmica de Poder",
                    isBad: power < 40,
                    text: power < 40
                        ? "Alerta: Disputas de ego e controle podem sabotar a parceria. Definir hierarquia clara é vital."
                        : "Liderança Equilibrada. Capacidade mútua de ceder e comandar nos momentos certos.",
                    lowLabel: "Conflito",
                    highLabel: "Sinergia"
                };

            } else {
                // LOVE DATA (Default)
                finalScore = mathResult.loveScore;

                // Deal Breaker: KARMA (Saturn)
                const karma = mathResult.karmaScore;
                dealBreaker = {
                    score: karma,
                    title: "Fator Estabilidade (Karma)",
                    isBad: karma < 40,
                    text: karma < 40
                        ? "Atenção: Saturno indica restrições. Esta relação exigirá maturidade extra para superar bloqueios estruturais a longo prazo."
                        : "Estrutura Sólida. Saturno favorece a longevidade e o compromisso, criando uma base segura para o futuro.",
                    lowLabel: "Risco",
                    highLabel: "Estabilidade"
                };
            }

            // Determine Lens type for API
            let relType = "passionate";
            if (isWork) relType = "professional";
            if (isSocial) relType = "social_friends_family";

            // Mock LLM Message (To simulate "Quantum Protocol")
            const mockMessage = `Análise de ${connection.name} concluída. A sinergia de Elementos indica uma conexão ${finalScore > 70 ? 'forte' : 'desafiadora'}. O comparativo revela dinâmicas interessantes no eixo ${labels[0]} e ${labels[1]}.`;

            setResult({
                message: mockMessage, // Bypassing backend LLM for speed/reliability
                score: finalScore,
                radar: radarData,
                theme: theme,
                dealBreaker: dealBreaker,
                partnerName: connection.name,

                chart_energy: mathResult.chemistryScore || 70,
                chart_emotional: mathResult.emotionalScore,
                chart_intellect: mathResult.mentalScore,
            });

            // Update stored connection with latest real score
            setConnections(prev => {
                const updated = prev.map(c =>
                    c.id === connection.id ? { ...c, score: finalScore } : c
                );
                localStorage.setItem('celest_connections', JSON.stringify(updated));
                return updated;
            });

            setStep(2);
        } catch (e) {
            console.error(e);
            alert("Erro na simulação. Verifique os dados.");
        } finally {
            setLoading(false);
        }
    };

    // ------------------------------------------------------------------
    // VIEW 1: ADD CONNECTION PAGE (Apple Health Style - Full Screen)
    // ------------------------------------------------------------------
    if (isSheetOpen) {
        return (
            <div className="bg-black min-h-screen text-white pt-16 px-6 relative animate-in slide-in-from-bottom duration-500 font-sans selection:bg-pink-500/30">
                {/* Close Button (Top right) */}
                <div className="absolute top-6 right-6">
                    <button
                        onClick={() => setIsSheetOpen(false)}
                        className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                        <Icon name="close" />
                    </button>
                </div>

                {/* Page Title */}
                <h1 className="text-3xl font-bold tracking-tight mb-8">Nova Conexão</h1>

                {/* Form Wrapper */}
                <div className="max-w-md mx-auto">
                    <AddConnectionForm onSave={saveConnection} />
                </div>
            </div>
        );
    }

    // ------------------------------------------------------------------
    // VIEW 2: MAIN LIST & RESULT
    // ------------------------------------------------------------------

    // ERROR STATE: Backend Offline - Honest Failure
    if (apiError) {
        return (
            <div className="flex flex-col min-h-screen bg-black text-white items-center justify-center p-8 font-sans">
                <div className="text-center max-w-sm">
                    {/* Cosmic Error Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                        <Icon name="wifi_off" className="text-4xl text-pink-400" />
                    </div>

                    <h2 className="text-2xl font-bold mb-3 text-white">Conexão Cósmica Interrompida</h2>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        {apiError}
                    </p>

                    {/* Retry Button */}
                    <button
                        onClick={() => {
                            setApiError(null);
                            if (activeConnection) {
                                handleSimulation(activeConnection);
                            }
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                        Tentar Novamente
                    </button>

                    {/* Back to List */}
                    <button
                        onClick={() => {
                            setApiError(null);
                            setStep(1);
                        }}
                        className="block mx-auto mt-4 text-gray-500 text-sm hover:text-white transition-colors"
                    >
                        Voltar para Lista
                    </button>
                </div>
            </div>
        );
    }

    // Filter connections: Show 1 of each type
    // Priority: The first one found in the list (which is usually Newest since we unshift)
    const uniqueTypes = ['love', 'work', 'social'];
    const displayedConnections = uniqueTypes
        .map(t => connections.find(c => c.type === t))
        .filter(c => c !== undefined);

    return (
        <div className="flex flex-col min-h-screen bg-[#010409] text-white font-display relative overflow-hidden">
            <SEOHead
                title="Sinastria"
                description="Descubra a compatibilidade astral entre você e suas conexões. Análise de sinastria completa."
                path="/synastry"
            />
            {/* Header (Apple Health Style) */}
            {step === 1 && (
                <div className="pt-20 px-6 relative z-10 max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-white mb-1">Conexões</h1>
                            <p className="text-gray-400 text-lg font-medium">Sincronia Astral</p>
                        </div>
                        <button
                            onClick={() => setIsSheetOpen(true)}
                            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
                        >
                            <Icon name="add" className="text-xl" />
                        </button>
                    </div>

                    {/* Zero State (Apple Health Liquid Glass) */}
                    {connections.length === 0 ? (
                        <div className="mt-8 animate-in fade-in duration-700">
                            <div className="relative overflow-hidden p-8 rounded-[32px] bg-[#1C1C1E]/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 text-center mx-auto max-w-sm">
                                {/* Liquid Glass Highlight (Top) */}
                                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                                <div className="w-20 h-20 bg-black/40 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner border border-white/5 relative z-10">
                                    <Icon name="groups" className="text-3xl text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 relative z-10">Nenhuma Conexão</h3>
                                <p className="text-gray-400 text-sm mb-8 leading-relaxed relative z-10">
                                    Adicione parceiros, amigos ou colegas para descobrir a sinergia dos mapas.
                                </p>
                                <button
                                    onClick={() => setIsSheetOpen(true)}
                                    className="px-8 py-3 rounded-full bg-white text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10 w-full relative z-10"
                                >
                                    Adicionar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500 relative z-10">
                            {displayedConnections.map((conn: any) => (
                                <ConnectionCard
                                    key={conn.id}
                                    name={conn.name}
                                    role={conn.role}
                                    type={conn.type}
                                    score={conn.score}
                                    onClick={() => handleSimulation(conn)}
                                />
                            ))}
                        </div>
                    )}


                </div>
            )}




            {/* Loading Overlay */}
            {
                loading && step === 1 && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                    </div>
                )
            }

            {/* Result View */}
            {
                step === 2 && result && activeConnection && (
                    <div className="relative bg-black min-h-screen animate-in slide-in-from-bottom duration-700 z-20">

                        {/* Back Button */}
                        <div className="absolute top-12 left-6 z-20">
                            <button onClick={() => setStep(1)} className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-colors">
                                <Icon name="arrow_back" />
                            </button>
                        </div>

                        <div className="pt-24 px-6 pb-32">

                            {/* Context Badge */}
                            <div className="flex justify-center mb-6">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${result.theme === 'love' ? 'border-pink-500/30 text-pink-400 bg-pink-500/10' :
                                    result.theme === 'work' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' :
                                        'border-amber-500/30 text-amber-400 bg-amber-500/10'
                                    }`}>
                                    {result.theme === 'love' ? 'Amor' : result.theme === 'work' ? 'Trabalho' : 'Social'}
                                </span>
                            </div>

                            {/* Title */}
                            <h2 className="text-center text-3xl font-bold mb-2 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                                {activeConnection?.name}
                            </h2>
                            <div className="flex justify-center mb-6">
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Score Global</span>
                                    <span className="text-white font-bold">{result.score}%</span>
                                </div>
                            </div>

                            {/* Radar Chart */}
                            <div className="h-[300px] w-full flex items-center justify-center mb-4">
                                {/* Radar Component */}
                                <RadarChart
                                    data={result.radar}
                                    theme={result.theme}
                                    size={300}
                                    partnerLabel={result.partnerName ? result.partnerName.split(' ')[0] : "Parceiro"}
                                />
                            </div>

                            {/* Deal Breaker Card */}
                            {result.dealBreaker && (
                                <div className={`p-6 rounded-3xl border mb-6 ${result.dealBreaker.isBad
                                    ? 'bg-red-500/10 border-red-500/30'
                                    : 'bg-green-500/10 border-green-500/30'
                                    }`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <Icon name={result.dealBreaker.isBad ? "warning" : "check_circle"}
                                            className={result.dealBreaker.isBad ? "text-red-400" : "text-green-400"} />
                                        <span className={`text-sm font-bold uppercase tracking-wider ${result.dealBreaker.isBad ? "text-red-400" : "text-green-400"
                                            }`}>
                                            {result.dealBreaker.title}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {result.dealBreaker.text}
                                    </p>
                                    <div className="w-full bg-black/30 h-1.5 rounded-full overflow-hidden mt-4">
                                        <div
                                            className={`h-full rounded-full ${result.dealBreaker.isBad ? 'bg-red-500' : 'bg-green-500'}`}
                                            style={{ width: `${result.dealBreaker.score}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {/* AI Analysis (Mock Text for now if not loaded) */}
                            <div className="p-6 rounded-3xl bg-[#1C1C1E] border border-white/5 space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon name="auto_awesome" className="text-purple-400" />
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Oracle Insight</span>
                                </div>
                                <div className="prose prose-invert prose-sm">
                                    <p className="text-white/80 italic">{result.message}</p>
                                </div>
                            </div>

                            {/* PROMO */}
                            <div className="mt-6">
                                <ShopPromoCard />
                            </div>

                        </div>
                    </div>
                )
            }

        </div>
    );
};

export default Synastry;

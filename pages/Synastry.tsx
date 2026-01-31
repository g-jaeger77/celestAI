
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import ShopPromoCard from '../components/ShopPromoCard';
import { calculateSynastry, calculateTraits, ChartData } from '../utils/synastryCalculator';
import ConnectionCard from '../components/connections/ConnectionCard';

import AddConnectionForm from '../components/connections/AddConnectionForm';
import RadarChart from '../components/connections/RadarChart';
import { SEOHead } from '../components/SEOHead';

const Synastry: React.FC = () => {

    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1 = List, 2 = Result
    const [loading, setLoading] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false); // NOW CONTROLS "ADD PAGE" VIEW

    // Connections State
    const [connections, setConnections] = useState<any[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('celest_connections');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) setConnections(parsed);
            } catch (e) { }
        }
    }, []);

    const saveConnection = (newConn: any) => {
        const connWithId = { ...newConn, id: Date.now(), score: Math.floor(Math.random() * 40) + 60 };
        const updated = [connWithId, ...connections];
        setConnections(updated);
        localStorage.setItem('celest_connections', JSON.stringify(updated));

        // Trigger simulation immediately for "Impression"
        handleSimulation(connWithId);
        setIsSheetOpen(false);
    };

    // Result State
    const [result, setResult] = useState<any>(null);
    const [activeConnection, setActiveConnection] = useState<any>(null);

    const fetchChartData = async (name: string, date: string, time: string, city: string) => {
        // Deterministic Pseudo-Random Generator (Seeded by Name + Date)
        // Ensures results stay consistent for the same person/day.
        const seedStr = name + date + (new Date().toDateString()); // Changes daily
        let seed = 0;
        for (let i = 0; i < seedStr.length; i++) seed += seedStr.charCodeAt(i);

        const seededRandom = () => {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };

        const signs = [
            { sign: 'Aries', element: 'Fire', modality: 'Cardinal' },
            { sign: 'Taurus', element: 'Earth', modality: 'Fixed' },
            { sign: 'Gemini', element: 'Air', modality: 'Mutable' },
            { sign: 'Cancer', element: 'Water', modality: 'Cardinal' },
            { sign: 'Leo', element: 'Fire', modality: 'Fixed' },
            { sign: 'Virgo', element: 'Earth', modality: 'Mutable' },
            { sign: 'Libra', element: 'Air', modality: 'Cardinal' },
            { sign: 'Scorpio', element: 'Water', modality: 'Fixed' },
            { sign: 'Sagittarius', element: 'Fire', modality: 'Mutable' },
            { sign: 'Capricorn', element: 'Earth', modality: 'Cardinal' },
            { sign: 'Aquarius', element: 'Air', modality: 'Fixed' },
            { sign: 'Pisces', element: 'Water', modality: 'Mutable' }
        ];

        const getRandom = () => ({
            ...signs[Math.floor(seededRandom() * signs.length)],
            house: Math.floor(seededRandom() * 12) + 1,
            deg: Math.floor(seededRandom() * 30)
        });

        // Simulate network delay
        await new Promise(r => setTimeout(r, 600));

        return {
            sun: getRandom(),
            moon: getRandom(),
            mercury: getRandom(),
            venus: getRandom(),
            mars: getRandom(),
            jupiter: getRandom(),
            saturn: getRandom(),
            ascendant: getRandom()
        };
    };

    const handleSimulation = async (connection: any) => {
        setLoading(true);
        setActiveConnection(connection);

        try {
            const userChart = await fetchChartData("User", "1995-05-15", "14:30", "Sao Paulo");

            const partnerChart = await fetchChartData(
                connection.name,
                connection.birthDate,
                connection.birthTime || "12:00", // Fallback if optional
                connection.birthCity || "Unknown"
            );

            // Granular Calculation
            const mathResult = calculateSynastry(userChart as any, partnerChart as any);

            // Determine Context (Lens)
            const isWork = connection.type === 'work';
            const isSocial = connection.type === 'social';
            const theme = isSocial ? 'social' : isWork ? 'work' : 'love';
            const contextType = isSocial ? 'social' : isWork ? 'work' : 'love';

            // ----------------------------------------------------
            // NEW: Comparative Radar Logic (Step 2746)
            // ----------------------------------------------------
            let finalScore: number = 0;
            let dealBreaker: any = null;

            // 1. Calculate Individual Trait Scores (0-100)
            const userTraits = calculateTraits(userChart as any, contextType);
            const partnerTraits = calculateTraits(partnerChart as any, contextType);

            // 2. Define Axis Labels based on Context
            let labels: string[] = [];
            if (isSocial) labels = ['CONVIVÊNCIA', 'PAPO', 'APOIO', 'DIVERSÃO', 'LEALDADE'];
            else if (isWork) labels = ['FLUXO', 'LUCRO', 'VISÃO', 'RITMO', 'CONFIANÇA'];
            else labels = ['EGO', 'QUÍMICA', 'PROPÓSITO', 'MENTAL', 'EMOCIONAL'];

            // 3. Construct Comparative Data
            const radarData = labels.map((label, i) => ({
                label,
                A: userTraits[i] || 50,    // You
                B: partnerTraits[i] || 50, // Them
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
            {/* Background Matrix Effect */}

            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a1a 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            {/* Header (Only on List) */}
            {step === 1 && (
                <div className="pt-16 px-6 relative z-10">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight mb-2">Suas Conexões</h1>
                            <p className="text-gray-500 text-sm font-medium">Sincronia Astral</p>
                        </div>
                        <button
                            onClick={() => setIsSheetOpen(true)}
                            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-white/10"
                        >
                            <Icon name="add" className="text-2xl" />
                        </button>
                    </div>

                    {/* Zero State or List */}
                    {connections.length === 0 ? (
                        <div className="mt-8 animate-in fade-in duration-700">
                            <div className="p-8 rounded-3xl bg-[#1C1C1E]/50 border border-white/5 text-center">
                                <Icon name="groups" className="text-4xl text-gray-600 mb-4 mx-auto" />
                                <h3 className="text-lg font-bold text-gray-300 mb-2">Sem Conexões</h3>
                                <p className="text-gray-500 text-sm mb-6">Adicione alguém para descobrir a sinergia dos mapas.</p>
                                <button
                                    onClick={() => setIsSheetOpen(true)}
                                    className="px-6 py-2 rounded-full bg-white text-black text-sm font-bold"
                                >
                                    Fazer Simulação
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

                    {/* Upsell / Expansions (Always Visible in List) */}
                    <div className="mt-8 mb-24 animate-in slide-in-from-bottom-8 duration-700 delay-200">
                        <ShopPromoCard />
                    </div>
                </div>
            )}

            {/* Upsell / Expansions (Always Visible) */}
            <div className="mt-8 mb-24 animate-in slide-in-from-bottom-8 duration-700 delay-200">
                <ShopPromoCard />
            </div>


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

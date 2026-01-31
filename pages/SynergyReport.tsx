import React, { useState, useEffect } from 'react';
import DailySynergyReport from '../components/dashboard/DailySynergyReport';
import { generateSynergyVerdict, getPillarHighlights } from '../utils/synergyLogic';
import { agentApi, DashboardResponse } from '../api/agent';
import ErrorState from '../components/ErrorState';

const SynergyReport: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardResponse | null>(null);
    const [error, setError] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        setError(false);
        try {
            // Determine User ID
            let userId = "demo";
            try {
                const saved = localStorage.getItem('user_birth_data');
                if (saved) userId = JSON.parse(saved).user_id || "demo";
            } catch (e) { }

            const response = await agentApi.getDashboard(userId);
            setData(response);
        } catch (error) {
            console.error("Synergy fetch error", error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-white/10 border-t-white/80 rounded-full animate-spin"></div>
                <p className="text-white/40 text-sm font-medium tracking-widest uppercase animate-pulse">Sincronizando...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="pt-24 px-6 pb-24 min-h-screen bg-black">
                <div className="mb-8">
                    <h1 className="text-white text-[28px] font-bold tracking-tight leading-none text-center">Alinhamento</h1>
                </div>
                <ErrorState onRetry={fetchData} />
            </div>
        );
    }

    // Adapt Backend Data to Synergy Logic
    const pillarScores = {
        mind: data.score_mental,
        body: data.score_physical,
        soul: data.score_emotional
    };

    const globalScore = Math.round((pillarScores.mind + pillarScores.body + pillarScores.soul) / 3);
    const verdict = generateSynergyVerdict(pillarScores);
    const highlights = getPillarHighlights(pillarScores);

    // Assemble Data Object
    const reportData = {
        globalScore,
        globalReasoning: verdict,
        pillars: {
            mind: {
                score: pillarScores.mind,
                status: highlights.mind.status,
                highlight: highlights.mind.desc
            },
            body: {
                score: pillarScores.body,
                status: highlights.body.status,
                highlight: highlights.body.desc
            },
            soul: {
                score: pillarScores.soul,
                status: highlights.soul.status,
                highlight: highlights.soul.desc
            }
        }
    };

    return (
        <div className="pt-24 px-6 pb-24 bg-black min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-[#8e8e93] text-[13px] font-semibold uppercase tracking-wide mb-1">Ressonância Diária</h2>
                <h1 className="text-white text-[28px] font-bold tracking-tight leading-none">Alinhamento Cósmico</h1>
            </div>

            {/* Report Component */}
            <DailySynergyReport {...reportData} />
        </div>
    );
};

export default SynergyReport;

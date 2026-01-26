import React, { useMemo } from 'react';
import DailySynergyReport from '../components/dashboard/DailySynergyReport';
import { calculateBioMetrics } from '../utils/calculateScores'; // Corrected import
import { generateSynergyVerdict, getPillarHighlights } from '../utils/synergyLogic';

const SynergyReport: React.FC = () => {
    // 1. Get Core Data (Same as Dashboard)
    const userName = useMemo(() => {
        try {
            const saved = localStorage.getItem('user_birth_data');
            return saved ? JSON.parse(saved).full_name : "User";
        } catch { return "User"; }
    }, []);

    const scores = useMemo(() => calculateBioMetrics(userName), [userName]);

    // 2. Derive Report Data
    const pillarScores = {
        mind: scores.mindScore,
        body: scores.bodyScore,
        soul: scores.soulScore
    };

    const globalScore = Math.round((scores.mindScore + scores.bodyScore + scores.soulScore) / 3);
    const verdict = generateSynergyVerdict(pillarScores);
    const highlights = getPillarHighlights(pillarScores);

    // 3. Assemble Data Object
    const reportData = {
        globalScore,
        globalReasoning: verdict,
        pillars: {
            mind: {
                score: scores.mindScore,
                status: highlights.mind.status,
                highlight: highlights.mind.desc
            },
            body: {
                score: scores.bodyScore,
                status: highlights.body.status,
                highlight: highlights.body.desc
            },
            soul: {
                score: scores.soulScore,
                status: highlights.soul.status,
                highlight: highlights.soul.desc
            }
        }
    };

    return (
        <div className="pt-24 px-6 pb-24">
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

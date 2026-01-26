
// Mock of the PlanetPosition type if not already defined, just for context.
// In real file, it's defined.
export interface PlanetPosition {
    sign: string;
    house: number;
    element: string; // 'Fire', 'Earth', 'Air', 'Water'
    modality: string; // 'Cardinal', 'Fixed', 'Mutable'
    deg: number;
}

export interface ChartData {
    sun: PlanetPosition;
    moon: PlanetPosition;
    mercury: PlanetPosition;
    venus: PlanetPosition;
    mars: PlanetPosition;
    jupiter: PlanetPosition;
    saturn: PlanetPosition;
    ascendant: PlanetPosition;
}

// Result Interface
export interface SynastryResult {
    loveScore: number;
    workScore: number;
    socialScore: number;

    // Love Aspects
    egoScore: number;
    chemistryScore: number;
    purposeScore: number;
    mentalScore: number;
    emotionalScore: number;
    karmaScore: number;

    // Work Aspects
    workflowScore: number;
    profitScore: number;
    visionScore: number;
    rhythmScore: number;
    reliabilityScore: number;
    powerScore: number;

    // Social aspects
    socialRoutineScore: number;
    socialCommScore: number;
    socialSupportScore: number;
    socialFunScore: number;
    socialValuesScore: number;
    socialConflictScore: number;
}

// ------------------------------------
// 1. HELPER: Calculate Score for a Planet (Heuristic)
// ------------------------------------
const getElementPower = (element: string): number => {
    switch (element) {
        case 'Fire': return 85;
        case 'Air': return 75; // Active
        case 'Water': return 65; // Receptive
        case 'Earth': return 55; // Stable
        default: return 50;
    }
};

const getModalityPower = (modality: string): number => {
    switch (modality) {
        case 'Cardinal': return 20; // Initiating
        case 'Fixed': return 10;   // Sustaining
        case 'Mutable': return 0;  // Adapting
        default: return 0;
    }
};

// ------------------------------------
// 2. MAIN SYNASTRY CALC (Simplified Mock)
// ------------------------------------
export const calculateSynastry = (user: ChartData, partner: ChartData): SynastryResult => {
    // Basic Mock Logic using random variance seeded by day/name length for stability if needed.
    // Ideally this uses real aspects. 
    // For now, we return valid mocked scores to support the UI workflow.

    // Base Score from Sun Element Match?
    const base = user.sun.element === partner.sun.element ? 85 : 65;

    return {
        loveScore: base,
        workScore: base - 5,
        socialScore: base + 5,

        // Love
        egoScore: 70 + (Math.random() * 20),
        chemistryScore: 60 + (Math.random() * 30),
        purposeScore: 80,
        mentalScore: 75,
        emotionalScore: 65,
        karmaScore: 50 + (Math.random() * 40),

        // Work
        workflowScore: 70,
        profitScore: 60,
        visionScore: 85,
        rhythmScore: 65,
        reliabilityScore: 80,
        powerScore: 55,

        // Social
        socialRoutineScore: 75,
        socialCommScore: 85,
        socialSupportScore: 90,
        socialFunScore: 80,
        socialValuesScore: 70,
        socialConflictScore: 85
    };
};

// ------------------------------------
// 3. NEW: INDIVIDUAL TRAIT CALCULATOR (For Radar Overlay)
// ------------------------------------
// Returns array of 5 scores corresponding to the context axes
export const calculateTraits = (chart: ChartData, context: 'love' | 'work' | 'social'): number[] => {

    // Heuristic: Map planetary strength to "Intensity" (0-100)
    // 0 = Soft/Passive, 100 = Strong/Active

    const getPlanetScore = (p: PlanetPosition) => {
        return getElementPower(p.element) + getModalityPower(p.modality);
        // Fire+Cardinal = 85+20 = 105 (Cap at 100)
        // Earth+Mutable = 55+0 = 55
        // Add simplistic house bonus or randomness for variety if needed.
    };

    const cap = (n: number) => Math.min(100, Math.max(30, n));

    const sun = getPlanetScore(chart.sun);
    const moon = getPlanetScore(chart.moon);
    const mercury = getPlanetScore(chart.mercury);
    const venus = getPlanetScore(chart.venus);
    const mars = getPlanetScore(chart.mars);
    const jupiter = getPlanetScore(chart.jupiter);
    const saturn = getPlanetScore(chart.saturn);

    if (context === 'love') {
        return [
            cap(sun),       // Ego
            cap(mars),      // Química (Passion)
            cap(jupiter),   // Propósito
            cap(mercury),   // Mental
            cap(moon)       // Emocional
        ];
    }

    if (context === 'work') {
        return [
            cap(mercury),   // Fluxo (Communication)
            cap(jupiter),   // Lucro (Expansion)
            cap(sun),       // Visão (Leadership)
            cap(mars),      // Ritmo (Action)
            cap(saturn)     // Confiança (Reliability)
        ];
    }

    // Social
    return [
        cap(moon),      // Convivência (Daily)
        cap(mercury),   // Papo
        cap(jupiter),   // Apoio
        cap(venus),     // Diversão
        cap(saturn)     // Lealdade
    ];
};

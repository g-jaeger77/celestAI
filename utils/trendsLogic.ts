
// Deterministic trends based on User + Partner
export const calculateTrends = (userName: string, userDate: string, partnerName?: string) => {
    // Current Date
    const today = new Date();
    const dateStr = today.toDateString();

    // Seed: User + Date (+ Partner)
    // This ensures consistency for the day, but changes if partner is added/removed
    const seedStr = userName + dateStr + (partnerName || "");

    // Simple Hash Function
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) {
        seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
        seed |= 0; // Convert to 32bit integer
    }

    const seededRandom = () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    // 1. Daily Alignment Score (60-100)
    // Higher random range to feel "dynamic"
    const baseScore = Math.floor(seededRandom() * 41) + 60;

    // 2. Trend (+X.X%)
    // Random between -5.0 and +15.0
    const trendValue = (seededRandom() * 20 - 5).toFixed(1);
    const isPositive = parseFloat(trendValue) >= 0;

    // 3. Weekly Chart Data (7 days)
    // Generate previous 6 days + today
    const weeklyData = [];

    // Helper to generate consistent components based on a seed
    const getComponentScore = (s: number, offset: number) => {
        const x = Math.sin(s + offset) * 10000;
        const rnd = x - Math.floor(x);
        return Math.min(100, Math.max(40, 60 + Math.floor(rnd * 40 - 20)));
    };

    for (let i = 0; i < 7; i++) {
        // Variation relative to baseScore
        // Generate daily distinct components
        const daySeed = seed + i * 13;

        // Push object with broken down scores
        weeklyData.push({
            day: i,
            mental: getComponentScore(daySeed, 100),
            physical: getComponentScore(daySeed, 200),
            emotional: getComponentScore(daySeed, 300),
            total: Math.min(100, Math.max(40, baseScore + Math.floor(seededRandom() * 40 - 20))) // Keep total/single metric too if needed
        });
    }

    // 4. Insights (Focus, Sensitivity, Relationship)
    const insights = [];

    // Focus / Productivity
    const focusScore = Math.floor(seededRandom() * 100);
    if (focusScore > 75) {
        insights.push({
            type: 'focus',
            title: 'Pico de Foco',
            desc: 'Alta performance mental e clareza hoje.',
            score: 'Alta',
            duration: '2 dias',
            icon: 'bar_chart',
            color: 'cyan'
        });
    } else if (focusScore < 40) {
        insights.push({
            type: 'focus',
            title: 'Mente Dispersa',
            desc: 'Bom momento para atividades criativas e intuitivas.',
            score: 'Baixa',
            duration: '1 dia',
            icon: 'waves',
            color: 'indigo'
        });
    } else {
        insights.push({
            type: 'focus',
            title: 'Estabilidade Mental',
            desc: 'Equilíbrio ideal para tarefas de rotina.',
            score: 'Média',
            duration: '3 dias',
            icon: 'check_circle',
            color: 'teal'
        });
    }

    // Emotional / Sensitivity
    const emotionalScore = Math.floor(seededRandom() * 100);
    if (emotionalScore > 80) {
        insights.push({
            type: 'emotion',
            title: 'Alta Sensibilidade',
            desc: 'Cuidado extra com interações emocionais.',
            score: 'Intensa',
            duration: 'Hoje',
            icon: 'favorite',
            color: 'rose'
        });
    } else if (emotionalScore < 30) {
        insights.push({
            type: 'emotion',
            title: 'Recolhimento',
            desc: 'Energia voltada para o interior.',
            score: 'Baixa',
            duration: '2 dias',
            icon: 'bedtime',
            color: 'indigo'
        });
    }

    // Relationship Insight (If Partner exists)
    if (partnerName) {
        // Unique interaction score
        const relScore = Math.floor(seededRandom() * 100);

        if (relScore > 70) {
            insights.unshift({ // Top priority
                type: 'relation',
                title: `Sinergia com ${partnerName}`,
                desc: 'Alinhamento harmônico excepcional hoje.',
                score: `${relScore}%`,
                duration: '48h',
                icon: 'auto_awesome',
                color: 'pink'
            });
        } else if (relScore < 40) {
            insights.unshift({
                type: 'relation',
                title: `Desafio com ${partnerName}`,
                desc: 'Comunicação pode exigir paciência e clareza.',
                score: `${relScore}%`,
                duration: '24h',
                icon: 'bolt',
                color: 'amber'
            });
        } else {
            insights.push({
                type: 'relation',
                title: `Conexão com ${partnerName}`,
                desc: 'Relação estável e construtiva.',
                score: `${relScore}%`,
                duration: '3 dias',
                icon: 'group',
                color: 'purple'
            });
        }
    } else {
        // Self-Insight if no partner
        insights.push({
            type: 'self',
            title: 'Jornada Interior',
            desc: 'Excelente período para autoconhecimento.',
            score: 'Profunda',
            duration: 'Semana',
            icon: 'self_improvement',
            color: 'emerald'
        });
    }

    return {
        alignmentScore: baseScore,
        trendValue: isPositive ? `+${trendValue}%` : `${trendValue}%`,
        isPositive,
        weeklyData,
        insights
    };
};

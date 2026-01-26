export const calculateBioMetrics = (name: string = "User") => {
    const today = new Date();
    // Create a deterministic seed based on the date and user's name length
    // This ensures consistency for the whole day for the same user
    const dateSeed = today.getDate() + today.getMonth() + today.getFullYear();
    const userSeed = name.length;
    const key = dateSeed + userSeed;

    // 1. Mind (Mercury Logic) - Deterministic random based on key
    // We use Math.sin to get a pseudo-random number from the key
    const mindScore = Math.floor(Math.abs(Math.sin(key)) * 100);
    const neuralState = mindScore > 70 ? "Hiperfoco" : (mindScore > 40 ? "Ideias Leves" : "Descanso Mental");
    const neuralDesc = mindScore > 70
        ? "Sua mente está afiada para resolver problemas complexos."
        : (mindScore > 40 ? "Bom momento para imaginar, não para calcular." : "Evite decisões difíceis. Use a intuição.");

    // 2. Body (Mars Logic)
    const bodyScore = Math.floor(Math.abs(Math.cos(key * 1.5)) * 100);
    const batteryState = bodyScore > 70 ? "Tanque Cheio" : (bodyScore > 40 ? "Modo Econômico" : "Pouca Energia");
    const batteryDesc = bodyScore > 70
        ? "Ótimo dia para treinos intensos e movimento."
        : (bodyScore > 40 ? "energia estável. Mantenha o ritmo." : "Priorize o sono e a recuperação hoje.");

    // 3. Soul (Moon Logic)
    const soulScore = Math.floor(Math.abs(Math.sin(key * 2.2)) * 100);
    const moodState = soulScore > 70 ? "Conectado" : (soulScore > 40 ? "Sentimental" : "Modo Caverna");
    const moodDesc = soulScore > 70
        ? "Sua intuição está gritando. Ouça."
        : (soulScore > 40 ? "Você pode sentir mais as coisas hoje." : "Proteja sua energia. Fique em paz.");

    // 4. Action Window (Time Logic) - Based on current hour (real-time, not fixed by date)
    const currentHour = today.getHours();
    const isVoid = currentHour >= 14 && currentHour <= 16;
    const actionWindow = isVoid
        ? { type: 'WARNING', title: 'Cuidado', time: '14h - 16h', desc: 'Evite decisões importantes agora.' }
        : { type: 'GOLD', title: 'Sorte', time: '09h - 11h', desc: 'Aproveite este horário.' };


    // 5. Daily Insight
    const dailyInsight = mindScore > 60 && bodyScore > 60
        ? "Hoje você é imbatível. Use essa força para realizar o difícil."
        : "Respeite seu ritmo. O progresso invisível também é progresso.";

    return {
        mindScore,
        neuralState,
        neuralDesc,
        bodyScore,
        batteryState,
        batteryDesc,
        soulScore,
        moodState,
        moodDesc,
        actionWindow,
        dailyInsight
    };
};


interface PillarScores {
    mind: number;
    body: number;
    soul: number;
}

export function generateSynergyVerdict(scores: PillarScores): string {
    const { mind, body, soul } = scores;
    const globalMean = Math.round((mind + body + soul) / 3);

    // Identify Highs and Lows
    const aspects = [
        { id: 'mind', score: mind, name: 'Mercúrio (Mente)' },
        { id: 'body', score: body, name: 'Marte (Corpo)' },
        { id: 'soul', score: soul, name: 'Lua (Alma)' }
    ];

    // Sort by score desc
    aspects.sort((a, b) => b.score - a.score);

    const highest = aspects[0];
    const lowest = aspects[2];

    // High Synergy (> 75%)
    if (globalMean >= 75) {
        if (lowest.score >= 70) {
            return `DIAGNÓSTICO: Sincronia Excepcional.
O alinhamento planetário de hoje criou um corredor raro de eficiência. Com ${highest.name} liderando e ${lowest.name} sustentando a base, você tem carta verde para executar seus projetos mais ambiciosos. Não desperdice esta energia com tarefas triviais; apresente aquela ideia, inicie o treino pesado ou tenha a conversa difícil. O universo removeu os atritos. Sua única obrigação agora é a ação. O fluxo está a seu favor, mas ele não espera. Acelere.`;
        }
        return `DIAGNÓSTICO: Alta Performance Direcionada.
Você está sendo impulsionado por uma corrente poderosa de ${highest.name}, ideal para avanços rápidos em áreas específicas. O sistema detectou, porém, uma leve âncora em ${lowest.name}.

A ESTRATÉGIA: Use sua força principal para compensar essa fraqueza. Se o corpo está cansado mas a mente voa, trabalhe sentado. Se a mente trava mas o corpo vibra, vá para a rua. Não pare, apenas adapte o terreno à sua vantagem. O resultado virá se você souber manobrar.`;
    }

    // Moderate Synergy (50% - 74%)
    if (globalMean >= 50) {
        return `DIAGNÓSTICO: Estabilidade Operacional.
Sua sincronia está na zona de manutenção. ${highest.name} oferece um porto seguro, mas ${lowest.name} sinaliza áreas de atrito que exigem gestão, não força bruta.

A ESTRATÉGIA: Não tente quebrar recordes hoje. Foque na consistência e na "manutenção da máquina". Resolva pendências burocráticas, organize seu ambiente e evite grandes riscos emocionais ou físicos. O dia pede pragmatismo: faça o básico bem feito e guarde energia para quando a maré subir novamente.`;
    }

    // Low Synergy (< 50%)
    return `DIAGNÓSTICO: Modo de Preservação Necessário.
Os trânsitos atuais indicam resistência sistêmica, especialmente vinda de ${lowest.name}. Tentar forçar situações hoje resultará em desgaste desproporcional.

A ESTRATÉGIA: Reduza a velocidade deliberadamente. Não inicie nada novo. Use a (pouca) estabilidade de ${highest.name} apenas para manter o essencial funcionando. Diga não a convites sociais exaustivos e adie reuniões críticas. Hoje é um dia para "afiar o machado", não para cortar a árvore. O recuo estratégico hoje garante a vitória de amanhã.`;
}

export function getPillarHighlights(scores: PillarScores) {
    // Mind (Mercury)
    let mindH = { status: "Fluxo Constante", desc: "Mercúrio oferece clareza suficiente para o dia a dia. Bom para organizar, ruim para inovar radicalmente." };
    if (scores.mind > 80) mindH = { status: "Hiperfoco Ativado", desc: "Sua capacidade de síntese está letal. Aproveite para estudar sistemas complexos ou resolver aquele problema antigo em minutos." };
    else if (scores.mind < 40) mindH = { status: "Névoa Mental", desc: "O processamento está lento. Não confie na sua memória hoje; anote tudo. Evite debates teóricos, pois a chance de mal-entendido é alta." };

    // Body (Mars)
    let bodyH = { status: "Energia Estável", desc: "Sua bateria física sustenta a rotina sem problemas. Mantenha a hidratação e faça pausas estratégicas." };
    if (scores.body > 80) bodyH = { status: "Potência Física", desc: "Marte está injetando aditiva no seu tanque. Se não gastar essa energia com movimento, ela virará irritação ou ansiedade. Treine pesado." };
    else if (scores.body < 40) bodyH = { status: "Reserva Baixa", desc: "O corpo pede trégua. Qualquer esforço extra cobrará juros altos amanhã. Priorize sono de qualidade e alimentação leve." };

    // Soul (Moon)
    let soulH = { status: "Equilíbrio", desc: "As emoções estão sob controle, permitindo interações sociais seguras. Você está acessível, mas protegido." };
    if (scores.soul > 80) soulH = { status: "Conexão Profunda", desc: "Sua antena intuitiva está captando tudo. Excelente para ler ambientes e pessoas, mas cuidado para não absorver o que não é seu." };
    else if (scores.soul < 40) soulH = { status: "Blindagem Necessária", desc: "Vulnerabilidade alta. O menor comentário pode ferir. Evite pessoas tóxicas e ambientes caóticos. O isolamento hoje é cura." };

    return { mind: mindH, body: bodyH, soul: soulH };
}

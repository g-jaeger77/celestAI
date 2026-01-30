import React from 'react';

const Step: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
    <div className="relative group">
        <span className="absolute -left-[41px] flex items-center justify-center w-8 h-8 rounded-full bg-[#2a1e1a] border border-primary text-primary font-bold text-sm ring-4 ring-[#1a1210] group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            {number}
        </span>
        <div className="bg-[#2a1e1a] p-6 rounded-xl border border-[#3a2822] hover:border-primary/50 transition-colors duration-300">
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-text-muted text-sm leading-relaxed">{description}</p>
        </div>
    </div>
);

const HowItWorks: React.FC = () => {
    return (
        <section className="py-16 px-4 bg-[#1a1210] relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
                    Como o <span className="text-gradient-brand font-extrabold">Celest AI</span> funciona
                </h2>

                <div className="relative pl-8 border-l border-[#3a2822] space-y-12">
                    <Step
                        number="01"
                        title="Mapeamento Profundo"
                        description="Nossa IA analisa seu perfil astral e comportamental para criar uma base sólida de entendimento."
                    />
                    <Step
                        number="02"
                        title="Análise de Bloqueios"
                        description="Identificamos padrões ocultos que estão sabotando seu progresso silenciosamente."
                    />
                    <Step
                        number="03"
                        title="Revelação de Caminhos"
                        description="Receba insights diários precisos sobre oportunidades e momentos de cautela."
                    />
                    <Step
                        number="04"
                        title="Ação Alinhada"
                        description="Tome decisões com confiança absoluta, sabendo que está em sintonia com seu propósito."
                    />
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;

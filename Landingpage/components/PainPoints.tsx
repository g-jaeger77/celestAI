import React from 'react';

interface PainPointCardProps {
  icon: string;
  title: string;
  description: string;
}

const PainPointCard: React.FC<PainPointCardProps> = ({ icon, title, description }) => (
  <div className="flex gap-4 rounded-lg bg-[#2a1e1a] p-5 border-l-4 border-primary shadow-lg hover:translate-x-1 transition-transform duration-300">
    <div className="mt-1">
      <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
    </div>
    <div>
      <h3 className="text-white text-lg font-bold">{title}</h3>
      <p className="text-text-muted text-sm mt-1 leading-relaxed">{description}</p>
    </div>
  </div>
);

const PainPoints: React.FC = () => {
  const points = [
    {
      icon: "psychology_alt",
      title: "Ansiedade Constante",
      description: "Sente que o futuro é uma ameaça incerta e não consegue desligar a mente."
    },
    {
      icon: "question_mark",
      title: "Dúvida Paralisante",
      description: "Nunca sabe qual caminho escolher e acaba não escolhendo nada."
    },
    {
      icon: "traffic",
      title: "Estagnação Profissional",
      description: "Sente que está andando em círculos enquanto todos avançam."
    },
    {
      icon: "noise_control_off",
      title: "Ruído Mental",
      description: "Não consegue ouvir sua própria intuição no meio do barulho externo."
    }
  ];

  return (
    <section className="py-16 px-4 bg-background-dark">
      <div className="max-w-2xl mx-auto flex flex-col gap-10">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Você se sente <span className="text-primary">perdido no espaço?</span>
          </h2>
          <p className="text-text-muted">
            Identifique os bloqueios gravitacionais que te impedem de evoluir.
          </p>
        </div>
        
        <div className="grid gap-4">
          {points.map((point, idx) => (
            <PainPointCard key={idx} {...point} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
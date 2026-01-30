import React from 'react';

const TargetAudience: React.FC = () => {
  const items = [
    "Busca autoconhecimento profundo sem misticismo vazio.",
    "Quer uma ferramenta prática para tomada de decisão.",
    "Sente que tem um potencial travado esperando para explodir.",
    "Valoriza a união entre tecnologia de ponta e sabedoria ancestral."
  ];

  return (
    <section className="py-16 px-4 bg-background-dark">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">O Celest AI é para você que...</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((text, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 bg-[#2a1e1a]/50 rounded-lg border border-transparent hover:border-primary/20 transition-colors">
              <span className="material-symbols-outlined text-primary shrink-0">check_circle</span>
              <p className="text-sm text-gray-300">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;
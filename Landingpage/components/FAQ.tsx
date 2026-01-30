import React from 'react';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => (
  <details className="group bg-[#2a1e1a] rounded-lg border border-[#3a2822] overflow-hidden">
    <summary className="flex items-center justify-between p-4 cursor-pointer list-none select-none">
      <span className="font-medium text-white text-left pr-4">{question}</span>
      <span className="material-symbols-outlined text-primary transition-transform duration-300 group-open:rotate-180">expand_more</span>
    </summary>
    <div className="px-4 pb-4 text-text-muted text-sm leading-relaxed border-t border-white/5 pt-3">
      {answer}
    </div>
  </details>
);

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "Como a IA sabe sobre mim?",
      answer: "Utilizamos dados do seu mapa astral combinados com suas respostas de comportamento para criar um perfil psicológico e energético único."
    },
    {
      question: "Funciona para céticos?",
      answer: "Sim. O Celest AI é fundamentado em arquétipos junguianos e análise de dados. A linguagem é mística, mas a base é lógica."
    },
    {
      question: "Tenho atualização?",
      answer: "Absolutamente. Se em 7 dias você não sentir mais clareza, devolvemos 100% do seu investimento."
    },
    {
      question: "O acesso é imediato?",
      answer: "Sim! Assim que o pagamento for confirmado, você receberá um email com seu acesso exclusivo ao portal Celest."
    }
  ];

  return (
    <section className="py-16 px-4 bg-[#1a1210]">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">Perguntas Frequentes</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
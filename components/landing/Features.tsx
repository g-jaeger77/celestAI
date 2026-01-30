import React from 'react';

const FeatureItem: React.FC<{ icon: string; text: string; isLast?: boolean }> = ({ icon, text, isLast }) => (
    <li className={`flex items-center justify-between ${!isLast ? 'border-b border-white/10 pb-3' : ''}`}>
        <div className="flex items-center gap-3">
            <span className="bg-primary/20 p-2 rounded-lg text-primary material-symbols-outlined">{icon}</span>
            <span className="text-white font-medium">{text}</span>
        </div>
        <span className="material-symbols-outlined text-green-500">check</span>
    </li>
);

const Features: React.FC = () => {
    return (
        <section className="py-12 px-4 bg-gradient-to-b from-background-dark to-[#1a1210]">
            <div className="max-w-2xl mx-auto bg-[#2a1e1a] rounded-2xl p-6 md:p-8 border border-[#3a2822] shadow-xl">
                <h3 className="text-xl font-bold text-white mb-6 text-center uppercase tracking-widest text-primary">O que você recebe</h3>
                <ul className="space-y-4">
                    <FeatureItem icon="smart_toy" text="Celest AI Chat que te entende" />
                    <FeatureItem icon="explore" text="Bússola Diária de Decisão" />
                    <FeatureItem icon="menu_book" text="Roda da Vida Transformadora" />
                    <FeatureItem icon="join_inner" text="Sinergia de Mapas com outras pessoas" isLast />
                </ul>
            </div>
        </section>
    );
};

export default Features;

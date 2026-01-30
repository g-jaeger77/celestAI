import React from 'react';
import { IMAGES } from './constants';

const Hero: React.FC = () => {
    return (
        <section className="relative pt-24 pb-12 px-4 overflow-hidden">
            <div className="absolute inset-0 bg-glow pointer-events-none"></div>

            <div className="max-w-xl mx-auto flex flex-col items-center text-center gap-6 relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                    Encontre <span className="text-primary">clareza absoluta</span> em meio ao caos.
                </h1>

                <p className="text-text-muted text-lg leading-relaxed max-w-sm">
                    A sua bússola diária alimentada por inteligência artificial para navegar a vida com propósito e eliminar a dúvida.
                </p>

                <div className="relative w-full max-w-[280px] aspect-[9/19] mt-8 mx-auto rounded-[2.5rem] border-8 border-[#3a2822] bg-[#1a1210] overflow-hidden shadow-2xl shadow-primary/10 animate-float">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${IMAGES.heroPhone}')` }}
                        aria-label="Celest AI app interface showing cosmic dashboard"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#201613]/50 to-[#201613]"></div>

                        <div className="absolute bottom-8 left-4 right-4">
                            <div className="bg-[#2a1e1a]/90 backdrop-blur-sm p-4 rounded-xl border border-primary/20 shadow-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-primary text-sm animate-pulse">auto_awesome</span>
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">Insight do Dia</span>
                                </div>
                                <p className="text-sm text-white/90 font-medium">
                                    "Sua intuição está alinhada. O momento de agir é agora, não espere a perfeição."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

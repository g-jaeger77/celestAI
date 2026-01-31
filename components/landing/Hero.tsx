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
                        className="absolute inset-0 bg-cover bg-top"
                        style={{ backgroundImage: "url('/assets/dashboard_preview.png')" }}
                        aria-label="Celest AI app interface showing cosmic dashboard"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#201613]/20"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

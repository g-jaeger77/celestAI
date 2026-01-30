import React from 'react';
import { IMAGES } from '../constants';

const Pricing: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-background-dark relative" id="offer">
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ backgroundImage: `url('${IMAGES.stardust}')` }}
      ></div>
      
      <div className="max-w-xl mx-auto text-center relative z-10">
        
        {/* Discount Badge */}
        <div className="mb-8 bg-[#2a1e1a]/40 rounded-lg p-4 inline-block backdrop-blur-sm border border-white/5">
          <div className="flex items-center gap-8 justify-center text-sm md:text-base">
            <div className="flex flex-col">
              <span className="text-text-muted line-through decoration-primary decoration-2">R$ 258,00</span>
              <span className="text-xs text-text-muted/60">Preço normal</span>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg">Oferta Hoje</span>
              <span className="text-xs text-primary font-bold">ECONOMIZE 55%</span>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#2a1e1a] rounded-2xl border border-primary p-1 shadow-[0_0_40px_rgba(214,88,46,0.15)] overflow-hidden">
          <div className="bg-[#201613] rounded-xl p-6 md:p-10 relative overflow-hidden">
            <h3 className="text-2xl font-bold text-white mb-2 pt-2">Plano Vitalício</h3>
            <p className="text-text-muted mb-6">Acesso total e eterno ao Celest AI.</p>
            
            <div className="flex items-end justify-center gap-1 mb-8">
              <span className="text-text-muted text-lg mb-1">12x de</span>
              <span className="text-5xl font-bold text-white tracking-tighter">9,74</span>
              <span className="text-text-muted text-sm mb-1">/mês</span>
            </div>
            
            <p className="text-sm text-text-muted -mt-6 mb-8">ou R$ 97,00 à vista</p>
            
            <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 mb-4 group">
              QUERO MINHA CLAREZA AGORA
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            
            <div className="flex items-center justify-center gap-4 text-xs text-text-muted/80">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">lock</span>
                Pagamento Seguro
              </div>
            </div>
            
            <div className="mt-4 text-xs text-text-muted/60 flex items-center justify-center gap-1.5 opacity-80 border-t border-white/5 pt-3">
              <span className="material-symbols-outlined text-sm text-primary">verified_user</span>
              <span className="italic">Sua evolução é nossa prioridade absoluta, com transparência total.</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Pricing;
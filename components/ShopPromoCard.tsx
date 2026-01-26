
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';

const ShopPromoCard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div
            className="w-full bg-[#1C1C1E] rounded-[24px] border border-white/5 p-6 relative overflow-hidden flex flex-col gap-6"
        >
            {/* Header */}
            <div className="flex items-center gap-3">
                <h3 className="text-[20px] font-bold text-white tracking-tight">Expansões Cósmicas</h3>
            </div>

            {/* List */}
            <div className="space-y-4">

                {/* Item 1: Codex */}
                <div
                    className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 active:scale-[0.98] transition-transform cursor-pointer hover:bg-white/10"
                    onClick={() => navigate('/waitlist?product=codex')}
                >
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
                        <Icon name="fingerprint" className="text-amber-400 text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                            <h4 className="text-white font-bold text-[13px]">Relatório Natal Profundo</h4>
                            <Icon name="chevron_right" className="text-gray-600 text-[18px]" />
                        </div>
                        <p className="text-[#8e8e93] text-[11px] truncate">Análise de 50+ páginas (Codex)</p>
                    </div>
                </div>

                {/* Item 2: Waves */}
                <div
                    className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 active:scale-[0.98] transition-transform cursor-pointer hover:bg-white/10"
                    onClick={() => navigate('/waitlist?product=waves')}
                >
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                        <Icon name="graphic_eq" className="text-blue-400 text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                            <h4 className="text-white font-bold text-[13px]">Frequências Binaurais</h4>
                            <Icon name="chevron_right" className="text-gray-600 text-[18px]" />
                        </div>
                        <p className="text-[#8e8e93] text-[11px] truncate">Sincronização Hertziana</p>
                    </div>
                </div>

                {/* Item 3: Karma (Synastry) */}
                <div
                    className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 active:scale-[0.98] transition-transform cursor-pointer hover:bg-white/10"
                    onClick={() => navigate('/waitlist?product=karma')}
                >
                    <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center border border-pink-500/20 shrink-0">
                        <Icon name="favorite" className="text-pink-400 text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                            <h4 className="text-white font-bold text-[13px]">Sinastria Premium</h4>
                            <Icon name="chevron_right" className="text-gray-600 text-[18px]" />
                        </div>
                        <p className="text-[#8e8e93] text-[11px] truncate">Compatibilidade Astral & Karma</p>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <div className="text-center">
                <p className="text-[#8e8e93] text-[10px] leading-tight mb-4 px-4">
                    As expansões são adquiridas individualmente para acesso vitalício.
                </p>
                <button
                    onClick={() => navigate('/waitlist?product=store')}
                    className="w-full py-3.5 rounded-full bg-black border border-white/10 text-white text-[13px] font-bold hover:bg-white/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                    Explorar Loja Premium
                </button>
            </div>

        </div>
    );
};

export default ShopPromoCard;

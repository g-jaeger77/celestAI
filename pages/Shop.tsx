import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';

const Shop: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F2F2F7] text-black font-sans antialiased min-h-screen flex flex-col pt-6 pb-8 px-5">
      <header className="mb-6 flex items-start gap-2">
        <button onClick={() => navigate(-1)} className="mt-1">
            <Icon name="arrow_back" className="text-black" />
        </button>
        <h1 className="text-[34px] leading-tight font-bold tracking-tight text-black">
            Expansões<br/>Cósmicas
        </h1>
      </header>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="group flex items-center p-4 active:bg-gray-100 transition-colors cursor-pointer relative">
            <div className="flex-shrink-0 mr-4">
                <div className="w-[50px] h-[50px] rounded-[10px] bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 flex items-center justify-center shadow-sm">
                    <Icon name="auto_awesome" className="text-white text-[28px]" />
                </div>
            </div>
            <div className="flex-1 min-w-0 pr-2">
                <h3 className="text-[17px] font-semibold text-black leading-snug truncate">
                    Relatório Natal Profundo
                </h3>
                <p className="text-[15px] text-[#8E8E93] leading-snug truncate">
                    Análise de 50+ páginas
                </p>
            </div>
            <div className="flex-shrink-0 pl-2">
                <Icon name="info" className="text-[#AEAEB2] text-[24px]" />
            </div>
            <div className="absolute bottom-0 right-0 left-[82px] h-[0.5px] bg-[#C6C6C8]"></div>
        </div>

        <div className="group flex items-center p-4 active:bg-gray-100 transition-colors cursor-pointer relative">
            <div className="flex-shrink-0 mr-4">
                <div className="w-[50px] h-[50px] rounded-[10px] bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center shadow-sm">
                    <Icon name="event_note" className="text-white text-[28px]" />
                </div>
            </div>
            <div className="flex-1 min-w-0 pr-2">
                <h3 className="text-[17px] font-semibold text-black leading-snug truncate">
                    Guia de Trânsitos Anual
                </h3>
                <p className="text-[15px] text-[#8E8E93] leading-snug truncate">
                    Cosmic Health System, Inc.
                </p>
            </div>
            <div className="flex-shrink-0 pl-2">
                <Icon name="info" className="text-[#AEAEB2] text-[24px]" />
            </div>
            <div className="absolute bottom-0 right-0 left-[82px] h-[0.5px] bg-[#C6C6C8]"></div>
        </div>

        <div className="group flex items-center p-4 active:bg-gray-100 transition-colors cursor-pointer">
            <div className="flex-shrink-0 mr-4">
                <div className="w-[50px] h-[50px] rounded-[10px] bg-gradient-to-br from-pink-400 to-rose-600 flex items-center justify-center shadow-sm">
                    <Icon name="favorite" className="text-white text-[28px]" />
                </div>
            </div>
            <div className="flex-1 min-w-0 pr-2">
                <h3 className="text-[17px] font-semibold text-black leading-snug truncate">
                    Sinastria Premium
                </h3>
                <p className="text-[15px] text-[#8E8E93] leading-snug truncate">
                    Compatibilidade Astral
                </p>
            </div>
            <div className="flex-shrink-0 pl-2">
                <Icon name="info" className="text-[#AEAEB2] text-[24px]" />
            </div>
        </div>
      </div>

      <div className="mt-4 px-1">
        <p className="text-[13px] text-[#8E8E93] text-center leading-relaxed">
            As expansões são adquiridas individualmente para acesso vitalício.
        </p>
      </div>

      <div className="mt-auto pt-8">
        <button className="w-full bg-black text-white font-semibold text-[17px] py-4 rounded-full shadow-lg hover:opacity-90 active:scale-[0.98] transition-all transform flex items-center justify-center">
            Explorar Loja Premium
        </button>
      </div>
    </div>
  );
};

export default Shop;
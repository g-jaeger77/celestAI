import React, { useState } from 'react';
import Icon from '../Icon';

type ConnectionType = 'love' | 'work' | 'social';

interface AddConnectionFormProps {
    onSave: (data: any) => void;
    embedded?: boolean;
}

const AddConnectionForm: React.FC<AddConnectionFormProps> = ({ onSave, embedded = false }) => {
    const [type, setType] = useState<ConnectionType | null>(null);
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [city, setCity] = useState('');

    const handleSave = () => {
        if (!type || !name || !date) return;

        onSave({
            name,
            role: role || (type === 'love' ? 'Parceiro' : type === 'work' ? 'Colega' : 'Amigo'),
            type,
            birthDate: date,
            birthTime: time || '12:00',
            birthCity: city || 'Unknown'
        });

        // Reset
        setType(null);
        setName('');
        setRole('');
        setDate('');
        setTime('');
        setCity('');
    };

    // UPDATE: Background is now TINTED (not gray) in unselected state
    // Active state has strong glow + stroke
    const getSelectionStyle = (t: ConnectionType, isActive: boolean) => {
        const base = "aspect-square md:aspect-auto md:h-24 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-300";

        if (t === 'love') return isActive
            ? `${base} border-pink-500 text-pink-400 bg-pink-500/20 shadow-[0_0_25px_rgba(236,72,153,0.5)] scale-[1.05] z-10`
            : `${base} border-pink-500/30 text-pink-400/80 bg-pink-500/5 hover:bg-pink-500/10 hover:border-pink-500/60 hover:text-pink-400 hover:shadow-[0_0_15px_rgba(236,72,153,0.2)]`;

        if (t === 'work') return isActive
            ? `${base} border-blue-500 text-blue-400 bg-blue-500/20 shadow-[0_0_25px_rgba(59,130,246,0.5)] scale-[1.05] z-10`
            : `${base} border-blue-500/30 text-blue-400/80 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/60 hover:text-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]`;

        // social
        return isActive
            ? `${base} border-amber-500 text-amber-400 bg-amber-500/20 shadow-[0_0_25px_rgba(245,158,11,0.5)] scale-[1.05] z-10`
            : `${base} border-amber-500/30 text-amber-400/80 bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500/60 hover:text-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]`;
    };

    return (
        <div className="w-full">
            {/* 1. Context Switcher */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                    onClick={() => setType('love')}
                    className={getSelectionStyle('love', type === 'love')}
                >
                    <Icon name="favorite" className="text-2xl drop-shadow-md" />
                    <span className="text-[10px] uppercase font-bold tracking-wider drop-shadow-sm">Amor</span>
                </button>

                <button
                    onClick={() => setType('work')}
                    className={getSelectionStyle('work', type === 'work')}
                >
                    <Icon name="work" className="text-2xl drop-shadow-md" />
                    <span className="text-[10px] uppercase font-bold tracking-wider drop-shadow-sm">Trabalho</span>
                </button>

                <button
                    onClick={() => setType('social')}
                    className={getSelectionStyle('social', type === 'social')}
                >
                    <Icon name="groups" className="text-2xl drop-shadow-md" />
                    <span className="text-[10px] uppercase font-bold tracking-wider drop-shadow-sm">Social</span>
                </button>
            </div>

            {/* 2. Inputs Grouped (Apple Health Style) */}
            <div className="space-y-6 mb-8">
                <div className="space-y-1">
                    <label className="text-[13px] text-gray-400 font-medium ml-4 uppercase">Informações Básicas</label>
                    <div className="bg-[#2C2C2E] rounded-xl overflow-hidden divide-y divide-[#3A3A3C]">
                        <input
                            value={name} onChange={e => setName(e.target.value)}
                            className="w-full bg-transparent text-white p-4 outline-none placeholder:text-gray-500 font-medium text-[17px]"
                            placeholder="Nome Completo"
                        />
                        <input
                            value={role} onChange={e => setRole(e.target.value)}
                            className="w-full bg-transparent text-white p-4 outline-none placeholder:text-gray-500 font-medium text-[17px]"
                            placeholder={type === 'love' ? "Papel (Ex: Esposa)" : type === 'work' ? "Papel (Ex: Sócio)" : "Papel (Ex: Amigo)"}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[13px] text-gray-400 font-medium ml-4 uppercase">Dados Astrais</label>
                    <div className="bg-[#2C2C2E] rounded-xl overflow-hidden divide-y divide-[#3A3A3C]">
                        <div className="flex items-center">
                            <span className="text-white text-[17px] pl-4 w-28">Nascimento</span>
                            <input
                                type="date"
                                value={date} onChange={e => setDate(e.target.value)}
                                className="w-full bg-transparent text-gray-300 p-4 outline-none font-medium text-[17px] text-right appearance-none"
                            />
                        </div>
                        <div className="flex items-center">
                            <span className="text-white text-[17px] pl-4 w-28">Horário</span>
                            <input
                                type="time"
                                value={time} onChange={e => setTime(e.target.value)}
                                className="w-full bg-transparent text-gray-300 p-4 outline-none font-medium text-[17px] text-right appearance-none"
                            />
                        </div>
                        <div className="flex items-center">
                            <span className="text-white text-[17px] pl-4 w-28">Cidade</span>
                            <input
                                value={city} onChange={e => setCity(e.target.value)}
                                className="w-full bg-transparent text-white p-4 outline-none placeholder:text-gray-500 font-medium text-[17px] text-right"
                                placeholder="Opcional"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Action */}
            <button
                onClick={handleSave}
                disabled={!type || !name || !date}
                className="w-full py-4 rounded-xl bg-white text-black font-bold tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed mb-4 shadow-lg shadow-white/10"
            >
                CALCULAR SINERGIA
            </button>
        </div>
    );
};

export default AddConnectionForm;

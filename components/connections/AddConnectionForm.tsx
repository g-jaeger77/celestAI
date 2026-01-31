import React, { useState } from 'react';
import Icon from '../Icon';

type ConnectionType = 'love' | 'work' | 'social';

interface AddConnectionFormProps {
    onSave: (data: any) => void;
    embedded?: boolean;
}

const AddConnectionForm: React.FC<AddConnectionFormProps> = ({ onSave, embedded = false }) => {
    const [type, setType] = useState<ConnectionType | null>('love');
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
    // UPDATE: Liquid Glass Solid Cards (Apple Health Style)
    // Amor -> Pink (Alma), Work -> Cyan (Mente), Social -> Lime (Corpo)
    // UPDATE: Volumetric Liquid Glass (Solid Gradients + Sheen + Pop Effect)
    // UPDATE: Volumetric Liquid Glass (Solid Gradients + Sheen + Pop Effect)
    // USING INLINE STYLES FOR BACKGROUND TO FORCE RENDER ON MOBILE
    const getSelectionStyle = (t: ConnectionType, isActive: boolean) => {
        const base = "relative overflow-hidden h-24 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 group";
        const sheen = "before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none";

        let style = {};
        let classes = base;

        if (isActive) {
            // Active: Solid Gradient Background (Inline) + Shadow + White Text
            classes += ` text-white scale-[1.05] z-10 ${sheen}`;
            if (t === 'love') {
                style = { background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', borderColor: '#ec4899', boxShadow: '0 10px 30px -5px rgba(236,72,153,0.6)' };
            } else if (t === 'work') {
                style = { background: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)', borderColor: '#22d3ee', boxShadow: '0 10px 30px -5px rgba(34,211,238,0.6)' };
            } else if (t === 'social') {
                style = { background: 'linear-gradient(135deg, #a3e635 0%, #4d7c0f 100%)', borderColor: '#a3e635', boxShadow: '0 10px 30px -5px rgba(163,230,53,0.6)' };
            }
        } else {
            // Inactive: Dark Glass
            classes += ` bg-[#1C1C1E]/60 border-white/10 hover:text-white`;
            if (t === 'love') classes += " text-pink-400/80 hover:bg-pink-500/10 hover:border-pink-500/40";
            else if (t === 'work') classes += " text-cyan-400/80 hover:bg-cyan-400/10 hover:border-cyan-400/40";
            else if (t === 'social') classes += " text-lime-400/80 hover:bg-lime-400/10 hover:border-lime-400/40";
        }

        return { className: classes, style };
    };

    return (
        <div className="w-full">
            {/* 1. Context Switcher */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                    type="button"
                    onClick={() => setType('love')}
                    {...getSelectionStyle('love', type === 'love')}
                >
                    <Icon name="favorite" className="text-2xl drop-shadow-md" />
                    <span className="text-[10px] uppercase font-bold tracking-wider drop-shadow-sm">Amor</span>
                </button>

                <button
                    type="button"
                    onClick={() => setType('work')}
                    {...getSelectionStyle('work', type === 'work')}
                >
                    <Icon name="work" className="text-2xl drop-shadow-md" />
                    <span className="text-[10px] uppercase font-bold tracking-wider drop-shadow-sm">Trabalho</span>
                </button>

                <button
                    type="button"
                    onClick={() => setType('social')}
                    {...getSelectionStyle('social', type === 'social')}
                >
                    <Icon name="groups" className="text-2xl drop-shadow-md" />
                    <span className="text-[10px] uppercase font-bold tracking-wider drop-shadow-sm">Social</span>
                </button>
            </div>

            {/* 2. Inputs */}
            <div className="space-y-4 mb-8">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Nome</label>
                    <input
                        value={name} onChange={e => setName(e.target.value)}
                        className="w-full bg-[#2C2C2E] text-white p-4 rounded-xl outline-none border border-transparent focus:border-white/20 transition-all font-medium placeholder:text-gray-500"
                        placeholder="Ex: Ana Silva"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Papel / Função (Opcional)</label>
                    <input
                        value={role} onChange={e => setRole(e.target.value)}
                        className="w-full bg-[#2C2C2E] text-white p-4 rounded-xl outline-none border border-transparent focus:border-white/20 transition-all font-medium placeholder:text-gray-500"
                        placeholder={type === 'love' ? "Ex: Esposa" : type === 'work' ? "Ex: Sócio" : "Ex: Amigo"}
                    />
                </div>

                <div className="flex gap-3">
                    <div className="flex-[3]">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Nascimento</label>
                        <input
                            type="date"
                            value={date} onChange={e => setDate(e.target.value)}
                            className="w-full bg-[#2C2C2E] text-white p-4 rounded-xl outline-none border border-transparent focus:border-white/20 transition-all font-medium appearance-none"
                        />
                    </div>
                    <div className="flex-[2]">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Hora (Opcional)</label>
                        <input
                            type="time"
                            value={time} onChange={e => setTime(e.target.value)}
                            className="w-full bg-[#2C2C2E] text-white p-4 rounded-xl outline-none border border-transparent focus:border-white/20 transition-all font-medium appearance-none text-center"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Cidade (Opcional)</label>
                    <input
                        value={city} onChange={e => setCity(e.target.value)}
                        className="w-full bg-[#2C2C2E] text-white p-4 rounded-xl outline-none border border-transparent focus:border-white/20 transition-all font-medium placeholder:text-gray-500"
                        placeholder="Cidade de nascimento"
                    />
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

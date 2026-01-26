import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import BottomNav from '../components/BottomNav';

const CompatibilityInput: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [relationshipType, setRelationshipType] = useState<'passionate' | 'professional' | 'karmic'>('passionate');
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        city: ''
    });

    const handleAnalysis = async () => {
        setIsLoading(true);
        try {
            const savedProfile = localStorage.getItem('user_birth_data');
            const currentUser = savedProfile ? JSON.parse(savedProfile) : null;

            if (!currentUser) {
                alert("Você precisa preencher seu próprio perfil primeiro.");
                navigate('/');
                return;
            }

            // Mock delay for effect
            await new Promise(r => setTimeout(r, 1500));

            const response = await fetch('http://localhost:8000/agent/synastry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_data: {
                        name: currentUser.full_name,
                        date: currentUser.birth_date,
                        time: currentUser.birth_time,
                        city: currentUser.birth_city
                    },
                    partner_data: formData,
                    relationship_type: relationshipType
                })
            });

            if (!response.ok) throw new Error("Synchronization Error");

            const result = await response.json();
            navigate('/compatibility-result', { state: { result, partnerName: formData.name, type: relationshipType } });

        } catch (error) {
            console.error(error);
            alert("Erro ao calcular sinastria. Verifique os dados.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-[#000000] text-white font-display overflow-hidden flex flex-col">
            {/* Background Ambient */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 blur-[100px] rounded-full mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 blur-[100px] rounded-full mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <header className="flex items-center justify-between p-4 pt-6 sticky top-0 z-40 bg-black/50 backdrop-blur-md border-b border-white/5">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center justify-center size-10 rounded-full bg-white/5 text-white active:scale-95 transition-all hover:bg-white/10"
                >
                    <Icon name="arrow_back_ios_new" style={{ fontSize: '18px' }} />
                </button>
                <span className="text-sm font-semibold tracking-wide uppercase text-white/70">Nova Sinastria</span>
                <div className="size-10"></div> {/* Spacer */}
            </header>

            <main className="relative z-10 flex-1 flex flex-col px-5 pb-32 max-w-md mx-auto w-full pt-4">
                <div className="mb-8">
                    <h1 className="text-[32px] font-bold leading-tight tracking-tight mb-3 text-white">
                        Sincronização
                    </h1>
                    <p className="text-white/60 text-[17px] font-normal leading-relaxed">
                        Escolha o tipo de conexão para analisar a ressonância estelar.
                    </p>
                </div>

                <form className="space-y-8 flex-1" onSubmit={(e) => { e.preventDefault(); handleAnalysis(); }}>

                    {/* Relationship Type Selector */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Tipo de Elo</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'passionate', label: 'Afetivo', icon: 'favorite', color: 'from-pink-500/20 to-rose-600/20 border-rose-500/30' },
                                { id: 'professional', label: 'Negócios', icon: 'work', color: 'from-blue-500/20 to-cyan-600/20 border-cyan-500/30' },
                                { id: 'karmic', label: 'Kármico', icon: 'spa', color: 'from-purple-500/20 to-indigo-600/20 border-purple-500/30' }
                            ].map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setRelationshipType(type.id as any)}
                                    className={`relative flex flex-col items-center justify-center h-28 rounded-2xl border transition-all duration-300 group overflow-hidden ${relationshipType === type.id
                                        ? `bg-gradient-to-br ${type.color} text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-[1.02]`
                                        : 'bg-[#1C1C1E] border-white/5 text-white/40 hover:bg-white/5 hover:scale-[1.02]'
                                        }`}
                                >
                                    <div className={`mb-2 p-2 rounded-full transition-colors ${relationshipType === type.id ? 'bg-white/20' : 'bg-white/5'}`}>
                                        <Icon name={type.icon} className={`text-[24px] ${relationshipType === type.id ? 'text-white' : 'text-white/40'}`} />
                                    </div>
                                    <span className="text-[11px] font-medium tracking-wide">{type.label}</span>

                                    {/* Active Glow */}
                                    {relationshipType === type.id && (
                                        <div className="absolute inset-0 bg-white/5 mix-blend-overlay"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Dados da Entidade B</label>

                        <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                            {/* Name */}
                            <div className="flex items-center px-4 py-3 group focus-within:bg-white/5 transition-colors">
                                <div className="w-8 flex justify-center text-white/30 group-focus-within:text-white/80">
                                    <Icon name="person" />
                                </div>
                                <input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="flex-1 bg-transparent border-none text-white placeholder:text-white/20 focus:ring-0 text-[17px] p-2"
                                    placeholder="Nome Completo"
                                    type="text"
                                    required
                                />
                            </div>

                            {/* Date */}
                            <div className="flex items-center px-4 py-3 group focus-within:bg-white/5 transition-colors">
                                <div className="w-8 flex justify-center text-white/30 group-focus-within:text-white/80">
                                    <Icon name="calendar_today" />
                                </div>
                                <input
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="flex-1 bg-transparent border-none text-white placeholder:text-white/20 focus:ring-0 text-[17px] p-2 [color-scheme:dark]"
                                    type="date"
                                    required
                                />
                            </div>

                            {/* Time */}
                            <div className="flex items-center px-4 py-3 group focus-within:bg-white/5 transition-colors">
                                <div className="w-8 flex justify-center text-white/30 group-focus-within:text-white/80">
                                    <Icon name="schedule" />
                                </div>
                                <input
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    className="flex-1 bg-transparent border-none text-white placeholder:text-white/20 focus:ring-0 text-[17px] p-2 [color-scheme:dark]"
                                    type="time"
                                    placeholder="Hora (Opcional)"
                                />
                            </div>

                            {/* City */}
                            <div className="flex items-center px-4 py-3 group focus-within:bg-white/5 transition-colors">
                                <div className="w-8 flex justify-center text-white/30 group-focus-within:text-white/80">
                                    <Icon name="location_on" />
                                </div>
                                <input
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="flex-1 bg-transparent border-none text-white placeholder:text-white/20 focus:ring-0 text-[17px] p-2"
                                    placeholder="Cidade de Nascimento"
                                    type="text"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full relative overflow-hidden bg-white text-black h-14 rounded-full font-bold text-[17px] hover:bg-gray-200 active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 group ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="size-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                    <span>Processando...</span>
                                </>
                            ) : (
                                <>
                                    <span>Iniciar Análise</span>
                                    <Icon name="bolt" className="text-xl" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>

            <BottomNav active="compatibility" />
        </div>
    );
};

export default CompatibilityInput;
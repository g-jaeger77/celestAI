import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import ShopPromoCard from '../components/ShopPromoCard';
import BottomNav from '../components/BottomNav';
import { SEOHead } from '../components/SEOHead';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState({
        full_name: 'Viajante',
        birth_date: '',
        birth_time: '',
        birth_city: '',
        avatar: '' // Base64 string
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem('user_birth_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setData(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error("Failed to load profile", e);
            }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('user_birth_data', JSON.stringify({
            ...data
        }));
        // Dispatch storage event to notify Sidebar/Header if they listen (or just rely on re-mount)
        window.dispatchEvent(new Event('storage'));
        setIsEditing(false);
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setData(prev => ({ ...prev, avatar: reader.result as string }));
                setIsEditing(true); // Automatically switch to "Salvar" button
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="font-display antialiased text-white min-h-screen pb-24 relative overflow-hidden bg-transparent">
            <SEOHead
                title="Perfil"
                description="Gerencie seus dados natais e configurações do seu perfil astrológico."
                path="/profile"
            />
            {/* Background Elements (Blobs similar to Chat) */}

            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-900/10 blur-[100px] rounded-full"></div>
            </div>

            <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-transparent backdrop-blur-none border-b-0 relative z-10">
                <button
                    onClick={() => isEditing ? setIsEditing(false) : navigate(-1)}
                    className="w-20 flex items-center justify-start text-[#13b6ec] cursor-pointer hover:text-white transition-colors"
                >
                    {isEditing ? (
                        <span className="text-[17px] font-normal">Cancelar</span>
                    ) : (
                        <Icon name="chevron_left" className="!text-[28px]" />
                    )}
                </button>
                <h1 className="text-[17px] font-semibold tracking-tight text-center flex-1">Perfil</h1>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="w-20 flex items-center justify-end text-[#13b6ec] cursor-pointer hover:text-white transition-colors"
                >
                    <span className="text-[17px] font-bold">{isEditing ? 'Salvar' : 'Editar'}</span>
                </button>
            </header>

            <section className="flex flex-col items-center pt-8 pb-8 px-6 relative z-10">
                <div className="relative mb-5 group cursor-pointer" onClick={handleAvatarClick}>
                    {/* Glow */}
                    <div className="absolute -inset-4 bg-[#13b6ec]/20 rounded-full blur-2xl opacity-60 animate-pulse"></div>

                    {/* Avatar Container */}
                    <div className="relative w-28 h-28 rounded-full p-[2px]" style={{ backgroundColor: '#13b6ec' }}>
                        <div className="w-full h-full rounded-full overflow-hidden relative flex items-center justify-center" style={{ backgroundColor: '#13b6ec' }}>
                            {data.avatar ? (
                                <img
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    src={data.avatar}
                                />
                            ) : (
                                <span className="text-4xl font-bold text-black">{data.full_name.charAt(0)}</span>
                            )}

                            {/* Camera Overlay - Always active */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[1px]">
                                <Icon name="photo_camera" className="text-white text-3xl drop-shadow-lg scale-90 group-hover:scale-100 transition-transform" />
                            </div>
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="w-full max-w-xs text-center">
                    {isEditing ? (
                        <input
                            type="text"
                            value={data.full_name}
                            onChange={(e) => setData({ ...data, full_name: e.target.value })}
                            className="bg-transparent border-b border-white/20 text-2xl font-bold text-center text-white w-full py-1 focus:border-[#13b6ec] outline-none"
                            placeholder="Seu Nome"
                        />
                    ) : (
                        <h2 className="text-2xl font-bold tracking-tight text-white">{data.full_name}</h2>
                    )}
                </div>
            </section>

            <div className="px-4 mb-6 relative z-10">
                <div className="pl-4 pb-2">
                    <h3 className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wider">Dados Natais</h3>
                </div>
                {/* Glassmorphism Card (Apple Health style) */}
                <div className="bg-[#1C1C1E]/60 backdrop-blur-xl rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10">

                    {/* Birth Date */}
                    <div
                        className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => !isEditing && setIsEditing(true)}
                    >
                        <span className="text-[17px] font-normal text-white">Data</span>
                        {isEditing ? (
                            <input
                                type="date"
                                value={data.birth_date}
                                onChange={(e) => setData({ ...data, birth_date: e.target.value })}
                                className="bg-transparent text-right text-white outline-none w-auto max-w-[160px] font-medium"
                                onClick={(e) => e.stopPropagation()} // Prevent re-triggering
                            />
                        ) : (
                            <span className="text-[17px] text-[#8E8E93]">
                                {data.birth_date ? data.birth_date.split('-').reverse().join('/') : 'Definir'}
                            </span>
                        )}
                    </div>

                    {/* Birth Time */}
                    <div
                        className="flex items-center justify-between p-4 border-b border-white/10 last:border-0 cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => !isEditing && setIsEditing(true)}
                    >
                        <span className="text-[17px] font-normal text-white">Horário</span>
                        {isEditing ? (
                            <input
                                type="time" // Use click time picker
                                value={data.birth_time}
                                onChange={(e) => setData({ ...data, birth_time: e.target.value })}
                                className="bg-transparent text-right text-white outline-none w-24 font-medium"
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <span className="text-[17px] text-[#8E8E93]">{data.birth_time || 'Definir'}</span>
                        )}
                    </div>

                    {/* Birth City */}
                    <div
                        className="flex items-center justify-between p-4 border-b border-white/10 last:border-0 cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => !isEditing && setIsEditing(true)}
                    >
                        <span className="text-[17px] font-normal text-white">Local</span>
                        {isEditing ? (
                            <input
                                type="text"
                                value={data.birth_city}
                                onChange={(e) => setData({ ...data, birth_city: e.target.value })}
                                className="bg-transparent text-right text-white outline-none flex-1 ml-4 font-medium placeholder:text-[#8E8E93]/50"
                                placeholder="Cidade, Estado"
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <span className="text-[17px] text-[#8E8E93] truncate max-w-[200px]">{data.birth_city || 'Definir'}</span>
                        )}
                    </div>

                </div>
            </div>



            {/* Shop Promo */}
            <div className="px-4 mt-8 relative z-10">
                <ShopPromoCard />
            </div>

            <div className="px-4 mt-8 relative z-10 space-y-4 pb-8">
                <p className="text-center text-xs text-[#8E8E93] font-medium">Celest AI v1.2.1 &copy; 2026</p>

                <button
                    onClick={() => {
                        if (confirm('Tem certeza? Isso apagará todos os seus dados e conexões.')) {
                            localStorage.clear();
                            window.location.href = '/#/onboarding';
                            window.location.reload();
                        }
                    }}
                    className="w-full py-3 rounded-xl border border-red-500/20 text-red-500/50 text-[11px] font-bold uppercase tracking-wider hover:bg-red-500/10 hover:text-red-500 transition-all"
                >
                    Resetar Aplicativo (Debug)
                </button>
            </div>

            {/* Mobile Navigation - Hidden on Desktop */}
            <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 h-16">
                <BottomNav active="profile" />
            </div>
        </div >
    );
};

export default Profile;
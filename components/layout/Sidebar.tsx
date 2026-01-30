import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../Icon';
import { CelestIcon } from '../CelestIcon';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userName, setUserName] = React.useState("Viajante");
    const [userAvatar, setUserAvatar] = React.useState("");

    React.useEffect(() => {
        const loadData = () => {
            const data = localStorage.getItem('user_birth_data');
            if (data) {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.full_name) setUserName(parsed.full_name);
                    if (parsed.avatar) setUserAvatar(parsed.avatar);
                } catch (e) { }
            }
        };
        loadData();
        window.addEventListener('storage', loadData);
        return () => window.removeEventListener('storage', loadData);
    }, []);

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { path: '/dashboard', icon: 'grid_view', label: 'Hoje' },
        { path: '/report', icon: 'tune', label: 'Alinhamento' },
        { path: '/chat', icon: 'chat_bubble', label: 'Astral' },
        { path: '/synastry', icon: 'favorite', label: 'Sincronia' },
        { path: '/profile', icon: 'person', label: 'Perfil' },
    ];

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen bg-black/90 border-r border-white/10 fixed left-0 top-0 z-50 backdrop-blur-xl">
            {/* Logo Area */}
            <div className="p-8 flex items-center gap-3">
                <CelestIcon size={40} className="w-10 h-10 opacity-90 drop-shadow-[0_0_12px_rgba(214,88,44,0.4)]" />
                <h1 className="font-display font-bold text-xl text-white tracking-wider uppercase">Celest AI</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 flex flex-col gap-2">
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive(item.path)
                            ? 'bg-white/10 text-white shadow-lg shadow-white/5'
                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Icon
                            name={item.icon}
                            className={`text-xl transition-transform group-hover:scale-110 ${isActive(item.path) ? 'text-[#427cf0]' : ''}`}
                        />
                        <span className="font-medium tracking-wide">{item.label}</span>

                        {isActive(item.path) && (
                            <div className="bg-[#427cf0] w-1.5 h-1.5 rounded-full ml-auto shadow-[0_0_8px_#427cf0]"></div>
                        )}
                    </button>
                ))}
            </nav>

            {/* Footer / User */}
            <div className="p-4 border-t border-white/10">
                <div
                    onClick={() => navigate('/onboarding')}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-colors cursor-pointer active:scale-95"
                >
                    <div className="size-8 rounded-full bg-[#13b6ec] flex items-center justify-center text-black font-bold text-xs overflow-hidden">
                        {userAvatar ? (
                            <img src={userAvatar} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            userName.charAt(0)
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white truncate max-w-[120px] capitalize">{userName}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Editar Perfil</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

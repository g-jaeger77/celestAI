
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';

const Waitlist: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const productKey = searchParams.get('product') || 'store';

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [submitted, setSubmitted] = useState(false);

    // Dynamic Content based on Product
    const getContent = () => {
        switch (productKey) {
            case 'codex':
                return {
                    title: "Relatório Natal Profundo",
                    desc: "Uma análise de 50+ páginas do seu DNA cósmico. Descubra sua missão de alma.",
                    icon: "fingerprint",
                    color: "text-amber-400"
                };
            case 'waves':
                return {
                    title: "Frequências Binaurais",
                    desc: "Áudios de bio-hacking sintonizados com o trânsito planetário do dia.",
                    icon: "graphic_eq",
                    color: "text-blue-400"
                };
            case 'karma':
                return {
                    title: "Sinastria Premium",
                    desc: "Análise kármica de relacionamentos e padrões de vidas passadas.",
                    icon: "favorite",
                    color: "text-pink-400"
                };
            case 'oracle':
                return {
                    title: "Visão do Futuro",
                    desc: "Algoritmo preditivo de longo alcance. Saiba o que os próximos 6 meses reservam.",
                    icon: "visibility", // icon name guess
                    color: "text-purple-500"
                };
            default:
                return {
                    title: "Loja Premium",
                    desc: "Ferramentas avançadas para sua evolução espiritual.",
                    icon: "rocket_launch",
                    color: "text-white"
                };
        }
    };

    const content = getContent();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here we would send to backend
        console.log("Waitlist:", { productKey, name, email });

        setTimeout(() => {
            setSubmitted(true);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/10 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 blur-[100px] rounded-full"></div>
            </div>

            {/* Close Button */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors z-50"
            >
                <Icon name="close" className="text-white" />
            </button>

            <div className="max-w-md w-full relative z-10 text-center">

                {/* Icon */}
                <div className="w-20 h-20 mx-auto bg-[#1C1C1E] rounded-3xl flex items-center justify-center border border-white/10 mb-8 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <Icon name={content.icon} className={`text-4xl ${content.color}`} />
                </div>

                <div className="mb-2">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#8E8E93] uppercase">Em Produção</span>
                </div>

                <h1 className="text-3xl font-bold mb-4 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                    {content.title}
                </h1>

                <p className="text-[#8E8E93] leading-relaxed mb-10 px-4">
                    {submitted
                        ? "Obrigado! Você será o primeiro a saber quando liberarmos o acesso."
                        : content.desc + " Estamos finalizando os últimos detalhes."}
                </p>

                {submitted ? (
                    <div className="animate-fade-in bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
                        <Icon name="check_circle" className="text-green-400 text-3xl mb-2" />
                        <p className="font-bold text-green-400">Você está na lista!</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <Icon name="person" className="absolute left-4 top-4 text-gray-500 group-focus-within:text-white transition-colors" />
                            <input
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Seu Nome"
                                className="w-full bg-[#1C1C1E] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/30 transition-all"
                            />
                        </div>

                        <div className="relative group">
                            <Icon name="mail" className="absolute left-4 top-4 text-gray-500 group-focus-within:text-white transition-colors" />
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Seu melhor e-mail"
                                className="w-full bg-[#1C1C1E] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/30 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-white text-black font-bold rounded-xl py-4 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
                        >
                            Entrar na Lista de Espera
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
};

export default Waitlist;

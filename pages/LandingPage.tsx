import React from 'react';
import { Check, Shield, Lock, Zap, ChevronDown, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#050508] text-white font-sans selection:bg-[#D6582C] selection:text-white">

            {/* DOBRA 1: HEADLINE (FUNDO ESCURO) */}
            <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 text-center bg-[#050508] overflow-hidden">
                {/* Glow de fundo */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#D6582C] opacity-20 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="z-10 mb-6 flex items-center gap-2">
                    {/* Ícone Simplificado Celest AI */}
                    <div className="w-8 h-8 md:w-10 md:h-10 text-[#D6582C]">
                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(214,88,44,0.6)]">
                            <path d="M50 0L85 20V80L50 100L15 80V20L50 0Z" fill="url(#paint0_linear)" />
                            <defs>
                                <linearGradient id="paint0_linear" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#D6582C" /> <stop offset="1" stopColor="#38271F" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <span className="text-2xl font-bold tracking-tight">Celest<span className="font-light text-[#D6582C]">AI</span></span>
                </div>

                <h1 className="z-10 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mb-6">
                    Pare de adivinhar como você está. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D6582C] to-[#9B5D33]">
                        Controle sua energia em 30s.
                    </span>
                </h1>

                <p className="z-10 text-lg md:text-xl text-gray-400 max-w-2xl mb-8">
                    Não é horóscopo. É engenharia de dados aplicada à sua rotina.<br />
                    Tenha clareza total sem perder tempo com misticismo.
                </p>

                {/* Mockup Placeholder */}
                <div className="z-10 mt-8 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#D6582C] to-[#32ADE6] rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative bg-[#0F0F12] border border-white/10 rounded-2xl p-4 w-full max-w-[320px] md:max-w-[400px] h-[500px] flex flex-col items-center justify-center shadow-2xl">
                        <div className="w-40 h-40 rounded-full border-4 border-[#32ADE6]/20 flex items-center justify-center mb-4">
                            <div className="w-32 h-32 rounded-full border-4 border-[#D6582C]/40 flex items-center justify-center">
                                <span className="text-3xl font-mono font-bold">85%</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 font-mono">SYSTEM: ONLINE</p>
                        <p className="text-xs text-gray-600 mt-2">Triangulating NASA Data...</p>
                    </div>
                </div>
            </section>

            {/* DOBRA 2: PROVA SOCIAL (FUNDO CLARO/CINZA) */}
            <section className="py-20 px-6 bg-[#0F0F12] border-t border-white/5">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-12">Mais de 1.200 usuários retomaram o controle</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            "O alerta de 'Lua Fora de Curso' me salvou de um contrato ruim.",
                            "Impressionante como o gráfico bate com meu cansaço.",
                            "Finalmente um app que não parece feitiçaria. Dados puros.",
                            "Uso todo dia antes do trabalho. Virou meu GPS."
                        ].map((text, i) => (
                            <div key={i} className="bg-[#18181B] p-6 rounded-xl border border-white/5 shadow-lg text-left">
                                <div className="flex items-center gap-2 mb-3 text-[#25D366]">
                                    <div className="w-2 h-2 rounded-full bg-current"></div>
                                    <span className="text-xs font-bold text-gray-400">WhatsApp Verified</span>
                                </div>
                                <p className="text-sm text-gray-300 italic">"{text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DOBRA 3: PEDRA NO SAPATO (FUNDO ESCURO) */}
            <section className="py-24 px-6 bg-[#050508]">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        A cada dia que passa você sente que algo está <span className="text-[#D6582C]">"fora do lugar"</span>...
                    </h2>

                    <div className="space-y-4">
                        {[
                            "Por que me sinto exausto mesmo tendo dormido 8 horas?",
                            "Tenho medo de tomar essa decisão e me arrepender.",
                            "Sinto que estou remando contra a maré no trabalho.",
                            "Por que estou tão irritado sem motivo aparente?",
                            "Parece que todo mundo tem um manual, menos eu."
                        ].map((voice, i) => (
                            <div key={i} className="bg-[#0F0F12] p-5 rounded-lg border-l-4 border-[#D6582C]">
                                <p className="text-lg italic text-gray-300">"{voice}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DOBRA 4: DIAGNÓSTICO (FUNDO CLARO) */}
            <section className="py-24 px-6 bg-[#0F0F12]">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-[#D6582C] font-bold tracking-widest text-sm mb-4 uppercase">Entenda de uma vez por todas</p>
                    <h2 className="text-3xl md:text-5xl font-bold mb-12">O problema não é você. <br />É a falta de <span className="text-white border-b-4 border-[#D6582C]">DADOS</span>.</h2>

                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        {[
                            { title: "Cegueira Temporal", desc: "Você marca reuniões importantes quando seu Intelecto está em baixa. Resultado: Erros." },
                            { title: "Desperdício de Energia", desc: "Você treina pesado quando seu Corpo pede descanso. Resultado: Burnout." },
                            { title: "Ruído Emocional", desc: "Você acha que é tristeza, mas é apenas um trânsito lunar passageiro." }
                        ].map((item, i) => (
                            <div key={i} className="bg-[#18181B] p-8 rounded-2xl border border-white/5 hover:border-[#D6582C]/30 transition">
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12">
                        <p className="text-xl font-semibold text-white">É por isso que você precisa do <span className="text-[#D6582C]">CELEST AI</span> agora.</p>
                    </div>
                </div>
            </section>

            {/* DOBRA 5: MODO DE PREPARO (FUNDO ESCURO) */}
            <section className="py-24 px-6 bg-[#050508]">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-16">3 Passos para hackear sua rotina</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: "01", title: "INPUT", desc: "Insira cidade e hora. O sistema busca coordenadas exatas." },
                            { step: "02", title: "PROCESSAMENTO", desc: "O algoritmo cruza seus dados com efemérides da NASA." },
                            { step: "03", title: "DASHBOARD", desc: "Receba seu Relatório de Comando: Foco, Energia e Humor." }
                        ].map((item, i) => (
                            <div key={i} className="relative bg-[#0F0F12] p-8 rounded-2xl border border-white/10">
                                <span className="absolute -top-6 left-8 text-6xl font-black text-[#D6582C] opacity-20">{item.step}</span>
                                <h3 className="text-2xl font-bold mb-4 mt-2">{item.title}</h3>
                                <p className="text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DOBRA 6: ENTREGÁVEIS (FUNDO CLARO) */}
            <section className="py-24 px-6 bg-[#0F0F12]">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">TUDO O QUE VOCÊ VAI RECEBER</h2>
                    <div className="space-y-4">
                        {[
                            "Dashboard 'Daily Sync' (Mente, Corpo, Alma)",
                            "Radar 'Quantum Sync' de Compatibilidade",
                            "Timeline de Previsões (Janelas de Oportunidade)",
                            "Soul-Guide AI (Chatbot 24h)",
                            "Acesso Vitalício (Sem mensalidades)"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 border-b border-white/10">
                                <div className="bg-[#22c55e]/20 p-1 rounded-full"><Check className="w-5 h-5 text-[#22c55e]" /></div>
                                <span className="text-lg text-gray-200">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DOBRA 7: PRA QUEM É (FUNDO ESCURO) */}
            <section className="py-24 px-6 bg-[#050508]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-12">O Celest AI foi feito para o seu sistema se...</h2>

                    <div className="grid md:grid-cols-2 gap-4 text-left">
                        {[
                            "Odeia textos vagos de horóscopo",
                            "Gosta de dados, gráficos e precisão",
                            "Sente ansiedade sobre o futuro",
                            "Trabalha com alta performance",
                            "Quer uma ferramenta discreta e elegante",
                            "Busca autoconhecimento sem 'gratiluz'"
                        ].map((item, i) => (
                            <div key={i} className="bg-[#0F0F12] p-4 rounded-lg flex items-center gap-3">
                                <div className="w-2 h-2 bg-[#D6582C] rounded-full"></div>
                                <span className="text-gray-300">{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 bg-[#D6582C]/10 border border-[#D6582C] p-6 rounded-xl">
                        <p className="text-[#D6582C] font-semibold">Se você marcou 2 itens acima, esta ferramenta é essencial.</p>
                    </div>
                </div>
            </section>

            {/* DOBRA 8: ANCORAGEM (FUNDO CLARO) */}
            <section className="py-20 px-6 bg-[#0F0F12]">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-8 text-gray-400">Recapitulando o valor real:</h2>

                    <div className="bg-[#18181B] rounded-xl overflow-hidden">
                        {[
                            { name: "Dashboard Daily Sync", price: "R$ 97,00" },
                            { name: "Módulo de Compatibilidade", price: "R$ 67,00" },
                            { name: "Timeline de Previsões", price: "R$ 97,00" },
                            { name: "Acesso Vitalício", price: "R$ 47,00" },
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between p-4 border-b border-white/5 text-gray-400">
                                <span>{item.name}</span>
                                <span className="line-through">{item.price}</span>
                            </div>
                        ))}
                        <div className="flex justify-between p-6 bg-[#27272A] text-xl font-bold text-white">
                            <span>TOTAL</span>
                            <span className="line-through decoration-[#D6582C]">R$ 308,00</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* DOBRA 9: PREÇO + BOTÃO (DESTAQUE) */}
            <section className="py-24 px-6 bg-gradient-to-b from-[#050508] to-[#1a0f0a]">
                <div className="max-w-xl mx-auto text-center relative">
                    {/* Efeito de brilho atrás do card */}
                    <div className="absolute inset-0 bg-[#D6582C] blur-[100px] opacity-20 rounded-full"></div>

                    <div className="relative bg-[#0F0F12] border-2 border-[#D6582C] rounded-3xl p-8 md:p-12 shadow-2xl">
                        <span className="bg-[#D6582C] text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6 inline-block">Oferta Vitalícia</span>

                        <p className="text-gray-400 mb-2">De <span className="line-through">R$ 308,00</span> por apenas:</p>

                        <div className="mb-8">
                            <p className="text-5xl md:text-6xl font-bold text-white mb-2">9x R$ 12,16</p>
                            <p className="text-gray-400">ou R$ 97,00 à vista</p>
                        </div>

                        <button
                            onClick={() => navigate('/onboarding')}
                            className="w-full bg-gradient-to-r from-[#D6582C] to-[#9B5D33] hover:brightness-110 text-white font-bold text-lg py-5 px-8 rounded-xl shadow-[0_0_30px_rgba(214,88,44,0.4)] transition-all transform hover:scale-[1.02] mb-6"
                        >
                            QUERO ACESSO VITALÍCIO AGORA
                        </button>

                        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Compra Segura</span>
                            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Garantia 7 Dias</span>
                            <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Acesso Imediato</span>
                        </div>
                    </div>

                    <div className="mt-8 text-sm text-gray-500">
                        <p>Como funciona: 1. Compra segura via Stripe • 2. Login enviado por e-mail • 3. Acesso imediato ao sistema.</p>
                    </div>
                </div>
            </section>

            {/* DOBRA 10: CONVERSA SÉRIA (FUNDO CLARO) */}
            <section className="py-20 px-6 bg-[#0F0F12]">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-6">Você tem duas opções hoje.</h2>
                    <div className="space-y-4 text-left bg-[#18181B] p-8 rounded-xl border border-white/5">
                        <p className="flex gap-3"><span className="text-gray-500 font-bold">1.</span> <span className="text-gray-400">Continuar no "modo aleatório", acordando cansado e decidindo na sorte.</span></p>
                        <p className="flex gap-3"><span className="text-[#D6582C] font-bold">2.</span> <span className="text-white">Ativar o Celest AI pelo preço de uma pizza e ter um GPS vitalício.</span></p>
                    </div>
                    <p className="mt-8 text-gray-400 italic">O tempo (Saturno) não espera. A escolha é lógica.</p>
                </div>
            </section>

            {/* DOBRA 11: AUTORIDADE (FUNDO ESCURO) */}
            <section className="py-20 px-6 bg-[#050508]">
                <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#D6582C] to-[#38271F] rounded-full flex items-center justify-center shadow-lg shrink-0">
                        <Star className="w-10 h-10 text-white" fill="currentColor" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-3">Quem criou o Celest AI?</h3>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            Não somos gurus. Somos engenheiros e analistas de dados. O Celest AI nasceu da necessidade de tirar o misticismo da astrologia e focar na utilidade prática. Nossa missão é transformar sabedoria antiga em vantagem competitiva.
                        </p>
                        <p className="text-[#D6582C] font-semibold text-sm">Sem incensos. Apenas algoritmos.</p>
                    </div>
                </div>
            </section>

            {/* DOBRA 12: FAQ + RODAPÉ */}
            <section className="py-20 px-6 bg-[#0F0F12] border-t border-white/5">
                <div className="max-w-2xl mx-auto mb-20">
                    <h2 className="text-2xl font-bold text-center mb-10">Perguntas Frequentes</h2>
                    <div className="space-y-4">
                        {[
                            { q: "Preciso saber astrologia?", a: "Não. O app traduz tudo para métricas de performance." },
                            { q: "Funciona no celular?", a: "Sim, é um Web App otimizado para qualquer dispositivo." },
                            { q: "É mensalidade?", a: "Não. Pagamento único, acesso vitalício." }
                        ].map((item, i) => (
                            <div key={i} className="bg-[#18181B] p-5 rounded-lg">
                                <h4 className="font-bold mb-2 flex items-center gap-2"><ChevronDown className="w-4 h-4 text-[#D6582C]" /> {item.q}</h4>
                                <p className="text-gray-400 text-sm pl-6">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <footer className="text-center text-xs text-gray-600 border-t border-white/5 pt-10">
                    <p className="mb-2 font-bold text-gray-500">CRIADO POR CELEST AI SYSTEMS</p>
                    <p className="mb-4">CNPJ 00.000.000/0001-00 • Blumenau, SC</p>
                    <p>suporte@celestaiapp.com</p>
                    <p className="mt-8">Todos os direitos reservados © 2026</p>
                </footer>
            </section>

        </div>
    );
};

export default LandingPage;

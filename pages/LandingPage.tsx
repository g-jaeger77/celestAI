import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CelestIcon } from '../components/CelestIcon';
import Icon from '../components/Icon';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/onboarding');
    };

    // FAQ State
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="bg-dark text-white font-inter overflow-x-hidden">
            {/* HERO SECTION */}
            <header className="relative pt-32 pb-20 px-6 text-center bg-[radial-gradient(circle_at_center,_#1a1525_0%,_#050510_100%)]">
                <div className="container mx-auto max-w-5xl">
                    <span className="block text-copper font-bold tracking-[2px] uppercase mb-5 text-xl">
                        Celest AI
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight bg-gradient-to-r from-white to-[#a0a0b0] bg-clip-text text-transparent">
                        Encontre clareza absoluta e direção para sua vida em menos de 2 minutos.
                    </h1>
                    <p className="text-[#a0a0b0] text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
                        Sem misticismo confuso. A primeira IA que transforma seus dados astrológicos em um plano de ação lógico.
                    </p>

                    {/* MOCKUP PLACEHOLDER */}
                    <div className="relative mx-auto w-full max-w-[500px] h-[300px] flex items-center justify-center bg-white/5 border border-copper/30 rounded-2xl backdrop-blur-md shadow-[0_0_30px_rgba(214,88,44,0.1)]">
                        <div className="text-center">
                            <CelestIcon size={80} className="mx-auto mb-4 animate-pulse-slow" />
                            <span className="text-copper text-sm font-semibold tracking-wider">MOCKUP VISUALIZATION</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* SOCIAL PROOF */}
            <section className="py-20 bg-dark-card/50">
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    <h2 className="text-copper font-bold text-2xl mb-8">Mais de 1.500 usuários já encontraram sua direção</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            "Impressionante como acertou meu momento de carreira.",
                            "Finalmente algo sem aquela conversa de 'ascendente' que ninguém entende.",
                            "A ferramenta de decisão me salvou essa semana.",
                            "Bonito, rápido e direto ao ponto."
                        ].map((proof, i) => (
                            <div key={i} className="bg-dark-card p-5 rounded-xl border border-[#333] text-sm italic text-[#a0a0b0]">
                                "{proof}"
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PAIN POINTS */}
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl font-bold text-center mb-10">A cada dia que passa você sente que está navegando sem bússola...</h2>
                    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                        {[
                            "Por que sinto que estou sempre andando em círculos?",
                            "Tenho medo de tomar a decisão errada de novo.",
                            "Horóscopos de jornal nunca acertam nada comigo.",
                            "Preciso de respostas claras, não de charadas místicas."
                        ].map((pain, i) => (
                            <div key={i} className="bg-dark-card p-6 border-l-4 border-copper rounded-r-lg text-[#a0a0b0] italic">
                                "{pain}"
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SOLUTION */}
            <section className="py-20 bg-dark-card/30">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <p className="text-copper font-bold tracking-widest mb-4">ENTENDA DE UMA VEZ POR TODAS</p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">O problema não é você, é a falta de dados precisos</h2>
                    <p className="text-[#a0a0b0] text-lg max-w-2xl mx-auto mb-8">
                        A astrologia comum trata milhões de pessoas como iguais. Você é único. Misticismo sem dados é apenas adivinhação. O que você precisa é de <strong className="text-white">engenharia de dados aplicada à sua vida</strong>.
                    </p>
                    <h3 className="text-copper text-2xl font-bold">É por isso que você precisa do Celest AI.</h3>
                </div>
            </section>

            {/* 4 STEPS */}
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-5xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">4 Passos para retomar o controle:</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { step: "01", title: "Input de Dados", desc: "Insira seus dados exatos de nascimento na nossa plataforma segura." },
                            { step: "02", title: "Processamento", desc: "Nossa IA cruza milhões de pontos de dados celestes em segundos." },
                            { step: "03", title: "Data Spark", desc: "Receba sua análise central (O Guia) com foco total em clareza." },
                            { step: "04", title: "Ação", desc: "Visualize as melhores datas e caminhos para suas decisões." }
                        ].map((item, i) => (
                            <div key={i} className="bg-dark-card p-6 rounded-xl border-t-2 border-copper">
                                <span className="block text-4xl text-copper font-bold mb-4">{item.step}</span>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-[#a0a0b0] text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DELIVERABLES */}
            <section className="py-20 bg-dark-card/30">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="text-3xl font-bold text-center mb-10">Tudo que você vai receber</h2>
                    <ul className="flex flex-col gap-0 max-w-xl mx-auto border border-[#222] rounded-xl overflow-hidden bg-dark-card">
                        {[
                            "Acesso Anual ao App Celest AI",
                            "O \"Nexus Zodiacal\" (Mapa Decodificado)",
                            "Bússola de Decisões (12 Meses)",
                            "Relatório de Talento Oculto",
                            "Compatibilidade Sintética"
                        ].map((item, i) => (
                            <li key={i} className="p-5 border-b border-[#222] last:border-0 flex items-center gap-4 text-lg">
                                <span className="text-green-500 font-bold text-xl">✓</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* SEGMENTATION */}
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-10">O Celest AI é para você que...</h2>
                    <div className="bg-dark-card p-8 rounded-xl text-left max-w-2xl mx-auto border border-white/5">
                        <div className="flex flex-col gap-4 mb-6">
                            <p className="flex gap-3 text-lg"><span className="text-copper">✓</span> Busca respostas lógicas, não crenças cegas.</p>
                            <p className="flex gap-3 text-lg"><span className="text-copper">✓</span> Sente que tem potencial travado.</p>
                            <p className="flex gap-3 text-lg"><span className="text-copper">✓</span> Gosta de tecnologia e ferramentas premium.</p>
                            <p className="flex gap-3 text-lg"><span className="text-copper">✓</span> Precisa tomar uma decisão importante nos próximos dias.</p>
                        </div>
                        <div className="bg-copper/10 border border-copper rounded-lg p-4 text-center text-white text-sm">
                            Se você marcou pelo menos 2, isso é para você.
                        </div>
                    </div>
                </div>
            </section>

            {/* PRICE ANCHOR */}
            <section className="py-20 bg-dark-card/30">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <h2 className="text-3xl font-bold mb-10">Recapitulando o valor:</h2>
                    <div className="bg-dark-card rounded-xl overflow-hidden max-w-xl mx-auto border border-white/5">
                        {[
                            { label: "Nexus Zodiacal", price: "R$ 97,00" },
                            { label: "Bússola de Decisões", price: "R$ 67,00" },
                            { label: "Relatório Carreira", price: "R$ 47,00" },
                            { label: "Compatibilidade", price: "R$ 47,00" }
                        ].map((row, i) => (
                            <div key={i} className="flex justify-between p-5 border-b border-[#222]">
                                <span>{row.label}</span>
                                <span className="text-copper font-bold">{row.price}</span>
                            </div>
                        ))}
                        <div className="flex justify-between p-6 bg-[#151525] text-xl font-bold">
                            <span>VALOR TOTAL</span>
                            <span>R$ 258,00</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* OFFER CTA */}
            <section id="offer" className="py-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="bg-gradient-to-b from-[#151525] to-[#0a0a0a] border-2 border-copper rounded-2xl p-10 max-w-2xl mx-auto text-center shadow-[0_0_50px_rgba(214,88,44,0.15)] relative overflow-hidden">
                        <h3 className="text-copper font-bold tracking-widest mb-4 uppercase">Oferta de Lançamento</h3>
                        <p className="text-[#a0a0b0] mb-2">Você não vai pagar R$ 258,00.</p>
                        <p className="text-white text-lg mb-6">Acesso completo (Plano Anual) hoje por apenas:</p>

                        <div className="text-5xl md:text-6xl font-extrabold text-white leading-none mb-4">
                            12x de R$ 9,74
                        </div>
                        <p className="text-[#a0a0b0] mb-8">ou R$ 97,00 à vista</p>

                        <button
                            onClick={handleStart}
                            className="w-full max-w-md mx-auto bg-gradient-to-r from-copper to-copper-light text-[#3e1405] font-extrabold text-lg py-5 px-8 rounded-lg shadow-[0_4px_20px_rgba(214,88,44,0.4)] hover:scale-105 hover:brightness-110 transition-all"
                        >
                            QUERO MINHA CLAREZA AGORA
                        </button>

                        <div className="flex flex-wrap justify-center gap-4 mt-8 text-xs text-[#666] uppercase tracking-wide">
                            <span className="flex items-center gap-1">🔒 Compra Segura</span>
                            <span className="flex items-center gap-1">🛡️ Garantia de 7 Dias</span>
                            <span className="flex items-center gap-1">⚡ Acesso Imediato</span>
                        </div>

                        <div className="mt-8 pt-6 border-t border-[#333] text-left text-sm text-[#888]">
                            <strong className="block text-white mb-2">Como funciona:</strong>
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Você finaliza a compra segura.</li>
                                <li>Recebe login e senha no seu e-mail.</li>
                                <li>Acessa o dashboard e gera seu Data Spark na hora.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOUNDER NOTE */}
            <section className="py-20 bg-dark-card/30">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <h2 className="text-2xl font-bold mb-6">Desenvolvido por GM Produtos Digitais</h2>
                    <p className="text-[#a0a0b0] leading-relaxed italic max-w-2xl mx-auto mb-8">
                        "Criamos o Celest AI porque cansamos da astrologia superficial. Unimos engenheiros de dados e estudiosos dos astros para criar a primeira ferramenta que trata seu destino com a seriedade de um cálculo matemático. Sem 'achismos', apenas padrões."
                    </p>
                    <button onClick={handleStart} className="text-copper underline hover:text-copper-light transition-colors">
                        Quero aproveitar a oferta
                    </button>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-2xl">
                    <h2 className="text-3xl font-bold text-center mb-10">Perguntas Frequentes</h2>
                    <div className="flex flex-col gap-4">
                        {[
                            { q: "Preciso saber minha hora de nascimento?", a: "Sim, para precisão matemática, a hora é ideal. Mas temos um modo aproximado se você não souber." },
                            { q: "É um horóscopo automático?", a: "Não. É uma análise de dados profundos sobre sua personalidade e ciclos, muito mais complexo que um horóscopo de jornal." },
                            { q: "Funciona no celular?", a: "Perfeitamente. O Celest AI é um Web App otimizado para qualquer tela." }
                        ].map((item, i) => (
                            <div key={i} className="bg-dark-card rounded-lg p-5 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleFaq(i)}>
                                <div className="font-bold flex justify-between items-center mb-2">
                                    <span>▼ {item.q}</span>
                                </div>
                                {openFaq === i && (
                                    <p className="text-[#a0a0b0] text-sm mt-2 animate-fade-in">
                                        {item.a}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-10 bg-black text-center text-xs text-[#666]">
                <div className="container mx-auto px-6">
                    <p className="mb-2">GM Produtos Digitais © Todos os direitos reservados.</p>
                    <p>Termos de Uso | Política de Privacidade</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

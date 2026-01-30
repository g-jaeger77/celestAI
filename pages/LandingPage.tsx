import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const LandingPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleStart = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.functions.invoke('create-checkout-session', {
                body: {
                    priceLookupKey: 'annual_plan',
                    successUrl: `${window.location.origin}/onboarding`
                }
            });

            if (error) throw error;
            if (data?.url) {
                window.location.href = data.url;
            } else {
                console.error('No checkout URL returned');
                navigate('/onboarding');
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
            navigate('/onboarding');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="overflow-x-hidden antialiased selection:bg-primary selection:text-white font-display bg-[#201613] min-h-screen text-white">
            <header className="fixed top-0 z-50 w-full bg-[#201613]/80 backdrop-blur-md border-b border-[#3a2822]">
                <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl">flare</span>
                        <span className="text-xl font-bold tracking-tight text-gradient-brand">Celest AI</span>
                    </div>
                </div>
            </header>

            <main className="relative flex flex-col w-full min-h-screen bg-[#201613] group/design-root">
                <section className="relative pt-24 pb-12 px-4 overflow-hidden">
                    <div className="absolute inset-0 bg-glow pointer-events-none"></div>
                    <div className="max-w-xl mx-auto flex flex-col items-center text-center gap-6 relative z-10">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                            Encontre <span className="text-primary">clareza absoluta</span> em meio ao caos.
                        </h1>
                        <p className="text-text-muted text-lg leading-relaxed max-w-sm">
                            A sua bússola diária alimentada por inteligência artificial para navegar a vida com propósito e eliminar a dúvida.
                        </p>

                        <div className="relative w-full max-w-[280px] aspect-[9/19] mt-8 mx-auto rounded-[2.5rem] border-8 border-[#3a2822] bg-[#1a1210] overflow-hidden shadow-2xl shadow-primary/10">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCEtmBkSoSnkbzB21hGtAmhQg78Hg2WrXpKfLdBlFDfQGueT4Sm6FWpk33WubstMk59P6uFhhn5k4WaI5VaqMA7xPFVWMzCdwpxNNfPOj6xluGfHAPDrfQlgGmXksueRFYN0RnVUkuwuLWh9TZd1iJudlC9ipbe5rmU-Pgnk1g9c0E8atuDFZRVcQApEErK2QDMKTvyEZ1piEWe2iDH5xnl8Z25YbrALOsEsvE04WYwhOi_fR2vT6-MA28kmaAFlhT_JnAffZPIPiU')" }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#201613]/50 to-[#201613]"></div>
                                <div className="absolute bottom-8 left-4 right-4">
                                    <div className="bg-[#2a1e1a]/90 backdrop-blur-sm p-4 rounded-xl border border-primary/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                                            <span className="text-xs font-bold text-white uppercase">Insight do Dia</span>
                                        </div>
                                        <p className="text-sm text-white/90 font-medium">"Sua intuição está alinhada. O momento de agir é agora, não espere a perfeição."</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-[#2a1e1a] py-8 border-y border-[#3a2822]">
                    <div className="max-w-2xl mx-auto px-4">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="flex items-center gap-1">
                                <div className="flex text-primary">
                                    <span className="material-symbols-outlined fill-current text-xl">star</span>
                                    <span className="material-symbols-outlined fill-current text-xl">star</span>
                                    <span className="material-symbols-outlined fill-current text-xl">star</span>
                                    <span className="material-symbols-outlined fill-current text-xl">star</span>
                                    <span className="material-symbols-outlined fill-current text-xl">star</span>
                                </div>
                                <span className="text-white font-bold text-lg ml-2">4.9/5</span>
                            </div>
                            <p className="text-text-muted text-sm">Junte-se a <span className="text-white font-bold">milhares de exploradores</span> que já encontraram seu caminho.</p>
                            <div className="flex -space-x-3 overflow-hidden p-1">
                                <img alt="User avatar 1" className="inline-block h-8 w-8 rounded-full ring-2 ring-[#2a1e1a] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfAX5N5VbbSdgvXYQWIcahCIx5OS7npWAPqvKK-pNCXKXWIuhbUA7W4y5EMgsavkkSv5uu9SSTaABt4EYnzCUdOfpWIDO78nueWrumMwtvw5bZ3Grzel_KcU_1PC1iLd4jYLUDhZkPtRBIr9eMgGaj9NTom6ZnzlMT0j8MtkUz42M-2GyCK72uHf5BTkWtO2vBkSZl3CX9V96hhbF9pUtGW3T39uk5NKzfl7Gzt75SUDouqCkcY2m7ufDAH_xE1x0NM65MCpS1i1g" />
                                <img alt="User avatar 2" className="inline-block h-8 w-8 rounded-full ring-2 ring-[#2a1e1a] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACr3jcCFgVe-2tscflPBajyMv4WnD5sXXnzS1VoEFEEl8wgxUEy6pgH8KhbI222-cURmwc0AIU_RYSJkqNdQHmqML2MzdQ4piRTVuPZsXkP5XoJvJW8k2H8O1ItHEK4KKKFZDYLLuGH3DMAMn_O5UFP49MgZUD3Ev_PdcLR8Y73Q5cjPDqyQcrlkepc0cv2DxwQu7QKPXw_MRkZWvVHW0Wqu6jUV36mcIq_Wwzl7Mzw7DuldsokLM-8Fe4FXcC_il_yPOdm1296r4" />
                                <img alt="User avatar 3" className="inline-block h-8 w-8 rounded-full ring-2 ring-[#2a1e1a] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPCNZyD5hhS2ErM6SceQg6i_B1yPw0YxEES10Vg4KEI8FBE2jfOHU7FbbbGBMZIDORCQMZZKacfux02foSEvIBQu11ijA3wBSjX2U19WzEQCxtejXtJD1E8XVPzixy_xQ7aGxvlIUDZkDyfaUgQ0jEaGlMqPQIh8guI_upFWhMkSiCW7X6pw3jpC6nmEBk8NYoUROHl95aBee8gDTueDWvBAH755i-tvj0547G5w55vZWq-p9Xz9S80dLPrxog5dBu_lir4pP15nk" />
                                <img alt="User avatar 4" className="inline-block h-8 w-8 rounded-full ring-2 ring-[#2a1e1a] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBbjcNgG6TMNBhHpHs52pZCvkKg6JQwmAacEApjTdzkT-A7CNQ50eWsNiCk6dgdr-8aofVbzYxzZYI04tH4NH3rcZVeL1Dryb4CVE31gW0ZE-jOd5vl_ccdUStRlZQFp_lUSDzPTTZSKMsH1TazK1TREEYyn3fhZdexFJuqTPcTOLSfsnttAfwSoZAetEexpoB4uDN0LIi_GsC6ssE8zxBkPBFwM5RJdC2N7UV0GW96cZk544bJTXf_um8ybYmEtvVKX8K9bu34M8" />
                                <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-[#2a1e1a] bg-primary text-white text-[10px] font-bold">
                                    +10k
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 px-4 bg-[#201613]">
                    <div className="max-w-2xl mx-auto flex flex-col gap-10">
                        <div className="text-center space-y-3">
                            <h2 className="text-2xl md:text-3xl font-bold text-white">Você se sente <span className="text-primary">perdido no espaço?</span></h2>
                            <p className="text-text-muted">Identifique os bloqueios gravitacionais que te impedem de evoluir.</p>
                        </div>
                        <div className="grid gap-4">
                            <div className="flex gap-4 rounded-lg bg-[#2a1e1a] p-5 border-l-4 border-primary shadow-lg">
                                <div className="mt-1">
                                    <span className="material-symbols-outlined text-primary text-3xl">psychology_alt</span>
                                </div>
                                <div>
                                    <h3 className="text-white text-lg font-bold">Ansiedade Constante</h3>
                                    <p className="text-text-muted text-sm mt-1">Sente que o futuro é uma ameaça incerta e não consegue desligar a mente.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 rounded-lg bg-[#2a1e1a] p-5 border-l-4 border-primary shadow-lg">
                                <div className="mt-1">
                                    <span className="material-symbols-outlined text-primary text-3xl">question_mark</span>
                                </div>
                                <div>
                                    <h3 className="text-white text-lg font-bold">Dúvida Paralisante</h3>
                                    <p className="text-text-muted text-sm mt-1">Nunca sabe qual caminho escolher e acaba não escolhendo nada.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 rounded-lg bg-[#2a1e1a] p-5 border-l-4 border-primary shadow-lg">
                                <div className="mt-1">
                                    <span className="material-symbols-outlined text-primary text-3xl">traffic</span>
                                </div>
                                <div>
                                    <h3 className="text-white text-lg font-bold">Estagnação Profissional</h3>
                                    <p className="text-text-muted text-sm mt-1">Sente que está andando em círculos enquanto todos avançam.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 rounded-lg bg-[#2a1e1a] p-5 border-l-4 border-primary shadow-lg">
                                <div className="mt-1">
                                    <span className="material-symbols-outlined text-primary text-3xl">noise_control_off</span>
                                </div>
                                <div>
                                    <h3 className="text-white text-lg font-bold">Ruído Mental</h3>
                                    <p className="text-text-muted text-sm mt-1">Não consegue ouvir sua própria intuição no meio do barulho externo.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 px-4 bg-[#1a1210] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Como o <span className="text-gradient-brand font-extrabold">Celest AI</span> funciona</h2>
                        <div className="relative pl-8 border-l border-[#3a2822] space-y-12">
                            <div className="relative">
                                <span className="absolute -left-[41px] flex items-center justify-center w-8 h-8 rounded-full bg-[#2a1e1a] border border-primary text-primary font-bold text-sm ring-4 ring-[#1a1210]">01</span>
                                <div className="bg-[#2a1e1a] p-6 rounded-xl border border-[#3a2822]">
                                    <h3 className="text-xl font-bold text-white mb-2">Mapeamento Profundo</h3>
                                    <p className="text-text-muted text-sm">Nossa IA analisa seu perfil astral e comportamental para criar uma base sólida de entendimento.</p>
                                </div>
                            </div>
                            <div className="relative">
                                <span className="absolute -left-[41px] flex items-center justify-center w-8 h-8 rounded-full bg-[#2a1e1a] border border-primary text-primary font-bold text-sm ring-4 ring-[#1a1210]">02</span>
                                <div className="bg-[#2a1e1a] p-6 rounded-xl border border-[#3a2822]">
                                    <h3 className="text-xl font-bold text-white mb-2">Análise de Bloqueios</h3>
                                    <p className="text-text-muted text-sm">Identificamos padrões ocultos que estão sabotando seu progresso silenciosamente.</p>
                                </div>
                            </div>
                            <div className="relative">
                                <span className="absolute -left-[41px] flex items-center justify-center w-8 h-8 rounded-full bg-[#2a1e1a] border border-primary text-primary font-bold text-sm ring-4 ring-[#1a1210]">03</span>
                                <div className="bg-[#2a1e1a] p-6 rounded-xl border border-[#3a2822]">
                                    <h3 className="text-xl font-bold text-white mb-2">Revelação de Caminhos</h3>
                                    <p className="text-text-muted text-sm">Receba insights diários precisos sobre oportunidades e momentos de cautela.</p>
                                </div>
                            </div>
                            <div className="relative">
                                <span className="absolute -left-[41px] flex items-center justify-center w-8 h-8 rounded-full bg-[#2a1e1a] border border-primary text-primary font-bold text-sm ring-4 ring-[#1a1210]">04</span>
                                <div className="bg-[#2a1e1a] p-6 rounded-xl border border-[#3a2822]">
                                    <h3 className="text-xl font-bold text-white mb-2">Ação Alinhada</h3>
                                    <p className="text-text-muted text-sm">Tome decisões com confiança absoluta, sabendo que está em sintonia com seu propósito.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 px-4 bg-[#201613]">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-center mb-8">O Celest AI é para você que...</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex items-start gap-3 p-4 bg-[#2a1e1a]/50 rounded-lg">
                                <span className="material-symbols-outlined text-primary shrink-0">check_circle</span>
                                <p className="text-sm text-gray-300">Busca autoconhecimento profundo sem misticismo vazio.</p>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-[#2a1e1a]/50 rounded-lg">
                                <span className="material-symbols-outlined text-primary shrink-0">check_circle</span>
                                <p className="text-sm text-gray-300">Quer uma ferramenta prática para tomada de decisão.</p>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-[#2a1e1a]/50 rounded-lg">
                                <span className="material-symbols-outlined text-primary shrink-0">check_circle</span>
                                <p className="text-sm text-gray-300">Sente que tem um potencial travado esperando para explodir.</p>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-[#2a1e1a]/50 rounded-lg">
                                <span className="material-symbols-outlined text-primary shrink-0">check_circle</span>
                                <p className="text-sm text-gray-300">Valoriza a união entre tecnologia de ponta e sabedoria ancestral.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12 px-4 bg-gradient-to-b from-[#201613] to-[#1a1210]">
                    <div className="max-w-2xl mx-auto bg-[#2a1e1a] rounded-2xl p-6 md:p-8 border border-[#3a2822] shadow-xl">
                        <h3 className="text-xl font-bold text-white mb-6 text-center uppercase tracking-widest text-primary">O que você recebe</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center justify-between border-b border-white/10 pb-3">
                                <div className="flex items-center gap-3">
                                    <span className="bg-primary/20 p-2 rounded-lg text-primary material-symbols-outlined">smart_toy</span>
                                    <span className="text-white font-medium">Celest AI Chat que te entende</span>
                                </div>
                                <span className="material-symbols-outlined text-green-500">check</span>
                            </li>
                            <li className="flex items-center justify-between border-b border-white/10 pb-3">
                                <div className="flex items-center gap-3">
                                    <span className="bg-primary/20 p-2 rounded-lg text-primary material-symbols-outlined">explore</span>
                                    <span className="text-white font-medium">Bússola Diária de Decisão</span>
                                </div>
                                <span className="material-symbols-outlined text-green-500">check</span>
                            </li>
                            <li className="flex items-center justify-between border-b border-white/10 pb-3">
                                <div className="flex items-center gap-3">
                                    <span className="bg-primary/20 p-2 rounded-lg text-primary material-symbols-outlined">menu_book</span>
                                    <span className="text-white font-medium">Roda da Vida Transformadora</span>
                                </div>
                                <span className="material-symbols-outlined text-green-500">check</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="bg-primary/20 p-2 rounded-lg text-primary material-symbols-outlined">join_inner</span>
                                    <span className="text-white font-medium">Sinergia de Mapas com outras pessoas</span>
                                </div>
                                <span className="material-symbols-outlined text-green-500">check</span>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="py-16 px-4 bg-[#201613] relative" id="offer">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
                    <div className="max-w-xl mx-auto text-center">
                        <div className="mb-8 bg-[#2a1e1a]/40 rounded-lg p-4 inline-block backdrop-blur-sm border border-white/5">
                            <div className="flex items-center gap-8 justify-center text-sm md:text-base">
                                <div className="flex flex-col">
                                    <span className="text-text-muted line-through decoration-primary decoration-2">R$ 258,00</span>
                                    <span className="text-xs text-text-muted/60">Preço normal</span>
                                </div>
                                <div className="h-8 w-px bg-white/10"></div>
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-lg">Oferta Hoje</span>
                                    <span className="text-xs text-primary font-bold">ECONOMIZE 55%</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#2a1e1a] rounded-2xl border border-primary p-1 shadow-[0_0_40px_rgba(214,88,46,0.15)] overflow-hidden">
                            <div className="bg-[#201613] rounded-xl p-6 md:p-10 relative overflow-hidden">
                                <h3 className="text-2xl font-bold text-white mb-2 pt-2">Plano Vitalício</h3>
                                <p className="text-text-muted mb-6">Acesso total e eterno ao Celest AI.</p>
                                <div className="flex items-end justify-center gap-1 mb-8">
                                    <span className="text-text-muted text-lg mb-1">12x de</span>
                                    <span className="text-5xl font-bold text-white tracking-tighter">9,74</span>
                                    <span className="text-text-muted text-sm mb-1">/mês</span>
                                </div>
                                <p className="text-sm text-text-muted -mt-6 mb-8">ou R$ 97,00 à vista</p>
                                <button
                                    onClick={handleStart}
                                    disabled={loading}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            QUERO MINHA CLAREZA AGORA
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                                <div className="flex items-center justify-center gap-4 text-xs text-text-muted/80">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">lock</span>
                                        Pagamento Seguro
                                    </div>
                                </div>
                                <div className="mt-4 text-xs text-text-muted/60 flex items-center justify-center gap-1.5 opacity-80 border-t border-white/5 pt-3">
                                    <span className="material-symbols-outlined text-sm text-primary">verified_user</span>
                                    <span className="italic">Sua evolução é nossa prioridade absoluta, com transparência total.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 px-4 bg-[#1a1210]">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-center mb-10">Perguntas Frequentes</h2>
                        <div className="space-y-4">
                            <details className="group bg-[#2a1e1a] rounded-lg border border-[#3a2822] overflow-hidden">
                                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                                    <span className="font-medium text-white">Como a IA sabe sobre mim?</span>
                                    <span className="material-symbols-outlined text-primary transition-transform group-open:rotate-180">expand_more</span>
                                </summary>
                                <div className="px-4 pb-4 text-text-muted text-sm">
                                    Utilizamos dados do seu mapa astral combinados com suas respostas de comportamento para criar um perfil psicológico e energético único.
                                </div>
                            </details>
                            <details className="group bg-[#2a1e1a] rounded-lg border border-[#3a2822] overflow-hidden">
                                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                                    <span className="font-medium text-white">Funciona para céticos?</span>
                                    <span className="material-symbols-outlined text-primary transition-transform group-open:rotate-180">expand_more</span>
                                </summary>
                                <div className="px-4 pb-4 text-text-muted text-sm">
                                    Sim. O Celest AI é fundamentado em arquétipos junguianos e análise de dados. A linguagem é mística, mas a base é lógica.
                                </div>
                            </details>
                            <details className="group bg-[#2a1e1a] rounded-lg border border-[#3a2822] overflow-hidden">
                                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                                    <span className="font-medium text-white">Tenho atualização?</span>
                                    <span className="material-symbols-outlined text-primary transition-transform group-open:rotate-180">expand_more</span>
                                </summary>
                                <div className="px-4 pb-4 text-text-muted text-sm">
                                    Absolutamente. Se em 7 dias você não sentir mais clareza, devolvemos 100% do seu investimento.
                                </div>
                            </details>
                            <details className="group bg-[#2a1e1a] rounded-lg border border-[#3a2822] overflow-hidden">
                                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                                    <span className="font-medium text-white">O acesso é imediato?</span>
                                    <span className="material-symbols-outlined text-primary transition-transform group-open:rotate-180">expand_more</span>
                                </summary>
                                <div className="px-4 pb-4 text-text-muted text-sm">
                                    Sim! Assim que o pagamento for confirmado, você receberá um email com seu acesso exclusivo ao portal Celest.
                                </div>
                            </details>
                        </div>
                    </div>
                </section>

                <footer className="bg-[#0f0a09] py-12 px-4 border-t border-[#3a2822]">
                    <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
                        <div className="flex items-center gap-2 text-white/80">
                            <span className="material-symbols-outlined text-primary">flare</span>
                            <span className="font-bold text-lg text-gradient-brand">Celest AI</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-text-muted">
                            <a className="hover:text-primary transition-colors" href="#">Termos de Uso</a>
                            <a className="hover:text-primary transition-colors" href="#">Privacidade</a>
                        </div>
                        <div className="text-xs text-text-muted/60 text-center">
                            <p>© 2026 GM Produtos Digitais. Todos os direitos reservados.</p>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default LandingPage;

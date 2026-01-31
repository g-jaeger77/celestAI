import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Icon from '../components/Icon';
import { CelestIcon } from '../components/CelestIcon';
import { useSpeechRecognition } from '../components/hooks/useSpeechRecognition';
import { useTextToSpeech } from '../components/hooks/useTextToSpeech';

const Chat: React.FC = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<any[]>([
        { id: 1, text: "Olá! Eu sou Celest. Vamos conversar sobre o seu mapa?", sender: 'ai' },
    ]);
    const [input, setInput] = useState('');
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Voice Hooks
    const { isListening, transcript, startListening, stopListening, hasSupport } = useSpeechRecognition();
    const { speak, stop, isSpeaking } = useTextToSpeech();

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Sync Transcript to Input
    useEffect(() => {
        if (transcript) {
            setInput(transcript);
        }
    }, [transcript]);

    // Geolocation
    const [locationState, setLocationState] = useState<{ lat: number, lon: number } | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocationState({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                    console.log("📍 Location acquired:", position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.warn("📍 Location denied/error:", error.message);
                }
            );
        }
    }, []);

    const [isLoading, setIsLoading] = useState(false);

    // --- Cosmic Sound Effect (Web Audio API) ---
    const playCosmicTone = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 1.5); // Slide up

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 1.5);
        } catch (e) {
            console.warn("Audio Context blocked or failed", e);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        stop(); // Stop current speech
        stopListening(); // Stop listening
        playCosmicTone(); // 🎵 Play magic sound immediately

        const userText = input;
        setInput('');

        // Add User Message
        const newUserMsg = { id: Date.now(), text: userText, sender: 'user' };
        setMessages((prev) => [...prev, newUserMsg]);
        setIsLoading(true);

        try {
            const userId = localStorage.getItem('celest_user_id') || 'demo';

            // Sliding Window: Send last 6 messages as context
            const recentHistory = messages.slice(-6).map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));

            const response = await fetch('http://localhost:8000/agent/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    message: userText,
                    history: recentHistory, // NEW: Context Window
                    context: {
                        location: locationState // { lat: ..., lon: ... } or null
                    }
                })
            });

            if (!response.ok) throw new Error("Cosmic silence...");

            const data = await response.json();

            // AI Response
            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, text: data.message, sender: 'ai' }
            ]);

            // Handle Actions (Navigation)
            if (data.actions && data.actions.length > 0) {
                const action = data.actions[0];
                if (action.type === 'navigate') {
                    // Small delay for user to read
                    setTimeout(() => navigate(action.payload), 3000);
                }
            }

        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, text: "Sinto uma interferência na nossa conexão. Poderia repetir?", sender: 'ai' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    const toggleListening = () => {
        if (!hasSupport) {
            alert("Navegador sem suporte a voz.");
            return;
        }
        if (isListening) stopListening();
        else startListening();
    };

    const toggleSound = () => {
        if (isSpeaking) stop();
        setSoundEnabled(!soundEnabled);
    };

    return (
        <div className="font-display flex flex-col h-screen bg-[#010409] relative overflow-hidden">
            <Helmet>
                <title>Chat | Celest AI</title>
                <meta name="description" content="Converse com seu oráculo astrológico pessoal." />
            </Helmet>

            {/* Background Image */}
            <div
                className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center opacity-60 mix-blend-screen"
                style={{ backgroundImage: "url('/assets/cosmic_bg.png')" }}
            >
                {/* Overlay Gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80"></div>
            </div>

            {/* Header */}
            <header className="relative z-20 pt-6 px-4 pb-2">
                <div className="
                    mx-auto max-w-3xl
                    flex items-center justify-between p-4 
                    bg-black/30 backdrop-blur-xl 
                    border border-white/10 rounded-2xl
                    shadow-[0_0_30px_rgba(0,0,0,0.5)]
                ">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#D6582C]/20 blur-xl rounded-full"></div>
                            <CelestIcon size={48} className="relative drop-shadow-[0_0_15px_rgba(0,255,255,0.2)]" />
                            {/* Online Dot on Avatar */}
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-black rounded-full shadow-[0_0_10px_rgba(74,222,128,0.8)]"></div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 uppercase drop-shadow-sm">
                                <span className="bg-gradient-to-r from-white via-[#FFD6BC] to-[#D6582C] bg-clip-text text-transparent">Celest AI</span>
                            </h1>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-400/80 font-bold flex items-center gap-1.5 shadow-black">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(74,222,128,0.8)]"></span>
                                Online
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-slate-400 hover:text-white"
                    >
                        <Icon name="close" className="text-lg" />
                    </button>
                </div>
            </header>

            {/* Messages Area */}
            <main className="flex-1 overflow-y-auto p-4 space-y-6 relative z-10 scrollbar-hide">
                <div className="max-w-3xl mx-auto space-y-6 pb-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                            <div className={`
                                max-w-[85%] md:max-w-[70%] p-5 relative overflow-hidden shadow-lg
                                ${msg.sender === 'user'
                                    ? 'bg-gradient-to-br from-blue-900/60 to-cyan-900/60 border border-cyan-500/30 text-white rounded-2xl rounded-br-sm shadow-[0_0_20px_rgba(0,255,255,0.05)]'
                                    : 'bg-black/40 backdrop-blur-xl border border-white/10 text-slate-200 rounded-2xl rounded-bl-sm shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                                }
                            `}>
                                {/* Glow Effect for User */}
                                {msg.sender === 'user' && (
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-400/10 blur-[40px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                )}

                                <p className="text-[15px] leading-relaxed relative z-10 tracking-wide font-light">
                                    {msg.text}
                                </p>

                                {/* Speaking Indicator */}
                                {msg.sender === 'ai' && isSpeaking && msg.id === messages[messages.length - 1].id && (
                                    <div className="absolute bottom-3 right-3 flex gap-0.5">
                                        <span className="w-0.5 h-2 bg-cyan-400 animate-music-bar-1"></span>
                                        <span className="w-0.5 h-2 bg-cyan-400 animate-music-bar-2"></span>
                                        <span className="w-0.5 h-2 bg-cyan-400 animate-music-bar-3"></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="
                                relative overflow-hidden
                                bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-md
                                text-cyan-300 p-4 rounded-2xl rounded-tl-sm 
                                border border-cyan-500/20 
                                flex gap-3 items-center 
                                shadow-[0_0_20px_rgba(34,211,238,0.1)]
                            ">
                                {/* Inner Glow Pulse */}
                                <div className="absolute inset-0 bg-cyan-400/5 animate-pulse rounded-2xl"></div>

                                {/* Icon */}
                                <div className="relative z-10 p-2 bg-cyan-500/10 rounded-full">
                                    <Icon name="auto_awesome" className="text-xl text-cyan-400 animate-spin-slow" />
                                </div>

                                {/* Text */}
                                <div className="flex flex-col relative z-10">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-500/70 font-bold mb-0.5">Celest AI</span>
                                    <span className="text-sm font-medium text-cyan-100 flex items-center gap-0.5">
                                        Sintonizando Frequência
                                        <span className="animate-bounce font-bold text-cyan-400">.</span>
                                        <span className="animate-bounce delay-100 font-bold text-cyan-400">.</span>
                                        <span className="animate-bounce delay-200 font-bold text-cyan-400">.</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
        </div>
    )
}
<div ref={messagesEndRef} />
                </div >
            </main >

    {/* Input Area */ }
    < footer className = "relative z-20 p-4 pb-8" >
        <div className="max-w-3xl mx-auto">
            <div className={`
                        relative flex items-center gap-3 p-2 pr-3 pl-4 
                        bg-black/60 backdrop-blur-2xl 
                        border transition-all duration-300 rounded-full
                        ${isListening
                    ? 'border-orange-500/50 shadow-[0_0_40px_rgba(255,140,0,0.3)]'
                    : 'border-cyan-500/30 shadow-[0_0_30px_rgba(0,255,255,0.15)] focus-within:shadow-[0_0_50px_rgba(0,255,255,0.25)] focus-within:border-cyan-400/50'}
                    `}>

                {/* Input Field */}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isListening ? "Ouvindo frequências..." : "Envie uma mensagem ao cosmos..."}
                    className="flex-1 min-w-0 bg-transparent border-0 text-white text-[15px] placeholder:text-slate-500 focus:ring-0 outline-none font-light tracking-wide py-3"
                />

                {/* Divider */}
                <div className="h-6 w-px bg-white/10"></div>

                {/* Voice Button */}
                <button
                    onClick={toggleListening}
                    className={`
                                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                                ${isListening
                            ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(255,140,0,0.8)]'
                            : 'text-slate-400 hover:text-cyan-400 hover:bg-white/5'}
                            `}
                >
                    <Icon name={isListening ? "mic" : "mic_none"} className="text-xl" />
                </button>

                {/* Send Button */}
                <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className={`
                                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                                ${input.trim()
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:scale-105 active:scale-95'
                            : 'bg-white/5 text-slate-600 cursor-not-allowed'}
                            `}
                >
                    <Icon name="send" className="text-lg translate-x-0.5 translate-y-0.5" />
                </button>
            </div>

            {/* Footer Text */}
            <div className="text-center mt-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-900/40">
                    Conexão Segura • Criptografia Estelar
                </p>
            </div>
        </div>
            </footer >
        </div >
    );
};

export default Chat;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Icon from '../components/Icon';
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

    // TTS for AI messages
    // TTS removed as requested
    // useEffect(() => { ... }, [messages, soundEnabled, speak]);

    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        stop(); // Stop current speech
        stopListening(); // Stop listening

        const userText = input;
        setInput('');

        // Add User Message
        const newUserMsg = { id: Date.now(), text: userText, sender: 'user' };
        setMessages((prev) => [...prev, newUserMsg]);
        setIsLoading(true);

        try {
            const userId = localStorage.getItem('celest_user_id') || 'demo';

            const response = await fetch('http://localhost:8000/agent/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    message: userText
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
            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-900/10 blur-[100px] rounded-full"></div>
            </div>

            {/* Header */}
            <header className="relative z-20 flex items-center justify-between p-6 bg-transparent">
                <div className="flex items-center gap-3">
                    <img src="/assets/Icone.png?v=2" alt="Celest" className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(255,165,0,0.5)] mix-blend-screen" style={{ mixBlendMode: 'screen' }} />
                    <div>
                        <h1 className="text-lg font-bold tracking-[0.2em] text-white uppercase">Celest AI</h1>
                        <span className="text-[10px] text-green-400 tracking-wider flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> ONLINE
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">


                    <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <Icon name="close" className="text-slate-400" />
                    </button>
                </div>
            </header>

            {/* Messages Area */}
            <main className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scrollbar-hide">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`
              max-w-[80%] p-4 rounded-2xl relative overflow-hidden backdrop-blur-md border border-white/5 shadow-lg
              ${msg.sender === 'user'
                                ? 'bg-blue-600/20 text-white rounded-br-sm'
                                : 'bg-white/10 text-slate-200 rounded-bl-sm'}
            `}>
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            {/* Speaking Indicator */}
                            {msg.sender === 'ai' && isSpeaking && msg.id === messages[messages.length - 1].id && (
                                <div className="absolute bottom-2 right-2 flex gap-0.5">
                                    <span className="w-1 h-3 bg-cyan-400 animate-pulse"></span>
                                    <span className="w-1 h-3 bg-cyan-400 animate-pulse delay-75"></span>
                                    <span className="w-1 h-3 bg-cyan-400 animate-pulse delay-150"></span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white/5 text-cyan-400 p-4 rounded-2xl rounded-bl-sm border border-white/5 flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-75"></span>
                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            {/* Command Center (Input) */}
            <footer className="relative z-20 p-6 pb-8">
                <div className={`
          relative flex items-center gap-2 p-2 pr-2 bg-[#0A0A0A]/80 backdrop-blur-xl 
          border border-white/10 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)]
          transition-all duration-300
          ${isListening ? 'border-orange-500/50 shadow-[0_0_30px_rgba(255,140,0,0.2)]' : 'focus-within:border-blue-500/50'}
        `}>

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isListening ? "Ouvindo cosmo..." : "Digite sua mensagem..."}
                        className="flex-1 min-w-0 bg-transparent border-0 text-white text-sm px-4 py-4 placeholder:text-slate-600 focus:ring-0 outline-none font-medium tracking-wide"
                    />

                    {/* Voice Button */}
                    <button
                        onClick={toggleListening}
                        className={`
              p-3 rounded-full transition-all duration-300 active:scale-95 shrink-0
              ${isListening
                                ? 'bg-orange-500 text-white animate-pulse-slow shadow-[0_0_20px_rgba(255,140,0,0.6)]'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}
            `}
                    >
                        <Icon name={isListening ? "mic" : "mic_none"} className="text-xl" />
                    </button>

                    {/* Send Button */}
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="p-3 rounded-full bg-blue-600/80 text-white hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shrink-0"
                    >
                        <Icon name="send" className="text-xl" />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default Chat;
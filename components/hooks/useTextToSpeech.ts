
import { useState, useCallback, useEffect, useRef } from 'react';

export const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Browser Fallback Voice State
    const [fallbackVoice, setFallbackVoice] = useState<SpeechSynthesisVoice | null>(null);

    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            const ptVoice = voices.find(v => v.name.includes("Google Português do Brasil"))
                || voices.find(v => v.name.includes("Microsoft Maria") && v.lang.includes("pt-BR"))
                || voices.find(v => v.lang.includes('pt-BR'))
                || voices[0];
            setFallbackVoice(ptVoice);
        };
        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const speak = useCallback(async (text: string) => {
        if (!text) return;
        setIsSpeaking(true);

        try {
            // Try Server-Side Natural Voice (OpenAI Nova)
            const response = await fetch('http://localhost:8000/agent/speak', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, voice: 'nova' })
            });

            if (!response.ok) throw new Error("Server TTS failed");

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }

            const audio = new Audio(url);
            audioRef.current = audio;
            audio.onended = () => setIsSpeaking(false);

            // Clean up URL after playing
            audio.oncanplaythrough = () => {
                audio.play().catch(e => {
                    console.error("Audio Play Error", e);
                    setIsSpeaking(false);
                });
            };

        } catch (error) {
            console.warn("Falling back to Browser TTS", error);
            // Fallback: Browser Voice (Robotic but works offline)
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            if (fallbackVoice) utterance.voice = fallbackVoice;
            utterance.lang = 'pt-BR';
            utterance.rate = 1.1;
            utterance.pitch = 1.2;
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    }, [fallbackVoice]);

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, []);

    return { speak, stop, isSpeaking };
};

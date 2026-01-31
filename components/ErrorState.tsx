import React from 'react';
import Icon from './Icon';

interface ErrorStateProps {
    onRetry?: () => void;
    title?: string;
    message?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
    onRetry,
    title = "Conexão Interrompida",
    message = "Não foi possível sincronizar com os dados estelares. Verifique sua conexão."
}) => {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] p-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                <Icon name="cloud_off" className="text-red-400 text-3xl" />
            </div>

            <h3 className="text-white text-lg font-bold mb-2 tracking-tight">
                {title}
            </h3>

            <p className="text-white/50 text-sm leading-relaxed max-w-[260px] mb-6">
                {message}
            </p>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-sm font-medium text-white border border-white/5 flex items-center gap-2 group"
                >
                    <Icon name="refresh" className="text-white/70 group-hover:rotate-180 transition-transform duration-500" />
                    Tentar Novamente
                </button>
            )}
        </div>
    );
};

export default ErrorState;

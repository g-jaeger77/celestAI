import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class AppErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-[#010409] text-white p-6 text-center">
                    <h1 className="text-2xl font-bold text-red-400 mb-4">Algo deu errado</h1>
                    <p className="text-slate-400 max-w-md mb-6">
                        Encontramos um erro crítico ao carregar a aplicação.
                    </p>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-white/10 text-left overflow-auto max-w-full mb-6">
                        <code className="text-xs text-red-300 font-mono">
                            {this.state.error?.message}
                        </code>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-slate-200 transition-colors"
                    >
                        Recarregar Página
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default AppErrorBoundary;

import React from 'react';

const Footer: React.FC = () => {
    return (
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
    );
};

export default Footer;

import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 z-50 w-full bg-[#201613]/80 backdrop-blur-md border-b border-[#3a2822]">
      <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
          <span className="material-symbols-outlined text-primary text-3xl">flare</span>
          <span className="text-xl font-bold tracking-tight text-gradient-brand">Celest AI</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
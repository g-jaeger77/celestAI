import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/BottomNav';
import CosmicBackground from '../components/shared/CosmicBackground';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const location = useLocation();

    // Pages that don't need padding/layout wrapping (Full screen like onboarding)
    const fullScreenRoutes = ['/', '/loading', '/success'];
    const isFullScreen = fullScreenRoutes.includes(location.pathname);

    if (isFullScreen) {
        return <>{children}</>;
    }

    return (
        <div className="relative min-h-screen w-full bg-black text-white overflow-x-hidden">
            <CosmicBackground />

            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="relative z-10 w-full md:pl-64 transition-all duration-300">
                <Navbar />

                <div className="w-full max-w-7xl mx-auto pb-24 md:pb-8 px-0 md:px-6">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav - Apple Health Style */}
            <nav className="fixed bottom-0 left-0 w-full h-[84px] z-50 md:hidden bg-[#1C1C1E]/95 backdrop-blur-xl border-t border-white/10 pb-safe pt-2 transition-transform duration-300">
                <BottomNav />
            </nav>
        </div>
    );
};

export default MainLayout;

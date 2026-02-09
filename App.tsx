// v1.2.4 (Force Reload)
import React from 'react';
import AppErrorBoundary from './components/AppErrorBoundary';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Onboarding from './pages/Onboarding';
import Loading from './pages/Loading';
import Success from './pages/Success';
import Dashboard from './pages/Dashboard';
import { PhysicalDetail } from './pages/PhysicalDetail';
import { EmotionalDetail } from './pages/EmotionalDetail';
import { ActionDetail } from './pages/ActionDetail';
import Trends from './pages/Trends';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Shop from './pages/Shop'; // Keep for legacy if needed, or remove
import Upgrades from './pages/Upgrades';
import CompatibilityInput from './pages/CompatibilityInput';
import CompatibilityResult from './pages/CompatibilityResult';
import Synastry from './pages/Synastry';
import { MindDetail } from './pages/MindDetail';
import SynergyReport from './pages/SynergyReport';
import LandingPage from './pages/LandingPage';
import Waitlist from './pages/Waitlist';
import History from './pages/History';

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppErrorBoundary>
        <MainLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/success" element={<Success />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/physical" element={<PhysicalDetail />} />
            <Route path="/emotional" element={<EmotionalDetail />} />
            <Route path="/action" element={<ActionDetail />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/report" element={<SynergyReport />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />
            {/* Replaced Shop with System Upgrades -> Waitlist */}
            <Route path="/shop" element={<Waitlist />} />
            <Route path="/upgrades" element={<Waitlist />} />
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="/interest" element={<Waitlist />} />

            <Route path="/compatibility" element={<CompatibilityInput />} />
            <Route path="/compatibility-result" element={<CompatibilityResult />} />
            <Route path="/synastry" element={<Synastry />} />
            <Route path="/mind" element={<MindDetail />} />

            {/* Real Routes */}
            <Route path="/upgrades" element={<Upgrades />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </MainLayout>
      </AppErrorBoundary>
    </HashRouter>
  );
};

export default App;
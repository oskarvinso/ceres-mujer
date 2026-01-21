
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  Heart, 
  Activity, 
  ShoppingBag, 
  BookOpen, 
  PlayCircle, 
  LayoutDashboard, 
  Menu,
  X,
  Fingerprint,
  Sparkles
} from 'lucide-react';

import Dashboard from './pages/Dashboard.tsx';
import HealthTracker from './pages/HealthTracker.tsx';
import MedicalAnalysis from './pages/MedicalAnalysis.tsx';
import VirtualCard from './pages/VirtualCard.tsx';
import Shop from './pages/Shop.tsx';
import Wellness from './pages/Wellness.tsx';
import Education from './pages/Education.tsx';
import Auth from './pages/Auth.tsx';
import ProfileSetup from './pages/ProfileSetup.tsx';
import { apiService } from './services/apiService.ts';

export const Logo = ({ className = "h-16" }: { className?: string }) => (
  <div className={`flex items-center gap-4 ${className}`}>
    <div className="h-full aspect-square relative shrink-0">
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8E24AA" />
            <stop offset="100%" stopColor="#4A148C" />
          </linearGradient>
          <linearGradient id="magentaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D81B60" />
            <stop offset="100%" stopColor="#880E4F" />
          </linearGradient>
        </defs>
        <path d="M75 15 C 95 30 95 70 75 85 C 55 100 20 90 10 70" stroke="url(#purpleGradient)" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        <path d="M80 25 C 95 40 95 65 80 80" stroke="url(#magentaGradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <circle cx="28" cy="35" r="12" fill="url(#purpleGradient)" />
        <path d="M10 65 C 10 50 25 45 40 45 C 55 45 65 55 65 75 C 65 95 45 105 25 95 C 10 85 10 75 10 65" fill="url(#purpleGradient)" />
        <circle cx="48" cy="48" r="8" fill="url(#magentaGradient)" />
        <path d="M38 78 C 38 68 45 62 55 62 C 65 62 72 68 72 82 C 72 92 62 98 52 94 C 42 90 38 85 38 78" fill="url(#magentaGradient)" />
      </svg>
    </div>
    <div className="flex flex-col justify-center">
      <h1 className="font-serif text-3xl font-bold text-[#4A148C] leading-none tracking-tight">Ceres</h1>
      <div className="flex flex-col mt-0.5">
        <span className="text-[9px] italic font-medium text-[#D81B60] leading-tight font-sans">Mujer, salud y vida</span>
        <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-[#4A148C] leading-tight mt-0.5">Ginecología y Obstetricia</span>
      </div>
    </div>
  </div>
);

const Navbar = ({ onLogout }: { onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Inicio' },
    { path: '/salud', icon: Activity, label: 'Mi Salud' },
    { path: '/analisis', icon: Sparkles, label: 'IA Médica' }, 
    { path: '/carnet', icon: Fingerprint, label: 'Carnet' },
    { path: '/bienestar', icon: PlayCircle, label: 'Estudio' },
    { path: '/tienda', icon: ShoppingBag, label: 'Boutique' },
    { path: '/educacion', icon: BookOpen, label: 'Academia' },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-ceres-mint sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex items-center">
            <Link to="/"><Logo className="h-16" /></Link>
          </div>
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                  location.pathname === item.path
                    ? 'bg-ceres-primary text-white shadow-lg shadow-ceres-primary/20'
                    : 'text-slate-500 hover:text-ceres-primary hover:bg-ceres-mint'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
            <button onClick={onLogout} className="ml-4 p-2.5 text-slate-300 hover:text-rose-500 transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-ceres-dark p-2"><Menu className="w-7 h-7" /></button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('ceres_auth') === 'true');
  const [hasProfile, setHasProfile] = useState<boolean>(() => !!localStorage.getItem('ceres_profile'));

  const handleLogout = () => {
    setIsAuthenticated(false);
    setHasProfile(false);
    localStorage.clear();
    window.location.hash = '#/';
  };

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  if (!hasProfile) {
    return <ProfileSetup onComplete={() => setHasProfile(true)} />;
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-ceres-light selection:bg-ceres-secondary selection:text-ceres-dark">
        <Navbar onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/salud" element={<HealthTracker />} />
            <Route path="/analisis" element={<MedicalAnalysis />} />
            <Route path="/carnet" element={<VirtualCard />} />
            <Route path="/tienda" element={<Shop />} />
            <Route path="/bienestar" element={<Wellness />} />
            <Route path="/educacion" element={<Education />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-ceres-mint py-20 px-4">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-10">
            <Logo className="h-28" />
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Ceres - Ser Mujer | Ginecología y Obstetricia</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;

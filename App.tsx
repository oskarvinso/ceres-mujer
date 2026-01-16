
import React, { useState } from 'react';
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
  Fingerprint
} from 'lucide-react';

import Dashboard from './pages/Dashboard.tsx';
import HealthTracker from './pages/HealthTracker.tsx';
import Shop from './pages/Shop.tsx';
import Wellness from './pages/Wellness.tsx';
import Education from './pages/Education.tsx';
import Auth from './pages/Auth.tsx';
import ProfileSetup from './pages/ProfileSetup.tsx';
import VirtualCard from './pages/VirtualCard.tsx';

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
      <img 
        src="https://raw.githubusercontent.com/StackBlitz/stackblitz-images/main/ceres-logo-placeholder.png" 
        alt="Ceres Logo" 
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback if image not found: use a styled mother-child icon
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = `<div class="w-10 h-10 bg-gradient-to-br from-ceres-primary to-ceres-secondary rounded-full flex items-center justify-center shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></div>`;
        }}
      />
    </div>
    <div className="flex flex-col">
      <span className="font-serif text-xl font-bold text-ceres-dark leading-none tracking-tight">CERES</span>
      <span className="text-[9px] uppercase tracking-[0.3em] text-ceres-secondary font-bold">Ser Mujer</span>
    </div>
  </div>
);

const Navbar = ({ onLogout }: { onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Inicio' },
    { path: '/salud', icon: Activity, label: 'Mi Salud' },
    { path: '/carnet', icon: Fingerprint, label: 'Carnet' },
    { path: '/bienestar', icon: PlayCircle, label: 'Estudio' },
    { path: '/tienda', icon: ShoppingBag, label: 'Boutique' },
    { path: '/educacion', icon: BookOpen, label: 'Academia' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-ceres-mint sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  location.pathname === item.path
                    ? 'bg-ceres-primary text-white shadow-lg shadow-ceres-primary/20'
                    : 'text-slate-500 hover:text-ceres-primary hover:bg-ceres-mint'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
            <button 
              onClick={onLogout}
              className="ml-4 p-2.5 text-slate-300 hover:text-rose-500 transition-colors"
              title="Cerrar sesión"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-ceres-dark p-2">
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-t border-ceres-mint py-6 shadow-2xl animate-in slide-in-from-top-4">
          <div className="flex flex-col gap-1 px-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold tracking-wide transition-all ${
                  location.pathname === item.path
                    ? 'bg-ceres-primary text-white'
                    : 'text-slate-600 hover:bg-ceres-mint'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
            <button 
              onClick={onLogout}
              className="flex items-center gap-4 px-6 py-4 mt-2 text-rose-500 font-bold"
            >
              <X className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('ceres_auth') === 'true');
  const [hasProfile, setHasProfile] = useState<boolean>(() => !!localStorage.getItem('ceres_profile'));

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('ceres_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setHasProfile(false);
    localStorage.removeItem('ceres_auth');
    localStorage.removeItem('ceres_profile');
    localStorage.removeItem('ceres_risk');
  };

  const handleProfileComplete = () => {
    setHasProfile(true);
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  if (!hasProfile) {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-ceres-light selection:bg-ceres-secondary selection:text-ceres-dark">
        <Navbar onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/salud" element={<HealthTracker />} />
            <Route path="/carnet" element={<VirtualCard />} />
            <Route path="/tienda" element={<Shop />} />
            <Route path="/bienestar" element={<Wellness />} />
            <Route path="/educacion" element={<Education />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-ceres-mint py-16 px-4">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-8">
            <Logo />
            <p className="text-slate-400 text-sm max-w-lg leading-relaxed font-medium">
              Especialistas en ecografía a domicilio y salud integral para la mujer. <br/>
              Acompañándote en el viaje más importante de tu vida.
            </p>
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-ceres-primary">
              <a href="#" className="hover:text-ceres-dark transition-colors">Servicios</a>
              <a href="#" className="hover:text-ceres-dark transition-colors">Nosotros</a>
              <a href="#" className="hover:text-ceres-dark transition-colors">Soporte</a>
            </div>
            <div className="pt-8 border-t border-ceres-mint w-full flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] text-slate-300 font-bold tracking-widest uppercase">
              <span>© 2024 Ceres Ecografía en Casa - Ser Mujer</span>
              <div className="flex gap-6">
                <span>Protección de Datos</span>
                <span>Terminos & Condiciones</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;


import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  Heart, 
  Activity, 
  ShoppingBag, 
  BookOpen, 
  PlayCircle, 
  LayoutDashboard, 
  ClipboardList,
  Menu,
  X,
  UserCircle
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import HealthTracker from './pages/HealthTracker';
import MedicalAnalysis from './pages/MedicalAnalysis';
import Shop from './pages/Shop';
import Wellness from './pages/Wellness';
import Education from './pages/Education';
import Auth from './pages/Auth';
import ProfileSetup from './pages/ProfileSetup';

const Navbar = ({ onLogout }: { onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Inicio' },
    { path: '/salud', icon: Activity, label: 'Salud' },
    { path: '/examenes', icon: ClipboardList, label: 'Exámenes' },
    { path: '/bienestar', icon: PlayCircle, label: 'Clases' },
    { path: '/tienda', icon: ShoppingBag, label: 'Tienda' },
    { path: '/educacion', icon: BookOpen, label: 'Crianza' },
  ];

  return (
    <nav className="bg-white border-b border-pink-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                <Heart className="text-white w-5 h-5 fill-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-lg font-bold text-purple-800">Ser Mujer</span>
                <span className="text-[10px] uppercase tracking-widest text-fuchsia-500 font-bold">Salud y Vida</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === item.path
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                    : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <item.icon className={`w-4 h-4 ${location.pathname === item.path ? 'text-white' : ''}`} />
                {item.label}
              </Link>
            ))}
            <button 
              onClick={onLogout}
              className="ml-4 p-2 text-slate-400 hover:text-rose-500 transition-colors"
              title="Salir"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-purple-600 p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-pink-50 py-2 shadow-xl">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-6 py-4 text-slate-600 hover:bg-purple-50 hover:text-purple-600 border-l-4 border-transparent hover:border-purple-600 transition-all"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-semibold">{item.label}</span>
            </Link>
          ))}
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-6 py-4 text-rose-500 hover:bg-rose-50 border-l-4 border-transparent"
          >
            <X className="w-5 h-5" />
            <span className="font-semibold">Cerrar Sesión</span>
          </button>
        </div>
      )}
    </nav>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('ser_mujer_auth') === 'true');
  const [hasProfile, setHasProfile] = useState<boolean>(() => !!localStorage.getItem('ser_mujer_profile'));

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('ser_mujer_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setHasProfile(false);
    localStorage.removeItem('ser_mujer_auth');
    localStorage.removeItem('ser_mujer_profile');
    localStorage.removeItem('ser_mujer_risk');
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
      <div className="min-h-screen flex flex-col bg-pink-50/30">
        <Navbar onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/salud" element={<HealthTracker />} />
            <Route path="/examenes" element={<MedicalAnalysis />} />
            <Route path="/tienda" element={<Shop />} />
            <Route path="/bienestar" element={<Wellness />} />
            <Route path="/educacion" element={<Education />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="bg-purple-900 text-purple-200 py-12 px-4 text-center">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Heart className="text-purple-900 w-5 h-5 fill-purple-900" />
              </div>
              <span className="font-serif text-xl font-bold text-white">Ser Mujer</span>
            </div>
            <p className="text-sm opacity-80">Salud y Vida para la madre gestante.</p>
            <div className="pt-8 border-t border-purple-800 text-xs opacity-60">
              © 2024 Ser Mujer. Inspirado en Ceres Ecografía en Casa.
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;


import React, { useState } from 'react';
import { Heart, Lock, ArrowRight } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulating a code check - in a real app, this would verify against a database
    if (code.length >= 4) {
      onLogin();
    } else {
      setError('Por favor ingresa un código válido entregado por tu médico.');
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-purple-100 overflow-hidden">
        <div className="bg-purple-600 p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/30">
              <Heart className="w-10 h-10 fill-white" />
            </div>
            <h1 className="text-3xl font-serif font-bold">Ser Mujer</h1>
            <p className="text-purple-100 text-sm tracking-widest uppercase font-bold">Salud y Vida</p>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-400 rounded-full -ml-12 -mb-12 opacity-30 blur-xl"></div>
        </div>
        
        <div className="p-10 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-slate-800">Acceso a Pacientes</h2>
            <p className="text-slate-500 text-sm">Ingresa el código de acceso proporcionado en tu consulta.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Código de Ingreso</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="text" 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ej: SER-2024"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all text-center text-lg font-mono tracking-widest"
                />
              </div>
              {error && <p className="text-rose-500 text-xs mt-1 ml-1">{error}</p>}
            </div>

            <button 
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-200 group"
            >
              Ingresar
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-400">
            ¿No tienes un código? Contacta a tu centro médico <br/> 
            <span className="text-purple-500 font-semibold cursor-pointer hover:underline">Solicitar información</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

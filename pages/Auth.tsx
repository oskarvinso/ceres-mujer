
import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length >= 4) {
      onLogin();
    } else {
      setError('Código de paciente no válido. Por favor verifica tus documentos Ceres.');
    }
  };

  return (
    <div className="min-h-screen bg-ceres-light flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Branding */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none flex items-center justify-center">
         <ShieldCheck className="w-[600px] h-[600px] text-ceres-primary" />
      </div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-[50px] shadow-2xl shadow-ceres-primary/10 overflow-hidden border border-white">
          <div className="p-12 text-center space-y-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-ceres-primary rounded-[30px] flex items-center justify-center shadow-2xl shadow-ceres-primary/30">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-1">
                <h1 className="font-serif text-3xl font-bold text-ceres-dark tracking-tight">CERES</h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-ceres-primary">Salud & Bienestar</p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-serif font-bold text-slate-800">Acceso Pacientes</h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Ingresa tu código de identificación Ceres para acceder a tu historial y seguimiento prenatal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-3">Código de Identificación</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-ceres-primary transition-colors" />
                  <input 
                    type="text" 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="CERES-XXXX"
                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-ceres-mint focus:bg-white outline-none transition-all text-xl font-mono tracking-widest text-center"
                  />
                </div>
                {error && <p className="text-rose-500 text-xs mt-3 ml-3 font-bold">{error}</p>}
              </div>

              <button 
                type="submit"
                className="w-full bg-ceres-dark hover:bg-slate-900 text-white py-6 rounded-3xl font-bold tracking-[0.2em] text-xs flex items-center justify-center gap-4 transition-all shadow-xl shadow-ceres-dark/20 group"
              >
                AUTENTICAR
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="pt-6 border-t border-slate-50">
              <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">
                Seguridad Encriptada Grado Médico
              </p>
            </div>
          </div>
        </div>
        
        <p className="mt-10 text-center text-xs text-slate-400 font-medium">
          ¿Olvidaste tu código? <span className="text-ceres-primary font-bold cursor-pointer hover:underline">Soporte al Paciente</span>
        </p>
      </div>
    </div>
  );
};

export default Auth;

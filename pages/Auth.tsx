
import React, { useState } from 'react';
import { Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Logo } from '../App.tsx';
import { apiService } from '../services/apiService.ts';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await apiService.login(code);
      localStorage.setItem('ceres_token', response.token);
      localStorage.setItem('ceres_auth', 'true');
      
      // Si el backend dice que ya tiene perfil, lo marcamos
      if (response.has_profile) {
        localStorage.setItem('ceres_profile', 'true');
      }
      
      onLogin();
    } catch (err: any) {
      console.error(err);
      setError('Error de conexión o código inválido. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ceres-light flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-ceres-primary/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-ceres-secondary/5 rounded-full -ml-48 -mb-48 blur-3xl"></div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-[50px] shadow-2xl shadow-ceres-primary/10 overflow-hidden border border-white">
          <div className="p-10 text-center space-y-10">
            <div className="flex flex-col items-center">
              <Logo className="h-24 mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-ceres-primary">Portal de Pacientes Ceres</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-serif font-bold text-slate-800">Acceso Seguro</h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Ingresa tu código de paciente para sincronizar tu historial médico.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-3">Código de Identificación</label>
                <div className="relative group">
                  <Lock className={`absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${loading ? 'text-slate-200' : 'text-slate-300 group-focus-within:text-ceres-primary'}`} />
                  <input 
                    type="text" 
                    value={code}
                    disabled={loading}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="CERES-XXXX"
                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-ceres-mint focus:bg-white outline-none transition-all text-xl font-mono tracking-widest text-center disabled:opacity-50"
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-rose-500 text-xs mt-3 ml-3 font-bold animate-in fade-in">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </div>

              <button 
                type="submit"
                disabled={loading || !code}
                className="w-full bg-ceres-primary hover:bg-ceres-dark disabled:bg-slate-200 text-white py-6 rounded-3xl font-bold tracking-[0.2em] text-xs flex items-center justify-center gap-4 transition-all shadow-xl shadow-ceres-primary/20 group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    INICIAR SESIÓN
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

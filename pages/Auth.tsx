
import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { apiService } from '../services/apiService.ts';

interface AuthProps {
  onLogin: (hasProfile: boolean) => void;
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
      onLogin(response.has_profile);
    } catch (err: any) {
      setError(err.message || 'Código de paciente no válido. Verifique sus documentos Ceres.');
    } finally {
      setLoading(false);
    }
  };

  const logoUrl = "https://static.wixstatic.com/media/522a2a_fe586d95a93a409fb8d056e47fab66a3~mv2.png/v1/crop/x_71,y_57,w_221,h_177/fill/w_190,h_158,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/522a2a_fe586d95a93a409fb8d056e47fab66a3~mv2.png";

  return (
    <div className="min-h-screen bg-ceres-light flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none flex items-center justify-center">
         <img src={logoUrl} className="w-[800px] h-[800px] object-contain grayscale" alt="" />
      </div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-[50px] shadow-2xl shadow-ceres-primary/10 overflow-hidden border border-white">
          <div className="p-10 md:p-14 text-center space-y-10">
            <div className="flex flex-col items-center gap-6">
              <div className="w-28 h-28 bg-white rounded-[35px] flex items-center justify-center shadow-xl border border-ceres-mint p-4">
                <img src={logoUrl} alt="Ceres" className="w-full h-full object-contain transform scale-110" />
              </div>
              <div className="space-y-1">
                <h1 className="font-serif text-3xl font-bold text-ceres-dark tracking-tight">CERES</h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-ceres-secondary">Ser Mujer</p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-serif font-bold text-slate-800">Acceso Pacientes</h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Ingresa tu código de identificación Ceres para acceder a tu historial.
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
                    disabled={loading}
                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-ceres-mint focus:bg-white outline-none transition-all text-xl font-mono tracking-widest text-center"
                  />
                </div>
                {error && <div className="flex items-center gap-2 text-rose-500 text-xs mt-3 ml-3 font-bold animate-pulse"><ShieldCheck className="w-3 h-3" />{error}</div>}
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-ceres-primary hover:bg-ceres-dark disabled:bg-slate-300 text-white py-6 rounded-3xl font-bold tracking-[0.2em] text-xs flex items-center justify-center gap-4 transition-all shadow-xl shadow-ceres-primary/20 group"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>AUTENTICAR <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

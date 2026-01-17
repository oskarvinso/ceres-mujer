
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ChevronRight, 
  Calendar, 
  Thermometer, 
  Scale, 
  Activity,
  ShieldCheck,
  Stethoscope,
  MapPin,
  User,
  Target,
  Fingerprint,
  Info,
  Dumbbell
} from 'lucide-react';
import { UserProfile } from '../types';

// Fix: Removed duplicated declaration and corrected component syntax
const StatCard = ({ icon: Icon, label, value, unit, colorClass }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-ceres-mint shadow-sm flex items-center gap-4 hover:shadow-md transition-all group">
    <div className={`p-3 rounded-2xl ${colorClass}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-800 tracking-tight">{value}</span>
        <span className="text-slate-400 text-[10px] font-bold">{unit}</span>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [gestationalWeeks, setGestationalWeeks] = useState<number>(0);
  const [riskLevel, setRiskLevel] = useState<string>('Bajo');

  useEffect(() => {
    const savedProfile = localStorage.getItem('ceres_profile');
    const savedRisk = localStorage.getItem('ceres_risk');
    if (savedProfile) {
      const data = JSON.parse(savedProfile) as UserProfile;
      setProfile(data);
      setRiskLevel(savedRisk || 'Bajo');
      setGestationalWeeks(data.gestationWeeks || 0);
    }
  }, []);

  const getBabySizeInfo = (weeks: number) => {
    if (weeks < 8) return "una lenteja";
    if (weeks < 14) return "un limón";
    if (weeks < 22) return "una papaya";
    if (weeks < 30) return "un repollo";
    if (weeks < 36) return "una piña";
    return "una sandía";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <section className="bg-white rounded-[40px] border border-ceres-mint flex flex-col xl:flex-row overflow-hidden shadow-xl shadow-ceres-primary/5">
        <div className="p-10 md:p-14 flex-1 space-y-8 relative">
          <div className="relative z-10 space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-ceres-mint text-ceres-dark rounded-full text-[10px] font-bold tracking-[0.2em] uppercase">
              <Activity className="w-3 h-3 text-ceres-primary" />
              Gestante Ceres • Riesgo {riskLevel}
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
              Hola, <span className="text-ceres-primary">{profile?.name.split(' ')[0] || 'Mamá'}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link to="/salud" className="bg-ceres-primary hover:bg-ceres-dark text-white px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-ceres-primary/20">Mi Control Médico</Link>
              <Link to="/carnet" className="px-8 py-4 rounded-2xl border border-ceres-primary text-ceres-primary hover:bg-ceres-mint font-bold text-[10px] uppercase tracking-widest transition-all">Carnet Virtual</Link>
            </div>
          </div>
        </div>

        <div className="bg-ceres-mint/20 p-10 flex items-center justify-center border-l border-ceres-mint shrink-0 xl:w-80">
          <div className="relative group text-center space-y-4">
            <div className="w-48 h-48 md:w-56 md:h-56 bg-white rounded-[60px] flex items-center justify-center text-7xl md:text-8xl shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 border-4 border-white">🤰</div>
            <div>
              <p className="text-xs font-bold text-ceres-dark uppercase tracking-widest">Semana {gestationalWeeks}</p>
              <p className="text-[10px] text-slate-400 font-medium italic">Como {getBabySizeInfo(gestationalWeeks)}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard icon={Thermometer} label="Tensión Arterial" value="110/70" unit="mmHg" colorClass="bg-ceres-secondary" />
        <StatCard icon={Activity} label="Pulso" value="76" unit="bpm" colorClass="bg-ceres-primary" />
        <StatCard icon={Scale} label="Peso Actual" value="68.2" unit="kg" colorClass="bg-slate-700" />
        <StatCard icon={Target} label="Meta Ceres" value={profile?.weightGoal.max || 16} unit="kg" colorClass="bg-ceres-dark" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-ceres-dark rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md"><Heart className="w-6 h-6 text-ceres-secondary" /></div>
                <div><h2 className="text-xs font-bold uppercase tracking-[0.3em] text-ceres-secondary">Bienestar Ceres</h2><p className="text-lg font-bold">Consejo de Salud Diaria</p></div>
              </div>
              <p className="text-xl md:text-2xl font-serif italic leading-relaxed opacity-95">"La actividad física regular es tu mejor beneficio. Mantente activa para mejorar tu ánimo y salud lumbopélvica."</p>
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Link to="/carnet" className="bg-white p-10 rounded-[40px] border border-ceres-mint shadow-sm space-y-8 group hover:border-ceres-primary transition-all">
              <h3 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-3"><Dumbbell className="w-6 h-6 text-ceres-secondary" />Actividad Física</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Consulta tu carnet de ejercicio y prescripción médica personalizada.</p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-ceres-secondary uppercase tracking-widest group-hover:gap-4 transition-all">Ver Actividad <ChevronRight className="w-4 h-4" /></div>
            </Link>
            
            <Link to="/carnet" className="bg-white p-10 rounded-[40px] border border-ceres-mint shadow-sm space-y-8 group hover:border-ceres-primary transition-all">
              <h3 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-3"><Fingerprint className="w-6 h-6 text-ceres-primary" />Carnet Digital</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Accede rápidamente a tu historial de exámenes y controles prenatales.</p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-ceres-primary uppercase tracking-widest group-hover:gap-4 transition-all">Ver Carnet <ChevronRight className="w-4 h-4" /></div>
            </Link>
          </div>
        </div>

        <aside className="space-y-10">
          <div className="bg-white border-2 border-ceres-primary p-12 rounded-[50px] shadow-2xl shadow-ceres-primary/10 flex flex-col items-center text-center space-y-8 relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 bg-ceres-mint rounded-3xl flex items-center justify-center mx-auto shadow-inner"><Stethoscope className="w-8 h-8 text-ceres-primary" /></div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-ceres-dark">Ecografía 3D</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">Captura los momentos más tiernos con nuestro servicio de ecografía en casa.</p>
              </div>
              <a 
                href="https://www.ceresecografiaencasa.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-ceres-primary hover:bg-ceres-dark text-white py-5 rounded-[24px] font-bold tracking-widest text-[10px] transition-all shadow-xl shadow-ceres-primary/20 text-center"
              >
                PEDIR ECOGRAFÍA
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;


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
  Info
} from 'lucide-react';
import { UserProfile } from '../types';

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
      {/* Welcome & Profile Section */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-500 font-medium">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                   <User className="w-4 h-4 text-ceres-primary" />
                 </div>
                 <span className="text-sm">{profile?.documentType} {profile?.idNumber}</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                   <MapPin className="w-4 h-4 text-ceres-primary" />
                 </div>
                 <span className="text-sm truncate">{profile?.address}, {profile?.municipality}</span>
               </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link to="/salud" className="bg-ceres-primary hover:bg-ceres-dark text-white px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-ceres-primary/20">
                Mi Control Médico
              </Link>
              <Link to="/carnet" className="px-8 py-4 rounded-2xl border border-ceres-primary text-ceres-primary hover:bg-ceres-mint font-bold text-[10px] uppercase tracking-widest transition-all">
                Carnet Virtual
              </Link>
            </div>
          </div>
        </div>

        {/* Baby Visual Card */}
        <div className="bg-ceres-mint/20 p-10 flex items-center justify-center border-l border-ceres-mint shrink-0 xl:w-80">
          <div className="relative group text-center space-y-4">
            <div className="w-48 h-48 md:w-56 md:h-56 bg-white rounded-[60px] flex items-center justify-center text-7xl md:text-8xl shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 border-4 border-white">
              🤰
            </div>
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
          {/* Information Section (Replaces AI) */}
          <section className="bg-ceres-dark rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                  <Heart className="w-6 h-6 text-ceres-secondary" />
                </div>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-ceres-secondary">Bienestar Ceres</h2>
                  <p className="text-lg font-bold">Consejo de Salud Diaria</p>
                </div>
              </div>
              <p className="text-xl md:text-2xl font-serif italic leading-relaxed opacity-95">
                "Mantenerse hidratada y realizar caminatas suaves de 20 minutos ayuda a mejorar la circulación y reduce la fatiga durante este trimestre."
              </p>
              <div className="pt-8 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden">
                    <img src="https://i.pravatar.cc/100?u=doc1" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Validado por Obstetricia Ceres</p>
                </div>
                <Link to="/salud" className="text-ceres-secondary hover:text-white transition-colors flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                  Ver detalle <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Agenda & Tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[40px] border border-ceres-mint shadow-sm space-y-8">
              <h3 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-ceres-primary" />
                Agenda Ceres
              </h3>
              <div className="space-y-4">
                <div className="group cursor-pointer p-4 bg-ceres-light rounded-3xl border border-ceres-mint flex items-center gap-4 hover:bg-ceres-mint/30 transition-all">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Activity className="w-5 h-5 text-ceres-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ceres-dark">Ecografía en Casa</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">15 Oct • 16:30</p>
                  </div>
                </div>
                <button className="w-full py-4 rounded-2xl border-2 border-dashed border-ceres-mint text-[10px] font-bold text-slate-400 hover:border-ceres-primary hover:text-ceres-primary transition-all uppercase tracking-widest">
                  Solicitar Cita Médica
                </button>
              </div>
            </div>
            
            <Link to="/carnet" className="bg-white p-10 rounded-[40px] border border-ceres-mint shadow-sm space-y-8 group hover:border-ceres-primary transition-all">
              <h3 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-3">
                <Fingerprint className="w-6 h-6 text-ceres-primary" />
                Carnet Digital
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Accede rápidamente a tu historial de exámenes y controles prenatales.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-ceres-primary uppercase tracking-widest group-hover:gap-4 transition-all">
                Ver Carnet <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>

        {/* Sidebar Assistance */}
        <aside className="space-y-10">
          <div className="bg-white border-2 border-ceres-primary p-12 rounded-[50px] shadow-2xl shadow-ceres-primary/10 flex flex-col items-center text-center space-y-8 relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 bg-ceres-mint rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <Stethoscope className="w-8 h-8 text-ceres-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-ceres-dark">Ecografía 4D</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  En {profile?.municipality || 'tu municipio'}, enviamos a un especialista Ceres directamente a tu hogar para capturar los momentos más tiernos.
                </p>
              </div>
              <button className="w-full bg-ceres-primary hover:bg-ceres-dark text-white py-5 rounded-[24px] font-bold tracking-widest text-[10px] transition-all shadow-xl shadow-ceres-primary/20">
                PEDIR ECOGRAFÍA
              </button>
            </div>
          </div>
          
          <div className="bg-ceres-mint p-8 rounded-[40px] border border-ceres-primary/20 flex items-start gap-4">
             <Info className="w-6 h-6 text-ceres-primary shrink-0 mt-1" />
             <p className="text-[11px] font-bold text-ceres-dark leading-relaxed uppercase tracking-wide">
               Recuerda presentar tu carnet virtual en cada una de tus visitas médicas Ceres.
             </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;

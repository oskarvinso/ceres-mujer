
import React, { useState, useEffect } from 'react';
// Added missing Link import
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ChevronRight, 
  Calendar, 
  Bell, 
  Thermometer, 
  Scale, 
  Droplets,
  Activity,
  AlertTriangle,
  Sparkles,
  Info
} from 'lucide-react';
import { getHealthTips } from '../services/geminiService';

const StatCard = ({ icon: Icon, label, value, unit, color }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 flex items-center gap-4 hover:shadow-md transition-all">
    <div className={`p-3 rounded-2xl ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-800">{value}</span>
        <span className="text-slate-400 text-xs font-medium">{unit}</span>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [tips, setTips] = useState<string>("");
  const [loadingTips, setLoadingTips] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [gestationalWeeks, setGestationalWeeks] = useState<number>(0);
  const [riskLevel, setRiskLevel] = useState<string>('Bajo');

  useEffect(() => {
    const savedProfile = localStorage.getItem('ser_mujer_profile');
    const savedRisk = localStorage.getItem('ser_mujer_risk');
    if (savedProfile) {
      const data = JSON.parse(savedProfile);
      setProfile(data);
      setRiskLevel(savedRisk || 'Bajo');
      
      // Calculate gestational age from EDD (280 days total)
      const eddDate = new Date(data.edd);
      const today = new Date();
      const diffTime = eddDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weeksLeft = Math.floor(diffDays / 7);
      const currentWeeks = 40 - weeksLeft;
      setGestationalWeeks(currentWeeks > 0 ? currentWeeks : 0);
    }

    const fetchTips = async () => {
      try {
        const healthData = { weight: 68.5, heartRate: 78, bp: "110/70", risk: savedRisk };
        const result = await getHealthTips(healthData);
        setTips(result || "Mantente hidratada y descansa bien hoy.");
      } catch (err) {
        setTips("Recuerda asistir a tus controles prenatales regularmente.");
      } finally {
        setLoadingTips(false);
      }
    };
    fetchTips();
  }, []);

  const getBabySizeInfo = (weeks: number) => {
    if (weeks < 8) return "Semilla de Amapola";
    if (weeks < 12) return "Limoncillo";
    if (weeks < 16) return "Naranja";
    if (weeks < 20) return "Mango";
    if (weeks < 24) return "Papaya";
    if (weeks < 28) return "Berenjena";
    if (weeks < 32) return "Piña";
    if (weeks < 36) return "Melón";
    return "Sandía pequeña";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-purple-100 rounded-3xl flex items-center justify-center text-3xl shadow-sm border border-purple-200">
            🤰
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-purple-900">Hola, {profile?.name || 'Mamá'}</h1>
            <p className="text-fuchsia-600 font-medium flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              Semana {gestationalWeeks} de tu embarazo • El bebé es como un(a) {getBabySizeInfo(gestationalWeeks)}.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 border font-bold text-sm ${
            riskLevel === 'Alto' ? 'bg-rose-50 border-rose-100 text-rose-600' : 
            riskLevel === 'Medio' ? 'bg-amber-50 border-amber-100 text-amber-600' : 
            'bg-emerald-50 border-emerald-100 text-emerald-600'
          }`}>
            <AlertTriangle className="w-4 h-4" />
            Riesgo: {riskLevel}
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-pink-100 shadow-sm">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-bold text-slate-700">Próxima cita: 12 Oct</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Thermometer} label="Presión" value="110/70" unit="mmHg" color="bg-purple-600" />
        <StatCard icon={Heart} label="Frecuencia" value="78" unit="bpm" color="bg-fuchsia-500" />
        <StatCard icon={Scale} label="Peso" value="68.5" unit="kg" color="bg-pink-400" />
        <StatCard icon={Droplets} label="Hidratación" value="1.8" unit="L" color="bg-indigo-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-gradient-to-br from-purple-600 to-fuchsia-600 p-8 md:p-10 rounded-[40px] text-white shadow-xl shadow-purple-100 relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                <h2 className="font-bold uppercase tracking-widest text-sm opacity-90">Consejos de IA Ser Mujer</h2>
              </div>
              {loadingTips ? (
                <div className="space-y-3">
                  <div className="h-4 bg-white/20 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-white/20 rounded animate-pulse w-1/2"></div>
                </div>
              ) : (
                <p className="text-lg md:text-xl font-medium leading-relaxed italic">"{tips}"</p>
              )}
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3 rounded-2xl text-sm font-bold transition-all border border-white/30">
                Ver historial de salud
              </button>
            </div>
            {/* Background graphics */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-fuchsia-400/20 rounded-full -ml-24 -mb-24 blur-3xl"></div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[32px] border border-pink-100 shadow-sm space-y-6">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Plan de Hoy
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Caminata Ligera</p>
                    <p className="text-xs text-slate-400">20 minutos recomendados</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-fuchsia-100 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-fuchsia-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Taller de Lactancia</p>
                    <p className="text-xs text-slate-400">Virtual • 18:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-[32px] border border-pink-100 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center text-4xl border-4 border-white shadow-lg">
                  👶
                </div>
                <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 border-white">
                  {gestationalWeeks}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Crecimiento del Bebé</h3>
                <p className="text-xs text-slate-500 max-w-[150px] mx-auto mt-1">Tu bebé ahora mide aprox. 30cm y pesa 600g.</p>
              </div>
              <button className="text-purple-600 text-xs font-bold hover:underline flex items-center gap-1">
                Ver detalles <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <div className="bg-slate-900 text-white p-8 rounded-[40px] overflow-hidden relative shadow-2xl">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Info className="w-6 h-6 text-fuchsia-400" />
              </div>
              <h3 className="text-2xl font-serif font-bold leading-tight">Asistencia Domiciliaria</h3>
              <p className="text-slate-400 text-sm leading-relaxed">¿Molestias o dudas? Solicita una ecografía o enfermera en casa ahora.</p>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-purple-900/50">
                Pedir Asistencia
              </button>
            </div>
            {/* Decorative background for the dark card */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 opacity-10 p-4">
              <Heart className="w-32 h-32 fill-white" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-pink-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Lecturas para ti</h3>
              {/* Link component usage was causing error because of missing import */}
              <Link to="/educacion" className="text-purple-600 text-xs font-bold uppercase tracking-widest">Ver Todo</Link>
            </div>
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="group cursor-pointer flex gap-4">
                  <div className="w-20 h-20 bg-pink-50 rounded-2xl overflow-hidden shrink-0">
                    <img src={`https://picsum.photos/seed/ser${i+10}/200/200`} alt="Post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-purple-600 transition-colors leading-snug">Preparando el nido: Ideas de decoración</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Lectura de 5 min</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;

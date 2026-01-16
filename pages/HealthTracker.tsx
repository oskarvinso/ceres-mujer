
import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';
import { Scale, Heart, Activity, Plus, AlertTriangle, CheckCircle, ShieldCheck, Stethoscope, Target } from 'lucide-react';
import { HealthRecord, UserProfile } from '../types';

const initialData: HealthRecord[] = [
  { date: 'Oct 01', weight: 67.2, systolic: 110, diastolic: 70, heartRate: 72 },
  { date: 'Oct 03', weight: 67.5, systolic: 112, diastolic: 72, heartRate: 75 },
  { date: 'Oct 05', weight: 67.8, systolic: 115, diastolic: 75, heartRate: 78 },
  { date: 'Oct 07', weight: 68.2, systolic: 110, diastolic: 68, heartRate: 74 },
  { date: 'Oct 09', weight: 68.5, systolic: 118, diastolic: 78, heartRate: 80 },
];

const HealthTracker: React.FC = () => {
  const [data, setData] = useState(initialData);
  const [showModal, setShowModal] = useState(false);
  const [riskLevel, setRiskLevel] = useState('Bajo');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedRisk = localStorage.getItem('ceres_risk');
    const savedProfile = localStorage.getItem('ceres_profile');
    if (savedRisk) setRiskLevel(savedRisk);
    if (savedProfile) setProfile(JSON.parse(savedProfile));
  }, []);

  const calculateWeightGoal = () => {
    if (!profile) return { min: 0, max: 0, category: 'Desconocido' };
    const imc = profile.initialWeight / Math.pow(profile.height / 100, 2);
    
    if (imc < 18.5) return { min: 12.5, max: 18, category: 'Bajo Peso' };
    if (imc < 25) return { min: 11.5, max: 16, category: 'Peso Normal' };
    if (imc < 30) return { min: 7, max: 11.5, category: 'Sobrepeso' };
    return { min: 5, max: 9, category: 'Obesidad' };
  };

  const weightGoal = calculateWeightGoal();
  const currentWeightGain = profile ? (data[data.length - 1].weight - profile.initialWeight) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-10 border-b border-ceres-mint pb-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-ceres-mint text-ceres-dark rounded-xl text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-ceres-primary" />
            Expediente de Salud
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">Control Prenatal</h1>
          <p className="text-slate-500 font-medium max-w-xl">Seguimiento biométrico basado en tus antecedentes Ceres.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-3 bg-ceres-primary hover:bg-ceres-dark text-white px-10 py-5 rounded-3xl font-bold tracking-wide transition-all shadow-2xl shadow-ceres-primary/20">
          <Plus className="w-5 h-5" />
          Nuevo Registro
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Risk & Goal Summary */}
        <div className="lg:col-span-1 space-y-8">
          <div className={`p-10 rounded-[50px] border flex flex-col items-center text-center space-y-6 shadow-xl ${
            riskLevel === 'Alto' ? 'bg-rose-50 border-rose-100 text-rose-900' :
            riskLevel === 'Medio' ? 'bg-amber-50 border-amber-100 text-amber-900' :
            'bg-ceres-light border-ceres-mint text-ceres-dark'
          }`}>
            <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center shadow-xl ${
              riskLevel === 'Alto' ? 'bg-rose-500 text-white' : 
              riskLevel === 'Medio' ? 'bg-amber-500 text-white' : 
              'bg-ceres-primary text-white shadow-ceres-primary/30'
            }`}>
              {riskLevel === 'Bajo' ? <CheckCircle className="w-12 h-12" /> : <AlertTriangle className="w-12 h-12" />}
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold tracking-tight">Riesgo {riskLevel}</h3>
              <p className="text-xs font-bold uppercase tracking-widest mt-1 opacity-60">Clasificación Ceres</p>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] border border-ceres-mint shadow-sm space-y-8 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-ceres-mint rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6 text-ceres-primary" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg">Meta de Peso</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">IMC Inicial: {weightGoal.category}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-3xl font-bold text-slate-800">+{currentWeightGain.toFixed(1)} <span className="text-sm font-medium text-slate-400">kg</span></p>
                  <p className="text-[10px] font-bold text-ceres-primary uppercase mt-1">Ganancia actual</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-400">{weightGoal.min}-{weightGoal.max} kg</p>
                  <p className="text-[10px] font-bold text-slate-300 uppercase mt-1">Rango ideal</p>
                </div>
              </div>
              
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-ceres-primary rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((currentWeightGain / weightGoal.max) * 100, 100)}%` }}
                ></div>
              </div>
              
              <p className="text-[10px] text-slate-500 italic leading-relaxed text-center">
                Tu meta total al finalizar las 40 semanas debe estar entre los {weightGoal.min} y {weightGoal.max} kilos ganados.
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-10 rounded-[50px] border border-ceres-mint shadow-sm">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-14 h-14 bg-ceres-mint rounded-2xl flex items-center justify-center">
                <Activity className="w-7 h-7 text-ceres-primary" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-2xl text-slate-800">Tensión Arterial</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sistólica / Diastólica</p>
              </div>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} fontWeight="700" tickLine={false} axisLine={false} dy={15} />
                  <YAxis stroke="#94a3b8" fontSize={12} fontWeight="700" tickLine={false} axisLine={false} dx={-15} />
                  <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 30px 60px -12px rgb(0 0 0 / 0.15)', padding: '20px' }} />
                  <Line type="monotone" dataKey="systolic" stroke="#004D40" strokeWidth={6} dot={{ fill: '#004D40', r: 6, strokeWidth: 4, stroke: '#fff' }} />
                  <Line type="monotone" dataKey="diastolic" stroke="#26A69A" strokeWidth={6} dot={{ fill: '#26A69A', r: 6, strokeWidth: 4, stroke: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-ceres-dark/40 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[60px] p-16 space-y-12 shadow-2xl animate-in zoom-in-95">
            <div className="text-center space-y-3">
              <h3 className="text-3xl font-serif font-bold text-slate-800">Control Prenatal</h3>
              <p className="text-slate-400 text-sm">Registra tu peso y presión arterial del día.</p>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">P. Sistólica</label>
                  <input type="number" className="w-full px-8 py-6 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-ceres-mint outline-none text-2xl font-bold text-center" placeholder="110" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">P. Diastólica</label>
                  <input type="number" className="w-full px-8 py-6 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-ceres-mint outline-none text-2xl font-bold text-center" placeholder="70" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Peso Actual (kg)</label>
                <input type="number" step="0.1" className="w-full px-8 py-6 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-ceres-mint outline-none text-2xl font-bold text-center" placeholder="68.5" />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowModal(false)} className="flex-1 px-8 py-6 border border-slate-200 rounded-3xl font-bold text-slate-400 hover:bg-slate-50 uppercase tracking-widest text-xs">Cerrar</button>
              <button onClick={() => setShowModal(false)} className="flex-1 px-8 py-6 bg-ceres-primary text-white rounded-3xl font-bold hover:bg-ceres-dark transition-all uppercase tracking-widest text-xs shadow-xl shadow-ceres-primary/20">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthTracker;

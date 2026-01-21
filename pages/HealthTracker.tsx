
import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceArea
} from 'recharts';
import { Scale, Heart, Activity, Plus, AlertTriangle, CheckCircle, ShieldCheck, Stethoscope, Target, AlertOctagon, Baby } from 'lucide-react';
import { HealthRecord, UserProfile } from '../types';

const initialData: HealthRecord[] = [
  { date: 'Oct 01', weight: 67.2, systolic: 110, diastolic: 70, heartRate: 72, fetalHeartRate: 140 },
  { date: 'Oct 03', weight: 67.5, systolic: 112, diastolic: 72, heartRate: 75, fetalHeartRate: 142 },
  { date: 'Oct 05', weight: 67.8, systolic: 125, diastolic: 82, heartRate: 78, fetalHeartRate: 145 },
  { date: 'Oct 07', weight: 68.2, systolic: 110, diastolic: 68, heartRate: 74, fetalHeartRate: 138 },
  { date: 'Oct 09', weight: 68.5, systolic: 142, diastolic: 92, heartRate: 80, fetalHeartRate: 144 },
];

const HealthTracker: React.FC = () => {
  const [data, setData] = useState(initialData);
  const [showModal, setShowModal] = useState(false);
  const [riskLevel, setRiskLevel] = useState('Bajo');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // States for new record
  const [newSystolic, setNewSystolic] = useState('');
  const [newDiastolic, setNewDiastolic] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [newFetalHeartRate, setNewFetalHeartRate] = useState('');

  useEffect(() => {
    const savedRisk = localStorage.getItem('ceres_risk');
    const savedProfile = localStorage.getItem('ceres_profile');
    if (savedRisk) setRiskLevel(savedRisk);
    if (savedProfile) setProfile(JSON.parse(savedProfile));
  }, []);

  const latestRecord = data[data.length - 1];
  const isHypertensive = latestRecord.systolic >= 140 || latestRecord.diastolic >= 90;

  const handleSaveRecord = () => {
    if (!newSystolic || !newDiastolic || !newWeight) return;
    
    const newRecord: HealthRecord = {
      date: new Date().toLocaleDateString('es-ES', { month: 'short', day: '2-digit' }),
      weight: parseFloat(newWeight),
      systolic: parseInt(newSystolic),
      diastolic: parseInt(newDiastolic),
      heartRate: 75, // Default/Placeholder
      fetalHeartRate: newFetalHeartRate ? parseInt(newFetalHeartRate) : 140
    };

    const updatedData = [...data, newRecord];
    setData(updatedData);
    setShowModal(false);
    
    // Clear fields
    setNewSystolic('');
    setNewDiastolic('');
    setNewWeight('');
    setNewFetalHeartRate('');
  };

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
      {/* Alert Banner for Hypertension */}
      {isHypertensive && (
        <div className="bg-rose-500 text-white p-6 rounded-[32px] shadow-2xl flex items-center gap-6 animate-bounce">
          <AlertOctagon className="w-12 h-12 shrink-0" />
          <div className="flex-1">
            <h4 className="text-xl font-bold uppercase tracking-tight">Alerta de Tensión Alta: {latestRecord.systolic}/{latestRecord.diastolic}</h4>
            <p className="text-sm font-medium opacity-90">Sus niveles de tensión arterial superan el límite de seguridad (140/90). Por favor, contacte a su especialista Ceres de inmediato o diríjase a urgencias si presenta dolor de cabeza, visión borrosa o dolor abdominal.</p>
          </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-10 border-b border-ceres-mint pb-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-ceres-mint text-ceres-dark rounded-xl text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-ceres-primary" />
            Expediente de Salud Digital
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">Control Prenatal</h1>
          <p className="text-slate-500 font-medium max-w-xl">Seguimiento biométrico y alertas de seguridad Ceres.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-3 bg-ceres-primary hover:bg-ceres-dark text-white px-10 py-5 rounded-3xl font-bold tracking-wide transition-all shadow-2xl shadow-ceres-primary/20">
          <Plus className="w-5 h-5" />
          Nuevo Registro
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Risk & Fetal Summary */}
        <div className="lg:col-span-1 space-y-8">
          <div className={`p-10 rounded-[50px] border flex flex-col items-center text-center space-y-6 shadow-xl ${
            isHypertensive || riskLevel === 'Alto' ? 'bg-rose-50 border-rose-100 text-rose-900' :
            riskLevel === 'Medio' ? 'bg-amber-50 border-amber-100 text-amber-900' :
            'bg-ceres-light border-ceres-mint text-ceres-dark'
          }`}>
            <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center shadow-xl ${
              isHypertensive || riskLevel === 'Alto' ? 'bg-rose-500 text-white' : 
              riskLevel === 'Medio' ? 'bg-amber-500 text-white' : 
              'bg-ceres-primary text-white shadow-ceres-primary/30'
            }`}>
              {isHypertensive ? <AlertOctagon className="w-12 h-12" /> : riskLevel === 'Bajo' ? <CheckCircle className="w-12 h-12" /> : <AlertTriangle className="w-12 h-12" />}
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold tracking-tight">Riesgo {isHypertensive ? 'Crítico (Hipertensión)' : riskLevel}</h3>
              <p className="text-xs font-bold uppercase tracking-widest mt-1 opacity-60">Clasificación Ceres</p>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] border border-ceres-mint shadow-sm space-y-8 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-ceres-secondary/10 rounded-2xl flex items-center justify-center">
                <Baby className="w-6 h-6 text-ceres-secondary" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg">Frecuencia Fetal</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Latidos por minuto (LPM)</p>
              </div>
            </div>
            <div className="flex items-center justify-center py-4">
              <div className="text-center">
                 <span className="text-5xl font-black text-slate-800 tracking-tighter">{latestRecord.fetalHeartRate || '--'}</span>
                 <span className="text-sm font-bold text-ceres-secondary block mt-1 uppercase tracking-widest">Normal (110-160)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-10 rounded-[50px] border border-ceres-mint shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-ceres-mint rounded-2xl flex items-center justify-center">
                  <Activity className="w-7 h-7 text-ceres-primary" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-2xl text-slate-800">Tensión Arterial</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sistólica / Diastólica (mmHg)</p>
                </div>
              </div>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-500 rounded-full"></div><span className="text-[9px] font-bold text-slate-400 uppercase">Severo</span></div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded-full"></div><span className="text-[9px] font-bold text-slate-400 uppercase">Leve</span></div>
              </div>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} fontWeight="700" tickLine={false} axisLine={false} dy={15} />
                  <YAxis stroke="#94a3b8" fontSize={12} fontWeight="700" tickLine={false} axisLine={false} dx={-15} domain={[40, 180]} />
                  <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 30px 60px -12px rgb(0 0 0 / 0.15)', padding: '20px' }} />
                  
                  {/* Severity Zones Shading */}
                  <ReferenceArea y1={140} y2={180} fill="#fef2f2" stroke="none" opacity={0.5} /> {/* Severe zone */}
                  <ReferenceArea y1={130} y2={140} fill="#fffbeb" stroke="none" opacity={0.5} /> {/* Mild zone */}
                  <ReferenceArea y1={60} y2={130} fill="#f0fdf4" stroke="none" opacity={0.2} />  {/* Normal zone */}

                  <Line type="monotone" dataKey="systolic" stroke="#004D40" strokeWidth={6} dot={{ fill: '#004D40', r: 6, strokeWidth: 4, stroke: '#fff' }} name="Sistólica" />
                  <Line type="monotone" dataKey="diastolic" stroke="#26A69A" strokeWidth={6} dot={{ fill: '#26A69A', r: 6, strokeWidth: 4, stroke: '#fff' }} name="Diastólica" />
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
              <h3 className="text-3xl font-serif font-bold text-slate-800">Nuevo Control</h3>
              <p className="text-slate-400 text-sm">Registra tus signos vitales actuales.</p>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Sistólica</label>
                  <input type="number" value={newSystolic} onChange={e => setNewSystolic(e.target.value)} className="w-full px-8 py-6 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-ceres-mint outline-none text-2xl font-bold text-center" placeholder="110" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Diastólica</label>
                  <input type="number" value={newDiastolic} onChange={e => setNewDiastolic(e.target.value)} className="w-full px-8 py-6 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-ceres-mint outline-none text-2xl font-bold text-center" placeholder="70" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Peso (kg)</label>
                  <input type="number" value={newWeight} onChange={e => setNewWeight(e.target.value)} step="0.1" className="w-full px-8 py-6 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-ceres-mint outline-none text-2xl font-bold text-center" placeholder="68.5" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Latidos Bebé</label>
                  <input type="number" value={newFetalHeartRate} onChange={e => setNewFetalHeartRate(e.target.value)} className="w-full px-8 py-6 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-ceres-mint outline-none text-2xl font-bold text-center" placeholder="140" />
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowModal(false)} className="flex-1 px-8 py-6 border border-slate-200 rounded-3xl font-bold text-slate-400 hover:bg-slate-50 uppercase tracking-widest text-xs">Cancelar</button>
              <button onClick={handleSaveRecord} className="flex-1 px-8 py-6 bg-ceres-primary text-white rounded-3xl font-bold hover:bg-ceres-dark transition-all uppercase tracking-widest text-xs shadow-xl shadow-ceres-primary/20">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthTracker;

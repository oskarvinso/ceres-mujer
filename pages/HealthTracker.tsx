
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
import { Scale, Heart, Activity, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import { HealthRecord } from '../types';

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

  useEffect(() => {
    const savedRisk = localStorage.getItem('ser_mujer_risk');
    if (savedRisk) setRiskLevel(savedRisk);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-[0.2em]">Control Prenatal</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Salud</h1>
          <p className="text-slate-500">Métricas vitales y valoración de riesgo obstétrico.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-3xl font-bold transition-all shadow-xl shadow-purple-200"
        >
          <Plus className="w-5 h-5" />
          Registrar Control
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Card */}
        <div className="lg:col-span-1">
          <div className={`p-8 rounded-[40px] border flex flex-col items-center text-center space-y-6 h-full shadow-sm ${
            riskLevel === 'Alto' ? 'bg-rose-50 border-rose-100 text-rose-900' :
            riskLevel === 'Medio' ? 'bg-amber-50 border-amber-100 text-amber-900' :
            'bg-emerald-50 border-emerald-100 text-emerald-900'
          }`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${
              riskLevel === 'Alto' ? 'bg-rose-500' : 
              riskLevel === 'Medio' ? 'bg-amber-500' : 
              'bg-emerald-500'
            }`}>
              {riskLevel === 'Bajo' ? <CheckCircle className="w-10 h-10 text-white" /> : <AlertTriangle className="w-10 h-10 text-white" />}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Nivel de Riesgo: {riskLevel}</h3>
              <p className="text-sm opacity-80 leading-relaxed">
                {riskLevel === 'Alto' ? 'Requiere seguimiento médico estrecho y monitoreo diario de presión.' :
                 riskLevel === 'Medio' ? 'Se recomienda mantener un control regular y vigilar signos de alarma.' :
                 'Tu embarazo progresa saludablemente. Mantén tus controles de rutina.'}
              </p>
            </div>
            <div className="pt-6 border-t border-black/5 w-full">
              <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-4">Antecedentes valorados</p>
              <ul className="text-left space-y-2 text-sm">
                <li className="flex items-center gap-2 opacity-80">
                  <div className="w-1.5 h-1.5 rounded-full bg-current"></div> Edad materna
                </li>
                <li className="flex items-center gap-2 opacity-80">
                  <div className="w-1.5 h-1.5 rounded-full bg-current"></div> Presión arterial base
                </li>
                <li className="flex items-center gap-2 opacity-80">
                  <div className="w-1.5 h-1.5 rounded-full bg-current"></div> Historial médico
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 grid grid-cols-1 gap-8">
          <div className="bg-white p-8 rounded-[40px] border border-pink-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-purple-100 rounded-2xl">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-slate-800">Presión Arterial</h2>
                <p className="text-xs text-slate-400">Histórico de las últimas 5 tomas</p>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="systolic" stroke="#7e22ce" strokeWidth={4} dot={{ fill: '#7e22ce', r: 6 }} />
                  <Line type="monotone" dataKey="diastolic" stroke="#d946ef" strokeWidth={4} dot={{ fill: '#d946ef', r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-pink-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-emerald-100 rounded-2xl">
                <Scale className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-slate-800">Control de Peso</h2>
                <p className="text-xs text-slate-400">Evolución de peso materno (kg)</p>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="weight" stroke="#10b981" fillOpacity={1} fill="url(#colorWeight)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-10 space-y-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold text-slate-800">Registrar Toma</h3>
              <p className="text-slate-500 text-sm">Ingresa tus valores medidos en casa.</p>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">P. Sistólica</label>
                  <input type="number" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-purple-500 outline-none text-xl font-bold" placeholder="110" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">P. Diastólica</label>
                  <input type="number" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-purple-500 outline-none text-xl font-bold" placeholder="70" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Peso Actual (kg)</label>
                <input type="number" step="0.1" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-purple-500 outline-none text-xl font-bold" placeholder="68.5" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Frecuencia Cardíaca</label>
                <input type="number" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-purple-500 outline-none text-xl font-bold" placeholder="75" />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={() => setShowModal(false)} className="flex-1 px-8 py-4 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancelar</button>
              <button onClick={() => setShowModal(false)} className="flex-1 px-8 py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthTracker;

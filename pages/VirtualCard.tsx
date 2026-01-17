
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Fingerprint, 
  Activity, 
  Check, 
  X,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Stethoscope,
  Utensils,
  Dumbbell,
  ClipboardList,
  Edit3,
  Heart,
  Scale,
  Thermometer,
  Info,
  Droplets,
  Zap,
  FileText,
  Mail,
  Loader2
} from 'lucide-react';
import { UserProfile, ExamCategory, PrenatalExam, PrenatalControlTrack } from '../types.ts';

const INITIAL_EXAM_SCHEDULE: ExamCategory[] = [
  {
    id: 'cat1',
    title: 'Exámenes de Ingreso',
    subtitle: 'Laboratorio Inicial',
    exams: [
      { id: 'e1', name: 'Tipo de sangre y RH', status: 'pending' },
      { id: 'e2', name: 'Rubeola IG', status: 'pending' },
      { id: 'e3', name: 'FTA Absorbido', status: 'pending' },
      { id: 'e4', name: 'Gran de orina sin centrifugar', status: 'pending' },
      { id: 'e5', name: 'Ferritina', status: 'pending' },
      { id: 'e6', name: 'Toxoplasmosis IG G y IG M', status: 'pending' },
      { id: 'e7', name: 'Hemoleucograma', status: 'pending' },
      { id: 'e8', name: 'Citomegalovirus IG G y IG M', status: 'pending' },
      { id: 'e9', name: 'Antig Ags HB', status: 'pending' },
      { id: 'e10', name: 'TSH', status: 'pending' },
      { id: 'e11', name: 'Citología Oncológica', status: 'pending' },
      { id: 'e12', name: 'VDRL', status: 'pending' },
      { id: 'e13', name: 'Urocultivo', status: 'pending' },
      { id: 'e14', name: 'Uroanalisis', status: 'pending' },
      { id: 'e15', name: 'HIV', status: 'pending' },
      { id: 'e16', name: 'Directo y Gran de Flujo', status: 'pending' },
    ]
  },
  {
    id: 'cat2',
    title: 'Exámenes Semanas 8 a 20',
    exams: [
      { id: 'e20', name: '(DIA 1)(8-13) HCG +PAPP -A', status: 'pending' },
      { id: 'e21', name: '(DIA 2)(11-13) Ultrasonido, TN y Datación', status: 'pending' },
      { id: 'e22', name: '14 Semanas hCG, AFP, uE3 E INHIBIDA A', status: 'pending' },
      { id: 'e23', name: 'Cervicometria mayor de 15 semanas', status: 'pending' },
      { id: 'e24', name: '18-20 Ecografía morfología', status: 'pending' },
      { id: 'e25', name: 'Doppler de arteria uterina', status: 'pending' },
      { id: 'e26', name: 'Coombs Indirecto semana 16', status: 'pending' },
      { id: 'e27', name: 'Coombs Indirecto semana 20', status: 'pending' },
    ]
  }
];

const INITIAL_CONTROLS: PrenatalControlTrack[] = [
  { id: 'c1', title: '1. Como crece tu bebé durante el embarazo', hasControl: false, hasNutrition: false, hasExercise: false, hasDocument: false, completed: false },
  { id: 'c2', title: '2. Molestias comunes en tu embarazo', hasControl: false, hasNutrition: false, hasExercise: false, hasDocument: false, completed: false },
  { id: 'c3', title: '3. ¿Crees tener problemas genéticos?', hasControl: false, hasNutrition: false, hasExercise: false, hasDocument: false, completed: false },
  { id: 'c4', title: '4. Postura en el embarazo', hasControl: false, hasNutrition: false, hasExercise: false, hasDocument: false, completed: false },
  { id: 'c5', title: '5. Mamá activa mas esperanza de vida', hasControl: false, hasNutrition: false, hasExercise: false, hasDocument: false, completed: false },
  { id: 'c6', title: '6. Relación mente cerebro y parto prematuro', hasControl: false, hasNutrition: false, hasExercise: false, hasDocument: false, completed: false },
  { id: 'c7', title: '7. Factor RH y sexualidad', hasControl: false, hasNutrition: false, hasExercise: false, hasDocument: false, completed: false },
  { id: 'c8', title: '8. Prepara tu parto', hasControl: false, hasNutrition: false, hasExercise: false, hasDocument: false, completed: false },
  { id: 'c9', title: '9. Vence el dolor', hasControl: false, hasNutrition: false, hasExercise: false, hasDocument: false, completed: false },
  { id: 'c10', title: '10. Vía del parto', hasControl: false, hasNutrition: false, hasExercise: false, hasDocument: false, completed: false },
];

const VirtualCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'labs' | 'activity'>('labs');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [examSchedule, setExamSchedule] = useState<ExamCategory[]>([]);
  const [prenatalControls, setPrenatalControls] = useState<PrenatalControlTrack[]>([]);
  const [expandedCatId, setExpandedCatId] = useState<string | null>('cat1');
  const [sendingDocId, setSendingDocId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('ceres_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);
      setExamSchedule(parsed.examSchedule || INITIAL_EXAM_SCHEDULE);
      setPrenatalControls(parsed.prenatalControls || INITIAL_CONTROLS);
    }
  }, []);

  const saveUpdates = (updatedExams: ExamCategory[], updatedControls: PrenatalControlTrack[], updatedBlood?: string) => {
    if (profile) {
      const newProfile = { 
        ...profile, 
        examSchedule: updatedExams, 
        prenatalControls: updatedControls,
        bloodType: updatedBlood || profile.bloodType 
      };
      setProfile(newProfile);
      localStorage.setItem('ceres_profile', JSON.stringify(newProfile));
    }
  };

  const handleStatusToggle = (catId: string, examId: string, status: 'normal' | 'abnormal') => {
    const updated = examSchedule.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          exams: cat.exams.map(ex => {
            if (ex.id === examId) {
              const currentStatus = ex.status;
              const newStatus = currentStatus === status ? 'pending' : status;
              return { ...ex, status: newStatus as 'pending' | 'normal' | 'abnormal' };
            }
            return ex;
          })
        };
      }
      return cat;
    });
    setExamSchedule(updated);
    saveUpdates(updated, prenatalControls);
  };

  const handleControlToggle = (controlId: string, field: 'hasControl' | 'hasNutrition' | 'hasExercise' | 'hasDocument') => {
    const updated = prenatalControls.map(c => {
      if (c.id === controlId) {
        return { ...c, [field]: !c[field] };
      }
      return c;
    });
    setPrenatalControls(updated);
    saveUpdates(examSchedule, updated);
  };

  const handleSendDocument = (ctrl: PrenatalControlTrack) => {
    setSendingDocId(ctrl.id);
    // Simulating email sending
    setTimeout(() => {
      handleControlToggle(ctrl.id, 'hasDocument');
      setSendingDocId(null);
      setShowToast(`Documento de "${ctrl.title}" enviado a ${profile?.email}`);
      setTimeout(() => setShowToast(null), 4000);
    }, 1500);
  };

  if (!profile) return (
    <div className="flex items-center justify-center h-screen text-slate-400 font-bold uppercase tracking-widest text-xs">
      Cargando Carnet Ceres...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-700 pb-24 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[110] bg-ceres-dark text-white px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-300">
          <Mail className="w-6 h-6 text-ceres-secondary" />
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest">Correo Enviado</span>
            <span className="text-[11px] font-medium opacity-90">{showToast}</span>
          </div>
          <button onClick={() => setShowToast(null)} className="ml-4 p-1 hover:bg-white/10 rounded-full"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Tab Selector */}
      <div className="flex bg-white p-2 rounded-full border border-ceres-mint shadow-lg w-fit mx-auto mb-10 overflow-hidden">
         <button 
           onClick={() => setActiveTab('labs')} 
           className={`px-10 py-4 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all ${activeTab === 'labs' ? 'bg-ceres-primary text-white shadow-md' : 'text-slate-400 hover:text-ceres-primary hover:bg-ceres-light'}`}
         >
           Salud y Laboratorios
         </button>
         <button 
           onClick={() => setActiveTab('activity')} 
           className={`px-10 py-4 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all ${activeTab === 'activity' ? 'bg-[#0097A7] text-white shadow-md' : 'text-slate-400 hover:text-[#0097A7] hover:bg-cyan-50'}`}
         >
           Actividad Física
         </button>
      </div>

      {activeTab === 'labs' ? (
        <div className="bg-white rounded-[40px] border border-ceres-mint shadow-2xl overflow-hidden">
          {/* Clinical Header */}
          <div className="bg-ceres-dark p-10 text-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-ceres-primary rounded-full -mr-32 -mt-32 opacity-20 blur-3xl"></div>
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[28px] flex items-center justify-center border border-white/20">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-serif font-bold">{profile.name} {profile.lastName}</h2>
                <div className="flex gap-4 mt-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-ceres-secondary">ID: {profile.idNumber}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-ceres-primary">Grupo: {profile.bloodType || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 relative z-10 text-right md:text-left">
              <div><p className="text-[8px] font-bold text-ceres-secondary uppercase tracking-widest">Semanas</p><p className="text-xl font-bold">{profile.gestationWeeks}</p></div>
              <div><p className="text-[8px] font-bold text-ceres-secondary uppercase tracking-widest">Riesgo</p><p className="text-xl font-bold text-ceres-primary">{localStorage.getItem('ceres_risk') || 'Bajo'}</p></div>
            </div>
          </div>

          <div className="p-8 md:p-12 border-b border-ceres-mint bg-ceres-light/30">
            <h3 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-4 mb-8"><ClipboardList className="w-8 h-8 text-ceres-primary" />Controles Prenatales (C-N-E-D)</h3>
            <div className="grid grid-cols-1 gap-6">
              {prenatalControls.map((ctrl) => (
                <div key={ctrl.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm group hover:border-ceres-primary transition-all gap-6">
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-slate-800 pr-4 leading-tight block">{ctrl.title}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Registro de Visita Médica</span>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
                      <button onClick={() => handleControlToggle(ctrl.id, 'hasControl')} className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center border-2 transition-all group/btn ${ctrl.hasControl ? 'bg-ceres-primary border-ceres-primary text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                        <span className="text-[10px] font-black">C</span>
                        <span className="text-[6px] font-bold uppercase hidden group-hover/btn:block">Ctrl</span>
                      </button>
                      <button onClick={() => handleControlToggle(ctrl.id, 'hasNutrition')} className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center border-2 transition-all group/btn ${ctrl.hasNutrition ? 'bg-orange-400 border-orange-400 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                        <span className="text-[10px] font-black">N</span>
                        <span className="text-[6px] font-bold uppercase hidden group-hover/btn:block">Nutr</span>
                      </button>
                      <button onClick={() => handleControlToggle(ctrl.id, 'hasExercise')} className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center border-2 transition-all group/btn ${ctrl.hasExercise ? 'bg-blue-400 border-blue-400 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                        <span className="text-[10px] font-black">E</span>
                        <span className="text-[6px] font-bold uppercase hidden group-hover/btn:block">Ejerc</span>
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => handleSendDocument(ctrl)} 
                      disabled={sendingDocId === ctrl.id}
                      className={`h-10 px-4 rounded-xl flex items-center justify-center gap-2 border-2 transition-all group/doc ${ctrl.hasDocument ? 'bg-ceres-secondary border-ceres-secondary text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-ceres-secondary hover:text-ceres-secondary'}`}
                    >
                      {sendingDocId === ctrl.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-widest">Documento</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-10">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-3"><Activity className="w-7 h-7 text-ceres-primary" />Checklist de Laboratorio</h3>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {examSchedule.map((category) => (
                <div key={category.id} className="bg-slate-50 rounded-[32px] border border-slate-100 overflow-hidden">
                  <button onClick={() => setExpandedCatId(expandedCatId === category.id ? null : category.id)} className="w-full p-6 flex items-center justify-between hover:bg-slate-100 transition-colors">
                    <div className="text-left"><span className="text-lg font-bold text-slate-800">{category.title}</span></div>
                    {expandedCatId === category.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {expandedCatId === category.id && (
                    <div className="p-6 pt-0 divide-y divide-white/60">
                      {category.exams.map((exam) => (
                        <div key={exam.id} className="py-5 flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-700">{exam.name}</span>
                            <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-100">
                              <button onClick={() => handleStatusToggle(category.id, exam.id, 'normal')} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${exam.status === 'normal' ? 'bg-emerald-500 text-white' : 'text-slate-300'}`}>N</button>
                              <button onClick={() => handleStatusToggle(category.id, exam.id, 'abnormal')} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${exam.status === 'abnormal' ? 'bg-rose-500 text-white' : 'text-slate-300'}`}>ANOR</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-cyan-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
           {/* PDF Header Style: VALORACIÓN ESTADO FÍSICO MATERNO */}
           <div className="bg-[#00BCD4] p-12 text-white flex justify-between items-center border-b-[8px] border-[#0097A7]">
              <div className="space-y-2">
                <p className="text-xs font-bold tracking-[0.4em] uppercase opacity-90">Protocolo Ceres Mujer</p>
                <h3 className="text-4xl md:text-5xl font-serif font-black tracking-tight leading-none uppercase">
                  VALORACIÓN <br/>
                  <span className="text-[#E0F7FA]">ESTADO FÍSICO</span> <br/>
                  MATERNO
                </h3>
              </div>
              <div className="hidden md:block">
                 <div className="w-40 h-40 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center border-4 border-white/40">
                    <Activity className="w-20 h-20 text-white" />
                 </div>
              </div>
           </div>

           <div className="p-8 md:p-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Panel 1: Prescripción Médica (Matches PDF structure) */}
              <div className="space-y-10 lg:border-r lg:border-cyan-50 lg:pr-10">
                 <div className="space-y-6">
                    <div className="relative">
                      <div className="bg-[#0097A7] text-white py-3 px-8 rounded-tr-3xl rounded-bl-3xl w-fit font-bold uppercase text-[11px] tracking-widest relative z-10 shadow-md">
                        Prescripción Médica
                      </div>
                      <div className="bg-cyan-50 h-1 w-full absolute top-1/2 -z-0"></div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-3xl border border-cyan-100 shadow-sm space-y-4">
                       <div className="flex justify-between border-b border-cyan-50 pb-2">
                         <span className="text-[10px] font-bold text-slate-400 uppercase">Nombre:</span>
                         <span className="text-xs font-bold text-[#006064]">{profile.name}</span>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div className="border-b border-cyan-50 pb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Trimestre:</span>
                            <span className="text-xs font-bold text-[#006064]">2do</span>
                         </div>
                         <div className="border-b border-cyan-50 pb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Latidos:</span>
                            <span className="text-xs font-bold text-[#006064]">140 lpm</span>
                         </div>
                       </div>
                       <div className="flex justify-around pt-2">
                          {['Deportista', 'Activa', 'Sedentaria'].map(type => (
                            <div key={type} className="flex flex-col items-center gap-1">
                               <div className={`w-5 h-5 rounded-md border-2 ${type === 'Activa' ? 'bg-[#0097A7] border-[#0097A7]' : 'border-cyan-200'} flex items-center justify-center`}>
                                  {type === 'Activa' && <Check className="w-4 h-4 text-white" />}
                               </div>
                               <span className="text-[9px] font-bold text-slate-400 uppercase">{type}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="relative">
                      <div className="bg-[#0097A7] text-white py-3 px-8 rounded-tr-3xl rounded-bl-3xl w-fit font-bold uppercase text-[11px] tracking-widest relative z-10 shadow-md">
                        Ejercicios Aeróbicos
                      </div>
                      <div className="bg-cyan-50 h-1 w-full absolute top-1/2 -z-0"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       {['Caminar', 'Nadar', 'Yoga', 'Pilates', 'Zumba', 'Nadar'].map(ex => (
                         <div key={ex} className="flex items-center gap-2 p-3 bg-cyan-50/50 rounded-xl border border-cyan-100">
                            <div className="w-3 h-3 rounded-full bg-[#0097A7]"></div>
                            <span className="text-[10px] font-bold text-[#006064] uppercase">{ex}</span>
                         </div>
                       ))}
                    </div>
                    <div className="p-4 bg-[#E0F7FA] rounded-2xl text-[10px] font-bold text-[#006064] text-center uppercase tracking-widest">
                       Frecuencia: 2 a 3 veces / semana
                    </div>
                 </div>
              </div>

              {/* Panel 2: Recomendaciones & Objetivos */}
              <div className="space-y-10 lg:border-r lg:border-cyan-50 lg:pr-10">
                 <div className="space-y-6">
                    <div className="relative">
                      <div className="bg-[#0097A7] text-white py-3 px-8 rounded-tr-3xl rounded-bl-3xl w-fit font-bold uppercase text-[11px] tracking-widest relative z-10 shadow-md">
                        Recomendaciones
                      </div>
                      <div className="bg-cyan-50 h-1 w-full absolute top-1/2 -z-0"></div>
                    </div>
                    <div className="space-y-3">
                       {[
                         'Consulte a su médico antes de aumentar su nivel de actividad.',
                         'Hacer ejercicio con regularidad pero no sobre-ejercer.',
                         'Hacer ejercicio con una amiga embarazada o unirse a programa prenatal.',
                         'Seguir los principios del FITT modificados para embarazadas.'
                       ].map((rec, i) => (
                         <div key={i} className="flex gap-3 p-4 bg-white border border-cyan-50 rounded-2xl shadow-sm italic text-xs text-slate-600">
                            <Info className="w-4 h-4 text-[#00BCD4] shrink-0" />
                            <p>{rec}</p>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="relative">
                      <div className="bg-[#0097A7] text-white py-3 px-8 rounded-tr-3xl rounded-bl-3xl w-fit font-bold uppercase text-[11px] tracking-widest relative z-10 shadow-md">
                        Objetivos
                      </div>
                      <div className="bg-cyan-50 h-1 w-full absolute top-1/2 -z-0"></div>
                    </div>
                    <div className="space-y-2">
                       {['Aumentar masa muscular', 'Reducir el dolor lumbar', 'Mejorar el estado del ánimo', 'Ayudar a la recuperación pos-parto'].map(obj => (
                         <div key={obj} className="flex items-center gap-3 px-4 py-3 bg-[#E0F7FA] rounded-2xl">
                            <div className="w-5 h-5 rounded-full border-2 border-[#0097A7] flex items-center justify-center bg-white"><Check className="w-3 h-3 text-[#0097A7]" /></div>
                            <span className="text-[10px] font-bold text-[#00838F] uppercase">{obj}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Panel 3: Alimentación & Seguridad */}
              <div className="space-y-10">
                 <div className="space-y-6">
                    <div className="relative">
                      <div className="bg-[#0097A7] text-white py-3 px-8 rounded-tr-3xl rounded-bl-3xl w-fit font-bold uppercase text-[11px] tracking-widest relative z-10 shadow-md">
                        Alimentación & Deporte
                      </div>
                      <div className="bg-cyan-50 h-1 w-full absolute top-1/2 -z-0"></div>
                    </div>
                    <div className="bg-white p-6 rounded-[32px] border border-cyan-100 space-y-5">
                       <div className="flex items-start gap-4">
                          <Droplets className="w-5 h-5 text-cyan-500 shrink-0" />
                          <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase">Beber 6-8 vasos de líquido, incluyendo agua, cada día.</p>
                       </div>
                       <div className="flex items-start gap-4">
                          <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                          <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase">La necesidad de calorías es más alta (300 más por día).</p>
                       </div>
                       <div className="flex items-start gap-4">
                          <Utensils className="w-5 h-5 text-emerald-500 shrink-0" />
                          <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase">Hidratar antes, durante y después del ejercicio.</p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="relative">
                      <div className="bg-[#D81B60] text-white py-3 px-8 rounded-tr-3xl rounded-bl-3xl w-fit font-bold uppercase text-[11px] tracking-widest relative z-10 shadow-md">
                        Razones para detenerse
                      </div>
                      <div className="bg-rose-50 h-1 w-full absolute top-1/2 -z-0"></div>
                    </div>
                    <div className="bg-rose-50 border border-rose-100 p-6 rounded-[32px] space-y-4">
                       {[
                         'Falta de aliento excesiva',
                         'Sangrado vaginal',
                         'Mareos o desmayos',
                         'Dolor de pecho',
                         'Contracciones uterinas dolorosas',
                         'Fuga de líquido de la vagina'
                       ].map(reason => (
                         <div key={reason} className="flex items-center gap-3">
                            <X className="w-4 h-4 text-rose-500 shrink-0" />
                            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-tight">{reason}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
           
           {/* Footer Promo (Matches PDF bottom) */}
           <div className="p-10 bg-cyan-50 text-center space-y-4 border-t border-cyan-100">
              <p className="text-[11px] font-serif font-bold text-[#006064] italic">
                "Buenos hábitos en nutrición y ejercicios son tu mejor beneficio."
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-[#0097A7] text-white px-10 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg hover:bg-[#006064] transition-all">
                  Imprimir mi Carnet PDF
                </button>
                <button className="bg-white border-2 border-[#0097A7] text-[#0097A7] px-10 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-cyan-50 transition-all">
                  Ver Folletos de Ejercicios
                </button>
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pt-4">
                © Ceres Mujer - Medellín, Cra 45 N° 6-95, Barrio Patio Bonito
              </p>
           </div>
        </div>
      )}
    </div>
  );
};

export default VirtualCard;

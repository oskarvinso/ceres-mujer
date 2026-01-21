
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Check, 
  X,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  FileText,
  Mail,
  Loader2,
  Printer,
  Share2,
  AlertTriangle,
  Info,
  Dumbbell,
  CheckCircle2,
  AlertCircle,
  Footprints,
  HeartPulse,
  UtensilsCrossed,
  Wind,
  Smile,
  AlertOctagon,
  BookOpenCheck,
  Download,
  Baby,
  Calendar,
  Stethoscope,
  Clock,
  // Fix: Added missing User import from lucide-react
  User
} from 'lucide-react';
import { UserProfile, ExamCategory, PrenatalControlTrack } from '../types.ts';

const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const COMPREHENSIVE_EXAMS: ExamCategory[] = [
  {
    id: 'ingreso',
    title: 'Exámenes de Ingreso',
    subtitle: 'Protocolo Inicial Obligatorio',
    exams: [
      { id: 'i1', name: 'HCT/HB (Hemoglobina/Hematocrito)', status: 'pending' },
      { id: 'i2', name: 'IGG Rubeola', status: 'pending' },
      { id: 'i3', name: 'IGM Rubeola', status: 'pending' },
      { id: 'i4', name: 'Citomegalovirus IgG', status: 'pending' },
      { id: 'i5', name: 'Citomegalovirus IgM', status: 'pending' },
      { id: 'i6', name: 'VDRL / Sífilis', status: 'pending' },
      { id: 'i7', name: 'Parcial de Orina', status: 'pending' },
      { id: 'i8', name: 'Directo y Gram de Flujo', status: 'pending' },
      { id: 'i9', name: 'Urocultivo', status: 'pending' },
      { id: 'i10', name: 'HBsAg (Hepatitis B)', status: 'pending' },
      { id: 'i11', name: 'HIV (VIH 1 y 2)', status: 'pending' },
      { id: 'i12', name: 'TSH (Tiroides)', status: 'pending' },
      { id: 'i13', name: 'Coprológico', status: 'pending' },
      { id: 'i14', name: 'Ferritina', status: 'pending' },
      { id: 'i15', name: 'Citología Oncogénica', status: 'pending' },
    ]
  },
  {
    id: 'visita8-20',
    title: 'Visita (8 - 20 SM)',
    subtitle: 'Tamizaje Genético y Morfológico',
    exams: [
      { id: 'v1_1', name: '(Día 1)(8-13) fβ-Hcg + PAPP-A', status: 'pending' },
      { id: 'v1_2', name: '(Día 2)(11-13) Ultra Sonido, TN y Datación', status: 'pending' },
      { id: 'v1_3', name: '(> 14) fβ-Hcg, AFP, Ue3 e INHIBINA A', status: 'pending' },
      { id: 'v1_4', name: '(> 15) Cervicometría', status: 'pending' },
      { id: 'v1_5', name: '(18-20) Ecografía Morfológica', status: 'pending' },
      { id: 'v1_6', name: '(20) Doppler de Arterias Uterinas', status: 'pending' },
    ]
  }
];

const INITIAL_CONTROLS: PrenatalControlTrack[] = [
  { id: 'c1', title: '1. Como crece tu bebé durante el embarazo', hasControl: false, hasNutrition: false, hasExercise: false, hasDocument: false, completed: false },
  { id: 'c2', title: '2. Molestias comunes en tu embarazo', hasControl: false, hasNutrition: false, hasExercise: false, hasDocument: false, completed: false },
  { id: 'c3', title: '3. ¿Crees tener problemas genéticos?', hasControl: false, hasNutrition: false, hasExercise: false, hasDocument: false, completed: false },
  { id: 'c4', title: '4. Postura en el embarazo', hasControl: false, hasNutrition: false, hasExercise: false, hasDocument: false, completed: false },
  { id: 'c5', title: '5. Mamá activa mas esperanza de vida', hasControl: false, hasNutrition: false, hasExercise: false, hasDocument: false, completed: false },
];

const VirtualCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'labs' | 'activity'>('labs');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [examSchedule, setExamSchedule] = useState<ExamCategory[]>([]);
  const [prenatalControls, setPrenatalControls] = useState<PrenatalControlTrack[]>([]);
  const [expandedCatId, setExpandedCatId] = useState<string | null>('ingreso');
  const [sendingDocId, setSendingDocId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Activity States
  const [motherType, setMotherType] = useState<'active' | 'sedentary'>('sedentary');
  const [questionnaire, setQuestionnaire] = useState<Record<string, boolean>>({});

  const questionnaireQuestions = [
    { id: 'q1', text: '¿Tiene Diabetes Tipo I no controlada?' },
    { id: 'q2', text: '¿Cuenta con evidencia de restricción de crecimiento fetal?' },
    { id: 'q3', text: '¿Presenta ruptura de membranas o parto prematuro?' },
    { id: 'q4', text: '¿Tiene Hipertensión inducida por el embarazo?' },
    { id: 'q5', text: '¿Sangrado persistente en el 2do o 3er trimestre?' },
    { id: 'q6', text: '¿Sufre de otras enfermedades cardiovasculares o sistémicas?' },
    { id: 'q7', text: '¿Presenta incompetencia cervical o cuello corto?' },
    { id: 'q8', text: '¿Tiene un embarazo múltiple?' },
    { id: 'q9', text: '¿Historial de aborto espontáneo en embarazos previos?' },
    { id: 'q10', text: '¿Embarazo gemelar luego de las 28 semanas?' },
    { id: 'q11', text: '¿Presenta malnutrición o desorden alimenticio?' },
    { id: 'q12', text: '¿Tiene Anemia o deficiencia de hierro severa?' },
    { id: 'q13', text: '¿Enfermedad respiratoria moderada (asma no controlada)?' },
    { id: 'q14', text: '¿Alguna otra condición médica significativa?' }
  ];

  const hasContraindications = Object.values(questionnaire).some(val => val === true);

  useEffect(() => {
    const savedProfile = localStorage.getItem('ceres_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);
      setExamSchedule(parsed.examSchedule || COMPREHENSIVE_EXAMS);
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
              const newStatus = ex.status === status ? 'pending' : status;
              return { ...ex, status: newStatus as any };
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

  const getHRRange = () => {
    const age = profile?.age || 25;
    if (motherType === 'sedentary') {
      if (age < 20) return "135 - 145 lpm";
      if (age <= 29) return "131 - 141 lpm";
      return "126 - 135 lpm";
    } else {
      if (age < 20) return "140 - 155 lpm";
      if (age <= 29) return "135 - 150 lpm";
      return "130 - 145 lpm";
    }
  };

  const handlePortarCarnet = () => {
    setIsExporting(true);
    // Simular preparación y descarga del PDF original del carnet
    setTimeout(() => {
      const pdfUrl = "https://www.ginecologaalvaro.com/documentos/carnet_valoracion_fisica_ceres.pdf";
      window.open(pdfUrl, '_blank');
      setIsExporting(false);
      setShowToast("Abriendo carnet original para impresión...");
      setTimeout(() => setShowToast(null), 3000);
    }, 1500);
  };

  if (!profile) return (
    <div className="flex items-center justify-center h-screen text-slate-400 font-bold uppercase tracking-widest text-xs">
      Cargando Carnet Ceres...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-700 pb-24 relative print:p-0 print:m-0">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[110] bg-ceres-dark text-white px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-300 print:hidden">
          <Share2 className="w-6 h-6 text-ceres-secondary" />
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest">Sistema Ceres</span>
            <span className="text-[11px] font-medium opacity-90">{showToast}</span>
          </div>
          <button onClick={() => setShowToast(null)} className="ml-4 p-1 hover:bg-white/10 rounded-full"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Tab Selector */}
      <div className="flex bg-white p-2 rounded-full border border-ceres-mint shadow-lg w-fit mx-auto mb-10 overflow-hidden print:hidden">
         <button 
           onClick={() => setActiveTab('labs')} 
           className={`px-10 py-4 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all ${activeTab === 'labs' ? 'bg-ceres-primary text-white shadow-md' : 'text-slate-400 hover:text-ceres-primary hover:bg-ceres-light'}`}
         >
           Laboratorios y Controles
         </button>
         <button 
           onClick={() => setActiveTab('activity')} 
           className={`px-10 py-4 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all ${activeTab === 'activity' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
         >
           Carnet de Actividad Física
         </button>
      </div>

      {activeTab === 'labs' ? (
        <div className="bg-white rounded-[40px] border border-ceres-mint shadow-2xl overflow-hidden print:shadow-none print:border-none">
          {/* Clinical Header */}
          <div className="bg-ceres-dark p-10 text-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden print:bg-slate-100 print:text-black">
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[28px] flex items-center justify-center border border-white/20 print:bg-slate-200">
                <ShieldCheck className="w-10 h-10 text-white print:text-slate-600" />
              </div>
              <div>
                <h2 className="text-3xl font-serif font-bold">{profile.name} {profile.lastName}</h2>
                <div className="flex gap-4 mt-2">
                   <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-ceres-secondary">ID: {profile.idNumber}</p>
                   <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-ceres-primary">Grupo: {profile.bloodType || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-6 relative z-10 print:hidden">
              <div className="flex flex-col items-center">
                <p className="text-[8px] font-bold text-ceres-secondary uppercase tracking-widest">Latidos Fetal</p>
                <div className="flex items-center gap-2">
                  <Baby className="w-4 h-4 text-ceres-secondary" />
                  <p className="text-xl font-bold">144 <span className="text-[10px] opacity-60">LPM</span></p>
                </div>
              </div>
              <div><p className="text-[8px] font-bold text-ceres-secondary uppercase tracking-widest">Semanas</p><p className="text-xl font-bold">{profile.gestationWeeks}</p></div>
              <div><p className="text-[8px] font-bold text-ceres-secondary uppercase tracking-widest">Riesgo</p><p className="text-xl font-bold text-ceres-primary">{localStorage.getItem('ceres_risk') || 'Bajo'}</p></div>
            </div>
          </div>

          <div className="p-8 md:p-12 border-b border-ceres-mint bg-ceres-light/30">
            <h3 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-4 mb-8"><ClipboardList className="w-8 h-8 text-ceres-primary" />Controles Prenatales (C-N-E-D)</h3>
            <div className="grid grid-cols-1 gap-4">
              {prenatalControls.map((ctrl) => (
                <div key={ctrl.id} className="bg-white p-5 rounded-[28px] border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm group hover:border-ceres-primary transition-all gap-4">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-slate-800 leading-tight block">{ctrl.title}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Control Ceres • Gestión de Documentación</span>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end print:hidden">
                    <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
                      <button onClick={() => handleControlToggle(ctrl.id, 'hasControl')} className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${ctrl.hasControl ? 'bg-ceres-primary border-ceres-primary text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-300'}`}><span className="text-[10px] font-black">C</span></button>
                      <button onClick={() => handleControlToggle(ctrl.id, 'hasNutrition')} className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${ctrl.hasNutrition ? 'bg-orange-400 border-orange-400 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-300'}`}><span className="text-[10px] font-black">N</span></button>
                      <button onClick={() => handleControlToggle(ctrl.id, 'hasExercise')} className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${ctrl.hasExercise ? 'bg-blue-400 border-blue-400 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-300'}`}><span className="text-[10px] font-black">E</span></button>
                    </div>
                    <button 
                      onClick={() => {
                        setSendingDocId(ctrl.id);
                        setTimeout(() => {
                          handleControlToggle(ctrl.id, 'hasDocument');
                          setSendingDocId(null);
                          setShowToast("Documento médico enviado a tu correo.");
                          setTimeout(() => setShowToast(null), 3000);
                        }, 1000);
                      }} 
                      disabled={sendingDocId === ctrl.id}
                      className={`h-9 px-4 rounded-xl flex items-center gap-2 border-2 transition-all ${ctrl.hasDocument ? 'bg-ceres-secondary border-ceres-secondary text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                    >
                      {sendingDocId === ctrl.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileText className="w-3 h-3" />}
                      <span className="text-[9px] font-bold uppercase tracking-widest">Documento</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-10">
            <h3 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-3"><Activity className="w-7 h-7 text-ceres-primary" />Seguimiento de Laboratorios</h3>
            <div className="grid grid-cols-1 gap-6">
              {examSchedule.map((category) => (
                <div key={category.id} className="bg-slate-50 rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
                  <button onClick={() => setExpandedCatId(expandedCatId === category.id ? null : category.id)} className="w-full p-6 flex items-center justify-between hover:bg-slate-100 transition-colors">
                    <div className="text-left space-y-1">
                      <span className="text-lg font-bold text-slate-800 block">{category.title}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{category.subtitle}</span>
                    </div>
                    {expandedCatId === category.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {expandedCatId === category.id && (
                    <div className="p-6 pt-0 divide-y divide-white">
                      {category.exams.map((exam) => (
                        <div key={exam.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <span className="text-sm font-medium text-slate-700">{exam.name}</span>
                          <div className="flex gap-1.5 bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
                            <button onClick={() => handleStatusToggle(category.id, exam.id, 'normal')} className={`px-4 py-1.5 rounded-xl text-[10px] font-black transition-all ${exam.status === 'normal' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-300'}`}>N</button>
                            <button onClick={() => handleStatusToggle(category.id, exam.id, 'abnormal')} className={`px-4 py-1.5 rounded-xl text-[10px] font-black transition-all ${exam.status === 'abnormal' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-300'}`}>AN</button>
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
        /* CARNET VERDE - ACTIVIDAD FÍSICA */
        <div className="bg-white rounded-[40px] border border-emerald-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 max-w-5xl mx-auto">
           {/* Header estilo Carnet Médico Verde */}
           <div className="bg-emerald-600 p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-[6px] border-emerald-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Dumbbell className="w-40 h-40 -rotate-12" />
              </div>
              <div className="space-y-2 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl"><Activity className="w-6 h-6" /></div>
                  <p className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-90">Protocolo Clínico Ceres</p>
                </div>
                <h3 className="text-3xl md:text-4xl font-serif font-black tracking-tight leading-none uppercase italic">
                  CARNET VERDE <br/>
                  <span className="text-emerald-100">PRESCRIPCIÓN DE EJERCICIO</span>
                </h3>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 relative z-10">
                 <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">Estado de Aval</p>
                 <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                    <span className="text-sm font-black uppercase">Física Apta</span>
                 </div>
              </div>
           </div>

           <div className="p-8 md:p-12 space-y-12">
              {/* Resumen del Paciente para la Formula */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100 flex flex-col items-center text-center">
                  <User className="w-5 h-5 text-emerald-600 mb-2" />
                  <p className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">Paciente</p>
                  <p className="text-sm font-bold text-slate-800">{profile.name} {profile.lastName}</p>
                </div>
                <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100 flex flex-col items-center text-center">
                  <Clock className="w-5 h-5 text-emerald-600 mb-2" />
                  <p className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">Gestación</p>
                  <p className="text-sm font-bold text-slate-800">Semana {profile.gestationWeeks}</p>
                </div>
                <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100 flex flex-col items-center text-center">
                  <HeartPulse className="w-5 h-5 text-emerald-600 mb-2" />
                  <p className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">Zona F.C.</p>
                  <p className="text-sm font-bold text-slate-800">{getHRRange()}</p>
                </div>
              </div>

              {/* Módulo de Prescripción (Carnet Verde Original) */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 border-b-2 border-emerald-100 pb-4">
                  <Stethoscope className="w-6 h-6 text-emerald-600" />
                  <h4 className="text-xl font-serif font-black text-slate-800 uppercase">Fórmula de Entrenamiento</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-[32px] border-2 border-emerald-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 bg-emerald-600 text-white p-2 rounded-bl-2xl">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <h5 className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-4">Frecuencia Semanal</h5>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5, 6, 7].map(d => (
                          <div key={d} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${d <= 4 ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300'}`}>{d}</div>
                        ))}
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 mt-3 uppercase">Mínimo sugerido: 3 a 5 días por semana</p>
                    </div>

                    <div className="bg-white p-6 rounded-[32px] border-2 border-emerald-100 shadow-sm relative overflow-hidden">
                       <h5 className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-4">Intensidad Sugerida</h5>
                       <div className="space-y-3">
                         <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
                            <div className="w-1/3 h-full bg-emerald-300"></div>
                            <div className="w-1/3 h-full bg-emerald-500 relative">
                               <div className="absolute -top-1 -right-1 w-6 h-6 bg-white border-4 border-emerald-600 rounded-full"></div>
                            </div>
                            <div className="w-1/3 h-full bg-slate-200"></div>
                         </div>
                         <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>Leve</span>
                            <span className="text-emerald-600">Moderada (Borg 12-14)</span>
                            <span>Vigorosa</span>
                         </div>
                       </div>
                    </div>
                  </div>

                  <div className="bg-emerald-900 rounded-[40px] p-8 text-white space-y-6 relative shadow-xl">
                    <h5 className="text-sm font-black text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-3">
                      <Dumbbell className="w-5 h-5" /> Tipos de Ejercicio
                    </h5>
                    <div className="space-y-4">
                       <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                          <div>
                            <p className="text-sm font-bold leading-none mb-1">Aeróbico (Cardiovascular)</p>
                            <p className="text-[10px] opacity-70 leading-relaxed uppercase">Caminata, natación o elíptica. Sin impacto excesivo.</p>
                          </div>
                       </div>
                       <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                          <div>
                            <p className="text-sm font-bold leading-none mb-1">Fuerza y Resistencia</p>
                            <p className="text-[10px] opacity-70 leading-relaxed uppercase">Pesas livianas, bandas elásticas o propio peso.</p>
                          </div>
                       </div>
                       <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                          <div>
                            <p className="text-sm font-bold leading-none mb-1">Flexibilidad y Estiramiento</p>
                            <p className="text-[10px] opacity-70 leading-relaxed uppercase">Yoga prenatal, estiramientos de cadena posterior.</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cuestionario de Seguridad (Integrado) */}
              <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 space-y-6">
                <div className="flex items-center gap-3">
                   <AlertTriangle className="w-5 h-5 text-amber-500" />
                   <h5 className="text-sm font-black text-slate-700 uppercase tracking-widest">Auto Cuestionario de Seguridad</h5>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questionnaireQuestions.slice(0, 6).map(q => (
                    <div key={q.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <span className="text-[11px] font-bold text-slate-500 leading-tight pr-4">{q.text}</span>
                      <button onClick={() => setQuestionnaire(prev => ({...prev, [q.id]: !prev[q.id]}))} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${questionnaire[q.id] ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-300'}`}>
                        {questionnaire[q.id] ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>
                {hasContraindications && (
                  <div className="bg-rose-500 text-white p-6 rounded-3xl flex items-center gap-4 animate-pulse">
                    <AlertOctagon className="w-8 h-8 shrink-0" />
                    <p className="text-xs font-bold uppercase leading-relaxed">Ha marcado factores de riesgo. Debe consultar con su especialista Ceres antes de iniciar cualquier rutina.</p>
                  </div>
                )}
              </div>

              {/* Recomendaciones Generales Carnet Verde */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
                       <h5 className="text-sm font-black text-slate-800 uppercase tracking-widest">Nutrición & Hidratación</h5>
                    </div>
                    <ul className="space-y-3">
                       {[
                         'No restrinja el consumo de sal.',
                         'Ingiera 300 kcal extras al día.',
                         '6 a 8 vasos de agua diarios.',
                         'Hidratar antes, durante y después.'
                       ].map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            {item}
                         </li>
                       ))}
                    </ul>
                 </div>
                 <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <Wind className="w-5 h-5 text-emerald-600" />
                       <h5 className="text-sm font-black text-slate-800 uppercase tracking-widest">Signos de Alarma</h5>
                    </div>
                    <ul className="space-y-3">
                       {[
                         'Falta de aliento excesiva.',
                         'Contracciones dolorosas (>6/hora).',
                         'Sangrado o pérdida de líquido.',
                         'Dolor de cabeza o visión borrosa.'
                       ].map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-[11px] font-bold text-rose-500 uppercase tracking-tight">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                            {item}
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>
           </div>
           
           {/* Footer con Sello Médico */}
           <div className="px-8 md:px-12 py-10 bg-emerald-50 border-t border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex items-center gap-5">
                 <div className="w-20 h-20 bg-white rounded-full border-4 border-emerald-200 flex flex-col items-center justify-center text-center shadow-lg relative">
                    <p className="text-[6px] font-black text-emerald-800 leading-none">AVALADO <br/> SISTEMA</p>
                    <p className="text-[10px] font-black text-emerald-900 leading-none mt-0.5 tracking-tighter">CERES</p>
                    <ShieldCheck className="absolute -bottom-1 -right-1 w-6 h-6 text-emerald-600 fill-white" />
                 </div>
                 <div>
                    <p className="text-xs font-black text-emerald-900 uppercase">Carnet de Control de Ejercicio</p>
                    <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest mt-0.5">Vigencia: Todo el periodo gestacional</p>
                 </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                 <button 
                  onClick={handlePortarCarnet}
                  disabled={isExporting}
                  className="w-full md:w-auto bg-emerald-700 hover:bg-emerald-900 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-3 group"
                >
                  {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                  Exportar Carnet Verde
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Footer Print Info */}
      <div className="hidden print:block text-center mt-20 pt-10 border-t border-slate-200">
         <p className="text-sm font-serif font-bold text-slate-800 italic">"Ceres - Tu acompañamiento clínico experto en salud y bienestar materno."</p>
         <p className="text-[10px] text-slate-400 mt-2">Reporte Digital Certificado - Sistema Ceres Mujer {new Date().getFullYear()}</p>
         <p className="text-[8px] text-slate-300 mt-1 uppercase">Cra 45 N° 6- 95, Medellín, Barrio Patio Bonito | Tel: 2662783</p>
      </div>
    </div>
  );
};

export default VirtualCard;

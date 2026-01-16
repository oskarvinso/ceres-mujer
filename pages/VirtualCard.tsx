
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
  Edit3
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
  },
  {
    id: 'cat3',
    title: 'Exámenes Semanas 32 a 36',
    exams: [
      { id: 'e30', name: 'HG y HCTO', status: 'pending' },
      { id: 'e31', name: 'VDRL', status: 'pending' },
      { id: 'e32', name: 'HIV', status: 'pending' },
      { id: 'e33', name: 'Ecografía Obstétrica', status: 'pending' },
      { id: 'e34', name: 'Monitoreo fetal', status: 'pending' },
      { id: 'e35', name: 'Perfil Biofísico', status: 'pending' },
      { id: 'e36', name: 'Uroanalisis', status: 'pending' },
      { id: 'e37', name: 'Grupo Streptococo grupo B (35-37)', status: 'pending' },
      { id: 'e38', name: 'IFI CHALAMIDIA', status: 'pending' },
    ]
  },
  {
    id: 'cat4',
    title: 'Exámenes Opcionales',
    exams: [
      { id: 'e40', name: 'GOTA GRUESA', status: 'pending' },
      { id: 'e41', name: 'Trombofilia (Homociteinemia, etc)', status: 'pending' },
      { id: 'e42', name: 'Coprologico', status: 'pending' },
      { id: 'e43', name: 'Coombs Directo', status: 'pending' },
      { id: 'e44', name: 'Electrocardiograma', status: 'pending' },
      { id: 'e45', name: 'Ecocardiograma', status: 'pending' },
      { id: 'e46', name: 'Prueba de tuberculina', status: 'pending' },
      { id: 'e47', name: 'Hemoglobina Glicosilada HbA1C', status: 'pending' },
      { id: 'e48', name: 'Curva de tolerancia Glucos 75g', status: 'pending' },
      { id: 'e49', name: 'Niveles de Ácido Folico', status: 'pending' },
      { id: 'e50', name: 'Proteinuria en 24 horas', status: 'pending' },
    ]
  }
];

const INITIAL_CONTROLS: PrenatalControlTrack[] = [
  { id: 'c1', title: '1. Como crece tu bebé durante el embarazo', hasControl: false, hasNutrition: false, hasExercise: false, completed: false },
  { id: 'c2', title: '2. Molestias comunes en tu embarazo', hasControl: false, hasNutrition: false, hasExercise: false, completed: false },
  { id: 'c3', title: '3. ¿Crees tener problemas genéticos?', hasControl: false, hasNutrition: false, hasExercise: false, completed: false },
  { id: 'c4', title: '4. Postura en el embarazo', hasControl: false, hasNutrition: false, hasExercise: false, completed: false },
  { id: 'c5', title: '5. Mamá activa mas esperanza de vida', hasControl: false, hasNutrition: false, hasExercise: false, completed: false },
  { id: 'c6', title: '6. Relación mente cerebro y parto prematuro', hasControl: false, hasNutrition: false, hasExercise: false, completed: false },
  { id: 'c7', title: '7. Factor RH y sexualidad', hasControl: false, hasNutrition: false, hasExercise: false, completed: false },
  { id: 'c8', title: '8. Prepara tu parto', hasControl: false, hasNutrition: false, hasExercise: false, completed: false },
  { id: 'c9', title: '9. Vence el dolor', hasControl: false, hasNutrition: false, hasExercise: false, completed: false },
  { id: 'c10', title: '10. Vía del parto', hasControl: false, hasNutrition: false, hasExercise: false, completed: false },
];

const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const VirtualCard: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [examSchedule, setExamSchedule] = useState<ExamCategory[]>([]);
  const [prenatalControls, setPrenatalControls] = useState<PrenatalControlTrack[]>([]);
  const [expandedCatId, setExpandedCatId] = useState<string | null>('cat1');

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

  const handleValueChange = (catId: string, examId: string, val: string) => {
    const updated = examSchedule.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          exams: cat.exams.map(ex => {
            if (ex.id === examId) return { ...ex, resultValue: val };
            return ex;
          })
        };
      }
      return cat;
    });
    setExamSchedule(updated);
    saveUpdates(updated, prenatalControls);
  };

  const handleControlToggle = (controlId: string, field: 'hasControl' | 'hasNutrition' | 'hasExercise') => {
    const updated = prenatalControls.map(c => {
      if (c.id === controlId) {
        return { ...c, [field]: !c[field] };
      }
      return c;
    });
    setPrenatalControls(updated);
    saveUpdates(examSchedule, updated);
  };

  const handleBloodTypeChange = (bt: string) => {
    if (profile) {
      const updated = examSchedule.map(cat => {
        if (cat.id === 'cat1') {
          return {
            ...cat,
            exams: cat.exams.map(ex => {
              if (ex.id === 'e1') return { ...ex, status: 'normal' as const, resultValue: bt };
              return ex;
            })
          };
        }
        return cat;
      });
      setExamSchedule(updated);
      saveUpdates(updated, prenatalControls, bt);
    }
  };

  const abnormalExams = examSchedule.flatMap(cat => 
    cat.exams.filter(ex => ex.status === 'abnormal').map(ex => ({ ...ex, catId: cat.id }))
  );

  if (!profile) return (
    <div className="flex items-center justify-center h-screen text-slate-400 font-bold uppercase tracking-widest text-xs">
      Cargando Carnet Ceres...
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-700 pb-24">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-ceres-mint text-ceres-primary rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
          <Fingerprint className="w-4 h-4" />
          Protocolo Médico Ceres Digital
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight">Carnet Prenatal Virtual</h1>
        <p className="text-slate-500 font-medium">Control unificado de salud, nutrición y laboratorios.</p>
      </header>

      <div className="bg-white rounded-[40px] border border-ceres-mint shadow-2xl overflow-hidden relative">
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
            <div>
              <p className="text-[8px] font-bold text-ceres-secondary uppercase tracking-widest">Semanas</p>
              <p className="text-xl font-bold">{profile.gestationWeeks}</p>
            </div>
            <div>
              <p className="text-[8px] font-bold text-ceres-secondary uppercase tracking-widest">Riesgo</p>
              <p className="text-xl font-bold text-ceres-primary">{localStorage.getItem('ceres_risk') || 'Bajo'}</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 border-b border-ceres-mint bg-ceres-light/30">
          <div className="flex items-center gap-4 mb-8">
            <ClipboardList className="w-8 h-8 text-ceres-primary" />
            <div>
              <h3 className="text-2xl font-serif font-bold text-slate-800">Controles Prenatales</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Seguimiento C - N - E</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prenatalControls.map((ctrl) => (
              <div key={ctrl.id} className="bg-white p-5 rounded-[24px] border border-slate-100 flex items-center justify-between shadow-sm group hover:border-ceres-primary transition-all">
                <span className="text-xs font-bold text-slate-700 pr-4 leading-tight">{ctrl.title}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => handleControlToggle(ctrl.id, 'hasControl')}
                    className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${ctrl.hasControl ? 'bg-ceres-primary border-ceres-primary text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-300'}`}
                    title="Control Médico (C)"
                  >
                    <span className="text-[9px] font-black">C</span>
                    {ctrl.hasControl && <Check className="w-2 h-2" />}
                  </button>
                  <button 
                    onClick={() => handleControlToggle(ctrl.id, 'hasNutrition')}
                    className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${ctrl.hasNutrition ? 'bg-orange-400 border-orange-400 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-300'}`}
                    title="Nutrición (N)"
                  >
                    <span className="text-[9px] font-black">N</span>
                    {ctrl.hasNutrition && <Check className="w-2 h-2" />}
                  </button>
                  <button 
                    onClick={() => handleControlToggle(ctrl.id, 'hasExercise')}
                    className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${ctrl.hasExercise ? 'bg-blue-400 border-blue-400 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-300'}`}
                    title="Ejercicio (E)"
                  >
                    <span className="text-[9px] font-black">E</span>
                    {ctrl.hasExercise && <Check className="w-2 h-2" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-3">
              <Activity className="w-7 h-7 text-ceres-primary" />
              Checklist de Laboratorio
            </h3>
            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> N: Normal</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Anor: Anormal</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {examSchedule.map((category) => (
              <div key={category.id} className="bg-slate-50 rounded-[32px] border border-slate-100 overflow-hidden">
                <button 
                  onClick={() => setExpandedCatId(expandedCatId === category.id ? null : category.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-slate-100 transition-colors"
                >
                  <div className="text-left">
                    <span className="text-lg font-bold text-slate-800">{category.title}</span>
                    {category.subtitle && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{category.subtitle}</p>}
                  </div>
                  {expandedCatId === category.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                {expandedCatId === category.id && (
                  <div className="p-6 pt-0 divide-y divide-white/60">
                    {category.exams.map((exam) => (
                      <div key={exam.id} className="py-5 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-700">{exam.name}</span>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-100">
                              <button 
                                onClick={() => handleStatusToggle(category.id, exam.id, 'normal')}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 ${exam.status === 'normal' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-300 hover:text-emerald-500'}`}
                              >
                                {exam.status === 'normal' && <Check className="w-3 h-3" />} N
                              </button>
                              <button 
                                onClick={() => handleStatusToggle(category.id, exam.id, 'abnormal')}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 ${exam.status === 'abnormal' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-300 hover:text-rose-500'}`}
                              >
                                {exam.status === 'abnormal' && <Check className="w-3 h-3" />} ANOR
                              </button>
                            </div>
                          </div>
                        </div>

                        {exam.id === 'e1' && (
                          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                            {BLOOD_TYPES.map(bt => (
                              <button 
                                key={bt} 
                                onClick={() => handleBloodTypeChange(bt)}
                                className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${profile.bloodType === bt ? 'bg-ceres-primary border-ceres-primary text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:bg-ceres-mint'}`}
                              >
                                {bt}
                              </button>
                            ))}
                          </div>
                        )}

                        {(exam.status === 'abnormal' || exam.resultValue) && exam.id !== 'e1' && (
                          <div className="relative animate-in slide-in-from-top-2">
                            <Edit3 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ceres-primary" />
                            <input 
                              type="text" 
                              placeholder="Ingresar valor o hallazgo médico..." 
                              className="w-full pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-ceres-mint text-sm font-medium"
                              value={exam.resultValue || ''}
                              onChange={(e) => handleValueChange(category.id, exam.id, e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {abnormalExams.length > 0 && (
          <div className="p-8 md:p-12 bg-rose-50/50 border-t border-rose-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-rose-900">Seguimiento Hallazgos Anormales</h3>
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Atención prioritaria Ceres</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {abnormalExams.map((ex) => (
                <div key={ex.id} className="bg-white p-6 rounded-[32px] border border-rose-100 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-slate-800">{ex.name}</p>
                    <span className="px-3 py-1 bg-rose-100 text-rose-500 text-[9px] font-black rounded-full uppercase">Alerta</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Valor/Hallazgo:</p>
                    <p className="text-sm font-medium text-rose-900">{ex.resultValue || 'Pendiente de registrar valor...'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-10 bg-slate-50 border-t border-ceres-mint text-center space-y-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] max-w-md mx-auto leading-relaxed">
            Toda información registrada aquí es procesada para tu seguimiento gestacional en Ceres.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button className="bg-ceres-primary hover:bg-ceres-dark text-white px-10 py-5 rounded-3xl font-bold tracking-widest text-[10px] transition-all shadow-xl shadow-ceres-primary/20">
              DESCARGAR PDF PARA EL DOCTOR
            </button>
            <button className="bg-white border-2 border-ceres-primary text-ceres-primary px-10 py-5 rounded-3xl font-bold tracking-widest text-[10px] transition-all hover:bg-ceres-mint">
              COMPARTIR CON MI OBSTETRA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualCard;

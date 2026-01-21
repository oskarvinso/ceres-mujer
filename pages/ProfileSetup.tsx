
import React, { useState, useMemo, useEffect } from 'react';
import { User, Phone, MapPin, Calendar, ArrowRight, ShieldCheck, Mail, Scale, ClipboardList, Navigation, Activity, Info, Baby, Check, AlertCircle, UserPlus, UserCheck, RefreshCcw, Dumbbell, Heart, Stethoscope } from 'lucide-react';
import { UserProfile, RiskFactors, ExamCategory, PrenatalControlTrack } from '../types.ts';
import { Logo } from '../App.tsx';

interface ProfileSetupProps {
  onComplete: () => void;
}

const COLOMBIA_DATA: Record<string, string[]> = {
  "Antioquia": ["Medellín", "Envigado", "Itagüí", "Rionegro", "Bello", "Apartadó", "San Roque", "Ituango"],
  "Atlántico": ["Barranquilla", "Soledad", "Puerto Colombia", "Sabanalarga"],
  "Bogotá D.C.": ["Bogotá D.C."],
  "Bolívar": ["Cartagena", "Magangué", "Turbaco"],
  "Caldas": ["Manizales", "Villamaría", "Chinchiná"],
  "Cundinamarca": ["Soacha", "Chía", "Zipaquirá", "Facatativá", "Fusagasugá"],
  "Quindío": ["Armenia", "Calarcá", "Circasia"],
  "Risaralda": ["Pereira", "Dosquebradas", "Santa Rosa de Cabal"],
  "Santander": ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta"],
  "Valle del Cauca": ["Cali", "Palmira", "Tuluá", "Buenaventura", "Buga"]
};

const VILLAGE_DATA: Record<string, string[]> = {
  "San Roque": ["Cabecera Municipal", "Cristales", "Providencia", "San José", "La Bodega", "El Porvenir", "Playa Rica", "Santa Isabel", "Guacharacas"],
  "Ituango": ["Cabecera Municipal", "Santa Rita", "La Granja", "El Aro", "El Cedral", "Santa Ana", "Pascuitá", "Badillo", "La Camelia", "San Jorge"]
};

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0); 
  const [geocoding, setGeocoding] = useState(false);
  const [isClassified, setIsClassified] = useState(false);
  const [isNewPatient, setIsNewPatient] = useState(true);

  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    lastName: '',
    documentType: 'CC',
    idNumber: '',
    age: 25,
    civilStatus: 'SOLTERA',
    occupation: 'EMPLEADA',
    education: 'UNIVERSIDAD',
    email: '',
    phone: '',
    department: '',
    municipality: '',
    village: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    edd: '',
    gestationWeeks: 0,
    height: 160,
    initialWeight: 60,
    initialIMC: 23.4,
    weightGoal: { min: 11.5, max: 16, category: 'Peso Normal' },
    riskFactors: {
      sociodemographic: { age15_19: false, ageOver36: false, ageUnder15: false, lowSocioeconomic: false, workRisk: false, smoking: false, alcoholism: false, psychoactiveActive: false, multipara: false },
      medical: { 
        noRiskFactors: false, 
        hypertensionChronic: false, 
        hypertensionGestational: false, 
        diabetesPreexisting: false, 
        diabetesGestational: false, 
        obesityIMC30_34: false, 
        obesityIMC35_40: false, 
        lowWeightIMC20: false, 
        renalPathology: false, 
        cardiacPathology: false, 
        thyroidPathology: false, 
        asthmaControlled: false, 
        epilepsy: false, 
        hiv_syphilis: false, 
        cancerRemission: false, 
        mentalHealthHistory: false,
        herpesHistory: false,
        drugAllergies: false,
        infertilityHistory: false,
        cytologyAlterations: false,
        liverPathology: false,
        anemia: false,
        myomas: false,
        recurrentUrinaryInfection: false
      },
      reproductive: { previousAbortion2_plus: false, previousPretermBirth: false, previousPreeclampsia: false, previousCsection1_2: false, incompetenceCervical: false, ectopicHistory: false, uterineSurgery: false },
      currentPregnancy: { 
        noObstetricRiskFactors: false, 
        multiplePregnancy: false, 
        threatenedAbortion: false, 
        threatenedPreterm: false, 
        rciu: false, 
        poly_oligohydramnios: false, 
        hemorrhage: false, 
        perinatalInfection: false,
        placentaPrevia: false,
        amnioticFluidAlteration: false,
        urinaryInfection: false,
        congenitalDefect: false
      }
    }
  });

  const handleEntryMode = (isNew: boolean) => {
    setIsNewPatient(isNew);
    if (!isNew) {
      const savedProfile = localStorage.getItem('ceres_profile');
      if (savedProfile) {
        setFormData(JSON.parse(savedProfile));
      }
    }
    setStep(1);
  };

  const handleEddChange = (eddValue: string) => {
    let calculatedWeeks = 0;
    if (eddValue) {
      const eddDate = new Date(eddValue);
      const today = new Date();
      const diffTime = eddDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weeksLeft = diffDays / 7;
      calculatedWeeks = Math.max(0, Math.floor(40 - weeksLeft));
    }
    setFormData(prev => ({ ...prev, edd: eddValue, gestationWeeks: calculatedWeeks }));
  };

  const determineRiskLevel = () => {
    const rf = formData.riskFactors;
    const age = formData.age;

    const isHighRisk = 
      (age >= 15 && age <= 19) ||
      (age >= 36) ||
      rf.sociodemographic.ageUnder15 ||
      rf.sociodemographic.multipara ||
      rf.sociodemographic.smoking ||
      rf.sociodemographic.alcoholism ||
      rf.medical.hypertensionChronic ||
      rf.medical.hypertensionGestational ||
      rf.medical.diabetesPreexisting ||
      rf.medical.diabetesGestational ||
      rf.medical.obesityIMC35_40 ||
      rf.medical.lowWeightIMC20 ||
      rf.medical.renalPathology ||
      rf.medical.cardiacPathology ||
      rf.medical.epilepsy ||
      rf.medical.cancerRemission ||
      rf.medical.hiv_syphilis ||
      rf.medical.mentalHealthHistory ||
      rf.medical.herpesHistory ||
      rf.medical.liverPathology ||
      rf.medical.thyroidPathology ||
      rf.medical.infertilityHistory ||
      rf.medical.cytologyAlterations ||
      rf.medical.anemia ||
      rf.medical.myomas ||
      rf.medical.recurrentUrinaryInfection ||
      rf.reproductive.previousAbortion2_plus ||
      rf.reproductive.previousPretermBirth ||
      rf.reproductive.previousPreeclampsia ||
      rf.reproductive.previousCsection1_2 ||
      rf.reproductive.incompetenceCervical ||
      rf.reproductive.ectopicHistory ||
      rf.currentPregnancy.multiplePregnancy ||
      rf.currentPregnancy.threatenedAbortion ||
      rf.currentPregnancy.threatenedPreterm ||
      rf.currentPregnancy.rciu ||
      rf.currentPregnancy.poly_oligohydramnios ||
      rf.currentPregnancy.hemorrhage ||
      rf.currentPregnancy.placentaPrevia ||
      rf.currentPregnancy.amnioticFluidAlteration ||
      rf.currentPregnancy.urinaryInfection ||
      rf.currentPregnancy.congenitalDefect;

    return isHighRisk ? 'Alto' : 'Bajo';
  };

  const handleNext = () => {
    if (step < 6) {
      if (step === 4) {
        const heightM = formData.height / 100;
        const imcValue = formData.initialWeight / (heightM * heightM);
        let goalObj = { min: 11.5, max: 16, category: 'Normal' };
        if (imcValue < 18.5) goalObj = { min: 12.5, max: 18, category: 'Bajo Peso' };
        else if (imcValue >= 25 && imcValue < 30) goalObj = { min: 7, max: 11.5, category: 'Sobrepeso' };
        else if (imcValue >= 30) goalObj = { min: 5, max: 9, category: 'Obesidad' };
        
        setFormData(prev => ({ 
          ...prev, 
          initialIMC: parseFloat(imcValue.toFixed(1)), 
          weightGoal: goalObj 
        }));
      }
      setStep(step + 1);
    } else {
      const finalRisk = determineRiskLevel();
      localStorage.setItem('ceres_profile', JSON.stringify(formData));
      localStorage.setItem('ceres_risk', finalRisk);
      onComplete();
    }
  };

  const toggleRF = (cat: keyof RiskFactors, field: string) => {
    setFormData(prev => {
      const newCategoryState = { ...(prev.riskFactors[cat] as any) };
      const newValue = !newCategoryState[field];
      newCategoryState[field] = newValue;

      if (cat === 'medical' && field === 'noRiskFactors' && newValue) {
        Object.keys(newCategoryState).forEach(key => { if (key !== 'noRiskFactors') newCategoryState[key] = false; });
        const newReproductiveState = { ...prev.riskFactors.reproductive };
        Object.keys(newReproductiveState).forEach(key => { (newReproductiveState as any)[key] = false; });
        return { ...prev, riskFactors: { ...prev.riskFactors, medical: newCategoryState, reproductive: newReproductiveState } };
      } 
      else if (cat === 'currentPregnancy' && field === 'noObstetricRiskFactors' && newValue) {
        Object.keys(newCategoryState).forEach(key => { if (key !== 'noObstetricRiskFactors') newCategoryState[key] = false; });
        return { ...prev, riskFactors: { ...prev.riskFactors, currentPregnancy: newCategoryState } };
      }
      else if (newValue && field !== 'noRiskFactors' && field !== 'noObstetricRiskFactors') {
        const resetMedical = cat === 'medical' || cat === 'reproductive' ? { ...prev.riskFactors.medical, noRiskFactors: false } : prev.riskFactors.medical;
        const resetObstetric = cat === 'currentPregnancy' ? { ...prev.riskFactors.currentPregnancy, noObstetricRiskFactors: false } : prev.riskFactors.currentPregnancy;
        
        return {
          ...prev,
          riskFactors: {
            ...prev.riskFactors,
            medical: resetMedical,
            currentPregnancy: resetObstetric,
            [cat]: { ...(prev.riskFactors[cat] as any), [field]: newValue }
          }
        };
      }

      return {
        ...prev,
        riskFactors: {
          ...prev.riskFactors,
          [cat]: newCategoryState
        }
      };
    });
  };

  const isStep1Invalid = !formData.name || !formData.lastName || !formData.idNumber || !formData.phone || !formData.email || !formData.address || !formData.department || !formData.municipality;

  // Village logic
  const villagesForMunicipality = formData.municipality ? VILLAGE_DATA[formData.municipality] : null;

  return (
    <div className="min-h-screen bg-ceres-light flex items-center justify-center p-4 md:p-8">
      <div className="max-w-6xl w-full bg-white rounded-[40px] shadow-2xl border border-white overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto">
        <div className="md:w-1/3 bg-ceres-dark p-10 text-white flex flex-col justify-between">
          <div className="space-y-8">
            <div className="flex flex-col items-center gap-2 p-6 bg-white rounded-[32px] shadow-lg">
               <Logo className="h-20" />
            </div>
            
            <div className="space-y-4 pt-4">
              {[
                { n: 1, label: 'Identificación' },
                { n: 2, label: 'Antecedentes Médicos' },
                { n: 3, label: 'Factores de Riesgo' },
                { n: 4, label: 'Biometría y Metas' },
                { n: 5, label: 'Carnet Digital' },
                { n: 6, label: 'Actividad Física' }
              ].map(s => (
                <div key={s.n} className={`flex items-center gap-4 transition-all duration-500 ${step === s.n ? 'translate-x-2' : 'opacity-40'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${step === s.n ? 'bg-ceres-primary border-ceres-primary' : 'border-white'}`}>{s.n}</div>
                  <span className="text-[9px] font-bold uppercase tracking-widest">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[9px] text-ceres-mint leading-relaxed italic opacity-60 text-center">
            Acompañamiento clínico integral Ceres <br/> Ginecología y Obstetricia
          </p>
        </div>

        <div className="md:w-2/3 p-8 md:p-14 overflow-y-auto">
          {step === 0 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col justify-center">
              <div className="text-center space-y-4">
                <h3 className="text-4xl font-serif font-bold text-slate-800">Bienvenida a Ceres</h3>
                <p className="text-slate-500 font-medium">Protocolo de ingreso para el acompañamiento gestacional integral.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <button onClick={() => handleEntryMode(true)} className="group p-10 bg-white border-2 border-slate-100 rounded-[40px] hover:border-ceres-primary hover:bg-ceres-mint transition-all text-center space-y-6 shadow-sm hover:shadow-xl">
                  <div className="w-20 h-20 bg-ceres-primary/10 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform"><UserPlus className="w-10 h-10 text-ceres-primary" /></div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-slate-800">Paciente Nueva</h4>
                    <p className="text-xs text-slate-500 font-medium px-4">Inicia tu historial clínico unificado Ceres.</p>
                  </div>
                </button>
                <button onClick={() => handleEntryMode(false)} className="group p-10 bg-white border-2 border-slate-100 rounded-[40px] hover:border-ceres-primary hover:bg-ceres-mint transition-all text-center space-y-6 shadow-sm hover:shadow-xl">
                  <div className="w-20 h-20 bg-ceres-secondary/20 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform"><UserCheck className="w-10 h-10 text-ceres-secondary" /></div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-slate-800">Paciente Registrada</h4>
                    <p className="text-xs text-slate-500 font-medium px-4">Actualiza tu estado y conserva datos previos.</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-10">
              <h3 className="text-3xl font-serif font-bold text-slate-800">Identificación y Ubicación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nombres Completos</label>
                  <input type="text" className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-ceres-primary" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Apellidos</label>
                  <input type="text" className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-ceres-primary" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tipo</label>
                    <select className="w-full px-3 py-4 bg-slate-50 rounded-2xl outline-none" value={formData.documentType} onChange={e => setFormData({...formData, documentType: e.target.value as any})}><option value="CC">CC</option><option value="CE">CE</option><option value="TI">TI</option></select>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Número</label>
                    <input type="text" className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-ceres-primary" value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Edad Actual</label>
                  <input type="number" className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none" value={formData.age} onChange={e => setFormData({...formData, age: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Departamento</label>
                  <select className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value, municipality: '', village: ''})}><option value="">Seleccione...</option>{Object.keys(COLOMBIA_DATA).map(d => <option key={d} value={d}>{d}</option>)}</select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Municipio</label>
                  <select className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none" value={formData.municipality} onChange={e => setFormData({...formData, municipality: e.target.value, village: ''})} disabled={!formData.department}><option value="">Seleccione...</option>{formData.department && COLOMBIA_DATA[formData.department].map(m => <option key={m} value={m}>{m}</option>)}</select>
                </div>

                {/* Village / Vereda Field */}
                <div className="col-span-1 md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vereda / Corregimiento / Barrio</label>
                  {villagesForMunicipality ? (
                    <select className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-ceres-primary" value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})}>
                      <option value="">Seleccione zona...</option>
                      {villagesForMunicipality.map(v => <option key={v} value={v}>{v}</option>)}
                      <option value="OTRA">Otra vereda...</option>
                    </select>
                  ) : (
                    <input type="text" className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-ceres-primary" value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})} placeholder="Ingrese vereda o barrio" />
                  )}
                </div>

                <div className="col-span-1 md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dirección / Referencia de Ubicación</label>
                  <input type="text" className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-ceres-primary" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Ej: Calle 123 #45-67 o nombre de finca" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Correo</label>
                  <input type="email" className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Teléfono</label>
                  <input type="tel" className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-10">
              <h3 className="text-3xl font-serif font-bold text-slate-800">Antecedentes Médicos</h3>
              <div className="p-6 bg-ceres-mint rounded-3xl border border-ceres-primary/10 mb-4 cursor-pointer" onClick={() => toggleRF('medical', 'noRiskFactors')}>
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${formData.riskFactors.medical.noRiskFactors ? 'bg-ceres-primary border-ceres-primary text-white shadow-lg' : 'border-ceres-primary/20'}`}>{formData.riskFactors.medical.noRiskFactors && <Check className="w-5 h-5" />}</div>
                  <div><span className="font-bold text-slate-800 block">Sin factores de riesgo médico</span></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { c: 'medical', f: 'hypertensionChronic', l: 'Hipertensión Crónica' }, 
                  { c: 'medical', f: 'diabetesPreexisting', l: 'Diabetes Mellitus' }, 
                  { c: 'medical', f: 'herpesHistory', l: 'Antecedentes de Herpes' },
                  { c: 'medical', f: 'drugAllergies', l: 'Alergia Medicamentos' },
                  { c: 'medical', f: 'anemia', l: 'Anemia' },
                  { c: 'medical', f: 'myomas', l: 'Miomas' },
                  { c: 'medical', f: 'recurrentUrinaryInfection', l: 'Infección Urinaria Recurrente' },
                  { c: 'medical', f: 'infertilityHistory', l: 'Infertilidad' },
                  { c: 'medical', f: 'mentalHealthHistory', l: 'Enf. Psiquiátricas' },
                  { c: 'medical', f: 'cytologyAlterations', l: 'Alteraciones Citología' },
                  { c: 'medical', f: 'epilepsy', l: 'Epilepsia' },
                  { c: 'medical', f: 'liverPathology', l: 'Hepatopatías' },
                  { c: 'medical', f: 'thyroidPathology', l: 'Trastornos Tiroides' },
                  { c: 'reproductive', f: 'previousAbortion2_plus', l: '2+ Abortos Previos' }, 
                  { c: 'reproductive', f: 'previousPreeclampsia', l: 'Preeclampsia previa' }
                ].map(item => (
                  <label key={item.f} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer border transition-all ${(formData.riskFactors[item.c as keyof RiskFactors] as any)[item.f] ? 'bg-ceres-mint border-ceres-primary' : 'bg-slate-50 border-transparent'} ${formData.riskFactors.medical.noRiskFactors ? 'opacity-40 pointer-events-none' : ''}`}>
                    <input type="checkbox" className="w-5 h-5 accent-ceres-primary" checked={(formData.riskFactors[item.c as keyof RiskFactors] as any)[item.f]} onChange={() => toggleRF(item.c as keyof RiskFactors, item.f)} />
                    <span className="text-[11px] font-bold text-slate-700 leading-tight">{item.l}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-10">
              <h3 className="text-3xl font-serif font-bold text-slate-800">Factores de Riesgo Obstétrico</h3>
              <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100 mb-4 cursor-pointer" onClick={() => toggleRF('currentPregnancy', 'noObstetricRiskFactors')}>
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${formData.riskFactors.currentPregnancy.noObstetricRiskFactors ? 'bg-rose-500 border-rose-500 text-white' : 'border-rose-200'}`}>{formData.riskFactors.currentPregnancy.noObstetricRiskFactors && <Check className="w-5 h-5" />}</div>
                  <span className="font-bold text-rose-900 block">Sin factores de riesgo obstétrico</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { c: 'currentPregnancy', f: 'multiplePregnancy', l: 'Embarazo Múltiple' }, 
                  { c: 'currentPregnancy', f: 'threatenedPreterm', l: 'Amenaza Parto Pretérmino' }, 
                  { c: 'currentPregnancy', f: 'hemorrhage', l: 'Hemorragia Gestacional' }, 
                  { c: 'currentPregnancy', f: 'placentaPrevia', l: 'Placenta Previa' },
                  { c: 'currentPregnancy', f: 'amnioticFluidAlteration', l: 'Alteración Líquido Amniótico' },
                  { c: 'currentPregnancy', f: 'urinaryInfection', l: 'Infección Urinaria' },
                  { c: 'currentPregnancy', f: 'congenitalDefect', l: 'Defecto Fetal Congénito' },
                  { c: 'currentPregnancy', f: 'rciu', l: 'Retardo Crecimiento (RCIU)' },
                  { c: 'medical', f: 'diabetesGestational', l: 'Diabetes Gestacional' }
                ].map(item => (
                  <label key={item.f} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer border transition-all ${(formData.riskFactors[item.c as keyof RiskFactors] as any)[item.f] ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-transparent'} ${formData.riskFactors.currentPregnancy.noObstetricRiskFactors ? 'opacity-40 pointer-events-none' : ''}`}>
                    <input type="checkbox" className="w-5 h-5 accent-rose-500" checked={(formData.riskFactors[item.c as keyof RiskFactors] as any)[item.f]} onChange={() => toggleRF(item.c as keyof RiskFactors, item.f)} />
                    <span className="text-[11px] font-bold text-slate-700 leading-tight">{item.l}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-10">
              <h3 className="text-3xl font-serif font-bold text-slate-800">Biometría y Metas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-3xl space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-ceres-primary">Peso Inicial (kg)</label>
                  <input type="number" step="0.1" className="bg-transparent text-3xl font-serif font-bold text-slate-800 outline-none w-full" value={formData.initialWeight} onChange={e => setFormData({...formData, initialWeight: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-ceres-primary">Talla (cm)</label>
                  <input type="number" className="bg-transparent text-3xl font-serif font-bold text-slate-800 outline-none w-full" value={formData.height} onChange={e => setFormData({...formData, height: parseInt(e.target.value) || 0})} />
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-ceres-primary">Fecha Probable Parto</label>
                  <input type="date" className="bg-transparent text-xl font-bold text-slate-800 outline-none w-full" value={formData.edd} onChange={e => handleEddChange(e.target.value)} />
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-ceres-primary">Semanas Actuales</label>
                  <div className="text-3xl font-serif font-bold text-slate-800">{formData.gestationWeeks}</div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-ceres-primary rounded-2xl flex items-center justify-center text-white shadow-lg"><ClipboardList className="w-6 h-6" /></div>
                <h3 className="text-3xl font-serif font-bold text-slate-800">Carnet Digital Ceres</h3>
              </div>
              <p className="text-slate-500 font-medium">Este es tu registro unificado de salud. Aquí se marcarán tus 10 controles prenatales (C-N-E) y laboratorios.</p>
              <div className="p-8 bg-ceres-mint/30 rounded-[40px] border border-ceres-primary/10">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-8 h-8 bg-ceres-primary rounded-xl flex items-center justify-center text-white"><Check className="w-4 h-4" /></div>
                   <p className="text-sm font-bold text-slate-700 uppercase tracking-widest">Protocolo Médico Ceres Activado</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">C</span>
                    <span className="text-[9px] text-slate-600">Control</span>
                  </div>
                  <div className="text-center p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">N</span>
                    <span className="text-[9px] text-slate-600">Nutrición</span>
                  </div>
                  <div className="text-center p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">E</span>
                    <span className="text-[9px] text-slate-600">Ejercicio</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-ceres-secondary rounded-2xl flex items-center justify-center text-white shadow-lg"><Dumbbell className="w-6 h-6" /></div>
                <h3 className="text-3xl font-serif font-bold text-slate-800">Actividad Física en Embarazo</h3>
              </div>
              <div className="bg-white p-8 rounded-[40px] border border-ceres-secondary/20 shadow-sm space-y-6">
                <h4 className="text-sm font-bold text-ceres-dark uppercase tracking-widest border-b border-ceres-mint pb-4">Prescripción de Ejercicio</h4>
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-slate-600">Mamá Deportista / Activa</span>
                     <div className="w-10 h-10 bg-ceres-mint rounded-xl flex items-center justify-center"><Check className="w-5 h-5 text-ceres-primary" /></div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-bold text-ceres-primary uppercase block">Aeróbico</span>
                        <span className="text-[9px] text-slate-500">2 a 3 veces/semana</span>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-bold text-ceres-secondary uppercase block">Fuerza</span>
                        <span className="text-[9px] text-slate-500">Propios límites</span>
                     </div>
                   </div>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
                   <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                   <p className="text-[9px] font-bold text-amber-900 leading-relaxed uppercase tracking-wide">
                     CONSULTE A SU MÉDICO ANTES DE AUMENTAR SU NIVEL DE ACTIVIDAD. EVITE AMBIENTES CÁLIDOS Y HÚMEDOS.
                   </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 flex items-center justify-between">
            <button onClick={() => step > 1 ? setStep(step - 1) : setStep(0)} className="text-slate-300 font-bold uppercase tracking-widest text-[10px] hover:text-ceres-primary">Regresar</button>
            <button onClick={handleNext} disabled={(step === 1 && isStep1Invalid)} className="bg-ceres-primary hover:bg-ceres-dark disabled:bg-slate-100 disabled:text-slate-300 text-white px-10 py-5 rounded-[24px] font-bold tracking-[0.2em] text-[10px] flex items-center gap-4 transition-all shadow-xl shadow-ceres-primary/20 group">
              {step === 6 ? 'FINALIZAR' : 'SIGUIENTE PASO'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;

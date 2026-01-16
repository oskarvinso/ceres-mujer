
import React, { useState, useMemo, useEffect } from 'react';
import { User, Phone, MapPin, Calendar, ArrowRight, ShieldCheck, Mail, Scale, ClipboardList, Navigation, Activity, Info, Baby, Check, AlertCircle, UserPlus, UserCheck, RefreshCcw } from 'lucide-react';
import { UserProfile, RiskFactors } from '../types';

interface ProfileSetupProps {
  onComplete: () => void;
}

const COLOMBIA_DATA: Record<string, string[]> = {
  "Antioquia": ["Medellín", "Envigado", "Itagüí", "Rionegro", "Bello", "Apartadó"],
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

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0); // 0: Entry Mode Selection, 1-4: Standard Steps
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
      medical: { noRiskFactors: false, hypertensionChronic: false, hypertensionGestational: false, diabetesPreexisting: false, diabetesGestational: false, obesityIMC30_34: false, obesityIMC35_40: false, lowWeightIMC20: false, renalPathology: false, cardiacPathology: false, thyroidPathology: false, asthmaControlled: false, epilepsy: false, hiv_syphilis: false, cancerRemission: false, mentalHealthHistory: false },
      reproductive: { previousAbortion2_plus: false, previousPretermBirth: false, previousPreeclampsia: false, previousCsection1_2: false, incompetenceCervical: false, ectopicHistory: false, uterineSurgery: false },
      currentPregnancy: { noObstetricRiskFactors: false, multiplePregnancy: false, threatenedAbortion: false, threatenedPreterm: false, rciu: false, poly_oligohydramnios: false, hemorrhage: false, perinatalInfection: false }
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

  const imcData = useMemo(() => {
    const heightM = formData.height / 100;
    if (heightM === 0) return { imc: 0, category: 'N/A', goal: '0-0 kg' };
    const imcValue = formData.initialWeight / (heightM * heightM);
    
    let category = '';
    let goal = '';
    
    if (imcValue < 18.5) {
      category = 'Bajo Peso';
      goal = '12.5 - 18.0 kg';
    } else if (imcValue < 25) {
      category = 'Normal';
      goal = '11.5 - 16.0 kg';
    } else if (imcValue < 30) {
      category = 'Sobrepeso';
      goal = '7.0 - 11.5 kg';
    } else {
      category = 'Obesidad';
      goal = '5.0 - 9.0 kg';
    }
    
    return { imc: imcValue.toFixed(1), category, goal };
  }, [formData.initialWeight, formData.height]);

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

  const handleGeocode = () => {
    setGeocoding(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({ ...prev, coordinates: { lat: pos.coords.latitude, lng: pos.coords.longitude } }));
          setGeocoding(false);
          alert("Ubicación geocodificada correctamente.");
        },
        () => {
          setGeocoding(false);
          alert("No se pudo obtener la ubicación. Por favor ingrésala manualmente.");
        }
      );
    }
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
      rf.currentPregnancy.hemorrhage;

    return isHighRisk ? 'Alto' : 'Bajo';
  };

  const handleNext = () => {
    if (step < 4) {
      if (step === 3) {
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
    } else if (!isClassified) {
      setIsClassified(true);
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

      if (step === 4) setIsClassified(false);

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
  const isStep4Valid = formData.riskFactors.currentPregnancy.noObstetricRiskFactors || 
                       Object.entries(formData.riskFactors.currentPregnancy).some(([k, v]) => k !== 'noObstetricRiskFactors' && v === true);

  return (
    <div className="min-h-screen bg-ceres-light flex items-center justify-center p-4 md:p-8">
      <div className="max-w-6xl w-full bg-white rounded-[40px] shadow-2xl border border-white overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto">
        <div className="md:w-1/3 bg-ceres-dark p-10 text-white flex flex-col justify-between">
          <div className="space-y-10">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-10 h-10 text-ceres-primary" />
              <div>
                <h2 className="text-2xl font-serif font-bold tracking-tight">CERES</h2>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ceres-primary">Protocolo de Ingreso</p>
              </div>
            </div>
            <div className="space-y-6">
              {[
                { n: 1, label: 'Identificación y Contacto' },
                { n: 2, label: 'Antecedentes Médicos' },
                { n: 3, label: 'Biometría y Metas' },
                { n: 4, label: 'Factores de Riesgo' }
              ].map(s => (
                <div key={s.n} className={`flex items-center gap-4 transition-all duration-500 ${step === s.n ? 'translate-x-2' : 'opacity-40'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step === s.n ? 'bg-ceres-primary border-ceres-primary' : 'border-white'}`}>{s.n}</div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[9px] text-ceres-sage leading-relaxed italic">
            Clasificación clínica automatizada basada en guías de salud materna Ceres.
          </p>
        </div>

        <div className="md:w-2/3 p-8 md:p-14 overflow-y-auto">
          {step === 0 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col justify-center">
              <div className="text-center space-y-4">
                <h3 className="text-4xl font-serif font-bold text-slate-800">Bienvenida a Ceres</h3>
                <p className="text-slate-500 font-medium">Por favor indica tu situación actual para iniciar el protocolo.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <button 
                  onClick={() => handleEntryMode(true)}
                  className="group p-10 bg-white border-2 border-slate-100 rounded-[40px] hover:border-ceres-primary hover:bg-ceres-mint transition-all text-center space-y-6 shadow-sm hover:shadow-xl"
                >
                  <div className="w-20 h-20 bg-ceres-primary/10 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <UserPlus className="w-10 h-10 text-ceres-primary" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-slate-800">Paciente Nueva</h4>
                    <p className="text-xs text-slate-500 font-medium px-4">Inicia tu expediente digital desde cero con acompañamiento IA.</p>
                  </div>
                </button>

                <button 
                  onClick={() => handleEntryMode(false)}
                  className="group p-10 bg-white border-2 border-slate-100 rounded-[40px] hover:border-ceres-primary hover:bg-ceres-mint transition-all text-center space-y-6 shadow-sm hover:shadow-xl"
                >
                  <div className="w-20 h-20 bg-ceres-secondary/20 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <UserCheck className="w-10 h-10 text-ceres-primary" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-slate-800">Paciente Registrada</h4>
                    <p className="text-xs text-slate-500 font-medium px-4">Conserva tus datos previos y actualiza tu estado gestacional.</p>
                  </div>
                </button>
              </div>

              <div className="pt-10 flex items-center justify-center gap-4 text-slate-400">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Seguridad de Datos Grado Médico</span>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-10">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <h3 className="text-3xl font-serif font-bold text-slate-800">Perfil del Paciente</h3>
                  {!isNewPatient && (
                    <span className="text-[10px] font-bold text-ceres-primary uppercase tracking-widest mt-1 flex items-center gap-2">
                      <RefreshCcw className="w-3 h-3" /> Datos Cargados del Expediente
                    </span>
                  )}
                </div>
                {isStep1Invalid && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-full text-[10px] font-bold text-rose-500 uppercase">
                    <Info className="w-3 h-3" />
                    Pendientes
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nombres Completos</label>
                  <input type="text" className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-ceres-primary" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej: María Paula" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Apellidos</label>
                  <input type="text" className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-ceres-primary" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Ej: Gómez Martínez" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tipo</label>
                    <select className="w-full px-3 py-4 bg-slate-50 rounded-2xl outline-none" value={formData.documentType} onChange={e => setFormData({...formData, documentType: e.target.value as any})}>
                      <option value="CC">CC</option><option value="CE">CE</option><option value="TI">TI</option>
                    </select>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Número de Documento</label>
                    <input type="text" className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-ceres-primary" value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} placeholder="1020304050" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Edad Actual</label>
                  <input type="number" className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none" value={formData.age} onChange={e => setFormData({...formData, age: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input type="email" className="w-full pl-12 pr-5 py-4 bg-slate-50 rounded-2xl outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="maria@ejemplo.com" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Número Celular</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input type="tel" className="w-full pl-12 pr-5 py-4 bg-slate-50 rounded-2xl outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="3101234567" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Departamento</label>
                  <select className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value, municipality: ''})}>
                    <option value="">Seleccione...</option>{Object.keys(COLOMBIA_DATA).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Municipio</label>
                  <select className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none" value={formData.municipality} onChange={e => setFormData({...formData, municipality: e.target.value})} disabled={!formData.department}>
                    <option value="">Seleccione...</option>{formData.department && COLOMBIA_DATA[formData.department].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dirección de Residencia</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input type="text" className="w-full pl-12 pr-5 py-4 bg-slate-50 rounded-2xl outline-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Ej: Calle 123 # 45-67 Torre 1 Apto 202" />
                    </div>
                    <button onClick={handleGeocode} className="p-4 bg-ceres-mint text-ceres-primary rounded-2xl hover:bg-ceres-primary hover:text-white transition-all shadow-sm">
                      <Navigation className={`w-5 h-5 ${geocoding ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-10">
              <h3 className="text-3xl font-serif font-bold text-slate-800">Antecedentes Médicos</h3>
              <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 mb-4 cursor-pointer hover:bg-emerald-100/50 transition-all" onClick={() => toggleRF('medical', 'noRiskFactors')}>
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${formData.riskFactors.medical.noRiskFactors ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 'border-emerald-200'}`}>
                    {formData.riskFactors.medical.noRiskFactors && <Check className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="font-bold text-emerald-900 block">Sin factores de riesgo médico</span>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Estado saludable inicial</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { c: 'medical', f: 'hypertensionChronic', l: 'Hipertensión Crónica' },
                  { c: 'medical', f: 'diabetesPreexisting', l: 'Diabetes Mellitus' },
                  { c: 'medical', f: 'renalPathology', l: 'Enfermedad Renal' },
                  { c: 'medical', f: 'cardiacPathology', l: 'Cardiopatías' },
                  { c: 'medical', f: 'hiv_syphilis', l: 'VIH / Sífilis gestacional' },
                  { c: 'reproductive', f: 'previousAbortion2_plus', l: '2+ Abortos Previos' },
                  { c: 'reproductive', f: 'previousPretermBirth', l: 'Parto Pretérmino previo' },
                  { c: 'reproductive', f: 'previousPreeclampsia', l: 'Preeclampsia previa' }
                ].map(item => (
                  <label key={item.f} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer border transition-all ${ (formData.riskFactors[item.c as keyof RiskFactors] as any)[item.f] ? 'bg-ceres-mint border-ceres-primary' : 'bg-slate-50 border-transparent hover:border-ceres-mint' } ${formData.riskFactors.medical.noRiskFactors ? 'opacity-40 pointer-events-none' : ''}`}>
                    <input type="checkbox" className="w-5 h-5 accent-ceres-primary" checked={(formData.riskFactors[item.c as keyof RiskFactors] as any)[item.f]} onChange={() => toggleRF(item.c as keyof RiskFactors, item.f)} />
                    <span className="text-sm font-medium text-slate-700">{item.l}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-10">
              <h3 className="text-3xl font-serif font-bold text-slate-800">Biometría y Metas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-3xl space-y-3">
                  <div className="flex items-center gap-3 text-ceres-primary">
                    <Scale className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Peso Inicial (kg)</span>
                  </div>
                  <input type="number" step="0.1" className="bg-transparent text-3xl font-serif font-bold text-slate-800 outline-none w-full" value={formData.initialWeight} onChange={e => setFormData({...formData, initialWeight: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl space-y-3">
                  <div className="flex items-center gap-3 text-ceres-primary">
                    <Activity className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Talla (cm)</span>
                  </div>
                  <input type="number" className="bg-transparent text-3xl font-serif font-bold text-slate-800 outline-none w-full" value={formData.height} onChange={e => setFormData({...formData, height: parseInt(e.target.value) || 0})} />
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl space-y-3">
                  <div className="flex items-center gap-3 text-ceres-primary">
                    <Calendar className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">FPP (F. Probable Parto)</span>
                  </div>
                  <input type="date" className="bg-transparent text-xl font-bold text-slate-800 outline-none w-full" value={formData.edd} onChange={e => handleEddChange(e.target.value)} />
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl space-y-3">
                  <div className="flex items-center gap-3 text-ceres-primary">
                    <Baby className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Semanas (Calculado)</span>
                  </div>
                  <input type="number" className="bg-transparent text-3xl font-serif font-bold text-slate-800 outline-none w-full" value={formData.gestationWeeks} readOnly />
                </div>
              </div>
              <div className="p-8 bg-ceres-primary/10 rounded-[40px] border border-ceres-primary/20 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-xl text-ceres-dark">Clasificación Nutricional</h4>
                  <span className="text-xl font-bold text-ceres-primary">{imcData.imc}</span>
                </div>
                <div className="pt-4 border-t border-ceres-primary/20 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-600">Meta ganancia total:</p>
                  <p className="text-xl font-bold text-ceres-dark">{imcData.goal}</p>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-10">
              <h3 className="text-3xl font-serif font-bold text-slate-800">Factores de Riesgo Obstétrico</h3>
              
              {!isClassified ? (
                <div className="space-y-6">
                  <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 cursor-pointer hover:bg-emerald-100 transition-all" onClick={() => toggleRF('currentPregnancy', 'noObstetricRiskFactors')}>
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${formData.riskFactors.currentPregnancy.noObstetricRiskFactors ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-emerald-200'}`}>
                        {formData.riskFactors.currentPregnancy.noObstetricRiskFactors && <Check className="w-5 h-5" />}
                      </div>
                      <div>
                        <span className="font-bold text-emerald-900 block">Sin factores de riesgo obstétrico</span>
                        <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Embarazo sin complicaciones actuales</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { c: 'currentPregnancy', f: 'multiplePregnancy', l: 'Embarazo Múltiple' },
                      { c: 'currentPregnancy', f: 'threatenedPreterm', l: 'Amenaza Parto Pretérmino' },
                      { c: 'currentPregnancy', f: 'rciu', l: 'RCIU Detectado' },
                      { c: 'currentPregnancy', f: 'poly_oligohydramnios', l: 'Alteración Líq. Amniótico' },
                      { c: 'currentPregnancy', f: 'hemorrhage', l: 'Hemorragia Gestacional' },
                      { c: 'medical', f: 'diabetesGestational', l: 'Diabetes Gestacional' },
                      { c: 'medical', f: 'hypertensionGestational', l: 'HTA Gestacional' },
                      { c: 'sociodemographic', f: 'multipara', l: 'Gran Multípara (>3)' }
                    ].map(item => (
                      <label key={item.f} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer border transition-all ${ (formData.riskFactors[item.c as keyof RiskFactors] as any)[item.f] ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-transparent hover:border-slate-200' } ${formData.riskFactors.currentPregnancy.noObstetricRiskFactors ? 'opacity-40 pointer-events-none' : ''}`}>
                        <input type="checkbox" className="w-5 h-5 accent-rose-500" checked={(formData.riskFactors[item.c as keyof RiskFactors] as any)[item.f]} onChange={() => toggleRF(item.c as keyof RiskFactors, item.f)} />
                        <span className="text-sm font-medium text-slate-700">{item.l}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="animate-in zoom-in-95 duration-500">
                  <div className={`p-10 rounded-[40px] border flex flex-col items-center text-center gap-8 ${determineRiskLevel() === 'Alto' ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
                    <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center text-white shadow-xl ${determineRiskLevel() === 'Alto' ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                      {determineRiskLevel() === 'Alto' ? <AlertCircle className="w-10 h-10" /> : <ShieldCheck className="w-10 h-10" />}
                    </div>
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-[0.3em] ${determineRiskLevel() === 'Alto' ? 'text-rose-500' : 'text-emerald-500'}`}>Resultado del Análisis</p>
                      <h4 className={`text-4xl font-serif font-bold mt-2 ${determineRiskLevel() === 'Alto' ? 'text-rose-900' : 'text-emerald-900'}`}>Riesgo {determineRiskLevel()}</h4>
                      <p className="text-slate-500 text-sm mt-4 max-w-sm font-medium leading-relaxed">
                        {determineRiskLevel() === 'Alto' 
                          ? 'Se han identificado condiciones que requieren un seguimiento estrecho por parte de especialistas Ceres.' 
                          : 'Tu perfil indica un curso normal del embarazo. Continúa con tus controles periódicos Ceres.'}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setIsClassified(false)} className="mt-6 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-ceres-primary mx-auto block">Modificar factores</button>
                </div>
              )}
            </div>
          )}

          {step > 0 && (
            <div className="mt-16 flex items-center justify-between">
              <button 
                onClick={() => {
                  if (step === 1) setStep(0);
                  else setStep(step - 1);
                }} 
                className="text-slate-300 font-bold uppercase tracking-widest text-[10px] hover:text-ceres-primary transition-colors"
              >
                Regresar
              </button>
              <button 
                onClick={handleNext} 
                disabled={(step === 1 && isStep1Invalid) || (step === 4 && !isStep4Valid && !isClassified)} 
                className="bg-ceres-primary hover:bg-ceres-dark disabled:bg-slate-100 disabled:text-slate-300 text-white px-12 py-5 rounded-[24px] font-bold tracking-[0.2em] text-[10px] flex items-center gap-4 transition-all shadow-2xl shadow-ceres-primary/20 group"
              >
                {step === 4 ? (isClassified ? 'FINALIZAR PROTOCOLO' : 'VER CLASIFICACIÓN') : 'SIGUIENTE PASO'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;

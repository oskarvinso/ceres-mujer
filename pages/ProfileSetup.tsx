
import React, { useState } from 'react';
import { User, Phone, MapPin, Calendar, ClipboardCheck, ArrowRight, Loader2 } from 'lucide-react';

interface ProfileSetupProps {
  onComplete: () => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    location: '',
    edd: '',
    history: {
      previousCsection: false,
      hypertension: false,
      diabetes: false,
      multiplePregnancy: false
    }
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      // Calculate risk
      let riskLevel = 'Bajo';
      if (parseInt(formData.age) > 35 || parseInt(formData.age) < 18) riskLevel = 'Medio';
      if (formData.history.hypertension || formData.history.diabetes || formData.history.previousCsection) riskLevel = 'Alto';
      
      localStorage.setItem('ser_mujer_profile', JSON.stringify(formData));
      localStorage.setItem('ser_mujer_risk', riskLevel);
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-2 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-purple-600' : 'w-4 bg-slate-100'}`}></div>
              ))}
            </div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">Paso {step} de 3</span>
          </div>

          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-serif font-bold text-slate-800">Bienvenida</h2>
                <p className="text-slate-500">Comencemos con tus datos básicos para personalizar tu experiencia.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nombre Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3 w-5 h-5 text-slate-300" />
                    <input 
                      type="text" 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Edad</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.age}
                    onChange={e => setFormData({...formData, age: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3 w-5 h-5 text-slate-300" />
                    <input 
                      type="tel" 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Ubicación / Ciudad</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3 w-5 h-5 text-slate-300" />
                    <input 
                      type="text" 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-serif font-bold text-slate-800">Tu Embarazo</h2>
                <p className="text-slate-500">¿Cuál es tu Fecha Probable de Parto (FPP)?</p>
              </div>
              <div className="p-8 bg-purple-50 border border-purple-100 rounded-3xl space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-purple-400 uppercase">Fecha Probable de Parto</label>
                    <input 
                      type="date" 
                      className="w-full bg-transparent border-b-2 border-purple-200 py-2 outline-none focus:border-purple-600 text-lg font-bold text-purple-900"
                      value={formData.edd}
                      onChange={e => setFormData({...formData, edd: e.target.value})}
                    />
                  </div>
                </div>
                <p className="text-xs text-purple-400 italic">Si no la conoces, usa la fecha estimada por tu última ecografía.</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-serif font-bold text-slate-800">Salud y Antecedentes</h2>
                <p className="text-slate-500">Ayúdanos a valorar tu nivel de riesgo inicial.</p>
              </div>
              <div className="space-y-3">
                {[
                  { id: 'hypertension', label: '¿Sufres de Hipertensión arterial?' },
                  { id: 'diabetes', label: '¿Tienes Diabetes previa o gestacional?' },
                  { id: 'previousCsection', label: '¿Has tenido Cesáreas previas?' },
                  { id: 'multiplePregnancy', label: '¿Es un embarazo múltiple (gemelos/mellizos)?' },
                ].map(item => (
                  <label key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-white border border-slate-100 rounded-2xl cursor-pointer transition-all group">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded accent-purple-600"
                      checked={(formData.history as any)[item.id]}
                      onChange={e => setFormData({
                        ...formData, 
                        history: {...formData.history, [item.id]: e.target.checked}
                      })}
                    />
                    <span className="text-slate-700 font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 flex justify-end">
            <button 
              onClick={handleNext}
              disabled={step === 1 && (!formData.name || !formData.age)}
              className="px-10 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-purple-200 transition-all"
            >
              {step === 3 ? 'Finalizar Entrevista' : 'Siguiente'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;

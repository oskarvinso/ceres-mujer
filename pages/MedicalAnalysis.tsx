
import React, { useState, useRef } from 'react';
import { Camera, FileText, Send, Sparkles, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { analyzeExam } from '../services/geminiService';

const MedicalAnalysis: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setAnalysis(null);
    try {
      const base64 = image.split(',')[1];
      const result = await analyzeExam(base64, prompt);
      setAnalysis(result || "No pudimos procesar el análisis en este momento.");
    } catch (err) {
      console.error(err);
      setAnalysis("Ocurrió un error al analizar la imagen. Por favor, asegúrate de que la foto sea clara.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 space-y-14">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-3 px-5 py-2 bg-ceres-mint text-ceres-primary rounded-full text-[10px] font-bold uppercase tracking-[0.25em]">
          <Sparkles className="w-4 h-4" />
          Inteligencia Artificial Médica
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight">Análisis de Laboratorio</h1>
        <p className="text-slate-500 max-w-xl mx-auto leading-relaxed font-medium">
          Nuestra tecnología IA te ayuda a comprender tus resultados de exámenes en lenguaje humano y profesional.
        </p>
      </div>

      <div className="bg-white rounded-[60px] border border-ceres-mint shadow-2xl overflow-hidden shadow-ceres-primary/5">
        <div className="p-12 md:p-16 space-y-10">
          {!image ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-4 border-dashed border-ceres-mint rounded-[40px] p-20 text-center cursor-pointer hover:border-ceres-primary hover:bg-ceres-light transition-all group relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl border border-ceres-mint group-hover:scale-110 transition-all duration-500">
                  <Camera className="w-10 h-10 text-ceres-primary" />
                </div>
                <p className="text-2xl font-serif font-bold text-slate-800 tracking-tight">Sube tu resultado médico</p>
                <p className="text-sm text-slate-400 mt-3 font-medium">Captura o adjunta tu examen de laboratorio (PNG, JPG)</p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>
          ) : (
            <div className="space-y-10">
              <div className="relative group rounded-[40px] overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
                <img src={image} alt="Examen" className="max-h-[600px] w-full object-contain p-6" />
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-8 right-8 bg-ceres-dark/80 backdrop-blur-md text-white p-4 rounded-3xl hover:bg-ceres-dark transition-all shadow-xl"
                >
                  <FileText className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="¿Alguna duda específica? (Ej: ¿Mi hierro está bien?)"
                    className="flex-1 px-8 py-6 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-ceres-mint focus:bg-white outline-none transition-all font-medium text-lg"
                  />
                  <button 
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="bg-ceres-primary hover:bg-ceres-dark disabled:bg-slate-200 text-white px-12 py-6 rounded-3xl font-bold flex items-center justify-center gap-3 transition-all shadow-2xl shadow-ceres-primary/20 uppercase tracking-widest text-xs"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                    Analizar Ahora
                  </button>
                </div>
              </div>
            </div>
          )}

          {analysis && (
            <div className="mt-16 p-12 bg-ceres-light rounded-[50px] border border-ceres-mint space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-5 mb-10 pb-6 border-b border-ceres-mint">
                  <div className="w-14 h-14 bg-ceres-primary rounded-2xl flex items-center justify-center shadow-lg shadow-ceres-primary/30">
                    <ShieldCheck className="text-white w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-ceres-dark">Diagnóstico Ser Mujer IA</h3>
                    <p className="text-[10px] text-ceres-primary font-bold uppercase tracking-[0.2em]">Basado en tus datos gestacionales</p>
                  </div>
                </div>
                <div className="prose prose-slate prose-lg max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed font-medium italic">
                  {analysis}
                </div>
                <div className="mt-12 pt-10 border-t border-ceres-mint flex items-start gap-5 text-sm text-ceres-dark bg-white/60 p-8 rounded-[32px]">
                  <AlertCircle className="w-6 h-6 text-ceres-primary shrink-0 mt-1" />
                  <p className="leading-relaxed font-bold opacity-80 uppercase tracking-wide text-[11px]">
                    <strong>IMPORTANTE:</strong> Este informe es puramente orientativo y no sustituye la valoración médica presencial. Presenta estos resultados a tu especialista Ceres en tu próxima cita.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalAnalysis;

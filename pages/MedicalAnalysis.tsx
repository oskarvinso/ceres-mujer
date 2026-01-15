
import React, { useState, useRef } from 'react';
import { Camera, FileText, Send, Sparkles, Loader2, AlertCircle } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3 h-3" />
          Inteligencia Artificial
        </div>
        <h1 className="text-4xl font-serif font-bold text-slate-900">Lectura de Exámenes</h1>
        <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
          Nuestra IA te ayuda a entender tus resultados de laboratorio de forma fácil y humana.
        </p>
      </div>

      <div className="bg-white rounded-[40px] border border-pink-100 shadow-2xl overflow-hidden shadow-purple-100/50">
        <div className="p-10 md:p-12 space-y-8">
          {!image ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-4 border-dashed border-pink-50 rounded-[32px] p-16 text-center cursor-pointer hover:border-purple-200 hover:bg-purple-50/30 transition-all group relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-pink-50 group-hover:scale-110 transition-all duration-500">
                  <Camera className="w-10 h-10 text-purple-400 group-hover:text-purple-600 transition-colors" />
                </div>
                <p className="text-xl font-bold text-slate-700">Haz clic para subir o tomar foto</p>
                <p className="text-sm text-slate-400 mt-2 font-medium">Soporta JPG, PNG de tus resultados de laboratorio.</p>
              </div>
              {/* Decorative circles in upload box */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-100/30 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-100/30 rounded-full blur-2xl"></div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="relative group rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
                <img src={image} alt="Examen" className="max-h-[500px] w-full object-contain p-4" />
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-6 right-6 bg-slate-900/80 backdrop-blur-md text-white p-3 rounded-2xl hover:bg-slate-900 transition-all shadow-lg"
                >
                  <FileText className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-600 ml-1">
                  <Sparkles className="w-4 h-4 text-fuchsia-500" />
                  ¿Alguna pregunta específica sobre este examen?
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ej: ¿Mi nivel de hierro está dentro de lo normal?"
                    className="flex-1 px-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all shadow-sm"
                  />
                  <button 
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-purple-200"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                    Analizar Resultados
                  </button>
                </div>
              </div>
            </div>
          )}

          {analysis && (
            <div className="mt-12 p-10 bg-purple-50/50 rounded-[40px] border border-purple-100 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
                    <Sparkles className="text-white w-6 h-6 fill-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-purple-900 font-serif">Análisis Ser Mujer IA</h3>
                    <p className="text-[10px] text-purple-400 font-bold uppercase tracking-[0.2em]">Basado en tus datos gestacionales</p>
                  </div>
                </div>
                <div className="prose prose-slate prose-lg max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">
                  {analysis}
                </div>
                <div className="mt-10 pt-8 border-t border-purple-100 flex items-start gap-4 text-sm text-purple-700 bg-white/50 p-6 rounded-3xl">
                  <AlertCircle className="w-6 h-6 text-fuchsia-500 shrink-0 mt-1" />
                  <p className="leading-relaxed">
                    <strong>Recordatorio Médico:</strong> Este análisis automático es para orientación informativa. Debes presentar estos resultados a tu médico obstetra en tu próximo control prenatal para un diagnóstico definitivo.
                  </p>
                </div>
              </div>
              {/* Decorative background for analysis */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalAnalysis;

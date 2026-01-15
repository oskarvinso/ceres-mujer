
import React from 'react';
import { BookOpen, Users, Video, Lightbulb, ChevronRight } from 'lucide-react';

const Education: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-serif font-bold text-slate-900">Centro de Aprendizaje Familiar</h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            El embarazo es un camino que se recorre mejor en equipo. Ofrecemos recursos diseñados tanto para la madre como para el padre, fomentando un acompañamiento activo y consciente.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <BookOpen className="w-8 h-8 text-rose-500 mb-4" />
              <h3 className="font-bold">Biblioteca Digital</h3>
              <p className="text-xs text-slate-500 mt-2">Guías descargables sobre lactancia, sueño y postparto.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <Users className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="font-bold">Comunidad</h3>
              <p className="text-xs text-slate-500 mt-2">Foros moderados por expertos para resolver dudas.</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl">
            <img src="https://picsum.photos/seed/edu1/800/1000" alt="Educación" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-bold">Tip del Día</p>
              <p className="text-xs text-slate-500">Masaje perineal: Cómo empezar.</p>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-8">
        <h2 className="text-3xl font-serif font-bold text-center">Especial para Padres</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Rol del Padre en el Parto', desc: 'Cómo ser el apoyo emocional y logístico ideal.', icon: Users, color: 'text-blue-500' },
            { title: 'Conexión con el Bebé', desc: 'Técnicas de estimulación prenatal para papás.', icon: Video, color: 'text-rose-500' },
            { title: 'Cuidado del Recién Nacido', desc: 'Habilidades básicas: del baño al cambio de pañal.', icon: BookOpen, color: 'text-emerald-500' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all group">
              <item.icon className={`w-10 h-10 ${item.color} mb-6`} />
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-slate-500 mb-6">{item.desc}</p>
              <button className="flex items-center gap-2 font-bold text-slate-900 group-hover:text-rose-500 transition-colors">
                Empezar curso <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-slate-900 rounded-[40px] p-12 lg:p-16 text-white text-center">
        <h2 className="text-3xl font-serif font-bold mb-6">¿Tienes dudas urgentes?</h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">Chatea con nuestro equipo de obstetras y especialistas en crianza disponibles 24/7 para ti.</p>
        <button className="bg-rose-500 hover:bg-rose-600 px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-rose-900/40">
          Iniciar Chat con Experto
        </button>
      </div>
    </div>
  );
};

export default Education;

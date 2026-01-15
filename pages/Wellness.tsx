
import React, { useState } from 'react';
import { Play, Clock, User, Sparkles, Heart } from 'lucide-react';
import { Lesson } from '../types';

const lessons: Lesson[] = [
  { id: '1', title: 'Yoga Prenatal: Fuerza y Calma', category: 'yoga', duration: '45 min', instructor: 'Elena Ruiz', thumbnail: 'https://picsum.photos/seed/ser_yoga1/600/400' },
  { id: '2', title: 'Cocina para dos: Hierro y Vitaminas', category: 'cocina', duration: '30 min', instructor: 'Chef Marina', thumbnail: 'https://picsum.photos/seed/ser_cook1/600/400' },
  { id: '3', title: 'Fortalecimiento de Suelo Pélvico', category: 'ejercicio', duration: '20 min', instructor: 'Dra. Soler', thumbnail: 'https://picsum.photos/seed/ser_ex1/600/400' },
  { id: '4', title: 'Conexión Emocional con tu Bebé', category: 'recreativo', duration: '15 min', instructor: 'Marta Life', thumbnail: 'https://picsum.photos/seed/ser_med2/600/400' },
  { id: '5', title: 'Pilates Ser Mujer: Nivel 1', category: 'ejercicio', duration: '50 min', instructor: 'Elena Ruiz', thumbnail: 'https://picsum.photos/seed/ser_pil1/600/400' },
  { id: '6', title: 'Pintura de Pancitas: Arte Gestante', category: 'recreativo', duration: '60 min', instructor: 'Arte Mamá', thumbnail: 'https://picsum.photos/seed/ser_art1/600/400' },
];

const Wellness: React.FC = () => {
  const [filter, setFilter] = useState<string>('todos');

  const filteredLessons = filter === 'todos' 
    ? lessons 
    : lessons.filter(l => l.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
      <div className="relative rounded-[60px] overflow-hidden bg-purple-700 text-white p-16 lg:p-24 text-center space-y-8 shadow-2xl shadow-purple-200/50 border border-purple-500/20">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-center gap-3">
             <div className="w-10 h-1 bg-fuchsia-400 rounded-full"></div>
             <span className="px-6 py-2 bg-purple-600/50 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-[0.3em] border border-white/10">Ser Mujer Studio</span>
             <div className="w-10 h-1 bg-fuchsia-400 rounded-full"></div>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight">Vive tu embarazo al máximo</h1>
          <p className="text-purple-100 text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Descubre nuestras clases exclusivas de Yoga, Cocina y Bienestar diseñadas para cada latido de tu gestación.
          </p>
          <div className="pt-4 flex items-center justify-center gap-6">
            <button className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-10 py-5 rounded-[24px] font-bold transition-all shadow-xl shadow-fuchsia-900/40 flex items-center gap-2">
              Ver Clases en Vivo
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            </button>
            <button className="bg-white text-purple-700 px-10 py-5 rounded-[24px] font-bold transition-all hover:bg-purple-50">
              Mi Calendario
            </button>
          </div>
        </div>
        {/* Artistic Background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-500 rounded-full -mr-48 -mt-48 opacity-20 blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-400 rounded-full -ml-40 -mb-40 opacity-20 blur-[100px]"></div>
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
           <Heart className="absolute top-10 right-20 w-32 h-32 rotate-12" />
           <Heart className="absolute bottom-10 left-20 w-24 h-24 -rotate-12 fill-white" />
        </div>
      </div>

      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-pink-100 pb-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-serif font-bold text-slate-900">Nuestra Videoteca</h2>
            <p className="text-slate-500">Aprende y muévete a tu propio ritmo.</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {['todos', 'yoga', 'ejercicio', 'cocina', 'recreativo'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-3 rounded-2xl text-sm font-bold capitalize transition-all whitespace-nowrap ${
                  filter === cat ? 'bg-purple-600 text-white shadow-lg' : 'bg-white border border-pink-100 text-slate-500 hover:bg-purple-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredLessons.map((lesson) => (
            <div key={lesson.id} className="group cursor-pointer">
              <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden mb-6 bg-slate-100 shadow-xl shadow-purple-100/30 border border-white">
                <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-purple-900/30 transition-colors flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-all border border-white/40 shadow-2xl">
                    <Play className="w-10 h-10 text-white fill-white" />
                  </div>
                </div>
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 bg-fuchsia-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg">{lesson.category}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-purple-600 transition-colors leading-tight">{lesson.title}</h3>
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-fuchsia-400" />
                  <span className="font-medium">{lesson.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-400" />
                  <span className="font-medium">{lesson.instructor}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wellness;

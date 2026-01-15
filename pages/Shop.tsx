
import React, { useState } from 'react';
import { ShoppingCart, Heart, Search, Filter } from 'lucide-react';
import { Product } from '../types';

const products: Product[] = [
  { id: '1', name: 'Vitaminas Ser Mujer Gold', price: 45.99, category: 'salud', image: 'https://picsum.photos/seed/ser_vit1/400/400', description: 'Fórmula completa con ácido fólico de alta absorción y DHA.' },
  { id: '2', name: 'Leggings Gestante Comfort', price: 34.50, category: 'ropa', image: 'https://picsum.photos/seed/ser_leg1/400/400', description: 'Tejido premium transpirable que se adapta a tu crecimiento.' },
  { id: '3', name: 'Batido Proteico Vainilla', price: 29.99, category: 'nutricion', image: 'https://picsum.photos/seed/ser_nut1/400/400', description: 'Ideal para el desarrollo muscular y óseo del bebé.' },
  { id: '4', name: 'Medias de Gradiente Suave', price: 18.00, category: 'salud', image: 'https://picsum.photos/seed/ser_med1/400/400', description: 'Compresión graduada para aliviar piernas cansadas.' },
  { id: '5', name: 'El Viaje de la Maternidad', price: 22.00, category: 'libros', image: 'https://picsum.photos/seed/ser_book1/400/400', description: 'Guía emocional y práctica para padres primerizos.' },
  { id: '6', name: 'Vestido Fucsia Gala Ser', price: 89.00, category: 'ropa', image: 'https://picsum.photos/seed/ser_dress1/400/400', description: 'Elegancia absoluta en el color insignia de Ser Mujer.' },
];

const Shop: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('todos');

  const filteredProducts = activeCategory === 'todos' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">Tienda Oficial</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Bienestar y Estilo</h1>
          <p className="text-slate-500 max-w-md">Productos seleccionados por expertos para tu salud y comodidad.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-purple-500 transition-colors" />
            <input 
              type="text" 
              placeholder="¿Qué necesitas?" 
              className="pl-12 pr-6 py-4 bg-white border border-pink-100 rounded-2xl outline-none focus:ring-4 focus:ring-purple-50 shadow-sm w-full md:w-64 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-1">
        {['todos', 'nutricion', 'ropa', 'salud', 'libros'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-3 rounded-2xl text-sm font-bold capitalize whitespace-nowrap transition-all ${
              activeCategory === cat 
                ? 'bg-purple-600 text-white shadow-xl shadow-purple-200 scale-105' 
                : 'bg-white border border-pink-100 text-slate-500 hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white group rounded-[40px] border border-pink-50 overflow-hidden hover:shadow-2xl hover:shadow-purple-100 transition-all duration-500">
            <div className="aspect-[4/5] relative overflow-hidden bg-slate-50">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <button className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-2xl text-slate-400 hover:text-rose-500 transition-all shadow-lg scale-90 group-hover:scale-100">
                <Heart className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-6 right-6 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                 <button className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-purple-700 shadow-xl transition-all">
                  <ShoppingCart className="w-5 h-5" />
                  Lo quiero
                </button>
              </div>
            </div>
            <div className="p-8 space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-[10px] text-fuchsia-500 font-bold uppercase tracking-widest">{product.category}</p>
                <span className="font-bold text-slate-900 text-2xl">${product.price.toFixed(2)}</span>
              </div>
              <h3 className="font-bold text-xl text-slate-800 leading-tight group-hover:text-purple-600 transition-colors">{product.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{product.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, MapPin, CheckCircle, MessageCircle, Stethoscope, Activity, Star, Info } from 'lucide-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const [profesionales, setProfesionales] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todos");

  const categorias = ["Todos", "Electricista", "Plomero", "Técnico PC", "Odontología", "Protesista Dental", "Fisioterapia"];

  useEffect(() => {
    fetchProfesionales();
  }, []);

  async function fetchProfesionales() {
    const { data, error } = await supabase
      .from('profesionales')
      .select('*')
      .order('es_premium', { ascending: false });
    if (!error) setProfesionales(data || []);
  }

  const filtrados = profesionales.filter(p => {
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideFiltro = filtro === "Todos" || p.categoria === filtro;
    return coincideBusqueda && coincideFiltro;
  });

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      <header className="bg-blue-800 text-white pt-12 pb-16 px-6 text-center shadow-2xl">
        <h1 className="text-4xl font-black tracking-tight">Conexión Concepción</h1>
        <p className="mt-2 text-blue-200 font-light italic">Encontrá lo que necesitás en la Perla del Norte</p>
      </header>

      <main className="max-w-4xl mx-auto p-4 -mt-10">
        <div className="relative mb-6">
          <input 
            type="text"
            placeholder="¿Qué servicio buscás hoy?"
            className="w-full p-5 pl-14 rounded-2xl shadow-xl border-none focus:ring-4 focus:ring-blue-400 text-lg transition-all"
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Search className="absolute left-5 top-5 text-blue-500" size={24} />
        </div>

        {/* BANNER PUBLICITARIO */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-1 shadow-lg mb-8 group cursor-pointer">
          <div className="bg-white rounded-[14px] p-4 flex items-center gap-4 transition-all group-hover:bg-yellow-50">
            <div className="bg-orange-100 p-3 rounded-full"><Star className="text-orange-600 fill-current" size={28} /></div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-orange-600 text-white px-2 py-0.5 rounded uppercase">Publicidad</span>
                <h4 className="font-bold text-gray-800">Ferretería El Norte</h4>
              </div>
              <p className="text-sm text-gray-600">Todo para la construcción en Concepción.</p>
            </div>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md">Ver Ofertas</button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-6">
          {categorias.map(cat => (
            <button 
              key={cat}
              onClick={() => setFiltro(cat)}
              className={`px-6 py-2.5 rounded-xl whitespace-nowrap text-sm font-bold transition-all shadow-sm border ${
                filtro === cat ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-500 border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-6">
          {filtrados.length > 0 ? filtrados.map(p => (
            <div key={p.id} className={`bg-white p-6 rounded-3xl shadow-sm border-t-4 ${p.es_premium ? 'border-orange-400' : 'border-blue-600'}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black text-gray-800">{p.nombre}</h3>
                    {p.es_verificado && <CheckCircle className="text-blue-500 w-5 h-5 fill-current" />}
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-blue-700 font-extrabold text-xs uppercase bg-blue-50 px-2 py-1 rounded">
                      {p.categoria}
                    </span>
                    <span className="flex items-center text-gray-400 text-xs"><MapPin size={14} className="mr-1" /> {p.zona}</span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-gray-600 text-sm italic border-t pt-4">"{p.descripcion}"</p>
              <a 
                href={`https://wa.me/${p.whatsapp}`}
                target="_blank"
                className="mt-6 flex items-center justify-center gap-3 bg-green-500 text-white py-4 rounded-2xl font-black hover:bg-green-600 shadow-lg"
              >
                <MessageCircle size={22} /> CONTACTAR AHORA
              </a>
            </div>
          )) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-300 text-gray-400">
              <Info className="mx-auto mb-4" size={48} />
              <p className="font-bold">No hay resultados para esta búsqueda.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-20 py-12 bg-gray-900 text-white text-center">
        <p className="text-sm font-bold opacity-50 uppercase">© 2026 Conexión Concepción</p>
      </footer>
    </div>
  );
}

export default App;
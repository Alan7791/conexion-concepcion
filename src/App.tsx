import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, MapPin, CheckCircle, MessageCircle, ExternalLink, Smartphone } from 'lucide-react';

// Conexión a Supabase usando tus variables de entorno
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [profesionales, setProfesionales] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      const { data, error } = await supabase
        .from('profesionales')
        .select('*')
        .order('es_premium', { ascending: false });
      
      if (error) console.error("Error cargando datos:", error);
      if (data) setProfesionales(data);
      setCargando(false);
    }
    cargarDatos();
  }, []);

  const filtrados = profesionales.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.zona.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header con estilo moderno */}
      <header className="bg-indigo-600 text-white pb-16 pt-12 px-6 shadow-xl">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-black tracking-tight mb-2">CONEXIÓN CONCEPCIÓN</h1>
          <p className="text-indigo-100 text-lg mb-8 font-medium">Encontrá los mejores servicios de la ciudad en un solo lugar</p>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input 
              type="text"
              placeholder="¿Qué estás buscando? (Ej: Técnico, Odontólogo...)"
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-slate-800 shadow-2xl focus:ring-4 focus:ring-indigo-300 outline-none transition-all border-none text-lg"
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 -mt-10">
        {cargando ? (
          <div className="text-center py-20 text-indigo-600 font-bold text-xl">Cargando profesionales...</div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {filtrados.length > 0 ? filtrados.map((p) => (
              <div key={p.id} className={`group relative bg-white rounded-3xl p-6 shadow-sm border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${p.es_premium ? 'border-amber-400' : 'border-transparent'}`}>
                
                {p.es_premium && (
                  <div className="absolute -top-4 right-6 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase shadow-lg tracking-widest">
                    RECOMENDADO
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-extrabold text-slate-800">{p.nombre}</h3>
                    {p.es_verificado && <CheckCircle size={20} className="text-blue-500" fill="currentColor" />}
                  </div>
                  <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
                    {p.categoria}
                  </span>
                </div>

                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                  {p.descripcion || "Servicio profesional garantizado en la zona de Concepción."}
                </p>

                <div className="flex items-center gap-2 text-slate-400 text-sm mb-8 font-medium">
                  <MapPin size={18} className="text-rose-500" />
                  <span>{p.zona} · Concepción, PY</span>
                </div>

                <div className="flex gap-3 mt-auto">
                  <a 
                    href={`https://wa.me/${p.whatsapp}`} 
                    target="_blank" 
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-200 transition-all active:scale-95"
                  >
                    <MessageCircle size={20} /> WhatsApp
                  </a>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.nombre + " " + p.zona + " Concepción Paraguay")}`} 
                    target="_blank" 
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-2xl font-bold transition-all active:scale-95"
                  >
                    <ExternalLink size={20} /> Ver Mapa
                  </a>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-medium">
                No encontramos resultados para tu búsqueda.
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="py-12 text-center text-slate-400 text-sm">
        <p>© 2026 Conexión Concepción · Desarrollado por Alan Campuzano</p>
      </footer>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, MapPin, CheckCircle, MessageCircle, ExternalLink, PlusCircle, ArrowLeft, Send } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [profesionales, setProfesionales] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [verFormulario, setVerFormulario] = useState(false);

  // Estado para el formulario
  const [nuevoPro, setNuevoPro] = useState({
    nombre: '', categoria: '', zona: '', descripcion: '', whatsapp: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setCargando(true);
    const { data } = await supabase
      .from('profesionales')
      .select('*')
      .order('es_premium', { ascending: false });
    if (data) setProfesionales(data);
    setCargando(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('profesionales').insert([nuevoPro]);
    if (error) {
      alert("Error al registrar: " + error.message);
    } else {
      alert("¡Registro exitoso! Ya apareces en la lista.");
      setVerFormulario(false);
      cargarDatos();
    }
  };

  const filtrados = profesionales.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (verFormulario) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <button onClick={() => setVerFormulario(false)} className="flex items-center gap-2 text-indigo-600 font-bold mb-8">
          <ArrowLeft size={20} /> Volver a la lista
        </button>
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-black mb-6 text-slate-800 text-center">Registrar mi Servicio</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required placeholder="Nombre o Negocio" className="w-full p-4 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400" 
              onChange={e => setNuevoPro({...nuevoPro, nombre: e.target.value})} />
            
            <select required className="w-full p-4 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={e => setNuevoPro({...nuevoPro, categoria: e.target.value})}>
              <option value="">Seleccionar Categoría</option>
              <option value="Odontología">Odontología</option>
              <option value="Técnico PC">Técnico PC</option>
              <option value="Electricista">Electricista</option>
              <option value="Plomería">Plomería</option>
              <option value="Otros">Otros</option>
            </select>

            <input required placeholder="Zona/Barrio (Ej: Itacurubí)" className="w-full p-4 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400" 
              onChange={e => setNuevoPro({...nuevoPro, zona: e.target.value})} />
            
            <input required placeholder="WhatsApp (Ej: 595981...)" className="w-full p-4 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400" 
              onChange={e => setNuevoPro({...nuevoPro, whatsapp: e.target.value})} />

            <textarea placeholder="Breve descripción de tu servicio" className="w-full p-4 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 h-32" 
              onChange={e => setNuevoPro({...nuevoPro, descripcion: e.target.value})} />

            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all">
              <Send size={20} /> Publicar Ahora
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-indigo-600 text-white pb-20 pt-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl font-black mb-4">CONEXIÓN CONCEPCIÓN</h1>
          <button 
            onClick={() => setVerFormulario(true)}
            className="mb-8 bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full flex items-center gap-2 text-sm font-bold border border-white/40 transition-all"
          >
            <PlusCircle size={18} /> ¿Sos profesional? Inscribite gratis
          </button>
          
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input 
              type="text"
              placeholder="¿Qué buscas hoy?"
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-slate-800 shadow-2xl focus:ring-4 focus:ring-indigo-300 outline-none"
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* ... Resto del código de la lista igual que antes ... */}
      <main className="max-w-5xl mx-auto p-6 -mt-10">
        <div className="grid gap-6 md:grid-cols-2">
          {filtrados.map(p => (
            /* Aquí va el diseño de la tarjeta que ya teníamos */
            <div key={p.id} className={`bg-white rounded-3xl p-6 shadow-sm border-2 ${p.es_premium ? 'border-amber-400' : 'border-transparent'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">{p.nombre} {p.es_verificado && <CheckCircle size={18} className="text-blue-500" fill="currentColor"/>}</h3>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{p.categoria}</span>
              </div>
              <p className="text-slate-500 text-sm mb-4">{p.descripcion}</p>
              <div className="flex gap-2 mb-6 text-slate-400 text-sm"><MapPin size={16} /> {p.zona}</div>
              <div className="flex gap-2">
                <a href={`https://wa.me/${p.whatsapp}`} target="_blank" className="flex-1 bg-green-500 text-white text-center py-3 rounded-xl font-bold">WhatsApp</a>
                <a href={`http://maps.google.com/?q=${p.nombre}+${p.zona}+Concepcion`} target="_blank" className="flex-1 bg-slate-100 text-slate-700 text-center py-3 rounded-xl font-bold">Mapa</a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

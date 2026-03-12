import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, MapPin, CheckCircle, MessageCircle, ExternalLink, PlusCircle, ArrowLeft, Send, Trash2, ShieldCheck } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [profesionales, setProfesionales] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [verFormulario, setVerFormulario] = useState(false);
  const [esAdmin, setEsAdmin] = useState(false);

  useEffect(() => {
    // Detectar si el usuario entró con la "llave" secreta en la URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'concepcion2026') {
      setEsAdmin(true);
    }
    cargarDatos();
  }, []);

  async function cargarDatos() {
    const { data } = await supabase.from('profesionales').select('*').order('es_premium', { ascending: false });
    if (data) setProfesionales(data);
  }

  // Funciones de Admin
  const borrarProfesional = async (id) => {
    if (confirm("¿Eliminar este registro permanentemente?")) {
      await supabase.from('profesionales').delete().eq('id', id);
      cargarDatos();
    }
  };

  const toggleVerificado = async (id, estado) => {
    await supabase.from('profesionales').update({ es_verificado: !estado }).eq('id', id);
    cargarDatos();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('profesionales').insert([
      { ...nuevoPro, es_verificado: false, es_premium: false }
    ]);
    if (error) alert("Error: " + error.message);
    else { alert("¡Publicado con éxito!"); setVerFormulario(false); cargarDatos(); }
  };

  const [nuevoPro, setNuevoPro] = useState({ nombre: '', categoria: '', zona: '', descripcion: '', whatsapp: '' });

  const filtrados = profesionales.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (verFormulario) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
        <button onClick={() => setVerFormulario(false)} className="self-start flex items-center gap-2 text-indigo-600 font-bold mb-8"><ArrowLeft size={20}/> Volver</button>
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-black mb-6 text-center text-slate-800">Inscribir mi Servicio</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required placeholder="Nombre del Negocio" className="w-full p-4 bg-slate-100 rounded-xl outline-none" onChange={e => setNuevoPro({...nuevoPro, nombre: e.target.value})} />
            <input required placeholder="Categoría (Ej: Plomero)" className="w-full p-4 bg-slate-100 rounded-xl outline-none" onChange={e => setNuevoPro({...nuevoPro, categoria: e.target.value})} />
            <input required placeholder="Barrio / Zona" className="w-full p-4 bg-slate-100 rounded-xl outline-none" onChange={e => setNuevoPro({...nuevoPro, zona: e.target.value})} />
            <input required placeholder="WhatsApp (595...)" className="w-full p-4 bg-slate-100 rounded-xl outline-none" onChange={e => setNuevoPro({...nuevoPro, whatsapp: e.target.value})} />
            <textarea placeholder="Descripción del servicio..." className="w-full p-4 bg-slate-100 rounded-xl h-24 outline-none" onChange={e => setNuevoPro({...nuevoPro, descripcion: e.target.value})} />
            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all">Enviar Registro</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-indigo-600 text-white pb-20 pt-12 px-6 text-center relative overflow-hidden">
        <h1 className="text-4xl font-black mb-4 tracking-tight">CONEXIÓN CONCEPCIÓN</h1>
        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => setVerFormulario(true)} className="bg-white/20 px-6 py-2 rounded-full text-xs font-bold border border-white/30 flex items-center gap-2 hover:bg-white/30 transition-all">
            <PlusCircle size={16}/> ¿Sos profesional? Inscribite
          </button>
          {esAdmin && (
            <span className="bg-red-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse border border-white/20">
              Modo Administrador
            </span>
          )}
        </div>
        <div className="relative max-w-xl mx-auto z-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="text" placeholder="¿Qué servicio buscás en Concepción?" className="w-full pl-12 pr-4 py-4 rounded-2xl text-slate-800 shadow-2xl outline-none border-none text-lg" onChange={(e) => setBusqueda(e.target.value)} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 -mt-10 grid gap-6 md:grid-cols-2">
        {filtrados.map(p => (
          <div key={p.id} className={`bg-white rounded-3xl p-6 shadow-sm border-2 transition-all hover:shadow-xl ${p.es_premium ? 'border-amber-400' : 'border-transparent'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">{p.nombre} {p.es_verificado && <CheckCircle size={18} className="text-blue-500" fill="currentColor"/>}</h3>
                <p className="text-xs font-black text-indigo-600 uppercase tracking-tighter">{p.categoria}</p>
              </div>
              {esAdmin && (
                <div className="flex gap-2">
                  <button onClick={() => toggleVerificado(p.id, p.es_verificado)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors" title="Verificar"><ShieldCheck size={20}/></button>
                  <button onClick={() => borrarProfesional(p.id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors" title="Borrar"><Trash2 size={20}/></button>
                </div>
              )}
            </div>
            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{p.descripcion || "Servicio profesional en Concepción."}</p>
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-6 font-medium"><MapPin size={16} className="text-rose-500" /> {p.zona}</div>
            <div className="flex gap-3">
              <a href={`https://wa.me/${p.whatsapp}`} target="_blank" className="flex-1 bg-green-500 text-white text-center py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-100 hover:bg-green-600 transition-all"><MessageCircle size={18}/> WhatsApp</a>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.nombre + " Concepcion")}`} target="_blank" className="flex-1 bg-slate-100 text-slate-700 text-center py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"><ExternalLink size={18}/> Mapa</a>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

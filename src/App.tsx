import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, MapPin, CheckCircle, MessageCircle, ExternalLink, PlusCircle, ArrowLeft, Send, Trash2, ShieldCheck, Zap } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [profesionales, setProfesionales] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [verFormulario, setVerFormulario] = useState(false);
  const [esAdmin, setEsAdmin] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'concepcion2026') setEsAdmin(true);
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setCargando(true);
    const { data } = await supabase.from('profesionales').select('*').order('es_premium', { ascending: false });
    if (data) setProfesionales(data);
    setCargando(false);
  }

  const toggleVerificado = async (id, estado) => {
    await supabase.from('profesionales').update({ es_verificado: !estado }).eq('id', id);
    cargarDatos();
  };

  const borrarProfesional = async (id) => {
    if (confirm("¿Borrar definitivamente?")) {
      await supabase.from('profesionales').delete().eq('id', id);
      cargarDatos();
    }
  };

  const [nuevoPro, setNuevoPro] = useState({ nombre: '', categoria: '', zona: '', descripcion: '', whatsapp: '' });

  const filtrados = profesionales.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.zona.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (verFormulario) {
    return (
      <div className="min-h-screen bg-white p-6 flex flex-col items-center">
        <button onClick={() => setVerFormulario(false)} className="self-start flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-10 transition-colors">
          <ArrowLeft size={20}/> Volver al inicio
        </button>
        <div className="w-full max-w-xl">
          <h2 className="text-3xl font-black mb-2 text-slate-900">Registrá tu negocio</h2>
          <p className="text-slate-500 mb-8 text-lg">Unite a la red de profesionales de Concepción.</p>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const { error } = await supabase.from('profesionales').insert([nuevoPro]);
            if (!error) { alert("¡Publicado!"); setVerFormulario(false); cargarDatos(); }
          }} className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input required placeholder="Nombre o Razón Social" className="p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 outline-none transition-all" onChange={e => setNuevoPro({...nuevoPro, nombre: e.target.value})} />
              <input required placeholder="Categoría (Ej: Electricista)" className="p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 outline-none transition-all" onChange={e => setNuevoPro({...nuevoPro, categoria: e.target.value})} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input required placeholder="Zona (Ej: Itacurubí)" className="p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 outline-none transition-all" onChange={e => setNuevoPro({...nuevoPro, zona: e.target.value})} />
              <input required placeholder="WhatsApp (5959...)" className="p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 outline-none transition-all" onChange={e => setNuevoPro({...nuevoPro, whatsapp: e.target.value})} />
            </div>
            <textarea placeholder="Contanos brevemente qué hacés..." className="p-4 bg-slate-50 border border-slate-200 rounded-2xl h-32 focus:border-indigo-500 outline-none transition-all" onChange={e => setNuevoPro({...nuevoPro, descripcion: e.target.value})} />
            <button type="submit" className="bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
              <Send size={20}/> Enviar Registro
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* HEADER PREMIUM */}
      <header className="bg-white border-b border-slate-100 pt-12 pb-16 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-6">
            <Zap size={14} fill="currentColor"/> Concepción · Paraguay
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Conexión<span className="text-indigo-600">Concepción</span></h1>
          <p className="text-slate-500 text-lg mb-10 max-w-lg mx-auto">La guía inteligente para encontrar servicios de confianza en la ciudad.</p>
          
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-white rounded-2xl flex items-center p-2 shadow-2xl">
              <Search className="ml-4 text-slate-400" size={24} />
              <input 
                type="text" 
                placeholder="¿Qué servicio estás buscando?" 
                className="w-full p-4 text-slate-800 outline-none text-lg font-medium" 
                onChange={(e) => setBusqueda(e.target.value)} 
              />
              <button onClick={() => setVerFormulario(true)} className="hidden md:flex bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold items-center gap-2 hover:bg-indigo-700 transition-all">
                <PlusCircle size={20}/> Unirse
              </button>
            </div>
          </div>
          
          <button onClick={() => setVerFormulario(true)} className="md:hidden mt-6 w-full bg-white border border-slate-200 text-slate-700 p-4 rounded-2xl font-bold flex items-center justify-center gap-2">
            <PlusCircle size={20}/> Registrar mi negocio
          </button>
        </div>

        {esAdmin && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg animate-pulse">
            <ShieldCheck size={14}/> Admin Mode
          </div>
        )}
      </header>

      {/* LISTA DE PROFESIONALES */}
      <main className="max-w-6xl mx-auto p-6 -mt-8">
        {cargando ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtrados.map(p => (
              <div key={p.id} className={`group bg-white rounded-[2rem] p-7 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden flex flex-col ${p.es_premium ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}>
                
                {p.es_premium && <div className="absolute top-0 right-0 bg-indigo-500 text-white px-4 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-tighter">Premium</div>}

                <div className="mb-6">
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1 block">{p.categoria}</span>
                  <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                    {p.nombre} 
                    {p.es_verificado && <CheckCircle size={20} className="text-blue-500" fill="currentColor"/>}
                  </h3>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">{p.descripcion || "Profesional destacado de la ciudad de Concepción."}</p>

                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-8 uppercase tracking-tight">
                  <MapPin size={16} className="text-rose-500" /> {p.zona}
                </div>

                <div className="flex gap-2">
                  <a href={`https://wa.me/${p.whatsapp}`} target="_blank" className="flex-[2] bg-green-500 hover:bg-green-600 text-white text-center py-4 rounded-2xl font-black text-sm transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2 active:scale-95">
                    <MessageCircle size={18}/> WHATSAPP
                  </a>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.nombre + " Concepcion")}`} target="_blank" className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 text-center py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center active:scale-95 border border-slate-100">
                    <ExternalLink size={18}/>
                  </a>
                </div>

                {esAdmin && (
                  <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                    <button onClick={() => toggleVerificado(p.id, p.es_verificado)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black transition-all ${p.es_verificado ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500 hover:bg-blue-500 hover:text-white'}`}>
                      {p.es_verificado ? "VERIFICADO" : "VERIFICAR"}
                    </button>
                    <button onClick={() => borrarProfesional(p.id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={18}/>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="py-20 text-center">
        <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">© 2026 Conexión Concepción · By Alan Campuzano</p>
      </footer>
    </div>
  );
}

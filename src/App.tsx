import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
// Added BadgeCheck to the imports
import { Search, MapPin, BadgeCheck, MessageCircle, ExternalLink, PlusCircle, ArrowLeft, Send, Trash2, ShieldCheck, Zap, Award, Globe } from 'lucide-react';

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

  const [nuevoPro, setNuevoPro] = useState({ nombre: '', categoria: '', zona: '', descripcion: '', whatsapp: '', link_maps: '' });

  const filtrados = profesionales.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.zona.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (verFormulario) {
    return (
      <div className="min-h-screen bg-white p-6 flex flex-col items-center">
        <button onClick={() => setVerFormulario(false)} className="self-start flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-10 transition-colors">
          <ArrowLeft size={20}/> Volver
        </button>
        <div className="w-full max-w-xl bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
          <h2 className="text-3xl font-black mb-2 text-slate-900">Registrá tu negocio</h2>
          <p className="text-slate-500 mb-8">Completá los datos para aparecer en la guía.</p>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const { error } = await supabase.from('profesionales').insert([nuevoPro]);
            if (!error) { alert("¡Registro exitoso!"); setVerFormulario(false); cargarDatos(); }
          }} className="grid gap-4">
            <input required placeholder="Nombre Comercial" className="p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => setNuevoPro({...nuevoPro, nombre: e.target.value})} />
            <input required placeholder="Categoría" className="p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => setNuevoPro({...nuevoPro, categoria: e.target.value})} />
            <input required placeholder="Barrio" className="p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => setNuevoPro({...nuevoPro, zona: e.target.value})} />
            <input required placeholder="WhatsApp" className="p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => setNuevoPro({...nuevoPro, whatsapp: e.target.value})} />
            <textarea placeholder="Descripción..." className="p-4 bg-white border border-slate-200 rounded-2xl h-24 outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => setNuevoPro({...nuevoPro, descripcion: e.target.value})} />
            <button type="submit" className="bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
              <Send size={20}/> PUBLICAR
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-sans">
      {/* HEADER CON LOGO */}
      <header className="bg-white pt-12 pb-20 px-6 relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-indigo-100 rounded-full blur-[100px] opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-50 rounded-full blur-[100px] opacity-50"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge de Localización */}
          <div className="inline-flex items-center gap-2 bg-indigo-50/50 backdrop-blur-sm text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-8 border border-indigo-100">
            <Zap size={14} fill="currentColor"/> Concepción · Paraguay
          </div>

          {/* LOGO DISEÑADO */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-indigo-600 p-3 rounded-[1.2rem] shadow-xl shadow-indigo-200 rotate-3 group hover:rotate-0 transition-transform duration-500">
               <Globe className="text-white" size={32} />
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
              Conexión<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">Concepción</span>
            </h1>
          </div>

          <p className="text-slate-500 text-lg mb-12 max-w-md mx-auto leading-relaxed">
            La plataforma oficial para conectar con los mejores servicios de la perla del norte.
          </p>
          
          {/* BUSCADOR */}
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-[2.2rem] blur opacity-15 group-hover:opacity-30 transition duration-700"></div>
            <div className="relative bg-white rounded-[2rem] flex items-center p-2.5 shadow-2xl border border-slate-100">
              <Search className="ml-5 text-slate-300" size={24} />
              <input 
                type="text" 
                placeholder="¿Qué servicio estás buscando?" 
                className="w-full p-4 text-slate-800 outline-none text-lg font-semibold placeholder:text-slate-300" 
                onChange={(e) => setBusqueda(e.target.value)} 
              />
              <button onClick={() => setVerFormulario(true)} className="hidden md:flex bg-slate-900 text-white px-8 py-4 rounded-2xl font-black items-center gap-2 hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
                <PlusCircle size={20}/> UNIRSE
              </button>
            </div>
          </div>
        </div>

        {esAdmin && (
          <div className="absolute top-6 right-6 bg-slate-900 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-2xl animate-pulse border border-white/10">
            <ShieldCheck size={16} className="text-red-500" /> ADMIN ACCESS
          </div>
        )}
      </header>

      {/* RESULTADOS */}
      <main className="max-w-6xl mx-auto p-8 -mt-10 relative z-20">
        {cargando ? (
          <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtrados.map(p => (
              <div key={p.id} className={`group bg-white rounded-[2.5rem] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)] hover:-translate-y-3 relative flex flex-col overflow-hidden ${p.es_premium ? 'ring-2 ring-indigo-500 ring-offset-4' : ''}`}>
                
                <div className="mb-8 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg italic">
                          {p.categoria}
                        </span>
                    </div>
                  
                  {/* INSTAGRAM STYLE VERIFIED BADGE */}
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight flex items-center gap-1.5">
                    {p.nombre}
                    {p.es_verificado && (
                        // This uses BadgeCheck icon with sky-500 color (Instagram Blue) and fill
                        <BadgeCheck size={20} className="text-sky-500 flex-shrink-0" fill="currentColor"/>
                    )}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 mt-1 text-slate-400 font-bold text-[11px] uppercase tracking-tight">
                    <MapPin size={14} className="text-rose-500" /> {p.zona}
                  </div>
                </div>

                <p className="text-slate-500 text-[14px] leading-relaxed mb-10 flex-grow">
                  {p.descripcion || "Servicio profesional garantizado para los ciudadanos de Concepción."}
                </p>

                {/* BOTONES */}
                <div className="flex gap-3 mt-auto">
                  <a href={`https://wa.me/${p.whatsapp}`} target="_blank" className="flex-[4] bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black text-[12px] transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2 active:scale-95">
                    <MessageCircle size={18}/> CONTACTAR
                  </a>
                  <a 
                    href={p.link_maps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.nombre + " Concepcion")}`} 
                    target="_blank" 
                    className="flex-1 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-400 py-4 rounded-2xl transition-all flex items-center justify-center active:scale-95 border border-slate-100 group/map"
                  >
                    <MapPin size={20} className="group-hover/map:animate-bounce" />
                  </a>
                </div>

                {/* ADMIN TOOLS */}
                {esAdmin && (
                  <div className="mt-8 pt-6 border-t border-dashed border-slate-200 flex justify-between">
                    <button onClick={() => toggleVerificado(p.id, p.es_verificado)} className={`p-2 rounded-xl transition-all ${p.es_verificado ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-400 hover:bg-sky-500 hover:text-white'}`}>
                      {/* Updated admin icon to use the same BadgeCheck */}
                      <BadgeCheck size={20}/>
                    </button>
                    <button onClick={() => borrarProfesional(p.id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={20}/>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="py-24 text-center">
        <div className="w-12 h-1 bg-slate-200 mx-auto rounded-full mb-8"></div>
        <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">Perla del Norte · 2026</p>
      </footer>
    </div>
  );
}

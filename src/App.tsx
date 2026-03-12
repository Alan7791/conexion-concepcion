import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, MapPin, BadgeCheck, MessageCircle, ExternalLink, PlusCircle, ArrowLeft, Send, Trash2, ShieldCheck, Zap, Share2, Hammer, Car, Utensils, ZapOff, Droplets, Laptop } from 'lucide-react';

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

  // Lista de categorías para los botones de acceso rápido
  const categoriasRapidas = [
    { nombre: "Técnicos", icono: <Zap size={20} /> },
    { nombre: "Construcción", icono: <Hammer size={20} /> },
    { nombre: "Gastronomía", icono: <Utensils size={20} /> },
    { nombre: "Mecánica", icono: <Car size={20} /> },
    { nombre: "Plomería", icono: <Droplets size={20} /> },
    { nombre: "Informática", icono: <Laptop size={20} /> },
  ];

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
          <ArrowLeft size={20}/> Volver al inicio
        </button>
        <div className="w-full max-w-xl bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
          <h2 className="text-3xl font-black mb-2 text-slate-900 tracking-tighter">Registrá tu negocio</h2>
          <p className="text-slate-500 mb-8 font-medium">Sumate a la red más profesional de Concepción.</p>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const { error } = await supabase.from('profesionales').insert([nuevoPro]);
            if (!error) { alert("¡Registro enviado!"); setVerFormulario(false); cargarDatos(); }
          }} className="grid gap-4">
            <input required placeholder="Nombre Comercial" className="p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700" onChange={e => setNuevoPro({...nuevoPro, nombre: e.target.value})} />
            <input required placeholder="Categoría" className="p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700" onChange={e => setNuevoPro({...nuevoPro, categoria: e.target.value})} />
            <input required placeholder="Barrio" className="p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700" onChange={e => setNuevoPro({...nuevoPro, zona: e.target.value})} />
            <input required placeholder="WhatsApp (5959...)" className="p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700" onChange={e => setNuevoPro({...nuevoPro, whatsapp: e.target.value})} />
            <textarea placeholder="Descripción del servicio..." className="p-4 bg-white border border-slate-200 rounded-2xl h-24 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700" onChange={e => setNuevoPro({...nuevoPro, descripcion: e.target.value})} />
            <button type="submit" className="bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
              <Send size={20}/> REGISTRARME
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] font-sans">
      <header className="bg-white pt-16 pb-12 px-6 relative border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3 bg-slate-900 px-5 py-2.5 rounded-2xl shadow-xl shadow-slate-200 transform hover:scale-105 transition-all">
              <Zap className="text-indigo-500" size={24} fill="currentColor" />
              <div className="h-4 w-[1px] bg-slate-700 rounded-full"></div>
              <span className="text-white font-black tracking-[0.3em] text-xs uppercase">Conexión</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-none">
            Concepción<span className="text-indigo-600">Digital</span>
          </h1>
          <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto font-medium">
            Encontrá lo que buscás en la Perla del Norte.
          </p>
          
          <div className="relative max-w-2xl mx-auto mb-10 group">
            <div className="absolute -inset-1 bg-indigo-500 rounded-[2.2rem] blur opacity-10 group-hover:opacity-20 transition duration-700"></div>
            <div className="relative bg-white rounded-[2rem] flex items-center p-2.5 shadow-2xl border border-slate-100">
              <Search className="ml-6 text-slate-300" size={26} />
              <input 
                type="text" 
                value={busqueda}
                placeholder="¿Qué servicio buscás hoy?" 
                className="w-full p-4 text-slate-800 outline-none text-xl font-semibold bg-transparent" 
                onChange={(e) => setBusqueda(e.target.value)} 
              />
              {busqueda && (
                <button onClick={() => setBusqueda("")} className="mr-4 text-slate-300 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest transition-colors">Limpiar</button>
              )}
            </div>
          </div>

          {/* CATEGORÍAS RÁPIDAS */}
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {categoriasRapidas.map((cat, idx) => (
              <button 
                key={idx} 
                onClick={() => setBusqueda(cat.nombre)}
                className="flex items-center gap-2 bg-white border border-slate-100 px-5 py-3 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 hover:text-indigo-600 transition-all active:scale-95 group"
              >
                <span className="text-slate-400 group-hover:text-indigo-500 transition-colors">{cat.icono}</span>
                <span className="text-sm font-black uppercase tracking-tighter">{cat.nombre}</span>
              </button>
            ))}
          </div>
        </div>

        {esAdmin && (
          <div className="absolute top-6 right-6 bg-slate-900 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-2xl animate-pulse ring-4 ring-indigo-50">
            <ShieldCheck size={16} className="text-indigo-400" /> ADMIN MODE
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto p-8 relative z-20">
        {cargando ? (
          <div className="flex justify-center py-32"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-r-4 border-transparent"></div></div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtrados.map(p => (
              <div key={p.id} className={`group bg-white rounded-[2.8rem] p-9 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.2)] hover:-translate-y-4 flex flex-col relative overflow-hidden`}>
                
                {p.es_verificado && (
                  <div className="absolute top-8 right-9 flex items-center gap-1.5 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 group-hover:bg-sky-500 transition-all duration-500 group-hover:border-sky-500 shadow-sm shadow-blue-50">
                    <BadgeCheck size={16} className="text-sky-500 group-hover:text-white transition-colors" fill="currentColor"/>
                    <span className="text-[10px] font-black text-sky-600 group-hover:text-white uppercase tracking-tighter italic">Verificado</span>
                  </div>
                )}

                <div className="mb-10">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50 px-4 py-1.5 rounded-xl mb-4 inline-block">
                    {p.categoria}
                  </span>
                  <h3 className="text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-none tracking-tighter mb-3 uppercase">
                    {p.nombre}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-[12px] uppercase tracking-wider">
                    <MapPin size={16} className="text-rose-500" /> {p.zona}
                  </div>
                </div>

                <p className="text-slate-500 text-[15px] leading-relaxed mb-12 flex-grow font-medium italic">
                  "{p.descripcion || "Excelencia y compromiso en cada servicio para la ciudad de Concepción."}"
                </p>

                <div className="flex gap-4 mt-auto">
                  <a 
                    href={`https://wa.me/${p.whatsapp}?text=${encodeURIComponent(`¡Hola! Te encontré en Conexión Concepción y quería consultar por tus servicios como ${p.categoria}.`)}`} 
                    target="_blank" 
                    className="flex-[4] bg-[#25D366] hover:bg-[#128C7E] text-white py-5 rounded-[1.5rem] font-black text-xs transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-3 active:scale-95 tracking-widest uppercase"
                  >
                    <MessageCircle size={20} fill="currentColor" /> WHATSAPP
                  </a>
                  <a 
                    href={p.link_maps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.nombre + " " + p.zona + " Concepcion")}`} 
                    target="_blank" 
                    className="flex-1 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-400 py-5 rounded-[1.5rem] transition-all flex items-center justify-center active:scale-95 border border-slate-100 group/map shadow-sm"
                  >
                    <MapPin size={22} className="group-hover/map:animate-bounce" />
                  </a>
                </div>

                {esAdmin && (
                  <div className="mt-10 pt-8 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 -mx-9 -mb-9 px-9 pb-9 rounded-b-[2.8rem]">
                    <button onClick={() => toggleVerificado(p.id, p.es_verificado)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all ${p.es_verificado ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-indigo-50'}`}>
                      {p.es_verificado ? "VERIFICADO" : "MARK VERIFY"}
                    </button>
                    <button onClick={() => borrarProfesional(p.id)} className="p-3 bg-white text-red-500 border border-red-50 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
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
        <button onClick={() => setVerFormulario(true)} className="mb-10 text-slate-400 hover:text-indigo-600 font-black text-xs uppercase tracking-[0.3em] transition-colors">¿Tenés un negocio? Inscribite acá</button>
        <div className="w-16 h-[2px] bg-slate-200 mx-auto rounded-full mb-10"></div>
        <p className="text-slate-300 text-[11px] font-black uppercase tracking-[0.5em]">La Perla del Norte · 2026</p>
      </footer>
    </div>
  );
}

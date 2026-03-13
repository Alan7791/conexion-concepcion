import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Search, MapPin, BadgeCheck, MessageCircle, 
  PlusCircle, ArrowLeft, Send, Trash2, 
  ShieldCheck, Zap, Hammer, Car, 
  Utensils, Droplets, Laptop 
} from 'lucide-react';

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
  
  // ESTADO DEL FORMULARIO INICIALIZADO LIMPIO
  const [nuevoPro, setNuevoPro] = useState({ 
    nombre: '', 
    categoria: '', 
    zona: '', 
    descripcion: '', 
    whatsapp: '', 
    link_maps: '',
    es_verificado: false 
  });

  const categoriasRapidas = [
    { nombre: "Técnicos", icono: <Zap size={18} /> },
    { nombre: "Construcción", icono: <Hammer size={18} /> },
    { nombre: "Gastronomía", icono: <Utensils size={18} /> },
    { nombre: "Mecánica", icono: <Car size={18} /> },
    { nombre: "Plomería", icono: <Droplets size={18} /> },
    { nombre: "Informática", icono: <Laptop size={18} /> },
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'concepcion2026') setEsAdmin(true);
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setCargando(true);
    const { data, error } = await supabase
      .from('profesionales')
      .select('*')
      .order('es_verificado', { ascending: false }); 
    if (data) setProfesionales(data);
    setCargando(false);
  }

  const toggleVerificado = async (id, estadoActual) => {
    const { error } = await supabase
      .from('profesionales')
      .update({ es_verificado: !estadoActual })
      .eq('id', id);
    if (!error) cargarDatos();
  };

  const borrarProfesional = async (id) => {
    if (confirm("¿Confirmas que deseas eliminar este registro?")) {
      await supabase.from('profesionales').delete().eq('id', id);
      cargarDatos();
    }
  };

  // FUNCIÓN DE ENVÍO REFORZADA
  const manejarEnvio = async (e) => {
    e.preventDefault();
    console.log("Intentando publicar:", nuevoPro); // Para depuración
    
    const { error } = await supabase
      .from('profesionales')
      .insert([nuevoPro]);

    if (error) {
      console.error("Error de Supabase:", error.message);
      alert("Error al publicar: " + error.message);
    } else {
      alert("¡Negocio publicado con éxito en Conexión Concepción!");
      setVerFormulario(false);
      setNuevoPro({ nombre: '', categoria: '', zona: '', descripcion: '', whatsapp: '', link_maps: '', es_verificado: false });
      cargarDatos();
    }
  };

  const filtrados = profesionales.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.zona.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (verFormulario) {
    return (
      <div className="min-h-screen bg-white p-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button onClick={() => setVerFormulario(false)} className="self-start flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold mb-10 transition-all uppercase text-xs tracking-widest">
          <ArrowLeft size={18}/> Cancelar y volver
        </button>
        <div className="w-full max-w-xl bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100 shadow-2xl">
          <h2 className="text-4xl font-black mb-2 text-slate-900 tracking-tighter text-center italic">Nueva Conexión</h2>
          <p className="text-slate-500 mb-8 font-medium text-center uppercase text-[10px] tracking-[0.3em]">Completa los datos de tu negocio</p>
          
          <form onSubmit={manejarEnvio} className="grid gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black ml-4 uppercase text-slate-400 tracking-widest">Nombre del Negocio</label>
              <input required value={nuevoPro.nombre} className="w-full p-5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold" onChange={e => setNuevoPro({...nuevoPro, nombre: e.target.value})} />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black ml-4 uppercase text-slate-400 tracking-widest">Rubro / Categoría</label>
              <input required value={nuevoPro.categoria} placeholder="Ej: Electricista, Barbería..." className="w-full p-5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold" onChange={e => setNuevoPro({...nuevoPro, categoria: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black ml-4 uppercase text-slate-400 tracking-widest">Barrio / Zona</label>
                <input required value={nuevoPro.zona} placeholder="Centro, Itacurubí..." className="w-full p-5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold" onChange={e => setNuevoPro({...nuevoPro, zona: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black ml-4 uppercase text-slate-400 tracking-widest">WhatsApp</label>
                <input required value={nuevoPro.whatsapp} placeholder="0981123456" className="w-full p-5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold" onChange={e => setNuevoPro({...nuevoPro, whatsapp: e.target.value})} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black ml-4 uppercase text-slate-400 tracking-widest">Descripción del Servicio</label>
              <textarea required value={nuevoPro.descripcion} className="w-full p-5 bg-white border border-slate-200 rounded-2xl h-32 outline-none focus:ring-2 focus:ring-indigo-500 font-semibold resize-none" onChange={e => setNuevoPro({...nuevoPro, descripcion: e.target.value})} />
            </div>

            <button type="submit" className="bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-sm shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 mt-4 tracking-[0.2em]">
              <Send size={20}/> PUBLICAR AHORA
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans text-slate-900">
      <header className="bg-white pt-16 pb-12 px-6 border-b border-slate-100 text-center relative">
        {esAdmin && (
          <div className="absolute top-6 right-6 bg-slate-900 text-white px-5 py-2.5 rounded-full text-[10px] font-black flex items-center gap-2 shadow-2xl border border-white/10">
            <ShieldCheck size={16} className="text-indigo-400" /> PANEL DE CONTROL
          </div>
        )}
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-8">
            <button onClick={() => { setBusqueda(""); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="flex items-center justify-center bg-slate-900 w-16 h-16 rounded-2xl shadow-2xl transform hover:rotate-6 transition-all active:scale-95 group">
              <span className="text-white font-black text-2xl tracking-tighter">C<span className="text-indigo-500">C</span></span>
            </button>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-none uppercase">Conexión<span className="text-indigo-600">Concepción</span></h1>
          <p className="text-slate-400 text-xl mb-12 font-medium italic">Encontrá lo que necesitás en la Perla del Norte.</p>
          
          <div className="relative max-w-2xl mx-auto mb-12 group">
            <div className="relative bg-white rounded-[2.2rem] flex items-center p-3 shadow-2xl border border-slate-50 transition-all focus-within:ring-2 focus-within:ring-indigo-500">
              <Search className="ml-6 text-slate-300" size={26} />
              <input type="text" value={busqueda} placeholder="¿Qué estás buscando hoy?" className="w-full p-4 text-slate-800 outline-none text-xl font-bold bg-transparent" onChange={(e) => setBusqueda(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {categoriasRapidas.map((cat, idx) => (
              <button key={idx} onClick={() => setBusqueda(cat.nombre)} className={`flex items-center gap-2 bg-white border border-slate-100 px-6 py-4 rounded-[1.3rem] shadow-sm hover:shadow-xl hover:text-indigo-600 transition-all active:scale-95 ${busqueda === cat.nombre ? 'border-indigo-500 text-indigo-600 ring-1 ring-indigo-500' : ''}`}>
                <span className={busqueda === cat.nombre ? 'text-indigo-500' : 'text-slate-300'}>{cat.icono}</span>
                <span className="text-[11px] font-black uppercase tracking-wider">{cat.nombre}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        {cargando ? (
          <div className="flex justify-center py-40 animate-pulse text-indigo-600 font-black tracking-widest text-[10px] uppercase">Sincronizando con Concepción...</div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {filtrados.map(p => (
              <div key={p.id} className="group bg-white rounded-[2.5rem] p-10 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.03)] border border-slate-100 transition-all duration-500 hover:shadow-[0_40px_100px_-20px_rgba(79,70,229,0.18)] hover:-translate-y-4 flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start mb-10">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50 px-4 py-2 rounded-xl">{p.categoria}</span>
                  {p.es_verificado && (
                    <div className="flex items-center gap-1.5 bg-sky-500 px-4 py-2 rounded-full shadow-lg shadow-sky-100">
                      <BadgeCheck size={16} className="text-white" fill="currentColor"/>
                      <span className="text-[10px] font-black text-white uppercase tracking-tighter italic font-serif">Verificado</span>
                    </div>
                  )}
                </div>
                <div className="mb-8">
                  <h3 className="text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-none tracking-tighter mb-4 uppercase">{p.nombre}</h3>
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-[12px] uppercase tracking-widest">
                    <MapPin size={16} className="text-rose-500" /> {p.zona}
                  </div>
                </div>
                <p className="text-slate-500 text-[15px] leading-relaxed mb-12 flex-grow font-medium italic border-l-4 border-indigo-50 pl-4">
                  "{p.descripcion || `Profesional de confianza en ${p.categoria}.`}"
                </p>
                <div className="flex gap-4 mt-auto">
                  <a href={`https://wa.me/${p.whatsapp}`} target="_blank" className="flex-[4] bg-[#25D366] hover:bg-[#128C7E] text-white py-5 rounded-[1.8rem] font-black text-[10px] transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-3 active:scale-95 tracking-[0.2em]">
                    <MessageCircle size={22} fill="currentColor" /> WHATSAPP
                  </a>
                  <a href={p.link_maps || "#"} target="_blank" className="flex-1 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-400 py-5 rounded-[1.8rem] transition-all flex items-center justify-center border border-slate-100 active:scale-95">
                    <MapPin size={24} />
                  </a>
                </div>
                
                {esAdmin && (
                  <div className="mt-10 pt-8 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 -mx-10 -mb-10 px-10 pb-10 rounded-b-[2.5rem]">
                    <button onClick={() => toggleVerificado(p.id, p.es_verificado)} className={`px-6 py-3 rounded-2xl text-[9px] font-black transition-all ${p.es_verificado ? 'bg-sky-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:bg-sky-50'}`}>
                      {p.es_verificado ? "VERIFICADO" : "HACER OFICIAL"}
                    </button>
                    <button onClick={() => borrarProfesional(p.id)} className="p-4 bg-white text-red-500 border border-red-50 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                      <Trash2 size={20}/>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="py-32 text-center">
        <button onClick={() => { setVerFormulario(true); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="mb-12 group">
            <div className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform hover:scale-105">
                REGISTRAR MI NEGOCIO GRATIS
            </div>
        </button>
        <div className="w-20 h-[2px] bg-slate-200 mx-auto rounded-full mb-12 opacity-50"></div>
        <p className="text-slate-300 text-[11px] font-black uppercase tracking-[0.6em] mb-4">Concepción · Paraguay</p>
        <p className="text-slate-200 text-[9px] font-bold uppercase tracking-[0.2em]">© 2026 Developed by Alan Campuzano</p>
      </footer>
    </div>
  );
}

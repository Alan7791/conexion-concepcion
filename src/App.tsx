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
    const { data } = await supabase
      .from('profesionales')
      .select('*')
      .order('es_verificado', { ascending: false }); 
    if (data) setProfesionales(data);
    setCargando(false);
  }

  // FUNCIÓN DE VERIFICACIÓN CORREGIDA
  const toggleVerificado = async (id, estadoActual) => {
    const { error } = await supabase
      .from('profesionales')
      .update({ es_verificado: !estadoActual })
      .eq('id', id);

    if (error) {
      alert("Error al actualizar: " + error.message);
    } else {
      cargarDatos(); 
    }
  };

  const borrarProfesional = async (id) => {
    if (confirm("¿Confirmas que deseas eliminar este registro?")) {
      await supabase.from('profesionales').delete().eq('id', id);
      cargarDatos();
    }
  };

  const [nuevoPro, setNuevoPro] = useState({ 
    nombre: '', categoria: '', zona: '', descripcion: '', whatsapp: '', link_maps: '' 
  });

  const filtrados = profesionales.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.zona.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (verFormulario) {
    return (
      <div className="min-h-screen bg-white p-6 flex flex-col items-center">
        <button onClick={() => setVerFormulario(false)} className="self-start flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold mb-10 transition-all uppercase text-xs tracking-widest">
          <ArrowLeft size={18}/> Volver al Inicio
        </button>
        <div className="w-full max-w-xl bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100">
          <h2 className="text-4xl font-black mb-2 text-slate-900 tracking-tighter text-center">Registrá tu negocio</h2>
          <p className="text-slate-500 mb-8 font-medium text-center">Sumate a la red de Concepción.</p>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const { error } = await supabase.from('profesionales').insert([nuevoPro]);
            if (!error) { 
              alert("¡Registro enviado con éxito!");
              setVerFormulario(false); 
              cargarDatos(); 
            }
          }} className="grid gap-4">
            <input required placeholder="Nombre Comercial" className="p-5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold" onChange={e => setNuevoPro({...nuevoPro, nombre: e.target.value})} />
            <input required placeholder="Categoría" className="p-5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold" onChange={e => setNuevoPro({...nuevoPro, categoria: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Barrio" className="p-5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold" onChange={e => setNuevoPro({...nuevoPro, zona: e.target.value})} />
                <input required placeholder="WhatsApp" className="p-5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold" onChange={e => setNuevoPro({...nuevoPro, whatsapp: e.target.value})} />
            </div>
            <textarea placeholder="Descripción..." className="p-5 bg-white border border-slate-200 rounded-2xl h-32 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold" onChange={e => setNuevoPro({...nuevoPro, descripcion: e.target.value})} />
            <button type="submit" className="bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mt-4">
              <Send size={22}/> PUBLICAR NEGOCIO
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
          <div className="absolute top-4 right-4 bg-slate-900 text-white px-4 py-2 rounded-full text-[9px] font-black flex items-center gap-2">
            <ShieldCheck size={14} className="text-indigo-400" /> MODO ADMIN
          </div>
        )}
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="bg-slate-900 w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center">
              <span className="text-white font-black text-2xl">C<span className="text-indigo-500">C</span></span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-none">Conexión<span className="text-indigo-600">Concepción</span></h1>
          <p className="text-slate-400 text-xl mb-12 font-medium">Servicios profesionales en un solo lugar.</p>
          
          <div className="relative max-w-2xl mx-auto mb-12">
            <div className="relative bg-white rounded-[2.2rem] flex items-center p-3 shadow-2xl border border-slate-50">
              <Search className="ml-6 text-slate-300" size={26} />
              <input type="text" value={busqueda} placeholder="¿Qué servicio estás buscando?" className="w-full p-4 text-slate-800 outline-none text-xl font-bold bg-transparent" onChange={(e) => setBusqueda(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categoriasRapidas.map((cat, idx) => (
              <button key={idx} onClick={() => setBusqueda(cat.nombre)} className={`flex items-center gap-2 bg-white border border-slate-100 px-6 py-4 rounded-[1.3rem] shadow-sm hover:shadow-xl transition-all ${busqueda === cat.nombre ? 'border-indigo-500 text-indigo-600 ring-1 ring-indigo-500' : ''}`}>
                <span className={busqueda === cat.nombre ? 'text-indigo-500' : 'text-slate-300'}>{cat.icono}</span>
                <span className="text-[11px] font-black uppercase tracking-wider">{cat.nombre}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        {cargando ? (
          <div className="flex justify-center py-40 animate-pulse text-indigo-600 font-black tracking-widest text-xs uppercase">Conectando...</div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtrados.map(p => (
              <div key={p.id} className="group bg-white rounded-[2.5rem] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.15)] hover:-translate-y-2 flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-xl">{p.categoria}</span>
                  {p.es_verificado && (
                    <div className="flex items-center gap-1.5 bg-sky-500 px-3 py-1.5 rounded-full shadow-lg shadow-sky-100">
                      <BadgeCheck size={14} className="text-white" fill="currentColor"/>
                      <span className="text-[9px] font-black text-white uppercase tracking-tighter">Oficial</span>
                    </div>
                  )}
                </div>
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-2 uppercase">{p.nombre}</h3>
                  <div className="flex items-center gap-1 text-slate-400 font-bold text-[11px] uppercase tracking-widest">
                    <MapPin size={14} className="text-rose-500" /> {p.zona}
                  </div>
                </div>
                <div className="relative mb-8 flex-grow">
                  <p className="text-slate-500 text-[14px] leading-relaxed font-medium italic pl-4 border-l-2 border-slate-100">
                    "{p.descripcion || `Especialista en ${p.categoria} en Concepción.`}"
                  </p>
                </div>
                <div className="flex gap-3 mt-auto">
                  <a href={`https://wa.me/${p.whatsapp}`} target="_blank" className="flex-[3] bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-2xl font-black text-[11px] transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest">
                    <MessageCircle size={18} fill="currentColor" /> WhatsApp
                  </a>
                  <a href={p.link_maps || "#"} target="_blank" className="flex-1 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-400 py-4 rounded-2xl transition-all flex items-center justify-center border border-slate-100">
                    <MapPin size={20} />
                  </a>
                </div>
                
                {/* BOTONES DE ADMIN CORREGIDOS */}
                {esAdmin && (
                  <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                    <button 
                      onClick={() => toggleVerificado(p.id, p.es_verificado)}
                      className={`text-[9px] font-black px-3 py-2 rounded-lg transition-all ${p.es_verificado ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-400'}`}
                    >
                      {p.es_verificado ? "QUITAR OFICIAL" : "HACER OFICIAL"}
                    </button>
                    <button onClick={() => borrarProfesional(p.id)} className="text-red-300 hover:text-red-600 transition-colors">
                      <Trash2 size={20}/>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="py-20 text-center">
        <button onClick={() => setVerFormulario(true)} className="mb-12 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all">
          REGISTRAR MI NEGOCIO GRATIS
        </button>
        <p className="text-slate-300 text-[11px] font-black uppercase tracking-[0.6em] mb-4">Concepción · Paraguay</p>
        <p className="text-slate-200 text-[9px] font-bold uppercase tracking-[0.2em]">© 2026 Developed by Alan Campuzano</p>
      </footer>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as Icons from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const IconoDinamico = ({ nombre, size = 20 }: { nombre: string, size?: number }) => {
  const nombreFormateado = (nombre.charAt(0).toUpperCase() + nombre.slice(1)) as keyof typeof Icons;
  const LucideIcon = (Icons[nombreFormateado] as React.ElementType) || Icons.HelpCircle;
  return <LucideIcon size={size} />;
};

export default function App() {
  const [profesionales, setProfesionales] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [verFormulario, setVerFormulario] = useState(false);
  const [esAdmin, setEsAdmin] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [nuevoPro, setNuevoPro] = useState({ 
    nombre: '', categoria: '', zona: '', descripcion: '', whatsapp: '', link_maps: '', icono: 'zap' 
  });

  useEffect(() => {
    fetchProfesionales();
  }, []);

  async function fetchProfesionales() {
    setCargando(true);
    const { data, error } = await supabase
      .from('profesionales')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setProfesionales(data || []);
    setCargando(false);
  }

  async function registrarClic(id: string, whatsapp: string) {
    await supabase.rpc('incrementar_clic', { row_id: id });
    window.open(`https://wa.me/${whatsapp}`, '_blank');
    fetchProfesionales();
  }

  async function crearProfesional(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('profesionales').insert([nuevoPro]);
    if (!error) {
      setVerFormulario(false);
      fetchProfesionales();
      setNuevoPro({ nombre: '', categoria: '', zona: '', descripcion: '', whatsapp: '', link_maps: '', icono: 'zap' });
    }
  }

  const filtrados = profesionales.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.zona.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (verFormulario) {
    return (
      <div className="min-h-screen bg-white p-6">
        <button onClick={() => setVerFormulario(false)} className="mb-8 flex items-center gap-2 text-slate-500 font-bold uppercase text-xs tracking-widest">
          <Icons.ChevronLeft size={20} /> Volver
        </button>
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter">Sumar mi <span className="text-indigo-600">Negocio</span></h2>
          <p className="text-slate-400 mb-8 text-sm">El administrador asignará tu icono profesional.</p>
          <form onSubmit={crearProfesional} className="space-y-4">
            <input type="text" placeholder="Nombre del Negocio" className="w-full p-5 bg-slate-50 rounded-[20px] border-none outline-none" onChange={e => setNuevoPro({...nuevoPro, nombre: e.target.value})} required />
            <input type="text" placeholder="Categoría (Ej: Plomero, Abogado)" className="w-full p-5 bg-slate-50 rounded-[20px] border-none outline-none" onChange={e => setNuevoPro({...nuevoPro, categoria: e.target.value})} required />
            <input type="text" placeholder="Barrio de Concepción" className="w-full p-5 bg-slate-50 rounded-[20px] border-none outline-none" onChange={e => setNuevoPro({...nuevoPro, zona: e.target.value})} required />
            <input type="text" placeholder="WhatsApp (Ej: 595983...)" className="w-full p-5 bg-slate-50 rounded-[20px] border-none outline-none" onChange={e => setNuevoPro({...nuevoPro, whatsapp: e.target.value})} required />
            <input type="text" placeholder="Link de Google Maps (Ubicación)" className="w-full p-5 bg-slate-50 rounded-[20px] border-none outline-none" onChange={e => setNuevoPro({...nuevoPro, link_maps: e.target.value})} />
            <button type="submit" className="w-full bg-slate-900 text-white p-6 rounded-[25px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all mt-4">
              Enviar Solicitud
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans">
      {/* HEADER GRANDE Y PROFESIONAL */}
      <header className="bg-white border-b border-slate-100 px-6 py-10 text-center shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          {/* LOGO CC */}
          <div className="mb-4 relative">
             <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl rotate-3 transform">
                <span className="text-white font-black text-2xl tracking-tighter uppercase -rotate-3">CC</span>
             </div>
             <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-lg flex items-center justify-center border-4 border-white">
                <Icons.Zap size={10} className="text-white fill-white" />
             </div>
          </div>

          <h1 className="font-black text-4xl tracking-tighter uppercase mb-2 italic">
            Conexión <span className="text-indigo-600">Concepción</span>
          </h1>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em] max-w-xs leading-relaxed">
            Tu Directorio Local de Profesionales y Servicios
          </p>

          <button onClick={() => setEsAdmin(!esAdmin)} className="mt-6 text-[9px] font-black px-4 py-2 rounded-full border border-slate-200 text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all">
             {esAdmin ? 'Panel Admin Activo' : 'Acceso Limitado'}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* BUSCADOR */}
        <div className="relative mb-12">
          <Icons.Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20}/>
          <input 
            type="text" 
            placeholder="Buscar por rubro o nombre..." 
            className="w-full pl-16 pr-8 py-6 bg-white border-none rounded-[30px] shadow-2xl shadow-indigo-100/40 text-lg outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="space-y-6">
          {filtrados.map((p) => (
            <div key={p.id} className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                  <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[30px] flex items-center justify-center shrink-0">
                    <IconoDinamico nombre={p.icono || 'zap'} size={38} />
                  </div>
                  <div>
                    <h2 className="font-black text-2xl text-slate-800 tracking-tight flex items-center justify-center sm:justify-start gap-2">
                      {p.nombre}
                      {p.es_verificado && <Icons.BadgeCheck size={20} className="text-indigo-500 fill-indigo-50" />}
                    </h2>
                    <p className="text-indigo-600 text-xs font-black uppercase tracking-[0.2em] mb-3">{p.categoria}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                        <span className="bg-slate-50 text-slate-400 text-[10px] font-bold px-3 py-1.5 rounded-full border border-slate-100 uppercase">
                          {p.zona}
                        </span>
                        <span className="text-indigo-300 text-[10px] font-bold uppercase flex items-center gap-1">
                          <Icons.Zap size={10} className="fill-indigo-300"/> {p.clics || 0} clics
                        </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  {/* BOTÓN WHATSAPP ESTILO OFICIAL */}
                  <button 
                    onClick={() => registrarClic(p.id, p.whatsapp)}
                    className="flex-1 sm:flex-none bg-[#25D366] text-white px-8 py-5 rounded-[22px] hover:bg-[#128C7E] transition-all flex items-center justify-center shadow-lg shadow-green-100 active:scale-95"
                  >
                    <Icons.MessageCircle size={28} className="fill-white/20" />
                  </button>
                  
                  {/* BOTÓN MAPS DINÁMICO */}
                  <a 
                    href={p.link_maps || "#"} 
                    target={p.link_maps ? "_blank" : "_self"}
                    onClick={(e) => !p.link_maps && e.preventDefault()}
                    className={`px-6 py-5 rounded-[22px] border-2 transition-all flex items-center justify-center ${
                      p.link_maps 
                      ? "bg-white border-indigo-100 text-indigo-500 hover:border-indigo-400 hover:bg-indigo-50 shadow-sm" 
                      : "bg-slate-50 border-slate-100 text-slate-200 cursor-not-allowed"
                    }`}
                  >
                    <Icons.MapPinned size={26} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-20 text-center">
        <button onClick={() => setVerFormulario(true)} className="bg-slate-900 text-white px-12 py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-600 hover:-translate-y-1 transition-all">
          Registrar Negocio
        </button>
        <div className="mt-16 opacity-20 font-black text-[10px] tracking-[0.5em] uppercase">
          Conexión Concepción • Paraguay
        </div>
      </footer>
    </div>
  );
}

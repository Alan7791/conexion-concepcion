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
    // Al insertar, el icono por defecto es 'zap', luego tú lo cambias en la base de datos
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
          <p className="text-slate-400 mb-8 text-sm">Completa los datos para aparecer en el directorio.</p>
          <form onSubmit={crearProfesional} className="space-y-4">
            <input type="text" placeholder="Nombre del Negocio" className="w-full p-5 bg-slate-50 rounded-[20px] border-none focus:ring-2 focus:ring-indigo-100 outline-none" onChange={e => setNuevoPro({...nuevoPro, nombre: e.target.value})} required />
            <input type="text" placeholder="Categoría (Ej: Plomero, Abogado)" className="w-full p-5 bg-slate-50 rounded-[20px] border-none focus:ring-2 focus:ring-indigo-100 outline-none" onChange={e => setNuevoPro({...nuevoPro, categoria: e.target.value})} required />
            <input type="text" placeholder="Barrio de Concepción" className="w-full p-5 bg-slate-50 rounded-[20px] border-none focus:ring-2 focus:ring-indigo-100 outline-none" onChange={e => setNuevoPro({...nuevoPro, zona: e.target.value})} required />
            <input type="text" placeholder="WhatsApp (Ej: 595983...)" className="w-full p-5 bg-slate-50 rounded-[20px] border-none focus:ring-2 focus:ring-indigo-100 outline-none" onChange={e => setNuevoPro({...nuevoPro, whatsapp: e.target.value})} required />
            <input type="text" placeholder="Link de Google Maps (Ubicación)" className="w-full p-5 bg-slate-50 rounded-[20px] border-none focus:ring-2 focus:ring-indigo-100 outline-none" onChange={e => setNuevoPro({...nuevoPro, link_maps: e.target.value})} />
            
            {/* EL CAMPO DE ICONO SE HA ELIMINADO PARA EL CLIENTE */}

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
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
              <Icons.Zap size={20} className="text-white fill-white" />
            </div>
            <h1 className="font-black text-xl tracking-tighter uppercase italic">Conexión <span className="text-indigo-600 font-black">Concepción</span></h1>
          </div>
          <button onClick={() => setEsAdmin(!esAdmin)} className={`text-[10px] font-black px-4 py-2 rounded-full border transition-all ${esAdmin ? 'bg-red-50 border-red-100 text-red-500' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
            MODO: {esAdmin ? 'ADMINISTRADOR' : 'VISUALIZADOR'}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="relative mb-12 group">
          <Icons.Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20}/>
          <input 
            type="text" 
            placeholder="¿Qué servicio buscas hoy?" 
            className="w-full pl-16 pr-8 py-6 bg-white border-none rounded-[30px] shadow-2xl shadow-indigo-100/20 text-lg outline-none"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="space-y-6">
          {filtrados.map((p) => (
            <div key={p.id} className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* ICONO DINÁMICO (Tú lo controlas desde Supabase) */}
                  <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[30px] flex items-center justify-center shrink-0">
                    <IconoDinamico nombre={p.icono || 'zap'} size={38} />
                  </div>
                  <div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                      <h2 className="font-black text-2xl text-slate-800 tracking-tight">{p.nombre}</h2>
                      {p.es_verificado && <Icons.BadgeCheck size={20} className="text-indigo-500 fill-indigo-50" />}
                    </div>
                    <p className="text-indigo-600 text-xs font-black uppercase tracking-[0.2em] mb-3">{p.categoria}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-4 text-slate-500 font-bold text-[11px] uppercase">
                      <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                        <Icons.MapPin size={12} className="text-slate-400"/> {p.zona}
                      </div>
                      <div className="flex items-center gap-1.5 text-indigo-400">
                        <Icons.Zap size={12} className="fill-indigo-400"/> {p.clics || 0} visitas
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => registrarClic(p.id, p.whatsapp)}
                    className="flex-1 sm:flex-none bg-slate-900 text-white px-8 py-5 rounded-[22px] hover:bg-indigo-600 transition-all flex items-center justify-center shadow-lg"
                  >
                    <Icons.MessageCircle size={26} />
                  </button>
                  
                  {p.link_maps && (
                    <a 
                      href={p.link_maps} 
                      target="_blank" 
                      className="px-6 bg-white border-2 border-slate-100 text-slate-400 rounded-[22px] hover:border-indigo-200 hover:text-indigo-500 transition-all flex items-center justify-center shadow-sm"
                      title="Abrir ubicación en Google Maps"
                    >
                      {/* ICONO DE MAPPIN QUE REEMPLAZA AL ANTERIOR */}
                      <Icons.MapPinned size={26} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-20 text-center">
        <button onClick={() => setVerFormulario(true)} className="mb-12 bg-white text-slate-900 border-2 border-slate-100 px-10 py-5 rounded-[25px] font-black text-xs uppercase tracking-[0.2em] shadow-sm hover:border-indigo-500 transition-all">
          Registrar nuevo negocio
        </button>
        <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">Conexión Concepción &copy; 2026</p>
      </footer>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as Icons from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// --- ICONOS DINÁMICOS ---
const IconoDinamico = ({ nombre, size = 20, className = "" }: { nombre: string, size?: number, className?: string }) => {
  const nombreFormateado = (nombre.charAt(0).toUpperCase() + nombre.slice(1)) as keyof typeof Icons;
  const LucideIcon = (Icons[nombreFormateado] as React.ElementType) || Icons.HelpCircle;
  return <LucideIcon size={size} className={className} />;
};

export default function App() {
  const [profesionales, setProfesionales] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [verFormulario, setVerFormulario] = useState(false);
  const [enviado, setEnviado] = useState(false); // Estado para el confeti/éxito
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
      setEnviado(true);
      // Efecto de espera antes de volver al inicio
      setTimeout(() => {
        setEnviado(false);
        setVerFormulario(false);
        fetchProfesionales();
        setNuevoPro({ nombre: '', categoria: '', zona: '', descripcion: '', whatsapp: '', link_maps: '', icono: 'zap' });
      }, 3000);
    }
  }

  const filtrados = profesionales.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.zona.toLowerCase().includes(busqueda.toLowerCase())
  );

  // --- VISTA DE ÉXITO (CONFETI SIMULADO) ---
  if (enviado) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="relative">
          <div className="bg-green-100 p-8 rounded-[40px] mb-6 animate-bounce">
            <Icons.CheckCircle2 size={60} className="text-green-500" />
          </div>
          {/* Partículas de "Confeti" */}
          <Icons.Zap size={20} className="absolute -top-4 -left-4 text-yellow-400 animate-ping" />
          <Icons.Star size={20} className="absolute -bottom-4 -right-4 text-indigo-400 animate-ping" />
          <Icons.Heart size={20} className="absolute top-1/2 -right-10 text-red-400 animate-bounce" />
        </div>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-2">¡Recibido!</h2>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Tu negocio será verificado pronto</p>
      </div>
    );
  }

  // --- FORMULARIO DE REGISTRO ---
  if (verFormulario) {
    return (
      <div className="min-h-screen bg-white p-8 animate-in slide-in-from-bottom-6 duration-700">
        <button onClick={() => setVerFormulario(false)} className="mb-10 flex items-center gap-2 text-slate-300 font-black uppercase text-[10px] tracking-[0.4em] hover:text-indigo-600 transition-all">
          <Icons.ArrowLeft size={16} /> Volver
        </button>
        <div className="max-w-md mx-auto">
          <div className="w-16 h-1 bg-indigo-600 mb-8 rounded-full"></div>
          <h2 className="text-5xl font-black mb-12 uppercase tracking-tighter leading-none italic">Únete a la <br/><span className="text-indigo-600">Red.</span></h2>
          <form onSubmit={crearProfesional} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Nombre del Negocio</label>
              <input type="text" className="w-full p-6 bg-slate-50 rounded-[28px] border-2 border-transparent focus:border-indigo-100 outline-none transition-all font-bold" onChange={e => setNuevoPro({...nuevoPro, nombre: e.target.value})} required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Tu Especialidad</label>
              <input type="text" className="w-full p-6 bg-slate-50 rounded-[28px] border-2 border-transparent focus:border-indigo-100 outline-none transition-all font-bold" onChange={e => setNuevoPro({...nuevoPro, categoria: e.target.value})} required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">WhatsApp Oficial</label>
              <input type="text" className="w-full p-6 bg-slate-50 rounded-[28px] border-2 border-transparent focus:border-indigo-100 outline-none transition-all font-bold" onChange={e => setNuevoPro({...nuevoPro, whatsapp: e.target.value})} required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Barrio / Zona</label>
              <input type="text" className="w-full p-6 bg-slate-50 rounded-[28px] border-2 border-transparent focus:border-indigo-100 outline-none transition-all font-bold" onChange={e => setNuevoPro({...nuevoPro, zona: e.target.value})} required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Link de Google Maps</label>
              <input type="text" className="w-full p-6 bg-slate-50 rounded-[28px] border-2 border-transparent focus:border-indigo-100 outline-none transition-all font-bold" onChange={e => setNuevoPro({...nuevoPro, link_maps: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white p-7 rounded-[35px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-600 transition-all mt-8 active:scale-95">
              Confirmar Registro
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* HEADER PREMIUM */}
      <header className="bg-white border-b border-slate-100 px-6 py-16 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-50/50 via-transparent to-transparent -z-10"></div>
        
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          {/* LOGO CC MEJORADO */}
          <div className="mb-10 group relative cursor-pointer">
             <div className="w-24 h-24 bg-slate-900 rounded-[38px] flex items-center justify-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] rotate-12 group-hover:rotate-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] relative overflow-hidden border-b-[6px] border-indigo-900">
                <span className="text-white font-black text-4xl tracking-tighter relative z-10">CC</span>
                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover:left-full transition-all duration-[1500ms]"></div>
             </div>
             <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl">
                <Icons.Zap size={16} className="text-white fill-white animate-pulse" />
             </div>
          </div>

          <h1 className="font-black text-5xl sm:text-7xl tracking-[-0.06em] uppercase mb-6 italic leading-[0.85]">
            Conexión <br /> <span className="text-indigo-600">Concepción</span>
          </h1>
          <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.6em] max-w-xs leading-relaxed opacity-50">
            Directorio Exclusivo de Servicios
          </p>

          <button onClick={() => setEsAdmin(!esAdmin)} className="mt-12 text-[9px] font-black px-6 py-2.5 rounded-full border border-slate-200 text-slate-300 uppercase tracking-[0.4em] hover:border-indigo-400 hover:text-indigo-600 transition-all active:scale-95">
             {esAdmin ? 'Panel de Gestión' : 'Acceso Verificado'}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16">
        {/* BUSCADOR CON SOMBRA SUAVE */}
        <div className="relative mb-20">
          <Icons.Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" size={24}/>
          <input 
            type="text" 
            placeholder="¿A quién necesitas?" 
            className="w-full pl-20 pr-10 py-8 bg-white border border-slate-100 rounded-[45px] shadow-[0_20px_60px_rgba(79,70,229,0.06)] text-xl outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-100 transition-all duration-500 placeholder:text-slate-200 font-bold"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* LISTADO */}
        <div className="space-y-12">
          {filtrados.map((p) => (
            <div key={p.id} className="group bg-white rounded-[55px] p-10 border border-slate-50 shadow-[0_4px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_50px_100px_rgba(79,70,229,0.18)] hover:-translate-y-3 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-10">
                
                <div className="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
                  <div className="w-28 h-28 bg-gradient-to-br from-indigo-50/50 to-white text-indigo-600 rounded-[40px] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                    <IconoDinamico nombre={p.icono || 'zap'} size={48} />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                      <h2 className="font-black text-4xl text-slate-800 tracking-tight leading-none">{p.nombre}</h2>
                      {p.es_verificado && (
                        <div className="text-white bg-indigo-600 p-1.5 rounded-full shadow-lg shadow-indigo-200">
                          <Icons.BadgeCheck size={18} />
                        </div>
                      )}
                    </div>
                    <p className="text-indigo-600 text-[12px] font-black uppercase tracking-[0.4em] mb-6 opacity-80 italic">{p.categoria}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                        <span className="bg-slate-50 text-slate-400 text-[10px] font-black px-5 py-2.5 rounded-full border border-slate-100 uppercase tracking-[0.2em]">
                          {p.zona}
                        </span>
                        <div className="flex items-center gap-2 text-indigo-300 text-[11px] font-black uppercase">
                          <Icons.Zap size={14} className="fill-indigo-300 animate-pulse"/> {p.clics || 0}
                        </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 w-full sm:w-auto items-center">
                  <button 
                    onClick={() => registrarClic(p.id, p.whatsapp)}
                    className="w-full sm:w-28 h-28 bg-[#25D366] text-white rounded-[40px] hover:bg-slate-900 transition-all duration-500 flex items-center justify-center shadow-[0_20px_40px_rgba(37,211,102,0.25)] hover:shadow-2xl active:scale-90 group/btn"
                  >
                    <Icons.MessageCircle size={42} className="fill-white/10 group-hover/btn:scale-110 transition-all duration-500" />
                  </button>
                  
                  <a 
                    href={p.link_maps || "#"} 
                    target={p.link_maps ? "_blank" : "_self"}
                    onClick={(e) => !p.link_maps && e.preventDefault()}
                    className={`w-full sm:w-28 h-16 rounded-[30px] border-2 transition-all duration-700 flex items-center justify-center ${
                      p.link_maps 
                      ? "bg-white border-slate-100 text-slate-400 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 shadow-sm" 
                      : "bg-slate-50 border-slate-50 text-slate-100 cursor-not-allowed opacity-30"
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

      <footer className="py-48 text-center bg-white mt-40 border-t border-slate-50">
        <button onClick={() => { setVerFormulario(true); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="group relative bg-slate-900 text-white px-20 py-10 rounded-[50px] font-black text-xs uppercase tracking-[0.6em] shadow-[0_30px_100px_rgba(0,0,0,0.15)] hover:shadow-indigo-500/40 transition-all duration-700 hover:-translate-y-4">
          <span className="relative z-10">Registrar mi Negocio</span>
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700 to-indigo-500 translate-y-full group-hover:translate-y-0 transition-transform duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]"></div>
        </button>
        <div className="mt-32 opacity-10 font-black text-[12px] tracking-[1.5em] uppercase">Concepción • PY</div>
      </footer>
    </div>
  );
}

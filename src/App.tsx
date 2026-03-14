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
      <div className="min-h-screen bg-white p-8 animate-in fade-in duration-500">
        <button onClick={() => setVerFormulario(false)} className="mb-10 flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] hover:text-indigo-600 transition-colors">
          <Icons.ChevronLeft size={18} /> Volver al Inicio
        </button>
        <div className="max-w-md mx-auto text-center">
          <div className="inline-block p-4 bg-indigo-50 rounded-3xl mb-6">
            <Icons.Store size={32} className="text-indigo-600" />
          </div>
          <h2 className="text-4xl font-black mb-3 uppercase tracking-tighter italic">Suma tu <span className="text-indigo-600">Marca</span></h2>
          <p className="text-slate-400 mb-10 text-sm font-medium">Únete a la red más grande de Concepción.</p>
          <form onSubmit={crearProfesional} className="space-y-4">
            <input type="text" placeholder="Nombre Comercial" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-100 focus:bg-white outline-none transition-all" onChange={e => setNuevoPro({...nuevoPro, nombre: e.target.value})} required />
            <input type="text" placeholder="¿A qué te dedicas? (Ej: Odontólogo)" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-100 focus:bg-white outline-none transition-all" onChange={e => setNuevoPro({...nuevoPro, categoria: e.target.value})} required />
            <input type="text" placeholder="Barrio o Localidad" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-100 focus:bg-white outline-none transition-all" onChange={e => setNuevoPro({...nuevoPro, zona: e.target.value})} required />
            <input type="text" placeholder="WhatsApp (Ej: 595981...)" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-100 focus:bg-white outline-none transition-all" onChange={e => setNuevoPro({...nuevoPro, whatsapp: e.target.value})} required />
            <input type="text" placeholder="Link de Google Maps" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-100 focus:bg-white outline-none transition-all" onChange={e => setNuevoPro({...nuevoPro, link_maps: e.target.value})} />
            <button type="submit" className="w-full bg-slate-900 text-white p-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:bg-indigo-600 transition-all transform hover:scale-[1.02] active:scale-95 mt-6">
              Enviar para Revisión
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans selection:bg-indigo-100">
      {/* HEADER ELEGANTE */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-slate-100 px-6 py-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-100/30 blur-[100px] rounded-full -z-10"></div>
        
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          {/* LOGO CC CON BRILLO */}
          <div className="mb-6 group relative cursor-default">
             <div className="w-20 h-20 bg-slate-900 rounded-[28px] flex items-center justify-center shadow-2xl rotate-6 group-hover:rotate-0 transition-transform duration-500 relative overflow-hidden">
                <span className="text-white font-black text-3xl tracking-tighter uppercase relative z-10">CC</span>
                {/* Efecto de brillo metálico */}
                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000"></div>
             </div>
             <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center border-4 border-white shadow-lg animate-bounce">
                <Icons.Zap size={14} className="text-white fill-white" />
             </div>
          </div>

          <h1 className="font-black text-5xl tracking-[ -0.05em] uppercase mb-4 italic leading-tight">
            Conexión <br /> <span className="text-indigo-600 underline decoration-indigo-100 decoration-8 underline-offset-4">Concepción</span>
          </h1>
          <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.4em] max-w-xs leading-relaxed opacity-70">
            Directorio Exclusivo de Servicios locales
          </p>

          <button onClick={() => setEsAdmin(!esAdmin)} className="mt-8 text-[9px] font-black px-5 py-2 rounded-full border border-slate-200 text-slate-300 uppercase tracking-[0.2em] hover:border-indigo-200 hover:text-indigo-400 transition-all active:scale-95">
             {esAdmin ? 'Modo Gestión Activo' : 'Verificación Oficial'}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* BUSCADOR NEOMÓRFICO */}
        <div className="relative mb-16 group">
          <Icons.Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors duration-300" size={22}/>
          <input 
            type="text" 
            placeholder="¿A quién necesitas hoy?" 
            className="w-full pl-16 pr-8 py-7 bg-white border-none rounded-[35px] shadow-[0_20px_50px_rgba(79,70,229,0.08)] text-xl outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-200 font-medium"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="space-y-8">
          {filtrados.map((p) => (
            <div key={p.id} className="group bg-white rounded-[45px] p-8 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-slate-50 hover:shadow-[0_30px_60px_rgba(79,70,229,0.12)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
                
                <div className="flex flex-col sm:flex-row items-center gap-7 text-center sm:text-left">
                  {/* ICONO CON EFECTO GLASS */}
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-slate-50 text-indigo-600 rounded-[35px] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <IconoDinamico nombre={p.icono || 'zap'} size={42} />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                      <h2 className="font-black text-3xl text-slate-800 tracking-tight">{p.nombre}</h2>
                      {p.es_verificado && (
                        <div className="text-indigo-500 p-1 bg-indigo-50 rounded-full">
                          <Icons.BadgeCheck size={20} className="fill-indigo-50" />
                        </div>
                      )}
                    </div>
                    <p className="text-indigo-600 text-xs font-black uppercase tracking-[0.25em] mb-4 opacity-80">{p.categoria}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                        <span className="bg-slate-50 text-slate-400 text-[10px] font-black px-4 py-2 rounded-full border border-slate-100 uppercase tracking-widest">
                          {p.zona}
                        </span>
                        <div className="flex items-center gap-1.5 text-indigo-300 text-[10px] font-black uppercase tracking-tighter">
                          <Icons.Zap size={12} className="fill-indigo-300 animate-pulse"/> {p.clics || 0} visitas
                        </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full sm:w-auto">
                  {/* BOTÓN WHATSAPP ELEGANTE */}
                  <button 
                    onClick={() => registrarClic(p.id, p.whatsapp)}
                    className="w-full sm:w-20 h-20 bg-[#25D366] text-white rounded-[28px] hover:bg-slate-900 transition-all flex items-center justify-center shadow-xl shadow-green-100 hover:shadow-slate-200 active:scale-90 group/btn"
                  >
                    <Icons.MessageCircle size={32} className="fill-white/10 group-hover/btn:scale-110 transition-transform" />
                  </button>
                  
                  {/* BOTÓN MAPS MINIMALISTA */}
                  <a 
                    href={p.link_maps || "#"} 
                    target={p.link_maps ? "_blank" : "_self"}
                    onClick={(e) => !p.link_maps && e.preventDefault()}
                    className={`w-full sm:w-20 h-16 rounded-[25px] border-2 transition-all flex items-center justify-center ${
                      p.link_maps 
                      ? "bg-white border-slate-100 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 shadow-sm" 
                      : "bg-slate-50 border-slate-50 text-slate-200 cursor-not-allowed"
                    }`}
                  >
                    <Icons.MapPinned size={24} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-32 text-center relative overflow-hidden">
        <div className="max-w-xs mx-auto mb-10 h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        <button onClick={() => setVerFormulario(true)} className="group relative bg-slate-900 text-white px-14 py-7 rounded-[30px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:shadow-indigo-200 transition-all overflow-hidden">
          <span className="relative z-10">Unirme al Directorio</span>
          <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        </button>
        <div className="mt-20 flex flex-col items-center gap-4 opacity-30">
          <div className="text-[10px] font-black tracking-[0.8em] uppercase">Concepción • 2026</div>
          <Icons.ShieldCheck size={20} />
        </div>
      </footer>
    </div>
  );
}

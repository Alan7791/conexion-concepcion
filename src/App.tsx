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
  const [enviado, setEnviado] = useState(false);
  const [esAdmin, setEsAdmin] = useState(false);
  const [nuevoPro, setNuevoPro] = useState({ 
    nombre: '', categoria: '', zona: '', descripcion: '', whatsapp: '', link_maps: '', icono: 'zap' 
  });

  useEffect(() => { fetchProfesionales(); }, []);

  async function fetchProfesionales() {
    const { data, error } = await supabase.from('profesionales').select('*').order('created_at', { ascending: false });
    if (!error) setProfesionales(data || []);
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
      setTimeout(() => {
        setEnviado(false); setVerFormulario(false); fetchProfesionales();
        setNuevoPro({ nombre: '', categoria: '', zona: '', descripcion: '', whatsapp: '', link_maps: '', icono: 'zap' });
      }, 2500);
    }
  }

  const filtrados = profesionales.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (enviado) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
          <Icons.Check size={32} strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-black tracking-tight uppercase mb-2 text-center">Datos Recibidos</h2>
        <p className="text-slate-500 tracking-[0.2em] text-[10px] font-bold text-center italic">PROCESANDO VERIFICACIÓN</p>
      </div>
    );
  }

  if (verFormulario) {
    return (
      <div className="min-h-screen bg-white p-6 md:p-12 animate-in slide-in-from-bottom-8 duration-500">
        <button onClick={() => setVerFormulario(false)} className="group flex items-center gap-3 text-slate-900 font-black text-[10px] tracking-widest uppercase mb-12">
          <div className="p-2 bg-slate-100 rounded-full"><Icons.ArrowLeft size={14} /></div> Volver al Inicio
        </button>
        <div className="max-w-xl mx-auto">
          <h2 className="text-4xl font-black tracking-tighter leading-tight mb-8 uppercase italic">Registrar <br/><span className="text-indigo-600">Nuevo Negocio</span></h2>
          <form onSubmit={crearProfesional} className="grid grid-cols-1 gap-4">
            <input type="text" placeholder="NOMBRE DEL NEGOCIO" className="p-5 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-sm" onChange={e => setNuevoPro({...nuevoPro, nombre: e.target.value})} required />
            <input type="text" placeholder="RUBRO (EJ: PLOMERO, ABOGADO)" className="p-5 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-sm" onChange={e => setNuevoPro({...nuevoPro, categoria: e.target.value})} required />
            <input type="text" placeholder="WHATSAPP (CON CÓDIGO DE PAÍS)" className="p-5 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-sm" onChange={e => setNuevoPro({...nuevoPro, whatsapp: e.target.value})} required />
            <input type="text" placeholder="ZONA / BARRIO" className="p-5 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-sm" onChange={e => setNuevoPro({...nuevoPro, zona: e.target.value})} required />
            <input type="text" placeholder="LINK DE UBICACIÓN (MAPS)" className="p-5 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-sm" onChange={e => setNuevoPro({...nuevoPro, link_maps: e.target.value})} />
            <button type="submit" className="bg-slate-900 text-white p-6 rounded-xl font-black text-xs uppercase tracking-[0.4em] hover:bg-indigo-600 transition-all active:scale-95 shadow-xl mt-4">Confirmar Registro</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1a1a1a] font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* HEADER COMPACTO Y ELEGANTE */}
      <header className="px-6 py-12 md:py-20 flex flex-col items-center text-center bg-white border-b border-slate-100">
        <div className="mb-6 relative group cursor-pointer">
          <div className="w-20 h-20 bg-slate-900 rounded-[28px] flex items-center justify-center shadow-xl transition-all duration-700 group-hover:rotate-[360deg]">
            <span className="text-white font-black text-3xl tracking-tighter">CC</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center border-4 border-white shadow-lg">
            <Icons.Zap size={14} className="text-white fill-white" />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none mb-4">
          Conexión <br /> <span className="text-indigo-600">Concepción</span>
        </h1>
        <p className="text-slate-400 font-black text-[9px] tracking-[0.4em] uppercase opacity-70">
          Directorio Profesional Local • 2026
        </p>

        <button onClick={() => setEsAdmin(!esAdmin)} className="mt-8 text-[8px] font-black px-4 py-1.5 rounded-full border border-slate-200 text-slate-300 uppercase tracking-widest hover:border-black hover:text-black transition-all">
          {esAdmin ? 'SISTEMA ACTIVO' : 'DIRECTORIO VERIFICADO'}
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* BUSCADOR REFINADO */}
        <div className="relative mb-16">
          <input 
            type="text" 
            placeholder="¿A qué profesional buscas?" 
            className="w-full bg-white border border-slate-100 rounded-2xl py-6 pl-14 pr-6 text-xl font-bold shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-100 transition-all placeholder:text-slate-200"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Icons.Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
        </div>

        {/* LISTADO UNIFORME */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtrados.map((p) => (
            <div key={p.id} className="group bg-white p-7 rounded-[35px] border border-slate-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                    <IconoDinamico nombre={p.icono || 'zap'} size={28} />
                  </div>
                  {p.es_verificado && <Icons.BadgeCheck size={24} className="text-indigo-500 fill-indigo-50" />}
                </div>
                
                <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase mb-1">{p.nombre}</h2>
                <p className="text-indigo-600 font-black text-[10px] tracking-widest uppercase mb-6 opacity-60 italic">{p.categoria}</p>
                
                <div className="flex gap-3 mb-8">
                  <span className="text-[9px] font-black px-3 py-1.5 bg-slate-50 rounded-lg uppercase tracking-widest text-slate-400">
                    {p.zona}
                  </span>
                  <span className="text-[9px] font-black px-3 py-1.5 bg-indigo-50 text-indigo-400 rounded-lg uppercase tracking-widest flex items-center gap-1.5">
                    <Icons.Zap size={10} className="fill-indigo-400"/> {p.clics || 0} clics
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => registrarClic(p.id, p.whatsapp)}
                  className="flex-1 bg-slate-900 text-white h-16 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#25D366] transition-all duration-500 shadow-lg active:scale-95"
                >
                  <Icons.MessageCircle size={20} className="fill-white/10" />
                  <span className="font-black text-[10px] tracking-widest uppercase">WhatsApp</span>
                </button>
                
                {p.link_maps && (
                  <a href={p.link_maps} target="_blank" className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all duration-500">
                    <Icons.MapPinned size={20} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-24 px-6 text-center bg-white border-t border-slate-100">
        <h3 className="text-3xl font-black tracking-tight uppercase mb-8">Suma tu negocio a <span className="text-indigo-600 italic">Conexión</span></h3>
        <button onClick={() => { setVerFormulario(true); window.scrollTo(0,0); }} className="bg-slate-900 text-white px-10 py-5 rounded-xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-indigo-600 transition-all">
          Registrar Ahora
        </button>
        <div className="mt-20 opacity-20 font-black text-[9px] tracking-[0.8em] uppercase">
          Concepción • Paraguay
        </div>
      </footer>
    </div>
  );
}

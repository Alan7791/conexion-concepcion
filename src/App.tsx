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
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(79,70,229,0.5)]">
          <Icons.Check size={40} strokeWidth={3} />
        </div>
        <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Solicitud Enviada</h2>
        <p className="text-slate-500 tracking-[0.3em] text-[10px] font-bold">PROCESANDO VERIFICACIÓN</p>
      </div>
    );
  }

  if (verFormulario) {
    return (
      <div className="min-h-screen bg-white p-8 md:p-20 animate-in slide-in-from-right duration-700">
        <button onClick={() => setVerFormulario(false)} className="group flex items-center gap-4 text-slate-900 font-black text-xs tracking-widest uppercase mb-20">
          <div className="p-3 bg-slate-100 rounded-full group-hover:bg-black group-hover:text-white transition-all"><Icons.ArrowLeft size={16} /></div> Volver
        </button>
        <div className="max-w-2xl">
          <h2 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.8] mb-12 uppercase italic">Suma tu <br/><span className="text-indigo-600">Potencial.</span></h2>
          <form onSubmit={crearProfesional} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="NOMBRE COMERCIAL" className="p-6 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-100 font-bold" onChange={e => setNuevoPro({...nuevoPro, nombre: e.target.value})} required />
            <input type="text" placeholder="RUBRO / ESPECIALIDAD" className="p-6 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-100 font-bold" onChange={e => setNuevoPro({...nuevoPro, categoria: e.target.value})} required />
            <input type="text" placeholder="WHATSAPP (595...)" className="p-6 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-100 font-bold" onChange={e => setNuevoPro({...nuevoPro, whatsapp: e.target.value})} required />
            <input type="text" placeholder="BARRIO" className="p-6 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-100 font-bold" onChange={e => setNuevoPro({...nuevoPro, zona: e.target.value})} required />
            <input type="text" placeholder="LINK GOOGLE MAPS" className="col-span-1 md:col-span-2 p-6 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-100 font-bold" onChange={e => setNuevoPro({...nuevoPro, link_maps: e.target.value})} />
            <button type="submit" className="col-span-1 md:col-span-2 bg-black text-white p-8 rounded-2xl font-black text-xs uppercase tracking-[0.5em] hover:bg-indigo-600 transition-all active:scale-95 shadow-2xl">Confirmar Registro</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1a1a1a] font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* HEADER TIPO MARCA DE LUJO */}
      <header className="px-6 py-20 md:py-32 flex flex-col items-center text-center border-b border-slate-100 bg-white">
        <div className="mb-12 relative group cursor-pointer">
          <div className="w-28 h-28 bg-black rounded-[40px] flex items-center justify-center shadow-2xl transition-all duration-700 group-hover:rotate-[360deg] group-hover:rounded-full">
            <span className="text-white font-black text-4xl tracking-tighter">CC</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl animate-pulse">
            <Icons.Zap size={18} className="text-white fill-white" />
          </div>
        </div>

        <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.8] mb-6">
          Conexión <br /> <span className="text-indigo-600">Concepción</span>
        </h1>
        <p className="text-slate-400 font-black text-[10px] md:text-xs tracking-[0.6em] uppercase opacity-60">
          The Official Local Directory • 2026
        </p>

        <button onClick={() => setEsAdmin(!esAdmin)} className="mt-12 text-[8px] font-black px-6 py-2 rounded-full border border-slate-200 text-slate-300 uppercase tracking-widest hover:text-black hover:border-black transition-all">
          {esAdmin ? 'ACCESS GRANTED' : 'SYSTEM VERIFIED'}
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20">
        {/* BUSCADOR MINIMALISTA */}
        <div className="relative mb-32 group">
          <input 
            type="text" 
            placeholder="Search Professionals..." 
            className="w-full bg-transparent border-b-4 border-slate-100 py-10 text-4xl md:text-6xl font-black outline-none placeholder:text-slate-100 focus:border-indigo-600 transition-all duration-700 uppercase tracking-tighter"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Icons.ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-indigo-600 transition-all" size={40} />
        </div>

        {/* LISTADO TIPO GALERÍA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtrados.map((p) => (
            <div key={p.id} className="group bg-white p-10 rounded-[60px] border border-slate-50 shadow-sm hover:shadow-[0_40px_100px_rgba(0,0,0,0.08)] hover:-translate-y-4 transition-all duration-700 flex flex-col justify-between min-h-[450px]">
              <div>
                <div className="flex justify-between items-start mb-12">
                  <div className="w-24 h-24 bg-slate-50 text-indigo-600 rounded-[40px] flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-700">
                    <IconoDinamico nombre={p.icono || 'zap'} size={40} />
                  </div>
                  {p.es_verificado && <Icons.BadgeCheck size={32} className="text-indigo-500 fill-indigo-50" />}
                </div>
                
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2 leading-none">{p.nombre}</h2>
                <p className="text-indigo-600 font-black text-xs tracking-widest uppercase mb-8 opacity-60 italic">{p.categoria}</p>
                
                <div className="flex gap-4">
                  <span className="text-[10px] font-black px-4 py-2 bg-slate-100 rounded-full uppercase tracking-widest text-slate-400">
                    {p.zona}
                  </span>
                  <span className="text-[10px] font-black px-4 py-2 bg-indigo-50 text-indigo-400 rounded-full uppercase tracking-widest flex items-center gap-2">
                    <Icons.Zap size={10} className="fill-indigo-400"/> {p.clics || 0}
                  </span>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <button 
                  onClick={() => registrarClic(p.id, p.whatsapp)}
                  className="flex-1 bg-black text-white h-24 rounded-[35px] flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all duration-500 shadow-xl active:scale-95"
                >
                  <Icons.MessageCircle size={28} className="fill-white/10" />
                  <span className="font-black text-xs tracking-[0.3em] uppercase">WhatsApp</span>
                </button>
                
                {p.link_maps && (
                  <a href={p.link_maps} target="_blank" className="w-24 h-24 bg-slate-50 rounded-[35px] flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-500 border border-slate-100">
                    <Icons.MapPinned size={28} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-40 px-6 text-center border-t border-slate-100 bg-white">
        <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-12">¿Tienes un <br/> <span className="text-indigo-600">Negocio?</span></h3>
        <button onClick={() => { setVerFormulario(true); window.scrollTo(0,0); }} className="group relative bg-black text-white px-16 py-8 rounded-full font-black text-xs uppercase tracking-[0.5em] shadow-2xl hover:scale-105 transition-all">
          Registrar Ahora
        </button>
        <div className="mt-32 flex flex-col items-center gap-4 opacity-20">
          <p className="text-[10px] font-black tracking-[1em] uppercase">Concepción Department • PY</p>
          <Icons.ShieldCheck size={24} />
        </div>
      </footer>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as Icons from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const IconoDinamico = ({ nombre, size = 28 }: { nombre: string, size?: number }) => {
  const nombreFormateado = (nombre.charAt(0).toUpperCase() + nombre.slice(1)) as keyof typeof Icons;
  const LucideIcon = (Icons[nombreFormateado] as React.ElementType) || Icons.Zap;
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

  const CLAVE_MAESTRA = "Concepcion2026"; 

  useEffect(() => { fetchProfesionales(); }, []);

  async function fetchProfesionales() {
    const { data, error } = await supabase.from('profesionales').select('*').order('created_at', { ascending: false });
    if (!error) setProfesionales(data || []);
  }

  async function registrarClic(id: number, whatsapp: string) {
    window.open(`https://wa.me/${whatsapp}`, '_blank');
    const { error } = await supabase.rpc('incrementar_clic', { row_id: id });
    if (error) console.error("Error técnico:", error.message);
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
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/40 animate-bounce">
          <Icons.Check size={40} strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-2">Solicitud Enviada</h2>
        <p className="text-slate-500 text-[10px] font-bold tracking-[0.5em] uppercase">Procesando Verificación</p>
      </div>
    );
  }

  if (verFormulario) {
    return (
      <div className="min-h-screen bg-white p-8 animate-in slide-in-from-bottom-10 duration-700">
        <button onClick={() => setVerFormulario(false)} className="flex items-center gap-2 font-black text-[10px] tracking-widest uppercase text-slate-400 hover:text-black mb-12 transition-all">
          <Icons.ArrowLeft size={14} /> Volver al Inicio
        </button>
        <div className="max-w-xl mx-auto">
          <h2 className="text-5xl font-black tracking-tighter italic uppercase mb-10 leading-[0.9]">
            Registrar <br/><span className="text-indigo-600">Nuevo Negocio</span>
          </h2>
          <form onSubmit={crearProfesional} className="grid gap-4">
            <input type="text" placeholder="NOMBRE DEL NEGOCIO" className="p-6 bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-bold text-sm border-none" onChange={e => setNuevoPro({...nuevoPro, nombre: e.target.value})} required />
            <input type="text" placeholder="RUBRO (EJ: MECÁNICO)" className="p-6 bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-bold text-sm border-none" onChange={e => setNuevoPro({...nuevoPro, categoria: e.target.value})} required />
            <input type="text" placeholder="WHATSAPP (5959...)" className="p-6 bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-bold text-sm border-none" onChange={e => setNuevoPro({...nuevoPro, whatsapp: e.target.value})} required />
            <input type="text" placeholder="ZONA / BARRIO" className="p-6 bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-bold text-sm border-none" onChange={e => setNuevoPro({...nuevoPro, zona: e.target.value})} required />
            <input type="text" placeholder="LINK GOOGLE MAPS" className="p-6 bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-bold text-sm border-none" onChange={e => setNuevoPro({...nuevoPro, link_maps: e.target.value})} />
            <button type="submit" className="bg-slate-900 text-white p-7 rounded-2xl font-black text-xs uppercase tracking-[0.5em] hover:bg-indigo-600 transition-all shadow-2xl active:scale-95 mt-4">Confirmar Registro</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900">
      <header className="px-6 py-20 flex flex-col items-center text-center bg-white border-b border-slate-50">
        <div className="mb-8 relative group cursor-pointer" onClick={() => {
          const p = prompt("Clave Admin:");
          if(p === CLAVE_MAESTRA) setEsAdmin(!esAdmin);
        }}>
          <div className="w-24 h-24 bg-slate-900 rounded-[35px] flex items-center justify-center shadow-2xl transition-all duration-700 group-hover:rotate-[360deg]">
            <span className="text-white font-black text-4xl tracking-tighter">CC</span>
          </div>
          <div className={`absolute -bottom-1 -right-1 w-10 h-10 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center ${esAdmin ? 'bg-green-500' : 'bg-indigo-600'}`}>
            <Icons.Zap size={18} className="text-white fill-white" />
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.85] mb-4">
          Conexión <br /> <span className="text-indigo-600">Concepción</span>
        </h1>
        <p className="text-slate-300 font-black text-[10px] tracking-[0.5em] uppercase">Directorio Local • 2026</p>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="relative mb-20 group">
          <input 
            type="text" 
            placeholder="¿Qué servicio buscas hoy?" 
            className="w-full bg-white border border-slate-100 rounded-[30px] py-8 pl-16 pr-8 text-2xl font-bold shadow-sm outline-none focus:ring-8 focus:ring-indigo-500/5 transition-all placeholder:text-slate-200"
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Icons.Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-indigo-400 transition-colors" size={28} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtrados.map((p) => (
            <div key={p.id} className="group bg-white p-8 rounded-[45px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between relative overflow-hidden">
              
              {esAdmin && (
                <div className="absolute top-6 right-6 flex gap-2 z-10">
                   <button onClick={async () => {
                     await supabase.from('profesionales').update({ es_verificado: !p.es_verificado }).eq('id', p.id);
                     fetchProfesionales();
                   }} className={`p-3 rounded-2xl ${p.es_verificado ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-300'}`}>
                     <Icons.BadgeCheck size={20} />
                   </button>
                   <button onClick={async () => {
                     if(confirm("¿Borrar?")) {
                        await supabase.from('profesionales').delete().eq('id', p.id);
                        fetchProfesionales();
                     }
                   }} className="p-3 bg-red-50 text-red-500 rounded-2xl">
                     <Icons.Trash2 size={20} />
                   </button>
                </div>
              )}

              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className="w-20 h-20 bg-slate-50 text-indigo-600 rounded-3xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                    <IconoDinamico nombre={p.icono} />
                  </div>
                  {p.es_verificado && !esAdmin && (
                    <div className="flex items-center gap-2 text-indigo-500 bg-indigo-50/50 px-4 py-2 rounded-full border border-indigo-100/50">
                      <Icons.BadgeCheck size={16} className="fill-indigo-500 text-white" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Verificado</span>
                    </div>
                  )}
                </div>
                
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-1 leading-none">{p.nombre}</h2>
                <p className="text-indigo-600 font-black text-[11px] tracking-[0.2em] uppercase mb-8 italic opacity-60">{p.categoria}</p>
                
                <div className="flex gap-3 mb-10">
                  <span className="text-[10px] font-black px-4 py-2 bg-slate-50 rounded-xl uppercase tracking-widest text-slate-400">{p.zona}</span>
                  <span className="text-[10px] font-black px-4 py-2 bg-indigo-50 text-indigo-400 rounded-xl uppercase flex items-center gap-2">
                    <Icons.Zap size={12} className="fill-indigo-400" /> {p.clics || 0} clics
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => registrarClic(p.id, p.whatsapp)}
                  className="flex-1 bg-slate-900 text-white h-20 rounded-[25px] flex items-center justify-center gap-3 hover:bg-[#25D366] transition-all duration-500 shadow-xl active:scale-95"
                >
                  <Icons.MessageCircle size={24} className="fill-white/10" />
                  <span className="font-black text-xs tracking-[0.2em] uppercase">WhatsApp</span>
                </button>
                
                {p.link_maps && (
                  <a href={p.link_maps} target="_blank" className="w-20 h-20 bg-white border-2 border-slate-50 rounded-[25px] flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all duration-500 shadow-sm">
                    <Icons.MapPinned size={28} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-32 px-6 text-center bg-white border-t border-slate-50 mt-20">
        <h3 className="text-4xl font-black tracking-tighter uppercase mb-10 italic">Lleva tu negocio <br/> al <span className="text-indigo-600 text-5xl">Próximo Nivel</span></h3>
        <button onClick={() => { setVerFormulario(true); window.scrollTo(0,0); }} className="bg-slate-900 text-white px-14 py-7 rounded-[25px] font-black text-xs uppercase tracking-[0.5em] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95">
          Registrar Ahora
        </button>
        <div className="mt-24 opacity-10 font-black text-[10px] tracking-[1.5em] uppercase">Concepción • PY</div>
      </footer>
    </div>
  );
}

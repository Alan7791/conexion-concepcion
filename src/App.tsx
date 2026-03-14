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
        <div className="w-20 h-20 md:w-28 md:h-28 bg-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/40">
          <Icons.Check size={40} strokeWidth={3} />
        </div>
        <h2 className="text-3xl md:text-5xl font-black uppercase italic italic mb-2 tracking-tighter">Enviado</h2>
        <p className="text-slate-500 text-[10px] font-bold tracking-[0.5em] uppercase">Validando Datos</p>
      </div>
    );
  }

  if (verFormulario) {
    return (
      <div className="min-h-screen bg-white p-6 md:p-16 animate-in slide-in-from-bottom-10 duration-700">
        <button onClick={() => setVerFormulario(false)} className="flex items-center gap-2 font-black text-[10px] tracking-widest uppercase text-slate-400 hover:text-black mb-12 transition-all">
          <Icons.ArrowLeft size={14} /> Volver
        </button>
        <div className="max-w-xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase mb-10 leading-none">
            Sumar <br/><span className="text-indigo-600">Negocio</span>
          </h2>
          <form onSubmit={crearProfesional} className="grid gap-4">
            <input type="text" placeholder="NOMBRE DEL NEGOCIO" className="p-5 md:p-7 bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-bold text-sm border-none shadow-inner" onChange={e => setNuevoPro({...nuevoPro, nombre: e.target.value})} required />
            <input type="text" placeholder="RUBRO (EJ: BARBERÍA)" className="p-5 md:p-7 bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-bold text-sm border-none shadow-inner" onChange={e => setNuevoPro({...nuevoPro, categoria: e.target.value})} required />
            <input type="text" placeholder="WHATSAPP" className="p-5 md:p-7 bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-bold text-sm border-none shadow-inner" onChange={e => setNuevoPro({...nuevoPro, whatsapp: e.target.value})} required />
            <input type="text" placeholder="ZONA / BARRIO" className="p-5 md:p-7 bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-bold text-sm border-none shadow-inner" onChange={e => setNuevoPro({...nuevoPro, zona: e.target.value})} required />
            <input type="text" placeholder="LINK GOOGLE MAPS" className="p-5 md:p-7 bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-bold text-sm border-none shadow-inner" onChange={e => setNuevoPro({...nuevoPro, link_maps: e.target.value})} />
            <button type="submit" className="bg-slate-900 text-white p-6 md:p-8 rounded-2xl font-black text-xs uppercase tracking-[0.5em] hover:bg-indigo-600 transition-all shadow-2xl mt-4 active:scale-95">Registrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900">
      
      {/* HEADER RESPONSIVO */}
      <header className="px-6 py-12 md:py-24 flex flex-col items-center text-center bg-white border-b border-slate-50">
        <div className="mb-6 md:mb-10 relative group cursor-pointer" onClick={() => {
          const p = prompt("Clave Admin:");
          if(p === CLAVE_MAESTRA) setEsAdmin(!esAdmin);
        }}>
          <div className="w-20 h-20 md:w-28 md:h-28 bg-slate-900 rounded-[30px] md:rounded-[40px] flex items-center justify-center shadow-2xl transition-all duration-700 group-hover:rotate-[360deg] group-hover:bg-indigo-600">
            <span className="text-white font-black text-3xl md:text-5xl tracking-tighter">CC</span>
          </div>
          <div className={`absolute -bottom-1 -right-1 w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl border-4 border-white shadow-xl flex items-center justify-center ${esAdmin ? 'bg-green-500' : 'bg-indigo-600'}`}>
            <Icons.Zap size={18} className="text-white fill-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85] mb-4">
          Conexión <br /> <span className="text-indigo-600">Concepción</span>
        </h1>
        <p className="text-slate-300 font-black text-[8px] md:text-[11px] tracking-[0.6em] uppercase">Paraguay • Directorio Digital</p>
        
        {esAdmin && (
          <button onClick={() => setEsAdmin(false)} className="mt-6 flex items-center gap-2 bg-red-50 text-red-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
            <Icons.LogOut size={12} /> Salir Modo Admin
          </button>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 md:py-20">
        {/* BUSCADOR ADAPTATIVO */}
        <div className="relative mb-12 md:mb-24 group">
          <input 
            type="text" 
            placeholder="¿Qué servicio buscas?" 
            className="w-full bg-white border border-slate-100 rounded-[25px] md:rounded-[40px] py-6 md:py-10 pl-14 md:pl-20 pr-8 text-xl md:text-3xl font-bold shadow-sm outline-none focus:ring-8 md:focus:ring-[20px] focus:ring-indigo-500/5 transition-all placeholder:text-slate-200"
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Icons.Search className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 text-slate-200" size={28} />
        </div>

        {/* GRID: 1 columna en móvil, 2 en tablets, 3 en pantallas grandes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {filtrados.map((p) => (
            <div key={p.id} className="group bg-white p-6 md:p-10 rounded-[35px] md:rounded-[55px] border border-slate-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between relative overflow-hidden">
              
              {esAdmin && (
                <div className="absolute top-6 right-6 flex gap-2 z-10">
                   <button onClick={async () => {
                     await supabase.from('profesionales').update({ es_verificado: !p.es_verificado }).eq('id', p.id);
                     fetchProfesionales();
                   }} className={`p-3 rounded-2xl ${p.es_verificado ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-300'}`}>
                     <Icons.BadgeCheck size={20} />
                   </button>
                   <button onClick={async () => {
                     if(confirm("¿Borrar permanentemente?")) {
                        await supabase.from('profesionales').delete().eq('id', p.id);
                        fetchProfesionales();
                     }
                   }} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-colors">
                     <Icons.Trash2 size={20} />
                   </button>
                </div>
              )}

              <div>
                <div className="flex justify-between items-start mb-6 md:mb-10">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-50 text-indigo-600 rounded-[20px] md:rounded-[32px] flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                    <IconoDinamico nombre={p.icono} size={32} />
                  </div>
                  {p.es_verificado && !esAdmin && (
                    <div className="flex items-center gap-1.5 text-indigo-500 bg-indigo-50/50 px-4 py-2 rounded-full border border-indigo-100/30">
                      <Icons.BadgeCheck size={16} className="fill-indigo-500 text-white" />
                      <span className="text-[9px] font-black uppercase tracking-tighter">Verificado</span>
                    </div>
                  )}
                </div>
                
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase mb-1 leading-none group-hover:text-indigo-600 transition-colors">{p.nombre}</h2>
                <p className="text-indigo-600 font-black text-[10px] md:text-[12px] tracking-[0.2em] uppercase mb-6 md:mb-10 italic opacity-50">{p.categoria}</p>
                
                <div className="flex flex-wrap gap-2 mb-8 md:mb-12">
                  <span className="text-[9px] md:text-[10px] font-black px-4 py-2 bg-slate-50 rounded-xl uppercase tracking-widest text-slate-400">{p.zona}</span>
                  <span className="text-[9px] md:text-[10px] font-black px-4 py-2 bg-indigo-50 text-indigo-400 rounded-xl uppercase flex items-center gap-2">
                    <Icons.Zap size={12} className="fill-indigo-400" /> {p.clics || 0}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 md:gap-4">
                <button 
                  onClick={() => registrarClic(p.id, p.whatsapp)}
                  className="flex-1 bg-slate-900 text-white h-16 md:h-20 rounded-[20px] md:rounded-[30px] flex items-center justify-center gap-3 hover:bg-[#25D366] transition-all duration-500 shadow-xl active:scale-95"
                >
                  <Icons.MessageCircle size={22} className="fill-white/10" />
                  <span className="font-black text-[10px] md:text-xs tracking-[0.2em] uppercase">WhatsApp</span>
                </button>
                
                {p.link_maps && (
                  <a href={p.link_maps} target="_blank" className="w-16 h-16 md:w-20 md:h-20 bg-white border-2 border-slate-50 rounded-[20px] md:rounded-[30px] flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all duration-500 shadow-sm">
                    <Icons.MapPinned size={24} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER ADAPTATIVO */}
      <footer className="py-24 md:py-48 px-6 text-center bg-white border-t border-slate-50 mt-20">
        <h3 className="text-3xl md:text-6xl font-black tracking-tighter uppercase mb-10 md:mb-16 italic leading-none">Tu Negocio merece <br/> ser <span className="text-indigo-600">Encontrado</span></h3>
        <button onClick={() => { setVerFormulario(true); window.scrollTo(0,0); }} className="bg-slate-900 text-white px-10 py-5 md:px-20 md:py-10 rounded-[20px] md:rounded-[35px] font-black text-xs md:text-sm uppercase tracking-[0.5em] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95">
          Unirse al Directorio
        </button>
        <div className="mt-32 opacity-10 font-black text-[10px] md:text-[14px] tracking-[1.5em] uppercase text-center w-full">Concepción • PY</div>
      </footer>
    </div>
  );
}

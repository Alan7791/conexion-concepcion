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

  const CLAVE_MAESTRA = "Concepcion2026"; 

  const gestionarAccesoAdmin = () => {
    if (!esAdmin) {
      const entrada = prompt("🔒 Acceso Restringido. Ingrese clave:");
      if (entrada === CLAVE_MAESTRA) setEsAdmin(true);
      else if (entrada !== null) alert("Clave incorrecta.");
    }
  };

  useEffect(() => { fetchProfesionales(); }, []);

  async function fetchProfesionales() {
    const { data, error } = await supabase.from('profesionales').select('*').order('created_at', { ascending: false });
    if (!error) setProfesionales(data || []);
  }

  // --- SOLUCIÓN DE CLICS ---
  async function registrarClic(id: string, whatsapp: string) {
    // 1. Abrimos WhatsApp inmediatamente para no hacer esperar al usuario
    window.open(`https://wa.me/${whatsapp}`, '_blank');
    
    // 2. Intentamos incrementar en Supabase
    const { error } = await supabase.rpc('incrementar_clic', { row_id: id });
    
    if (error) {
        console.error("Error al contar clic: Asegúrate de tener la función rpc creada.", error);
    }
    
    // 3. Refrescamos los datos para ver el nuevo número
    fetchProfesionales();
  }

  async function borrarProfesional(id: string) {
    if (confirm("¿Eliminar este registro?")) {
      const { error } = await supabase.from('profesionales').delete().eq('id', id);
      if (!error) fetchProfesionales();
    }
  }

  async function toggleVerificado(id: string, estadoActual: boolean) {
    const { error } = await supabase.from('profesionales').update({ es_verificado: !estadoActual }).eq('id', id);
    if (!error) fetchProfesionales();
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

  if (verFormulario) {
    return (
      <div className="min-h-screen bg-white p-6 animate-in slide-in-from-right duration-500">
        <button onClick={() => setVerFormulario(false)} className="mb-10 flex items-center gap-2 font-black text-[10px] tracking-widest uppercase text-slate-400">
          <Icons.ChevronLeft size={16} /> Volver
        </button>
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-4xl font-black mb-8 uppercase italic tracking-tighter italic">Nuevo <span className="text-indigo-600">Registro</span></h2>
          <form onSubmit={crearProfesional} className="space-y-4 text-left">
            <input type="text" placeholder="NOMBRE DEL NEGOCIO" className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-bold shadow-inner" onChange={e => setNuevoPro({...nuevoPro, nombre: e.target.value})} required />
            <input type="text" placeholder="RUBRO" className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-bold shadow-inner" onChange={e => setNuevoPro({...nuevoPro, categoria: e.target.value})} required />
            <input type="text" placeholder="WHATSAPP" className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-bold shadow-inner" onChange={e => setNuevoPro({...nuevoPro, whatsapp: e.target.value})} required />
            <input type="text" placeholder="ZONA / BARRIO" className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-bold shadow-inner" onChange={e => setNuevoPro({...nuevoPro, zona: e.target.value})} required />
            <button type="submit" className="w-full bg-slate-900 text-white p-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-indigo-600 shadow-xl">Registrar Negocio</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900">
      
      <header className="px-6 py-12 flex flex-col items-center text-center bg-white border-b border-slate-100">
        <div className="mb-6 relative cursor-pointer group" onClick={gestionarAccesoAdmin}>
          <div className="w-20 h-20 bg-slate-900 rounded-[28px] flex items-center justify-center shadow-xl transition-all group-hover:bg-indigo-600">
            <span className="text-white font-black text-3xl">CC</span>
          </div>
          <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-xl border-4 border-white shadow-lg flex items-center justify-center ${esAdmin ? 'bg-green-500' : 'bg-indigo-600'}`}>
            <Icons.Zap size={14} className="text-white fill-white" />
          </div>
        </div>

        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none mb-3">
          Conexión <br /> <span className="text-indigo-600">Concepción</span>
        </h1>
        
        {/* BOTÓN DE CERRAR SESIÓN (SOLO ADMIN) */}
        {esAdmin && (
          <button 
            onClick={() => setEsAdmin(false)} 
            className="mt-4 flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all animate-in fade-in zoom-in"
          >
            <Icons.LogOut size={12} /> Cerrar Administración
          </button>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="relative mb-12">
          <input 
            type="text" 
            placeholder="¿A quién buscas hoy?" 
            className="w-full bg-white border border-slate-100 rounded-2xl py-6 pl-14 pr-6 text-lg font-bold shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Icons.Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtrados.map((p) => (
            <div key={p.id} className="group bg-white p-7 rounded-[40px] border border-slate-50 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between relative">
              
              {esAdmin && (
                <div className="absolute top-5 right-5 flex gap-2">
                  <button onClick={() => toggleVerificado(p.id, p.es_verificado)} className={`p-2 rounded-xl transition-all ${p.es_verificado ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-300'}`}>
                    <Icons.BadgeCheck size={18} />
                  </button>
                  <button onClick={() => borrarProfesional(p.id)} className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white">
                    <Icons.Trash2 size={18} />
                  </button>
                </div>
              )}

              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <IconoDinamico nombre={p.icono || 'zap'} size={28} />
                  </div>
                  {p.es_verificado && !esAdmin && (
                    <div className="flex items-center gap-1 text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full font-black text-[8px] uppercase">
                      <Icons.BadgeCheck size={12} className="fill-indigo-500 text-white" /> Verificado
                    </div>
                  )}
                </div>
                
                <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase leading-none mb-1">{p.nombre}</h2>
                <p className="text-indigo-600 font-black text-[10px] tracking-widest uppercase mb-6 italic opacity-70">{p.categoria}</p>
                
                <div className="flex gap-2 mb-8 font-black text-[9px] uppercase tracking-widest text-slate-400">
                  <span className="px-3 py-1.5 bg-slate-50 rounded-lg">{p.zona}</span>
                  <span className="px-3 py-1.5 bg-indigo-50 text-indigo-400 rounded-lg flex items-center gap-1">
                    <Icons.Zap size={10} className="fill-indigo-400" /> {p.clics || 0}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => registrarClic(p.id, p.whatsapp)}
                  className="flex-1 bg-slate-900 text-white h-16 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#25D366] transition-all shadow-lg active:scale-95"
                >
                  <Icons.MessageCircle size={20} className="fill-white/10" />
                  <span className="font-black text-[10px] tracking-widest uppercase">WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

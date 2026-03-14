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
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 px-6 py-4 text-center">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Icons.Zap size={24} className="text-indigo-600 fill-indigo-600" />
            <h1 className="font-black text-xl tracking-tighter uppercase italic">Conexión <span className="text-indigo-600">Concepción</span></h1>
          </div>
          <button onClick={() => setEsAdmin(!esAdmin)} className="text-[9px] font-black px-3 py-1.5 rounded-full border border-slate-200 text-slate-400 uppercase">
             {esAdmin ? 'Modo Admin ON' : 'Visor'}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="relative mb-10">
          <Icons.Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20}/>
          <input 
            type="text" 
            placeholder="Buscar profesional en Concepción..." 
            className="w-full pl-16 pr-8 py-5 bg-white border-none rounded-[25px] shadow-2xl shadow-indigo-100/30 text-lg outline-none"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="space-y-5">
          {filtrados.map((p) => (
            <div key={p.id} className="bg-white rounded-[35px] p-7 shadow-sm border border-slate-50 hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[22px] flex items-center justify-center shrink-0 shadow-inner">
                    <IconoDinamico nombre={p.icono || 'zap'} size={32} />
                  </div>
                  <div>
                    <h2 className="font-black text-xl text-slate-800 flex items-center gap-2 justify-center sm:justify-start">
                      {p.nombre}
                      {p.es_verificado && <Icons.BadgeCheck size={18} className="text-indigo-500 fill-indigo-50" />}
                    </h2>
                    <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-2">{p.categoria}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                        <span className="bg-slate-50 text-slate-400 text-[10px] font-bold px-2 py-1 rounded-md uppercase border border-slate-100">
                          {p.zona}
                        </span>
                        <span className="text-indigo-300 text-[10px] font-bold uppercase flex items-center gap-1">
                          <Icons.Zap size={10} className="fill-indigo-300"/> {p.clics || 0} clics
                        </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  {/* BOTÓN WHATSAPP */}
                  <button 
                    onClick={() => registrarClic(p.id, p.whatsapp)}
                    className="flex-1 sm:flex-none bg-slate-900 text-white px-8 py-4 rounded-[18px] hover:bg-indigo-600 transition-all flex items-center justify-center"
                  >
                    <Icons.MessageCircle size={22} />
                  </button>
                  
                  {/* BOTÓN MAPS DINÁMICO */}
                  <a 
                    href={p.link_maps || "#"} 
                    target={p.link_maps ? "_blank" : "_self"}
                    onClick={(e) => !p.link_maps && e.preventDefault()}
                    className={`px-5 py-4 rounded-[18px] border-2 transition-all flex items-center justify-center shadow-sm ${
                      p.link_maps 
                      ? "bg-white border-indigo-100 text-indigo-500 hover:border-indigo-400 hover:bg-indigo-50" 
                      : "bg-slate-50 border-slate-100 text-slate-200 cursor-not-allowed"
                    }`}
                  >
                    <Icons.MapPinned size={22} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-20 text-center">
        <button onClick={() => setVerFormulario(true)} className="bg-slate-900 text-white px-10 py-5 rounded-[22px] font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-indigo-600 transition-all">
          Registrar nuevo negocio
        </button>
      </footer>
    </div>
  );
}

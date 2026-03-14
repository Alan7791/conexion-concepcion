import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as Icons from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// --- COMPONENTE PARA RENDERIZAR ICONOS DE LA BASE DE DATOS ---
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
    // Esta es tu función de RPC para el conteo de clics
    await supabase.rpc('incrementar_clic', { row_id: id });
    window.open(`https://wa.me/${whatsapp}`, '_blank');
    fetchProfesionales(); // Actualiza la vista para ver el nuevo clic
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
        <button onClick={() => setVerFormulario(false)} className="mb-8 flex items-center gap-2 text-slate-500 font-bold">
          <Icons.ArrowLeft size={20} /> VOLVERatrás
        </button>
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter">Registrar <span className="text-indigo-600">Servicio</span></h2>
          <form onSubmit={crearProfesional} className="space-y-4">
            <input type="text" placeholder="Nombre del Negocio" className="w-full p-4 bg-slate-50 rounded-2xl border-none" onChange={e => setNuevoPro({...nuevoPro, nombre: e.target.value})} required />
            <input type="text" placeholder="Categoría (Ej: Dentista, Plomero)" className="w-full p-4 bg-slate-50 rounded-2xl border-none" onChange={e => setNuevoPro({...nuevoPro, categoria: e.target.value})} required />
            <input type="text" placeholder="Barrio / Zona" className="w-full p-4 bg-slate-50 rounded-2xl border-none" onChange={e => setNuevoPro({...nuevoPro, zona: e.target.value})} required />
            <input type="text" placeholder="WhatsApp (Ej: 595983...)" className="w-full p-4 bg-slate-50 rounded-2xl border-none" onChange={e => setNuevoPro({...nuevoPro, whatsapp: e.target.value})} required />
            <input type="text" placeholder="Link de Google Maps (Opcional)" className="w-full p-4 bg-slate-50 rounded-2xl border-none" onChange={e => setNuevoPro({...nuevoPro, link_maps: e.target.value})} />
            <input type="text" placeholder="Nombre del Icono (ej: stethoscope, zap)" className="w-full p-4 bg-slate-50 rounded-2xl border-none" onChange={e => setNuevoPro({...nuevoPro, icono: e.target.value})} />
            <button type="submit" className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
              <Icons.Send size={20} /> PUBLICAR AHORA
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* HEADER IDÉNTICO AL TUYO */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg">
              <Icons.Zap size={20} className="text-white fill-white" />
            </div>
            <h1 className="font-black text-xl tracking-tighter uppercase">Conexión <span className="text-indigo-600">Concepción</span></h1>
          </div>
          <button onClick={() => setEsAdmin(!esAdmin)} className="text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200 text-slate-400">
            {esAdmin ? 'ADMIN' : 'VISOR'}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* BUSCADOR */}
        <div className="relative mb-12">
          <Icons.Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20}/>
          <input 
            type="text" 
            placeholder="¿Qué servicio estás buscando?" 
            className="w-full pl-16 pr-8 py-6 bg-white border-none rounded-[32px] shadow-xl shadow-slate-200/50 text-lg"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* LISTADO DE PROFESIONALES CON TU ESTILO */}
        <div className="space-y-6">
          {filtrados.map((p) => (
            <div key={p.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50 relative">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                <div className="flex gap-6">
                  {/* ICONO DINÁMICO RECIÉN INTEGRADO */}
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                    <IconoDinamico nombre={p.icono || 'zap'} size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-black text-xl text-slate-800">{p.nombre}</h2>
                      {p.es_verificado && <Icons.BadgeCheck size={18} className="text-indigo-500 fill-indigo-50" />}
                    </div>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-3">{p.categoria}</p>
                    <div className="flex items-center gap-4 text-slate-500">
                      <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-[11px] font-bold uppercase">
                        <Icons.MapPin size={12}/> {p.zona}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 uppercase">
                        <Icons.Zap size={12} className="fill-indigo-400"/> {p.clics || 0} clics
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTONES DE ACCIÓN: WHATSAPP + MAPS */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => registrarClic(p.id, p.whatsapp)}
                    className="flex-1 sm:flex-none bg-slate-900 text-white p-5 rounded-2xl hover:bg-indigo-600 transition-all flex items-center justify-center"
                  >
                    <Icons.MessageCircle size={24} />
                  </button>
                  
                  {p.link_maps && (
                    <a 
                      href={p.link_maps} 
                      target="_blank" 
                      className="p-5 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center"
                    >
                      <Icons.Map size={24} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-20 text-center bg-white mt-20 border-t border-slate-100">
        <button onClick={() => setVerFormulario(true)} className="mb-16 bg-slate-900 text-white px-10 py-6 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-indigo-600 transition-all">
          🚀 REGISTRAR MI NEGOCIO GRATIS
        </button>
        <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">Conexión Concepción &copy; 2026</p>
      </footer>
    </div>
  );
}

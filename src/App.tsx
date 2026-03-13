import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as Icons from 'lucide-react'; // Importamos todos los iconos

// Configuración de Supabase con tus variables de entorno
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// --- COMPONENTE DE ICONO DINÁMICO ---
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
      .from('profesionales') // Asegúrate que el nombre de tabla sea este
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setProfesionales(data || []);
    setCargando(false);
  }

  // Función para registrar clics (Tu ventaja competitiva)
  async function registrarClic(id: string, whatsapp: string) {
    await supabase.rpc('incrementar_clic', { row_id: id });
    window.open(`https://wa.me/${whatsapp}`, '_blank');
  }

  const filtrados = profesionales.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.zona.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
              <Icons.Zap size={20} className="text-white fill-white" />
            </div>
            <h1 className="font-black text-xl tracking-tighter uppercase">Conexión <span className="text-indigo-600">Concepción</span></h1>
          </div>
          <button 
            onClick={() => setEsAdmin(!esAdmin)}
            className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${esAdmin ? 'bg-red-50 border-red-200 text-red-500' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
          >
            MODO {esAdmin ? 'ADMIN' : 'VISOR'}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* BUSCADOR */}
        <div className="relative mb-12 group">
          <Icons.Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20}/>
          <input 
            type="text" 
            placeholder="¿Qué servicio estás buscando?" 
            className="w-full pl-16 pr-8 py-6 bg-white border-none rounded-[32px] shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-indigo-500/10 text-lg placeholder:text-slate-300 transition-all"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* LISTA DE PROFESIONALES */}
        {cargando ? (
          <div className="text-center py-20 opacity-30 animate-pulse font-bold uppercase tracking-widest text-sm">Cargando profesionales...</div>
        ) : (
          <div className="space-y-6">
            {filtrados.map((p) => (
              <div key={p.id} className="group bg-white rounded-[32px] p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all border border-slate-100 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                  <div className="flex gap-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shrink-0">
                      {/* AQUÍ SE CARGA EL ICONO DINÁMICO DESDE TU BASE DE DATOS */}
                      <IconoDinamico nombre={p.icono || 'zap'} size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-black text-xl text-slate-800">{p.nombre}</h2>
                        {p.es_verificado && <Icons.BadgeCheck size={18} className="text-indigo-500 fill-indigo-50" />}
                      </div>
                      <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-3">{p.categoria}</p>
                      <div className="flex items-center gap-4 text-slate-500">
                        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-[11px] font-bold">
                          <Icons.MapPin size={12}/> {p.zona}
                        </div>
                        {p.clics > 0 && (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 uppercase">
                            <Icons.Zap size={12} className="fill-indigo-400"/> {p.clics} clics
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => registrarClic(p.id, p.whatsapp)}
                    className="w-full sm:w-auto bg-slate-900 text-white p-5 rounded-2xl hover:bg-indigo-600 transition-all shadow-lg active:scale-95 flex items-center justify-center"
                  >
                    <Icons.MessageCircle size={24} />
                  </button>
                </div>
                
                {esAdmin && (
                  <div className="mt-6 pt-6 border-t border-slate-50 flex gap-2">
                    <button className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">Borrar Registro</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="py-20 text-center">
        <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">Conexión Concepción &copy; 2026</p>
      </footer>
    </div>
  );
}

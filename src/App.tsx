import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as Icons from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const IconoDinamico = ({ nombre, size = 24 }: { nombre: string, size?: number }) => {
  const nombreFormateado = (nombre.charAt(0).toUpperCase() + nombre.slice(1)) as keyof typeof Icons;
  const LucideIcon = (Icons[nombreFormateado] as React.ElementType) || Icons.Zap;
  return <LucideIcon size={size} />;
};

export default function App() {
  const [profesionales, setProfesionales] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [verFormulario, setVerFormulario] = useState(false);
  const [esAdmin, setEsAdmin] = useState(false);
  const CLAVE_MAESTRA = "Concepcion2026"; 

  useEffect(() => { fetchProfesionales(); }, []);

  async function fetchProfesionales() {
    const { data, error } = await supabase.from('profesionales').select('*').order('created_at', { ascending: false });
    if (!error) setProfesionales(data || []);
  }

  // FUNCIÓN DE CLICS CORREGIDA
  async function registrarClic(id: number, whatsapp: string) {
    window.open(`https://wa.me/${whatsapp}`, '_blank');
    const { error } = await supabase.rpc('incrementar_clic', { row_id: id });
    if (error) console.error("Error en RPC:", error.message);
    fetchProfesionales();
  }

  async function toggleVerificado(id: number, estado: boolean) {
    await supabase.from('profesionales').update({ es_verificado: !estado }).eq('id', id);
    fetchProfesionales();
  }

  async function borrarPro(id: number) {
    if (confirm("¿Borrar este registro?")) {
      await supabase.from('profesionales').delete().eq('id', id);
      fetchProfesionales();
    }
  }

  const filtrados = profesionales.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="p-10 flex flex-col items-center bg-white border-b border-slate-200">
        <div 
          className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 cursor-pointer"
          onClick={() => {
            const pass = prompt("Clave Admin:");
            if (pass === CLAVE_MAESTRA) setEsAdmin(!esAdmin);
          }}
        >
          <Icons.Zap className="text-white fill-white" size={30} />
        </div>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          Conexión <span className="text-indigo-600">Concepción</span>
        </h1>
        {esAdmin && (
          <button onClick={() => setEsAdmin(false)} className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-widest">
            Salir de Admin
          </button>
        )}
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <input 
          type="text" 
          placeholder="¿A quién buscas?" 
          className="w-full p-5 rounded-2xl border-none shadow-sm mb-8 text-lg font-bold"
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtrados.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col relative">
              
              {esAdmin && (
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => toggleVerificado(p.id, p.es_verificado)} className={`p-2 rounded-lg ${p.es_verificado ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <Icons.BadgeCheck size={16} />
                  </button>
                  <button onClick={() => borrarPro(p.id)} className="p-2 bg-red-50 text-red-500 rounded-lg">
                    <Icons.Trash2 size={16} />
                  </button>
                </div>
              )}

              <div className="flex gap-4 mb-4">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <IconoDinamico nombre={p.icono} />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight leading-none">{p.nombre}</h2>
                  <p className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest">{p.categoria}</p>
                </div>
              </div>

              <div className="flex gap-2 mb-6">
                <span className="text-[10px] font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-400 uppercase">{p.zona}</span>
                <span className="text-[10px] font-bold px-3 py-1 bg-indigo-50 rounded-full text-indigo-400 uppercase flex items-center gap-1">
                  <Icons.Zap size={10} className="fill-indigo-400" /> {p.clics || 0} clics
                </span>
              </div>

              <div className="flex gap-2 mt-auto">
                <button 
                  onClick={() => registrarClic(p.id, p.whatsapp)}
                  className="flex-1 bg-slate-900 text-white h-14 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#25D366] transition-all"
                >
                  <Icons.MessageCircle size={18} /> WhatsApp
                </button>
                
                {p.link_maps && (
                  <a 
                    href={p.link_maps} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-14 h-14 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all"
                  >
                    <Icons.MapPinned size={22} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="p-20 text-center">
        <button 
          onClick={() => setVerFormulario(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-lg"
        >
          Registrar Negocio
        </button>
      </footer>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, MapPin, CheckCircle, MessageCircle, ExternalLink, PlusCircle, ArrowLeft, Send, Trash2, ShieldCheck, Lock } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [profesionales, setProfesionales] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [verFormulario, setVerFormulario] = useState(false);
  const [esAdmin, setEsAdmin] = useState(false);
  const [pass, setPass] = useState("");

  const [nuevoPro, setNuevoPro] = useState({
    nombre: '', categoria: '', zona: '', descripcion: '', whatsapp: ''
  });

  useEffect(() => { cargarDatos(); }, []);

  async function cargarDatos() {
    const { data } = await supabase.from('profesionales').select('*').order('es_premium', { ascending: false });
    if (data) setProfesionales(data);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('profesionales').insert([nuevoPro]);
    if (error) alert("Error: " + error.message);
    else { alert("¡Registrado!"); setVerFormulario(false); cargarDatos(); }
  };

  const borrarProfesional = async (id) => {
    if (confirm("¿Seguro que querés eliminarlo?")) {
      await supabase.from('profesionales').delete().eq('id', id);
      cargarDatos();
    }
  };

  const toggleVerificado = async (id, estado) => {
    await supabase.from('profesionales').update({ es_verificado: !estado }).eq('id', id);
    cargarDatos();
  };

  const loginAdmin = () => {
    if (pass === "concepcion2026") setEsAdmin(true);
    else alert("Contraseña incorrecta");
  };

  const filtrados = profesionales.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (verFormulario) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
        <button onClick={() => setVerFormulario(false)} className="self-start flex items-center gap-2 text-indigo-600 font-bold mb-8"><ArrowLeft size={20}/> Volver</button>
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-black mb-6 text-center">Registrar Servicio</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required placeholder="Nombre" className="w-full p-4 bg-slate-100 rounded-xl" onChange={e => setNuevoPro({...nuevoPro, nombre: e.target.value})} />
            <input required placeholder="Categoría" className="w-full p-4 bg-slate-100 rounded-xl" onChange={e => setNuevoPro({...nuevoPro, categoria: e.target.value})} />
            <input required placeholder="Zona" className="w-full p-4 bg-slate-100 rounded-xl" onChange={e => setNuevoPro({...nuevoPro, zona: e.target.value})} />
            <input required placeholder="WhatsApp" className="w-full p-4 bg-slate-100 rounded-xl" onChange={e => setNuevoPro({...nuevoPro, whatsapp: e.target.value})} />
            <textarea placeholder="Descripción" className="w-full p-4 bg-slate-100 rounded-xl h-24" onChange={e => setNuevoPro({...nuevoPro, descripcion: e.target.value})} />
            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold">Publicar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-indigo-600 text-white pb-20 pt-12 px-6 text-center">
        <h1 className="text-4xl font-black mb-4 tracking-tighter">CONEXIÓN CONCEPCIÓN</h1>
        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => setVerFormulario(true)} className="bg-white/20 px-4 py-2 rounded-full text-xs font-bold border border-white/40 flex items-center gap-2 hover:bg-white/30 transition-all"><PlusCircle size={16}/> Inscribirse</button>
          {!esAdmin && (
            <div className="flex items-center gap-2 bg-black/20 rounded-full px-3 border border-white/10">
              <input type="password" placeholder="Admin PIN" className="bg-transparent text-xs outline-none w-20" onChange={e => setPass(e.target.value)} />
              <button onClick={loginAdmin}><Lock size={14}/></button>
            </div>
          )}
          {esAdmin && <span className="bg-red-500 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 animate-pulse"><ShieldCheck size={16}/> MODO ADMIN ACTIVO</span>}
        </div>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="text" placeholder="Buscar técnico, médico..." className="w-full pl-12 pr-4 py-4 rounded-2xl text-slate-800 shadow-2xl outline-none" onChange={(e) => setBusqueda(e.target.value)} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 -mt-10 grid gap-6 md:grid-cols-2">
        {filtrados.map(p => (
          <div key={p.id} className={`bg-white rounded-3xl p-6 shadow-sm border-2 transition-all ${p.es_premium ? 'border-amber-400' : 'border-transparent'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">{p.nombre} {p.es_verificado && <CheckCircle size={18} className="text-blue-500" fill="currentColor"/>}</h3>
                <p className="text-xs font-bold text-indigo-600 uppercase">{p.categoria}</p>
              </div>
              {esAdmin && (
                <div className="flex gap-2">
                  <button onClick={() => toggleVerificado(p.id, p.es_verificado)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><ShieldCheck size={20}/></button>
                  <button onClick={() => borrarProfesional(p.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 size={20}/></button>
                </div>
              )}
            </div>
            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{p.descripcion}</p>
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-6"><MapPin size={16} className="text-rose-500" /> {p.zona}</div>
            <div className="flex gap-3">
              <a href={`https://wa.me/${p.whatsapp}`} target="_blank" className="flex-1 bg-green-500 text-white text-center py-3 rounded-xl font-bold flex items-center justify-center gap-2"><MessageCircle size={18}/> WhatsApp</a>
              <a href={`http://maps.google.com/?q=${p.nombre}+Concepcion+Paraguay`} target="_blank" className="flex-1 bg-slate-100 text-slate-700 text-center py-3 rounded-xl font-bold flex items-center justify-center gap-2"><ExternalLink size={18}/> Mapa</a>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

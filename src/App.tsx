import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, MapPin, CheckCircle, MessageCircle, ExternalLink, PlusCircle, ArrowLeft, Send, Trash2, ShieldCheck, Zap, Globe } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [profesionales, setProfesionales] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [verFormulario, setVerFormulario] = useState(false);
  const [esAdmin, setEsAdmin] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'concepcion2026') setEsAdmin(true);
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setCargando(true);
    const { data } = await supabase.from('profesionales').select('*').order('es_premium', { ascending: false });
    if (data) setProfesionales(data);
    setCargando(false);
  }

  const toggleVerificado = async (id, estado) => {
    await supabase.from('profesionales').update({ es_verificado: !estado }).eq('id', id);
    cargarDatos();
  };

  const borrarProfesional = async (id) => {
    if (confirm("¿Borrar definitivamente?")) {
      await supabase.from('profesionales').delete().eq('id', id);
      cargarDatos();
    }
  };

  const [nuevoPro, setNuevoPro] = useState({ nombre: '', categoria: '', zona: '', descripcion: '', whatsapp: '', link_maps: '' });

  const filtrados = profesionales.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.zona.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (verFormulario) {
    return (
      <div className="min-h-screen bg-white p-6 flex flex-col items-center font-sans">
        <button onClick={() => setVerFormulario(false)} className="self-start flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-10 transition-colors">
          <ArrowLeft size={20}/> Volver al inicio
        </button>
        <div className="w-full max-w-xl">
          <h2 className="text-3xl font-black mb-2 text-slate-900 tracking-tight">Registrá tu negocio</h2>
          <p className="text-slate-500 mb-8">Completá los datos para aparecer en la guía de Concepción.</p>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const { error } = await supabase.from('profesionales').insert([nuevoPro]);
            if (!error) { alert("¡Registro exitoso!"); setVerFormulario(false); cargarDatos(); }
            else { alert("Error al registrar. Verifica la conexión."); }
          }} className="grid gap-5">
            <div className="grid md:grid-cols-2 gap-4">
              <input required placeholder="Nombre Comercial" className="p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setNuevoPro({...nuevoPro, nombre: e.target.value})} />
              <input required placeholder="Categoría (Ej: Plomero)" className="p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setNuevoPro({...nuevoPro, categoria: e.target.value})} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input required placeholder="Barrio (Ej: Centro)" className="p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setNuevoPro({...nuevoPro, zona: e.target.value})} />
              <input required placeholder="WhatsApp (Ej: 595981...)" className="p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setNuevoPro({...nuevoPro, whatsapp: e.target.value})} />
            </div>
            <input placeholder="Link de Google Maps (Opcional)" className="p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setNuevoPro({...nuevoPro, link_maps: e.target.value})} />
            <textarea placeholder="Contanos qué servicios ofrecés..." className="p-4 bg-slate-50 border border-slate-200 rounded-2xl h-32 focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setNuevoPro({...nuevoPro, descripcion: e.target.value})} />
            <button type="submit" className="bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95">
              <Send size={22}/> PUBLICAR SERVICIO
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans">
      <header className="bg-white border-b border-slate-10

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as Icons from 'lucide-react';

// --- CONFIGURACIÓN DE SUPABASE ---
// Reemplaza esto con tus credenciales reales de Supabase si no las tienes en variables de entorno
const supabaseUrl = 'TU_URL_DE_SUPABASE';
const supabaseAnonKey = 'TU_KEY_ANON_DE_SUPABASE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- COMPONENTE DE ICONO DINÁMICO ---
const IconoDinamico = ({ nombre, color = "#2563eb", size = 24 }: { nombre: string, color?: string, size?: number }) => {
  // Convierte 'zap' en 'Zap' para que Lucide lo reconozca
  const nombreFormateado = (nombre.charAt(0).toUpperCase() + nombre.slice(1)) as keyof typeof Icons;
  const LucideIcon = (Icons[nombreFormateado] as React.ElementType) || Icons.HelpCircle;

  return <LucideIcon color={color} size={size} />;
};

// --- COMPONENTE DE TARJETA ---
function TarjetaProfesional({ profesional }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all mb-4">
      <div className="flex items-center gap-4">
        {/* Icono que viene de la columna 'icono' en Supabase */}
        <div className="bg-blue-50 p-3 rounded-full">
          <IconoDinamico nombre={profesional.icono || 'zap'} />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">{profesional.nombre_comercial}</h3>
          <p className="text-sm text-gray-500 capitalize">
            {profesional.categoria} • {profesional.barrio}
          </p>
        </div>

        {/* Botón de WhatsApp */}
        <a 
          href={`https://wa.me/${profesional.whatsapp_link}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
        >
          <Icons.MessageCircle size={24} />
        </a>
      </div>
    </div>
  );
}

// --- PÁGINA PRINCIPAL ---
export default function App() {
  const [profesionales, setProfesionales] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchProfesionales();
  }, []);

  async function fetchProfesionales() {
    setCargando(true);
    // Cambia 'servicios' por el nombre real de tu tabla si es diferente
    const { data, error } = await supabase
      .from('servicios') 
      .select('*')
      .order('nombre_comercial', { ascending: true });

    if (error) {
      console.error('Error cargando datos:', error);
    } else {
      setProfesionales(data || []);
    }
    setCargando(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      <header className="max-w-2xl mx-auto mb-8 mt-4 text-center">
        <h1 className="text-3xl font-extrabold text-blue-700">Conexión Concepción</h1>
        <p className="text-gray-600">Encuentra profesionales locales al instante</p>
      </header>

      <main className="max-w-2xl mx-auto">
        {cargando ? (
          <p className="text-center text-gray-500 italic">Buscando profesionales...</p>
        ) : profesionales.length > 0 ? (
          profesionales.map((p) => (
            <TarjetaProfesional key={p.id} profesional={p} />
          ))
        ) : (
          <p className="text-center text-gray-500">No se encontraron servicios aún.</p>
        )}
      </main>

      <footer className="text-center mt-10 text-gray-400 text-xs">
        &copy; 2026 Conexión Concepción - Directorio Local
      </footer>
    </div>
  );
}

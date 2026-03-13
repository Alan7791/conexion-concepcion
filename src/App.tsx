import React, { useState, useEffect } from "react";
import { Search, Phone, MapPin, ExternalLink, MessageCircle } from "lucide-react";
// 1. Conexión con tu base de datos
import { supabase } from "@/integrations/supabase/client";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Aquí puedes agregar los negocios reales de Concepción
  const [negocios] = useState([
    {
      id: 1,
      nombre: "Gomería El Rayo",
      categoria: "Mecánica",
      direccion: "Centro de Concepción",
      telefono: "595981000000",
    },
    {
      id: 2,
      nombre: "Restaurante Norteño",
      categoria: "Gastronomía",
      direccion: "Cerca de la Terminal",
      telefono: "595982000000",
    }
  ]);

  // 2. LA FUNCIÓN MÁGICA: Registra el clic en Supabase y abre WhatsApp
  const handleWhatsAppClick = async (nombre: string, telefono: string) => {
    try {
      // Guardamos el dato para tu reporte mensual de 50.000 Gs
      await supabase
        .from('registro_clics')
        .insert([{ 
          nombre_negocio: nombre, 
          tipo_accion: 'whatsapp' 
        }]);
      
      console.log("Métrica guardada para:", nombre);
    } catch (error) {
      console.error("Error al guardar métrica:", error);
    } finally {
      // Siempre abrimos WhatsApp al final
      window.open(`https://wa.me/${telefono}`, '_blank');
    }
  };

  const filteredNegocios = negocios.filter(n =>
    n.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-blue-700 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-center">Conexión Concepción</h1>
        <p className="text-center mt-2 opacity-90">Servicios Profesionales en la Perla del Norte</p>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* Buscador */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="¿Qué servicio buscas hoy?"
            className="w-full p-3 pl-10 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Lista de Negocios */}
        <div className="grid gap-4">
          {filteredNegocios.map((negocio) => (
            <div key={negocio.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center hover:shadow-md transition-shadow">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{negocio.categoria}</span>
                <h2 className="text-xl font-bold text-gray-800 mt-1">{negocio.nombre}</h2>
                <div className="flex items-center text-gray-500 mt-2">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">{negocio.direccion}</span>
                </div>
              </div>

              {/* EL BOTÓN QUE GENERA DINERO */}
              <button
                onClick={() => handleWhatsAppClick(negocio.nombre, negocio.telefono)}
                className="mt-4 md:mt-0 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-green-100"
              >
                <MessageCircle size={20} />
                Contactar WhatsApp
              </button>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center p-8 text-gray-400 text-sm">
        © 2026 Conexión Concepción - Hecho por Alan Campuzano
      </footer>
    </div>
  );
};

export default App;

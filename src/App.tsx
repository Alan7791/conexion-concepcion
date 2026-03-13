import { useState } from "react";
import { Search, MessageCircle, MapPin } from "lucide-react";
// Solo agregamos esta importación
import { supabase } from "@/integrations/supabase/client";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const negocios = [
    { id: 1, nombre: "Gomería El Rayo", categoria: "Mecánica", telefono: "595981000000", zona: "Centro" },
    { id: 2, nombre: "Restaurante Norteño", categoria: "Gastronomía", telefono: "595982000000", zona: "Terminal" }
  ];

  // Esta es la única función nueva. No rompe nada.
  const handleContact = async (nombre: string, telefono: string) => {
    // Registra en Supabase
    await supabase
      .from('registro_clics')
      .insert([{ nombre_negocio: nombre, tipo_accion: 'whatsapp' }]);
    
    // Abre WhatsApp
    window.open(`https://wa.me/${telefono}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-700">Conexión Concepción</h1>
        
        <input
          className="w-full p-3 rounded-lg border border-gray-300"
          placeholder="Buscar..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="grid gap-4">
          {negocios.filter(n => n.nombre.toLowerCase().includes(searchTerm.toLowerCase())).map((negocio) => (
            <div key={negocio.id} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
              <div>
                <h2 className="font-bold text-lg">{negocio.nombre}</h2>
                <p className="text-sm text-gray-500">{negocio.categoria} • {negocio.zona}</p>
              </div>
              <button 
                onClick={() => handleContact(negocio.nombre, negocio.telefono)}
                className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={24} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;

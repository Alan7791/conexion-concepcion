import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Lista de ejemplo - Puedes cambiar estos nombres por los reales
  const negocios = [
    { id: 1, nombre: "Gomería El Rayo", telefono: "595981000000", categoria: "Mecánica" },
    { id: 2, nombre: "Restaurante Norteño", telefono: "595982000000", categoria: "Gastronomía" }
  ];

  const handleWhatsAppClick = async (nombre: string, telefono: string) => {
    try {
      // REGISTRO EN SUPABASE
      await supabase
        .from('registro_clics')
        .insert([{ nombre_negocio: nombre, tipo_accion: 'whatsapp' }]);
    } catch (e) {
      console.error(e);
    } finally {
      window.open(`https://wa.me/${telefono}`, '_blank');
    }
  };

  const filtrados = negocios.filter(n => 
    n.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', color: '#1d4ed8' }}>Conexión Concepción</h1>
      
      <input 
        type="text" 
        placeholder="Buscar negocio..." 
        style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filtrados.map(n => (
        <div key={n.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' }}>
          <div>
            <h3 style={{ margin: 0 }}>{n.nombre}</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9em' }}>{n.categoria}</p>
          </div>
          <button 
            onClick={() => handleWhatsAppClick(n.nombre, n.telefono)}
            style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            WhatsApp
          </button>
        </div>
      ))}
    </div>
  );
};

export default App;

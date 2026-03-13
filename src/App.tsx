import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const App = () => {
  const [busqueda, setBusqueda] = useState("");

  // Lista de negocios - Podés editarlos acá mismo
  const negocios = [
    { id: 1, nombre: "Gomería El Rayo", rubro: "Mecánica", zona: "Centro", tel: "595981000000" },
    { id: 2, nombre: "Restaurante Norteño", rubro: "Gastronomía", zona: "Terminal", tel: "595982000000" }
  ];

  // La función que registra el clic para tus métricas
  const conectarWhatsApp = async (nombre: string, telefono: string) => {
    try {
      await supabase
        .from('registro_clics')
        .insert([{ nombre_negocio: nombre, tipo_accion: 'whatsapp' }]);
    } catch (e) {
      console.error("Error en Supabase:", e);
    } finally {
      window.open(`https://wa.me/${telefono}`, '_blank');
    }
  };

  const filtrados = negocios.filter(n => 
    n.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    n.rubro.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#1e40af', fontSize: '2rem', marginBottom: '5px' }}>Conexión Concepción</h1>
          <p style={{ color: '#6b7280' }}>Servicios en la Perla del Norte</p>
        </div>

        <input 
          type="text" 
          placeholder="¿Qué servicio buscas hoy?" 
          style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', marginBottom: '20px', fontSize: '16px' }}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div style={{ display: 'grid', gap: '15px' }}>
          {filtrados.map(n => (
            <div key={n.id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#1e40af', textTransform: 'uppercase' }}>{n.rubro}</span>
                <h3 style={{ margin: '5px 0', fontSize: '18px' }}>{n.nombre}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>📍 {n.zona}</p>
              </div>
              <button 
                onClick={() => conectarWhatsApp(n.nombre, n.tel)}
                style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
              >
                WhatsApp
              </button>
            </div>
          ))}
        </div>

        <footer style={{ textAlign: 'center', marginTop: '40px', color: '#9ca3af', fontSize: '12px' }}>
          Hecho por Alan Campuzano • 2026
        </footer>
      </div>
    </div>
  );
};

export default App;

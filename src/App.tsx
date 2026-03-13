import { useState } from "react";
// 1. IMPORTANTE: Importamos el cliente de Supabase
import { supabase } from "@/integrations/supabase/client"; 

// Si usas componentes de UI como los de shadcn, asegúrate de que estén importados
// import { Button } from "@/components/ui/button"; 

const App = () => {
  // Ejemplo de datos (esto seguro ya lo tenés dinámico desde Supabase)
  const negocios = [
    { id: 1, nombre: "Gomería El Rayo", telefono: "595981000000" },
    { id: 2, nombre: "Restaurante Concepción", telefono: "595982000000" }
  ];

  // 2. LA FUNCIÓN MÁGICA: Registra el clic y abre WhatsApp
  const handleContactClick = async (nombreNegocio: string, telefono: string) => {
    console.log("Registrando clic para:", nombreNegocio);

    try {
      // Guardamos en la tabla que creamos juntos
      const { error } = await supabase
        .from('registro_clics')
        .insert([
          { 
            nombre_negocio: nombreNegocio, 
            tipo_accion: 'whatsapp' 
          }
        ]);

      if (error) throw error;

    } catch (error) {
      console.error("Error al guardar métrica:", error);
    } finally {
      // 3. Siempre abrimos WhatsApp al final, incluso si falla el registro
      window.open(`https://wa.me/${telefono}?text=Hola! Vi tu perfil en Conexión Concepción`, '_blank');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Conexión Concepción</h1>
      <div className="grid gap-4">
        {negocios.map((negocio) => (
          <div key={negocio.id} className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">{negocio.nombre}</h2>
            
            {/* 4. EL BOTÓN: Llamamos a la función al hacer clic */}
            <button
              onClick={() => handleContactClick(negocio.nombre, negocio.telefono)}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Contactar por WhatsApp
            </button>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

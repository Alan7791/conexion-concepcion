import { useState } from "react";
import { Search, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client"; // La conexión que ya tenés

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const negocios = [
    { id: 1, nombre: "Gomería El Rayo", categoria: "Mecánica", telefono: "595981000000", zona: "Centro" },
    { id: 2, nombre: "Restaurante Norteño", categoria: "Gastronomía", telefono: "595982000000", zona: "Terminal" }
  ];

  // Función de registro corregida para tu proyecto
  const handleContact = async (nombre: string, telefono: string) => {
    // Registramos en silencio en Supabase
    await supabase
      .from('registro_clics')
      .insert([{ nombre_negocio: nombre, tipo_accion: 'whatsapp' }]);
    
    // Abrimos WhatsApp
    window.open(`https://wa.me/${telefono}`, '_blank');
  };

  const filtered = negocios.filter(n =>
    n.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter text-primary">Conexión Concepción</h1>
          <p className="text-muted-foreground">Directorio de servicios locales</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar servicios en Concepción..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid gap-4">
          {filtered.map((negocio) => (
            <Card key={negocio.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">{negocio.nombre}</CardTitle>
                <Badge variant="secondary">{negocio.categoria}</Badge>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4" />
                  {negocio.zona}
                </div>
                <Button 
                  onClick={() => handleContact(negocio.nombre, negocio.telefono)}
                  className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;

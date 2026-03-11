import { BadgeCheck, MessageCircle, User } from 'lucide-react';
import { Profesional } from '../types';
import { supabase } from '../lib/supabase';

interface ProfessionalCardProps {
  professional: Profesional;
}

export function ProfessionalCard({ professional }: ProfessionalCardProps) {
  const handleWhatsAppClick = async () => {
    const message = encodeURIComponent(
      'Hola, te encontré en Conexión Concepción y necesito un presupuesto'
    );
    const whatsappUrl = `https://wa.me/${professional.whatsapp}?text=${message}`;

    await supabase
      .from('profesionales')
      .update({ clics_recibidos: professional.clics_recibidos + 1 })
      .eq('id', professional.id);

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 ${
        professional.es_premium ? 'border-4 border-yellow-400' : 'border border-gray-200'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {professional.foto_url ? (
            <img
              src={professional.foto_url}
              alt={professional.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-blue-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {professional.nombre}
            </h3>
            {professional.es_verificado && (
              <BadgeCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
            )}
            {professional.es_premium && (
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                PREMIUM
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-1">{professional.categoria}</p>
          <p className="text-sm text-gray-500 mb-3">Zona: {professional.zona}</p>

          {professional.descripcion && (
            <p className="text-sm text-gray-700 mb-4 line-clamp-2">
              {professional.descripcion}
            </p>
          )}

          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Contactar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

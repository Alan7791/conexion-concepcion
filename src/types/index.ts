export interface Profesional {
  id: string;
  nombre: string;
  categoria: string;
  zona: string;
  whatsapp: string;
  foto_url: string | null;
  descripcion: string | null;
  es_verificado: boolean;
  es_premium: boolean;
  clics_recibidos: number;
  created_at: string;
}

export const CATEGORIAS = [
  'Electricista',
  'Plomero',
  'Técnico PC',
  'Fletes',
  'Carpintero',
  'Pintor',
  'Mecánico',
  'Cerrajero',
  'Albañil',
  'Jardinero',
  'Limpieza',
  'Refrigeración',
  'Otro',
] as const;

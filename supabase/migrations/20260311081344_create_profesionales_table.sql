/*
  # Conexión Concepción - Professional Directory Database

  1. New Tables
    - `profesionales`
      - `id` (uuid, primary key) - Unique identifier for each professional
      - `nombre` (text) - Professional's full name
      - `categoria` (text) - Service category (Electricista, Plomero, Técnico PC, Fletes, etc.)
      - `zona` (text) - Zone/area in Concepción where they operate
      - `whatsapp` (text) - WhatsApp contact number
      - `foto_url` (text, nullable) - URL to profile photo
      - `descripcion` (text, nullable) - Description of services offered
      - `es_verificado` (boolean) - Whether the professional is verified (shows trust badge)
      - `es_premium` (boolean) - Whether the professional has premium listing (golden border, appears first)
      - `clics_recibidos` (integer) - Number of clicks received on WhatsApp button (for billing metrics)
      - `created_at` (timestamptz) - Timestamp of when the professional was added

  2. Security
    - Enable RLS on `profesionales` table
    - Add policy for public read access (directory is publicly viewable)
    - Add policy for authenticated users to insert/update (admin functions)

  3. Notes
    - Premium professionals will be sorted first in the application
    - Click tracking is used for billing purposes
    - Verified badge indicates trusted professionals
*/

CREATE TABLE IF NOT EXISTS profesionales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  categoria text NOT NULL,
  zona text NOT NULL,
  whatsapp text NOT NULL,
  foto_url text,
  descripcion text,
  es_verificado boolean DEFAULT false,
  es_premium boolean DEFAULT false,
  clics_recibidos integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profesionales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view professionals"
  ON profesionales
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert professionals"
  ON profesionales
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update professionals"
  ON profesionales
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete professionals"
  ON profesionales
  FOR DELETE
  TO authenticated
  USING (true);
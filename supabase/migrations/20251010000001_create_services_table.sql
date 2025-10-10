/*
  # Create Services Table

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `price` (decimal)
      - `duration` (text) - e.g., "1 hour", "30 minutes"
      - `image_url` (text)
      - `is_active` (boolean)
      - `category` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Anyone can view active services
    - Only admins with edit_services permission can modify
*/

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price decimal(10, 2) NOT NULL DEFAULT 0,
  duration text,
  image_url text,
  is_active boolean DEFAULT true,
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Anyone can view active services
CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  USING (is_active = true);

-- Admins can view all services
CREATE POLICY "Admins can view all services"
  ON services FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

-- Admins with edit_services permission can insert services
CREATE POLICY "Admins with permission can insert services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (check_admin_permission('edit_services'));

-- Admins with edit_services permission can update services
CREATE POLICY "Admins with permission can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (check_admin_permission('edit_services'))
  WITH CHECK (check_admin_permission('edit_services'));

-- Admins with edit_services permission can delete services
CREATE POLICY "Admins with permission can delete services"
  ON services FOR DELETE
  TO authenticated
  USING (check_admin_permission('edit_services'));

-- Insert some sample services
INSERT INTO services (title, description, price, duration, category, image_url) VALUES
  ('Gold Jewelry Cleaning', 'Professional cleaning and polishing of gold jewelry items', 25.00, '30 minutes', 'cleaning', 'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg'),
  ('Ring Resizing', 'Expert ring resizing service for perfect fit', 50.00, '1-2 days', 'repair', 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg'),
  ('Custom Jewelry Design', 'Create your dream piece with our custom design service', 500.00, '2-4 weeks', 'custom', 'https://images.pexels.com/photos/1927257/pexels-photo-1927257.jpeg'),
  ('Watch Battery Replacement', 'Quick and professional watch battery replacement', 15.00, '15 minutes', 'repair', 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg')
ON CONFLICT DO NOTHING;

/*
  # Create medication options table

  1. New Tables
    - `medication_options`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `default_dosage` (text)
      - `frequency` (text)
      - `notes` (text)
  
  2. Security
    - Enable RLS on `medication_options` table
    - Add policy for authenticated users to read medication options
  
  3. Data
    - Insert initial medication options for different categories
*/

-- Create the medication_options table
CREATE TABLE IF NOT EXISTS medication_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  default_dosage text NOT NULL,
  frequency text NOT NULL,
  notes text
);

-- Enable Row Level Security
ALTER TABLE medication_options ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read medication options
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'medication_options' 
    AND policyname = 'Everyone can read medication options'
  ) THEN
    CREATE POLICY "Everyone can read medication options"
      ON medication_options
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Insert initial medication options
INSERT INTO medication_options (name, category, default_dosage, frequency, notes) VALUES
  -- Prescription medications
  ('Parol', 'prescription', '500mg', 'three_times_daily', 'Ağrı kesici ve ateş düşürücü'),
  ('Augmentin', 'prescription', '1000mg', 'twice_daily', 'Antibiyotik, yemeklerle birlikte alınmalı'),
  ('Nexium', 'prescription', '40mg', 'daily', 'Mide koruyucu, aç karnına alınmalı'),
  
  -- Vitamins
  ('D3 Vitamini', 'vitamin', '1000IU', 'daily', 'D vitamini eksikliği için'),
  ('B12 Vitamini', 'vitamin', '1000mcg', 'daily', 'B12 takviyesi'),
  ('Multivitamin', 'vitamin', '1 tablet', 'daily', 'Genel vitamin takviyesi'),
  
  -- Supplements
  ('Omega 3', 'supplement', '1000mg', 'daily', 'Balık yağı takviyesi'),
  ('Magnezyum', 'supplement', '300mg', 'daily', 'Magnezyum takviyesi'),
  ('Çinko', 'supplement', '15mg', 'daily', 'Bağışıklık sistemi desteği'),
  
  -- Chronic medications
  ('Levotiron', 'chronic', '50mcg', 'daily', 'Tiroid ilacı, aç karnına alınmalı'),
  ('Coversyl', 'chronic', '5mg', 'daily', 'Tansiyon ilacı'),
  ('Glucophage', 'chronic', '1000mg', 'twice_daily', 'Diyabet ilacı, yemeklerle birlikte alınmalı'),
  
  -- Temporary medications
  ('Arveles', 'temporary', '25mg', 'twice_daily', 'Ağrı kesici'),
  ('Aferin', 'temporary', '1 tablet', 'twice_daily', 'Soğuk algınlığı ilacı'),
  ('Majezik', 'temporary', '100mg', 'three_times_daily', 'Ağrı kesici ve iltihap giderici');
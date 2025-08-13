/*
  # Add medication options table and data
  
  1. New Tables
    - medication_options
      - id (uuid, primary key)
      - name (text)
      - category (text)
      - default_dosage (text)
      - frequency (text)
      - notes (text)
  
  2. Data
    - Adds predefined medication options for each category
*/

-- Create medication options table
CREATE TABLE IF NOT EXISTS medication_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  default_dosage text NOT NULL,
  frequency text NOT NULL,
  notes text
);

-- Insert predefined medication options
INSERT INTO medication_options (name, category, default_dosage, frequency, notes) VALUES
  -- Reçeteli İlaçlar
  ('Amlodipin', 'prescription', '5mg', 'daily', 'Yüksek tansiyon tedavisi için'),
  ('Metformin', 'prescription', '500mg', 'twice_daily', 'Yemeklerle birlikte alınmalı'),
  ('Levotiroksin', 'prescription', '50mcg', 'daily', 'Aç karnına alınmalı'),
  ('Pantoprazol', 'prescription', '40mg', 'daily', 'Kahvaltıdan 30 dakika önce'),
  ('Rosuvastatin', 'prescription', '10mg', 'daily', 'Akşam yemeğinden sonra'),

  -- Vitaminler
  ('D3 Vitamini', 'vitamin', '1000IU', 'daily', 'Yemekle birlikte alınmalı'),
  ('B12 Vitamini', 'vitamin', '1000mcg', 'daily', 'Sabah aç karnına'),
  ('Multivitamin', 'vitamin', '1 tablet', 'daily', 'Kahvaltı ile birlikte'),
  ('C Vitamini', 'vitamin', '500mg', 'daily', 'Bağışıklık sistemi desteği'),
  ('Magnezyum', 'vitamin', '300mg', 'daily', 'Akşam yemeğinden sonra'),

  -- Takviyeler
  ('Omega-3', 'supplement', '1000mg', 'daily', 'Yemekle birlikte alınmalı'),
  ('Probiyotik', 'supplement', '1 kapsül', 'daily', 'Aç karnına alınmalı'),
  ('Demir', 'supplement', '50mg', 'daily', 'C vitamini ile birlikte alınmalı'),
  ('Kalsiyum', 'supplement', '500mg', 'twice_daily', 'D vitamini ile birlikte'),
  ('Çinko', 'supplement', '15mg', 'daily', 'Bağışıklık sistemi desteği'),

  -- Kronik İlaçlar
  ('Metoprolol', 'chronic', '50mg', 'twice_daily', 'Tansiyon kontrolü için'),
  ('Levotiroksin', 'chronic', '100mcg', 'daily', 'Tiroid tedavisi'),
  ('İnsülin', 'chronic', '10 ünite', 'twice_daily', 'Yemeklerden önce'),
  ('Ventolin', 'chronic', '2 puf', 'as_needed', 'Astım tedavisi'),
  ('Warfarin', 'chronic', '5mg', 'daily', 'Kan sulandırıcı'),

  -- Geçici İlaçlar
  ('Parasetamol', 'temporary', '500mg', 'as_needed', 'Ağrı kesici'),
  ('İbuprofen', 'temporary', '400mg', 'as_needed', 'Ağrı ve ateş düşürücü'),
  ('Amoksisilin', 'temporary', '500mg', 'three_times_daily', 'Antibiyotik tedavisi'),
  ('Dekstrometorfan', 'temporary', '30mg', 'as_needed', 'Öksürük şurubu'),
  ('Setirizin', 'temporary', '10mg', 'daily', 'Alerji tedavisi');

-- Add RLS policies
ALTER TABLE medication_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read medication options"
  ON medication_options
  FOR SELECT
  TO authenticated
  USING (true);
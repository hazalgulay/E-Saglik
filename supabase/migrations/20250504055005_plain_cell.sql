/*
  # Sağlık Verileri Şeması

  1. Yeni Tablolar
    - `health_metrics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `blood_pressure_systolic` (integer)
      - `blood_pressure_diastolic` (integer)
      - `heart_rate` (integer)
      - `oxygen_level` (integer)
      - `created_at` (timestamptz)
    
    - `medications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `name` (text)
      - `dosage` (text)
      - `frequency` (text)
      - `time` (time)
      - `created_at` (timestamptz)
    
    - `sleep_records`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `quality` (integer)
      - `created_at` (timestamptz)

  2. Güvenlik
    - Tüm tablolar için RLS aktif
    - Kullanıcılar sadece kendi verilerini görebilir ve düzenleyebilir
*/

-- Sağlık Metrikleri Tablosu
CREATE TABLE IF NOT EXISTS health_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  blood_pressure_systolic integer,
  blood_pressure_diastolic integer,
  heart_rate integer,
  oxygen_level integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own health metrics"
  ON health_metrics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health metrics"
  ON health_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health metrics"
  ON health_metrics
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- İlaçlar Tablosu
CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  dosage text,
  frequency text,
  time time,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own medications"
  ON medications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medications"
  ON medications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medications"
  ON medications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Uyku Kayıtları Tablosu
CREATE TABLE IF NOT EXISTS sleep_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  quality integer CHECK (quality >= 1 AND quality <= 5),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sleep_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sleep records"
  ON sleep_records
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sleep records"
  ON sleep_records
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sleep records"
  ON sleep_records
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
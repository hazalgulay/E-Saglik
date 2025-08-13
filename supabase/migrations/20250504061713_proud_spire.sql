/*
  # Add additional health metrics

  1. New Tables
    - `water_intake`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `amount_ml` (integer)
      - `created_at` (timestamp)
    
    - `sleep_quality`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `duration_minutes` (integer)
      - `quality_rating` (integer, 1-5)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create water intake table
CREATE TABLE IF NOT EXISTS water_intake (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_ml integer NOT NULL CHECK (amount_ml >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create sleep quality table
CREATE TABLE IF NOT EXISTS sleep_quality (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_minutes integer NOT NULL CHECK (duration_minutes >= 0),
  quality_rating integer NOT NULL CHECK (quality_rating BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE water_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_quality ENABLE ROW LEVEL SECURITY;

-- Create policies for water_intake
CREATE POLICY "Users can insert own water intake"
  ON water_intake
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own water intake"
  ON water_intake
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own water intake"
  ON water_intake
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own water intake"
  ON water_intake
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for sleep_quality
CREATE POLICY "Users can insert own sleep quality"
  ON sleep_quality
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own sleep quality"
  ON sleep_quality
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own sleep quality"
  ON sleep_quality
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sleep quality"
  ON sleep_quality
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
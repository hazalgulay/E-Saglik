/*
  # Add Water Intake and Sleep Quality Tables

  1. New Tables
    - `water_intake`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `amount_ml` (integer, non-negative)
      - `created_at` (timestamp)
    
    - `sleep_quality`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `duration_minutes` (integer, non-negative)
      - `quality_rating` (integer, 1-5)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add CRUD policies for authenticated users
*/

-- Water Intake Table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS water_intake (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    amount_ml integer NOT NULL CHECK (amount_ml >= 0),
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

ALTER TABLE water_intake ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'water_intake' AND policyname = 'Users can insert own water intake'
  ) THEN
    CREATE POLICY "Users can insert own water intake"
      ON water_intake
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'water_intake' AND policyname = 'Users can view own water intake'
  ) THEN
    CREATE POLICY "Users can view own water intake"
      ON water_intake
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'water_intake' AND policyname = 'Users can update own water intake'
  ) THEN
    CREATE POLICY "Users can update own water intake"
      ON water_intake
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'water_intake' AND policyname = 'Users can delete own water intake'
  ) THEN
    CREATE POLICY "Users can delete own water intake"
      ON water_intake
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Sleep Quality Table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS sleep_quality (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    duration_minutes integer NOT NULL CHECK (duration_minutes >= 0),
    quality_rating integer NOT NULL CHECK (quality_rating >= 1 AND quality_rating <= 5),
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

ALTER TABLE sleep_quality ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sleep_quality' AND policyname = 'Users can insert own sleep quality'
  ) THEN
    CREATE POLICY "Users can insert own sleep quality"
      ON sleep_quality
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sleep_quality' AND policyname = 'Users can view own sleep quality'
  ) THEN
    CREATE POLICY "Users can view own sleep quality"
      ON sleep_quality
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sleep_quality' AND policyname = 'Users can update own sleep quality'
  ) THEN
    CREATE POLICY "Users can update own sleep quality"
      ON sleep_quality
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sleep_quality' AND policyname = 'Users can delete own sleep quality'
  ) THEN
    CREATE POLICY "Users can delete own sleep quality"
      ON sleep_quality
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;
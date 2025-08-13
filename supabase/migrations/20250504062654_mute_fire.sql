/*
  # Add Daily Health Routines Table

  1. New Tables
    - `daily_routines`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `time` (time, when the activity should occur)
      - `activity` (text, what to do)
      - `category` (text, type of activity)
      - `is_completed` (boolean, track completion)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `daily_routines` table
    - Add policies for authenticated users to manage their routines
*/

CREATE TABLE IF NOT EXISTS daily_routines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  time time NOT NULL,
  activity text NOT NULL,
  category text NOT NULL,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own routines"
  ON daily_routines
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own routines"
  ON daily_routines
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own routines"
  ON daily_routines
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own routines"
  ON daily_routines
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
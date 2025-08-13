/*
  # Add reminder enabled column to medications table

  1. Changes
    - Add `reminder_enabled` column to `medications` table with boolean type and default value of true
    
  2. Notes
    - Uses a safe migration pattern with IF NOT EXISTS check
    - Sets a default value to ensure existing records have a valid state
*/

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'medications' 
    AND column_name = 'reminder_enabled'
  ) THEN 
    ALTER TABLE medications 
    ADD COLUMN reminder_enabled boolean DEFAULT true;
  END IF;
END $$;
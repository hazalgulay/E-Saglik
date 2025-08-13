/*
  # Add category column to medications table

  1. Changes
    - Add `category` column to `medications` table with default value 'prescription'
    - Add constraint to ensure category is one of the allowed values
  
  2. Notes
    - Uses safe column addition with IF NOT EXISTS check
    - Adds check constraint for valid categories
*/

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'medications' 
    AND column_name = 'category'
  ) THEN 
    ALTER TABLE medications 
    ADD COLUMN category text NOT NULL DEFAULT 'prescription';

    ALTER TABLE medications
    ADD CONSTRAINT medications_category_check
    CHECK (category IN ('prescription', 'vitamin', 'supplement', 'chronic', 'temporary'));
  END IF;
END $$;
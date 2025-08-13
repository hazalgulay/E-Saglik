/*
  # Add notes column to medications table

  1. Changes
    - Add `notes` column to `medications` table
      - Type: text
      - Nullable: true
      - No default value

  2. Security
    - No changes to RLS policies needed as the column will be protected by existing policies
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'medications' AND column_name = 'notes'
  ) THEN
    ALTER TABLE medications ADD COLUMN notes text;
  END IF;
END $$;
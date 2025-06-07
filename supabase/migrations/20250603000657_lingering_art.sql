/*
  # Add book processing status
  
  1. Changes
    - Add status column to track processing state
    - Add processed_at timestamp
    - Add embeddings as JSONB for flexibility
  
  2. Security
    - Add policy for service role to update processing status
*/

-- Add processing-related columns
ALTER TABLE books 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'processed', 'failed')),
ADD COLUMN IF NOT EXISTS processed_at timestamptz,
ADD COLUMN IF NOT EXISTS embeddings jsonb;

-- Create index for faster status queries
CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);

-- Update RLS policies to allow the service role to update processing status
CREATE POLICY "Service role can update book processing status"
ON books FOR UPDATE
USING (auth.uid() IN (
  SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'service_role'
))
WITH CHECK (auth.uid() IN (
  SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'service_role'
));
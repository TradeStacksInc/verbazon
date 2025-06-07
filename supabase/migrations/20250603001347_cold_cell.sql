/*
  # Create storage buckets for book assets
  
  1. New Buckets
    - books: For storing book PDF files
    - covers: For storing book cover images
    - voices: For storing author voice samples
  
  2. Security
    - Public access for covers (anyone can view)
    - Authenticated access for books and voices
    - Authors can upload to all buckets
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('books', 'books', false),
  ('covers', 'covers', true),
  ('voices', 'voices', false)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Public can view covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'covers');

CREATE POLICY "Authenticated users can read books and voices"
ON storage.objects FOR SELECT
USING (
  bucket_id IN ('books', 'voices') 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authors can upload files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('books', 'covers', 'voices')
  AND auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'isAuthor' = 'true'
  )
);

CREATE POLICY "Authors can update their files"
ON storage.objects FOR UPDATE
USING (
  bucket_id IN ('books', 'covers', 'voices')
  AND auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'isAuthor' = 'true'
  )
);

CREATE POLICY "Authors can delete their files"
ON storage.objects FOR DELETE
USING (
  bucket_id IN ('books', 'covers', 'voices')
  AND auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'isAuthor' = 'true'
  )
);
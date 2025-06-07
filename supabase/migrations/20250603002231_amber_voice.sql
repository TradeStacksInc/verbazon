-- Create audio storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio', 'audio', true)
ON CONFLICT (id) DO NOTHING;

-- Add voice-related columns
ALTER TABLE books
ADD COLUMN IF NOT EXISTS voice_id text,
ADD COLUMN IF NOT EXISTS voice_settings jsonb;

-- Create policy for audio access
CREATE POLICY "Public can access audio files"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio');
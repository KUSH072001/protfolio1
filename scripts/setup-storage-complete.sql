-- Complete Supabase Storage Setup
-- Run this in your Supabase SQL Editor after creating the project

-- Enable the storage extension
CREATE EXTENSION IF NOT EXISTS "storage" SCHEMA "extensions";

-- Create storage buckets with proper configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('profile-images', 'profile-images', true, 5242880, '{"image/jpeg","image/png","image/webp","image/gif"}'),
  ('project-images', 'project-images', true, 5242880, '{"image/jpeg","image/png","image/webp","image/gif"}'),
  ('documents', 'documents', true, 10485760, '{"application/pdf"}')
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow deletes" ON storage.objects;

-- Create comprehensive RLS policies for storage
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (true);

CREATE POLICY "Allow uploads" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id IN ('profile-images', 'project-images', 'documents')
);

CREATE POLICY "Allow updates" ON storage.objects 
FOR UPDATE USING (
  bucket_id IN ('profile-images', 'project-images', 'documents')
);

CREATE POLICY "Allow deletes" ON storage.objects 
FOR DELETE USING (
  bucket_id IN ('profile-images', 'project-images', 'documents')
);

-- Create a function to clean up old files (optional)
CREATE OR REPLACE FUNCTION cleanup_old_files()
RETURNS void AS $$
BEGIN
  -- Delete files older than 30 days that are not referenced in portfolio_data
  DELETE FROM storage.objects 
  WHERE created_at < NOW() - INTERVAL '30 days'
  AND bucket_id IN ('profile-images', 'project-images', 'documents')
  AND name NOT IN (
    SELECT DISTINCT unnest(string_to_array(
      COALESCE(profile->>'profileImage', '') || ',' ||
      COALESCE(cv->>'url', '') || ',' ||
      (SELECT string_agg(project->>'image', ',') FROM jsonb_array_elements(projects) AS project),
      ','
    )) AS file_url
    FROM portfolio_data
    WHERE file_url LIKE '%supabase%'
  );
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup weekly (optional)
-- Note: This requires the pg_cron extension which may not be available on all Supabase plans
-- SELECT cron.schedule('cleanup-old-files', '0 2 * * 0', 'SELECT cleanup_old_files();');

-- Verify the setup
SELECT 
  b.id as bucket_name,
  b.public,
  b.file_size_limit,
  b.allowed_mime_types,
  COUNT(o.id) as file_count
FROM storage.buckets b
LEFT JOIN storage.objects o ON b.id = o.bucket_id
WHERE b.id IN ('profile-images', 'project-images', 'documents')
GROUP BY b.id, b.public, b.file_size_limit, b.allowed_mime_types
ORDER BY b.id;

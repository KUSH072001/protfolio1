-- Create storage buckets for file uploads
-- Run this in your Supabase SQL Editor

-- Enable the storage extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "storage" SCHEMA "extensions";

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('profile-images', 'profile-images', true, 5242880, '{"image/jpeg","image/png","image/webp","image/gif"}'),
  ('project-images', 'project-images', true, 5242880, '{"image/jpeg","image/png","image/webp","image/gif"}'),
  ('documents', 'documents', true, 10485760, '{"application/pdf"}')
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) policies for storage
-- Allow public access to view files
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (true);

-- Allow authenticated users to upload files
CREATE POLICY "Allow uploads" ON storage.objects FOR INSERT WITH CHECK (true);

-- Allow users to update their own files
CREATE POLICY "Allow updates" ON storage.objects FOR UPDATE USING (true);

-- Allow users to delete files
CREATE POLICY "Allow deletes" ON storage.objects FOR DELETE USING (true);

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

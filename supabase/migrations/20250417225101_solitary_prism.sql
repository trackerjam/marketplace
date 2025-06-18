/*
  # Create storage bucket for profile pictures

  1. Storage Bucket
    - Create a public bucket for storing profile pictures
    - Enable public access for reading images
    - Set up RLS policies for upload/delete operations

  2. Security
    - Add policy for authenticated users to upload their own profile pictures
    - Add policy for authenticated users to update their own profile pictures
    - Add policy for authenticated users to delete their own profile pictures
    - Add policy for public access to read profile pictures
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('public', 'public', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the storage bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'public');

CREATE POLICY "Authenticated users can upload profile pictures"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'public'
  AND (storage.foldername(name))[1] = 'profile-pictures'
);

CREATE POLICY "Users can update their own profile pictures"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'public'
  AND (storage.foldername(name))[1] = 'profile-pictures'
  AND name LIKE auth.uid() || '%'
)
WITH CHECK (
  bucket_id = 'public'
  AND (storage.foldername(name))[1] = 'profile-pictures'
  AND name LIKE auth.uid() || '%'
);

CREATE POLICY "Users can delete their own profile pictures"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'public'
  AND (storage.foldername(name))[1] = 'profile-pictures'
  AND name LIKE auth.uid() || '%'
);
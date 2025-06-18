/*
  # Add admin field and security for single admin account

  1. New Fields
    - `admin` boolean field on profiles table (default false)
    
  2. Constraints
    - Unique constraint ensuring only one admin exists
    - Email constraint ensuring admin must use admin@trackerjam.com
    
  3. Security
    - RLS policy preventing users from setting their own admin status
    - Only existing admins can modify admin privileges
*/

-- Add admin field to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS admin boolean DEFAULT false;

-- Create unique partial index to ensure only one admin exists
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_single_admin 
ON profiles (admin) 
WHERE admin = true;

-- Add constraint to ensure admin email is admin@trackerjam.com
ALTER TABLE profiles ADD CONSTRAINT admin_email_check 
CHECK (
  (admin = true AND email = 'admin@trackerjam.com') OR 
  (admin = false)
);

-- Set the admin@trackerjam.com account as admin if it exists
UPDATE profiles 
SET admin = true 
WHERE email = 'admin@trackerjam.com' AND admin = false;

-- Drop existing update policy to replace it
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new update policy that prevents admin privilege escalation
CREATE POLICY "Users can update own profile with admin restrictions"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND (
      -- If user is not trying to change admin status, allow update
      admin = (SELECT admin FROM profiles WHERE id = auth.uid()) OR
      -- Or if user is already an admin, they can manage admin status
      auth.uid() IN (SELECT id FROM profiles WHERE admin = true)
    )
  );
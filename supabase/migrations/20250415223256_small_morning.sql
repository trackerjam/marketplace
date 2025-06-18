/*
  # Add INSERT policy for profiles table

  1. Security Changes
    - Add INSERT policy to profiles table to allow new user registration
    - Policy ensures users can only create their own profile with matching auth.uid()

  Note: This policy is essential for the registration flow to work properly
*/

CREATE POLICY "Users can create their own profile"
ON public.profiles
FOR INSERT
TO public
WITH CHECK (auth.uid() = id);
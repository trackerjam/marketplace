/*
  # Fix RLS policy for bids table

  1. Security Changes
    - Drop existing INSERT policy for bids table
    - Create new INSERT policy that properly checks freelancer authentication
    - Ensure freelancers can only create bids with their own freelancer_id
    - Add UPDATE policy for bid status changes by job owners

  2. Policy Details
    - INSERT: Authenticated freelancers can create bids for their own profile
    - UPDATE: Job owners can update bid status (accept/reject)
    - SELECT: Existing policy remains (job owners and bid creators can view)
*/

-- Drop existing INSERT policy
DROP POLICY IF EXISTS "Freelancers can create bids" ON bids;

-- Create new INSERT policy for freelancers
CREATE POLICY "Freelancers can create bids"
  ON bids
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- User must be authenticated
    auth.uid() IS NOT NULL
    AND
    -- The freelancer_id must match the authenticated user's ID
    freelancer_id = auth.uid()
    AND
    -- User must be a freelancer
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'freelancer'::user_type
    )
    AND
    -- Job must exist and be open
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = bids.job_id 
      AND jobs.status = 'open'::job_status
    )
  );

-- Add UPDATE policy for job owners to accept/reject bids
CREATE POLICY "Job owners can update bid status"
  ON bids
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = bids.job_id 
      AND jobs.business_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = bids.job_id 
      AND jobs.business_id = auth.uid()
    )
  );
/*
  # Fix bids table INSERT policy

  1. Security Changes
    - Drop the existing INSERT policy for bids
    - Create a new INSERT policy that properly handles user authentication
    - Ensure freelancers can create bids for open jobs

  The issue was with the uid() function usage in the policy. We need to use auth.uid() instead
  and simplify the policy to make it more reliable.
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Freelancers can create bids" ON bids;

-- Create a new INSERT policy with proper authentication checks
CREATE POLICY "Freelancers can create bids"
  ON bids
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- User must be authenticated
    auth.uid() IS NOT NULL
    -- User must be the freelancer submitting the bid
    AND freelancer_id = auth.uid()
    -- User must be a freelancer
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'freelancer'::user_type
    )
    -- Job must exist and be open
    AND EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = bids.job_id 
      AND jobs.status = 'open'::job_status
    )
  );
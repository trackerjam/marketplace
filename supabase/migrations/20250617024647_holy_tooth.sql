/*
  # Fix RLS policy for bids table

  1. Security Changes
    - Drop the existing INSERT policy for bids table
    - Create a new INSERT policy that properly references auth.uid()
    - Ensure freelancers can create bids for open jobs

  The issue was that the policy was using uid() instead of auth.uid() which caused authentication failures.
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Freelancers can create bids" ON bids;

-- Create a new INSERT policy with proper auth.uid() reference
CREATE POLICY "Freelancers can create bids"
  ON bids
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.uid() IS NOT NULL) 
    AND (freelancer_id = auth.uid()) 
    AND (EXISTS ( 
      SELECT 1
      FROM profiles
      WHERE ((profiles.id = auth.uid()) AND (profiles.user_type = 'freelancer'::user_type))
    )) 
    AND (EXISTS ( 
      SELECT 1
      FROM jobs
      WHERE ((jobs.id = bids.job_id) AND (jobs.status = 'open'::job_status))
    ))
  );
/*
  # Fix RLS policies for contact freelancer functionality

  1. Policy Updates
    - Update bids INSERT policy to allow businesses to create contact bids
    - Add special handling for contact conversations (private jobs with budget 0)
  
  2. Changes
    - Modified bids INSERT policy to allow businesses to create bids for their own private jobs
    - This enables the contact freelancer functionality while maintaining security
*/

-- Drop the existing INSERT policy for bids
DROP POLICY IF EXISTS "Freelancers can create bids" ON bids;

-- Create a new INSERT policy that allows both freelancers to bid on open jobs
-- and businesses to create contact bids for their own private jobs
CREATE POLICY "Users can create bids with restrictions"
  ON bids
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Freelancers can create bids for open jobs
    (
      freelancer_id = auth.uid() 
      AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.user_type = 'freelancer'::user_type
      )
      AND EXISTS (
        SELECT 1 FROM jobs 
        WHERE jobs.id = bids.job_id 
        AND jobs.status = 'open'::job_status
      )
    )
    OR
    -- Businesses can create contact bids for their own private jobs
    (
      EXISTS (
        SELECT 1 FROM jobs 
        WHERE jobs.id = bids.job_id 
        AND jobs.business_id = auth.uid()
        AND jobs.visibility = 'private'::job_visibility
        AND jobs.budget = 0
      )
      AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.user_type = 'business'::user_type
      )
    )
  );
/*
  # Create reviews table

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `job_id` (uuid, foreign key to jobs)
      - `freelancer_id` (uuid, foreign key to profiles)
      - `business_id` (uuid, foreign key to profiles)
      - `rating` (integer, 1-5 scale)
      - `comment` (text, optional review comment)

  2. Security
    - Enable RLS on `reviews` table
    - Add policy for public to read reviews
    - Add policy for businesses to create reviews for completed jobs
    - Add policy for users to update their own reviews

  3. Constraints
    - Rating must be between 1 and 5
    - One review per job per business
    - Foreign key constraints to ensure data integrity

  4. Indexes
    - Performance indexes on freelancer_id, business_id, and job_id
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  job_id uuid NOT NULL,
  freelancer_id uuid NOT NULL,
  business_id uuid NOT NULL,
  rating integer NOT NULL,
  comment text DEFAULT ''
);

-- Add constraints
ALTER TABLE reviews ADD CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5);
ALTER TABLE reviews ADD CONSTRAINT unique_job_review UNIQUE (job_id, business_id);

-- Add foreign key constraints
ALTER TABLE reviews ADD CONSTRAINT reviews_job_id_fkey 
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE;
ALTER TABLE reviews ADD CONSTRAINT reviews_freelancer_id_fkey 
  FOREIGN KEY (freelancer_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE reviews ADD CONSTRAINT reviews_business_id_fkey 
  FOREIGN KEY (business_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_freelancer_id ON reviews(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_job_id ON reviews(job_id);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can read reviews"
  ON reviews
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Businesses can create reviews for completed jobs"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    business_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = reviews.job_id 
      AND jobs.business_id = auth.uid()
      AND jobs.status = 'completed'
    )
  );

CREATE POLICY "Users can update their own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (business_id = auth.uid())
  WITH CHECK (business_id = auth.uid());

-- Add updated_at trigger
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
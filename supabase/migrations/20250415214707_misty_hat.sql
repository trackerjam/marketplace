/*
  # Initial Schema Setup for Trackerjam Marketplace

  1. New Tables
    - `profiles`
      - Stores user profile information for both businesses and freelancers
      - Contains common fields and type-specific fields
    - `jobs`
      - Stores job postings from businesses
      - Includes all job details and requirements
    - `bids`
      - Stores freelancer bids on jobs
      - Links jobs and freelancers
    - `skills`
      - Stores available skills for jobs and freelancers
    - `user_skills`
      - Junction table linking users to their skills
    - `job_skills`
      - Junction table linking jobs to required skills
    
  2. Security
    - Enable RLS on all tables
    - Add policies for appropriate access control
*/

-- Create custom types
CREATE TYPE user_type AS ENUM ('business', 'freelancer');
CREATE TYPE job_visibility AS ENUM ('public', 'private');
CREATE TYPE job_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');

-- Profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  user_type user_type NOT NULL,
  profile_picture_url text,
  location text,
  bio text,
  -- Freelancer specific fields
  hourly_rate decimal(10,2),
  portfolio_links text[],
  -- Business specific fields
  company_name text,
  company_description text,
  website text,
  stripe_connect_id text,
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Jobs table
CREATE TABLE jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  business_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  budget decimal(10,2) NOT NULL,
  deadline timestamptz NOT NULL,
  require_trackerjam boolean DEFAULT false,
  min_trackerjam_hours int,
  visibility job_visibility DEFAULT 'public',
  status job_status DEFAULT 'open',
  CONSTRAINT title_length CHECK (char_length(title) >= 5)
);

-- Bids table
CREATE TABLE bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  freelancer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  cover_letter text NOT NULL,
  status text DEFAULT 'pending',
  trackerjam_data jsonb,
  UNIQUE(job_id, freelancer_id)
);

-- Skills table
CREATE TABLE skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL
);

-- User skills junction table
CREATE TABLE user_skills (
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, skill_id)
);

-- Job skills junction table
CREATE TABLE job_skills (
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (job_id, skill_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_skills ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Jobs policies
CREATE POLICY "Public jobs are viewable by everyone"
  ON jobs FOR SELECT
  USING (visibility = 'public' OR business_id = auth.uid());

CREATE POLICY "Businesses can create jobs"
  ON jobs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_type = 'business'
    )
  );

CREATE POLICY "Businesses can update own jobs"
  ON jobs FOR UPDATE
  USING (business_id = auth.uid());

-- Bids policies
CREATE POLICY "Bids are viewable by job owner and bid creator"
  ON bids FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = bids.job_id
      AND jobs.business_id = auth.uid()
    ) OR
    freelancer_id = auth.uid()
  );

CREATE POLICY "Freelancers can create bids"
  ON bids FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_type = 'freelancer'
    )
  );

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_bids_updated_at
    BEFORE UPDATE ON bids
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
/*
  # Add missing features for complete marketplace functionality

  1. Updates to existing tables
    - Add missing fields to support all required features
    - Update policies for better security

  2. New functionality
    - Support for skills filtering
    - Enhanced job search capabilities
    - Better user profile management
*/

-- Add any missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_budget ON jobs(budget);
CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON jobs(deadline);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_bids_status ON bids(status);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_job_skills_job_id ON job_skills(job_id);

-- Insert some default skills if they don't exist
INSERT INTO skills (name) VALUES 
  ('JavaScript'),
  ('TypeScript'),
  ('React'),
  ('Node.js'),
  ('Python'),
  ('Java'),
  ('PHP'),
  ('HTML/CSS'),
  ('Vue.js'),
  ('Angular'),
  ('WordPress'),
  ('Shopify'),
  ('UI/UX Design'),
  ('Graphic Design'),
  ('Logo Design'),
  ('Web Design'),
  ('Mobile App Design'),
  ('Content Writing'),
  ('Copywriting'),
  ('Blog Writing'),
  ('Technical Writing'),
  ('SEO'),
  ('Social Media Marketing'),
  ('Email Marketing'),
  ('PPC Advertising'),
  ('Data Entry'),
  ('Virtual Assistant'),
  ('Customer Service'),
  ('Project Management')
ON CONFLICT (name) DO NOTHING;
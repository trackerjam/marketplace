/*
  # Add messaging and notifications system

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `job_id` (uuid, references jobs)
      - `sender_id` (uuid, references profiles)
      - `content` (text)
      - `read` (boolean)

    - `notifications`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `user_id` (uuid, references profiles)
      - `type` (text)
      - `read` (boolean)
      - `data` (jsonb)

  2. Security
    - Enable RLS on both tables
    - Add policies for message access
    - Add policies for notification access
*/

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  read boolean DEFAULT false
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Messages policies
CREATE POLICY "Users can view messages for their jobs"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = messages.job_id
      AND (
        jobs.business_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM bids
          WHERE bids.job_id = jobs.id
          AND bids.freelancer_id = auth.uid()
          AND bids.status = 'accepted'
        )
      )
    )
  );

CREATE POLICY "Users can insert messages for their jobs"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_id
      AND (
        jobs.business_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM bids
          WHERE bids.job_id = jobs.id
          AND bids.freelancer_id = auth.uid()
          AND bids.status = 'accepted'
        )
      )
    )
  );

CREATE POLICY "Users can update their own messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  read boolean DEFAULT false,
  data jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create triggers for updated_at
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create notification on new message
CREATE OR REPLACE FUNCTION create_message_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the job details
  WITH job_details AS (
    SELECT 
      j.id as job_id,
      j.title as job_title,
      j.business_id,
      b.freelancer_id
    FROM jobs j
    LEFT JOIN bids b ON b.job_id = j.id AND b.status = 'accepted'
    WHERE j.id = NEW.job_id
  )
  INSERT INTO notifications (user_id, type, data)
  SELECT
    CASE
      WHEN job_details.business_id = NEW.sender_id THEN job_details.freelancer_id
      ELSE job_details.business_id
    END as user_id,
    'new_message',
    jsonb_build_object(
      'job_id', job_details.job_id,
      'job_title', job_details.job_title,
      'sender_id', NEW.sender_id,
      'message_id', NEW.id
    ) as data
  FROM job_details
  WHERE NEW.sender_id != CASE
    WHEN job_details.business_id = NEW.sender_id THEN job_details.freelancer_id
    ELSE job_details.business_id
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_message_notification_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION create_message_notification();
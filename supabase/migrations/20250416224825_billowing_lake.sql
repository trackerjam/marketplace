/*
  # Add payments table and related schema updates

  1. New Tables
    - `payments`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `amount` (numeric)
      - `status` (text)
      - `job_id` (uuid, references jobs)
      - `freelancer_id` (uuid, references profiles)
      - `business_id` (uuid, references profiles)
      - `stripe_payment_intent_id` (text)
      - `platform_fee` (numeric)

  2. Security
    - Enable RLS on payments table
    - Add policies for payment access
*/

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  amount numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  freelancer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  business_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_payment_intent_id text,
  platform_fee numeric(10,2) NOT NULL
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own payments (as either freelancer or business)
CREATE POLICY "Users can view their own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = freelancer_id OR 
    auth.uid() = business_id
  );

-- Allow the system to create payments
CREATE POLICY "System can create payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow the system to update payment status
CREATE POLICY "System can update payments"
  ON payments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
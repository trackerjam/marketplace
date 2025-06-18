/*
  # Payment System Enhancement

  1. New Tables
    - `withdrawals` - Track freelancer withdrawals
    
  2. Updates
    - Add indexes for better performance
    - Add constraints for data integrity
    
  3. Security
    - Enable RLS on withdrawals table
    - Add policies for withdrawal access
*/

-- Create withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  freelancer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  stripe_transfer_id text,
  CONSTRAINT positive_amount CHECK (amount > 0)
);

-- Enable RLS
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- Withdrawals policies
CREATE POLICY "Freelancers can view their own withdrawals"
  ON withdrawals
  FOR SELECT
  TO authenticated
  USING (freelancer_id = auth.uid());

CREATE POLICY "System can create withdrawals"
  ON withdrawals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can update withdrawals"
  ON withdrawals
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_withdrawals_updated_at
  BEFORE UPDATE ON withdrawals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_withdrawals_freelancer_id ON withdrawals(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);

-- Add constraints to payments table
ALTER TABLE payments ADD CONSTRAINT positive_amount CHECK (amount > 0);
ALTER TABLE payments ADD CONSTRAINT positive_platform_fee CHECK (platform_fee >= 0);
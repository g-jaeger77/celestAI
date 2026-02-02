-- Add stripe_payment_id column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_payment_id TEXT;

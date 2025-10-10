/*
  # Create profiles table for user authentication

  ## Description
  This migration creates the profiles table to store extended user information
  linked to Supabase auth.users. This enables the MUGA WORLD authentication system
  with business and personal account support.

  ## New Tables
  1. `profiles`
     - `id` (uuid, primary key) - Links to auth.users.id
     - `full_name` (text, required) - User's full name
     - `email` (text, required, unique) - User's email (synced from auth)
     - `phone` (text, optional) - E.164 format phone number
     - `country` (text, optional) - User's country
     - `city` (text, optional) - User's city
     - `address` (text, optional) - Full address
     - `account_type` (text, required) - 'business' or 'individual'
     - `extra` (jsonb, optional) - Additional metadata as JSON
     - `created_at` (timestamptz) - Account creation timestamp
     - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  1. Enable RLS on profiles table
  2. Policy: Users can read their own profile
  3. Policy: Users can insert their own profile (during registration)
  4. Policy: Users can update their own profile
  5. Policy: Users cannot delete profiles (soft delete via extra field if needed)

  ## Notes
  - The id field is explicitly set to match auth.uid() during user registration
  - Email is stored in profiles for easier querying but auth.users is the source of truth
  - The extra jsonb field allows for flexible schema evolution
  - All policies check auth.uid() to ensure users only access their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  country text,
  city text,
  address text,
  account_type text NOT NULL CHECK (account_type IN ('business', 'individual')),
  extra jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Create index on account_type for analytics
CREATE INDEX IF NOT EXISTS idx_profiles_account_type ON profiles(account_type);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile during registration
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profile changes
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

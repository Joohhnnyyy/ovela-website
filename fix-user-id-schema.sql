-- Fix user_id column to support Firebase user IDs
-- Run this in Supabase SQL Editor

-- Change user_id column from UUID to TEXT to support Firebase user IDs
ALTER TABLE public.orders 
ALTER COLUMN user_id TYPE TEXT;

-- Update the column comment for clarity
COMMENT ON COLUMN public.orders.user_id IS 'Firebase user ID (string format)';

-- Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'user_id';
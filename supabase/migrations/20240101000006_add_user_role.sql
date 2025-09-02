-- Add role column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

-- Add check constraint for valid roles
ALTER TABLE users ADD CONSTRAINT check_user_role 
  CHECK (role IN ('user', 'admin', 'moderator'));

-- Create index for role column for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Update existing users to have 'user' role if null
UPDATE users SET role = 'user' WHERE role IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN users.role IS 'User role: user, admin, or moderator';
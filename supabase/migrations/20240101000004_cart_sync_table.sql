-- Create cart_sync table for server-side cart synchronization
CREATE TABLE IF NOT EXISTS cart_sync (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  cart_data JSONB NOT NULL DEFAULT '{}',
  last_modified TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  device_id TEXT,
  sync_version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cart_sync_user_id ON cart_sync(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_sync_last_modified ON cart_sync(last_modified);
CREATE INDEX IF NOT EXISTS idx_cart_sync_device_id ON cart_sync(device_id);

-- Create trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_cart_sync_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.sync_version = OLD.sync_version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cart_sync_updated_at_trigger
  BEFORE UPDATE ON cart_sync
  FOR EACH ROW
  EXECUTE FUNCTION update_cart_sync_updated_at();

-- Add RLS (Row Level Security) policies
ALTER TABLE cart_sync ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own cart data
CREATE POLICY "Users can access their own cart data" ON cart_sync
  FOR ALL USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Policy: Service role can access all cart data (for admin operations)
CREATE POLICY "Service role can access all cart data" ON cart_sync
  FOR ALL USING (current_setting('role') = 'service_role');

-- Grant necessary permissions
GRANT ALL ON cart_sync TO authenticated;
GRANT ALL ON cart_sync TO service_role;

-- Add comments for documentation
COMMENT ON TABLE cart_sync IS 'Stores synchronized cart data for users across devices';
COMMENT ON COLUMN cart_sync.user_id IS 'User identifier for cart ownership';
COMMENT ON COLUMN cart_sync.cart_data IS 'JSON data containing cart items and totals';
COMMENT ON COLUMN cart_sync.last_modified IS 'Timestamp of last cart modification';
COMMENT ON COLUMN cart_sync.device_id IS 'Device identifier for conflict resolution';
COMMENT ON COLUMN cart_sync.sync_version IS 'Version number for optimistic locking';

-- Create RPC functions for cart sync operations
CREATE OR REPLACE FUNCTION get_cart_sync(p_user_id TEXT)
RETURNS TABLE(
  id UUID,
  user_id TEXT,
  cart_data JSONB,
  last_modified TIMESTAMPTZ,
  device_id TEXT,
  sync_version INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT cs.id, cs.user_id, cs.cart_data, cs.last_modified, cs.device_id, cs.sync_version, cs.created_at, cs.updated_at
  FROM cart_sync cs
  WHERE cs.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION upsert_cart_sync(
  p_user_id TEXT,
  p_cart_data JSONB,
  p_device_id TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO cart_sync (user_id, cart_data, device_id, last_modified)
  VALUES (p_user_id, p_cart_data, p_device_id, NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET
    cart_data = EXCLUDED.cart_data,
    device_id = EXCLUDED.device_id,
    last_modified = NOW(),
    updated_at = NOW(),
    sync_version = cart_sync.sync_version + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION delete_cart_sync(p_user_id TEXT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM cart_sync WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on the functions
GRANT EXECUTE ON FUNCTION get_cart_sync(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION upsert_cart_sync(TEXT, JSONB, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_cart_sync(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_cart_sync(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION upsert_cart_sync(TEXT, JSONB, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION delete_cart_sync(TEXT) TO service_role;
-- Create error_logs table for comprehensive error tracking
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  error_type TEXT NOT NULL CHECK (error_type IN ('client', 'server', 'api', 'database', 'auth', 'payment')),
  error_message TEXT NOT NULL,
  error_stack TEXT,
  user_id TEXT,
  session_id TEXT,
  url TEXT,
  user_agent TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  context JSONB DEFAULT '{}',
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON error_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_error_type ON error_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved ON error_logs(resolved);
CREATE INDEX IF NOT EXISTS idx_error_logs_session_id ON error_logs(session_id);

-- Create trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_error_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER error_logs_updated_at_trigger
  BEFORE UPDATE ON error_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_error_logs_updated_at();

-- Add RLS (Row Level Security) policies
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own error logs
CREATE POLICY "Users can access their own error logs" ON error_logs
  FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Policy: Service role can access all error logs (for admin operations)
CREATE POLICY "Service role can access all error logs" ON error_logs
  FOR ALL USING (current_setting('role') = 'service_role');

-- Policy: Allow inserting error logs for authenticated users
CREATE POLICY "Allow inserting error logs" ON error_logs
  FOR INSERT WITH CHECK (true);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON error_logs TO authenticated;
GRANT ALL ON error_logs TO service_role;

-- Create RPC function to log errors
CREATE OR REPLACE FUNCTION log_error(
  p_error_type TEXT,
  p_error_message TEXT,
  p_error_stack TEXT DEFAULT NULL,
  p_user_id TEXT DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL,
  p_url TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_severity TEXT DEFAULT 'medium',
  p_context JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  new_error_id UUID;
BEGIN
  INSERT INTO error_logs (
    error_type,
    error_message,
    error_stack,
    user_id,
    session_id,
    url,
    user_agent,
    severity,
    context
  ) VALUES (
    p_error_type,
    p_error_message,
    p_error_stack,
    p_user_id,
    p_session_id,
    p_url,
    p_user_agent,
    p_severity,
    p_context
  ) RETURNING id INTO new_error_id;
  
  RETURN new_error_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RPC function to get error metrics
CREATE OR REPLACE FUNCTION get_error_metrics(since_timestamp TIMESTAMPTZ)
RETURNS TABLE(
  id UUID,
  error_type TEXT,
  error_message TEXT,
  error_stack TEXT,
  user_id TEXT,
  session_id TEXT,
  url TEXT,
  user_agent TEXT,
  timestamp TIMESTAMPTZ,
  severity TEXT,
  context JSONB,
  resolved BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    el.id,
    el.error_type,
    el.error_message,
    el.error_stack,
    el.user_id,
    el.session_id,
    el.url,
    el.user_agent,
    el.timestamp,
    el.severity,
    el.context,
    el.resolved,
    el.created_at,
    el.updated_at
  FROM error_logs el
  WHERE el.timestamp >= since_timestamp
  ORDER BY el.timestamp DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RPC function to resolve errors
CREATE OR REPLACE FUNCTION resolve_error(error_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE error_logs
  SET resolved = TRUE, updated_at = NOW()
  WHERE id = error_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RPC function to get error statistics
CREATE OR REPLACE FUNCTION get_error_statistics(
  since_timestamp TIMESTAMPTZ DEFAULT NOW() - INTERVAL '24 hours'
)
RETURNS TABLE(
  total_errors BIGINT,
  critical_errors BIGINT,
  high_errors BIGINT,
  medium_errors BIGINT,
  low_errors BIGINT,
  resolved_errors BIGINT,
  unresolved_errors BIGINT,
  error_rate_per_hour NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_errors,
    COUNT(*) FILTER (WHERE severity = 'critical') as critical_errors,
    COUNT(*) FILTER (WHERE severity = 'high') as high_errors,
    COUNT(*) FILTER (WHERE severity = 'medium') as medium_errors,
    COUNT(*) FILTER (WHERE severity = 'low') as low_errors,
    COUNT(*) FILTER (WHERE resolved = TRUE) as resolved_errors,
    COUNT(*) FILTER (WHERE resolved = FALSE) as unresolved_errors,
    ROUND(
      COUNT(*) / GREATEST(EXTRACT(EPOCH FROM (NOW() - since_timestamp)) / 3600, 1),
      2
    ) as error_rate_per_hour
  FROM error_logs
  WHERE timestamp >= since_timestamp;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on the functions
GRANT EXECUTE ON FUNCTION log_error(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_error_metrics(TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION resolve_error(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_error_statistics(TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION log_error(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) TO service_role;
GRANT EXECUTE ON FUNCTION get_error_metrics(TIMESTAMPTZ) TO service_role;
GRANT EXECUTE ON FUNCTION resolve_error(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION get_error_statistics(TIMESTAMPTZ) TO service_role;

-- Add comments for documentation
COMMENT ON TABLE error_logs IS 'Comprehensive error logging for application monitoring';
COMMENT ON COLUMN error_logs.error_type IS 'Type of error: client, server, api, database, auth, payment';
COMMENT ON COLUMN error_logs.error_message IS 'Human-readable error message';
COMMENT ON COLUMN error_logs.error_stack IS 'Stack trace for debugging';
COMMENT ON COLUMN error_logs.user_id IS 'ID of user who encountered the error';
COMMENT ON COLUMN error_logs.session_id IS 'Session ID for tracking user sessions';
COMMENT ON COLUMN error_logs.url IS 'URL where the error occurred';
COMMENT ON COLUMN error_logs.user_agent IS 'Browser/client user agent string';
COMMENT ON COLUMN error_logs.severity IS 'Error severity: low, medium, high, critical';
COMMENT ON COLUMN error_logs.context IS 'Additional context data as JSON';
COMMENT ON COLUMN error_logs.resolved IS 'Whether the error has been resolved';

COMMENT ON FUNCTION log_error(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) IS 'Log an error to the database';
COMMENT ON FUNCTION get_error_metrics(TIMESTAMPTZ) IS 'Get error metrics since a specific timestamp';
COMMENT ON FUNCTION resolve_error(UUID) IS 'Mark an error as resolved';
COMMENT ON FUNCTION get_error_statistics(TIMESTAMPTZ) IS 'Get aggregated error statistics';
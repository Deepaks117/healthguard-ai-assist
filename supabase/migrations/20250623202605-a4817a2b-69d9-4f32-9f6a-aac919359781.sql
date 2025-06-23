
-- Add missing RLS policies for audit_logs table
CREATE POLICY "Users can create audit logs" 
  ON public.audit_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add missing RLS policies for notifications table  
CREATE POLICY "Users can create notifications" 
  ON public.notifications FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add missing RLS policies for risk_logs table
CREATE POLICY "Users can update their own risk logs" 
  ON public.risk_logs FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own risk logs" 
  ON public.risk_logs FOR DELETE 
  USING (auth.uid() = user_id);

-- Add missing RLS policies for compliance_reports table
CREATE POLICY "Users can delete their own compliance reports" 
  ON public.compliance_reports FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to automatically log user actions
CREATE OR REPLACE FUNCTION public.log_user_action(
  action_type TEXT,
  resource_type TEXT DEFAULT NULL,
  resource_id TEXT DEFAULT NULL,
  details JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    details,
    created_at
  ) VALUES (
    auth.uid(),
    action_type,
    resource_type,
    resource_id,
    details,
    now()
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;


-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'staff');
CREATE TYPE issue_type AS ENUM ('critical', 'warning', 'info');
CREATE TYPE risk_type AS ENUM ('phishing', 'unauthorized_access', 'data_exposure', 'malware', 'insider_threat');

-- Users table (profiles table that references auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role DEFAULT 'staff',
  clinic_name TEXT,
  standards JSONB DEFAULT '[]'::jsonb,
  trial_status BOOLEAN DEFAULT true,
  trial_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Compliance reports table
CREATE TABLE public.compliance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  document_id TEXT,
  document_name TEXT,
  score INTEGER DEFAULT 0,
  issues JSONB DEFAULT '[]'::jsonb,
  scanned_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Risk logs table
CREATE TABLE public.risk_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type risk_type NOT NULL,
  severity TEXT DEFAULT 'medium',
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Training modules table
CREATE TABLE public.training_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 30,
  difficulty TEXT DEFAULT 'beginner',
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Training progress table
CREATE TABLE public.training_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES public.training_modules(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false,
  score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Audit logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

-- RLS Policies for compliance_reports
CREATE POLICY "Users can view their own compliance reports" 
  ON public.compliance_reports FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create compliance reports" 
  ON public.compliance_reports FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own compliance reports" 
  ON public.compliance_reports FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for risk_logs
CREATE POLICY "Users can view their own risk logs" 
  ON public.risk_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create risk logs" 
  ON public.risk_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for training_modules (public read)
CREATE POLICY "Anyone can view training modules" 
  ON public.training_modules FOR SELECT 
  TO authenticated
  USING (true);

-- RLS Policies for training_progress
CREATE POLICY "Users can view their own training progress" 
  ON public.training_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create training progress" 
  ON public.training_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own training progress" 
  ON public.training_progress FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for audit_logs
CREATE POLICY "Users can view their own audit logs" 
  ON public.audit_logs FOR SELECT 
  USING (auth.uid() = user_id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, trial_status, trial_expires_at)
  VALUES (
    NEW.id,
    NEW.email,
    'staff',
    true,
    now() + interval '7 days'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert sample training modules
INSERT INTO public.training_modules (title, description, duration_minutes, difficulty) VALUES
('HIPAA Privacy Fundamentals', 'Essential privacy rules and patient rights under HIPAA', 45, 'beginner'),
('Cybersecurity Awareness', 'Identify and prevent common cybersecurity threats', 30, 'beginner'),
('Data Breach Response', 'Step-by-step guide to handling data breaches', 60, 'intermediate'),
('GDPR Compliance', 'European data protection regulations for healthcare', 40, 'intermediate');

-- Create storage bucket for compliance documents
INSERT INTO storage.buckets (id, name, public) VALUES ('compliance-documents', 'compliance-documents', false);

-- Storage policy for compliance documents
CREATE POLICY "Users can upload their own documents" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'compliance-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'compliance-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own documents" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'compliance-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'compliance-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

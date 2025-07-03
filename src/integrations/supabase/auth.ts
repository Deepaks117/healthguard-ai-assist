
import { supabase } from './client';
import type { User, Session } from '@supabase/supabase-js';

export interface SignUpData {
  email: string;
  password: string;
  clinic_name: string;
  standards: string[];
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  contact_phone: string;
  primary_contact_name: string;
  primary_contact_email: string;
  primary_contact_phone: string;
  clinic_type: string;
  license_number: string;
  license_authority: string;
  license_expiration: string;
  compliance_officer_name?: string;
  compliance_officer_email?: string;
  compliance_officer_phone?: string;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: Error | null;
}

export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  const { email, password, ...clinicData } = data;
  
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        clinic_name: clinicData.clinic_name,
        standards: clinicData.standards
      }
    }
  });

  if (error) {
    return { user: null, session: null, error };
  }

  // Update the user profile with all clinic onboarding data
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('users')
      .update({
        clinic_name: clinicData.clinic_name,
        standards: clinicData.standards || [],
        address: clinicData.address,
        city: clinicData.city,
        state: clinicData.state,
        zip: clinicData.zip,
        country: clinicData.country,
        contact_phone: clinicData.contact_phone,
        primary_contact_name: clinicData.primary_contact_name,
        primary_contact_email: clinicData.primary_contact_email,
        primary_contact_phone: clinicData.primary_contact_phone,
        clinic_type: clinicData.clinic_type,
        license_number: clinicData.license_number,
        license_authority: clinicData.license_authority,
        license_expiration: clinicData.license_expiration,
        compliance_officer_name: clinicData.compliance_officer_name || null,
        compliance_officer_email: clinicData.compliance_officer_email || null,
        compliance_officer_phone: clinicData.compliance_officer_phone || null
      })
      .eq('id', authData.user.id);

    if (profileError) {
      console.error('Profile update error:', profileError);
    }
  }

  return { 
    user: authData.user, 
    session: authData.session, 
    error: null 
  };
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  return {
    user: data.user,
    session: data.session,
    error
  };
};

export const signOut = async (): Promise<{ error: Error | null }> => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getUser = async (): Promise<{ user: User | null; error: Error | null }> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const getSession = async (): Promise<{ session: Session | null; error: Error | null }> => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
};

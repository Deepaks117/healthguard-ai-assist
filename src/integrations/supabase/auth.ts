
import { supabase } from './client';
import type { User, Session } from '@supabase/supabase-js';

export interface SignUpData {
  email: string;
  password: string;
  clinic_name: string;
  standards: string[];
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: Error | null;
}

export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  const { email, password, clinic_name, standards } = data;
  
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        clinic_name,
        standards
      }
    }
  });

  if (error) {
    return { user: null, session: null, error };
  }

  // Update the user profile with additional data
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('users')
      .update({
        clinic_name,
        standards: standards || []
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

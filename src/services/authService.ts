
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'admin' | 'patient';
  created_at: string;
  updated_at: string;
}

export async function signUp(
  email: string, 
  password: string, 
  first_name: string, 
  last_name: string, 
  phone?: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name,
        last_name,
        phone
      }
    }
  });
  
  if (error) throw error;
  
  // After successful signup, try to sign in the user
  if (data.user) {
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) {
        console.log("Auto sign-in failed:", signInError.message);
        return data;
      }
      
      return signInData;
    } catch (signInErr) {
      console.log("Error during auto sign-in:", signInErr);
      return data;
    }
  }
  
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data as UserProfile;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return profile?.role === 'admin';
}

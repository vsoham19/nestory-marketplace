
import { supabase } from '@/lib/supabase';

// Profile interface
export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string | null;
}

// Get the current user's profile
export const getCurrentProfile = async (): Promise<Profile | null> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    // Get the profile from the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data as Profile;
  } catch (error) {
    console.error('Error fetching current profile:', error);
    return null;
  }
};

// Update the current user's profile
export const updateProfile = async (updates: Partial<Profile>): Promise<Profile | null> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    // Update the profile
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }
    
    return data as Profile;
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
};

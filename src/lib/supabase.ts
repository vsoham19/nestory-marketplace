
import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallbacks to hardcoded values for safety
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://wixngvknbvjthbasfijk.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpeG5ndmtuYnZqdGhiYXNmaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MjIxODIsImV4cCI6MjA1OTE5ODE4Mn0.BfK7Zn6adUbIeJNw1p2_iCCh-aex342SCbcgNluPPpc";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file or environment settings.');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: localStorage
    }
  }
);

// Type for Supabase tables
export type Database = {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          price: number;
          address: string | null;
          city: string | null;
          state: string | null;
          zipcode: string | null;
          bedrooms: number | null;
          bathrooms: number | null;
          area: number | null;
          image_urls: string[] | null;
          created_at: string | null;
          updated_at: string | null;
          user_id: string | null;
          published: boolean | null;
          type: string | null;
          status: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          price: number;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zipcode?: string | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          area?: number | null;
          image_urls?: string[] | null;
          created_at?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          published?: boolean | null;
          type?: string | null;
          status?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          price?: number;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zipcode?: string | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          area?: number | null;
          image_urls?: string[] | null;
          created_at?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          published?: boolean | null;
          type?: string | null;
          status?: string | null;
        };
      };
      favorites: {
        Row: {
          id: string;
          created_at: string | null;
          user_id: string | null;
          property_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          user_id?: string | null;
          property_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          user_id?: string | null;
          property_id?: string | null;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          property_id: string;
          amount: number;
          status: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          property_id: string;
          amount: number;
          status: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          property_id?: string;
          amount?: number;
          status?: string;
          created_at?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: string | null;
        };
        Insert: {
          id: string;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: string | null;
        };
      };
    };
  };
};

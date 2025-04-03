
import { createClient } from '@supabase/supabase-js';

// Use the hardcoded values from src/integrations/supabase/client.ts since the env variables seem to be causing issues
const supabaseUrl = "https://wixngvknbvjthbasfijk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpeG5ndmtuYnZqdGhiYXNmaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MjIxODIsImV4cCI6MjA1OTE5ODE4Mn0.BfK7Zn6adUbIeJNw1p2_iCCh-aex342SCbcgNluPPpc";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file or environment settings.');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// Type for Supabase tables
export type Database = {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string;
          title: string;
          description: string;
          price: number;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          type: 'apartment' | 'house' | 'condo' | 'townhouse' | 'land' | 'commercial';
          status: 'for-sale' | 'for-rent' | 'sold' | 'rented';
          bedrooms: number;
          bathrooms: number;
          area: number;
          images: string[];
          features: string[];
          created_at: string;
          user_id: string;
          published: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          price: number;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          type: 'apartment' | 'house' | 'condo' | 'townhouse' | 'land' | 'commercial';
          status: 'for-sale' | 'for-rent' | 'sold' | 'rented';
          bedrooms: number;
          bathrooms: number;
          area: number;
          images: string[];
          features: string[];
          created_at?: string;
          user_id: string;
          published?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          price?: number;
          address?: string;
          city?: string;
          state?: string;
          zip_code?: string;
          type?: 'apartment' | 'house' | 'condo' | 'townhouse' | 'land' | 'commercial';
          status?: 'for-sale' | 'for-rent' | 'sold' | 'rented';
          bedrooms?: number;
          bathrooms?: number;
          area?: number;
          images?: string[];
          features?: string[];
          created_at?: string;
          user_id?: string;
          published?: boolean;
        };
      };
    };
  };
};

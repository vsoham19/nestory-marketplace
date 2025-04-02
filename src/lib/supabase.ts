
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file or environment settings.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
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

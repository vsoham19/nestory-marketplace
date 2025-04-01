
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: 'apartment' | 'house' | 'condo' | 'townhouse' | 'land' | 'commercial';
  status: 'for-sale' | 'for-rent' | 'sold' | 'rented';
  bedrooms: number;
  bathrooms: number;
  area: number; // square feet
  images: string[];
  features: string[];
  createdAt: Date;
  userId: string;
  published: boolean; // New property to track if a property is published
  developer?: Developer; // Optional developer/agent information
}

export interface Developer {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface PropertyFilter {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  type?: Property['type'];
  status?: Property['status'];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  role: 'buyer' | 'seller' | 'agent' | 'admin';
}

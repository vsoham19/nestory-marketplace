
import { Property } from '@/lib/types';
import { MOCK_PROPERTIES } from '@/lib/mock-data';
import { toast } from '@/components/ui/use-toast';

// In-memory storage for new properties
let newProperties: Property[] = [];

// Get all properties (mock + new added ones)
export const getAllProperties = (): Property[] => {
  return [...MOCK_PROPERTIES, ...newProperties];
};

// Add a new property
export const addProperty = (property: Omit<Property, 'id' | 'createdAt' | 'userId'>): Property => {
  // Create a new property with required fields
  const newProperty: Property = {
    ...property,
    id: `new-${Date.now()}`, // Generate a unique ID
    createdAt: new Date(),
    userId: 'current-user' // In a real app, this would be the logged-in user's ID
  };
  
  // Add the new property to our in-memory storage
  newProperties = [newProperty, ...newProperties];
  
  // In a real app, this would be an API call to save to database
  toast({
    title: "Property Added",
    description: "Your property has been successfully added!",
    duration: 5000,
  });
  
  return newProperty;
};

// Filter properties based on criteria
export const filterProperties = (properties: Property[], filters: Record<string, any>): Property[] => {
  return properties.filter(property => {
    for (const key in filters) {
      if (filters[key] && property[key as keyof Property] !== filters[key]) {
        return false;
      }
    }
    return true;
  });
};


import { Property } from '@/lib/types';
import { MOCK_PROPERTIES } from '@/lib/mock-data';
import { toast } from '@/components/ui/use-toast';

// In-memory storage for new properties
let newProperties: Property[] = [];

// Get all properties (mock + published new ones)
export const getAllProperties = (): Property[] => {
  // Return mock properties and only published new properties
  return [...MOCK_PROPERTIES, ...newProperties.filter(property => property.published)];
};

// Get all properties including unpublished ones (for admin views)
export const getAllPropertiesIncludingUnpublished = (): Property[] => {
  return [...MOCK_PROPERTIES, ...newProperties];
};

// Add a new property
export const addProperty = (property: Omit<Property, 'id' | 'createdAt' | 'userId' | 'published'>): Property => {
  // Create a new property with required fields
  const newProperty: Property = {
    ...property,
    id: `new-${Date.now()}`, // Generate a unique ID
    createdAt: new Date(),
    userId: 'current-user', // In a real app, this would be the logged-in user's ID
    published: true // By default, properties are published immediately
  };
  
  // Add the new property to our in-memory storage
  newProperties = [newProperty, ...newProperties];
  
  // In a real app, this would be an API call to save to database
  toast({
    title: "Property Added",
    description: "Your property has been successfully added and published!",
    duration: 5000,
  });
  
  return newProperty;
};

// Update property published status
export const updatePropertyPublishedStatus = (propertyId: string, published: boolean): Property | undefined => {
  // Find the property in the new properties array
  const propertyIndex = newProperties.findIndex(p => p.id === propertyId);
  
  if (propertyIndex !== -1) {
    // Update the property
    newProperties[propertyIndex] = {
      ...newProperties[propertyIndex],
      published
    };
    
    toast({
      title: published ? "Property Published" : "Property Unpublished",
      description: published 
        ? "Your property is now visible to all users." 
        : "Your property has been unpublished and is no longer visible to users.",
      duration: 5000,
    });
    
    return newProperties[propertyIndex];
  }
  
  return undefined;
};

// Get a single property by ID
export const getPropertyById = (id: string): Property | undefined => {
  // Check mock properties first
  const mockProperty = MOCK_PROPERTIES.find(property => property.id === id);
  if (mockProperty) return mockProperty;
  
  // Then check new properties
  return newProperties.find(property => property.id === id);
};

// Filter properties based on criteria
export const filterProperties = (properties: Property[], filters: Record<string, any>): Property[] => {
  return properties.filter(property => {
    for (const key in filters) {
      // Special case for location which can match city, address, or zip code
      if (key === 'location' && filters[key]) {
        const searchTerm = filters[key].toLowerCase();
        const cityMatch = property.city.toLowerCase().includes(searchTerm);
        const addressMatch = property.address.toLowerCase().includes(searchTerm);
        const zipMatch = property.zipCode.toLowerCase().includes(searchTerm);
        const stateMatch = property.state.toLowerCase().includes(searchTerm);
        
        if (!(cityMatch || addressMatch || zipMatch || stateMatch)) {
          return false;
        }
      } 
      // For other filters, do exact match
      else if (filters[key] && property[key as keyof Property] !== filters[key]) {
        return false;
      }
    }
    return true;
  });
};


import { Property } from '@/lib/types';
import { MOCK_PROPERTIES } from '@/lib/mock-data';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

// In-memory storage for new properties
let newProperties: Property[] = [];

// Get all properties (mock + published new ones + supabase ones)
export const getAllProperties = async (): Promise<Property[]> => {
  try {
    // Try to fetch from Supabase first
    const { data: supabaseProperties, error } = await supabase
      .from('properties')
      .select('*')
      .eq('published', true);
      
    if (error) {
      console.error('Error fetching from Supabase:', error);
      // Fall back to mock data if there's an error
      return [...MOCK_PROPERTIES, ...newProperties.filter(property => property.published)];
    }
    
    if (supabaseProperties && supabaseProperties.length > 0) {
      console.log('Properties fetched from Supabase:', supabaseProperties);
      
      // Map the Supabase data to our Property type
      const mappedProperties = supabaseProperties.map(prop => ({
        id: prop.id,
        title: prop.title,
        description: prop.description || '',
        price: prop.price,
        address: prop.address || '',
        city: prop.city || '',
        state: prop.state || '',
        zipCode: prop.zipcode || '',
        type: prop.type as Property['type'] || 'house',
        status: prop.status as Property['status'] || 'for-sale',
        bedrooms: prop.bedrooms || 0,
        bathrooms: prop.bathrooms || 0,
        area: prop.area || 0,
        images: prop.image_urls || [],
        features: [], // Default value since this doesn't exist in the DB yet
        createdAt: prop.created_at ? new Date(prop.created_at) : new Date(),
        userId: prop.user_id || 'unknown',
        published: prop.published === true
      })) as Property[];
      
      return [...mappedProperties, ...MOCK_PROPERTIES, ...newProperties.filter(property => property.published)];
    }
    
    // Fall back to mock data if no results from Supabase
    return [...MOCK_PROPERTIES, ...newProperties.filter(property => property.published)];
  } catch (error) {
    console.error('Unexpected error fetching properties:', error);
    // Fall back to mock data on any error
    return [...MOCK_PROPERTIES, ...newProperties.filter(property => property.published)];
  }
};

// Get all properties including unpublished ones (for admin views)
export const getAllPropertiesIncludingUnpublished = async (): Promise<Property[]> => {
  try {
    // Try to fetch from Supabase first
    const { data: supabaseProperties, error } = await supabase
      .from('properties')
      .select('*');
      
    if (error) {
      console.error('Error fetching from Supabase:', error);
      return [...MOCK_PROPERTIES, ...newProperties];
    }
    
    if (supabaseProperties && supabaseProperties.length > 0) {
      // Map the Supabase data to our Property type
      const mappedProperties = supabaseProperties.map(prop => ({
        id: prop.id,
        title: prop.title,
        description: prop.description || '',
        price: prop.price,
        address: prop.address || '',
        city: prop.city || '',
        state: prop.state || '',
        zipCode: prop.zipcode || '',
        type: prop.type as Property['type'] || 'house',
        status: prop.status as Property['status'] || 'for-sale',
        bedrooms: prop.bedrooms || 0,
        bathrooms: prop.bathrooms || 0,
        area: prop.area || 0,
        images: prop.image_urls || [],
        features: [], // Default value
        createdAt: prop.created_at ? new Date(prop.created_at) : new Date(),
        userId: prop.user_id || 'unknown',
        published: prop.published === true
      })) as Property[];
      
      return [...mappedProperties, ...MOCK_PROPERTIES, ...newProperties];
    }
    
    return [...MOCK_PROPERTIES, ...newProperties];
  } catch (error) {
    console.error('Unexpected error fetching properties:', error);
    return [...MOCK_PROPERTIES, ...newProperties];
  }
};

// Add a new property
export const addProperty = async (property: Omit<Property, 'id' | 'createdAt' | 'userId' | 'published'>): Promise<Property> => {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'anonymous';
  
  // Create a new property with required fields
  const newProperty: Property = {
    ...property,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    userId: userId,
    published: true
  };
  
  try {
    console.log('Adding property to Supabase');
    
    // Add to Supabase
    const { data, error } = await supabase
      .from('properties')
      .insert({
        title: newProperty.title,
        description: newProperty.description,
        price: newProperty.price,
        address: newProperty.address,
        city: newProperty.city,
        state: newProperty.state,
        zipcode: newProperty.zipCode,
        bedrooms: newProperty.bedrooms,
        bathrooms: newProperty.bathrooms,
        area: newProperty.area,
        image_urls: newProperty.images,
        user_id: newProperty.userId,
        published: newProperty.published,
        type: newProperty.type,
        status: newProperty.status
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error adding to Supabase:', error);
      
      // Fall back to in-memory storage
      newProperties = [newProperty, ...newProperties];
      
      toast({
        title: "Property Added (Local Only)",
        description: "Your property has been added locally. Database update failed: " + error.message,
        duration: 5000,
      });
    } else if (data) {
      // Update the ID in our object to match what's stored in Supabase
      newProperty.id = data.id;
      console.log('Property added to Supabase:', data);
      
      toast({
        title: "Property Added",
        description: "Your property has been successfully added and published to the database!",
        duration: 5000,
      });
    }
  } catch (error) {
    console.error('Unexpected error adding property:', error);
    // Fall back to in-memory storage
    newProperties = [newProperty, ...newProperties];
    
    toast({
      title: "Property Added (Local Only)",
      description: "Your property has been added locally due to an error.",
      duration: 5000,
    });
  }
  
  return newProperty;
};

// Get user's properties
export const getUserProperties = async (): Promise<Property[]> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];
    
    // Fetch from Supabase
    const { data: supabaseProperties, error } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Error fetching user properties:', error);
      return [];
    }
    
    if (supabaseProperties && supabaseProperties.length > 0) {
      // Map the Supabase data to our Property type
      return supabaseProperties.map(prop => ({
        id: prop.id,
        title: prop.title,
        description: prop.description || '',
        price: prop.price,
        address: prop.address || '',
        city: prop.city || '',
        state: prop.state || '',
        zipCode: prop.zipcode || '',
        type: prop.type as Property['type'] || 'house',
        status: prop.status as Property['status'] || 'for-sale',
        bedrooms: prop.bedrooms || 0,
        bathrooms: prop.bathrooms || 0,
        area: prop.area || 0,
        images: prop.image_urls || [],
        features: [], // Default value
        createdAt: prop.created_at ? new Date(prop.created_at) : new Date(),
        userId: prop.user_id,
        published: prop.published === true
      })) as Property[];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching user properties:', error);
    return [];
  }
};

// Update property published status
export const updatePropertyPublishedStatus = async (propertyId: string, published: boolean): Promise<Property | undefined> => {
  try {
    // Try to update in Supabase first
    const { data, error } = await supabase
      .from('properties')
      .update({ published })
      .eq('id', propertyId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating in Supabase:', error);
    } else if (data) {
      // Successfully updated in Supabase
      const updatedProperty: Property = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        price: data.price,
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zipCode: data.zipcode || '',
        type: data.type as Property['type'] || 'house',
        status: data.status as Property['status'] || 'for-sale',
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        area: data.area || 0,
        images: data.image_urls || [],
        features: [], // Default value
        createdAt: data.created_at ? new Date(data.created_at) : new Date(),
        userId: data.user_id || 'unknown',
        published: data.published === true
      };
      
      toast({
        title: published ? "Property Published" : "Property Unpublished",
        description: published 
          ? "Your property is now visible to all users." 
          : "Your property has been unpublished and is no longer visible to users.",
        duration: 5000,
      });
      
      return updatedProperty;
    }
  } catch (error) {
    console.error('Unexpected error updating property:', error);
  }
  
  // Fall back to in-memory update
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
export const getPropertyById = async (id: string): Promise<Property | undefined> => {
  try {
    console.log('Fetching property with ID:', id);
    
    // Try to get from Supabase
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching property:', error);
    } else if (data) {
      // Successfully retrieved from Supabase
      return {
        id: data.id,
        title: data.title,
        description: data.description || '',
        price: data.price,
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zipCode: data.zipcode || '',
        type: data.type as Property['type'] || 'house',
        status: data.status as Property['status'] || 'for-sale',
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        area: data.area || 0,
        images: data.image_urls || [],
        features: [], // Default value
        createdAt: data.created_at ? new Date(data.created_at) : new Date(),
        userId: data.user_id || 'unknown',
        published: data.published === true
      };
    }
  } catch (error) {
    console.error('Unexpected error fetching property:', error);
  }
  
  // Check mock properties if not found in Supabase
  const mockProperty = MOCK_PROPERTIES.find(property => property.id === id);
  if (mockProperty) return mockProperty;
  
  // Then check new properties
  return newProperties.find(property => property.id === id);
};

// Delete a property
export const deleteProperty = async (propertyId: string): Promise<{success: boolean, error?: string}> => {
  try {
    console.log('Deleting property with ID:', propertyId);
    
    // Delete from Supabase
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);

    if (error) {
      console.error('Error deleting property:', error);
      return { success: false, error: error.message };
    }

    // The favorites and payments are automatically deleted due to CASCADE

    // Remove from in-memory array if it exists there
    newProperties = newProperties.filter(p => p.id !== propertyId);
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting property:', error.message);
    return { success: false, error: error.message };
  }
};

// Filter properties based on criteria
export const filterProperties = async (filters: Record<string, any>): Promise<Property[]> => {
  // Get all properties
  const properties = await getAllProperties();
  
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

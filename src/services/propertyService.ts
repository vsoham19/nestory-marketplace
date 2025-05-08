import { Property } from '@/lib/types';
import { MOCK_PROPERTIES } from '@/lib/mock-data';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { formatPropertyIdToUuid } from '@/utils/paymentUtils';

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
        type: 'house', // Default value since this doesn't exist in the DB yet
        status: 'for-sale', // Default value since this doesn't exist in the DB yet
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
        type: 'house', // Default value
        status: 'for-sale', // Default value
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
  
  // Generate a UUID for the property using crypto
  const propertyId = crypto.randomUUID();
  
  // Create a new property with required fields
  const newProperty: Property = {
    ...property,
    id: propertyId,
    createdAt: new Date(),
    userId: userId,
    published: true
  };
  
  try {
    console.log('Adding property to Supabase with ID:', propertyId);
    console.log('Property data:', {
      title: newProperty.title,
      description: newProperty.description,
      price: newProperty.price,
      images: newProperty.images
    });
    
    // First try to add to Supabase
    const { data, error } = await supabase
      .from('properties')
      .insert({
        id: propertyId, // Using the UUID directly
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
        published: newProperty.published
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error adding to Supabase:', error);
      
      // Try one more time with a formatted UUID
      const formattedId = formatPropertyIdToUuid(propertyId);
      console.log('Trying again with formatted ID:', formattedId);
      
      const { data: formattedData, error: formattedError } = await supabase
        .from('properties')
        .insert({
          id: formattedId,
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
          published: newProperty.published
        })
        .select()
        .single();
        
      if (formattedError) {
        console.error('Error adding to Supabase with formatted ID:', formattedError);
        // Fall back to in-memory storage
        newProperties = [newProperty, ...newProperties];
      } else if (formattedData) {
        // Update the ID in our object to match what's stored in Supabase
        newProperty.id = formattedData.id;
        console.log('Property added to Supabase with formatted ID:', formattedData);
        
        toast({
          title: "Property Added",
          description: "Your property has been successfully added and published to the database!",
          duration: 5000,
        });
        
        return newProperty;
      }
    } else if (data) {
      // Successfully added to Supabase
      console.log('Property added to Supabase:', data);
      
      toast({
        title: "Property Added",
        description: "Your property has been successfully added and published to the database!",
        duration: 5000,
      });
      
      return newProperty;
    }
  } catch (error) {
    console.error('Unexpected error adding property:', error);
    // Fall back to in-memory storage
    newProperties = [newProperty, ...newProperties];
  }
  
  // Add the new property to our in-memory storage as a fallback
  newProperties = [newProperty, ...newProperties];
  
  toast({
    title: "Property Added",
    description: "Your property has been successfully added and published!",
    duration: 5000,
  });
  
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
      console.log('User properties from Supabase:', supabaseProperties);
      
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
        type: 'house', // Default value
        status: 'for-sale', // Default value
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
        type: 'house', // Default value
        status: 'for-sale', // Default value
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
    
    // Try first with the original ID
    let { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.log('Error fetching with original ID, trying with formatted ID');
      // Try with formatted ID
      const formattedId = formatPropertyIdToUuid(id);
      console.log('Formatted ID:', formattedId);
      
      const { data: formattedData, error: formattedError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', formattedId)
        .single();
        
      if (formattedError) {
        console.error('Error fetching with formatted ID:', formattedError);
      } else if (formattedData) {
        data = formattedData;
        console.log('Found with formatted ID:', formattedData);
      }
    } else {
      console.log('Found with original ID:', data);
    }
    
    if (data) {
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
        type: 'house', // Default value
        status: 'for-sale', // Default value
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
  
  // Check mock properties first
  const mockProperty = MOCK_PROPERTIES.find(property => property.id === id);
  if (mockProperty) return mockProperty;
  
  // Then check new properties
  return newProperties.find(property => property.id === id);
};

// Delete a property
export const deleteProperty = async (propertyId: string): Promise<{success: boolean, error?: string}> => {
  try {
    console.log('Deleting property with ID:', propertyId);
    
    // First try with the original ID
    let { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);

    if (error) {
      console.error('Error deleting property with original ID:', error);
      
      // Try with formatted ID
      const formattedId = formatPropertyIdToUuid(propertyId);
      console.log('Trying to delete with formatted ID:', formattedId);
      
      const { error: formattedError } = await supabase
        .from('properties')
        .delete()
        .eq('id', formattedId);
        
      if (formattedError) {
        console.error('Error deleting property with formatted ID:', formattedError);
        return { success: false, error: formattedError.message };
      }
    }

    // Also clean up related data - delete any favorites for this property
    try {
      const { error: favError } = await supabase
        .from('favorites')
        .delete()
        .eq('property_id', propertyId);
        
      if (favError) {
        console.error('Error cleaning up favorites:', favError);
        // Don't fail the operation if this cleanup fails
      }
    } catch (cleanupError) {
      console.error('Error during favorites cleanup:', cleanupError);
    }

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

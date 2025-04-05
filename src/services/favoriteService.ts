import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

// Convert numeric propertyId to valid UUID format
const formatPropertyIdToUuid = (propertyId: string): string => {
  if (isNaN(Number(propertyId))) {
    return propertyId; // Already a UUID format
  }
  
  // Pad with zeros and format properly as UUID
  const paddedId = propertyId.padStart(32, '0');
  return `${paddedId.slice(0, 8)}-${paddedId.slice(8, 12)}-${paddedId.slice(12, 16)}-${paddedId.slice(16, 20)}-${paddedId.slice(20)}`;
};

// Convert UUID back to numeric ID if applicable
const formatUuidToPropertyId = (uuid: string): string => {
  if (!uuid) return '';
  
  // Remove hyphens and leading zeros to check if it's a numeric ID
  const cleaned = uuid.replace(/-/g, '').replace(/^0+/, '');
  
  // If it's a small number (likely a converted numeric ID), return it as such
  if (!isNaN(Number(cleaned)) && cleaned.length <= 2) {
    return cleaned;
  }
  
  // Otherwise return the original UUID
  return uuid;
};

// Add property to favorites
export const addToFavorites = async (propertyId: string): Promise<boolean> => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to add favorites",
        variant: "destructive",
      });
      return false;
    }
    
    // Convert propertyId to UUID format
    const validPropertyId = formatPropertyIdToUuid(propertyId);
    
    // Check if property is already favorited
    const { data: existingFavorite, error: checkError } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', validPropertyId);
      
    if (checkError) {
      console.error('Error checking favorites:', checkError);
      toast({
        title: "Error",
        description: "Failed to check if property is already in favorites",
        variant: "destructive",
      });
      return false;
    }
    
    if (existingFavorite && existingFavorite.length > 0) {
      toast({
        title: "Already favorited",
        description: "This property is already in your favorites",
      });
      return true;
    }
    
    // Add to favorites
    const { error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        property_id: validPropertyId
      });
    
    if (error) {
      console.error('Error adding favorite:', error);
      toast({
        title: "Error",
        description: "Failed to add property to favorites",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Success",
      description: "Property added to favorites",
    });
    return true;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};

// Remove property from favorites
export const removeFromFavorites = async (propertyId: string): Promise<boolean> => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to manage favorites",
        variant: "destructive",
      });
      return false;
    }
    
    // Convert propertyId to UUID format
    const validPropertyId = formatPropertyIdToUuid(propertyId);
    
    // Remove from favorites
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('property_id', validPropertyId);
    
    if (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Error",
        description: "Failed to remove property from favorites",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Success",
      description: "Property removed from favorites",
    });
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};

// Check if a property is favorited by the current user
export const isPropertyFavorited = async (propertyId: string): Promise<boolean> => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }
    
    // Convert propertyId to UUID format
    const validPropertyId = formatPropertyIdToUuid(propertyId);
    
    // Check if property is favorited
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', validPropertyId);
    
    if (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

// Get all favorite properties for the current user
export const getUserFavorites = async () => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }
    
    // Get all favorited property IDs
    const { data, error } = await supabase
      .from('favorites')
      .select('property_id')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
    
    // Convert the property IDs back to their original format if needed
    return data.map(fav => formatUuidToPropertyId(fav.property_id));
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

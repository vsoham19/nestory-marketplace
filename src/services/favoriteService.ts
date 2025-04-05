
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

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
    
    // Convert numeric propertyId to valid UUID format if needed
    const validPropertyId = isNaN(Number(propertyId)) ? 
      propertyId : 
      `00000000-0000-0000-0000-00000000000${propertyId}`.slice(-36);
    
    // Check if property is already favorited
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', validPropertyId)
      .single();
      
    if (existingFavorite) {
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
    
    // Convert numeric propertyId to valid UUID format if needed
    const validPropertyId = isNaN(Number(propertyId)) ? 
      propertyId : 
      `00000000-0000-0000-0000-00000000000${propertyId}`.slice(-36);
    
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
    
    // Convert numeric propertyId to valid UUID format if needed
    const validPropertyId = isNaN(Number(propertyId)) ? 
      propertyId : 
      `00000000-0000-0000-0000-00000000000${propertyId}`.slice(-36);
    
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
    return data.map(fav => {
      const propertyId = fav.property_id;
      if (propertyId && propertyId.startsWith('00000000-0000-0000-0000-0000000000')) {
        // This might be a converted numeric ID, convert it back
        const numericPart = propertyId.replace(/^0+/, '').replace(/-/g, '');
        const possibleNumericId = numericPart.replace(/^0+/, '');
        if (!isNaN(Number(possibleNumericId)) && possibleNumericId.length <= 2) {
          return possibleNumericId;
        }
      }
      return propertyId;
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};


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
    
    // Check if property is already favorited
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', propertyId)
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
        property_id: propertyId
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
    
    // Remove from favorites
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('property_id', propertyId);
    
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
    
    // Check if property is favorited
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', propertyId);
    
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
    
    return data.map(fav => fav.property_id);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

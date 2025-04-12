
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

// Store favorite in local storage as fallback
const addToLocalFavorites = (userId: string, propertyId: string): void => {
  try {
    // Get existing favorites from local storage
    const localFavoritesStr = localStorage.getItem(`favorites_${userId}`);
    const localFavorites = localFavoritesStr ? JSON.parse(localFavoritesStr) : [];
    
    // Add the property ID if it doesn't exist
    if (!localFavorites.includes(propertyId)) {
      localFavorites.push(propertyId);
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(localFavorites));
    }
  } catch (error) {
    console.error('Error storing favorite in local storage:', error);
  }
};

// Remove favorite from local storage
const removeFromLocalFavorites = (userId: string, propertyId: string): void => {
  try {
    // Get existing favorites from local storage
    const localFavoritesStr = localStorage.getItem(`favorites_${userId}`);
    const localFavorites = localFavoritesStr ? JSON.parse(localFavoritesStr) : [];
    
    // Remove the property ID if it exists
    const updatedFavorites = localFavorites.filter(id => id !== propertyId);
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Error removing favorite from local storage:', error);
  }
};

// Get favorites from local storage
const getLocalFavorites = (userId: string): string[] => {
  try {
    const localFavoritesStr = localStorage.getItem(`favorites_${userId}`);
    return localFavoritesStr ? JSON.parse(localFavoritesStr) : [];
  } catch (error) {
    console.error('Error getting favorites from local storage:', error);
    return [];
  }
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
    
    console.log(`Adding property to favorites: ${propertyId}`);
    
    // Check if property is already favorited
    const { data: existingFavorite, error: checkError } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', propertyId);
      
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
    
    // Add to favorites in the database
    const { error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        property_id: propertyId
      });
    
    if (error) {
      console.error('Error adding favorite to database:', error);
      
      // Fallback to local storage
      addToLocalFavorites(user.id, propertyId);
      
      toast({
        title: "Note",
        description: "Saved locally due to database constraint",
      });
      return true;
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
    
    console.log(`Removing property from favorites: ${propertyId}`);
    
    // Remove from local storage (do this regardless of database operation)
    removeFromLocalFavorites(user.id, propertyId);
    
    // Remove from favorites in database
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('property_id', propertyId);
    
    if (error) {
      console.error('Error removing favorite:', error);
      // We don't show an error since we've already removed it from local storage
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
    
    // Check if property is favorited in database
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', propertyId);
    
    if (error) {
      console.error('Error checking favorite status:', error);
      
      // Check in local storage as fallback
      const localFavorites = getLocalFavorites(user.id);
      return localFavorites.includes(propertyId);
    }
    
    if (data && data.length > 0) {
      return true;
    }
    
    // Check in local storage as fallback
    const localFavorites = getLocalFavorites(user.id);
    return localFavorites.includes(propertyId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

// Get all favorite properties for the current user
export const getUserFavorites = async (): Promise<string[]> => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }
    
    console.log('Getting favorites for user:', user.id);
    
    // Get favorites from database
    const { data, error } = await supabase
      .from('favorites')
      .select('property_id')
      .eq('user_id', user.id);
    
    let favorites: string[] = [];
    
    if (error) {
      console.error('Error fetching favorites from database:', error);
    } else {
      favorites = data.map(fav => fav.property_id);
      console.log('Favorites from database:', favorites);
    }
    
    // Merge with local favorites
    const localFavorites = getLocalFavorites(user.id);
    console.log('Local favorites:', localFavorites);
    
    // Combine and deduplicate
    const combinedFavorites = [...favorites, ...localFavorites];
    return [...new Set(combinedFavorites)];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

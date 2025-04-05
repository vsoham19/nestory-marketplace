
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { getUserFavorites } from '@/services/favoriteService';
import { getPropertyById } from '@/services/propertyService';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Favorites = () => {
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setFavoriteProperties([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Get favorite property IDs
        const favoriteIds = await getUserFavorites();
        
        // Fetch full property data for each ID
        const propertiesPromises = favoriteIds.map(id => getPropertyById(id));
        const properties = await Promise.all(propertiesPromises);
        
        // Filter out undefined properties (in case a property was deleted)
        setFavoriteProperties(properties.filter(Boolean) as Property[]);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container-custom">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
            <p className="text-muted-foreground">
              View and manage your favorite properties
            </p>
          </div>
          
          <Separator className="my-6" />
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border/50 rounded-lg h-[400px] animate-pulse"
                >
                  <div className="h-1/2 bg-muted rounded-t-lg" />
                  <div className="p-4 space-y-4">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-8 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="flex gap-2">
                      <div className="h-6 bg-muted rounded w-16" />
                      <div className="h-6 bg-muted rounded w-16" />
                      <div className="h-6 bg-muted rounded w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !user ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">Please sign in</h3>
              <p className="text-muted-foreground mb-6">
                You need to be logged in to view your favorite properties
              </p>
              <Button asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
          ) : favoriteProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No favorites yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't added any properties to your favorites yet
              </p>
              <Button asChild>
                <Link to="/properties">Browse Properties</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Favorites;

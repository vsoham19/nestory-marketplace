
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bed, Bath, Maximize, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Property } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { addToFavorites, removeFromFavorites, isPropertyFavorited } from '@/services/favoriteService';

interface PropertyCardProps {
  property: Property;
  featured?: boolean;
}

const PropertyCard = ({ property, featured = false }: PropertyCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    // Check if property is favorited when component mounts
    const checkFavoriteStatus = async () => {
      if (user) {
        try {
          const favorited = await isPropertyFavorited(property.id);
          setIsFavorite(favorited);
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
    };
    
    checkFavoriteStatus();
  }, [property.id, user]);
  
  const statusColor = {
    'for-sale': 'bg-blue-100 text-blue-800',
    'for-rent': 'bg-green-100 text-green-800',
    'sold': 'bg-red-100 text-red-800',
    'rented': 'bg-yellow-100 text-yellow-800'
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleFavoriteClick = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/auth';
      return;
    }
    
    if (isFavorite) {
      const success = await removeFromFavorites(property.id);
      if (success) setIsFavorite(false);
    } else {
      const success = await addToFavorites(property.id);
      if (success) setIsFavorite(true);
    }
  };

  // Function to get a valid image URL
  const getPropertyImage = () => {
    if (!property.images || property.images.length === 0) {
      return '/placeholder.svg';
    }
    
    // Try each image until we find a valid one
    for (const image of property.images) {
      // Skip blob and data URLs as they don't persist after refreshes
      if (image.startsWith('blob:') || image.startsWith('data:')) {
        continue;
      }
      
      // Return the first valid image URL
      return image;
    }
    
    // If no valid images found, return placeholder
    return '/placeholder.svg';
  };

  return (
    <Card 
      className={cn(
        'property-card overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm',
        featured ? 'md:col-span-2 lg:col-span-2' : ''
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div 
          className={cn(
            "absolute inset-0 bg-muted transition-opacity duration-300",
            isLoaded ? "opacity-0" : "opacity-100"
          )}
        />
        <img
          src={getPropertyImage()} 
          alt={property.title}
          className={cn(
            "h-full w-full object-cover transition-all duration-300",
            !isLoaded && "scale-105 blur-sm"
          )}
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
            setIsLoaded(true);
          }}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={cn("capitalize", statusColor[property.status])}>
            {property.status.replace('-', ' ')}
          </Badge>
          {featured && (
            <Badge className="bg-primary/10 text-primary">
              Featured
            </Badge>
          )}
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80"
          onClick={handleFavoriteClick}
        >
          <Heart 
            size={18} 
            className={cn(
              isFavorite ? "fill-red-500 text-red-500" : "text-foreground/80"
            )} 
          />
        </Button>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-2xl font-semibold">{formatPrice(property.price)}</p>
              <h3 className="font-medium text-base line-clamp-1">{property.title}</h3>
            </div>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-1">
            {property.address}, {property.city}, {property.state}
          </p>
          <div className="flex gap-3 text-sm pt-2">
            <div className="flex items-center gap-1">
              <Bed size={16} />
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath size={16} />
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize size={16} />
              <span>{property.area.toLocaleString()} sq ft</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-xs text-muted-foreground capitalize">
          {property.type}
        </p>
        <Link to={`/property/${property.id}`}>
          <Button size="sm" variant="ghost" className="gap-1 group">
            View Details
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;

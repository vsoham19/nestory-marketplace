
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Property } from '@/lib/types';

interface SimilarPropertiesProps {
  properties: Property[];
}

const SimilarProperties = ({ properties }: SimilarPropertiesProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  if (properties.length === 0) {
    return null;
  }
  
  return (
    <>
      <Separator className="mb-8" />
      <h3 className="text-xl font-semibold mb-4">Similar Properties</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {properties.map(property => (
          <div 
            key={property.id}
            className="flex gap-4 bg-card border border-border/50 rounded-lg p-3 hover:border-primary/50 transition-colors"
          >
            <div className="h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
              <img 
                src={property.images[0]} 
                alt={property.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="font-medium text-sm line-clamp-1 mb-1">
                <Link to={`/property/${property.id}`} className="hover:text-primary">
                  {property.title}
                </Link>
              </h4>
              <p className="text-primary font-medium text-sm mb-1">
                {formatPrice(property.price)}
              </p>
              <div className="flex items-center text-xs text-muted-foreground mb-1">
                <MapPin size={12} className="mr-1" />
                <span className="truncate">{property.city}, {property.state}</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span>{property.bedrooms} Beds</span>
                <span>•</span>
                <span>{property.bathrooms} Baths</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SimilarProperties;

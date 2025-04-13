
import React from 'react';
import { MapPin, Heart, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';

interface PropertyHeaderProps {
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: 'for-sale' | 'for-rent' | 'sold' | 'rented';
  isFavorite: boolean;
  onFavoriteClick: () => void;
}

const PropertyHeader = ({
  title,
  address,
  city,
  state,
  zipCode,
  status,
  isFavorite,
  onFavoriteClick
}: PropertyHeaderProps) => {
  const statusColor = {
    'for-sale': 'bg-blue-100 text-blue-800',
    'for-rent': 'bg-green-100 text-green-800',
    'sold': 'bg-red-100 text-red-800',
    'rented': 'bg-yellow-100 text-yellow-800'
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/properties">
            <ChevronLeft size={16} />
            <span>Back to Properties</span>
          </Link>
        </Button>
        <Badge className={cn("capitalize", statusColor[status])}>
          {status.replace('-', ' ')}
        </Badge>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <div className="flex items-center text-muted-foreground mb-2">
            <MapPin size={16} className="mr-1" />
            <span>
              {address}, {city}, {state} {zipCode}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={onFavoriteClick}
          >
            <Heart 
              size={18} 
              className={cn(
                isFavorite ? "fill-red-500 text-red-500" : "text-foreground"
              )} 
            />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full"
          >
            <Share size={18} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default PropertyHeader;

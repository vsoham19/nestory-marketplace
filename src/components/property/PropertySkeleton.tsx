
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PropertySkeleton = () => {
  return (
    <div className="container-custom pt-24 pb-16 text-center">
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-4 mx-auto" />
        <div className="h-80 bg-muted rounded-lg mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="h-12 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
          <div className="h-60 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
};

export const PropertyNotFound = () => {
  return (
    <div className="container-custom pt-24 pb-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The property you are looking for does not exist or has been removed.
      </p>
      <Button asChild>
        <Link to="/properties">Browse Properties</Link>
      </Button>
    </div>
  );
};

export default PropertySkeleton;


import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Property } from '@/lib/types';
import PropertyCard from './PropertyCard';
import { Button } from '@/components/ui/button';
import { getAllProperties } from '@/services/propertyService';

interface FeaturedPropertiesProps {
  limit?: number;
}

const FeaturedProperties = ({ limit = 6 }: FeaturedPropertiesProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const allProperties = await getAllProperties();
        setProperties(allProperties.slice(0, limit));
      } catch (error) {
        console.error("Error fetching featured properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [limit]);

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container-custom">
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Properties</h2>
            <p className="text-muted-foreground">Browse our handpicked selection of stunning properties</p>
          </div>
          <Link to="/properties">
            <Button variant="link" className="mt-4 md:mt-0 p-0 flex items-center gap-1 group">
              View All Properties
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: limit }).map((_, index) => (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, index) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                featured={index === 0}  
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;

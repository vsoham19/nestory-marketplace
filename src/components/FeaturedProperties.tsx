
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Property } from '@/lib/types';
import PropertyCard from './PropertyCard';
import { Button } from '@/components/ui/button';
import { MOCK_PROPERTIES } from '@/lib/mock-data';

interface FeaturedPropertiesProps {
  limit?: number;
}

const FeaturedProperties = ({ limit = 6 }: FeaturedPropertiesProps) => {
  // In a real application, you would fetch these from an API
  const properties = MOCK_PROPERTIES.slice(0, limit);

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              featured={index === 0}  
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;

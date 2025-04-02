import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchFilters from '@/components/SearchFilters';
import PropertyCard from '@/components/PropertyCard';
import { PropertyFilter, Property } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { getAllProperties, filterProperties } from '@/services/propertyService';

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [activeFilters, setActiveFilters] = useState<PropertyFilter>({});
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Extract filter values from URL
  useEffect(() => {
    const location = searchParams.get('location') || '';
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined;
    const bedrooms = searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : undefined;
    const bathrooms = searchParams.get('bathrooms') ? parseInt(searchParams.get('bathrooms')!) : undefined;
    const type = searchParams.get('type') as Property['type'] || undefined;
    const status = searchParams.get('status') as Property['status'] || undefined;
    
    const filters: PropertyFilter = {
      location: location || undefined,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      type,
      status,
    };
    
    setActiveFilters(filters);
  }, [searchParams]);
  
  // Apply filters to properties
  useEffect(() => {
    setIsLoading(true);
    
    // Get all published properties
    const fetchProperties = async () => {
      try {
        let results: Property[] = [];
        
        if (Object.keys(activeFilters).some(key => activeFilters[key as keyof PropertyFilter] !== undefined)) {
          // Use filterProperties if we have active filters
          results = await filterProperties(activeFilters);
        } else {
          // Otherwise get all properties
          results = await getAllProperties();
        }
        
        setFilteredProperties(results);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setFilteredProperties([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, [activeFilters]);
  
  const handleFilterChange = (filters: PropertyFilter) => {
    setActiveFilters(filters);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container-custom">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Properties</h1>
            <p className="text-muted-foreground">
              Browse our curated selection of exceptional properties
            </p>
          </div>
          
          <SearchFilters onFilterChange={handleFilterChange} activeFilters={activeFilters} />
          
          <Separator className="my-6" />
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
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
          ) : filteredProperties.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-4">
                <p className="text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{filteredProperties.length}</span> properties
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <select className="text-sm bg-transparent border-none focus:ring-0">
                    <option>Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No properties found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search filters to find more properties
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Properties;


import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { PropertyFilter } from '@/lib/types';

interface SearchFiltersProps {
  onFilterChange: (filters: PropertyFilter) => void;
  activeFilters: PropertyFilter;
}

const SearchFilters = ({ onFilterChange, activeFilters }: SearchFiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState<PropertyFilter>({
    location: activeFilters.location || '',
    minPrice: activeFilters.minPrice || undefined,
    maxPrice: activeFilters.maxPrice || undefined,
    bedrooms: activeFilters.bedrooms || undefined,
    bathrooms: activeFilters.bathrooms || undefined,
    type: activeFilters.type || undefined,
    status: activeFilters.status || undefined,
  });
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof PropertyFilter
  ) => {
    const value = e.target.value;
    if (field === 'minPrice' || field === 'maxPrice' || field === 'bedrooms' || field === 'bathrooms') {
      setFilters({ ...filters, [field]: value ? Number(value) : undefined });
    } else {
      setFilters({ ...filters, [field]: value });
    }
  };
  
  const handleSelectChange = (value: string, field: keyof PropertyFilter) => {
    setFilters({ ...filters, [field]: value || undefined });
  };
  
  const applyFilters = () => {
    onFilterChange(filters);
    
    // Update URL params
    const newParams = new URLSearchParams();
    
    if (filters.location) newParams.set('location', filters.location.toString());
    if (filters.minPrice) newParams.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) newParams.set('maxPrice', filters.maxPrice.toString());
    if (filters.bedrooms) newParams.set('bedrooms', filters.bedrooms.toString());
    if (filters.bathrooms) newParams.set('bathrooms', filters.bathrooms.toString());
    if (filters.type) newParams.set('type', filters.type);
    if (filters.status) newParams.set('status', filters.status);
    
    navigate({ pathname: '/properties', search: newParams.toString() });
    setIsOpen(false);
  };
  
  const resetFilters = () => {
    const resetFilters: PropertyFilter = {};
    setFilters(resetFilters);
    onFilterChange(resetFilters);
    navigate('/properties');
    setIsOpen(false);
  };
  
  const hasActiveFilters = Object.values(activeFilters).some(value => value !== undefined && value !== '');

  return (
    <div className="w-full bg-card border border-border/50 rounded-lg shadow-sm mb-8">
      <div className="p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-grow">
          <Input
            value={filters.location || ''}
            onChange={(e) => handleInputChange(e, 'location')}
            placeholder="Search by city, address or zip code..."
            className="h-11 pl-4 pr-10 text-base"
          />
        </div>
        
        <div className="flex gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={cn(
                  "flex items-center gap-2",
                  hasActiveFilters && "bg-primary/5 text-primary border-primary/50"
                )}
              >
                <Filter size={16} />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                    {Object.values(activeFilters).filter(Boolean).length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Filter Properties</SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="price-range">Price Range</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="min-price"
                      value={filters.minPrice || ''}
                      onChange={(e) => handleInputChange(e, 'minPrice')}
                      placeholder="Min"
                      type="number"
                      min="0"
                      className="h-10"
                    />
                    <span>-</span>
                    <Input
                      id="max-price"
                      value={filters.maxPrice || ''}
                      onChange={(e) => handleInputChange(e, 'maxPrice')}
                      placeholder="Max"
                      type="number"
                      min="0"
                      className="h-10"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select
                      value={filters.bedrooms?.toString() || ''}
                      onValueChange={(value) => handleSelectChange(value, 'bedrooms')}
                    >
                      <SelectTrigger id="bedrooms" className="h-10">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any</SelectItem>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}+
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Select
                      value={filters.bathrooms?.toString() || ''}
                      onValueChange={(value) => handleSelectChange(value, 'bathrooms')}
                    >
                      <SelectTrigger id="bathrooms" className="h-10">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any</SelectItem>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}+
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="property-type">Property Type</Label>
                  <Select
                    value={filters.type || ''}
                    onValueChange={(value) => handleSelectChange(value, 'type')}
                  >
                    <SelectTrigger id="property-type" className="h-10">
                      <SelectValue placeholder="Any type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={filters.status || ''}
                    onValueChange={(value) => handleSelectChange(value, 'status')}
                  >
                    <SelectTrigger id="status" className="h-10">
                      <SelectValue placeholder="Any status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any</SelectItem>
                      <SelectItem value="for-sale">For Sale</SelectItem>
                      <SelectItem value="for-rent">For Rent</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-8 flex gap-3">
                <Button variant="outline" onClick={resetFilters} className="flex-1">
                  Reset
                </Button>
                <Button onClick={applyFilters} className="flex-1">
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          
          <Button onClick={applyFilters}>
            Search
          </Button>
        </div>
      </div>
      
      {hasActiveFilters && (
        <div className="px-4 py-2 flex items-center gap-2 border-t border-border/50 overflow-x-auto no-scrollbar">
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            Active Filters:
          </span>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(activeFilters).map(([key, value]) => {
              if (!value) return null;
              
              // Format the filter name and value
              let displayKey = key.charAt(0).toUpperCase() + key.slice(1);
              let displayValue = value.toString();
              
              if (key === 'minPrice' && value) {
                displayKey = 'Min Price';
                displayValue = `$${value}`;
              } else if (key === 'maxPrice' && value) {
                displayKey = 'Max Price';
                displayValue = `$${value}`;
              } else if (key === 'type' && value) {
                displayValue = value.charAt(0).toUpperCase() + value.slice(1);
              } else if (key === 'status' && value) {
                displayValue = value.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
              } else if ((key === 'bedrooms' || key === 'bathrooms') && value) {
                displayValue = `${value}+`;
              }
              
              return (
                <div 
                  key={key}
                  className="flex items-center gap-1 text-xs bg-secondary py-1 px-2 rounded-full whitespace-nowrap"
                >
                  <span className="font-medium">{displayKey}:</span>
                  <span>{displayValue}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 rounded-full"
                    onClick={() => {
                      const newFilters = { ...filters };
                      // @ts-ignore - This is fine because we know that the key exists
                      delete newFilters[key];
                      setFilters(newFilters);
                      onFilterChange(newFilters);
                    }}
                  >
                    <X size={10} />
                  </Button>
                </div>
              );
            })}
            
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6 ml-auto"
              onClick={resetFilters}
            >
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;

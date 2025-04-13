
import React from 'react';
import { Bed, Bath, Maximize, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PropertyDetailsProps {
  price: number;
  status: 'for-sale' | 'for-rent' | 'sold' | 'rented';
  bedrooms: number;
  bathrooms: number;
  area: number;
  createdAt: Date;
  description: string;
  features: string[];
}

const PropertyDetails = ({
  price,
  status,
  bedrooms,
  bathrooms,
  area,
  createdAt,
  description,
  features
}: PropertyDetailsProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  return (
    <>
      <h2 className="text-3xl font-semibold mb-6">
        {status === 'for-rent' 
          ? `${formatPrice(price)}/month` 
          : formatPrice(price)}
      </h2>
      
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-lg">
          <Bed size={20} className="mb-1 text-muted-foreground" />
          <span className="font-medium">{bedrooms}</span>
          <span className="text-xs text-muted-foreground">Bedrooms</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-lg">
          <Bath size={20} className="mb-1 text-muted-foreground" />
          <span className="font-medium">{bathrooms}</span>
          <span className="text-xs text-muted-foreground">Bathrooms</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-lg">
          <Maximize size={20} className="mb-1 text-muted-foreground" />
          <span className="font-medium">{area.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">Sq Ft</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-lg">
          <Calendar size={20} className="mb-1 text-muted-foreground" />
          <span className="font-medium">{new Date(createdAt).getFullYear()}</span>
          <span className="text-xs text-muted-foreground">Year Built</span>
        </div>
      </div>
      
      <Tabs defaultValue="description" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="text-muted-foreground">
          <p className="leading-relaxed">{description}</p>
        </TabsContent>
        <TabsContent value="features">
          <h3 className="text-lg font-medium mb-4">Property Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <div className="h-2 w-2 bg-primary rounded-full mr-2" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="location">
          <div className="bg-muted aspect-video rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Map view coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default PropertyDetails;

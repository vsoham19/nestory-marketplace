
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Bed, Bath, Maximize, Calendar, Heart, Share, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MOCK_PROPERTIES } from '@/lib/mock-data';
import { Property } from '@/lib/types';
import { cn } from '@/lib/utils';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use the mock data
    setTimeout(() => {
      const foundProperty = MOCK_PROPERTIES.find((p) => p.id === id);
      setProperty(foundProperty || null);
      if (foundProperty) {
        setSelectedImage(foundProperty.images[0]);
      }
      setIsLoading(false);
    }, 500); // Simulate API call delay
  }, [id]);
  
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom pt-24 pb-16">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4" />
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
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom pt-24 pb-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The property you are looking for does not exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/properties">Browse Properties</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  const statusColor = {
    'for-sale': 'bg-blue-100 text-blue-800',
    'for-rent': 'bg-green-100 text-green-800',
    'sold': 'bg-red-100 text-red-800',
    'rented': 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container-custom">
          <div className="mb-6 flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="gap-1">
              <Link to="/properties">
                <ChevronLeft size={16} />
                <span>Back to Properties</span>
              </Link>
            </Button>
            <Badge className={cn("capitalize", statusColor[property.status])}>
              {property.status.replace('-', ' ')}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="lg:col-span-2 relative rounded-lg overflow-hidden aspect-video">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={selectedImage || property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {property.images.map((image, index) => (
                <div 
                  key={index}
                  className={cn(
                    "relative rounded-lg overflow-hidden aspect-video cursor-pointer",
                    selectedImage === image && "ring-2 ring-primary"
                  )}
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={image}
                    alt={`${property.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin size={16} className="mr-1" />
                    <span>
                      {property.address}, {property.city}, {property.state} {property.zipCode}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => setIsFavorite(!isFavorite)}
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
              
              <h2 className="text-3xl font-semibold mb-6">
                {property.status === 'for-rent' 
                  ? `${formatPrice(property.price)}/month` 
                  : formatPrice(property.price)}
              </h2>
              
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-lg">
                  <Bed size={20} className="mb-1 text-muted-foreground" />
                  <span className="font-medium">{property.bedrooms}</span>
                  <span className="text-xs text-muted-foreground">Bedrooms</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-lg">
                  <Bath size={20} className="mb-1 text-muted-foreground" />
                  <span className="font-medium">{property.bathrooms}</span>
                  <span className="text-xs text-muted-foreground">Bathrooms</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-lg">
                  <Maximize size={20} className="mb-1 text-muted-foreground" />
                  <span className="font-medium">{property.area.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">Sq Ft</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-lg">
                  <Calendar size={20} className="mb-1 text-muted-foreground" />
                  <span className="font-medium">{new Date(property.createdAt).getFullYear()}</span>
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
                  <p className="leading-relaxed">{property.description}</p>
                </TabsContent>
                <TabsContent value="features">
                  <h3 className="text-lg font-medium mb-4">Property Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2">
                    {property.features.map((feature, index) => (
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
              
              <Separator className="mb-8" />
              
              <h3 className="text-xl font-semibold mb-4">Similar Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_PROPERTIES.filter(p => 
                  p.id !== property.id && 
                  p.type === property.type &&
                  p.status === property.status
                ).slice(0, 2).map(similarProperty => (
                  <div 
                    key={similarProperty.id}
                    className="flex gap-4 bg-card border border-border/50 rounded-lg p-3 hover:border-primary/50 transition-colors"
                  >
                    <div className="h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={similarProperty.images[0]} 
                        alt={similarProperty.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-medium text-sm line-clamp-1 mb-1">
                        <Link to={`/property/${similarProperty.id}`} className="hover:text-primary">
                          {similarProperty.title}
                        </Link>
                      </h4>
                      <p className="text-primary font-medium text-sm mb-1">
                        {formatPrice(similarProperty.price)}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground mb-1">
                        <MapPin size={12} className="mr-1" />
                        <span className="truncate">{similarProperty.city}, {similarProperty.state}</span>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span>{similarProperty.bedrooms} Beds</span>
                        <span>•</span>
                        <span>{similarProperty.bathrooms} Baths</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="bg-card border border-border/50 rounded-lg p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Contact Agent</h3>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">John Doe</h4>
                    <p className="text-sm text-muted-foreground">Premium Agent</p>
                  </div>
                </div>
                
                <Separator className="mb-4" />
                
                <div className="space-y-3 mb-6">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Phone size={16} />
                    (123) 456-7890
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Mail size={16} />
                    agent@example.com
                  </Button>
                </div>
                
                <form className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      className="w-full px-4 py-2 rounded-md border border-border bg-background"
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      placeholder="Your Email" 
                      className="w-full px-4 py-2 rounded-md border border-border bg-background"
                    />
                  </div>
                  <div>
                    <input 
                      type="tel" 
                      placeholder="Your Phone" 
                      className="w-full px-4 py-2 rounded-md border border-border bg-background"
                    />
                  </div>
                  <div>
                    <textarea 
                      rows={3} 
                      placeholder="I'm interested in this property. Please contact me." 
                      className="w-full px-4 py-2 rounded-md border border-border bg-background resize-none"
                    />
                  </div>
                  <Button className="w-full">Contact Agent</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetail;

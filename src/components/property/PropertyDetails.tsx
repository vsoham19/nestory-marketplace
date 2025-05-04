
import React from 'react';
import { Bed, Bath, Maximize, Calendar, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PropertyDetailsProps {
  price: number;
  status: 'for-sale' | 'for-rent' | 'sold' | 'rented';
  bedrooms: number;
  bathrooms: number;
  area: number;
  createdAt: Date;
  description: string;
  features: string[];
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

const PropertyMap = ({ address, city, state, zipCode }: { 
  address: string; 
  city: string; 
  state: string; 
  zipCode: string; 
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const [location, setLocation] = React.useState<google.maps.LatLngLiteral | null>(null);

  React.useEffect(() => {
    if (isLoaded && !location) {
      const geocoder = new google.maps.Geocoder();
      const fullAddress = `${address}, ${city}, ${state} ${zipCode}`;
      
      geocoder.geocode({ address: fullAddress }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const position = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
          setLocation(position);
        }
      });
    }
  }, [isLoaded, address, city, state, zipCode, location]);

  const onLoad = React.useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

  // Display an error if API key is missing
  if (!apiKey) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Google Maps API Key Missing</AlertTitle>
        <AlertDescription>
          Please add your Google Maps API key to the .env file as VITE_GOOGLE_MAPS_API_KEY.
        </AlertDescription>
      </Alert>
    );
  }

  // Display an error if there was a problem loading the API
  if (loadError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Google Maps Error</AlertTitle>
        <AlertDescription>
          Failed to load Google Maps API: {loadError.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!isLoaded) {
    return <Skeleton className="w-full h-[400px] rounded-lg" />;
  }

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: '100%'
        }}
        center={location || { lat: 20.5937, lng: 78.9629 }} // Default to center of India if location not found
        zoom={location ? 15 : 4}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false
        }}
      >
        {location && <Marker position={location} />}
      </GoogleMap>
    </div>
  );
};

const PropertyDetails = ({
  price,
  status,
  bedrooms,
  bathrooms,
  area,
  createdAt,
  description,
  features,
  address = "",
  city = "",
  state = "",
  zipCode = ""
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
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {address}, {city}, {state} {zipCode}
            </p>
            <PropertyMap 
              address={address}
              city={city}
              state={state}
              zipCode={zipCode}
            />
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default PropertyDetails;

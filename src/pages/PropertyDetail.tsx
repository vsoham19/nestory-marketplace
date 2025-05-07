import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Property } from '@/lib/types';
import { DEVELOPERS } from '@/lib/mock-data';
import { getPropertyById, getAllProperties } from '@/services/propertyService';
import { addToFavorites, removeFromFavorites, isPropertyFavorited } from '@/services/favoriteService';

// Importing our new components
import PropertyGallery from '@/components/property/PropertyGallery';
import PropertyHeader from '@/components/property/PropertyHeader';
import PropertyDetails from '@/components/property/PropertyDetails';
import SimilarProperties from '@/components/property/SimilarProperties';
import ContactAgent from '@/components/property/ContactAgent';
import PropertySkeleton, { PropertyNotFound } from '@/components/property/PropertySkeleton';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const foundProperty = await getPropertyById(id);
        
        if (foundProperty) {
          // Process the property to ensure valid image URLs
          const processedProperty = {
            ...foundProperty,
            images: processImageUrls(foundProperty.images)
          };
          
          setProperty(processedProperty);
          
          // Fetch similar properties
          const allProperties = await getAllProperties();
          const similar = allProperties.filter(p => 
            p.id !== processedProperty.id && 
            p.type === processedProperty.type &&
            p.status === processedProperty.status
          ).slice(0, 2);
          
          // Process image URLs for similar properties as well
          const processedSimilar = similar.map(p => ({
            ...p,
            images: processImageUrls(p.images)
          }));
          
          setSimilarProperties(processedSimilar);
          
          if (user) {
            try {
              const favorited = await isPropertyFavorited(id);
              setIsFavorite(favorited);
            } catch (error) {
              console.error('Error checking favorite status:', error);
              // Continue without setting favorite status
            }
          }
        } else {
          setProperty(null);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        setProperty(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperty();
  }, [id, user]);
  
  // Helper function to process image URLs
  const processImageUrls = (images: string[] | undefined): string[] => {
    if (!images || images.length === 0) {
      return ['/placeholder.svg'];
    }
    
    // Filter out blob URLs and data URLs which don't persist after refresh
    // Keep all other image URLs regardless of extension (.jpg, .png, .avif, etc)
    const validImages = images.filter(img => 
      !(img.startsWith('blob:') || img.startsWith('data:'))
    );
    
    // Log the image URLs for debugging
    console.log('Valid image URLs:', validImages);
    
    // If no valid images remain, return placeholder
    if (validImages.length === 0) {
      return ['/placeholder.svg'];
    }
    
    return validImages;
  };
  
  const handleFavoriteClick = async () => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    
    if (!property) return;
    
    if (isFavorite) {
      const success = await removeFromFavorites(property.id);
      if (success) setIsFavorite(false);
    } else {
      const success = await addToFavorites(property.id);
      if (success) setIsFavorite(true);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <PropertySkeleton />
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <PropertyNotFound />
      </div>
    );
  }
  
  const developer = property.developer || DEVELOPERS[0];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container-custom">
          <PropertyHeader 
            title={property.title}
            address={property.address}
            city={property.city}
            state={property.state}
            zipCode={property.zipCode}
            status={property.status}
            isFavorite={isFavorite}
            onFavoriteClick={handleFavoriteClick}
          />
          
          <PropertyGallery 
            images={property.images} 
            title={property.title} 
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PropertyDetails 
                price={property.price}
                status={property.status}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.area}
                createdAt={property.createdAt}
                description={property.description}
                features={property.features}
                address={property.address}
                city={property.city}
                state={property.state}
                zipCode={property.zipCode}
              />
              
              <SimilarProperties properties={similarProperties} />
            </div>
            
            <div>
              <ContactAgent 
                developer={developer} 
                propertyTitle={property.title}
                propertyId={property.id}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetail;

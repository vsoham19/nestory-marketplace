
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

const PropertyGallery = ({ images, title }: PropertyGalleryProps) => {
  const [validImages, setValidImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('/placeholder.svg');
  
  useEffect(() => {
    // Process images on component mount or when images prop changes
    if (!images || images.length === 0) {
      setValidImages(['/placeholder.svg']);
      setSelectedImage('/placeholder.svg');
      return;
    }
    
    // Filter out blob: and data: URLs which don't persist after refresh
    const filteredImages = images.filter(img => 
      !(img.startsWith('blob:') || img.startsWith('data:'))
    );
    
    if (filteredImages.length === 0) {
      setValidImages(['/placeholder.svg']);
      setSelectedImage('/placeholder.svg');
      return;
    }
    
    setValidImages(filteredImages);
    setSelectedImage(filteredImages[0]);
  }, [images]);
  
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = '/placeholder.svg';
  };

  // Helper to check if an image is a valid format
  const isValidImageFormat = (url: string): boolean => {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'];
    const lowercasedUrl = url.toLowerCase();
    
    // Check if URL ends with one of the valid extensions
    return validExtensions.some(ext => lowercasedUrl.endsWith(ext)) ||
           // Or if it's an unsplash/external URL without extension
           (/\.(com|net|org|io)\//.test(lowercasedUrl) && !lowercasedUrl.includes('placeholder.svg'));
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div className="lg:col-span-2 relative rounded-lg overflow-hidden aspect-video bg-muted/30">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedImage}
            src={selectedImage}
            alt={title}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onError={handleImageError}
          />
        </AnimatePresence>
        
        {selectedImage === '/placeholder.svg' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <ImageOff size={48} strokeWidth={1.5} />
            <p className="mt-2">No image available</p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {validImages.map((image, index) => (
          <div 
            key={`${image}-${index}`}
            className={cn(
              "relative rounded-lg overflow-hidden aspect-video cursor-pointer bg-muted/30",
              selectedImage === image && "ring-2 ring-primary"
            )}
            onClick={() => handleImageClick(image)}
          >
            <img
              src={image}
              alt={`${title} - Image ${index + 1}`}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            
            {image === '/placeholder.svg' && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <ImageOff size={24} strokeWidth={1.5} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyGallery;

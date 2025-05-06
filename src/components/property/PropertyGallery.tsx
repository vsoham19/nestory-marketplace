
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

const PropertyGallery = ({ images, title }: PropertyGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string>(getFirstValidImage(images));
  
  // Function to handle blob URLs and ensure we always have a valid image
  function getFirstValidImage(imageArray: string[]): string {
    if (!imageArray || imageArray.length === 0) {
      return '/placeholder.svg';
    }
    
    // Filter out blob URLs as they don't persist after page refresh
    const validImages = imageArray.filter(img => !img.startsWith('blob:'));
    
    if (validImages.length === 0) {
      return '/placeholder.svg';
    }
    
    return validImages[0];
  }
  
  // Get valid images for the gallery
  const validImages = images.filter(img => !img.startsWith('blob:'));
  const galleryImages = validImages.length > 0 ? validImages : ['/placeholder.svg'];
  
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = '/placeholder.svg';
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div className="lg:col-span-2 relative rounded-lg overflow-hidden aspect-video">
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
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {galleryImages.map((image, index) => (
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
              alt={`${title} - Image ${index + 1}`}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyGallery;

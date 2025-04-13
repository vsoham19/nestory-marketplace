
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

const PropertyGallery = ({ images, title }: PropertyGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string>(images[0]);
  
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
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
          />
        </AnimatePresence>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
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
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyGallery;

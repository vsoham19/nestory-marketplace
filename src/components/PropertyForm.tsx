import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Property } from '@/lib/types';
import { addProperty } from '@/services/propertyService';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const PropertyForm = () => {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [type, setType] = useState<Property['type']>('apartment');
  const [status, setStatus] = useState<Property['status']>('for-sale');
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [area, setArea] = useState<number>(0);
  const [features, setFeatures] = useState<string[]>([]);
  
  const handleFeatureToggle = (feature: string) => {
    if (features.includes(feature)) {
      setFeatures(features.filter(f => f !== feature));
    } else {
      setFeatures([...features, feature]);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Convert File objects to URLs for preview
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setUploadedImages(prev => [...prev, ...newImages]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title || !description || !price || !address || !city || !state || !zipCode || uploadedImages.length < 1) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields and upload at least one image",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a new property
      const newProperty: Omit<Property, 'id' | 'createdAt' | 'userId' | 'published'> = {
        title,
        description,
        price,
        address,
        city,
        state, 
        zipCode,
        type,
        status,
        bedrooms,
        bathrooms,
        area,
        images: uploadedImages,
        features
      };
      
      // Add the property to Supabase
      await addProperty(newProperty);
      
      // Navigate to properties page
      navigate('/properties');
    } catch (error) {
      console.error('Error submitting property:', error);
      toast({
        title: "Error",
        description: "Failed to add property. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const indianCities = [
    { state: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'] },
    { state: 'Delhi NCR', cities: ['New Delhi', 'Gurugram', 'Noida', 'Ghaziabad', 'Faridabad'] },
    { state: 'Karnataka', cities: ['Bangalore', 'Mysuru', 'Hubli', 'Mangaluru', 'Belagavi'] },
    { state: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem'] },
    { state: 'Telangana', cities: ['Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad'] },
    { state: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'] },
    { state: 'West Bengal', cities: ['Kolkata', 'Siliguri', 'Durgapur', 'Asansol', 'Howrah'] },
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Property Title</Label>
          <Input 
            id="title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter property title" 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Property Type</Label>
          <Select value={type} onValueChange={(value) => setType(value as Property['type'])} required>
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="land">Land</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Listing Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as Property['status'])} required>
            <SelectTrigger>
              <SelectValue placeholder="Select listing status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="for-sale">For Sale</SelectItem>
              <SelectItem value="for-rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input 
            id="price" 
            type="number" 
            value={price || ''}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Enter price in INR" 
            min="0" 
            required 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter detailed description of your property"
          rows={5}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input 
            id="bedrooms" 
            type="number" 
            value={bedrooms || ''}
            onChange={(e) => setBedrooms(Number(e.target.value))}
            placeholder="Number of bedrooms" 
            min="0" 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input 
            id="bathrooms" 
            type="number" 
            value={bathrooms || ''}
            onChange={(e) => setBathrooms(Number(e.target.value))}
            placeholder="Number of bathrooms" 
            min="0" 
            step="0.5" 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="area">Area (sq ft)</Label>
          <Input 
            id="area" 
            type="number" 
            value={area || ''}
            onChange={(e) => setArea(Number(e.target.value))}
            placeholder="Property area" 
            min="0" 
            required 
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Address Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input 
              id="address" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter street address" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select value={state} onValueChange={setState} required>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {indianCities.map(stateItem => (
                  <SelectItem key={stateItem.state} value={stateItem.state}>
                    {stateItem.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Select value={city} onValueChange={setCity} required>
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {indianCities.flatMap(stateItem => 
                  stateItem.cities.map(cityName => (
                    <SelectItem key={cityName} value={cityName}>
                      {cityName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zipCode">Pin Code</Label>
            <Input 
              id="zipCode" 
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter pin code" 
              required 
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Features & Amenities</h3>
        <p className="text-sm text-muted-foreground">
          Select the features and amenities that your property offers
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            'Air Conditioning', 'Swimming Pool', 'Garden', 'Parking',
            'Power Backup', 'Lift', 'Gym', 'Security System',
            'Servant Room', 'Furnished', 'Pet Friendly', 'Wi-Fi',
            'Rainwater Harvesting', 'Club House', 'Gated Community', 'Vaastu Compliant'
          ].map((feature) => (
            <div key={feature} className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id={`feature-${feature}`} 
                checked={features.includes(feature)}
                onChange={() => handleFeatureToggle(feature)}
                className="rounded text-primary focus:ring-primary" 
              />
              <Label htmlFor={`feature-${feature}`} className="text-sm font-normal cursor-pointer">
                {feature}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Property Images</h3>
        <p className="text-sm text-muted-foreground">
          Upload high-quality images of your property
        </p>
        
        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/*" 
          multiple 
          className="hidden" 
          onChange={handleImageUpload}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {uploadedImages.map((image, index) => (
            <div
              key={index}
              className="relative border border-border rounded-lg aspect-[4/3] group overflow-hidden"
            >
              <img 
                src={image} 
                alt={`Property Image ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={() => removeImage(index)}
                >
                  <X size={18} />
                </Button>
              </div>
            </div>
          ))}
          
          {uploadedImages.length < 8 && (
            <div
              onClick={triggerFileInput}
              className="border-2 border-dashed border-border rounded-lg aspect-[4/3] flex flex-col items-center justify-center p-4 hover:border-primary/50 transition-colors cursor-pointer"
            >
              <Upload size={36} className="text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Upload Image</p>
              <p className="text-xs text-muted-foreground">JPG, PNG or WEBP, max 5MB</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" className="gap-1">
          Add Property
        </Button>
      </div>
    </form>
  );
};

export default PropertyForm;

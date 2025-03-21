
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ImagePlus, ChevronRight, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Card,
  CardContent
} from '@/components/ui/card';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

const AddProperty = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basics');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Property Submitted",
        description: "Your property has been submitted for review.",
        duration: 5000,
      });
      navigate('/properties');
    }, 1500);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const moveToNextTab = () => {
    if (activeTab === 'basics') setActiveTab('details');
    else if (activeTab === 'details') setActiveTab('media');
    else if (activeTab === 'media') setActiveTab('publish');
  };
  
  const tabTitles = {
    basics: 'Basic Information',
    details: 'Property Details',
    media: 'Media & Gallery',
    publish: 'Review & Publish'
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container-custom max-w-5xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">List Your Property</h1>
            <p className="text-muted-foreground">
              Fill out the form below to list your property on our platform
            </p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger value="basics" data-active={activeTab === 'basics'}>Basics</TabsTrigger>
                  <TabsTrigger value="details" data-active={activeTab === 'details'}>Details</TabsTrigger>
                  <TabsTrigger value="media" data-active={activeTab === 'media'}>Media</TabsTrigger>
                  <TabsTrigger value="publish" data-active={activeTab === 'publish'}>Publish</TabsTrigger>
                </TabsList>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-6">{tabTitles[activeTab as keyof typeof tabTitles]}</h2>
                  
                  <form onSubmit={handleSubmit}>
                    <TabsContent value="basics" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="title">Property Title</Label>
                          <Input id="title" placeholder="Enter property title" required />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="type">Property Type</Label>
                          <Select required>
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
                          <Select required>
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
                          <Label htmlFor="price">Price</Label>
                          <Input id="price" type="number" placeholder="Enter price" min="0" required />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Enter detailed description of your property"
                          rows={5}
                          required
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="button" onClick={moveToNextTab} className="gap-1">
                          Continue to Details
                          <ChevronRight size={16} />
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="details" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="bedrooms">Bedrooms</Label>
                          <Input id="bedrooms" type="number" placeholder="Number of bedrooms" min="0" required />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bathrooms">Bathrooms</Label>
                          <Input id="bathrooms" type="number" placeholder="Number of bathrooms" min="0" step="0.5" required />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="area">Area (sq ft)</Label>
                          <Input id="area" type="number" placeholder="Property area" min="0" required />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Address Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="address">Street Address</Label>
                            <Input id="address" placeholder="Enter street address" required />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" placeholder="Enter city" required />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input id="state" placeholder="Enter state" required />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="zipCode">Zip Code</Label>
                            <Input id="zipCode" placeholder="Enter zip code" required />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Features & Amenities</h3>
                        <p className="text-sm text-muted-foreground">
                          Select the features and amenities that your property offers
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {[
                            'Air Conditioning', 'Swimming Pool', 'Garden', 'Garage',
                            'Fireplace', 'Balcony', 'Gym', 'Security System',
                            'Laundry Room', 'Furnished', 'Pet Friendly', 'Wi-Fi'
                          ].map((feature) => (
                            <div key={feature} className="flex items-center space-x-2">
                              <input type="checkbox" id={`feature-${feature}`} className="rounded text-primary focus:ring-primary" />
                              <Label htmlFor={`feature-${feature}`} className="text-sm font-normal cursor-pointer">
                                {feature}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="button" onClick={moveToNextTab} className="gap-1">
                          Continue to Media
                          <ChevronRight size={16} />
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="media" className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Property Images</h3>
                        <p className="text-sm text-muted-foreground">
                          Upload high-quality images of your property (minimum 3 images)
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {[...Array(6)].map((_, index) => (
                            <div
                              key={index}
                              className="border-2 border-dashed border-border rounded-lg aspect-[4/3] flex flex-col items-center justify-center p-4 hover:border-primary/50 transition-colors cursor-pointer"
                            >
                              <ImagePlus size={36} className="text-muted-foreground mb-2" />
                              <p className="text-sm font-medium">Upload Image</p>
                              <p className="text-xs text-muted-foreground">JPG, PNG or WEBP, max 5MB</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="button" onClick={moveToNextTab} className="gap-1">
                          Continue to Publish
                          <ChevronRight size={16} />
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="publish" className="space-y-6">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                        <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-sm font-medium text-yellow-800 mb-1">Before you publish</h3>
                          <p className="text-sm text-yellow-700">
                            Please ensure all the information provided is accurate and complete. 
                            Your listing will be reviewed before it appears on our platform.
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Contact Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="contactName">Contact Name</Label>
                            <Input id="contactName" placeholder="Your name" required />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="contactEmail">Contact Email</Label>
                            <Input id="contactEmail" type="email" placeholder="Your email" required />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="contactPhone">Contact Phone</Label>
                            <Input id="contactPhone" placeholder="Your phone number" required />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-4">
                        <input id="terms" type="checkbox" className="rounded text-primary focus:ring-primary" required />
                        <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                          I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                        </Label>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting} className="gap-1">
                          {isSubmitting ? 'Submitting...' : 'Publish Property'}
                        </Button>
                      </div>
                    </TabsContent>
                  </form>
                </motion.div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AddProperty;

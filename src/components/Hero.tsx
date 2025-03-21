import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/properties?location=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const featuredLocations = [
    'Mumbai', 'Ahmedabad', 'Delhi', 'Surat', 'Bangalore'
  ];

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&q=80&w=2070" 
          alt="Luxury home" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/50 to-background" />
      </div>
      
      {/* Content */}
      <div className="container-custom relative z-10 mt-20 md:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Find Your Perfect Place to Call Home
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-8 leading-relaxed">
            Discover the most luxurious properties in your preferred locations. 
            Simplified home search process for your dream home.
          </p>
          
          <form onSubmit={handleSearch} className="relative mb-8">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, address or zip code..."
              className="w-full h-14 pl-5 pr-14 rounded-full text-base backdrop-blur-md bg-background/70 border-border/50 focus-visible:ring-primary/50"
            />
            <Button 
              type="submit" 
              size="icon" 
              className="absolute right-1.5 top-1.5 h-11 w-11 rounded-full"
            >
              <SearchIcon size={20} />
            </Button>
          </form>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-foreground/70">Popular:</span>
            {featuredLocations.map((location) => (
              <Badge 
                key={location}
                variant="secondary" 
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => navigate(`/properties?location=${encodeURIComponent(location)}`)}
              >
                {location}
              </Badge>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Stats */}
      <div className="absolute bottom-0 left-0 right-0 bg-background/60 backdrop-blur-md border-t border-border/20">
        <div className="container-custom py-5">
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '15k+', label: 'Properties' },
              { value: '10k+', label: 'Customers' },
              { value: '500+', label: 'Cities' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

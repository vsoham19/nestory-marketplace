
import React from 'react';
import { motion } from 'framer-motion';
import { House, Building2, BuildingIcon, Map, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedProperties from '@/components/FeaturedProperties';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

const Index = () => {
  const categories = [
    { name: 'Houses', icon: House, count: 254 },
    { name: 'Apartments', icon: Building2, count: 158 },
    { name: 'Commercial', icon: BuildingIcon, count: 87 },
    { name: 'Land', icon: Map, count: 46 },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      
      {/* Categories */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight mb-2">Browse by Category</h2>
            <p className="text-muted-foreground">Explore different types of properties available</p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/properties?type=${category.name.toLowerCase()}`}>
                  <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all duration-300">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <category.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.count} Properties</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Properties */}
      <FeaturedProperties />
      
      {/* How It Works */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div 
            className="mb-10 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight mb-2">How It Works</h2>
            <p className="text-muted-foreground">Simple steps to find your dream property or list your own</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Browse Properties',
                description: 'Explore our extensive collection of properties across various locations and find the perfect match for your needs.',
              },
              {
                step: '02',
                title: 'Connect with Sellers',
                description: 'Directly communicate with property owners or agents to get detailed information and schedule viewings.',
              },
              {
                step: '03',
                title: 'Close the Deal',
                description: 'Finalize your purchase or rental agreement with confidence, knowing you've found the perfect property.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="p-6 bg-card border border-border/50 rounded-lg hover:shadow-md transition-all duration-300">
                  <div className="text-5xl font-bold text-primary/20 mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 text-muted-foreground/30">
                    <ArrowRight size={30} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-primary/5">
        <div className="container-custom">
          <div className="rounded-lg bg-gradient-to-r from-primary/80 to-primary p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">Ready to Find Your Dream Property?</h2>
              <p className="text-primary-foreground/90 max-w-xl">
                Browse thousands of listings, connect with sellers, and find the perfect place to call home.
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white hover:bg-white/90 text-primary"
                asChild
              >
                <Link to="/properties">Browse Properties</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary"
                asChild
              >
                <Link to="/add-property">List Property</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-secondary pt-12 pb-6">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Estate Finder</h3>
              <p className="text-muted-foreground mb-4">
                Your trusted partner in finding the perfect property. We connect buyers and sellers to make dream homes a reality.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {['Home', 'Properties', 'Add Property', 'About Us', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link 
                      to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Property Types</h3>
              <ul className="space-y-2">
                {['Houses', 'Apartments', 'Condos', 'Townhouses', 'Commercial', 'Land'].map((item) => (
                  <li key={item}>
                    <Link 
                      to={`/properties?type=${item.toLowerCase()}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
              <address className="not-italic text-muted-foreground space-y-2">
                <p>123 Real Estate Ave</p>
                <p>New York, NY 10001</p>
                <p>Email: info@estatefinder.com</p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-border/50 pt-6 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Estate Finder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

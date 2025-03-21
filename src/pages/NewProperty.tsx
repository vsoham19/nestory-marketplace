
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import PropertyForm from '@/components/PropertyForm';
import { 
  Card,
  CardContent
} from '@/components/ui/card';

const NewProperty = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container-custom max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Add Your Property</h1>
              <p className="text-muted-foreground">
                Fill out the form below to list your property on our website
              </p>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <PropertyForm />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default NewProperty;


import React from 'react';
import Navbar from '@/components/Navbar';
import PropertyForm from '@/components/PropertyForm';
import { Separator } from '@/components/ui/separator';

const AddProperty = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container-custom max-w-5xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">List Your Property</h1>
            <p className="text-muted-foreground">
              Fill out the form below to list your property on Estate Finder India
            </p>
          </div>
          
          <Separator className="my-6" />
          
          <PropertyForm />
        </div>
      </main>
    </div>
  );
};

export default AddProperty;

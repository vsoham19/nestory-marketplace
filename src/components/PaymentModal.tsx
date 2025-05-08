
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { processPayment } from '@/utils/paymentUtils';
import PaymentForm from '@/components/payment/PaymentForm';
import SellerContactInfo from '@/components/payment/SellerContactInfo';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/lib/supabase';

interface PaymentModalProps {
  propertyTitle: string;
  propertyId: string;
  onPaymentSuccess?: () => void;
}

const PaymentModal = ({ propertyTitle, propertyId, onPaymentSuccess }: PaymentModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  
  // Log property information to help debug
  console.log(`Payment Modal - Property ID: ${propertyId}, Property Title: ${propertyTitle}`);
  
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to make a payment",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const amount = 3000;
      
      // Log payment attempt for debugging
      console.log(`Processing payment for Property ID: ${propertyId}, User ID: ${user.id}`);
      
      // Check if property exists in database before payment processing
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('id, title, user_id')
        .eq('id', propertyId)
        .maybeSingle();
      
      // If property was not found in database, use the numeric ID format
      let targetPropertyId = propertyId;
      let finalPropertyTitle = propertyTitle;
      
      if (propertyError || !propertyData) {
        console.log('Property not found in database with provided ID, using numeric ID format');
      } else {
        console.log('Property found in database:', propertyData);
        targetPropertyId = propertyData.id;
        finalPropertyTitle = propertyData.title || propertyTitle;
      }
      
      const result = await processPayment(user.id, targetPropertyId, amount, finalPropertyTitle);
      
      if (result.success) {
        setIsLoading(false);
        setShowContact(true);
        setIsOpen(true); // Keep the dialog open to show contact info
        
        toast({
          title: "Payment Successful",
          description: "Payment processed. You now have access to the seller's contact details. An email notification has been sent to you and the administrator.",
        });
        
        // Call the onPaymentSuccess callback if provided
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      
      toast({
        title: "Payment Failed",
        description: error.message || "Unable to process payment. Please try again.",
        variant: "destructive",
      });
      
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="w-full">
            Pay ₹3,000 to Contact Seller
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Seller</DialogTitle>
            <DialogDescription>
              Pay ₹3,000 to get seller contact details for: {propertyTitle}
            </DialogDescription>
          </DialogHeader>
          
          {!showContact ? (
            <PaymentForm isLoading={isLoading} onSubmit={handlePayment} />
          ) : (
            <SellerContactInfo />
          )}
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
};

export default PaymentModal;


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

interface PaymentModalProps {
  propertyTitle: string;
  propertyId: string;
}

const PaymentModal = ({ propertyTitle, propertyId }: PaymentModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  
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
      console.log(`Processing payment for property ID: ${propertyId}, User ID: ${user.id}`);
      const result = await processPayment(user.id, propertyId, amount);
      
      if (result.success) {
        setIsLoading(false);
        setShowContact(true);
        
        toast({
          title: "Payment Successful",
          description: result.local 
            ? "Payment processed locally. You now have access to the seller's contact details."
            : "Payment processed. You now have access to the seller's contact details.",
        });
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
  );
};

export default PaymentModal;

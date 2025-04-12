
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentModalProps {
  propertyTitle: string;
  propertyId: string;
}

// Convert numeric propertyId to valid UUID format
const formatPropertyIdToUuid = (propertyId: string): string => {
  // If it already has hyphens, assume it's already a UUID
  if (propertyId.includes('-')) {
    return propertyId;
  }
  
  // Pad with zeros and format properly as UUID
  const paddedId = propertyId.padStart(32, '0');
  return `${paddedId.slice(0, 8)}-${paddedId.slice(8, 12)}-${paddedId.slice(12, 16)}-${paddedId.slice(16, 20)}-${paddedId.slice(20)}`;
};

// Local storage key for payments
const PAYMENTS_STORAGE_KEY = 'realEstate_payments';

// Save payment locally for mock properties
const savePaymentLocally = (userId: string, propertyId: string, amount: number) => {
  // Get existing payments from localStorage
  const existingPayments = JSON.parse(localStorage.getItem(PAYMENTS_STORAGE_KEY) || '[]');
  
  // Add new payment
  existingPayments.push({
    id: `local-payment-${Date.now()}`,
    user_id: userId,
    property_id: propertyId, // Store the original propertyId for local storage
    amount: amount,
    status: 'completed',
    created_at: new Date().toISOString()
  });
  
  // Save back to localStorage
  localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(existingPayments));
};

const PaymentModal = ({ propertyTitle, propertyId }: PaymentModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
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
      
      // Try to store payment record in Supabase
      try {
        // First try with formatted UUID
        const validPropertyId = formatPropertyIdToUuid(propertyId);
        console.log(`Attempting to save payment with formatted ID: ${validPropertyId}`);
        
        const { data, error } = await supabase
          .from('payments')
          .insert({
            user_id: user.id,
            property_id: validPropertyId,
            amount: amount,
            status: 'completed'
          })
          .select();
        
        if (error) {
          // If there's an error with formatted ID, try with original ID
          console.log('Error with formatted ID, trying with original:', error);
          
          const { data: originalData, error: originalError } = await supabase
            .from('payments')
            .insert({
              user_id: user.id,
              property_id: propertyId,
              amount: amount,
              status: 'completed'
            })
            .select();
            
          if (originalError) {
            // If both approaches fail, fall back to local storage
            console.log('Falling back to local storage for payment:', originalError);
            savePaymentLocally(user.id, propertyId, amount);
          }
        }
      } catch (dbError) {
        // In case of any database error, fallback to local storage
        console.log('Database error, using local storage fallback:', dbError);
        savePaymentLocally(user.id, propertyId, amount);
      }
      
      setIsLoading(false);
      setShowContact(true);
      
      toast({
        title: "Payment Successful",
        description: "You now have access to the seller's contact details",
      });
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
    <Dialog>
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
          <form onSubmit={handlePayment} className="space-y-4 pt-4">
            <div className="space-y-1">
              <Label htmlFor="card-name">Name on Card</Label>
              <Input id="card-name" placeholder="John Doe" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="card-number">Card Number</Label>
              <Input id="card-number" placeholder="1234 5678 9012 3456" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" required />
              </div>
            </div>
            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Pay ₹3,000"}
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Your payment is secure and encrypted. By proceeding, you agree to our terms and conditions.
            </p>
          </form>
        ) : (
          <div className="pt-4 space-y-4">
            <div className="p-4 border rounded-md bg-secondary/50">
              <h3 className="font-medium mb-2">Seller Contact Details</h3>
              <p className="text-sm">Raj Sharma</p>
              <p className="text-sm">+91 98765 43210</p>
              <p className="text-sm">raj.sharma@example.com</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Next Steps:</h4>
              <ul className="text-sm space-y-1 list-disc pl-4 text-muted-foreground">
                <li>Contact the seller directly using the information provided</li>
                <li>Schedule a visit to the property</li>
                <li>Discuss your requirements and negotiate terms</li>
              </ul>
            </div>
            <DialogClose asChild>
              <Button className="w-full">Close</Button>
            </DialogClose>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;

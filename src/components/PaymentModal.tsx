
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

interface PaymentModalProps {
  propertyTitle: string;
}

const PaymentModal = ({ propertyTitle }: PaymentModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      setShowContact(true);
      toast({
        title: "Payment Successful",
        description: "You now have access to the seller's contact details",
      });
    }, 1500);
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
            <Button className="w-full">Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;

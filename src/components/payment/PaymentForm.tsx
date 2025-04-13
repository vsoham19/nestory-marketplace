
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PaymentFormProps {
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const PaymentForm = ({ isLoading, onSubmit }: PaymentFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-4">
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
  );
};

export default PaymentForm;

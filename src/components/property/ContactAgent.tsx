
import React, { useState, useEffect } from 'react';
import { Phone, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PaymentModal from '@/components/PaymentModal';
import { Developer } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { formatPropertyIdToUuid, PAYMENTS_STORAGE_KEY } from '@/utils/paymentUtils';

interface ContactAgentProps {
  developer: Developer;
  propertyTitle: string;
  propertyId: string;
}

const ContactAgent = ({ developer, propertyTitle, propertyId }: ContactAgentProps) => {
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState<boolean>(true);
  
  // Log property information for debugging
  console.log(`ContactAgent - Property ID: ${propertyId}, Property Title: ${propertyTitle}`);
  
  useEffect(() => {
    const checkPaymentStatus = async () => {
      setIsCheckingPayment(true);
      
      try {
        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          console.log('User not logged in, cannot check payment status');
          setIsCheckingPayment(false);
          return;
        }
        
        console.log('Checking payment status for property:', propertyId, 'and user:', session.user.id);
        
        // Check all possible ID formats
        const propertyIdFormats = [
          propertyId, // Original ID
          formatPropertyIdToUuid(propertyId), // Formatted UUID
        ];
        
        let paymentFound = false;
        
        // Try each ID format
        for (const idFormat of propertyIdFormats) {
          console.log('Checking payment with ID format:', idFormat);
          
          // Check if payment exists in Supabase
          const { data: payments, error } = await supabase
            .from('payments')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('property_id', idFormat)
            .eq('status', 'completed');
          
          if (error) {
            console.error('Error checking payment status with ID format:', idFormat, error);
            continue;
          }
          
          // If payment found with this ID format
          if (payments && payments.length > 0) {
            console.log('Payment found in database with ID format:', idFormat);
            paymentFound = true;
            break;
          }
        }
        
        // If not found in database, check local storage as fallback
        if (!paymentFound) {
          console.log('Payment not found in database, checking local storage');
          
          const localPayments = JSON.parse(localStorage.getItem(PAYMENTS_STORAGE_KEY) || '[]');
          paymentFound = localPayments.some(
            (p: any) => p.user_id === session.user.id && 
                        (p.property_id === propertyId || p.property_id === formatPropertyIdToUuid(propertyId)) && 
                        p.status === 'completed'
          );
          
          if (paymentFound) {
            console.log('Payment found in local storage');
          }
        }
        
        setHasPaid(paymentFound);
      } catch (error) {
        console.error('Error checking payment status:', error);
      } finally {
        setIsCheckingPayment(false);
      }
    };
    
    checkPaymentStatus();
  }, [propertyId]);
  
  const onPaymentSuccess = () => {
    setHasPaid(true);
    toast({
      title: "Contact Access Granted",
      description: "You now have access to the seller's contact details.",
    });
  };
  
  return (
    <div className="bg-card border border-border/50 rounded-lg p-6 sticky top-24">
      <h3 className="text-lg font-semibold mb-4">Contact Agent</h3>
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={developer.avatar} alt={developer.name} />
          <AvatarFallback>{developer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium">{developer.name}</h4>
          <p className="text-sm text-muted-foreground">{developer.title}</p>
        </div>
      </div>
      
      <Separator className="mb-4" />
      
      {isCheckingPayment ? (
        <div className="flex justify-center py-4">
          <div className="animate-pulse text-center">
            <p className="text-sm text-muted-foreground">Checking payment status...</p>
          </div>
        </div>
      ) : hasPaid ? (
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Phone size={16} className="text-muted-foreground" />
            <span>{developer.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail size={16} className="text-muted-foreground" />
            <span>{developer.email}</span>
          </div>
          
          <p className="text-sm text-center text-green-500 font-medium">
            You have access to contact the seller directly
          </p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Phone size={16} className="text-muted-foreground" />
            <span>●●●●●●●●●●</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail size={16} className="text-muted-foreground" />
            <span>●●●●●●●●●●</span>
          </div>
          
          <PaymentModal 
            propertyTitle={propertyTitle} 
            propertyId={propertyId}
            onPaymentSuccess={onPaymentSuccess}
          />
          
          <p className="text-sm text-center text-muted-foreground">
            Pay ₹3,000 once to get direct contact with the seller
          </p>
        </div>
      )}
      
      <form className="space-y-4">
        <div>
          <Input 
            type="text" 
            placeholder="Your Name" 
            className="w-full"
          />
        </div>
        <div>
          <Input 
            type="email" 
            placeholder="Your Email" 
            className="w-full"
          />
        </div>
        <div>
          <Input 
            type="tel" 
            placeholder="Your Phone" 
            className="w-full"
          />
        </div>
        <div>
          <textarea 
            rows={3} 
            placeholder="I'm interested in this property. Please contact me." 
            className="w-full px-4 py-2 rounded-md border border-border bg-background resize-none"
          />
        </div>
        <Button className="w-full">Send Message</Button>
      </form>
    </div>
  );
};

export default ContactAgent;

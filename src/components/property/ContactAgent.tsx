
import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PaymentModal from '@/components/PaymentModal';
import { Developer } from '@/lib/types';

interface ContactAgentProps {
  developer: Developer;
  propertyTitle: string;
  propertyId: string;
}

const ContactAgent = ({ developer, propertyTitle, propertyId }: ContactAgentProps) => {
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
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2 text-sm">
          <Phone size={16} className="text-muted-foreground" />
          <span>{developer.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Mail size={16} className="text-muted-foreground" />
          <span>{developer.email}</span>
        </div>
        
        <PaymentModal 
          propertyTitle={propertyTitle} 
          propertyId={propertyId} 
        />
        
        <p className="text-sm text-center text-muted-foreground">
          Pay ₹3,000 once to get direct contact with the seller
        </p>
      </div>
      
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

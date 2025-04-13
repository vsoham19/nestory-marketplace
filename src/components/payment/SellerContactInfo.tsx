
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DialogClose } from '@/components/ui/dialog';

const SellerContactInfo = () => {
  return (
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
  );
};

export default SellerContactInfo;

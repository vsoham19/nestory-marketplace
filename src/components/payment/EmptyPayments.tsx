
import React from 'react';
import { FileX } from 'lucide-react';

interface EmptyPaymentsProps {
  isAdmin?: boolean;
}

const EmptyPayments = ({ isAdmin = false }: EmptyPaymentsProps) => {
  return (
    <div className="bg-muted/50 rounded-lg p-8 text-center">
      <div className="flex flex-col items-center gap-2">
        <FileX className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">
          {isAdmin 
            ? "No payment records found in the system" 
            : "You haven't made any payments yet"}
        </p>
      </div>
    </div>
  );
};

export default EmptyPayments;

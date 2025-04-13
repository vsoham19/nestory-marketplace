
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IndianRupee } from 'lucide-react';

export interface Payment {
  id: string;
  user_id: string;
  property_id: string;
  amount: number;
  status: string;
  created_at: string;
  user_email?: string;
  property_title?: string;
}

interface PaymentTableProps {
  payments: Payment[];
  isAdmin?: boolean;
}

const PaymentTable = ({ payments, isAdmin = false }: PaymentTableProps) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP');
  };

  return (
    <Table>
      <TableCaption>
        {isAdmin 
          ? "Complete list of all payment records across all users" 
          : "A list of your payment records"}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>{isAdmin && "User"}</TableHead>
          <TableHead>Property</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>{formatDate(payment.created_at)}</TableCell>
            {isAdmin && <TableCell>{payment.user_email}</TableCell>}
            <TableCell>{payment.property_title}</TableCell>
            <TableCell className="text-right font-medium">
              <div className="flex items-center justify-end gap-1">
                <IndianRupee className="h-4 w-4" />
                {formatAmount(payment.amount).replace('₹', '')}
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  payment.status === 'completed'
                    ? 'success'
                    : payment.status === 'failed'
                    ? 'destructive'
                    : 'outline'
                }
                className={
                  payment.status === 'completed'
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : payment.status === 'failed'
                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                }
              >
                {payment.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PaymentTable;

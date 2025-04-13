
import React from 'react';
import { Payment } from './PaymentTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee } from 'lucide-react';

interface PaymentSummaryProps {
  payments: Payment[];
  isAdmin?: boolean;
}

const PaymentSummary = ({ payments, isAdmin = false }: PaymentSummaryProps) => {
  const totalAmount = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const completedPayments = payments.filter(payment => payment.status === 'completed').length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
          <CardDescription>All-time payment records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{payments.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Completed Payments</CardTitle>
          <CardDescription>Successfully processed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{completedPayments}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          <CardDescription>{isAdmin ? "All users combined" : "Your payments"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 text-2xl font-bold">
            <IndianRupee className="h-5 w-5" />
            {formatAmount(totalAmount).replace('₹', '')}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSummary;

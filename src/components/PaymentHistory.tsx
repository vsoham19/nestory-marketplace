
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Payment {
  id: string;
  user_id: string;
  property_id: string;
  amount: number;
  status: string;
  created_at: string;
  user_email?: string;
  property_title?: string;
}

interface PaymentHistoryProps {
  isAdmin?: boolean;
}

const PaymentHistory = ({ isAdmin = false }: PaymentHistoryProps) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      try {
        // If admin, fetch all payments, otherwise only fetch user's payments
        let query = supabase
          .from('payments')
          .select(`
            *,
            properties(title)
          `)
          .order('created_at', { ascending: false });
        
        // Filter by user_id if not admin
        if (!isAdmin && user) {
          query = query.eq('user_id', user.id);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Get user emails separately for each user_id
        const userEmails = new Map();
        if (data && data.length > 0) {
          const userIds = [...new Set(data.map(payment => payment.user_id))];
          for (const userId of userIds) {
            const { data: userData, error: userError } = await supabase
              .from('profiles')
              .select('email')
              .eq('id', userId)
              .single();
            
            if (!userError && userData) {
              userEmails.set(userId, userData.email);
            }
          }
        }

        // Combine payment data with user emails and property titles
        const enhancedPayments = data?.map(payment => ({
          ...payment,
          user_email: userEmails.get(payment.user_id) || 'Unknown',
          property_title: payment.properties?.title || 'Unknown Property'
        })) || [];

        // Also fetch payments from local storage and combine with DB results
        if (!isAdmin) {
          const localPayments = getLocalPayments(user?.id);
          setPayments([...enhancedPayments, ...localPayments]);
        } else {
          setPayments(enhancedPayments);
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPayments();
    }
  }, [user, isAdmin]);

  // Get payments from local storage
  const getLocalPayments = (userId?: string): Payment[] => {
    if (!userId) return [];
    
    try {
      const PAYMENTS_STORAGE_KEY = 'realEstate_payments';
      const storedPayments = JSON.parse(localStorage.getItem(PAYMENTS_STORAGE_KEY) || '[]');
      
      // Only return payments for the current user
      return storedPayments
        .filter((payment: any) => payment.user_id === userId)
        .map((payment: any) => ({
          ...payment,
          user_email: 'Local User',
          property_title: 'Local Property'
        }));
    } catch (error) {
      console.error('Error retrieving local payments:', error);
      return [];
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {isAdmin ? "All Payment Records" : "Payment Records"}
        </h2>
      </div>

      {payments.length === 0 ? (
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <p className="text-muted-foreground">No payment records found</p>
        </div>
      ) : (
        <Table>
          <TableCaption>
            {isAdmin 
              ? "Complete list of all payment records across all users" 
              : "A list of your payment records"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{formatDate(payment.created_at)}</TableCell>
                <TableCell>{payment.user_email}</TableCell>
                <TableCell>{payment.property_title}</TableCell>
                <TableCell>{formatAmount(payment.amount)}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      payment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default PaymentHistory;

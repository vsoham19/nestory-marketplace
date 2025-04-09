
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import PaymentHistory from '@/components/PaymentHistory';
import { Navigate } from 'react-router-dom';

const AdminPayments = () => {
  const { user, isLoading } = useAuth();
  
  // Hardcoded admin emails for demo purposes
  // In a production app, you would check user roles in the database
  const ADMIN_EMAILS = ['admin@example.com'];
  
  // Check if current user is an admin
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  // If auth is still loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom pt-24 pb-16">
          <div className="w-full h-full flex items-center justify-center">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // If user is not authenticated or not an admin, redirect
  if (!user || !isAdmin) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container-custom pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-8">Administrator Dashboard</h1>
        <PaymentHistory isAdmin={true} />
      </div>
    </div>
  );
};

export default AdminPayments;

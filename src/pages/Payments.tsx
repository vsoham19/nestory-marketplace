
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import PaymentHistory from '@/components/PaymentHistory';
import { Navigate } from 'react-router-dom';

const Payments = () => {
  const { user, isLoading } = useAuth();

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

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container-custom pt-24 pb-16">
        <PaymentHistory />
      </div>
    </div>
  );
};

export default Payments;

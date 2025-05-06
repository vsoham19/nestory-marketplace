
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Properties from '@/pages/Properties';
import PropertyDetail from '@/pages/PropertyDetail';
import AddProperty from '@/pages/AddProperty';
import NewProperty from '@/pages/NewProperty';
import Profile from '@/pages/Profile';
import Auth from '@/pages/Auth';
import Favorites from '@/pages/Favorites';
import Payments from '@/pages/Payments';
import AdminPayments from '@/pages/AdminPayments';
import NotFound from '@/pages/NotFound';
import About from '@/pages/About';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/new-property" element={<NewProperty />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

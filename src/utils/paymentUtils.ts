
// Utility functions for payment processing
import { supabase } from '@/lib/supabase';

// Convert numeric propertyId to valid UUID format
export const formatPropertyIdToUuid = (propertyId: string): string => {
  try {
    // If it already looks like a valid UUID with hyphens, return as is
    if (propertyId.includes('-') && 
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(propertyId)) {
      console.log(`Property ID is already a valid UUID: ${propertyId}`);
      return propertyId;
    }
    
    // For properties that might already be UUIDs but without hyphens
    if (propertyId.length === 32) {
      const formattedUuid = `${propertyId.substring(0, 8)}-${propertyId.substring(8, 12)}-${propertyId.substring(12, 16)}-${propertyId.substring(16, 20)}-${propertyId.substring(20)}`;
      console.log(`Formatted ID from 32-char string: ${formattedUuid}`);
      return formattedUuid;
    }
    
    // For numeric IDs or other formats, create a proper UUID format with prefix
    // Format: ffffffff-ffff-ffff-ffff-xxxxxxxxxxxx where x is the padded ID
    const paddedId = propertyId.padStart(12, '0');
    const formattedUuid = `ffffffff-ffff-ffff-ffff-${paddedId}`;
    console.log(`Formatted numeric ID to UUID: ${formattedUuid}`);
    return formattedUuid;
  } catch (error) {
    console.error('Error formatting property ID to UUID:', error);
    return propertyId; // Return original in case of any error
  }
};

// Local storage key for payments
export const PAYMENTS_STORAGE_KEY = 'realEstate_payments';

// Save payment locally for mock properties
export const savePaymentLocally = (userId: string, propertyId: string, amount: number): void => {
  try {
    // Get existing payments from localStorage
    const existingPayments = JSON.parse(localStorage.getItem(PAYMENTS_STORAGE_KEY) || '[]');
    
    // Add new payment
    existingPayments.push({
      id: `local-payment-${Date.now()}`,
      user_id: userId,
      property_id: propertyId, // Store the original propertyId for local storage
      amount: amount,
      status: 'completed',
      created_at: new Date().toISOString()
    });
    
    // Save back to localStorage
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(existingPayments));
    console.log('Payment saved to local storage:', propertyId);
  } catch (error) {
    console.error('Error saving payment to local storage:', error);
  }
};

// Send email notification to admin about payment
export const sendPaymentNotificationEmail = async (
  userId: string, 
  propertyId: string, 
  amount: number,
  buyerEmail: string,
  propertyTitle: string, 
  sellerEmail: string
) => {
  try {
    console.log('Sending payment notification email to admin');
    
    const adminEmail = 'sohamvaghasia004@gmail.com';
    
    const { error } = await supabase.functions.invoke('send-payment-notification', {
      body: {
        userId,
        propertyId,
        amount,
        buyerEmail,
        propertyTitle,
        sellerEmail,
        adminEmail
      }
    });
    
    if (error) {
      console.error('Error sending payment notification email:', error);
      return { success: false, error };
    }
    
    console.log('Payment notification email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending payment notification:', error);
    return { success: false, error };
  }
};

// Process payment and store in Supabase or localStorage
export const processPayment = async (
  userId: string, 
  propertyId: string, 
  amount: number, 
  propertyTitle: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log(`Processing payment: User ID ${userId}, Property ID ${propertyId}, Amount ${amount}, Title: ${propertyTitle}`);
    
    // First check if a payment record already exists to prevent duplicate payments
    const { data: existingPayments, error: checkError } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .eq('property_id', propertyId);
    
    if (checkError) {
      console.error('Error checking for existing payments:', checkError);
    } else if (existingPayments && existingPayments.length > 0) {
      console.log('Payment record already exists:', existingPayments[0]);
      return { success: true };
    }
    
    // Insert the payment record into Supabase
    const { data, error } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        property_id: propertyId,
        amount,
        status: 'completed'
      })
      .select('*')
      .single();
    
    if (error) {
      console.error('Error inserting payment record:', error);
      // Store in localStorage as backup if database insert fails
      storePaymentInLocalStorage(userId, propertyId, amount);
      // Continue with the process even if database insert fails
    } else {
      console.log('Payment record created in database:', data);
    }
    
    // Get user's email
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .maybeSingle();
    
    let buyerEmail = 'unknown@example.com';
    if (userError) {
      console.error('Error fetching user email:', userError);
    } else if (userProfile && userProfile.email) {
      buyerEmail = userProfile.email;
    }
    
    // Get property owner's email (seller)
    const { data: propertyData, error: propertyError } = await supabase
      .from('properties')
      .select('user_id')
      .eq('id', propertyId)
      .maybeSingle();
    
    let sellerEmail = 'unknown@example.com';
    if (!propertyError && propertyData && propertyData.user_id) {
      const { data: sellerProfile, error: sellerError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', propertyData.user_id)
        .maybeSingle();
      
      if (!sellerError && sellerProfile && sellerProfile.email) {
        sellerEmail = sellerProfile.email;
      }
    }
    
    // Send payment notification
    try {
      const adminEmail = 'admin@estatefinderindia.com'; // Default admin email
      
      const notificationResponse = await fetch('https://wixngvknbvjthbasfijk.supabase.co/functions/v1/send-payment-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          propertyId,
          amount,
          buyerEmail,
          propertyTitle, // Include property title
          sellerEmail,
          adminEmail
        }),
      });
      
      if (!notificationResponse.ok) {
        throw new Error(`Notification failed: ${notificationResponse.statusText}`);
      }
      
      console.log('Payment notification sent successfully');
      
    } catch (notifyError) {
      console.error('Error sending payment notification:', notifyError);
      // Don't fail the payment process if notification fails
    }
    
    return { success: true };
    
  } catch (error: any) {
    console.error('Payment processing error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
};

// Helper function to gather and send email notification with all details
const sendConfirmationEmailWithDetails = async (userId: string, propertyId: string, amount: number) => {
  try {
    // After successful payment, fetch buyer email
    const { data: userData } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();
      
    // Fetch property details and seller info
    const { data: propertyData } = await supabase
      .from('properties')
      .select('title, user_id')
      .eq('id', propertyId)
      .maybeSingle();
      
    // Default values if data is not available
    const buyerEmail = userData?.email || 'unknown@example.com';
    const propertyTitle = propertyData?.title || 'Unknown Property';
    let sellerEmail = 'unknown@example.com';
    
    // Fetch seller email if property data exists
    if (propertyData && propertyData.user_id) {
      const { data: sellerData } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', propertyData.user_id)
        .single();
        
      if (sellerData && sellerData.email) {
        sellerEmail = sellerData.email;
      }
    }
    
    console.log('Email notification parameters:', {
      userId,
      propertyId,
      amount,
      buyerEmail,
      propertyTitle,
      sellerEmail
    });
    
    // Send email notification
    await sendPaymentNotificationEmail(
      userId,
      propertyId,
      amount,
      buyerEmail,
      propertyTitle,
      sellerEmail
    );
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

// Function to store payment in local storage as a backup
const storePaymentInLocalStorage = (userId: string, propertyId: string, amount: number) => {
  try {
    // Get existing payments from localStorage
    const existingPayments = JSON.parse(localStorage.getItem(PAYMENTS_STORAGE_KEY) || '[]');
    
    // Add new payment
    existingPayments.push({
      id: `local-payment-${Date.now()}`,
      user_id: userId,
      property_id: propertyId, // Store the original propertyId for local storage
      amount: amount,
      status: 'completed',
      created_at: new Date().toISOString()
    });
    
    // Save back to localStorage
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(existingPayments));
    console.log('Payment saved to local storage:', propertyId);
  } catch (error) {
    console.error('Error saving payment to local storage:', error);
  }
};

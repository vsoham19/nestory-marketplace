
// Utility functions for payment processing

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
    const { supabase } = await import('@/lib/supabase');
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
export const processPayment = async (userId: string, propertyId: string, amount: number) => {
  try {
    const { supabase } = await import('@/lib/supabase');
    console.log(`Processing payment for property: ${propertyId} (Original ID format)`);
    
    // Try to store payment record in Supabase
    try {
      // First, check if the property is in the database with original ID
      const { data: propertyExists } = await supabase
        .from('properties')
        .select('id')
        .eq('id', propertyId)
        .maybeSingle();
      
      if (propertyExists) {
        console.log(`Property exists with original ID: ${propertyId}`);
        
        // Use original property ID since it exists
        const { data, error } = await supabase
          .from('payments')
          .insert({
            user_id: userId,
            property_id: propertyId,
            amount: amount,
            status: 'completed'
          })
          .select();
        
        if (error) {
          throw error;
        }
        
        console.log('Payment saved with original ID:', data);
        
        // Fetch user and property information for email
        await sendConfirmationEmailWithDetails(supabase, userId, propertyId, amount);
        
        return { success: true, data };
      }
      
      // If original ID didn't work, try with formatted UUID
      const formattedId = formatPropertyIdToUuid(propertyId);
      console.log(`Attempting to save payment with formatted ID: ${formattedId}`);
      
      // Try to find property with formatted ID
      const { data: formattedPropertyExists } = await supabase
        .from('properties')
        .select('id')
        .eq('id', formattedId)
        .maybeSingle();
        
      if (formattedPropertyExists) {
        console.log(`Property exists with formatted ID: ${formattedId}`);
        
        // Use formatted ID since it exists
        const { data, error } = await supabase
          .from('payments')
          .insert({
            user_id: userId,
            property_id: formattedId,
            amount: amount,
            status: 'completed'
          })
          .select();
        
        if (error) {
          throw error;
        }
        
        console.log('Payment saved with formatted ID:', data);
        
        // Fetch user and property information for email
        await sendConfirmationEmailWithDetails(supabase, userId, formattedId, amount);
        
        return { success: true, data };
      }
      
      // If still no success, save directly with original ID
      console.log('Property not found in database, attempting direct insertion with original ID');
      const { data, error } = await supabase
        .from('payments')
        .insert({
          user_id: userId,
          property_id: propertyId,
          amount: amount,
          status: 'completed'
        })
        .select();
      
      if (error) {
        // Last attempt with formatted ID direct insertion
        console.log('Attempting direct insertion with formatted ID as fallback');
        const { data: formattedData, error: formattedError } = await supabase
          .from('payments')
          .insert({
            user_id: userId,
            property_id: formattedId,
            amount: amount,
            status: 'completed'
          })
          .select();
          
        if (formattedError) {
          console.error('All database attempts failed, falling back to local storage', formattedError);
          savePaymentLocally(userId, propertyId, amount);
          
          // Send an email notification anyway
          const { data: userData } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', userId)
            .single();
            
          await sendPaymentNotificationEmail(
            userId,
            propertyId,
            amount,
            userData?.email || 'unknown',
            'Unknown Property (Local Storage)',
            'unknown'
          );
          
          return { success: true, local: true };
        } else {
          console.log('Payment saved with formatted ID (direct insertion):', formattedData);
          
          // Fetch user and property information for email
          await sendConfirmationEmailWithDetails(supabase, userId, formattedId, amount);
          
          return { success: true, data: formattedData };
        }
      } else {
        console.log('Payment saved with original ID (direct insertion):', data);
        
        // Fetch user and property information for email
        await sendConfirmationEmailWithDetails(supabase, userId, propertyId, amount);
        
        return { success: true, data };
      }
    } catch (dbError) {
      // In case of any database error, fallback to local storage
      console.error('Database error, using local storage fallback:', dbError);
      savePaymentLocally(userId, propertyId, amount);
      
      // Try to send email notification anyway
      try {
        const { data: userData } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', userId)
          .single();
          
        await sendPaymentNotificationEmail(
          userId,
          propertyId,
          amount,
          userData?.email || 'unknown',
          'Unknown Property (Local Storage Fallback)',
          'unknown'
        );
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
      }
      
      return { success: true, local: true };
    }
  } catch (error: any) {
    console.error('Payment error:', error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};

// Helper function to gather and send email notification with all details
const sendConfirmationEmailWithDetails = async (supabase: any, userId: string, propertyId: string, amount: number) => {
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

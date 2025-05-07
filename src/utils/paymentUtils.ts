
// Utility functions for payment processing

// Convert numeric propertyId to valid UUID format
export const formatPropertyIdToUuid = (propertyId: string): string => {
  try {
    // If it already looks like a valid UUID with hyphens, return as is
    if (propertyId.includes('-') && 
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(propertyId)) {
      return propertyId;
    }
    
    // For properties that might already be UUIDs but without hyphens
    if (propertyId.length === 32) {
      return `${propertyId.substring(0, 8)}-${propertyId.substring(8, 12)}-${propertyId.substring(12, 16)}-${propertyId.substring(16, 20)}-${propertyId.substring(20)}`;
    }
    
    // For numeric IDs or other formats, create a proper UUID format with prefix
    // Format: ffffffff-ffff-ffff-ffff-xxxxxxxxxxxx where x is the padded ID
    const paddedId = propertyId.padStart(12, '0');
    return `ffffffff-ffff-ffff-ffff-${paddedId}`;
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
    console.log(`Processing payment for property: ${propertyId}`);
    
    // Try to store payment record in Supabase
    try {
      // First try with formatted UUID
      const validPropertyId = formatPropertyIdToUuid(propertyId);
      console.log(`Attempting to save payment with formatted ID: ${validPropertyId}`);
      
      const { data, error } = await supabase
        .from('payments')
        .insert({
          user_id: userId,
          property_id: validPropertyId,
          amount: amount,
          status: 'completed'
        })
        .select();
      
      if (error) {
        console.log('Error with formatted ID, trying with original:', error);
        
        // If there's an error with formatted ID, try with original ID
        const { data: originalData, error: originalError } = await supabase
          .from('payments')
          .insert({
            user_id: userId,
            property_id: propertyId,
            amount: amount,
            status: 'completed'
          })
          .select();
          
        if (originalError) {
          // If both approaches fail, fall back to local storage
          console.log('Falling back to local storage for payment:', originalError);
          savePaymentLocally(userId, propertyId, amount);
          return { success: true, local: true };
        } else {
          console.log('Payment saved with original ID:', originalData);
          
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
            .single();
            
          // Fetch seller email if property data exists
          let sellerEmail = 'unknown';
          if (propertyData) {
            const { data: sellerData } = await supabase
              .from('profiles')
              .select('email')
              .eq('id', propertyData.user_id)
              .single();
              
            if (sellerData) {
              sellerEmail = sellerData.email;
            }
          }
          
          // Send email notification
          await sendPaymentNotificationEmail(
            userId,
            propertyId,
            amount,
            userData?.email || 'unknown',
            propertyData?.title || 'Unknown Property',
            sellerEmail
          );
          
          return { success: true, data: originalData };
        }
      } else {
        console.log('Payment saved with formatted ID:', data);
        
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
          .eq('id', validPropertyId)
          .single();
          
        // Fetch seller email if property data exists
        let sellerEmail = 'unknown';
        if (propertyData) {
          const { data: sellerData } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', propertyData.user_id)
            .single();
            
          if (sellerData) {
            sellerEmail = sellerData.email;
          }
        }
        
        // Send email notification
        await sendPaymentNotificationEmail(
          userId,
          validPropertyId,
          amount,
          userData?.email || 'unknown',
          propertyData?.title || 'Unknown Property',
          sellerEmail
        );
        
        return { success: true, data };
      }
    } catch (dbError) {
      // In case of any database error, fallback to local storage
      console.log('Database error, using local storage fallback:', dbError);
      savePaymentLocally(userId, propertyId, amount);
      return { success: true, local: true };
    }
  } catch (error: any) {
    console.error('Payment error:', error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
};


// Utility functions for payment processing

// Convert numeric propertyId to valid UUID format
export const formatPropertyIdToUuid = (propertyId: string): string => {
  try {
    // If it already has hyphens or is a valid UUID, return as is
    if (propertyId.includes('-')) {
      return propertyId;
    }
    
    // Pad with zeros and format properly as UUID
    const paddedId = propertyId.padStart(32, '0');
    return `${paddedId.slice(0, 8)}-${paddedId.slice(8, 12)}-${paddedId.slice(12, 16)}-${paddedId.slice(16, 20)}-${paddedId.slice(20)}`;
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
        // If there's an error with formatted ID, try with original ID
        console.log('Error with formatted ID, trying with original:', error);
        
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
          return { success: true, data: originalData };
        }
      } else {
        console.log('Payment saved with formatted ID:', data);
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

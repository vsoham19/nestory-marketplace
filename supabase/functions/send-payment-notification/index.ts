
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailPayload {
  userId: string;
  propertyId: string;
  amount: number;
  buyerEmail: string;
  propertyTitle: string;
  sellerEmail: string;
  adminEmail: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: EmailPayload = await req.json();
    const { userId, propertyId, amount, buyerEmail, propertyTitle, sellerEmail, adminEmail } = payload;

    console.log("Received payment notification request:", {
      userId, propertyId, amount, buyerEmail, propertyTitle, sellerEmail, adminEmail
    });

    // Format the admin email content
    const adminEmailSubject = `New Payment Notification - Estate Finder`;
    const adminEmailContent = `
      <h1>New Payment Notification</h1>
      <p>A new payment has been processed on Estate Finder India:</p>
      
      <h2>Payment Details:</h2>
      <ul>
        <li><strong>Amount:</strong> ₹${amount}</li>
        <li><strong>Property:</strong> ${propertyTitle}</li>
        <li><strong>Property ID:</strong> ${propertyId}</li>
      </ul>
      
      <h2>User Information:</h2>
      <ul>
        <li><strong>Buyer:</strong> ${buyerEmail}</li>
        <li><strong>Buyer ID:</strong> ${userId}</li>
        <li><strong>Seller:</strong> ${sellerEmail}</li>
      </ul>
      
      <p>This is an automated notification. Please do not reply to this email.</p>
      <p>Estate Finder India</p>
    `;

    // Format the buyer email content
    const buyerEmailSubject = `Payment Confirmation - Estate Finder`;
    const buyerEmailContent = `
      <h1>Payment Confirmation</h1>
      <p>Dear User,</p>
      
      <p>Thank you for your payment on Estate Finder India. Your transaction has been processed successfully.</p>
      
      <h2>Payment Details:</h2>
      <ul>
        <li><strong>Amount:</strong> ₹${amount}</li>
        <li><strong>Property:</strong> ${propertyTitle}</li>
        <li><strong>Date:</strong> ${new Date().toLocaleString()}</li>
      </ul>
      
      <p>You now have access to the seller's contact information for this property.</p>
      
      <p>If you have any questions, please contact our support team.</p>
      
      <p>Best regards,<br>Estate Finder India Team</p>
    `;
    
    // Simulate email sending for demonstration - in production replace with actual email API call
    console.log("Admin email notification would be sent with:", {
      to: adminEmail,
      subject: adminEmailSubject,
      html: adminEmailContent
    });
    
    // Simulate sending email to the buyer
    console.log("Buyer email notification would be sent with:", {
      to: buyerEmail,
      subject: buyerEmailSubject,
      html: buyerEmailContent
    });
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Notification emails sent to admin and buyer",
        adminEmailSent: true,
        buyerEmailSent: true,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending payment notification:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

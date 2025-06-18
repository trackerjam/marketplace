import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "npm:nodemailer@6.9.12";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SupportRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const data: SupportRequest = await req.json();
    const { name, email, subject, message } = data;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      throw new Error('Missing required fields');
    }

    // Create SMTP client
    const smtp = new SMTPClient({
      host: Deno.env.get('SMTP_HOST') || 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: Deno.env.get('SMTP_USER'),
        pass: Deno.env.get('SMTP_PASS'),
      },
    });

    // Send email to support
    await smtp.sendMail({
      from: `"${name}" <${email}>`,
      to: 'hi@trackerjam.com',
      subject: `Support Request: ${subject}`,
      html: `
        <h2>New Support Request</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // Send confirmation email to user
    await smtp.sendMail({
      from: '"Trackerjam Support" <hi@trackerjam.com>',
      to: email,
      subject: 'We received your support request',
      html: `
        <h2>Thank you for contacting Trackerjam Support</h2>
        <p>Hi ${name},</p>
        <p>We've received your support request and will get back to you as soon as possible.</p>
        <p>For reference, here's a copy of your message:</p>
        <hr>
        <p><strong>Subject:</strong> ${subject}</p>
        <p>${message}</p>
        <hr>
        <p>Best regards,<br>The Trackerjam Team</p>
      `,
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Support request received successfully'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error processing support request:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to process support request'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      }
    );
  }
});
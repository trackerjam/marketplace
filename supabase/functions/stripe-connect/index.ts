import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import Stripe from "npm:stripe@14.18.0";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();
    const origin = req.headers.get('origin') || 'http://localhost:5173';

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_connect_id, email, username')
      .eq('id', user_id)
      .single();

    if (!profile) {
      throw new Error('User profile not found');
    }

    let accountId = profile.stripe_connect_id;

    // If user doesn't have a Stripe account, create one
    if (!accountId) {
      console.log('Creating new Stripe Connect account for user:', user_id);
      
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: profile.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        settings: {
          payouts: {
            schedule: {
              interval: 'daily',
            },
          },
        },
      });

      accountId = account.id;

      // Save the account ID to the user's profile
      await supabase
        .from('profiles')
        .update({ stripe_connect_id: accountId })
        .eq('id', user_id);

      console.log('Created Stripe account:', accountId);
    }

    // Create account link for Stripe Connect onboarding
    console.log('Creating account link for:', accountId);
    
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/profile?stripe_refresh=true`,
      return_url: `${origin}/profile?stripe_success=true`,
      type: 'account_onboarding',
    });

    console.log('Account link created:', accountLink.url);

    return new Response(
      JSON.stringify({ 
        url: accountLink.url,
        account_id: accountId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Stripe Connect error:', error);
    
    // Provide specific error messages based on the error type
    let errorMessage = 'Failed to create Stripe Connect account';
    
    if (error.code === 'account_invalid') {
      errorMessage = 'Invalid Stripe account. Please try again.';
    } else if (error.code === 'country_not_supported') {
      errorMessage = 'Your country is not currently supported for payments.';
    } else if (error.message?.includes('Connect')) {
      errorMessage = 'Stripe Connect is not properly configured. Please contact support.';
    } else if (error.message?.includes('email')) {
      errorMessage = 'Please ensure your profile has a valid email address.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        code: error.code || 'unknown_error'
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
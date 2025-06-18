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
    const { amount, job_id, freelancer_id } = await req.json();

    // Get freelancer's Stripe Connect account
    const { data: freelancer } = await supabase
      .from('profiles')
      .select('stripe_connect_id')
      .eq('id', freelancer_id)
      .single();

    if (!freelancer?.stripe_connect_id) {
      throw new Error('Freelancer has not connected their Stripe account');
    }

    // Calculate platform fee (5%)
    const platformFee = Math.round(amount * 0.05);

    // Create payment intent with delayed capture for escrow
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      capture_method: 'manual', // This enables escrow functionality
      application_fee_amount: platformFee,
      transfer_data: {
        destination: freelancer.stripe_connect_id,
      },
      metadata: {
        job_id,
        freelancer_id,
      },
    });

    // Create payment record in database
    await supabase
      .from('payments')
      .insert({
        job_id,
        freelancer_id,
        business_id: (await supabase.from('jobs').select('business_id').eq('id', job_id).single()).data?.business_id,
        amount: amount / 100,
        platform_fee: platformFee / 100,
        status: 'pending',
        stripe_payment_intent_id: paymentIntent.id,
      });

    return new Response(
      JSON.stringify({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
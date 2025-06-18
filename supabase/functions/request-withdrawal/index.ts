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
    const { amount } = await req.json();
    
    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    // Get user's Stripe Connect account
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_connect_id')
      .eq('id', user.id)
      .single();

    if (!profile?.stripe_connect_id) {
      throw new Error('No Stripe account connected');
    }

    // Check available balance
    const { data: completedPayments } = await supabase
      .from('payments')
      .select('amount, platform_fee')
      .eq('freelancer_id', user.id)
      .eq('status', 'completed');

    const totalEarnings = completedPayments?.reduce((sum, payment) => 
      sum + (payment.amount - payment.platform_fee), 0) || 0;

    // Get previous withdrawals
    const { data: withdrawals } = await supabase
      .from('withdrawals')
      .select('amount')
      .eq('freelancer_id', user.id)
      .eq('status', 'completed');

    const totalWithdrawn = withdrawals?.reduce((sum, w) => sum + w.amount, 0) || 0;
    const availableBalance = totalEarnings - totalWithdrawn;

    if (amount > availableBalance) {
      throw new Error('Insufficient balance');
    }

    // Create transfer to freelancer's Stripe account
    const transfer = await stripe.transfers.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      destination: profile.stripe_connect_id,
    });

    // Record withdrawal in database
    await supabase
      .from('withdrawals')
      .insert({
        freelancer_id: user.id,
        amount,
        status: 'completed',
        stripe_transfer_id: transfer.id,
      });

    return new Response(
      JSON.stringify({ 
        success: true,
        transfer_id: transfer.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
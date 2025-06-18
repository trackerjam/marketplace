import { loadStripe } from '@stripe/stripe-js';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (!stripePublicKey) {
  console.warn('Stripe public key not found. Payment features will be disabled.');
}

export const stripe = stripePublicKey ? loadStripe(stripePublicKey) : null;

// Create Stripe Connect account for freelancers
export async function createStripeConnectAccount(userId: string) {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-connect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ user_id: userId }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data;
}

// Create payment intent for job completion
export async function createPaymentIntent(amount: number, jobId: string, freelancerId: string) {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100), // Convert to cents
      job_id: jobId,
      freelancer_id: freelancerId,
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data;
}

// Process escrow payment (delayed charge)
export async function processEscrowPayment(jobId: string, amount: number) {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-escrow-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      job_id: jobId,
      amount: Math.round(amount * 100),
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data;
}

// Release escrow payment to freelancer
export async function releaseEscrowPayment(paymentId: string) {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/release-escrow-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ payment_id: paymentId }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data;
}

// Request withdrawal to Stripe Connect account
export async function requestWithdrawal(amount: number) {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/request-withdrawal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100),
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data;
}
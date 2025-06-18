import React, { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripe } from '../lib/stripe';
import { CreditCard, Lock, Shield } from 'lucide-react';

interface CheckoutFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function CheckoutForm({ amount, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message ?? 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (err) {
      onError('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#f8f9fa] rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-[#0463fb]" />
          <h3 className="font-medium text-[#1a1a1a]">Secure Escrow Payment</h3>
        </div>
        <p className="text-sm text-[#666666]">
          Your payment will be held securely until the work is completed and approved. 
          You have 48 hours to review the work before payment is released.
        </p>
      </div>

      <PaymentElement />
      
      <div className="bg-white border border-[#e5e5e5] rounded-lg p-4">
        <h4 className="font-medium text-[#1a1a1a] mb-2">Payment Breakdown</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#666666]">Project Amount:</span>
            <span className="font-medium">${(amount / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#666666]">Platform Fee (5%):</span>
            <span className="font-medium">${((amount * 0.05) / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-[#e5e5e5] pt-2">
            <span className="font-medium text-[#1a1a1a]">Total:</span>
            <span className="font-medium text-[#1a1a1a]">${(amount / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full btn-primary flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Secure Payment - ${(amount / 100).toFixed(2)}
          </>
        )}
      </button>
    </form>
  );
}

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function PaymentForm({ clientSecret, amount, onSuccess, onError }: PaymentFormProps) {
  if (!stripe) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Payment system is not available. Please contact support.</p>
      </div>
    );
  }

  return (
    <Elements 
      stripe={stripe} 
      options={{ 
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#0463fb',
          },
        },
      }}
    >
      <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}
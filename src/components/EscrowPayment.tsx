import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { createPaymentIntent, releaseEscrowPayment } from '../lib/stripe';
import PaymentForm from './PaymentForm';
import { Clock, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface EscrowPaymentProps {
  jobId: string;
  amount: number;
  freelancerId: string;
  businessId: string;
}

export default function EscrowPayment({ jobId, amount, freelancerId, businessId }: EscrowPaymentProps) {
  const queryClient = useQueryClient();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get existing payment for this job
  const { data: payment } = useQuery({
    queryKey: ['escrow-payment', jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('job_id', jobId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  // Create payment intent
  const createPayment = useMutation({
    mutationFn: async () => {
      const response = await createPaymentIntent(amount, jobId, freelancerId);
      return response;
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      setShowPaymentForm(true);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to create payment');
    },
  });

  // Release escrow payment
  const releasePayment = useMutation({
    mutationFn: async () => {
      if (!payment) throw new Error('No payment found');
      return await releaseEscrowPayment(payment.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escrow-payment', jobId] });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to release payment');
    },
  });

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    setClientSecret(null);
    queryClient.invalidateQueries({ queryKey: ['escrow-payment', jobId] });
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  // Calculate platform fee
  const platformFee = amount * 0.05;
  const freelancerAmount = amount - platformFee;

  if (payment) {
    return (
      <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            payment.status === 'completed' ? 'bg-green-100' : 
            payment.status === 'pending' ? 'bg-yellow-100' : 'bg-gray-100'
          }`}>
            {payment.status === 'completed' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : payment.status === 'pending' ? (
              <Clock className="w-5 h-5 text-yellow-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-gray-600" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-[#1a1a1a]">
              Escrow Payment - {payment.status === 'completed' ? 'Completed' : 'Pending'}
            </h3>
            <p className="text-sm text-[#666666]">
              Created {format(new Date(payment.created_at), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-[#666666]">Project Amount:</span>
            <span className="font-medium">${payment.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#666666]">Platform Fee (5%):</span>
            <span className="font-medium">${payment.platform_fee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-[#e5e5e5] pt-2">
            <span className="text-[#666666]">Freelancer Receives:</span>
            <span className="font-medium">${(payment.amount - payment.platform_fee).toFixed(2)}</span>
          </div>
        </div>

        {payment.status === 'pending' && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium mb-1">Payment in Escrow</p>
                  <p>
                    The payment is being held securely. You have 48 hours to review the work 
                    and approve the payment release.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => releasePayment.mutate()}
              disabled={releasePayment.isPending}
              className="w-full btn-primary"
            >
              {releasePayment.isPending ? 'Releasing Payment...' : 'Approve & Release Payment'}
            </button>
          </div>
        )}

        {payment.status === 'completed' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div className="text-sm text-green-700">
                <p className="font-medium mb-1">Payment Released</p>
                <p>
                  The payment has been successfully released to the freelancer's account.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (showPaymentForm && clientSecret) {
    return (
      <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
        <h3 className="text-lg font-medium text-[#1a1a1a] mb-6">Complete Payment</h3>
        <PaymentForm
          clientSecret={clientSecret}
          amount={amount * 100} // Convert to cents
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#f0f4ff] w-10 h-10 rounded-lg flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-[#0463fb]" />
        </div>
        <div>
          <h3 className="font-medium text-[#1a1a1a]">Project Payment</h3>
          <p className="text-sm text-[#666666]">Secure escrow payment for this project</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-[#666666]">Project Amount:</span>
          <span className="font-medium">${amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#666666]">Platform Fee (5%):</span>
          <span className="font-medium">${platformFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-[#e5e5e5] pt-2">
          <span className="text-[#666666]">Freelancer Receives:</span>
          <span className="font-medium">${freelancerAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">How Escrow Works</p>
            <ul className="space-y-1 text-xs">
              <li>• Your payment is held securely until work is completed</li>
              <li>• You have 48 hours to review and approve the work</li>
              <li>• Payment is automatically released to the freelancer after approval</li>
              <li>• Disputes can be raised within the review period</li>
            </ul>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={() => createPayment.mutate()}
        disabled={createPayment.isPending}
        className="w-full btn-primary"
      >
        {createPayment.isPending ? 'Setting up Payment...' : 'Pay with Escrow'}
      </button>
    </div>
  );
}
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { requestWithdrawal } from '../lib/stripe';
import { DollarSign, ArrowRight, AlertCircle } from 'lucide-react';

interface WithdrawalFormProps {
  availableBalance: number;
  onSuccess: () => void;
}

interface WithdrawalForm {
  amount: number;
}

export default function WithdrawalForm({ availableBalance, onSuccess }: WithdrawalFormProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<WithdrawalForm>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const amount = watch('amount');

  const onSubmit = async (data: WithdrawalForm) => {
    setIsLoading(true);
    setError(null);

    try {
      await requestWithdrawal(data.amount);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process withdrawal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#f0f4ff] w-10 h-10 rounded-lg flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-[#0463fb]" />
        </div>
        <div>
          <h3 className="font-medium text-[#1a1a1a]">Withdraw Earnings</h3>
          <p className="text-sm text-[#666666]">
            Available balance: ${availableBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {availableBalance <= 0 ? (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-[#666666]">No funds available for withdrawal</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-[#1a1a1a] mb-1">
              Withdrawal Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              step="0.01"
              max={availableBalance}
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 1, message: 'Minimum withdrawal is $1' },
                max: { value: availableBalance, message: 'Amount exceeds available balance' },
              })}
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          {amount && amount > 0 && (
            <div className="bg-[#f8f9fa] rounded-lg p-4">
              <h4 className="font-medium text-[#1a1a1a] mb-2">Withdrawal Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#666666]">Withdrawal Amount:</span>
                  <span className="font-medium">${amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Processing Time:</span>
                  <span className="font-medium">1-2 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Remaining Balance:</span>
                  <span className="font-medium">${(availableBalance - amount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !amount || amount <= 0}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Request Withdrawal
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Withdrawal Information</p>
                <ul className="space-y-1 text-xs">
                  <li>• Funds will be transferred to your connected Stripe account</li>
                  <li>• Processing typically takes 1-2 business days</li>
                  <li>• You'll receive an email confirmation once processed</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
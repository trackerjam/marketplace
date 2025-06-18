import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { DollarSign, ArrowUpRight, ArrowDownRight, Clock, Download, CreditCard } from 'lucide-react';
import StripeConnect from '../components/StripeConnect';
import WithdrawalForm from '../components/WithdrawalForm';

type Payment = {
  id: string;
  created_at: string;
  amount: number;
  status: string;
  platform_fee: number;
  job: {
    title: string;
  };
  freelancer: {
    username: string;
  };
  business: {
    username: string;
  };
};

type Withdrawal = {
  id: string;
  created_at: string;
  amount: number;
  status: string;
};

export default function Payments() {
  const { user } = useAuth();
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: payments } = useQuery({
    queryKey: ['payments', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          job:jobs(title),
          freelancer:profiles!payments_freelancer_id_fkey(username),
          business:profiles!payments_business_id_fkey(username)
        `)
        .or(`freelancer_id.eq.${user?.id},business_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Payment[];
    },
    enabled: !!user,
  });

  const { data: withdrawals, refetch: refetchWithdrawals } = useQuery({
    queryKey: ['withdrawals', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('freelancer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Withdrawal[];
    },
    enabled: !!user && profile?.user_type === 'freelancer',
  });

  // Calculate earnings and balances
  const completedPayments = payments?.filter(p => 
    p.status === 'completed' && p.freelancer?.username
  ) || [];
  
  const totalEarnings = completedPayments.reduce((sum, payment) => 
    sum + (payment.amount - payment.platform_fee), 0
  );

  const totalWithdrawn = withdrawals?.reduce((sum, w) => 
    w.status === 'completed' ? sum + w.amount : sum, 0
  ) || 0;

  const availableBalance = totalEarnings - totalWithdrawn;

  const pendingPayments = payments?.filter(p => p.status === 'pending') || [];
  const pendingAmount = pendingPayments.reduce((sum, payment) => 
    sum + (profile?.user_type === 'freelancer' ? payment.amount - payment.platform_fee : payment.amount), 0
  );

  const totalPlatformFees = completedPayments.reduce((sum, payment) => 
    sum + payment.platform_fee, 0
  );

  const isFreelancer = profile?.user_type === 'freelancer';
  const hasStripeAccount = !!profile?.stripe_connect_id;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Payments</h1>
        {isFreelancer && hasStripeAccount && (
          <button
            onClick={() => setShowWithdrawalForm(!showWithdrawalForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Withdraw Funds
          </button>
        )}
      </div>

      {/* Stripe Connect Setup for Freelancers */}
      {isFreelancer && !hasStripeAccount && (
        <div className="mb-8">
          <StripeConnect 
            isConnected={hasStripeAccount}
            accountId={profile?.stripe_connect_id}
          />
        </div>
      )}

      {/* Withdrawal Form */}
      {isFreelancer && showWithdrawalForm && hasStripeAccount && (
        <div className="mb-8">
          <WithdrawalForm
            availableBalance={availableBalance}
            onSuccess={() => {
              setShowWithdrawalForm(false);
              refetchWithdrawals();
            }}
          />
        </div>
      )}

      {/* Payment Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-[#666666] mb-1">
                {isFreelancer ? 'Total Earnings' : 'Total Spent'}
              </p>
              <h3 className="text-2xl font-semibold text-[#1a1a1a]">
                ${isFreelancer ? totalEarnings.toFixed(2) : completedPayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
              </h3>
            </div>
            <div className="bg-[#f0f4ff] w-10 h-10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#0463fb]" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <ArrowUpRight className="w-4 h-4" />
            <span>From {completedPayments.length} completed projects</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-[#666666] mb-1">
                {isFreelancer ? 'Available Balance' : 'Pending Payments'}
              </p>
              <h3 className="text-2xl font-semibold text-[#1a1a1a]">
                ${isFreelancer ? availableBalance.toFixed(2) : pendingAmount.toFixed(2)}
              </h3>
            </div>
            <div className="bg-[#f0f4ff] w-10 h-10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#0463fb]" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-[#666666]">
            <span>
              {isFreelancer 
                ? `$${totalWithdrawn.toFixed(2)} withdrawn`
                : `${pendingPayments.length} payments pending`
              }
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-[#666666] mb-1">Platform Fees</p>
              <h3 className="text-2xl font-semibold text-[#1a1a1a]">
                ${totalPlatformFees.toFixed(2)}
              </h3>
            </div>
            <div className="bg-[#f0f4ff] w-10 h-10 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#0463fb]" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-[#666666]">
            <span>5% platform fee</span>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden mb-8">
        <div className="p-6 border-b border-[#e5e5e5]">
          <h2 className="text-lg font-medium text-[#1a1a1a]">Payment History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Project</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">
                  {isFreelancer ? 'Client' : 'Freelancer'}
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Fee</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Net</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {payments?.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-[#1a1a1a]">
                    {format(new Date(payment.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#1a1a1a] max-w-xs truncate">
                    {payment.job?.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#1a1a1a]">
                    {isFreelancer 
                      ? payment.business?.username 
                      : payment.freelancer?.username}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[#1a1a1a]">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#666666]">
                    ${payment.platform_fee.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[#1a1a1a]">
                    ${(payment.amount - (isFreelancer ? payment.platform_fee : 0)).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      payment.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal History for Freelancers */}
      {isFreelancer && withdrawals && withdrawals.length > 0 && (
        <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
          <div className="p-6 border-b border-[#e5e5e5]">
            <h2 className="text-lg font-medium text-[#1a1a1a]">Withdrawal History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e5]">
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-[#1a1a1a]">
                      {format(new Date(withdrawal.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#1a1a1a]">
                      ${withdrawal.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        withdrawal.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {withdrawal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
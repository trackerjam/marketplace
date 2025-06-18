import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createStripeConnectAccount } from '../lib/stripe';
import { ExternalLink, CreditCard, Shield, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

interface StripeConnectProps {
  onConnect?: () => void;
  isConnected?: boolean;
  accountId?: string;
}

export default function StripeConnect({ onConnect, isConnected, accountId }: StripeConnectProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Check for success/refresh parameters in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const stripeSuccess = urlParams.get('stripe_success');
    const stripeRefresh = urlParams.get('stripe_refresh');

    if (stripeSuccess === 'true') {
      setShowSuccess(true);
      if (onConnect) onConnect();
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } else if (stripeRefresh === 'true') {
      setError('Setup was interrupted. Please try again to complete your Stripe account setup.');
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [onConnect]);

  const handleConnect = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Initiating Stripe Connect for user:', user.id);
      const { url } = await createStripeConnectAccount(user.id);
      console.log('Redirecting to Stripe onboarding:', url);
      
      // Redirect to Stripe's secure onboarding flow
      window.location.href = url;
    } catch (err) {
      console.error('Stripe Connect error:', err);
      setIsLoading(false);
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect Stripe account';
      
      // Provide helpful error messages
      if (errorMessage.includes('Connect') || errorMessage.includes('configured')) {
        setError('Stripe Connect setup is required. This appears to be a configuration issue. Please contact support for assistance.');
      } else if (errorMessage.includes('country')) {
        setError('Your country may not be supported for Stripe payments. Please contact support.');
      } else if (errorMessage.includes('email')) {
        setError('Please ensure your profile has a valid email address before connecting to Stripe.');
      } else {
        setError(errorMessage);
      }
    }
  };

  if (showSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-green-800 mb-2">Stripe Account Connected Successfully!</h3>
            <p className="text-sm text-green-700 mb-4">
              Your Stripe account has been connected and you're now ready to receive payments. 
              You can start accepting jobs and receiving payments directly to your bank account.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <CreditCard className="w-4 h-4" />
                <span>Ready to receive payments</span>
              </div>
              <a
                href="https://dashboard.stripe.com/express"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-green-600 hover:text-green-700"
              >
                <ExternalLink className="w-4 h-4" />
                Manage Account
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-green-800 mb-2">Stripe Account Connected</h3>
            <p className="text-sm text-green-700 mb-4">
              Your Stripe account is connected and ready to receive payments. You can now accept jobs and receive payments directly to your bank account.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <CreditCard className="w-4 h-4" />
                <span>Account ID: {accountId?.slice(-8)}</span>
              </div>
              <a
                href="https://dashboard.stripe.com/express"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-green-600 hover:text-green-700"
              >
                <ExternalLink className="w-4 h-4" />
                Manage Account
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e5e5e5] rounded-lg p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-[#0463fb]" />
        </div>
        <div>
          <h3 className="font-medium text-[#1a1a1a] mb-2">Connect Your Stripe Account</h3>
          <p className="text-[#666666] text-sm">
            Connect your Stripe account to receive payments directly to your bank account. 
            You'll be redirected to Stripe's secure platform to complete the setup.
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-[#f0f4ff] flex items-center justify-center">
            <Shield className="w-3 h-3 text-[#0463fb]" />
          </div>
          <span className="text-sm text-[#666666]">Secure payment processing by Stripe</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-[#f0f4ff] flex items-center justify-center">
            <DollarSign className="w-3 h-3 text-[#0463fb]" />
          </div>
          <span className="text-sm text-[#666666]">Direct bank transfers</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-[#f0f4ff] flex items-center justify-center">
            <CreditCard className="w-3 h-3 text-[#0463fb]" />
          </div>
          <span className="text-sm text-[#666666]">Industry-standard security</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-600 text-sm font-medium mb-1">Connection Failed</p>
              <p className="text-red-600 text-sm">{error}</p>
              {error.includes('configuration') && (
                <div className="mt-2 text-xs text-red-500">
                  <p>This may be a demo environment limitation. In production, ensure:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Stripe Connect is enabled in your Stripe dashboard</li>
                    <li>Your Stripe account is verified</li>
                    <li>All required business information is provided</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleConnect}
        disabled={isLoading}
        className="w-full btn-primary flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Redirecting to Stripe...
          </>
        ) : (
          <>
            <ExternalLink className="w-4 h-4" />
            Connect with Stripe
          </>
        )}
      </button>

      <p className="text-xs text-[#666666] mt-3 text-center">
        You'll be redirected to Stripe's secure platform to complete the account setup process.
      </p>
    </div>
  );
}
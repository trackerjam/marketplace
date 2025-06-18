import React from 'react';
import { Check, DollarSign, CreditCard, Clock, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold text-[#1a1a1a] mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg text-[#666666] max-w-2xl mx-auto">
          No hidden fees, no monthly charges. Just a simple 5% fee on completed projects.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border border-[#e5e5e5] p-8 mb-12">
          <div className="flex items-start gap-4 mb-8">
            <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#2d7ff9]" />
            </div>
            <div>
              <h2 className="text-2xl font-medium text-[#1a1a1a] mb-2">5% Project Fee</h2>
              <p className="text-[#666666]">
                We only charge a 5% fee when a project is successfully completed. No other fees or charges.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-[#1a1a1a] mb-4">What's Free:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-[#666666]">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Posting unlimited jobs</span>
                </li>
                <li className="flex items-center gap-2 text-[#666666]">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Submitting proposals</span>
                </li>
                <li className="flex items-center gap-2 text-[#666666]">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Account creation</span>
                </li>
                <li className="flex items-center gap-2 text-[#666666]">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Productivity tracking</span>
                </li>
                <li className="flex items-center gap-2 text-[#666666]">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>24/7 Support</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-[#1a1a1a] mb-4">Example:</h3>
              <div className="bg-[#f8f9fa] rounded-lg p-4">
                <p className="text-[#666666] mb-2">For a $1,000 project:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Project Amount:</span>
                    <span className="font-medium">$1,000</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Platform Fee (5%):</span>
                    <span className="font-medium">$50</span>
                  </li>
                  <li className="flex justify-between border-t border-[#e5e5e5] pt-2 mt-2">
                    <span>Freelancer Receives:</span>
                    <span className="font-medium">$950</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
            <div className="flex items-start gap-4">
              <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#2d7ff9]" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Simple Payments</h3>
                <p className="text-[#666666] text-sm mb-4">
                  No escrow needed. Secure card payments with 48-hour protection period.
                </p>
                <Link to="/docs/payments" className="text-[#2d7ff9] text-sm font-medium hover:text-[#0355d5]">
                  Learn more →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
            <div className="flex items-start gap-4">
              <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#2d7ff9]" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Productivity Tools</h3>
                <p className="text-[#666666] text-sm mb-4">
                  Built-in time tracking and productivity analytics at no extra cost.
                </p>
                <Link to="/docs/analytics" className="text-[#2d7ff9] text-sm font-medium hover:text-[#0355d5]">
                  Learn more →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
            <div className="flex items-start gap-4">
              <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#2d7ff9]" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Buyer Protection</h3>
                <p className="text-[#666666] text-sm mb-4">
                  48-hour review period and dispute resolution included.
                </p>
                <Link to="/docs/security" className="text-[#2d7ff9] text-sm font-medium hover:text-[#0355d5]">
                  Learn more →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-xl font-medium text-[#1a1a1a] mb-4">Ready to get started?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="btn-primary">
              Create Free Account
            </Link>
            <Link to="/docs" className="btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Check, X, DollarSign, BarChart, Shield, Clock, Users, Zap } from 'lucide-react';

const competitors = [
  {
    name: 'Freelance Marketplace by Trackerjam',
    logo: 'TJ',
    isUs: true,
    fees: '5%',
    timeTracking: 'Built-in productivity analytics',
    paymentProtection: '48-hour review period',
    disputeResolution: 'Free & fast',
    freelancerVerification: 'Skills-based verification',
    clientSupport: '24/7 support',
    features: [
      'Built-in productivity tracking',
      'Transparent time analytics',
      'Simple 5% fee structure',
      'No monthly fees',
      'Free job posting',
      'Free proposal submission',
      '48-hour payment protection',
      'Direct bank transfers',
      'Skills-based matching',
      'Real-time progress monitoring'
    ]
  },
  {
    name: 'Upwork',
    logo: 'UW',
    isUs: false,
    fees: '5-20%',
    timeTracking: 'Basic time tracker',
    paymentProtection: 'Escrow system',
    disputeResolution: 'Mediation fees apply',
    freelancerVerification: 'Profile verification',
    clientSupport: 'Business hours only',
    features: [
      'Time tracking available',
      'Escrow protection',
      'Large talent pool',
      'Enterprise solutions',
      'Video calls',
      'File sharing'
    ]
  },
  {
    name: 'Fiverr',
    logo: 'FV',
    isUs: false,
    fees: '5.5% + processing',
    timeTracking: 'Not available',
    paymentProtection: 'Limited protection',
    disputeResolution: 'Resolution center',
    freelancerVerification: 'Basic verification',
    clientSupport: 'Ticket system',
    features: [
      'Package-based pricing',
      'Quick turnaround',
      'Creative services focus',
      'Seller levels',
      'Custom offers',
      'Buyer requests'
    ]
  },
  {
    name: 'Freelancer.com',
    logo: 'FL',
    isUs: false,
    fees: '10% or $5 minimum',
    timeTracking: 'Third-party integrations',
    paymentProtection: 'Milestone payments',
    disputeResolution: 'Dispute fees',
    freelancerVerification: 'ID verification',
    clientSupport: 'Email support',
    features: [
      'Contest platform',
      'Milestone payments',
      'Large user base',
      'Mobile app',
      'Local freelancers',
      'Exam system'
    ]
  }
];

const comparisonPoints = [
  {
    feature: 'Platform Fee',
    trackerjam: '5% flat rate',
    upwork: '5-20% sliding scale',
    fiverr: '5.5% + processing fees',
    freelancer: '10% or $5 minimum',
    winner: 'trackerjam'
  },
  {
    feature: 'Time Tracking',
    trackerjam: 'Built-in productivity analytics',
    upwork: 'Basic time tracker',
    fiverr: 'Not available',
    freelancer: 'Third-party only',
    winner: 'trackerjam'
  },
  {
    feature: 'Payment Speed',
    trackerjam: '24 hours after approval',
    upwork: '5-10 business days',
    fiverr: '14 days after completion',
    freelancer: '3-15 business days',
    winner: 'trackerjam'
  },
  {
    feature: 'Job Posting',
    trackerjam: 'Free unlimited',
    upwork: 'Free with limits',
    fiverr: 'Buyer requests only',
    freelancer: 'Free with limits',
    winner: 'trackerjam'
  },
  {
    feature: 'Proposal Submission',
    trackerjam: 'Free unlimited',
    upwork: 'Connects system (paid)',
    fiverr: 'Seller offers only',
    freelancer: 'Bid limits apply',
    winner: 'trackerjam'
  },
  {
    feature: 'Monthly Fees',
    trackerjam: 'None',
    upwork: 'Freelancer Plus available',
    fiverr: 'Seller Plus available',
    freelancer: 'Membership options',
    winner: 'trackerjam'
  }
];

export default function Comparison() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold text-[#1a1a1a] mb-4">
          Why Choose Freelance Marketplace by Trackerjam?
        </h1>
        <p className="text-lg text-[#666666] max-w-3xl mx-auto">
          Compare our transparent pricing, built-in productivity tracking, and freelancer-friendly 
          features with other major platforms.
        </p>
      </div>

      {/* Key Advantages */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6 text-center">
          <div className="bg-[#f0f4ff] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-[#0463fb]" />
          </div>
          <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Lowest Fees</h3>
          <p className="text-[#666666] text-sm mb-4">
            Just 5% flat rate with no hidden fees, monthly charges, or complex pricing tiers.
          </p>
          <div className="text-2xl font-semibold text-[#0463fb]">5%</div>
          <div className="text-sm text-[#666666]">vs 5-20% elsewhere</div>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6 text-center">
          <div className="bg-[#f0f4ff] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart className="w-8 h-8 text-[#0463fb]" />
          </div>
          <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Built-in Analytics</h3>
          <p className="text-[#666666] text-sm mb-4">
            Advanced productivity tracking and analytics built into the platform at no extra cost.
          </p>
          <div className="text-2xl font-semibold text-[#0463fb]">Included</div>
          <div className="text-sm text-[#666666]">vs paid add-ons elsewhere</div>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6 text-center">
          <div className="bg-[#f0f4ff] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-[#0463fb]" />
          </div>
          <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Faster Payments</h3>
          <p className="text-[#666666] text-sm mb-4">
            Get paid within 24 hours of work approval, not weeks like other platforms.
          </p>
          <div className="text-2xl font-semibold text-[#0463fb]">24hrs</div>
          <div className="text-sm text-[#666666]">vs 5-14 days elsewhere</div>
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden mb-16">
        <div className="p-6 border-b border-[#e5e5e5]">
          <h2 className="text-xl font-medium text-[#1a1a1a]">Feature Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-[#666666]">Feature</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#0463fb]">Trackerjam</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#666666]">Upwork</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#666666]">Fiverr</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#666666]">Freelancer.com</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {comparisonPoints.map((point, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-[#1a1a1a]">{point.feature}</td>
                  <td className={`px-6 py-4 text-sm ${point.winner === 'trackerjam' ? 'text-[#0463fb] font-medium' : 'text-[#666666]'}`}>
                    <div className="flex items-center gap-2">
                      {point.winner === 'trackerjam' && <Check className="w-4 h-4 text-green-500" />}
                      {point.trackerjam}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#666666]">{point.upwork}</td>
                  <td className="px-6 py-4 text-sm text-[#666666]">{point.fiverr}</td>
                  <td className="px-6 py-4 text-sm text-[#666666]">{point.freelancer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Cards */}
      <div className="grid lg:grid-cols-2 gap-8 mb-16">
        {competitors.map((platform, index) => (
          <div 
            key={index} 
            className={`rounded-lg border p-6 ${
              platform.isUs 
                ? 'border-[#0463fb] bg-[#f0f4ff]' 
                : 'border-[#e5e5e5] bg-white'
            }`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-semibold ${
                platform.isUs 
                  ? 'bg-[#0463fb] text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {platform.logo}
              </div>
              <div>
                <h3 className={`text-lg font-medium ${platform.isUs ? 'text-[#0463fb]' : 'text-[#1a1a1a]'}`}>
                  {platform.name}
                </h3>
                {platform.isUs && (
                  <span className="text-sm text-[#0463fb] font-medium">Recommended</span>
                )}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#666666]">Platform Fee:</span>
                <span className={`font-medium ${platform.isUs ? 'text-[#0463fb]' : 'text-[#1a1a1a]'}`}>
                  {platform.fees}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#666666]">Time Tracking:</span>
                <span className="text-sm text-[#1a1a1a]">{platform.timeTracking}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#666666]">Payment Protection:</span>
                <span className="text-sm text-[#1a1a1a]">{platform.paymentProtection}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-[#1a1a1a] text-sm">Key Features:</h4>
              <div className="grid grid-cols-1 gap-1">
                {platform.features.slice(0, 6).map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2 text-sm">
                    <Check className={`w-3 h-3 ${platform.isUs ? 'text-[#0463fb]' : 'text-green-500'}`} />
                    <span className="text-[#666666]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cost Savings Calculator */}
      <div className="bg-white rounded-lg border border-[#e5e5e5] p-8 mb-16">
        <h2 className="text-xl font-medium text-[#1a1a1a] mb-6">See Your Savings</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-semibold text-[#1a1a1a] mb-2">$1,000</div>
            <div className="text-sm text-[#666666] mb-4">Project Value</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Trackerjam (5%):</span>
                <span className="font-medium text-[#0463fb]">$50</span>
              </div>
              <div className="flex justify-between">
                <span>Upwork (up to 20%):</span>
                <span className="text-red-600">$200</span>
              </div>
              <div className="flex justify-between">
                <span>Freelancer.com (10%):</span>
                <span className="text-red-600">$100</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-semibold text-[#1a1a1a] mb-2">$5,000</div>
            <div className="text-sm text-[#666666] mb-4">Project Value</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Trackerjam (5%):</span>
                <span className="font-medium text-[#0463fb]">$250</span>
              </div>
              <div className="flex justify-between">
                <span>Upwork (up to 20%):</span>
                <span className="text-red-600">$1,000</span>
              </div>
              <div className="flex justify-between">
                <span>Freelancer.com (10%):</span>
                <span className="text-red-600">$500</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-semibold text-[#1a1a1a] mb-2">$10,000</div>
            <div className="text-sm text-[#666666] mb-4">Project Value</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Trackerjam (5%):</span>
                <span className="font-medium text-[#0463fb]">$500</span>
              </div>
              <div className="flex justify-between">
                <span>Upwork (up to 20%):</span>
                <span className="text-red-600">$2,000</span>
              </div>
              <div className="flex justify-between">
                <span>Freelancer.com (10%):</span>
                <span className="text-red-600">$1,000</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="text-[#666666] mb-4">
            Save hundreds or thousands of dollars in fees while getting better features and faster payments.
          </p>
          <a href="/register" className="btn-primary">
            Start Saving Today
          </a>
        </div>
      </div>

      {/* Why Freelancers Choose Us */}
      <div className="bg-gradient-to-r from-[#f0f4ff] to-white rounded-lg p-8">
        <h2 className="text-xl font-medium text-[#1a1a1a] mb-6">Why Freelancers Choose Trackerjam</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#0463fb] mt-0.5" />
              <div>
                <h3 className="font-medium text-[#1a1a1a] mb-1">Fair & Transparent</h3>
                <p className="text-sm text-[#666666]">
                  No sliding fee scales or hidden charges. Everyone pays the same low 5% rate.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-[#0463fb] mt-0.5" />
              <div>
                <h3 className="font-medium text-[#1a1a1a] mb-1">Get Paid Faster</h3>
                <p className="text-sm text-[#666666]">
                  Receive payments within 24 hours instead of waiting weeks like other platforms.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BarChart className="w-5 h-5 text-[#0463fb] mt-0.5" />
              <div>
                <h3 className="font-medium text-[#1a1a1a] mb-1">Showcase Your Productivity</h3>
                <p className="text-sm text-[#666666]">
                  Built-in analytics help you demonstrate your work quality and efficiency to clients.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-[#0463fb] mt-0.5" />
              <div>
                <h3 className="font-medium text-[#1a1a1a] mb-1">Quality Over Quantity</h3>
                <p className="text-sm text-[#666666]">
                  Focus on meaningful projects with clients who value productivity and transparency.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-[#0463fb] mt-0.5" />
              <div>
                <h3 className="font-medium text-[#1a1a1a] mb-1">Keep More of Your Earnings</h3>
                <p className="text-sm text-[#666666]">
                  Our low 5% fee means you keep 95% of what you earn, not 80-95% like elsewhere.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#0463fb] mt-0.5" />
              <div>
                <h3 className="font-medium text-[#1a1a1a] mb-1">No Time Wasted</h3>
                <p className="text-sm text-[#666666]">
                  Free unlimited proposals and job posts mean you can focus on work, not fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
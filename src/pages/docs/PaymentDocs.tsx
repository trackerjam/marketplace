import React from 'react';
import { CreditCard, ShieldCheck, DollarSign, ArrowRight } from 'lucide-react';

export default function PaymentDocs() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-semibold text-[#1a1a1a] mb-6">Payments & Billing</h1>
        <p className="text-lg text-[#666666] mb-12">
          Learn about our simple, transparent payment system and how we protect both clients and freelancers.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-medium text-[#1a1a1a] mb-6">How Payments Work</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-[#0463fb]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Simple Payment Process</h3>
                    <p className="text-[#666666]">
                      Instead of complicated escrow systems, we use a simple delayed credit card charge system.
                      This means faster payments for freelancers and better protection for clients.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <ArrowRight className="w-5 h-5 text-[#0463fb] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-[#1a1a1a] mb-1">For Clients</h4>
                      <p className="text-[#666666]">Your card is only charged after you approve the work, with a 48-hour window for disputes.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ArrowRight className="w-5 h-5 text-[#0463fb] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-[#1a1a1a] mb-1">For Freelancers</h4>
                      <p className="text-[#666666]">Receive payments within 24 hours of work approval, with just a 5% platform fee.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-[#1a1a1a] mb-6">Fees & Pricing</h2>
            <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#0463fb]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Simple Fee Structure</h3>
                  <p className="text-[#666666]">
                    We keep our fees simple and transparent. There are no hidden charges or monthly fees.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-[#0463fb] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-[#1a1a1a] mb-1">5% Platform Fee</h4>
                    <p className="text-[#666666]">Only charged on successful project completions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-[#0463fb] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-[#1a1a1a] mb-1">Free Features</h4>
                    <p className="text-[#666666]">Job posting, bidding, and productivity tracking are all free.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-[#1a1a1a] mb-6">Payment Protection</h2>
            <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-[#0463fb]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Secure Transactions</h3>
                  <p className="text-[#666666]">
                    Our payment system is designed to protect both parties. Clients have time to review work,
                    and freelancers are guaranteed payment for approved work.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-[#0463fb] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-[#1a1a1a] mb-1">Dispute Resolution</h4>
                    <p className="text-[#666666]">Our support team helps resolve any payment disputes within 48 hours.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-[#0463fb] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-[#1a1a1a] mb-1">Fraud Prevention</h4>
                    <p className="text-[#666666]">Advanced security measures protect against unauthorized charges.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
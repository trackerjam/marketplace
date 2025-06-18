import React from 'react';
import { Shield, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function SecurityDocs() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-semibold text-[#1a1a1a] mb-6">Security & Privacy</h1>
        <p className="text-lg text-[#666666] mb-12">
          Learn about how we protect your data and ensure secure transactions on our platform.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-medium text-[#1a1a1a] mb-6">Data Protection</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-[#0463fb]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Your Data Security</h3>
                    <p className="text-[#666666]">
                      We use industry-standard encryption and security measures to protect your personal and financial information.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <ArrowRight className="w-5 h-5 text-[#0463fb] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-[#1a1a1a] mb-1">Encryption</h4>
                      <p className="text-[#666666]">All data is encrypted in transit and at rest using industry-standard protocols.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ArrowRight className="w-5 h-5 text-[#0463fb] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-[#1a1a1a] mb-1">Data Privacy</h4>
                      <p className="text-[#666666]">Your personal information is never shared without your explicit consent.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-[#1a1a1a] mb-6">Account Security</h2>
            <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-[#0463fb]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Account Protection</h3>
                  <p className="text-[#666666]">
                    We implement multiple layers of security to protect your account from unauthorized access.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-[#0463fb] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-[#1a1a1a] mb-1">Secure Authentication</h4>
                    <p className="text-[#666666]">Strong password requirements and secure authentication methods.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-[#0463fb] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-[#1a1a1a] mb-1">Activity Monitoring</h4>
                    <p className="text-[#666666]">Continuous monitoring for suspicious account activity.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-[#1a1a1a] mb-6">Fraud Prevention</h2>
            <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-[#0463fb]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Fraud Protection</h3>
                  <p className="text-[#666666]">
                    Our advanced fraud detection systems help protect both clients and freelancers from fraudulent activities.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-[#0463fb] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-[#1a1a1a] mb-1">Payment Protection</h4>
                    <p className="text-[#666666]">Secure payment processing with fraud detection and prevention.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-[#0463fb] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-[#1a1a1a] mb-1">Dispute Resolution</h4>
                    <p className="text-[#666666]">Quick and fair resolution process for any security concerns.</p>
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
import React from 'react';
import { MessageSquare, Mail } from 'lucide-react';

export default function Support() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-[#1a1a1a] mb-4">Support</h1>
          <p className="text-[#666666]">
            Need help? Contact our support team and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e5e5] p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-[#f0f4ff] w-16 h-16 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-[#0463fb]" />
            </div>
          </div>
          <h2 className="text-xl font-medium text-[#1a1a1a] mb-4">Contact Support</h2>
          <p className="text-[#666666] mb-6">
            Send us an email and we'll respond within 24 hours.
          </p>
          <a
            href="mailto:hi@trackerjam.com"
            className="btn-primary inline-flex items-center gap-2"
          >
            Email Support Team
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
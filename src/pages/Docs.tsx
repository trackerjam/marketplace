import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Briefcase, BarChart, DollarSign, Shield } from 'lucide-react';

export default function Docs() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold text-[#1a1a1a] mb-6">Documentation</h1>
        <p className="text-lg text-[#666666] mb-12">
          Learn how to make the most of Trackerjam's freelance marketplace and productivity tracking features.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="card p-6">
          <div className="flex items-start gap-4">
            <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-[#0463fb]" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-[#1a1a1a] mb-2">For Freelancers</h2>
              <p className="text-[#666666] mb-4">Learn how to find work, submit proposals, and showcase your productivity.</p>
              <ul className="space-y-3">
                <li>
                  <Link to="/docs/freelancers/getting-started" className="text-[#0463fb] hover:text-[#0355d5] text-sm">
                    Getting Started Guide →
                  </Link>
                </li>
                <li>
                  <Link to="/docs/analytics" className="text-[#0463fb] hover:text-[#0355d5] text-sm">
                    Setting up Trackerjam →
                  </Link>
                </li>
                <li>
                  <Link to="/docs/payments" className="text-[#0463fb] hover:text-[#0355d5] text-sm">
                    Payment & Billing Guide →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-start gap-4">
            <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-[#0463fb]" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-[#1a1a1a] mb-2">For Businesses</h2>
              <p className="text-[#666666] mb-4">Learn how to post jobs, evaluate freelancers, and manage projects.</p>
              <ul className="space-y-3">
                <li>
                  <Link to="/docs/businesses/getting-started" className="text-[#0463fb] hover:text-[#0355d5] text-sm">
                    Getting Started Guide →
                  </Link>
                </li>
                <li>
                  <Link to="/docs/analytics" className="text-[#0463fb] hover:text-[#0355d5] text-sm">
                    Understanding Productivity Metrics →
                  </Link>
                </li>
                <li>
                  <Link to="/docs/payments" className="text-[#0463fb] hover:text-[#0355d5] text-sm">
                    Payment & Protection Guide →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="card p-6">
          <div className="flex items-start gap-4">
            <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
              <BarChart className="w-6 h-6 text-[#0463fb]" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-[#1a1a1a] mb-2">Productivity Analytics</h2>
              <p className="text-[#666666] mb-4 text-sm">Detailed guide on tracking and understanding productivity metrics.</p>
              <Link to="/docs/analytics" className="text-[#0463fb] hover:text-[#0355d5] text-sm">
                Learn more →
              </Link>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-start gap-4">
            <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#0463fb]" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-[#1a1a1a] mb-2">Payments & Billing</h2>
              <p className="text-[#666666] mb-4 text-sm">Everything about payments, withdrawals, and marketplace fees.</p>
              <Link to="/docs/payments" className="text-[#0463fb] hover:text-[#0355d5] text-sm">
                Learn more →
              </Link>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-start gap-4">
            <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#0463fb]" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-[#1a1a1a] mb-2">Security & Privacy</h2>
              <p className="text-[#666666] mb-4 text-sm">Learn about our security measures and data privacy policies.</p>
              <Link to="/docs/security" className="text-[#0463fb] hover:text-[#0355d5] text-sm">
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
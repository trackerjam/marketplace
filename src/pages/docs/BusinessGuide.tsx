import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BarChart, Shield } from 'lucide-react';

export default function BusinessGuide() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-semibold text-[#1a1a1a] mb-6">Getting Started as a Business</h1>
        <p className="text-lg text-[#666666] mb-12">
          Learn how to post jobs, find talent, and manage your projects effectively.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-medium text-[#1a1a1a] mb-6">Posting Jobs</h2>
            <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
              <h3 className="text-lg font-medium text-[#1a1a1a] mb-4">Best Practices</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-[#0463fb] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-[#1a1a1a] mb-1">Write Clear Requirements</h4>
                    <p className="text-[#666666]">Be specific about project scope, timeline, and deliverables.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-[#0463fb] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-[#1a1a1a] mb-1">Set Realistic Budgets</h4>
                    <p className="text-[#666666]">Define clear budgets based on project complexity and required expertise.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-[#1a1a1a] mb-6">Finding Talent</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#0463fb]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Browse Freelancers</h3>
                    <p className="text-[#666666]">
                      Find skilled professionals based on their expertise and experience.
                    </p>
                  </div>
                </div>
                <Link to="/freelancers" className="text-[#0463fb] hover:text-[#0355d5] text-sm font-medium inline-flex items-center gap-1">
                  View Freelancer Directory
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
                    <BarChart className="w-6 h-6 text-[#0463fb]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Evaluate Performance</h3>
                    <p className="text-[#666666]">
                      Use productivity tracking to monitor progress and ensure quality.
                    </p>
                  </div>
                </div>
                <Link to="/docs/analytics" className="text-[#0463fb] hover:text-[#0355d5] text-sm font-medium inline-flex items-center gap-1">
                  Learn About Analytics
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-[#1a1a1a] mb-6">Managing Projects</h2>
            <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#0463fb]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Payment Protection</h3>
                  <p className="text-[#666666] mb-4">
                    Learn about our secure payment system and how we protect your interests.
                  </p>
                  <Link to="/docs/payments" className="btn-secondary inline-flex items-center gap-2">
                    View Payment Guide
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
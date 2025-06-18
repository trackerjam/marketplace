import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, DollarSign, Clock } from 'lucide-react';

export default function FreelancerGuide() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-semibold text-[#1a1a1a] mb-6">Getting Started as a Freelancer</h1>
        <p className="text-lg text-[#666666] mb-12">
          Learn how to set up your profile, find work, and succeed on our platform.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-medium text-[#1a1a1a] mb-6">Setting Up Your Profile</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
                <h3 className="text-lg font-medium text-[#1a1a1a] mb-4">Profile Basics</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-5 h-5 text-[#0463fb] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-[#1a1a1a] mb-1">Complete Your Profile</h4>
                      <p className="text-[#666666]">Add your skills, hourly rate, and portfolio links to stand out.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-5 h-5 text-[#0463fb] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-[#1a1a1a] mb-1">Write a Strong Bio</h4>
                      <p className="text-[#666666]">Highlight your expertise and experience in your field.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-[#1a1a1a] mb-6">Finding Work</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
                    <Search className="w-6 h-6 text-[#0463fb]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Browse Projects</h3>
                    <p className="text-[#666666]">
                      Search for projects that match your skills and experience level.
                    </p>
                  </div>
                </div>
                <Link to="/jobs" className="text-[#0463fb] hover:text-[#0355d5] text-sm font-medium inline-flex items-center gap-1">
                  Browse Available Jobs
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-[#0463fb]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Submit Proposals</h3>
                    <p className="text-[#666666]">
                      Write compelling proposals that highlight your relevant experience.
                    </p>
                  </div>
                </div>
                <Link to="/docs/freelancers/proposals" className="text-[#0463fb] hover:text-[#0355d5] text-sm font-medium inline-flex items-center gap-1">
                  Learn About Proposals
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-[#1a1a1a] mb-6">Time Tracking</h2>
            <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#0463fb]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Using Trackerjam</h3>
                  <p className="text-[#666666] mb-4">
                    Learn how to track your work time effectively and build trust with clients.
                  </p>
                  <Link to="/docs/analytics" className="btn-secondary inline-flex items-center gap-2">
                    View Productivity Guide
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
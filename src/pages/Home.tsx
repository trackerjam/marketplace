import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Calendar, BarChart, Clock, LineChart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

type Job = {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: string;
  created_at: string;
};

export default function Home() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['recentJobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as Job[];
    },
  });

  return (
    <>
      <div className="max-w-6xl mx-auto px-4">
        <div className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-semibold text-[#1a1a1a] mb-6 leading-tight">
                Hire Data-Driven Productive Talent with Low Fees
              </h1>
              <p className="text-lg text-[#666666] mb-8 leading-relaxed max-w-3xl mx-auto">
                Post jobs and bid for free. Pay only 5% when work is completed. 
                Built-in productivity tracking helps you make informed decisions.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
                <Link to="/jobs" className="btn-secondary">
                  Browse Jobs
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="bg-[#f0f4ff] w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-[#0463fb]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#1a1a1a] mb-1">Just 5% Fee</h3>
                  <p className="text-sm text-[#666666]">
                    Post jobs and bid for free. Pay only 5% when work is completed.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[#f0f4ff] w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <LineChart className="w-5 h-5 text-[#0463fb]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#1a1a1a] mb-1">Track Progress</h3>
                  <p className="text-sm text-[#666666]">
                    Built-in productivity tracking for transparency and trust.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[#f0f4ff] w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#0463fb]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#1a1a1a] mb-1">Simple Payments</h3>
                  <p className="text-sm text-[#666666]">
                    No escrow needed. Secure, reversible card payments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#1a1a1a]">Latest Opportunities</h2>
            <Link to="/jobs" className="text-[#0463fb] hover:text-[#0355d5] text-sm font-medium">
              View all jobs →
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0463fb] border-t-transparent mx-auto"></div>
            </div>
          ) : jobs && jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="card p-6">
                  <div className="flex justify-between items-start gap-6">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-[#1a1a1a] mb-2 truncate">
                        {job.title}
                      </h3>
                      <p className="text-[#666666] mb-4 line-clamp-2 text-sm leading-relaxed">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#666666]">
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-[#0463fb]" />
                          <span>${job.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[#0463fb]" />
                          <span>Due {new Date(job.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="btn-secondary whitespace-nowrap"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <p className="text-[#666666]">No jobs available at the moment.</p>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-white border-t border-[#e5e5e5] py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex flex-col mb-4">
                <span className="text-lg font-medium text-[#1a1a1a]">Freelance Marketplace</span>
                <span className="text-sm text-[#666666]">by Trackerjam</span>
              </div>
              <p className="text-sm text-[#666666]">
                A Whispering Wharfs LLC Company
              </p>
            </div>
            <div>
              <h3 className="font-medium text-[#1a1a1a] mb-3">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/jobs" className="text-sm text-[#666666] hover:text-[#1a1a1a]">
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link to="/docs" className="text-sm text-[#666666] hover:text-[#1a1a1a]">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-sm text-[#666666] hover:text-[#1a1a1a]">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/comparison" className="text-sm text-[#666666] hover:text-[#1a1a1a]">
                    Compare Platforms
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-[#1a1a1a] mb-3">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-sm text-[#666666] hover:text-[#1a1a1a]">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-sm text-[#666666] hover:text-[#1a1a1a]">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-sm text-[#666666] hover:text-[#1a1a1a]">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-[#1a1a1a] mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-sm text-[#666666] hover:text-[#1a1a1a]">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-[#666666] hover:text-[#1a1a1a]">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="text-sm text-[#666666] hover:text-[#1a1a1a]">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#e5e5e5] mt-8 pt-8 text-sm text-[#666666]">
            <p>© {new Date().getFullYear()} Whispering Wharfs LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
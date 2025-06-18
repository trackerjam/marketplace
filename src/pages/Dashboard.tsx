import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { BarChart, Clock, DollarSign, Users, Briefcase, Star, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (!profile) return null;

  return profile.user_type === 'freelancer' ? (
    <FreelancerDashboard profile={profile} />
  ) : (
    <BusinessDashboard profile={profile} />
  );
}

function FreelancerDashboard({ profile }) {
  const { user } = useAuth();

  const { data: earnings } = useQuery({
    queryKey: ['earnings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('amount')
        .eq('freelancer_id', user?.id)
        .eq('status', 'completed');

      if (error) throw error;
      return data.reduce((sum, payment) => sum + payment.amount, 0);
    },
    enabled: !!user,
  });

  const { data: activeProjects } = useQuery({
    queryKey: ['activeProjects', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          bids!inner(*)
        `)
        .eq('bids.freelancer_id', user?.id)
        .eq('bids.status', 'accepted')
        .eq('status', 'in_progress');

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('freelancer_id', user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const averageRating = reviews?.length 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Freelancer Dashboard</h1>
        <Link to="/jobs" className="btn-primary">Find Work</Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-[#666666] mb-1">Total Earnings</p>
              <h3 className="text-2xl font-semibold text-[#1a1a1a]">
                ${earnings?.toFixed(2) || '0.00'}
              </h3>
            </div>
            <div className="bg-[#f0f4ff] w-10 h-10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#0463fb]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-[#666666] mb-1">Active Projects</p>
              <h3 className="text-2xl font-semibold text-[#1a1a1a]">
                {activeProjects?.length || 0}
              </h3>
            </div>
            <div className="bg-[#f0f4ff] w-10 h-10 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#0463fb]" />
            </div>
          </div>
        </div>

        {averageRating && (
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-[#666666] mb-1">Client Rating</p>
                <h3 className="text-2xl font-semibold text-[#1a1a1a]">{averageRating}</h3>
              </div>
              <div className="bg-[#f0f4ff] w-10 h-10 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-[#0463fb]" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-[#666666]">
              <span>Based on {reviews.length} reviews</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
          <h2 className="text-lg font-medium text-[#1a1a1a] mb-4">Active Projects</h2>
          <div className="space-y-4">
            {activeProjects?.length ? (
              activeProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between py-3 border-b border-[#e5e5e5]">
                  <div>
                    <h3 className="font-medium text-[#1a1a1a]">{project.title}</h3>
                    <p className="text-sm text-[#666666]">
                      Due {format(new Date(project.deadline), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Link to={`/projects/${project.id}`} className="text-[#0463fb] hover:text-[#0355d5] text-sm font-medium">
                    View Details
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-[#666666] text-center py-4">No active projects</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
          <h2 className="text-lg font-medium text-[#1a1a1a] mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {/* Activity feed will be implemented later */}
            <p className="text-[#666666] text-center py-4">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BusinessDashboard({ profile }) {
  const { user } = useAuth();

  const { data: totalSpent } = useQuery({
    queryKey: ['totalSpent', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('amount')
        .eq('business_id', user?.id)
        .eq('status', 'completed');

      if (error) throw error;
      return data.reduce((sum, payment) => sum + payment.amount, 0);
    },
    enabled: !!user,
  });

  const { data: activeProjects } = useQuery({
    queryKey: ['activeProjects', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          bids!inner(*)
        `)
        .eq('business_id', user?.id)
        .eq('status', 'in_progress');

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: activeFreelancers } = useQuery({
    queryKey: ['activeFreelancers', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bids')
        .select('freelancer_id')
        .eq('status', 'accepted')
        .in('job_id', activeProjects?.map(p => p.id) || []);

      if (error) throw error;
      return [...new Set(data.map(bid => bid.freelancer_id))];
    },
    enabled: !!user && !!activeProjects,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Business Dashboard</h1>
        <Link to="/post-job" className="btn-primary">Post a Job</Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-[#666666] mb-1">Active Projects</p>
              <h3 className="text-2xl font-semibold text-[#1a1a1a]">
                {activeProjects?.length || 0}
              </h3>
            </div>
            <div className="bg-[#f0f4ff] w-10 h-10 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#0463fb]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-[#666666] mb-1">Active Freelancers</p>
              <h3 className="text-2xl font-semibold text-[#1a1a1a]">
                {activeFreelancers?.length || 0}
              </h3>
            </div>
            <div className="bg-[#f0f4ff] w-10 h-10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-[#0463fb]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-[#666666] mb-1">Total Spent</p>
              <h3 className="text-2xl font-semibold text-[#1a1a1a]">
                ${totalSpent?.toFixed(2) || '0.00'}
              </h3>
            </div>
            <div className="bg-[#f0f4ff] w-10 h-10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#0463fb]" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
          <h2 className="text-lg font-medium text-[#1a1a1a] mb-4">Project Overview</h2>
          <div className="space-y-4">
            {activeProjects?.length ? (
              activeProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between py-3 border-b border-[#e5e5e5]">
                  <div>
                    <h3 className="font-medium text-[#1a1a1a]">{project.title}</h3>
                    <p className="text-sm text-[#666666]">
                      Due {format(new Date(project.deadline), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Link to={`/projects/${project.id}`} className="text-[#0463fb] hover:text-[#0355d5] text-sm font-medium">
                    View Details
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-[#666666] text-center py-4">No active projects</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
          <h2 className="text-lg font-medium text-[#1a1a1a] mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {/* Activity feed will be implemented later */}
            <p className="text-[#666666] text-center py-4">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
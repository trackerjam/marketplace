import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Briefcase, DollarSign, Calendar, Clock, Building2, ChevronLeft, CreditCard } from 'lucide-react';
import MessageList from '../components/MessageList';
import EscrowPayment from '../components/EscrowPayment';

type JobDetails = {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
  created_at: string;
  status: string;
  business_id: string;
  business: {
    username: string;
    company_name: string;
  };
  skills: {
    skill: {
      name: string;
    };
  }[];
};

type BidForm = {
  amount: number;
  cover_letter: string;
};

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<BidForm>();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          business:profiles!jobs_business_id_fkey(
            username,
            company_name
          ),
          skills:job_skills(
            skill:skills(name)
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as JobDetails | null;
    },
    enabled: !!id,
  });

  const { data: existingBid } = useQuery({
    queryKey: ['bid', id, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('job_id', id)
        .eq('freelancer_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!id && !!user,
  });

  const { data: acceptedBid } = useQuery({
    queryKey: ['accepted-bid', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('job_id', id)
        .eq('status', 'accepted')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!id,
  });

  const onSubmit = async (data: BidForm) => {
    try {
      const { error } = await supabase
        .from('bids')
        .insert([
          {
            job_id: id,
            freelancer_id: user?.id,
            amount: data.amount,
            cover_letter: data.cover_letter,
          },
        ]);

      if (error) throw error;
      window.location.reload();
    } catch (error) {
      console.error('Error submitting bid:', error);
    }
  };

  if (jobLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0463fb] border-t-transparent"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-4">Job Not Found</h1>
        <p className="text-[#666666] mb-8">This job posting may have been removed or is no longer available.</p>
        <Link to="/jobs" className="btn-primary">
          Browse Other Jobs
        </Link>
      </div>
    );
  }

  const isFreelancer = profile?.user_type === 'freelancer';
  const canBid = isFreelancer && !existingBid && job.status === 'open';
  const isOwner = user?.id === job.business_id;
  const hasAcceptedBid = !!acceptedBid;
  const isAcceptedFreelancer = acceptedBid?.freelancer_id === user?.id;
  const canShowPayment = isOwner && hasAcceptedBid && job.status === 'in_progress';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/jobs" className="inline-flex items-center gap-2 text-[#666666] hover:text-[#1a1a1a] mb-8">
        <ChevronLeft className="w-4 h-4" />
        Back to Jobs
      </Link>

      <div className="bg-white rounded-lg border border-[#e5e5e5] p-8 mb-8">
        <div className="flex justify-between items-start gap-6 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-2">{job.title}</h1>
            <div className="flex items-center gap-2 text-[#666666]">
              <Building2 className="w-4 h-4" />
              <span>{job.business.company_name || job.business.username}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              job.status === 'open' ? 'bg-green-100 text-green-800' :
              job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              job.status === 'completed' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800'
            }`}>
              {job.status.replace('_', ' ')}
            </span>
            {canBid && (
              <button
                onClick={() => document.getElementById('bid-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
              >
                Submit Proposal
              </button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-[#f0f4ff] w-10 h-10 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#0463fb]" />
            </div>
            <div>
              <p className="text-sm text-[#666666]">Category</p>
              <p className="font-medium text-[#1a1a1a]">{job.category}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#f0f4ff] w-10 h-10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#0463fb]" />
            </div>
            <div>
              <p className="text-sm text-[#666666]">Budget</p>
              <p className="font-medium text-[#1a1a1a]">${job.budget.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#f0f4ff] w-10 h-10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#0463fb]" />
            </div>
            <div>
              <p className="text-sm text-[#666666]">Deadline</p>
              <p className="font-medium text-[#1a1a1a]">
                {new Date(job.deadline).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-medium text-[#1a1a1a] mb-4">Project Description</h2>
          <div className="prose prose-gray max-w-none">
            <div 
              className="text-[#666666] whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>
        </div>

        {job.skills && job.skills.length > 0 && (
          <div>
            <h2 className="text-lg font-medium text-[#1a1a1a] mb-4">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-[#f0f4ff] text-[#0463fb] px-3 py-1 rounded-full text-sm"
                >
                  {skill.skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Payment Section for Business Owners */}
      {canShowPayment && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-[#1a1a1a] mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Project Payment
          </h2>
          <EscrowPayment
            jobId={job.id}
            amount={acceptedBid.amount}
            freelancerId={acceptedBid.freelancer_id}
            businessId={job.business_id}
          />
        </div>
      )}

      {/* Messages Section */}
      {(isOwner || isAcceptedFreelancer) && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-[#1a1a1a] mb-4">Messages</h2>
          <MessageList jobId={job.id} />
        </div>
      )}

      {/* Bid Submission Form */}
      {canBid && (
        <div id="bid-section" className="bg-white rounded-lg border border-[#e5e5e5] p-8">
          <h2 className="text-lg font-medium text-[#1a1a1a] mb-6">Submit Your Proposal</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-[#1a1a1a] mb-1">
                Bid Amount ($)
              </label>
              <input
                type="number"
                id="amount"
                {...register('amount', {
                  required: 'Bid amount is required',
                  min: { value: 1, message: 'Bid amount must be greater than 0' },
                })}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="cover_letter" className="block text-sm font-medium text-[#1a1a1a] mb-1">
                Cover Letter
              </label>
              <textarea
                id="cover_letter"
                rows={6}
                {...register('cover_letter', {
                  required: 'Cover letter is required',
                  minLength: { value: 100, message: 'Cover letter must be at least 100 characters' },
                })}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
                placeholder="Explain why you're the best fit for this project..."
              />
              {errors.cover_letter && (
                <p className="mt-1 text-sm text-red-600">{errors.cover_letter.message}</p>
              )}
            </div>

            <button type="submit" className="btn-primary w-full">
              Submit Proposal
            </button>
          </form>
        </div>
      )}

      {/* Existing Bid Display */}
      {existingBid && (
        <div className="bg-white rounded-lg border border-[#e5e5e5] p-8">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-[#0463fb]" />
            <h2 className="text-lg font-medium text-[#1a1a1a]">Your Submitted Proposal</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[#666666]">Bid Amount</p>
              <p className="font-medium text-[#1a1a1a]">${existingBid.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-[#666666]">Cover Letter</p>
              <p className="text-[#1a1a1a] whitespace-pre-wrap">{existingBid.cover_letter}</p>
            </div>
            <div>
              <p className="text-sm text-[#666666]">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                existingBid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                existingBid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {existingBid.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
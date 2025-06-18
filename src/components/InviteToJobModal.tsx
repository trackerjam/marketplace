import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { X, Briefcase, Send, DollarSign, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface InviteToJobModalProps {
  freelancerId: string;
  freelancerName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface InviteForm {
  jobId: string;
  customMessage: string;
}

type Job = {
  id: string;
  title: string;
  budget: number;
  deadline: string;
  category: string;
  description: string;
};

export default function InviteToJobModal({ 
  freelancerId, 
  freelancerName, 
  isOpen, 
  onClose 
}: InviteToJobModalProps) {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<InviteForm>();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedJobId = watch('jobId');

  // Get user's open jobs
  const { data: jobs } = useQuery({
    queryKey: ['user-open-jobs', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('business_id', user.id)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Job[];
    },
    enabled: !!user && isOpen,
  });

  const selectedJob = jobs?.find(job => job.id === selectedJobId);

  const onSubmit = async (data: InviteForm) => {
    if (!user || !selectedJob) return;

    setIsLoading(true);
    setError(null);

    try {
      // Send notification to freelancer
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: freelancerId,
          type: 'job_invitation',
          data: {
            from_user_id: user.id,
            from_username: user.email,
            job_id: data.jobId,
            job_title: selectedJob.title,
            job_budget: selectedJob.budget,
            custom_message: data.customMessage,
          },
        });

      if (notificationError) throw notificationError;

      setSuccess(true);
      reset();
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#e5e5e5]">
          <div className="flex items-center gap-3">
            <div className="bg-[#f0f4ff] w-10 h-10 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#0463fb]" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-[#1a1a1a]">Invite to Job</h2>
              <p className="text-sm text-[#666666]">Invite {freelancerName} to work on your project</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#666666] hover:text-[#1a1a1a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Invitation Sent!</h3>
              <p className="text-[#666666]">Your job invitation has been sent to {freelancerName}.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="jobId" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                  Select Job *
                </label>
                {jobs && jobs.length > 0 ? (
                  <select
                    id="jobId"
                    {...register('jobId', { required: 'Please select a job' })}
                    className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
                  >
                    <option value="">Choose a job to invite for...</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title} - ${job.budget.toLocaleString()}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="bg-gray-50 border border-[#e5e5e5] rounded-md p-4 text-center">
                    <p className="text-[#666666] text-sm">
                      You don't have any open jobs to invite freelancers to.
                    </p>
                    <button
                      type="button"
                      onClick={() => window.open('/post-job', '_blank')}
                      className="btn-secondary mt-3"
                    >
                      Post a Job
                    </button>
                  </div>
                )}
                {errors.jobId && (
                  <p className="mt-1 text-sm text-red-600">{errors.jobId.message}</p>
                )}
              </div>

              {selectedJob && (
                <div className="bg-[#f8f9fa] rounded-lg p-4">
                  <h4 className="font-medium text-[#1a1a1a] mb-3">Job Details</h4>
                  <div className="space-y-2">
                    <h5 className="font-medium text-[#1a1a1a]">{selectedJob.title}</h5>
                    <div className="flex items-center gap-4 text-sm text-[#666666]">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>${selectedJob.budget.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Due {format(new Date(selectedJob.deadline), 'MMM d, yyyy')}</span>
                      </div>
                      <span className="bg-[#f0f4ff] text-[#0463fb] px-2 py-1 rounded-full text-xs">
                        {selectedJob.category}
                      </span>
                    </div>
                    <p className="text-sm text-[#666666] line-clamp-2">
                      {selectedJob.description}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="customMessage" className="block text-sm font-medium text-[#1a1a1a] mb-1">
                  Personal Message (Optional)
                </label>
                <textarea
                  id="customMessage"
                  rows={4}
                  {...register('customMessage')}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent resize-vertical"
                  placeholder="Add a personal message to explain why you'd like to work with this freelancer..."
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-[#666666] hover:text-[#1a1a1a] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !selectedJob}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Invitation
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
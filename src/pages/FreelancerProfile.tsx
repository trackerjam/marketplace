import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { 
  MapPin, 
  DollarSign, 
  Star, 
  ExternalLink, 
  ChevronLeft, 
  MessageSquare,
  Calendar,
  Award,
  Briefcase,
  UserPlus,
  Heart
} from 'lucide-react';
import { format } from 'date-fns';
import ContactFreelancerModal from '../components/ContactFreelancerModal';
import InviteToJobModal from '../components/InviteToJobModal';

type FreelancerProfile = {
  id: string;
  username: string;
  bio: string;
  location: string;
  hourly_rate: number;
  portfolio_links: string[];
  profile_picture_url: string;
  created_at: string;
  skills: {
    skill: {
      name: string;
    };
  }[];
};

type CompletedJob = {
  id: string;
  title: string;
  category: string;
  completed_at: string;
  business: {
    username: string;
    company_name: string;
  };
};

function formatName(username: string): string {
  // Split username into parts
  const parts = username.split(/[\s_-]/);
  if (parts.length > 1) {
    // If multiple parts, show first name and last initial
    return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
  }
  // If single word, show first part and last character
  return `${username.slice(0, -1)}${username.charAt(username.length - 1)}.`;
}

export default function FreelancerProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [showContactModal, setShowContactModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { data: freelancer, isLoading } = useQuery({
    queryKey: ['freelancer-profile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          skills:user_skills(
            skill:skills(name)
          )
        `)
        .eq('id', id)
        .eq('user_type', 'freelancer')
        .single();

      if (error) throw error;
      return data as FreelancerProfile;
    },
    enabled: !!id,
  });

  const { data: completedJobs } = useQuery({
    queryKey: ['freelancer-completed-jobs', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id,
          title,
          category,
          updated_at,
          business:profiles!jobs_business_id_fkey(
            username,
            company_name
          )
        `)
        .eq('status', 'completed')
        .in('id', 
          // Subquery to get job IDs where this freelancer had accepted bids
          supabase
            .from('bids')
            .select('job_id')
            .eq('freelancer_id', id)
            .eq('status', 'accepted')
        )
        .order('updated_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as CompletedJob[];
    },
    enabled: !!id,
  });

  const { data: stats } = useQuery({
    queryKey: ['freelancer-stats', id],
    queryFn: async () => {
      // Get total completed jobs
      const { data: completedBids } = await supabase
        .from('bids')
        .select('job_id')
        .eq('freelancer_id', id)
        .eq('status', 'accepted');

      const completedJobIds = completedBids?.map(bid => bid.job_id) || [];
      
      const { data: completedJobsData } = await supabase
        .from('jobs')
        .select('id')
        .eq('status', 'completed')
        .in('id', completedJobIds);

      const totalCompleted = completedJobsData?.length || 0;

      // Get total earnings (mock data for now)
      const totalEarnings = totalCompleted * 1500; // Placeholder calculation

      // Calculate success rate
      const { data: allBids } = await supabase
        .from('bids')
        .select('status')
        .eq('freelancer_id', id);

      const totalBids = allBids?.length || 0;
      const acceptedBids = allBids?.filter(bid => bid.status === 'accepted').length || 0;
      const successRate = totalBids > 0 ? (acceptedBids / totalBids) * 100 : 0;

      return {
        totalCompleted,
        totalEarnings,
        successRate,
        averageRating: 4.8, // Placeholder - would come from reviews table
        totalReviews: totalCompleted, // Placeholder
      };
    },
    enabled: !!id,
  });

  // Check if user has business profile for invite functionality
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleSaveFreelancer = async () => {
    if (!user || !freelancer) return;

    try {
      if (isSaved) {
        // Remove from saved (this would require a saved_freelancers table)
        setIsSaved(false);
      } else {
        // Add to saved (this would require a saved_freelancers table)
        setIsSaved(true);
        
        // For now, just show a notification
        await supabase
          .from('notifications')
          .insert({
            user_id: user.id,
            type: 'freelancer_saved',
            data: {
              freelancer_id: freelancer.id,
              freelancer_name: formatName(freelancer.username),
            },
          });
      }
    } catch (error) {
      console.error('Error saving freelancer:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0463fb] border-t-transparent"></div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-4">Freelancer Not Found</h1>
        <p className="text-[#666666] mb-8">This freelancer profile may have been removed or is no longer available.</p>
        <Link to="/freelancers" className="btn-primary">
          Browse Other Freelancers
        </Link>
      </div>
    );
  }

  const isOwnProfile = user?.id === freelancer.id;
  const canInviteToJob = userProfile?.user_type === 'business';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link to="/freelancers" className="inline-flex items-center gap-2 text-[#666666] hover:text-[#1a1a1a] mb-8">
        <ChevronLeft className="w-4 h-4" />
        Back to Freelancers
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Profile Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-8">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-[#f0f4ff] flex items-center justify-center overflow-hidden flex-shrink-0">
                {freelancer.profile_picture_url ? (
                  <img
                    src={freelancer.profile_picture_url}
                    alt={freelancer.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[#0463fb] text-2xl font-semibold">
                    {freelancer.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-2">
                  {formatName(freelancer.username)}
                </h1>
                <div className="flex items-center gap-4 text-[#666666] mb-4">
                  {freelancer.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{freelancer.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Joined {format(new Date(freelancer.created_at), 'MMM yyyy')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{stats?.averageRating || 'N/A'}</span>
                    <span className="text-[#666666] text-sm">
                      ({stats?.totalReviews || 0} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-[#0463fb]" />
                    <span className="font-medium">${freelancer.hourly_rate}/hr</span>
                  </div>
                </div>
                {!isOwnProfile && user && (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setShowContactModal(true)}
                      className="btn-primary flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Contact Freelancer
                    </button>
                    {canInviteToJob && (
                      <button 
                        onClick={() => setShowInviteModal(true)}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Invite to Job
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {freelancer.bio && (
              <div>
                <h3 className="font-medium text-[#1a1a1a] mb-3">About</h3>
                <p className="text-[#666666] leading-relaxed">{freelancer.bio}</p>
              </div>
            )}
          </div>

          {/* Skills */}
          {freelancer.skills && freelancer.skills.length > 0 && (
            <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
              <h3 className="font-medium text-[#1a1a1a] mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {freelancer.skills.map((skill, index) => (
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

          {/* Portfolio */}
          {freelancer.portfolio_links && freelancer.portfolio_links.length > 0 && (
            <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
              <h3 className="font-medium text-[#1a1a1a] mb-4">Portfolio</h3>
              <div className="space-y-3">
                {freelancer.portfolio_links.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#0463fb] hover:text-[#0355d5] text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {link}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Recent Work */}
          {completedJobs && completedJobs.length > 0 && (
            <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
              <h3 className="font-medium text-[#1a1a1a] mb-4">Recent Work</h3>
              <div className="space-y-4">
                {completedJobs.map((job) => (
                  <div key={job.id} className="border-b border-[#e5e5e5] pb-4 last:border-b-0 last:pb-0">
                    <h4 className="font-medium text-[#1a1a1a] mb-1">{job.title}</h4>
                    <p className="text-sm text-[#666666] mb-2">
                      {job.business.company_name || job.business.username} • {job.category}
                    </p>
                    <p className="text-xs text-[#666666]">
                      Completed {format(new Date(job.updated_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
            <h3 className="font-medium text-[#1a1a1a] mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#0463fb]" />
                  <span className="text-sm text-[#666666]">Jobs Completed</span>
                </div>
                <span className="font-medium">{stats?.totalCompleted || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#0463fb]" />
                  <span className="text-sm text-[#666666]">Total Earned</span>
                </div>
                <span className="font-medium">${stats?.totalEarnings?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#0463fb]" />
                  <span className="text-sm text-[#666666]">Success Rate</span>
                </div>
                <span className="font-medium">{stats?.successRate?.toFixed(1) || '0'}%</span>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
            <h3 className="font-medium text-[#1a1a1a] mb-4">Availability</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#666666]">Response Time</span>
                <span className="text-sm font-medium">Within 2 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#666666]">Availability</span>
                <span className="text-sm font-medium text-green-600">Available</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {!isOwnProfile && user && (
            <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
              <h3 className="font-medium text-[#1a1a1a] mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {canInviteToJob && (
                  <button 
                    onClick={() => setShowInviteModal(true)}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Invite to Job
                  </button>
                )}
                <button 
                  onClick={handleSaveFreelancer}
                  className={`w-full btn-secondary flex items-center justify-center gap-2 ${
                    isSaved ? 'bg-red-50 text-red-600 border-red-200' : ''
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Saved' : 'Save Freelancer'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ContactFreelancerModal
        freelancerId={freelancer.id}
        freelancerName={formatName(freelancer.username)}
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />

      <InviteToJobModal
        freelancerId={freelancer.id}
        freelancerName={formatName(freelancer.username)}
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
    </div>
  );
}
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  BarChart3, 
  Search, 
  Filter,
  Eye,
  Trash2,
  Ban,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

type AdminTab = 'overview' | 'users' | 'jobs' | 'transactions' | 'reports';

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'business' | 'freelancer'>('all');
  const [jobFilter, setJobFilter] = useState<'all' | 'open' | 'in_progress' | 'completed' | 'cancelled'>('all');

  // Get user profile to check admin status
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('admin')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Check if user is admin from database field
  const isAdmin = profile?.admin === true;

  if (!user || !profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0463fb] border-t-transparent mx-auto"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-4">Access Denied</h1>
        <p className="text-[#666666]">You don't have permission to access the admin panel.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'jobs', name: 'Jobs', icon: Briefcase },
    { id: 'transactions', name: 'Transactions', icon: DollarSign },
    { id: 'reports', name: 'Reports', icon: TrendingUp },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-2">Admin Panel</h1>
        <p className="text-[#666666]">Manage users, jobs, and monitor platform activity</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-[#e5e5e5] mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#0463fb] text-[#0463fb]'
                    : 'border-transparent text-[#666666] hover:text-[#1a1a1a] hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'users' && <UsersTab searchTerm={searchTerm} setSearchTerm={setSearchTerm} userFilter={userFilter} setUserFilter={setUserFilter} />}
      {activeTab === 'jobs' && <JobsTab searchTerm={searchTerm} setSearchTerm={setSearchTerm} jobFilter={jobFilter} setJobFilter={setJobFilter} />}
      {activeTab === 'transactions' && <TransactionsTab />}
      {activeTab === 'reports' && <ReportsTab />}
    </div>
  );
}

function OverviewTab() {
  const { data: stats } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: async () => {
      const [usersResult, jobsResult, paymentsResult] = await Promise.all([
        supabase.from('profiles').select('user_type, created_at'),
        supabase.from('jobs').select('status, created_at, budget'),
        supabase.from('payments').select('amount, status, created_at')
      ]);

      const users = usersResult.data || [];
      const jobs = jobsResult.data || [];
      const payments = paymentsResult.data || [];

      const totalUsers = users.length;
      const totalFreelancers = users.filter(u => u.user_type === 'freelancer').length;
      const totalBusinesses = users.filter(u => u.user_type === 'business').length;
      
      const totalJobs = jobs.length;
      const activeJobs = jobs.filter(j => j.status === 'open' || j.status === 'in_progress').length;
      const completedJobs = jobs.filter(j => j.status === 'completed').length;
      
      const totalRevenue = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + Number(p.amount), 0);
      
      const platformFees = totalRevenue * 0.05;

      // Recent activity (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const newUsersThisMonth = users.filter(u => 
        new Date(u.created_at) > thirtyDaysAgo
      ).length;
      
      const newJobsThisMonth = jobs.filter(j => 
        new Date(j.created_at) > thirtyDaysAgo
      ).length;

      return {
        totalUsers,
        totalFreelancers,
        totalBusinesses,
        totalJobs,
        activeJobs,
        completedJobs,
        totalRevenue,
        platformFees,
        newUsersThisMonth,
        newJobsThisMonth
      };
    },
  });

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-[#666666] mb-1">Total Users</p>
              <h3 className="text-2xl font-semibold text-[#1a1a1a]">{stats?.totalUsers || 0}</h3>
            </div>
            <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-[#0463fb]" />
            </div>
          </div>
          <div className="text-sm text-green-600">
            +{stats?.newUsersThisMonth || 0} this month
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-[#666666] mb-1">Active Jobs</p>
              <h3 className="text-2xl font-semibold text-[#1a1a1a]">{stats?.activeJobs || 0}</h3>
            </div>
            <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-[#0463fb]" />
            </div>
          </div>
          <div className="text-sm text-green-600">
            +{stats?.newJobsThisMonth || 0} this month
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-[#666666] mb-1">Total Revenue</p>
              <h3 className="text-2xl font-semibold text-[#1a1a1a]">
                ${stats?.totalRevenue?.toFixed(2) || '0.00'}
              </h3>
            </div>
            <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#0463fb]" />
            </div>
          </div>
          <div className="text-sm text-[#666666]">
            Platform fees: ${stats?.platformFees?.toFixed(2) || '0.00'}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-[#666666] mb-1">Completed Jobs</p>
              <h3 className="text-2xl font-semibold text-[#1a1a1a]">{stats?.completedJobs || 0}</h3>
            </div>
            <div className="bg-[#f0f4ff] w-12 h-12 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-[#0463fb]" />
            </div>
          </div>
          <div className="text-sm text-[#666666]">
            Success rate: {stats?.totalJobs ? ((stats.completedJobs / stats.totalJobs) * 100).toFixed(1) : 0}%
          </div>
        </div>
      </div>

      {/* User Breakdown */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
          <h3 className="text-lg font-medium text-[#1a1a1a] mb-4">User Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Freelancers</span>
              <span className="font-medium">{stats?.totalFreelancers || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Businesses</span>
              <span className="font-medium">{stats?.totalBusinesses || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
          <h3 className="text-lg font-medium text-[#1a1a1a] mb-4">Job Status Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Active Jobs</span>
              <span className="font-medium">{stats?.activeJobs || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Completed Jobs</span>
              <span className="font-medium">{stats?.completedJobs || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Total Jobs</span>
              <span className="font-medium">{stats?.totalJobs || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersTab({ searchTerm, setSearchTerm, userFilter, setUserFilter }: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  userFilter: 'all' | 'business' | 'freelancer';
  setUserFilter: (filter: 'all' | 'business' | 'freelancer') => void;
}) {
  const { data: users, refetch } = useQuery({
    queryKey: ['admin-users', searchTerm, userFilter],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (userFilter !== 'all') {
        query = query.eq('user_type', userFilter);
      }

      if (searchTerm) {
        query = query.or(`username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const deleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const { error } = await supabase.auth.admin.deleteUser(userId);
        if (error) throw error;
        refetch();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#666666]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
          />
        </div>
        <select
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value as any)}
          className="px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
        >
          <option value="all">All Users</option>
          <option value="freelancer">Freelancers</option>
          <option value="business">Businesses</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">User</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Admin</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Joined</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Location</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#f0f4ff] flex items-center justify-center">
                        {user.profile_picture_url ? (
                          <img
                            src={user.profile_picture_url}
                            alt={user.username}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-[#0463fb] text-sm">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[#1a1a1a]">{user.username}</p>
                        <p className="text-sm text-[#666666]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.user_type === 'business' 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.user_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.admin ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Admin
                      </span>
                    ) : (
                      <span className="text-sm text-[#666666]">User</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#666666]">
                    {format(new Date(user.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#666666]">
                    {user.location || 'Not specified'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.open(`/profile/${user.id}`, '_blank')}
                        className="p-1 text-[#666666] hover:text-[#0463fb]"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {!user.admin && (
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-1 text-[#666666] hover:text-red-500"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function JobsTab({ searchTerm, setSearchTerm, jobFilter, setJobFilter }: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  jobFilter: 'all' | 'open' | 'in_progress' | 'completed' | 'cancelled';
  setJobFilter: (filter: 'all' | 'open' | 'in_progress' | 'completed' | 'cancelled') => void;
}) {
  const { data: jobs, refetch } = useQuery({
    queryKey: ['admin-jobs', searchTerm, jobFilter],
    queryFn: async () => {
      let query = supabase
        .from('jobs')
        .select(`
          *,
          business:profiles!jobs_business_id_fkey(username, company_name)
        `)
        .order('created_at', { ascending: false });

      if (jobFilter !== 'all') {
        query = query.eq('status', jobFilter);
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const deleteJob = async (jobId: string) => {
    if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('jobs')
          .delete()
          .eq('id', jobId);
        if (error) throw error;
        refetch();
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#666666]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jobs..."
            className="w-full pl-10 pr-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
          />
        </div>
        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value as any)}
          className="px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
        >
          <option value="all">All Jobs</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Job</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Business</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Budget</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Posted</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {jobs?.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-[#1a1a1a] truncate max-w-xs">{job.title}</p>
                      <p className="text-sm text-[#666666]">{job.category}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#666666]">
                    {job.business?.company_name || job.business?.username}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[#1a1a1a]">
                    ${job.budget.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.status === 'open' ? 'bg-green-100 text-green-800' :
                      job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      job.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {job.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#666666]">
                    {format(new Date(job.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
                        className="p-1 text-[#666666] hover:text-[#0463fb]"
                        title="View Job"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="p-1 text-[#666666] hover:text-red-500"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TransactionsTab() {
  const { data: transactions } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          job:jobs(title),
          freelancer:profiles!payments_freelancer_id_fkey(username),
          business:profiles!payments_business_id_fkey(username)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
        <div className="p-6 border-b border-[#e5e5e5]">
          <h2 className="text-lg font-medium text-[#1a1a1a]">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Job</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Freelancer</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Business</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Platform Fee</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#666666]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {transactions?.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-[#666666]">
                    {format(new Date(transaction.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#1a1a1a] max-w-xs truncate">
                    {transaction.job?.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#666666]">
                    {transaction.freelancer?.username}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#666666]">
                    {transaction.business?.username}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[#1a1a1a]">
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#666666]">
                    ${transaction.platform_fee.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReportsTab() {
  const { data: reportData } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      const [usersResult, jobsResult, paymentsResult] = await Promise.all([
        supabase.from('profiles').select('user_type, created_at'),
        supabase.from('jobs').select('status, created_at, budget, category'),
        supabase.from('payments').select('amount, status, created_at')
      ]);

      const users = usersResult.data || [];
      const jobs = jobsResult.data || [];
      const payments = paymentsResult.data || [];

      // Monthly growth data
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return {
          month: format(date, 'MMM yyyy'),
          users: users.filter(u => {
            const userDate = new Date(u.created_at);
            return userDate.getMonth() === date.getMonth() && 
                   userDate.getFullYear() === date.getFullYear();
          }).length,
          jobs: jobs.filter(j => {
            const jobDate = new Date(j.created_at);
            return jobDate.getMonth() === date.getMonth() && 
                   jobDate.getFullYear() === date.getFullYear();
          }).length,
          revenue: payments.filter(p => {
            const paymentDate = new Date(p.created_at);
            return paymentDate.getMonth() === date.getMonth() && 
                   paymentDate.getFullYear() === date.getFullYear() &&
                   p.status === 'completed';
          }).reduce((sum, p) => sum + Number(p.amount), 0)
        };
      }).reverse();

      // Category breakdown
      const categoryStats = jobs.reduce((acc, job) => {
        acc[job.category] = (acc[job.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        monthlyGrowth: last6Months,
        categoryStats,
        totalRevenue: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0),
        averageJobValue: jobs.length > 0 ? jobs.reduce((sum, j) => sum + Number(j.budget), 0) / jobs.length : 0
      };
    },
  });

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
          <h3 className="text-lg font-medium text-[#1a1a1a] mb-4">Revenue Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Total Revenue</span>
              <span className="font-medium text-xl">${reportData?.totalRevenue?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Platform Fees (5%)</span>
              <span className="font-medium">${((reportData?.totalRevenue || 0) * 0.05).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Average Job Value</span>
              <span className="font-medium">${reportData?.averageJobValue?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
          <h3 className="text-lg font-medium text-[#1a1a1a] mb-4">Job Categories</h3>
          <div className="space-y-3">
            {Object.entries(reportData?.categoryStats || {})
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-[#666666] capitalize">{category}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Monthly Growth Chart */}
      <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
        <h3 className="text-lg font-medium text-[#1a1a1a] mb-6">Monthly Growth (Last 6 Months)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-[#666666]">Month</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-[#666666]">New Users</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-[#666666]">New Jobs</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-[#666666]">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {reportData?.monthlyGrowth?.map((month, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm font-medium text-[#1a1a1a]">{month.month}</td>
                  <td className="px-4 py-2 text-sm text-[#666666]">{month.users}</td>
                  <td className="px-4 py-2 text-sm text-[#666666]">{month.jobs}</td>
                  <td className="px-4 py-2 text-sm text-[#666666]">${month.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
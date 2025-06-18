import React, { useState } from 'react';
import { MessageSquare, Search, Clock, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

type Conversation = {
  id: string;
  job_id: string;
  job_title: string;
  other_user: {
    id: string;
    username: string;
    profile_picture_url: string;
    user_type: string;
  };
  last_message: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count: number;
};

export default function MessagesDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: conversations, refetch } = useQuery({
    queryKey: ['conversations-dropdown', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Step 1: Get all jobs where user is business owner
      const { data: businessJobs } = await supabase
        .from('jobs')
        .select('id, title, business_id')
        .eq('business_id', user.id);

      // Step 2: Get all jobs where user has accepted bids
      const { data: freelancerBids } = await supabase
        .from('bids')
        .select('job_id, jobs(id, title, business_id)')
        .eq('freelancer_id', user.id)
        .eq('status', 'accepted');

      // Combine all relevant jobs
      const allJobs = [
        ...(businessJobs || []),
        ...(freelancerBids?.map(bid => bid.jobs).filter(Boolean) || [])
      ];

      if (allJobs.length === 0) return [];

      const conversations: Conversation[] = [];

      for (const job of allJobs) {
        // Check if this job has any messages
        const { data: jobMessages } = await supabase
          .from('messages')
          .select('id')
          .eq('job_id', job.id)
          .limit(1);

        if (!jobMessages || jobMessages.length === 0) continue;

        // Determine the other user
        const isBusinessOwner = job.business_id === user.id;
        let otherUserId: string | null = null;

        if (isBusinessOwner) {
          // Find freelancer with accepted bid
          const { data: acceptedBid } = await supabase
            .from('bids')
            .select('freelancer_id')
            .eq('job_id', job.id)
            .eq('status', 'accepted')
            .maybeSingle();
          
          otherUserId = acceptedBid?.freelancer_id || null;
        } else {
          // Other user is the business owner
          otherUserId = job.business_id;
        }

        if (!otherUserId || otherUserId === user.id) continue;

        // Get other user's profile
        const { data: otherUser } = await supabase
          .from('profiles')
          .select('id, username, profile_picture_url, user_type')
          .eq('id', otherUserId)
          .single();

        if (!otherUser) continue;

        // Get last message
        const { data: lastMessage } = await supabase
          .from('messages')
          .select('content, created_at, sender_id')
          .eq('job_id', job.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Count unread messages
        const { count: unreadCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('job_id', job.id)
          .eq('read', false)
          .neq('sender_id', user.id);

        conversations.push({
          id: `${job.id}-${otherUserId}`,
          job_id: job.id,
          job_title: job.title,
          other_user: otherUser,
          last_message: lastMessage || {
            content: 'No messages yet',
            created_at: new Date().toISOString(),
            sender_id: '',
          },
          unread_count: unreadCount || 0,
        });
      }

      // Sort by last message time
      return conversations.sort((a, b) => 
        new Date(b.last_message.created_at).getTime() - 
        new Date(a.last_message.created_at).getTime()
      );
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const filteredConversations = conversations?.filter(conv =>
    conv.other_user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.job_title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalUnread = conversations?.reduce((sum, conv) => sum + conv.unread_count, 0) || 0;

  const formatName = (username: string): string => {
    const parts = username.split(/[\s_-]/);
    if (parts.length > 1) {
      return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
    }
    return `${username.slice(0, -1)}${username.charAt(username.length - 1)}.`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#666666] hover:text-[#1a1a1a] transition-colors"
      >
        <MessageSquare className="w-5 h-5" />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-[#e5e5e5] z-50">
            <div className="p-4 border-b border-[#e5e5e5]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-[#1a1a1a]">Messages</h3>
                {totalUnread > 0 && (
                  <span className="text-xs text-[#0463fb] bg-[#f0f4ff] px-2 py-1 rounded-full">
                    {totalUnread} unread
                  </span>
                )}
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#666666]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <Link
                    key={conversation.id}
                    to={`/messages?job=${conversation.job_id}`}
                    onClick={() => setIsOpen(false)}
                    className="block p-4 border-b border-[#e5e5e5] hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#f0f4ff] flex items-center justify-center overflow-hidden flex-shrink-0">
                        {conversation.other_user.profile_picture_url ? (
                          <img
                            src={conversation.other_user.profile_picture_url}
                            alt={conversation.other_user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-[#0463fb]" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-[#1a1a1a] text-sm truncate">
                            {formatName(conversation.other_user.username)}
                          </h4>
                          <div className="flex items-center gap-2">
                            {conversation.unread_count > 0 && (
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                            <span className="text-xs text-[#666666]">
                              {format(new Date(conversation.last_message.created_at), 'MMM d')}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-[#666666] mb-1 truncate">
                          {conversation.job_title}
                        </p>
                        
                        <p className="text-sm text-[#666666] line-clamp-2">
                          {conversation.last_message.sender_id === user?.id ? 'You: ' : ''}
                          {conversation.last_message.content}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center text-[#666666] text-sm">
                  {searchTerm ? (
                    <>
                      <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p>No conversations found matching "{searchTerm}"</p>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p>No conversations yet</p>
                      <p className="text-xs mt-1">
                        Start a conversation by working on a project
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {filteredConversations.length > 0 && (
              <div className="p-3 border-t border-[#e5e5e5] bg-gray-50">
                <Link
                  to="/messages"
                  onClick={() => setIsOpen(false)}
                  className="text-[#0463fb] hover:text-[#0355d5] text-sm font-medium"
                >
                  View all messages →
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
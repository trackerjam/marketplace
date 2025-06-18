import React, { useState } from 'react';
import { MessageSquare, Search, Clock, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

type DirectConversation = {
  id: string;
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
  } | null;
  unread_count: number;
};

export default function DirectMessagesDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: conversations } = useQuery({
    queryKey: ['direct-conversations-dropdown', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Get all conversations for this user
      const { data: conversationsData, error } = await supabase
        .from('conversations')
        .select(`
          id,
          participant_1_id,
          participant_2_id,
          last_message_at
        `)
        .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      const conversations: DirectConversation[] = [];

      for (const conv of conversationsData || []) {
        // Determine the other user
        const otherUserId = conv.participant_1_id === user.id ? conv.participant_2_id : conv.participant_1_id;

        // Get other user's profile
        const { data: otherUser } = await supabase
          .from('profiles')
          .select('id, username, profile_picture_url, user_type')
          .eq('id', otherUserId)
          .single();

        if (!otherUser) continue;

        // Get last message
        const { data: lastMessage } = await supabase
          .from('direct_messages')
          .select('content, created_at, sender_id')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Count unread messages
        const { count: unreadCount } = await supabase
          .from('direct_messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .eq('read', false)
          .neq('sender_id', user.id);

        conversations.push({
          id: conv.id,
          other_user: otherUser,
          last_message: lastMessage,
          unread_count: unreadCount || 0,
        });
      }

      return conversations;
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const filteredConversations = conversations?.filter(conv =>
    conv.other_user.username.toLowerCase().includes(searchTerm.toLowerCase())
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
                    to={`/messages?conversation=${conversation.id}`}
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
                            {conversation.last_message && (
                              <span className="text-xs text-[#666666]">
                                {format(new Date(conversation.last_message.created_at), 'MMM d')}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-xs text-[#666666] mb-1 capitalize">
                          {conversation.other_user.user_type}
                        </p>
                        
                        {conversation.last_message && (
                          <p className="text-sm text-[#666666] line-clamp-2">
                            {conversation.last_message.sender_id === user?.id ? 'You: ' : ''}
                            {conversation.last_message.content}
                          </p>
                        )}
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
                        Start a conversation by contacting a freelancer
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
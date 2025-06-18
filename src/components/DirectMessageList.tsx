import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';
import { Send } from 'lucide-react';

type DirectMessage = {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  sender: {
    username: string;
    profile_picture_url: string;
  };
};

export default function DirectMessageList({ conversationId }: { conversationId: string }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = React.useState('');

  const { data: messages, refetch } = useQuery({
    queryKey: ['direct-messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      
      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          *,
          sender:profiles!direct_messages_sender_id_fkey(
            username,
            profile_picture_url
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
      
      return data as DirectMessage[];
    },
    enabled: !!conversationId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user?.id || !conversationId) throw new Error('Missing user or conversation ID');
      
      const { error } = await supabase
        .from('direct_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim(),
          read: false,
        });

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    },
    onSuccess: () => {
      setNewMessage('');
      refetch();
      queryClient.invalidateQueries({ queryKey: ['direct-conversations'] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    sendMessageMutation.mutate(newMessage.trim());
  };

  const formatName = (username: string): string => {
    const parts = username.split(/[\s_-]/);
    if (parts.length > 1) {
      return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
    }
    return `${username.slice(0, -1)}${username.charAt(username.length - 1)}.`;
  };

  if (!conversationId) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg">
        <p className="text-[#666666]">No conversation selected</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg border border-[#e5e5e5]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages && messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.sender_id === user?.id ? 'flex-row-reverse' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#f0f4ff] flex-shrink-0 flex items-center justify-center overflow-hidden">
                {message.sender?.profile_picture_url ? (
                  <img
                    src={message.sender.profile_picture_url}
                    alt={message.sender.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[#0463fb] text-sm">
                    {message.sender?.username ? 
                      message.sender.username.charAt(0).toUpperCase() : 
                      '?'
                    }
                  </span>
                )}
              </div>
              <div
                className={`max-w-[70%] ${
                  message.sender_id === user?.id
                    ? 'bg-[#0463fb] text-white'
                    : 'bg-[#f0f4ff] text-[#1a1a1a]'
                } rounded-lg p-3`}
              >
                <p className="text-sm mb-1 whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-75">
                  {format(new Date(message.created_at), 'MMM d, h:mm a')}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-[#666666]">
              <p className="text-sm">No messages yet</p>
              <p className="text-xs mt-1">Start the conversation below</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-[#e5e5e5]">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
            disabled={sendMessageMutation.isPending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
            className="btn-primary px-6 flex items-center gap-2"
          >
            {sendMessageMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
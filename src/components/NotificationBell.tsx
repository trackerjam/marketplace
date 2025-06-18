import React from 'react';
import { Bell } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';

export default function NotificationBell() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = React.useState(false);

  const { data: notifications, refetch } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .eq('read', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
  });

  const unreadCount = notifications?.length || 0;

  const markAsRead = async (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const markAllAsRead = async () => {
    markAllAsReadMutation.mutate();
  };

  const getNotificationContent = (notification: any) => {
    switch (notification.type) {
      case 'new_message':
        return {
          title: 'New Message',
          content: `New message in project "${notification.data.job_title}"`,
          action: () => {
            markAsRead(notification.id);
            window.location.href = `/messages?job=${notification.data.job_id}`;
          },
        };
      case 'new_direct_message':
        return {
          title: 'New Message',
          content: `New message from ${notification.data.sender_username}`,
          action: () => {
            markAsRead(notification.id);
            window.location.href = `/messages?conversation=${notification.data.conversation_id}`;
          },
        };
      case 'contact_request':
        return {
          title: 'Contact Request',
          content: `${notification.data.from_username} sent you a message: "${notification.data.subject}"`,
          action: () => {
            markAsRead(notification.id);
            if (notification.data.job_id) {
              window.location.href = `/messages?job=${notification.data.job_id}`;
            }
          },
        };
      case 'job_invitation':
        return {
          title: 'Job Invitation',
          content: `You've been invited to work on "${notification.data.job_title}" - $${notification.data.job_budget}`,
          action: () => {
            markAsRead(notification.id);
            window.location.href = `/jobs/${notification.data.job_id}`;
          },
        };
      case 'freelancer_saved':
        return {
          title: 'Freelancer Saved',
          content: `You saved ${notification.data.freelancer_name} to your favorites`,
          action: () => {
            markAsRead(notification.id);
          },
        };
      default:
        return {
          title: 'Notification',
          content: 'You have a new notification',
          action: () => {
            markAsRead(notification.id);
          },
        };
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#666666] hover:text-[#1a1a1a] transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
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
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-[#e5e5e5] z-50">
            <div className="p-4 border-b border-[#e5e5e5] flex items-center justify-between">
              <h3 className="font-medium text-[#1a1a1a]">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={markAllAsReadMutation.isPending}
                  className="text-xs text-[#0463fb] hover:text-[#0355d5] disabled:opacity-50"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications && notifications.length > 0 ? (
                notifications.map((notification) => {
                  const { title, content, action } = getNotificationContent(notification);
                  return (
                    <div
                      key={notification.id}
                      className="p-4 border-b border-[#e5e5e5] hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        action();
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1a1a1a] mb-1">{title}</p>
                          <p className="text-xs text-[#666666] line-clamp-2">{content}</p>
                          <p className="text-xs text-[#999999] mt-1">
                            {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          disabled={markAsReadMutation.isPending}
                          className="text-xs text-[#0463fb] hover:text-[#0355d5] flex-shrink-0 disabled:opacity-50"
                        >
                          Mark read
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-[#666666] text-sm">
                  <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p>No new notifications</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
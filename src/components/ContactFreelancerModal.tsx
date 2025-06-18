import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { X, MessageSquare, Send } from 'lucide-react';

interface ContactFreelancerModalProps {
  freelancerId: string;
  freelancerName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ContactForm {
  subject: string;
  message: string;
}

export default function ContactFreelancerModal({ 
  freelancerId, 
  freelancerName, 
  isOpen, 
  onClose 
}: ContactFreelancerModalProps) {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactForm>();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: ContactForm) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get or create conversation between current user and freelancer
      const { data: conversationId, error: convError } = await supabase
        .rpc('get_or_create_conversation', {
          user1_id: user.id,
          user2_id: freelancerId
        });

      if (convError) throw convError;

      // Create the message with subject included in content
      const messageContent = `Subject: ${data.subject}\n\n${data.message}`;
      
      const { error: messageError } = await supabase
        .from('direct_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: messageContent,
          read: false
        });

      if (messageError) throw messageError;

      setSuccess(true);
      reset();
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#e5e5e5]">
          <div className="flex items-center gap-3">
            <div className="bg-[#f0f4ff] w-10 h-10 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#0463fb]" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-[#1a1a1a]">Contact Freelancer</h2>
              <p className="text-sm text-[#666666]">Send a message to {freelancerName}</p>
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
              <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Message Sent!</h3>
              <p className="text-[#666666] mb-4">Your message has been sent to {freelancerName}.</p>
              <p className="text-sm text-[#666666]">You can continue the conversation in your Messages.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[#1a1a1a] mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  {...register('subject', { required: 'Subject is required' })}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent"
                  placeholder="Project inquiry, collaboration, etc."
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#1a1a1a] mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  rows={6}
                  {...register('message', { 
                    required: 'Message is required',
                    minLength: { value: 20, message: 'Message must be at least 20 characters' }
                  })}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0463fb] focus:border-transparent resize-vertical"
                  placeholder="Describe your project or inquiry in detail..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-700 text-sm">
                  <strong>Note:</strong> This will create a direct conversation that you can continue in your Messages section.
                </p>
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
                  disabled={isLoading}
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
                      Send Message
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
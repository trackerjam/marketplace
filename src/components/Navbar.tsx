import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, UserCircle, LayoutDashboard, Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import NotificationBell from './NotificationBell';
import DirectMessagesDropdown from './DirectMessagesDropdown';

export default function Navbar() {
  const { user, signOut } = useAuth();

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

  // Check if user is admin from database field
  const isAdmin = profile?.admin === true;

  return (
    <nav className="bg-white border-b border-[#e5e5e5]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex flex-col">
            <span className="text-lg font-medium text-[#1a1a1a]">Freelance Marketplace</span>
            <span className="text-xs text-[#666666]">by Trackerjam</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link 
              to="/freelancers" 
              className="text-[#666666] hover:text-[#1a1a1a] text-sm font-medium transition-colors"
            >
              Browse Freelancers
            </Link>
            <Link 
              to="/jobs" 
              className="text-[#666666] hover:text-[#1a1a1a] text-sm font-medium transition-colors"
            >
              Browse Jobs
            </Link>
            <Link 
              to="/docs" 
              className="text-[#666666] hover:text-[#1a1a1a] text-sm font-medium transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                Documentation
              </span>
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-6">
                <Link 
                  to="/dashboard" 
                  className="text-[#666666] hover:text-[#1a1a1a] text-sm font-medium transition-colors flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className="text-[#666666] hover:text-[#1a1a1a] text-sm font-medium transition-colors flex items-center gap-1.5"
                >
                  <UserCircle className="w-4 h-4" />
                  Profile
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-[#666666] hover:text-[#1a1a1a] text-sm font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <DirectMessagesDropdown />
                <NotificationBell />
                <button
                  onClick={() => signOut()}
                  className="text-[#666666] hover:text-[#1a1a1a] text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[#666666] hover:text-[#1a1a1a] text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
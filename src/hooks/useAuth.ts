import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    // Check if user is already logged out locally
    if (!user) {
      console.info('User already logged out locally, no server-side logout needed');
      return;
    }

    // Immediately clear the local user state
    setUser(null);
    
    try {
      // Check if there's an active session before attempting to sign out
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Check if the session token has expired locally
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const expiresAt = session.expires_at || 0;
        
        if (currentTime >= expiresAt) {
          // Token has already expired locally, no need to call the server
          console.info('Session token already expired locally, user successfully logged out');
          return;
        }
        
        // Token is still valid, proceed with server-side sign out
        await supabase.auth.signOut();
      } else {
        // No active session, so no need to call signOut
        console.info('No active session found, user successfully logged out locally');
      }
    } catch (error: any) {
      // Check if this is the expected 'session_not_found' error
      if (error?.message?.includes('session_not_found') || error?.message?.includes('Session from session_id claim in JWT does not exist')) {
        // This is expected when the session has already expired - log as info
        console.info('Session already expired or invalidated, user successfully logged out locally');
      } else {
        // For other unexpected errors, log as warning
        console.warn('Supabase signOut failed, but local session cleared:', error);
      }
    }
  };

  return {
    user,
    loading,
    signOut,
  };
}
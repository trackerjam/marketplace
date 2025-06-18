import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionManager } from '../lib/security';
import { useAuth } from './useAuth';

export function useSession() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    // Start session on mount
    SessionManager.startSession();

    // Check session status every minute
    const interval = setInterval(() => {
      if (SessionManager.isSessionExpired()) {
        signOut();
        navigate('/login');
      }
    }, 60000);

    // Update activity on user interaction
    const handleActivity = () => {
      SessionManager.updateActivity();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [navigate, signOut]);
}
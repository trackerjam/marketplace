import { z } from 'zod';

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
}

// Rate limiting helper
export class RateLimiter {
  private attempts: Map<string, { count: number; timestamp: number }> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number, windowMs: number) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isRateLimited(key: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt) {
      this.attempts.set(key, { count: 1, timestamp: now });
      return false;
    }

    if (now - attempt.timestamp > this.windowMs) {
      this.attempts.set(key, { count: 1, timestamp: now });
      return false;
    }

    if (attempt.count >= this.maxAttempts) {
      return true;
    }

    attempt.count++;
    return false;
  }
}

// Session management
export class SessionManager {
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  static startSession(): void {
    const session = {
      startTime: Date.now(),
      lastActivity: Date.now(),
    };
    localStorage.setItem('session', JSON.stringify(session));
  }

  static updateActivity(): void {
    const sessionStr = localStorage.getItem('session');
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      session.lastActivity = Date.now();
      localStorage.setItem('session', JSON.stringify(session));
    }
  }

  static isSessionExpired(): boolean {
    const sessionStr = localStorage.getItem('session');
    if (!sessionStr) return true;

    const session = JSON.parse(sessionStr);
    const inactiveTime = Date.now() - session.lastActivity;
    return inactiveTime > SessionManager.SESSION_TIMEOUT;
  }

  static endSession(): void {
    localStorage.removeItem('session');
  }
}

// Security headers
export const securityHeaders = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://*.supabase.co https://api.stripe.com; " +
    "frame-src 'self' https://js.stripe.com;",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};
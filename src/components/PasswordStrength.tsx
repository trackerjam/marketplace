import React from 'react';
import { passwordSchema } from '../lib/security';

export default function PasswordStrength({ password }: { password: string }) {
  const getStrength = (): { score: number; label: string; color: string } => {
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password)
    ];

    const score = checks.filter(Boolean).length;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { score, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 4) return { score, label: 'Good', color: 'bg-blue-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const { score, label, color } = getStrength();

  return (
    <div className="mt-1">
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
      <p className={`text-sm mt-1 ${color.replace('bg-', 'text-')}`}>
        Password strength: {label}
      </p>
    </div>
  );
}
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle } from 'lucide-react';
import { passwordSchema, sanitizeInput, RateLimiter } from '../lib/security';
import PasswordStrength from '../components/PasswordStrength';

type RegisterForm = {
  email: string;
  password: string;
  username: string;
  userType: 'business' | 'freelancer';
};

// Rate limiter: 5 attempts per 15 minutes
const rateLimiter = new RateLimiter(5, 15 * 60 * 1000);

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    try {
      setRegistrationError(null);

      // Check rate limiting
      const ipAddress = crypto.randomUUID(); // In production, use actual IP
      if (rateLimiter.isRateLimited(ipAddress)) {
        throw new Error('Too many registration attempts. Please try again later.');
      }

      // Validate password
      const passwordValidation = passwordSchema.safeParse(data.password);
      if (!passwordValidation.success) {
        throw new Error(passwordValidation.error.errors[0].message);
      }

      // Sanitize inputs
      const sanitizedUsername = sanitizeInput(data.username);
      const sanitizedEmail = sanitizeInput(data.email);

      // Sign up the user
      const { error: signUpError, data: authData } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: data.password,
        options: {
          data: {
            username: sanitizedUsername,
          }
        }
      });

      if (signUpError) {
        if (signUpError.message === 'User already registered') {
          throw new Error('This email is already registered. Please use a different email or try logging in.');
        }
        throw signUpError;
      }

      // Create the profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email: sanitizedEmail,
              username: sanitizedUsername,
              user_type: data.userType,
            },
          ]);

        if (profileError) throw profileError;

        setIsSuccess(true);
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Error registering:', error);
      setRegistrationError(error instanceof Error ? error.message : 'An unexpected error occurred during registration. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-4">
            Your account has been created. Redirecting you to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Create an Account</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {registrationError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {registrationError}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              {...register('username', { 
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
                pattern: {
                  value: /^[a-zA-Z0-9_-]+$/,
                  message: 'Username can only contain letters, numbers, underscores, and hyphens'
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password', { 
                required: 'Password is required',
                validate: value => {
                  try {
                    passwordSchema.parse(value);
                    return true;
                  } catch (error) {
                    return error.errors[0].message;
                  }
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {password && <PasswordStrength password={password} />}
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
              I am a...
            </label>
            <select
              id="userType"
              {...register('userType', { required: 'Please select a user type' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select user type</option>
              <option value="freelancer">Freelancer</option>
              <option value="business">Business</option>
            </select>
            {errors.userType && (
              <p className="mt-1 text-sm text-red-600">{errors.userType.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Account
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
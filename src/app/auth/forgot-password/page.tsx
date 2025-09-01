"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

function ForgotPasswordPageContent() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Password reset error:', error);
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black">
        
        <div className="pt-20 pb-20 px-4 lg:px-[70px]">
          <div className="max-w-md mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-green-400" />
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-normal text-white mb-4 tracking-wider">
                Check Your Email
              </h1>
              
              <p className="text-white/70 text-lg mb-8">
                We've sent a password reset link to <br />
                <span className="text-white font-medium">{email}</span>
              </p>
              
              <div className="space-y-4">
                <p className="text-white/60 text-sm">
                  Didn't receive the email? Check your spam folder or
                </p>
                
                <motion.button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-white hover:text-white/80 font-medium transition-colors underline"
                >
                  try again
                </motion.button>
              </div>
              
              <div className="mt-12">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center text-white/70 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      
      <div className="pt-20 pb-20 px-4 lg:px-[70px]">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-normal text-white mb-4 tracking-wider">
              Reset Password
            </h1>
            <p className="text-white/70 text-lg">
              Enter your email to receive a reset link
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-white text-sm uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/50" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${
                    errors.email ? 'border-red-500' : 'border-white/20'
                  } rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors`}
                  placeholder="Enter your email address"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-red-400 text-sm">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className={`w-full py-4 bg-white text-black font-medium uppercase tracking-wider rounded-lg transition-all duration-300 ${
                isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin mr-2"></div>
                  Sending Reset Link...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </motion.button>

            {/* Back to Login */}
            <div className="text-center pt-6">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Link>
            </div>
          </motion.form>
        </div>
        </div>
      </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <ProtectedRoute requireAuth={false}>
      <ForgotPasswordPageContent />
    </ProtectedRoute>
  );
}
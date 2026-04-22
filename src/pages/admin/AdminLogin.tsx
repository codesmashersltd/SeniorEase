import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, HeartHandshake } from 'lucide-react';
import { motion } from 'motion/react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function AdminLogin() {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      // Enforce Google Sign-In for Admin
      await signInWithPopup(auth, provider);
      
      localStorage.setItem('isAdminLoggedIn', 'true');
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto w-16 h-16 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg mb-6">
          <HeartHandshake size={32} className="text-white" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-white">
          SeniorEase Admin
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Sign in to access the secure management dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-700"
        >
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {error && (
              <div className="text-red-400 text-sm font-medium text-center bg-red-900/20 py-2 rounded-lg border border-red-900/50">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-gray-900 transition-all disabled:bg-teal-800 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Authenticating...' : 'Sign in securely with Google'}
              </button>
            </div>
            
            <div className="mt-4 text-center text-xs text-gray-500">
              <p>Admin access requires authorized Google identity verification.</p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

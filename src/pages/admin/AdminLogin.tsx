import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Key, AlertCircle, Loader2 } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function AdminLogin() {
  const [activeTab, setActiveTab] = useState<'email' | 'google'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Hardcoded defaults
      let validUser = 'Administrator';
      let validPass = '123456';

      try {
        // Attempt to check Firestore for custom credentials
        const credsDoc = await getDoc(doc(db, 'admin_settings', 'credentials'));
        if (credsDoc.exists()) {
          validUser = credsDoc.data().username || validUser;
          validPass = credsDoc.data().password || validPass;
        }
      } catch (dbErr) {
        console.warn("Note: Using default credentials as remote settings couldn't be loaded yet.", dbErr);
      }

      if (email === validUser && password === validPass) {
        localStorage.setItem('admin_access', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err: any) {
      console.error('Login logic error:', err);
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const isSuperAdmin = user.email === 'yashkumars@gmail.com';
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));

      if (adminDoc.exists() || isSuperAdmin) {
        navigate('/admin/dashboard');
      } else {
        await auth.signOut();
        setError(`Access denied (${user.email}). Unauthorized account.`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login via Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 selection:bg-[#009688] selection:text-white">
      <div className="w-full max-w-[480px]">
        {/* Header */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl font-bold text-[#092C4C] mb-2">Welcome back</h1>
          <p className="text-gray-500 font-medium">Sign in to manage your services pipeline.</p>
        </div>

        {/* Tabs */}
        <div className="bg-gray-100/80 p-1.5 rounded-xl flex mb-8 animate-in fade-in duration-700 delay-200">
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${
              activeTab === 'email' ? 'bg-white text-[#009688] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Email & Password
          </button>
          <button
            onClick={() => setActiveTab('google')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${
              activeTab === 'google' ? 'bg-white text-[#009688] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Google
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Forms */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          {activeTab === 'email' ? (
            <form onSubmit={handleCustomLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#092C4C]">Email Address</label>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Administrator"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#009688]/20 focus:border-[#009688] transition-all"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#009688] transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#092C4C]">Password</label>
                <div className="relative group">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#009688]/20 focus:border-[#009688] transition-all"
                    required
                  />
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#009688] transition-colors" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#009688] hover:bg-[#00796B] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#009688]/20 flex items-center justify-center disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin text-white" /> : 'Sign In'}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full h-14 border border-gray-200 rounded-xl flex items-center justify-center gap-4 hover:bg-gray-50 hover:border-gray-300 transition-all font-bold text-[#092C4C] active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-[#009688]" />
                ) : (
                  <>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="h-5 w-5" />
                    Sign in with Google Admin
                  </>
                )}
              </button>
              <p className="text-xs text-center text-gray-400 italic">
                Authorized primary admin: yashkumars@gmail.com
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm space-y-8 animate-in fade-in duration-1000 delay-500">
          <p className="text-[#009688] font-bold hover:underline cursor-pointer transition-all">Don't have an account? Register</p>
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center"><span className="bg-white px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Secure Access</span></div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-400 font-medium px-10">Access your dashboard securely from any device.</p>
            <p className="text-[10px] text-gray-400 font-medium max-w-[320px] mx-auto leading-relaxed">
              By continuing, you agree to our <span className="text-[#009688] font-bold hover:underline cursor-pointer">Terms of Service</span> and <span className="text-[#009688] font-bold hover:underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Key, AlertCircle, Loader2 } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import adminBgImage from '../../assets/images/senior_tech_support_hero_1784467941699.jpg';

export default function AdminLogin() {
  const [activeTab, setActiveTab] = useState<'email' | 'google'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
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
          validUser = credsDoc.data().username || credsDoc.data().email || validUser;
          validPass = credsDoc.data().password || validPass;
        }
      } catch (dbErr) {
        console.warn("Note: Using default credentials as remote settings couldn't be loaded yet.", dbErr);
      }

      const normalizedInput = email.trim().toLowerCase();
      const cleanPassword = password.trim();
      const normalizedValidUser = validUser.trim().toLowerCase();

      const isValidAdminUser = 
        normalizedInput === normalizedValidUser ||
        normalizedInput === 'administrator' ||
        normalizedInput === 'admin' ||
        normalizedInput === 'demo' ||
        normalizedInput === 'yashkumars@gmail.com' ||
        normalizedInput === 'admin@seniorease.com';

      const isValidAdminPass = 
        cleanPassword === validPass || 
        cleanPassword === '123456';

      if (isValidAdminUser && isValidAdminPass) {
        localStorage.setItem('admin_access', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials. Please use admin / 123456 or your configured password.');
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
    setUnauthorizedDomain(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userEmail = user.email?.toLowerCase() || '';
      const isSuperAdmin = userEmail === 'yashkumars@gmail.com' || userEmail === 'admin@seniorease.com';
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));

      let isEmailAdmin = false;
      try {
        if (userEmail) {
          const qAdmin = query(collection(db, 'admins'), where('email', '==', userEmail));
          const adminSnap = await getDocs(qAdmin);
          if (!adminSnap.empty) {
            isEmailAdmin = true;
          }
        }
      } catch (e) {
        console.warn("Admin collection email query warning:", e);
      }

      if (adminDoc.exists() || isSuperAdmin || isEmailAdmin) {
        localStorage.setItem('admin_access', 'true');
        navigate('/admin/dashboard');
      } else {
        await auth.signOut();
        setError(`Access denied (${user.email}). Account is not listed in admin directory.`);
      }
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      if (err.code === 'auth/unauthorized-domain' || err.message?.includes('unauthorized-domain')) {
        setUnauthorizedDomain(window.location.hostname);
        setError('This domain is not authorized in your Firebase project configuration.');
      } else if (err.code === 'auth/missing-or-invalid-nonce' || err.message?.includes('nonce') || err.message?.includes('duplicate credential')) {
        setError('Google sign-in session refreshed. Please click "Sign in with Google Admin" again to continue.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completing authentication. Please try again.');
      } else {
        setError(err.message || 'Failed to login via Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-[#009688] selection:text-white">
      {/* Attractive Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={adminBgImage} 
          alt="SeniorEase Admin Hub" 
          className="w-full h-full object-cover object-center opacity-50 transform scale-105 transition-all duration-[10s] ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/60 to-teal-950/80"></div>
      </div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[500px] bg-slate-900/60 sm:bg-slate-900/50 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/20 relative z-10 text-white">
        {/* Decorative header accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 rounded-t-3xl"></div>

        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-teal-500/30 to-emerald-500/20 text-teal-300 border border-teal-400/30 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner font-bold text-2xl">
            🔒
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Admin Portal</h1>
          <p className="text-teal-100/80 font-medium text-sm">Sign in to manage your customer pipeline and support team.</p>
        </div>

        {/* Tabs */}
        <div className="bg-white/10 p-1.5 rounded-xl flex mb-8 border border-white/15 animate-in fade-in duration-700 delay-200">
          <button
            onClick={() => {
              setActiveTab('email');
              setError(null);
              setUnauthorizedDomain(null);
            }}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${
              activeTab === 'email' ? 'bg-teal-600 text-white shadow-md' : 'text-teal-100/70 hover:text-white'
            }`}
          >
            Email & Password
          </button>
          <button
            onClick={() => {
              setActiveTab('google');
              setError(null);
              setUnauthorizedDomain(null);
            }}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${
              activeTab === 'google' ? 'bg-teal-600 text-white shadow-md' : 'text-teal-100/70 hover:text-white'
            }`}
          >
            Google
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-950/80 border border-red-500/40 text-red-300 p-4 rounded-xl flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-400" />
            <div className="space-y-1">
              <p className="font-semibold text-white">{error}</p>
              {unauthorizedDomain && (
                <div className="mt-3 text-xs text-red-200 space-y-2 border-t border-red-500/30 pt-3">
                  <p>
                    The domain <strong className="font-black underline">{unauthorizedDomain}</strong> is not listed as an Authorized Domain in your Firebase project <code className="bg-red-900/80 px-1.5 py-0.5 rounded font-mono text-white">gen-lang-client-0483352558</code>.
                  </p>
                  <p className="font-bold text-white">How to resolve this in Firebase Console:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-red-200 font-medium">
                    <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-bold text-white hover:text-red-100">Firebase Console</a>.</li>
                    <li>Open your project: <strong className="font-bold text-white">gen-lang-client-0483352558</strong>.</li>
                    <li>Navigate to <strong className="font-bold text-white">Build &gt; Authentication &gt; Settings</strong> tab.</li>
                    <li>Scroll down to <strong className="font-bold text-white">Authorized domains</strong>.</li>
                    <li>Click <strong className="font-bold text-white">Add domain</strong> and add <code className="bg-red-900/80 px-1 py-0.5 rounded font-mono text-white">{unauthorizedDomain}</code>.</li>
                  </ol>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('email');
                        setEmail('yashkumars@gmail.com');
                        setPassword('123456');
                        setError(null);
                        setUnauthorizedDomain(null);
                      }}
                      className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-xs shadow transition-all flex items-center justify-center gap-2"
                    >
                      🔑 Switch to Email & Password Sign-In (Instant Access)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Forms */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          {activeTab === 'email' ? (
            <form onSubmit={handleCustomLogin} className="space-y-5" autoComplete="off">
              {/* Quick Admin Helper Banner */}
              <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-3 text-xs text-teal-100 flex items-center justify-between gap-2 shadow-inner">
                <div>
                  <span className="font-bold text-teal-300 block">⚡ Admin Credentials:</span>
                  <span className="text-teal-100/80">User: <code className="text-white font-mono font-bold bg-teal-900/60 px-1 py-0.5 rounded">admin</code> | Pass: <code className="text-white font-mono font-bold bg-teal-900/60 px-1 py-0.5 rounded">123456</code></span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin');
                    setPassword('123456');
                    setError(null);
                  }}
                  className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
                >
                  Autofill
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-teal-100">Email Address</label>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Admin Email / Username"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 bg-white/10 border border-white/25 rounded-xl pl-12 pr-4 text-sm text-white placeholder-teal-100/40 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-300 group-focus-within:text-teal-200 transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-teal-100">Password</label>
                <div className="relative group">
                  <input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 bg-white/10 border border-white/25 rounded-xl pl-12 pr-4 text-sm text-white placeholder-teal-100/40 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all"
                    required
                  />
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-300 group-focus-within:text-teal-200 transition-colors" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-950/50 flex items-center justify-center disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin text-white" /> : 'Sign In'}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full h-14 bg-white/10 border border-white/25 rounded-xl flex items-center justify-center gap-4 hover:bg-white/20 transition-all font-bold text-white shadow-sm active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-teal-300" />
                ) : (
                  <>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="h-5 w-5" referrerPolicy="no-referrer" />
                    Sign in with Google Admin
                  </>
                )}
              </button>
              <p className="text-xs text-center text-teal-100/60 italic">
                Authorized primary admin: yashkumars@gmail.com
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm space-y-8 animate-in fade-in duration-1000 delay-500">
          <p className="text-teal-300 font-bold hover:underline cursor-pointer transition-all">Don't have an account? Register</p>
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/15"></div></div>
            <div className="relative flex justify-center"><span className="bg-slate-900 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-teal-200/60">Secure Access</span></div>
          </div>

          <div className="space-y-4">
            <p className="text-teal-100/80 font-medium px-10">Access your dashboard securely from any device.</p>
            <p className="text-[10px] text-teal-100/60 font-medium max-w-[320px] mx-auto leading-relaxed">
              By continuing, you agree to our <span className="text-teal-300 font-bold hover:underline cursor-pointer">Terms of Service</span> and <span className="text-teal-300 font-bold hover:underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, AlertCircle, Loader2, ShieldCheck, Terminal as TerminalIcon } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const styles = {
  container: 'min-h-screen bg-[#E4E3E0] flex flex-col items-center justify-center p-8 font-sans text-[#141414]',
  card: 'max-w-md w-full border border-[#141414] bg-white p-12 relative overflow-hidden',
  mono: 'font-mono text-[10px] uppercase tracking-widest leading-none',
  button: 'w-full flex justify-center items-center gap-4 py-4 px-6 border border-[#141414] bg-white hover:bg-[#141414] hover:text-[#E4E3E0] text-xs font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50',
};

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        setError(`ACCESS DENIED: ${user.email}. AUTHORIZATION REQUIRED.`);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message?.toUpperCase() || 'SYSTEM AUTHENTICATION FAILED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#141414 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg z-10"
      >
        {/* Institutional Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="bg-[#141414] p-3">
              <ShieldCheck className="h-6 w-6 text-[#E4E3E0]" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">SENIOR EASE</h1>
          </div>
          <p className={styles.mono + ' opacity-50'}>Unified Administrative Gateway</p>
        </div>

        <div className={styles.card}>
          {/* Top Line Signal */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-[#141414] opacity-10" />
          
          <div className="mb-10">
            <h2 className="text-lg font-black uppercase tracking-widest mb-2 flex items-center gap-2">
              <TerminalIcon size={18} />
              Identity Verification
            </h2>
            <p className="font-serif italic text-xs text-[#141414]/60">Secure tunnel establishment required for console access.</p>
          </div>

          <div className="space-y-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 border border-red-600 bg-red-600/5 text-red-600 flex gap-4"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                <div className="space-y-1">
                  <p className={styles.mono + ' font-bold'}>Auth_Error_0x1</p>
                  <p className="text-[11px] font-bold uppercase leading-tight">{error}</p>
                </div>
              </motion.div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className={styles.button}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-current" />
                  <span>NEGOTIATING...</span>
                </>
              ) : (
                <>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="h-4 w-4" />
                  <span>VERIFY VIA GOOGLE CLOUD</span>
                </>
              )}
            </button>

            <div className="flex flex-col gap-4 pt-4 border-t border-[#141414]/10">
              <div className="flex items-center justify-between">
                <span className={styles.mono + ' opacity-40'}>Protocol</span>
                <span className={styles.mono}>SSL / AES-256</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={styles.mono + ' opacity-40'}>Environment</span>
                <span className={styles.mono}>Production_Node_1</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className={styles.mono + ' opacity-30 px-12 leading-relaxed'}>
            THIS IS A PROTECTED RESOURCE. UNAUTHORIZED ATTEMPTS WILL BE TRACED TO SOURCE ADDR.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

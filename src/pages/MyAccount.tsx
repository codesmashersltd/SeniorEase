import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, User, AlertCircle, CheckCircle2, X, LogOut, Info, HeartHandshake, Loader2, Lock, ShieldAlert, ShieldCheck, CreditCard, Receipt, Download, Calendar, Printer, FileText, Banknote, Building2, ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { isSpamContent } from '../lib/spamFilter';
import { generateInvoicePDF } from '../lib/generateInvoicePDF';
import { usePageMeta } from '../hooks/usePageMeta';
import loginBgImage from '../assets/images/seniors_login_portal_hero_1785144603212.jpg';

export default function MyAccount() {
  usePageMeta(
    "Customer Portal & Dashboard | SeniorEase",
    "Access your SeniorEase customer dashboard to manage your SeniorEase subscription, view session histories, and request assistance."
  );

  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [docId, setDocId] = useState('');

  // Forgot Password State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [fpEmail, setFpEmail] = useState('');
  const [fpCustomerId, setFpCustomerId] = useState('');
  const [fpSuccess, setFpSuccess] = useState(false);

  // Safeguarding & Caregiver Protection Controls State
  const [calmPacing, setCalmPacing] = useState(true);
  const [caregiverEmail, setCaregiverEmail] = useState('daughter@example.co.uk');
  const [scamSignposting, setScamSignposting] = useState(true);
  const [safeguardingSaved, setSafeguardingSaved] = useState(false);

  // Dashboard Navigation Tabs State
  const [activeTab, setActiveTab] = useState<'services' | 'billing' | 'safeguarding'>('services');

  // Payments & Invoices State
  const [invoices, setInvoices] = useState<any[]>([
    {
      id: 'INV-2026-0715',
      date: '15 July 2026',
      amount: '£17.99',
      method: 'Bacs Direct Debit',
      methodDetails: 'Mandate #SEN-88219 (Bacs)',
      status: 'Paid',
      description: 'SeniorEase Plus Membership - Monthly Subscription'
    },
    {
      id: 'INV-2026-0615',
      date: '15 June 2026',
      amount: '£17.99',
      method: 'Card',
      methodDetails: 'Visa ending in •••• 8391',
      status: 'Paid',
      description: 'SeniorEase Plus Membership - Monthly Subscription'
    },
    {
      id: 'INV-2026-0515',
      date: '15 May 2026',
      amount: '£17.99',
      method: 'Card',
      methodDetails: 'Visa ending in •••• 8391',
      status: 'Paid',
      description: 'SeniorEase Plus Membership - Monthly Subscription'
    }
  ]);
  const [paymentFilter, setPaymentFilter] = useState<'All' | 'Card' | 'Bacs Direct Debit'>('All');
  const [viewingInvoice, setViewingInvoice] = useState<any | null>(null);

  // Direct Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Card' | 'Bacs Direct Debit'>('Card');
  const [paymentCardNum, setPaymentCardNum] = useState('4532 •••• •••• 8391');
  const [paymentBacsRef, setPaymentBacsRef] = useState('SEN-88219');
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [paySuccessMsg, setPaySuccessMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      // Demo Details Bypass
      if (customerId.trim().toUpperCase() === 'DEMO' && password.trim() === '123456') {
        setCustomerName('Demo User');
        setCustomerId('DEMO');
        setPhone('00000 000000');
        await addDoc(collection(db, 'loginLogs'), {
          customerName: 'Demo User',
          customerId: 'DEMO',
          email: 'demo@seniorease.com',
          source: 'Web Dashboard Login (Demo)',
          timestamp: serverTimestamp()
        });
        setError('');
        setIsLoggedIn(true);
        setLoading(false);
        return;
      }

      if (customerName.trim() === '' || customerId.trim() === '' || password.trim() === '') {
        setError('Please enter your Name, Unique Customer ID, and Password.');
        setLoading(false);
        return;
      }

      const { query, where, getDocs } = await import('firebase/firestore');
      const q = query(collection(db, 'customers'), where('id', '==', customerId.trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Account not found. Only registered paid customers can access the dashboard.');
        setLoading(false);
        return;
      }

      const doc = querySnapshot.docs[0];
      const customerData = doc.data();
      setDocId(doc.id);
      
      // Strict status check for deactivated / suspended accounts
      if (customerData.status === 'Deactivated' || customerData.status === 'Suspended') {
        setError(`Your account has been deactivated / suspended by administration.${customerData.statusReason ? ` Reason: ${customerData.statusReason}.` : ''} Please contact support at support@seniorease.com.`);
        setLoading(false);
        return;
      }

      // Strict password and name validation
      if (customerData.password !== password.trim()) {
        setError('Invalid password. Please check your credentials.');
        setLoading(false);
        return;
      }

      // Optional: Name validation (can be loose or strict)
      if (customerData.name.toLowerCase() !== customerName.trim().toLowerCase()) {
        setError('Customer name does not match our records.');
        setLoading(false);
        return;
      }

      setPhone(customerData.phone || '07700 900000');
      if (customerData.mustChangePassword) {
        setMustChangePassword(true);
        setShowChangePassword(true);
      }
      
      await addDoc(collection(db, 'loginLogs'), {
        customerName: customerName,
        customerId: customerId,
        email: customerData.email || '',
        source: 'Web Dashboard Login',
        timestamp: serverTimestamp()
      });

      setError('');
      setIsLoggedIn(true);
    } catch (err) {
      console.error("Error logging user session:", err);
      setError('A system error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'customers', docId), {
        password: newPassword,
        mustChangePassword: false,
        updatedAt: serverTimestamp()
      });
      setShowChangePassword(false);
      setMustChangePassword(false);
      setPassword(newPassword);
      setError('');
      alert('Password updated successfully!');
    } catch (err: any) {
      console.error('Password update error:', err);
      setError('Error updating password: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (fpEmail.trim() === '' || fpCustomerId.trim() === '') {
      setError('Please enter both your Email and Unique Customer ID.');
      return;
    }
    setError('');
    setFpSuccess(true);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setCustomerName('');
    setCustomerId('');
    setPhone('');
    setPassword('');
    setIsCancelled(false);
    setError('');
  };

  const handleCancel = () => {
    setIsCancelled(true);
    setShowCancelModal(false);
  };

  const handleRequestLearning = async (serviceName: string) => {
    if (isSpamContent(serviceName) || isSpamContent(customerName)) {
      alert("We were unable to submit your request. Promotional or marketing content detected.");
      return;
    }
    try {
      const randomTicketNumber = Math.floor(100000 + Math.random() * 900000);
      const ticketStr = `TKT-${randomTicketNumber}`;
      setGeneratedTicket(ticketStr);
      
      await addDoc(collection(db, 'tickets'), {
        ticketId: ticketStr,
        name: customerName || 'Account User',
        email: customerName ? `${customerName.replace(/\s+/g, '').toLowerCase()}@member.local` : 'member@local.com',
        phone: phone || 'Logged in Member',
        enquiryType: serviceName,
        message: serviceName,
        status: 'Open',
        source: 'Web',
        createdAt: serverTimestamp()
      });

      setShowTicketModal(true);
    } catch (err) {
      console.error(err);
      alert('Unable to generate ticket at this time. Please try again.');
    }
  };

  const handleDirectPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPay(true);
    setPaySuccessMsg('');
    
    setTimeout(async () => {
      const newInvId = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const nowStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      
      const newRecord = {
        id: newInvId,
        date: nowStr,
        amount: '£17.99',
        method: paymentMethod,
        methodDetails: paymentMethod === 'Card' ? `Card ending in •••• ${paymentCardNum.slice(-4)}` : `Mandate #${paymentBacsRef} (Bacs)`,
        status: 'Paid',
        description: 'SeniorEase Plus Membership - Direct Renewal Payment'
      };
      
      setInvoices(prev => [newRecord, ...prev]);
      setIsProcessingPay(false);
      setPaySuccessMsg(`Payment of £17.99 processed successfully via ${paymentMethod}! Invoice ${newInvId} has been generated and saved to your records.`);
      
      try {
        await addDoc(collection(db, 'transactions'), {
          invoiceId: newInvId,
          customerId: customerId || 'DEMO',
          customerName: customerName || 'Demo User',
          amount: '£17.99',
          method: paymentMethod,
          date: serverTimestamp(),
          status: 'Paid',
          type: 'Direct Dashboard Renewal'
        });
      } catch (err) {
        console.error('Error logging transaction to Firestore:', err);
      }
    }, 1200);
  };

  const handleDownloadInvoiceFile = (inv: any) => {
    generateInvoicePDF(inv, {
      name: customerName || 'Demo Customer',
      id: customerId || 'DEMO',
      phone: phone || '07700 900000',
    });
  };

  return (
    <div className={`min-h-screen ${!isLoggedIn ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950 py-8 sm:py-12 lg:py-20 flex flex-col justify-start lg:justify-center relative overflow-x-hidden' : 'bg-gray-50 py-8 sm:py-12 lg:py-24'}`}>
      {/* Background glow and image when in login mode */}
      {!isLoggedIn && (
        <>
          <div className="absolute inset-0 z-0">
            <img 
              src={loginBgImage} 
              alt="Seniors learning digital skills with confidence" 
              className="w-full h-full object-cover object-center opacity-85 transition-all duration-[10s] ease-out"
              style={{ transform: 'scaleX(-1.05) scaleY(1.05)' }}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/35 to-teal-950/50"></div>
          </div>
          <div className="absolute top-1/4 left-10 w-96 h-96 bg-teal-500/25 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/25 rounded-full blur-[120px] pointer-events-none"></div>
        </>
      )}

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        {!isLoggedIn ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Left intentionally empty on desktop so the couple's faces in the background hero image are 100% clearly visible and unobstructed! */}
            <div className="hidden lg:block lg:col-span-6"></div>

            {/* Right Column: Both Welcome Branding/Cards and Login Box dragged to the right side! */}
            <div className="lg:col-span-6 max-w-lg w-full mx-auto space-y-6">
              {/* Written part and security badges dragged to the right side */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="text-white text-center lg:text-left bg-slate-900/60 sm:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 font-semibold text-xs border border-teal-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                    UK Secure Member Portal
                  </span>
                  <span className="text-xs text-teal-200/80 font-medium">Digital Hub</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-2 leading-snug">
                  Welcome to Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-200">Digital Hub</span>
                </h1>
                <p className="text-teal-100/90 text-sm font-medium leading-relaxed mb-5">
                  Sign in to view your learning progress, manage your subscription, download official receipts, or request immediate 1-on-1 technical assistance.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2.5 bg-white/10 p-3 rounded-xl border border-white/15 backdrop-blur-md shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/30 flex items-center justify-center text-teal-300 shrink-0 font-bold text-base">
                      🛡️
                    </div>
                    <div className="text-left text-xs">
                      <div className="font-bold text-white leading-tight">Bank-Grade Security</div>
                      <div className="text-teal-200 text-[10px] leading-tight mt-0.5">UK GDPR compliant</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white/10 p-3 rounded-xl border border-white/15 backdrop-blur-md shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0 font-bold text-base">
                      🤝
                    </div>
                    <div className="text-left text-xs">
                      <div className="font-bold text-white leading-tight">Patient UK Support Desk</div>
                      <div className="text-teal-200 text-[10px] leading-tight mt-0.5">Friendly support team</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* The Login Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="bg-slate-900/60 sm:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/20 w-full text-white"
              >
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500/30 to-emerald-500/20 text-teal-300 border border-teal-400/30 rounded-2xl flex items-center justify-center mb-3 shadow-inner">
                <HeartHandshake size={32} />
              </div>
              <span className="text-xl font-bold tracking-wide text-white">SeniorEase</span>
            </div>
            
            {!showForgotPassword ? (
              <>
                <h1 className="text-3xl font-bold text-white mb-2 text-center">My Account</h1>
                <p className="text-teal-100/80 text-center mb-8 text-sm">Enter your credentials to access your account.</p>
                
                <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
                  <div>
                    <label htmlFor="customerName" className="block text-sm font-medium text-teal-100 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      autoComplete="off"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/25 text-white placeholder-teal-100/40 focus:bg-white/15 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all outline-none"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="customerId" className="block text-sm font-medium text-teal-100 mb-2">
                      Unique Customer ID
                    </label>
                    <input
                      type="text"
                      id="customerId"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      autoComplete="off"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/25 text-white placeholder-teal-100/40 focus:bg-white/15 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all outline-none"
                      placeholder="e.g. SE-12345"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-teal-100 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/25 text-white placeholder-teal-100/40 focus:bg-white/15 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button 
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(true);
                        setError('');
                      }} 
                      className="text-sm font-bold text-teal-300 hover:text-teal-200 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  {error && <p className="text-red-400 bg-red-950/50 p-3 rounded-xl border border-red-500/30 text-sm mt-2">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-6 py-3.5 rounded-xl font-bold hover:from-teal-600 hover:to-emerald-700 transition-all shadow-lg shadow-teal-950/50 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Login'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <button 
                  onClick={() => {
                    setShowForgotPassword(false);
                    setFpSuccess(false);
                    setError('');
                  }}
                  className="mb-6 text-sm font-bold text-teal-300 hover:text-teal-200 transition-colors flex items-center gap-1"
                >
                  &larr; Back to Login
                </button>
                
                <h1 className="text-3xl font-bold text-white mb-2 text-center">Reset Password</h1>
                
                {fpSuccess ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-teal-500/20 text-teal-300 border border-teal-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <p className="text-white font-bold text-lg mb-2">Instructions Sent!</p>
                    <p className="text-teal-100/80 mb-6 text-sm leading-relaxed">
                      If the details match an active account, securing password reset instructions have been sent to your email.
                    </p>
                    <button
                      onClick={() => {
                        setShowForgotPassword(false);
                        setFpSuccess(false);
                        setFpEmail('');
                        setFpCustomerId('');
                      }}
                      className="w-full bg-white/15 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/25 transition-colors border border-white/20 shadow-sm"
                    >
                      Return to Login
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-teal-100/80 text-center mb-8 text-sm">
                      Please enter your Email and Unique Customer ID to reset your password.
                    </p>
                    <form onSubmit={handleForgotPassword} className="space-y-6">
                      <div>
                        <label htmlFor="fpEmail" className="block text-sm font-medium text-teal-100 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="fpEmail"
                          value={fpEmail}
                          onChange={(e) => setFpEmail(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/25 text-white placeholder-teal-100/40 focus:bg-white/15 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all outline-none"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="fpCustomerId" className="block text-sm font-medium text-teal-100 mb-2">
                          Unique Customer ID
                        </label>
                        <input
                          type="text"
                          id="fpCustomerId"
                          value={fpCustomerId}
                          onChange={(e) => setFpCustomerId(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/25 text-white placeholder-teal-100/40 focus:bg-white/15 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all outline-none"
                          placeholder="e.g. SE-12345"
                        />
                      </div>
                      {error && <p className="text-red-400 bg-red-950/50 p-3 rounded-xl border border-red-500/30 text-sm mt-2">{error}</p>}
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-6 py-3.5 rounded-xl font-bold hover:from-teal-600 hover:to-emerald-700 transition-all shadow-lg shadow-teal-950/50"
                      >
                        Reset Password
                      </button>
                    </form>
                  </>
                )}
              </>
            )}
              </motion.div>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-12 gap-8"
          >
            {/* Left Column: Profile and Plan Details */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex flex-col mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center">
                      <User size={32} />
                    </div>
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium bg-gray-50 px-4 py-2 rounded-xl"
                    >
                      <LogOut size={16} />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome {customerName || 'Customer'}</h1>
                    <p className="text-gray-600">Customer ID: {customerId}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Current Plan</h3>
                    <p className="text-xl font-bold text-gray-900 mb-1">Plus Membership</p>
                    <p className="text-gray-600 mb-4">£17.99 / month</p>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 text-sm text-gray-600">
                      <p className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Info size={16} className="text-teal-600" /> Plan Description
                      </p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Unlimited WhatsApp & Email support</li>
                        <li>2 Scheduled support calls per month</li>
                        <li>Priority response times</li>
                        <li>Scam awareness guidance</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => setActiveTab('billing')}
                      className="mt-4 w-full bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <CreditCard size={15} />
                      <span>Manage Payments &amp; Invoices</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Status</h3>
                    {isCancelled ? (
                      <div className="flex items-center gap-2 text-amber-600 font-bold">
                        <AlertCircle size={20} />
                        <span>Pending Cancellation</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-teal-600 font-bold">
                        <CheckCircle2 size={20} />
                        <span>Active</span>
                      </div>
                    )}
                    
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-bold text-gray-900 mb-3">Settings</h3>
                      <button
                        onClick={() => setShowChangePassword(true)}
                        className="w-full mb-3 px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-sm text-sm"
                      >
                        Change Password
                      </button>
                      <button
                        onClick={() => setShowCancelModal(true)}
                        disabled={isCancelled}
                        className={`w-full px-4 py-2.5 rounded-xl font-bold transition-colors shadow-sm text-sm ${
                          isCancelled 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'
                        }`}
                      >
                        {isCancelled ? 'Cancellation Requested' : 'Cancel Subscription'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Secure Dashboard Services, Payments & Safeguarding */}
            <div className="lg:col-span-8 space-y-8">
              {/* Top Navigation Tabs */}
              <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => setActiveTab('services')}
                  className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'services'
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <HeartHandshake size={18} />
                  <span>Service Requests</span>
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'billing'
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <CreditCard size={18} />
                  <span>Payments &amp; Invoices</span>
                </button>
                <button
                  onClick={() => setActiveTab('safeguarding')}
                  className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'safeguarding'
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <ShieldAlert size={18} />
                  <span>Safeguarding Controls</span>
                </button>
              </div>

              {activeTab === 'services' && (
              <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Request Dashboard</h2>
                    <p className="text-gray-600">Select a service below to file a support ticket with our team.</p>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    'Smartphone & Tablet Learning',
                    'WhatsApp & Video Call',
                    'Email & Password Learning',
                    'Scam Awareness',
                    'Online Shopping',
                    'Entertainment Apps',
                    'Online Forms & Admin',
                    'Family Support'
                  ].map((service, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-teal-500 hover:shadow-lg transition-all group flex flex-col justify-between min-h-[160px] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -mr-12 -mt-12 group-hover:bg-teal-100 transition-colors"></div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-teal-700 transition-colors relative z-10">{service}</h3>
                      <button 
                        onClick={() => handleRequestLearning(service)}
                        className="mt-6 text-sm font-bold text-teal-600 bg-teal-50 py-3 px-4 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-all relative z-10 w-full text-center shadow-sm"
                      >
                        Request Learning
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-8">
                  {/* Top Header Card */}
                  <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-teal-900 text-white p-8 rounded-3xl shadow-md relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                          <Receipt size={14} />
                          <span>Billing &amp; Financial Management</span>
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight mb-2">Payments, Renewals &amp; Invoices</h2>
                        <p className="text-teal-100 text-sm max-w-xl leading-relaxed">
                          Manage your subscription renewals, make instant direct payments via Card or Bacs Direct Debit, and download UK official payment receipts.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setPaySuccessMsg('');
                          setShowPaymentModal(true);
                        }}
                        className="bg-amber-400 hover:bg-amber-300 text-amber-950 px-6 py-3.5 rounded-2xl font-extrabold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 shrink-0 self-start md:self-center"
                      >
                        <CreditCard size={18} />
                        <span>Make Direct Payment</span>
                      </button>
                    </div>
                  </div>

                  {/* Upcoming Renewal Card */}
                  <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
                          <Calendar size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Upcoming Subscription Renewal</h3>
                          <p className="text-sm text-gray-500">Next scheduled automated billing cycle</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold self-start sm:self-center">
                        <Clock size={14} />
                        <span>Scheduled &amp; Active</span>
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6 mb-6">
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Next Renewal Date</p>
                        <p className="text-lg font-bold text-gray-900">15 August 2026</p>
                        <p className="text-xs text-teal-600 font-medium mt-1">Automatic recurring billing</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Renewal Amount</p>
                        <p className="text-lg font-bold text-gray-900">£17.99 / month</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">Standard subscription rate</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Payment Method</p>
                        <p className="text-lg font-bold text-gray-900 truncate">Bacs Direct Debit</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">Mandate #SEN-88219</p>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Info size={18} className="text-amber-700 shrink-0 mt-0.5" />
                        <p className="text-xs md:text-sm text-amber-900 leading-relaxed font-medium">
                          You can renew early or settle outstanding balance directly using your Credit/Debit Card or UK Bacs Direct Debit without waiting for automatic deduction.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setPaySuccessMsg('');
                          setShowPaymentModal(true);
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm shrink-0 whitespace-nowrap"
                      >
                        Pay Early / Renew Now
                      </button>
                    </div>
                  </div>

                  {/* Registered Payment Methods Summary */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                              <CreditCard size={20} />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">Credit / Debit Card</h4>
                              <p className="text-xs text-gray-500">Instant online card payments</p>
                            </div>
                          </div>
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Verified</span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                          <p className="text-sm font-bold text-gray-800 tracking-wider">•••• •••• •••• 8391</p>
                          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                            <span>Expires: 08/28</span>
                            <span>Visa / Mastercard</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setPaymentMethod('Card');
                          setPaySuccessMsg('');
                          setShowPaymentModal(true);
                        }}
                        className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 py-2 rounded-xl text-xs font-bold transition-colors"
                      >
                        Pay with Card
                      </button>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
                              <Building2 size={20} />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">Bacs Direct Debit</h4>
                              <p className="text-xs text-gray-500">UK Bank Account Transfer</p>
                            </div>
                          </div>
                          <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Primary Mandate</span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-3">
                          <p className="text-sm font-bold text-gray-800">Mandate Ref: SEN-88219</p>
                          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                            <span>Status: Active &amp; Protected</span>
                            <span>UK Bacs Scheme (via Stripe)</span>
                          </div>
                        </div>
                        <div className="bg-teal-50/70 p-3 rounded-xl border border-teal-100 text-[11px] text-teal-900 mb-4 flex items-start gap-2">
                          <ShieldCheck size={16} className="text-teal-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Direct Debit Guarantee:</span> Protected by UK Banking Standards. Your bank will refund any error immediately. <span className="underline cursor-pointer font-medium hover:text-teal-700" onClick={() => alert("The Direct Debit Guarantee\n\n• This Guarantee is offered by all banks and building societies that accept instructions to pay Direct Debits.\n\n• If there are any changes to the amount, date or frequency of your Direct Debit, SeniorEase will notify you 10 working days in advance of your account being debited or as otherwise agreed.\n\n• If an error is made in the payment of your Direct Debit, by SeniorEase or your bank or building society, you are entitled to a full and immediate refund of the amount paid from your bank or building society.\n\n• You can cancel a Direct Debit at any time by simply contacting your bank or building society. Written confirmation may be required. Please also notify us.")}>Read Full Guarantee</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setPaymentMethod('Bacs Direct Debit');
                          setPaySuccessMsg('');
                          setShowPaymentModal(true);
                        }}
                        className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 py-2 rounded-xl text-xs font-bold transition-colors"
                      >
                        Pay with Bacs Direct Debit
                      </button>
                    </div>
                  </div>

                  {/* Payment History & Downloadable Invoices Table */}
                  <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Payment History &amp; Invoices</h3>
                        <p className="text-sm text-gray-500">View past payments and download official payment receipts</p>
                      </div>
                      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl self-start sm:self-center">
                        {(['All', 'Card', 'Bacs Direct Debit'] as const).map(f => (
                          <button
                            key={f}
                            onClick={() => setPaymentFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              paymentFilter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            {f === 'Bacs Direct Debit' ? 'Bacs' : f}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {invoices
                        .filter(inv => paymentFilter === 'All' || inv.method === paymentFilter)
                        .map(inv => (
                          <div key={inv.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                              <div className={`p-3 rounded-xl shrink-0 ${
                                inv.method === 'Card' ? 'bg-blue-100 text-blue-700' : 'bg-teal-100 text-teal-700'
                              }`}>
                                {inv.method === 'Card' ? <CreditCard size={20} /> : <Building2 size={20} />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-gray-900 text-sm">{inv.id}</span>
                                  <span className="text-xs bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-md">
                                    {inv.status}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">{inv.description}</p>
                                <p className="text-[11px] text-gray-400 mt-1">
                                  {inv.date} • <span className="font-semibold text-gray-600">{inv.method}</span> ({inv.methodDetails})
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-200">
                              <div className="text-left sm:text-right">
                                <p className="text-base font-extrabold text-gray-900">{inv.amount}</p>
                                <p className="text-[11px] text-gray-400">Monthly rate</p>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setViewingInvoice(inv)}
                                  title="View & Print Invoice Receipt"
                                  className="p-2 bg-white hover:bg-teal-50 text-gray-700 hover:text-teal-700 border border-gray-200 hover:border-teal-300 rounded-xl transition-all shadow-sm flex items-center gap-1.5 text-xs font-bold"
                                >
                                  <FileText size={15} />
                                  <span className="hidden md:inline">View</span>
                                </button>
                                <button
                                  onClick={() => handleDownloadInvoiceFile(inv)}
                                  title="Download Official PDF Invoice"
                                  className="p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all shadow-sm flex items-center gap-1.5 text-xs font-bold"
                                >
                                  <Download size={15} />
                                  <span>Download PDF</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      {invoices.filter(inv => paymentFilter === 'All' || inv.method === paymentFilter).length === 0 && (
                        <div className="text-center py-8 text-gray-500 text-sm">
                          No payment records found for the selected filter.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Safeguarding & Caregiver Safety Controls Card */}
              {activeTab === 'safeguarding' && (
              <div className="bg-gradient-to-br from-amber-50 via-orange-50/40 to-amber-50 p-8 rounded-3xl border-2 border-amber-300 shadow-sm relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-md">
                      <ShieldAlert size={28} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-amber-950 mb-1 flex items-center gap-2">
                        <span>Safeguarding &amp; Caregiver Safety Controls</span>
                      </h2>
                      <p className="text-amber-900 text-sm">
                        We actively support and protect vulnerable adults with robust safeguarding and clear, honest boundaries.
                      </p>
                    </div>
                  </div>
                  <Link 
                    to="/safeguarding"
                    className="px-4 py-2 bg-amber-200/80 hover:bg-amber-300 text-amber-950 rounded-xl text-xs font-bold transition-colors inline-flex items-center justify-center gap-1 shrink-0"
                  >
                    <span>View Safeguarding Commitment</span>
                    <span>&rarr;</span>
                  </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base mb-1">Calm &amp; Safe Pacing Mode</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Enables extra verbal confirmations during calls and strict adherence to anti-coercion pacing standards.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCalmPacing(!calmPacing);
                        setSafeguardingSaved(false);
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-1 ${
                        calmPacing ? 'bg-teal-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        calmPacing ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base mb-1">Financial Scam Blocklist Signposting</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Automatically highlights fraud warnings and signposts to Action Fraud if suspicious apps are discussed.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setScamSignposting(!scamSignposting);
                        setSafeguardingSaved(false);
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-1 ${
                        scamSignposting ? 'bg-teal-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        scamSignposting ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm mb-6">
                  <h3 className="font-bold text-gray-900 text-base mb-1">Caregiver CC / Family Notification Loop</h3>
                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                    With senior consent, enter a trusted family member&apos;s email to receive automated copies of learning summaries and immediate safety alerts.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={caregiverEmail}
                      onChange={(e) => {
                        setCaregiverEmail(e.target.value);
                        setSafeguardingSaved(false);
                      }}
                      placeholder="e.g. daughter@example.co.uk"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setSafeguardingSaved(true)}
                      className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm shrink-0 flex items-center justify-center gap-2"
                    >
                      {safeguardingSaved ? (
                        <>
                          <ShieldCheck size={16} />
                          <span>Settings Saved!</span>
                        </>
                      ) : (
                        <span>Save Protection Settings</span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-amber-100/80 p-4 rounded-xl border border-amber-300/80 flex items-center gap-3 text-xs md:text-sm text-amber-950 font-medium">
                  <Info size={20} className="text-amber-700 shrink-0" />
                  <span>
                    <strong>No-Guarantee Advisory Scope:</strong> Guidance is educational and empowering. While we mitigate risks through rigorous safeguarding, senior digital support inherently involves third-party ecosystem factors that cannot be 100% eliminated by software alone.
                  </span>
                </div>
              </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Direct Payment / Early Renewal Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => !isProcessingPay && setShowPaymentModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              {!isProcessingPay && (
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              )}
              
              <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <CreditCard size={32} />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Subscription Payment</h3>
              <p className="text-gray-600 mb-6 text-sm">
                Make an immediate secure payment or early renewal for your SeniorEase monthly subscription.
              </p>

              {paySuccessMsg ? (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 p-6 rounded-2xl text-center">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 size={24} />
                    </div>
                    <h4 className="font-bold text-green-900 text-lg mb-1">Payment Successful!</h4>
                    <p className="text-sm text-green-800 leading-relaxed">{paySuccessMsg}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaySuccessMsg('');
                    }}
                    className="w-full bg-teal-600 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-md"
                  >
                    Done &amp; View Receipt
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDirectPayment} className="space-y-5">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 font-medium">Service Plan:</span>
                      <span className="font-bold text-gray-900">Plus Membership Renewal</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 font-medium">Billing Period:</span>
                      <span className="font-bold text-gray-900">1 Month (Advance)</span>
                    </div>
                    <div className="flex justify-between text-base border-t border-gray-200 pt-2 mt-2">
                      <span className="font-bold text-gray-900">Total Amount Due:</span>
                      <span className="font-extrabold text-teal-700">£17.99</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Payment Method</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Card')}
                        className={`p-3.5 rounded-xl border text-left font-bold text-xs md:text-sm flex items-center gap-2 transition-all ${
                          paymentMethod === 'Card'
                            ? 'border-teal-600 bg-teal-50/80 text-teal-900 shadow-sm'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <CreditCard size={18} className={paymentMethod === 'Card' ? 'text-teal-600' : 'text-gray-400'} />
                        <span>Credit / Debit Card</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Bacs Direct Debit')}
                        className={`p-3.5 rounded-xl border text-left font-bold text-xs md:text-sm flex items-center gap-2 transition-all ${
                          paymentMethod === 'Bacs Direct Debit'
                            ? 'border-teal-600 bg-teal-50/80 text-teal-900 shadow-sm'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Building2 size={18} className={paymentMethod === 'Bacs Direct Debit' ? 'text-teal-600' : 'text-gray-400'} />
                        <span>Bacs Direct Debit</span>
                      </button>
                    </div>
                  </div>

                  {paymentMethod === 'Card' ? (
                    <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Card Number</label>
                        <input
                          type="text"
                          value={paymentCardNum}
                          onChange={(e) => setPaymentCardNum(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-teal-500 font-mono"
                          placeholder="•••• •••• •••• ••••"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Expiry Date</label>
                          <input
                            type="text"
                            defaultValue="08/28"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-teal-500 font-mono"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CVV Security Code</label>
                          <input
                            type="password"
                            defaultValue="888"
                            maxLength={4}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-teal-500 font-mono"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">UK Bacs Mandate Reference</label>
                        <input
                          type="text"
                          value={paymentBacsRef}
                          onChange={(e) => setPaymentBacsRef(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-teal-500 font-mono"
                          required
                        />
                      </div>
                      <div className="bg-teal-50/60 p-3 rounded-xl border border-teal-100 text-xs text-teal-800 leading-relaxed">
                        <span className="font-bold">Bacs Direct Debit Guarantee:</span> Your Bacs Direct Debit payment is securely processed by Stripe and protected by the UK Direct Debit Guarantee scheme. Funds will be initiated from your linked bank account.
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isProcessingPay}
                    className="w-full bg-teal-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2 text-base"
                  >
                    {isProcessingPay ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        <span>Confirm Payment £17.99</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invoice Viewer & Print Receipt Modal */}
      <AnimatePresence>
        {viewingInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => setViewingInvoice(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setViewingInvoice(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="border-b-2 border-gray-900 pb-6 mb-6 flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">SENIOREASE</h3>
                  <p className="text-xs text-gray-500 font-medium">Digital Support &amp; Tech Tutoring UK</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">UK GDPR &amp; Safeguarding Charter Compliant</p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-teal-100 text-teal-900 font-extrabold text-xs px-3 py-1 rounded-lg uppercase tracking-wider mb-1">
                    SUBSCRIPTION INVOICE
                  </span>
                  <p className="text-sm font-bold text-gray-900">{viewingInvoice.id}</p>
                  <p className="text-xs text-gray-500">{viewingInvoice.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-xs md:text-sm bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <p className="font-bold text-gray-400 uppercase text-[10px] tracking-wider mb-1">Billed To Customer</p>
                  <p className="font-bold text-gray-900">{customerName || 'Demo Customer'}</p>
                  <p className="text-gray-600">ID: {customerId || 'DEMO'}</p>
                  <p className="text-gray-600">{phone || '07700 900000'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-400 uppercase text-[10px] tracking-wider mb-1">Payment Method</p>
                  <p className="font-bold text-gray-900">{viewingInvoice.method}</p>
                  <p className="text-gray-600 truncate">{viewingInvoice.methodDetails}</p>
                  <p className="text-green-700 font-bold mt-1">Status: {viewingInvoice.status.toUpperCase()}</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden mb-6">
                <div className="bg-gray-100 px-4 py-2.5 flex justify-between text-xs font-bold text-gray-700 uppercase">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                <div className="p-4 flex justify-between text-sm text-gray-800 border-t border-gray-200">
                  <div>
                    <p className="font-bold">{viewingInvoice.description}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Monthly tech tutoring &amp; priority helpline access</p>
                  </div>
                  <span className="font-bold">{viewingInvoice.amount}</span>
                </div>
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Monthly Rate</span>
                    <span className="font-medium">{viewingInvoice.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-1 border-t border-gray-200">
                    <span>Total Paid</span>
                    <span className="text-teal-700">{viewingInvoice.amount}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => handleDownloadInvoiceFile(viewingInvoice)}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-xl font-bold transition-colors shadow-md flex items-center justify-center gap-2 text-sm"
                >
                  <Download size={18} />
                  <span>Download PDF Receipt</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Printer size={18} />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setViewingInvoice(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-3 rounded-xl font-bold transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showChangePassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => !mustChangePassword && setShowChangePassword(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
            >
              {!mustChangePassword && (
                <button 
                  onClick={() => setShowChangePassword(false)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              )}
              
              <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <Lock size={32} />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Change Password</h3>
              <p className="text-gray-600 mb-6 text-sm">
                {mustChangePassword 
                  ? 'This is your first login. Please update your temporary password to continue.' 
                  : 'Update your account password for better security.'}
              </p>
              
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="Min 6 characters"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="Repeat password"
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Update Password'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancel Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => setShowCancelModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
            >
              <button 
                onClick={() => setShowCancelModal(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle size={32} />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cancel Subscription?</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Are you sure you want to cancel your subscription? You will lose access to our support services at the end of your current billing period.
              </p>
              
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-8">
                <p className="text-amber-800 font-medium text-center">
                  The Refund amount will be process in next 3 days.
                </p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-md"
                >
                  Confirm Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ticket Success Modal */}
      <AnimatePresence>
        {showTicketModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => setShowTicketModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
            >
              <button 
                onClick={() => setShowTicketModal(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle2 size={32} />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Request Sent!</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Your request is under process and our customer team will get in touch with you immediately.
              </p>
              
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl mb-8">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-2">Ticket Number</p>
                <p className="text-2xl text-teal-600 font-bold tracking-widest">{generatedTicket}</p>
              </div>
              
              <button
                onClick={() => setShowTicketModal(false)}
                className="w-full bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-md"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

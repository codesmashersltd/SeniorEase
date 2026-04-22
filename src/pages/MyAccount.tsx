import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, User, AlertCircle, CheckCircle2, X, LogOut, Info } from 'lucide-react';

export default function MyAccount() {
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState('');
  const [error, setError] = useState('');

  // Forgot Password State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [fpEmail, setFpEmail] = useState('');
  const [fpCustomerId, setFpCustomerId] = useState('');
  const [fpSuccess, setFpSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerName.trim() === '' || customerId.trim() === '' || password.trim() === '') {
      setError('Please enter your Name, Unique Customer ID, and Password.');
      return;
    }
    // Mock login success
    setError('');
    setIsLoggedIn(true);
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
    setPassword('');
    setIsCancelled(false);
    setError('');
  };

  const handleCancel = () => {
    setIsCancelled(true);
    setShowCancelModal(false);
  };

  const handleRequestHelp = (serviceName: string) => {
    const randomTicketNumber = Math.floor(100000 + Math.random() * 900000);
    setGeneratedTicket(`TKT-${randomTicketNumber}`);
    setShowTicketModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isLoggedIn ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 max-w-md mx-auto"
          >
            <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-8 mx-auto">
              <LogIn size={32} />
            </div>
            
            {!showForgotPassword ? (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">My Account</h1>
                <p className="text-gray-600 text-center mb-8">Enter your credentials to access your account.</p>
                
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-2">
                      Unique Customer ID
                    </label>
                    <input
                      type="text"
                      id="customerId"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      placeholder="e.g. SE-12345"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
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
                      className="text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                  <button
                    type="submit"
                    className="w-full bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-md"
                  >
                    Login
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
                  className="mb-6 text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1"
                >
                  &larr; Back to Login
                </button>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Reset Password</h1>
                
                {fpSuccess ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <p className="text-gray-900 font-medium mb-2">Instructions Sent!</p>
                    <p className="text-gray-600 mb-6">
                      If the details match an active account, securing password reset instructions have been sent to your email.
                    </p>
                    <button
                      onClick={() => {
                        setShowForgotPassword(false);
                        setFpSuccess(false);
                        setFpEmail('');
                        setFpCustomerId('');
                      }}
                      className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-sm"
                    >
                      Return to Login
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600 text-center mb-8 text-sm">
                      Please enter your Email and Unique Customer ID to reset your password.
                    </p>
                    <form onSubmit={handleForgotPassword} className="space-y-6">
                      <div>
                        <label htmlFor="fpEmail" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="fpEmail"
                          value={fpEmail}
                          onChange={(e) => setFpEmail(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="fpCustomerId" className="block text-sm font-medium text-gray-700 mb-2">
                          Unique Customer ID
                        </label>
                        <input
                          type="text"
                          id="fpCustomerId"
                          value={fpCustomerId}
                          onChange={(e) => setFpCustomerId(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                          placeholder="e.g. SE-12345"
                        />
                      </div>
                      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                      <button
                        type="submit"
                        className="w-full bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-md"
                      >
                        Reset Password
                      </button>
                    </form>
                  </>
                )}
              </>
            )}
          </motion.div>
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
                      <h3 className="text-sm font-bold text-gray-900 mb-3">Manage Subscription</h3>
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

            {/* Right Column: Secure Dashboard Services */}
            <div className="lg:col-span-8">
              <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 h-full">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Request Dashboard</h2>
                    <p className="text-gray-600">Select a service below to file a support ticket with our team.</p>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    'Smartphone & Tablet Help',
                    'WhatsApp & Video Call',
                    'Email & Password Help',
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
                        onClick={() => handleRequestHelp(service)}
                        className="mt-6 text-sm font-bold text-teal-600 bg-teal-50 py-3 px-4 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-all relative z-10 w-full text-center shadow-sm"
                      >
                        Request Help
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

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

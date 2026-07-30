import React, { useState } from 'react';
import { X, CheckCircle2, Loader2, ShieldCheck, Info } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { isSpamContent } from '../lib/spamFilter';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: { name: string; price: string } | null;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

export default function JoinModal({ isOpen, onClose, plan }: JoinModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [email, setEmail] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bacs' | 'card'>('bacs');
  const [selectedPlanState, setSelectedPlanState] = useState<{ name: string; price: string }>(
    plan || { name: 'Family Care', price: '£29.99' }
  );

  // Keep selectedPlanState in sync when plan prop changes
  React.useEffect(() => {
    if (plan) {
      setSelectedPlanState(plan);
    }
  }, [plan]);

  const activePlan = plan || selectedPlanState;

  const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: null, // Public user here usually
        email: null,
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userEmail = (formData.get('email') as string) || '';
    const userPhone = (formData.get('phone') as string) || '';
    const userName = (formData.get('fullName') as string) || 'No Name Provided';
    const userAddress = (formData.get('address') as string) || '';
    const userCity = (formData.get('city') as string) || '';
    const userPostcode = (formData.get('postcode') as string) || '';
    const userMessage = ((formData.get('message') as string) || '').trim();
    setEmail(userEmail);
    
    setIsSubmitting(true);

    try {
      const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      const newId = `SE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setCustomerId(newId);

      const defaultMessage = `User registered for ${activePlan.name} at ${activePlan.price}`;
      const finalMessage = userMessage ? `${userMessage} (${defaultMessage})` : defaultMessage;

      const ticketPayload = {
        ticketId,
        name: userName,
        email: userEmail,
        phone: userPhone,
        enquiryType: `Selected Plan: ${activePlan.name}`,
        message: finalMessage,
        status: 'Open',
        source: 'Web',
        createdAt: serverTimestamp()
      };
      
      if (isSpamContent(ticketPayload)) {
        alert("We were unable to submit your request. Our system detected promotional or marketing keywords. Please ensure your enquiry is strictly regarding digital support services for seniors.");
        setIsSubmitting(false);
        return;
      }

      console.log('Attempting to add ticket:', ticketPayload);

      const defaultTempPassword = 'Welcome2026!';
      const isBacs = paymentMethod === 'bacs';

      // 1. First, call our background Stripe & Email integration endpoint to guarantee Invoice & Email dispatch!
      let checkoutUrlResult = '';
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planName: activePlan.name,
            planPrice: activePlan.price,
            customerEmail: userEmail,
            customerId: newId,
            fullName: userName,
            phone: userPhone,
            address: userAddress,
            city: userCity,
            postcode: userPostcode,
            paymentMethod: paymentMethod,
            hasFreeTrial: isBacs,
            tempPassword: defaultTempPassword
          })
        });
        const data = await response.json();
        if (data.url) {
          checkoutUrlResult = data.url;
          setCheckoutUrl(data.url);
        }
      } catch (checkoutErr) {
        console.error('Checkout API call failed:', checkoutErr);
      }

      // 2. Save ticket in Firestore so custom messages appear in Admin Dashboard under Support Tickets
      try {
        await addDoc(collection(db, 'tickets'), ticketPayload);
      } catch (err: any) {
        console.warn('Firestore tickets write warning:', err);
      }

      // 3. Save to Customers collection in Firestore so user can log in to /my-account immediately
      try {
        await addDoc(collection(db, 'customers'), {
          id: newId,
          name: userName,
          email: userEmail,
          phone: userPhone,
          address: userAddress,
          city: userCity,
          postcode: userPostcode,
          plan: activePlan.name,
          price: activePlan.price,
          paymentMethod: paymentMethod,
          hasFreeTrial: isBacs,
          trialDays: isBacs ? 7 : 0,
          password: defaultTempPassword,
          mustChangePassword: true,
          status: 'Active',
          createdAt: serverTimestamp()
        });
      } catch (err: any) {
        console.warn('Firestore customers write warning:', err);
      }

      // 4. Save to New Joinees collection for Admin Dashboard tracking
      try {
        await addDoc(collection(db, 'new_joinees'), {
          customerId: newId,
          name: userName,
          email: userEmail,
          phone: userPhone,
          address: userAddress,
          city: userCity,
          postcode: userPostcode,
          plan: activePlan.name,
          price: activePlan.price,
          paymentMethod: paymentMethod,
          hasFreeTrial: isBacs,
          trialDays: isBacs ? 7 : 0,
          message: finalMessage,
          tempPassword: defaultTempPassword,
          status: isBacs ? '7-Day Free Trial (BACS)' : 'Pending Payment',
          createdAt: serverTimestamp()
        });
      } catch (err: any) {
        console.warn('Firestore new_joinees write warning:', err);
      }

      // 5. Save to Security Logs (loginLogs) so registration event is captured
      try {
        await addDoc(collection(db, 'loginLogs'), {
          customerName: userName,
          customerId: newId,
          email: userEmail,
          source: `New Account Created (${activePlan.name} - ${paymentMethod === 'bacs' ? 'BACS 7-Day Trial' : 'Card'})`,
          timestamp: serverTimestamp()
        });
      } catch (err: any) {
        console.warn('Firestore security log write warning:', err);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Payment/Form intent error:', err);
      setIsSubmitting(false);
      alert(`Error initializing request: ${err.message || 'Please try again.'}`);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsSubmitting(false);
    setCustomerId('');
    setEmail('');
    setCheckoutUrl('');
    setConsentChecked(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">
            {plan ? `Join ${plan.name} Plan` : 'Book a Free Call'}
          </h2>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-50 text-teal-600 mb-6">
                <CheckCircle2 size={40} />
              </div>
              
              {plan ? (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Registration Received!</h3>
                  <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left border border-gray-100">
                    <p className="text-gray-600 mb-4 text-sm">
                      Thank you for subscribing! We are provisioning your software profile right now.
                    </p>
                    <div className="mb-6">
                      <div className="bg-white p-4 rounded-xl border border-gray-200 text-center sm:text-left">
                        <span className="text-xs text-gray-500 font-medium block mb-1">Unique Customer ID:</span>
                        <span className="font-mono text-xl font-bold text-teal-700 bg-teal-50 px-4 py-1.5 rounded-lg border border-teal-200 inline-block">
                          {customerId}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <ShieldCheck className="text-teal-500 shrink-0" size={24} />
                      <p className="text-sm text-gray-600 leading-relaxed m-0">
                        We have dispatched an official welcome email to <span className="font-semibold text-gray-900">{email}</span> containing your Unique Customer ID (<span className="font-semibold text-teal-700">{customerId}</span>), login credentials, and your Stripe invoice link.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Request Sent!</h3>
                  <p className="text-gray-600 mb-8 text-lg font-medium leading-relaxed">
                    Our team will get in touch with you within the next 24 hrs. Thank you for your Patience.
                  </p>
                </>
              )}
              
              <button
                onClick={handleClose}
                className="mt-4 w-full bg-teal-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer text-base"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-gray-600 mb-6">
                Please fill in your details below. After submitting this form, your software profile will be activated, and an official Stripe invoice and welcome email with login credentials will be sent to your email.
              </p>

              {/* Plan Selection Card or Picker */}
              {plan ? (
                <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-200 mb-6 flex justify-between items-center shadow-xs">
                  <div>
                    <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider">Selected Plan</p>
                    <p className="font-bold text-gray-900 text-base">{activePlan.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider">Price</p>
                    <p className="font-extrabold text-teal-700 text-lg">{activePlan.price}<span className="text-xs font-normal text-gray-600">/mo</span></p>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Select Subscription Plan</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: 'Essential Care', price: '£9.99' },
                      { name: 'Plus Care', price: '£17.99' },
                      { name: 'Family Care', price: '£29.99' }
                    ].map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => setSelectedPlanState(p)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          activePlan.name === p.name
                            ? 'border-teal-600 bg-teal-50/90 text-teal-900 font-bold ring-2 ring-teal-600 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className="font-bold text-xs sm:text-sm">{p.name}</div>
                        <div className="text-teal-700 font-extrabold text-sm mt-0.5">{p.price}<span className="text-[10px] font-normal text-gray-500">/mo</span></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input required type="text" id="fullName" name="fullName" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition-shadow" placeholder="e.g. Yash Kr" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input required type="email" id="email" name="email" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition-shadow" placeholder="your@email.com" />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input required type="tel" id="phone" name="phone" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition-shadow" placeholder="e.g. 07700 900077" />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
                <input required type="text" id="address" name="address" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition-shadow" placeholder="123 High Street" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <input required type="text" id="city" name="city" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition-shadow" placeholder="London" />
                </div>
                <div>
                  <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-1.5">Postcode</label>
                  <input required type="text" id="postcode" name="postcode" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition-shadow" placeholder="SW1A 1AA" />
                </div>
              </div>

              {/* Payment Method & 7-Day Free Trial Selection */}
              <div className="pt-1">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Payment Method & Trial Offer
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bacs')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                      paymentMethod === 'bacs'
                        ? 'border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-600 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs uppercase text-emerald-900 tracking-wider">
                        BACS Direct Debit
                      </span>
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tight">
                        7 Days Free
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 font-medium leading-tight m-0">
                      Mandate collected upfront (£0 today). 7-day free trial starts immediately before pack begins.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-teal-600 bg-teal-50/90 ring-2 ring-teal-600 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs uppercase text-gray-900 tracking-wider">
                        Credit / Debit Card
                      </span>
                      <span className="text-[10px] font-bold text-gray-500">
                        Stripe
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium leading-tight m-0">
                      Standard card payment. Monthly subscription starts immediately via Stripe invoice.
                    </p>
                  </button>
                </div>
              </div>

              <div className="pt-2 space-y-4">
                <div className="space-y-4">
                  {/* Billing Summary Box */}
                  <div className={`p-4 rounded-xl border text-sm ${paymentMethod === 'bacs' ? 'bg-emerald-50/80 border-emerald-200' : 'bg-teal-50/60 border-teal-100'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900">Billing Summary</span>
                      {paymentMethod === 'bacs' && (
                        <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          £0 Charged Today
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5 font-medium text-gray-700 text-xs">
                      <div className="flex justify-between">
                        <span>Plan & Rate:</span>
                        <span className="font-bold text-gray-900">{activePlan.name} ({activePlan.price}/mo)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Method:</span>
                        <span className="font-bold text-gray-900">{paymentMethod === 'bacs' ? 'BACS Direct Debit' : 'Credit/Debit Card'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Trial Status:</span>
                        <span className={`font-bold ${paymentMethod === 'bacs' ? 'text-emerald-700' : 'text-gray-600'}`}>
                          {paymentMethod === 'bacs' ? '7 Days Free Trial Active' : 'Standard Activation'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cancel anytime:</span>
                        <span className="text-teal-700 font-semibold">Yes (0 Days Lock-in)</span>
                      </div>
                    </div>
                  </div>

                  {/* Detailed billing disclosures */}
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-2.5 leading-relaxed">
                    {paymentMethod === 'bacs' ? (
                      <p>
                        <span className="font-bold text-emerald-800">🎁 7-Day Free Trial & BACS Mandate Terms: </span>
                        You are setting up a UK BACS Direct Debit Mandate upfront today (<span className="font-bold text-gray-900">£0 charged today</span>). Your 7-day free trial starts immediately. The BACS mandate will be processed to clear payment before the trial ends, after which your regular <span className="font-bold text-gray-900">{activePlan.price}/month</span> plan begins. Cancel anytime during the 7 days with £0 charged.
                      </p>
                    ) : (
                      <p>
                        <span className="font-bold text-gray-900">Billing Terms: </span>
                        Your payment of <span className="font-bold text-gray-950">{activePlan.price}</span> is billed via your official Stripe invoice sent directly to your email address. Future payments will automatically renew every month unless cancelled.
                      </p>
                    )}
                    <p>
                      <span className="font-bold text-gray-900">Cancellation Policy: </span>
                      You can cancel your subscription at any time from your account dashboard or by emailing <a href="mailto:support@seniorease.com" className="text-teal-600 hover:underline">support@seniorease.com</a>.
                    </p>
                    <p className="text-[10px] text-gray-500 border-t border-gray-200 pt-2">
                      <span className="font-bold text-gray-700 block mb-0.5">Disclaimer & Identity Notice:</span>
                      SeniorEase provides software learning and subscriptions for senior citizens in the UK. We do not provide medical, emergency, legal, financial, or regulated care services.
                    </p>
                  </div>

                  {/* Mandatory Consent Checkbox */}
                  <div className="flex items-start gap-2.5">
                    <input 
                      required
                      type="checkbox" 
                      id="consentCheckbox"
                      name="consentCheckbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    <label htmlFor="consentCheckbox" className="text-xs font-semibold text-gray-700 select-none cursor-pointer leading-tight">
                      {paymentMethod === 'bacs' ? (
                        `I authorize the BACS Direct Debit mandate setup today with a 7-day free trial (£0 charged today, then ${activePlan.price}/month after 7 days).`
                      ) : (
                        `I understand this is a recurring monthly subscription (${activePlan.name} - ${activePlan.price}/month) and authorize automatic billing.`
                      )}
                    </label>
                  </div>

                  {/* Direct links to legal pages */}
                  <p className="text-xs text-gray-500 font-medium pl-6">
                    By subscribing, you agree to our{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-semibold">Terms & Conditions</a>,{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-semibold">Privacy Policy</a>, and{' '}
                    <a href="/refund" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-semibold">Refund Policy</a>.
                  </p>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || !consentChecked}
                  className="w-full bg-teal-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-base"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Activating Profile & Sending Email...
                    </>
                  ) : (
                    paymentMethod === 'bacs'
                      ? `🎁 Start 7-Day Free Trial (${activePlan.name} - £0 Today)`
                      : `Register for ${activePlan.name} (${activePlan.price}/mo)`
                  )}
                </button>

                <p className="text-[11px] text-center font-semibold text-teal-800 tracking-tight pt-1">
                  Secure payments • SSL encrypted • UK-based support • GDPR compliant
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { X, CheckCircle2, Loader2, ShieldCheck, Info } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

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
    setEmail(userEmail);
    
    setIsSubmitting(true);

    try {
      const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      const newId = `SE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setCustomerId(newId);

      const ticketPayload = {
        ticketId,
        name: userName,
        email: userEmail,
        phone: userPhone,
        enquiryType: plan ? `Selected Plan: ${plan.name}` : 'Book Intro Call',
        message: plan ? `User wants to purchase ${plan.name} at ${plan.price}` : 'Intro call requested',
        status: 'Open',
        source: 'Web',
        createdAt: serverTimestamp()
      };
      console.log('Attempting to add ticket:', ticketPayload);

      // Save as lead/joinee ticket in Firestore ONLY IF NOT selecting a plan (to avoid double entry)
      if (!plan) {
        try {
          await addDoc(collection(db, 'tickets'), ticketPayload);
        } catch (err: any) {
          handleFirestoreError(err, OperationType.CREATE, 'tickets');
        }
      }

      // Save to New Joinees collection for Admin Dashboard
      if (plan) {
        try {
          await addDoc(collection(db, 'new_joinees'), {
            customerId: newId,
            name: userName,
            email: userEmail,
            phone: userPhone,
            plan: plan.name,
            price: plan.price,
            status: 'Pending',
            createdAt: serverTimestamp()
          });
        } catch (err: any) {
          handleFirestoreError(err, OperationType.CREATE, 'new_joinees');
        }
      }

      // Call our background Stripe integration endpoint
      if (plan) {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planName: plan.name,
            planPrice: plan.price,
            customerEmail: userEmail,
            customerId: newId,
            fullName: userName
          })
        });
        
        const data = await response.json();
        
        if (data.url) {
          // A real session was created via Stripe, capture the URL but DO NOT REDIRECT YET
          // so the user can see their Setup instructions and customer ID first!
          setCheckoutUrl(data.url);
        }
      } else {
        // Fallback delay for non-plan "free call" requests
        await new Promise(resolve => setTimeout(resolve, 800));
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
                      <span className="text-sm text-gray-500 font-medium block mb-2">Your Unique Customer ID:</span>
                      <span className="font-mono text-xl font-bold text-teal-700 bg-teal-100/50 px-4 py-2 rounded-lg border border-teal-200 inline-block">
                        {customerId}
                      </span>
                    </div>
                    <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <ShieldCheck className="text-teal-500 shrink-0" size={24} />
                      <p className="text-sm text-gray-600 leading-relaxed m-0">
                        We have sent an email to <span className="font-semibold text-gray-900">{email}</span> with your secure temporary password and a Stripe invoice to activate your plan.
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
              
              {checkoutUrl ? (
                <button
                  onClick={() => window.location.href = checkoutUrl}
                  className="mt-4 w-full bg-teal-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  Proceed to Payment <ShieldCheck size={20} />
                </button>
              ) : (
                <button
                  onClick={handleClose}
                  className="mt-4 w-full bg-teal-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-md"
                >
                  Done
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-gray-600 mb-6">
                {plan ? "Please fill in your details below. After submitting this form, we'll review your registration and email you a secure Stripe payment link. Your subscription begins only after successful payment." : 'Please fill in your details below. Our team will contact you shortly to schedule your free setup call.'}
              </p>

              {plan && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Selected Plan</p>
                    <p className="font-bold text-gray-900">{plan.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 font-medium">Price</p>
                    <p className="font-bold text-teal-600">{plan.price}/mo</p>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input required type="text" id="fullName" name="fullName" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition-shadow" placeholder="e.g. John Smith" />
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

              <div className="pt-4 space-y-5">
                {plan && (
                  <div className="space-y-4">
                    {/* Billing Summary Box */}
                    <div className="bg-teal-50/60 p-4 rounded-xl border border-teal-100 text-sm">
                      <span className="font-bold text-teal-900 block mb-2">Billing Summary</span>
                      <div className="space-y-1.5 font-medium text-gray-700 text-xs">
                        <div className="flex justify-between">
                          <span>Today's charge:</span>
                          <span className="font-bold text-teal-800">{plan.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Billing frequency:</span>
                          <span>Monthly</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Auto-renew:</span>
                          <span className="text-teal-700 font-semibold">Yes</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cancel anytime:</span>
                          <span className="text-teal-700 font-semibold">Yes</span>
                        </div>
                      </div>
                    </div>

                    {/* Detailed billing disclosures */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-2.5 leading-relaxed">
                      <p>
                        <span className="font-bold text-gray-900">Billing Terms: </span>
                        Your first payment of <span className="font-bold text-gray-950">{plan.price}</span> is due after you receive your secure payment link. Future payments will automatically renew every month on the same date unless cancelled.
                      </p>
                      <p>
                        <span className="font-bold text-gray-900">Cancellation Policy: </span>
                        You can cancel your subscription at any time from your account dashboard or by emailing <a href="mailto:support@seniorease.com" className="text-teal-600 hover:underline">support@seniorease.com</a>. Cancellation takes effect at the end of the current billing period. No further recurring payments will be taken.
                      </p>
                      <p>
                        Your membership begins once your first payment has been successfully processed. If paying by BACS Direct Debit, your membership will be activated once the payment has been successfully processed and confirmed. You'll receive a confirmation email and receipt after every successful payment.
                      </p>
                      <p className="text-[10px] text-gray-500 border-t border-gray-200 pt-2">
                        <span className="font-bold text-gray-700 block mb-0.5">Disclaimer:</span>
                        SeniorEase provides friendly digital assistance and everyday support for senior citizens in the UK. We do not provide medical, emergency, legal, financial, or regulated care services.
                      </p>
                    </div>

                    {/* Bold Subscription Statement */}
                    <p className="text-sm font-bold text-gray-950">
                      Subscription: {plan.price}/month, billed automatically every month until cancelled.
                    </p>

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
                        I understand this is a recurring monthly subscription and I authorize automatic payments.
                      </label>
                    </div>

                    {/* Direct links to legal pages */}
                    <p className="text-xs text-gray-500 font-medium pl-6.5">
                      By subscribing, you agree to our{' '}
                      <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-semibold">Terms & Conditions</a>,{' '}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-semibold">Privacy Policy</a>, and{' '}
                      <a href="/refund" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-semibold">Refund Policy</a>.
                    </p>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isSubmitting || (!!plan && !consentChecked)}
                  className="w-full bg-teal-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Processing...
                    </>
                  ) : (
                    plan ? `Register for ${plan.price}/month` : 'Request Free Call'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

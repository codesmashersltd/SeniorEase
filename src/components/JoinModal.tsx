import React, { useState } from 'react';
import { X, CheckCircle2, Loader2, ShieldCheck, Info } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: { name: string; price: string } | null;
}

export default function JoinModal({ isOpen, onClose, plan }: JoinModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [email, setEmail] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState('');

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

      // Save as lead/joinee ticket in Firestore
      await addDoc(collection(db, 'tickets'), ticketPayload);

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
                {plan ? 'Please fill in your details below. Our team will process your registration and email you a secure payment link to activate your software membership and dashboard access.' : 'Please fill in your details below. Our team will contact you shortly to schedule your free setup call.'}
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

              <div className="pt-4">
                {plan && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
                    <span className="font-bold block mb-1">Subscription Consent</span>
                    By subscribing, you agree to recurring monthly billing until cancelled. You may cancel before your next billing date. By starting your membership immediately, you request that we begin providing the service during the cancellation period, which may affect your right to a full refund once service access begins.If Payment done through BACS Direct Debit then the service will start only after receiving the Payment
                    
                    <span className="font-bold block mt-3 mb-1">Disclaimer:</span>
                    Senior Ease provides friendly digital assistance and everyday support for senior citizens in the UK. We do not provide medical, emergency, legal, financial, or regulated care services.
                  </div>
                )}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-teal-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Processing...
                    </>
                  ) : (
                    plan ? 'Complete Registration' : 'Request Free Call'
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

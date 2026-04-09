import React, { useState } from 'react';
import { X, CheckCircle2, Loader2, ShieldCheck, Info } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userEmail = formData.get('email') as string;
    setEmail(userEmail);
    
    setIsSubmitting(true);

    // Simulate API call and ID generation
    setTimeout(() => {
      const newId = `SE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setCustomerId(newId);
      
      // --- BACKEND SIMULATION ---
      // In a real app, this data would be sent to your Express backend
      // which would then use SendGrid/AWS SES to email support@senioreaseuk.co.uk
      const customerData = {
        customerId: newId,
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        postcode: formData.get('postcode'),
        planName: plan ? plan.name : 'General Registration (No specific plan selected)',
        planPrice: plan ? plan.price : 'N/A'
      };
      
      console.log('=== BACKEND SUBMISSION SIMULATION ===');
      console.log('To: support@senioreaseuk.co.uk');
      console.log('Subject: New Customer Registration - ' + newId);
      console.log('Data:', JSON.stringify(customerData, null, 2));
      console.log('Action Required: Generate Stripe Invoice and send to customer.');
      console.log('=====================================');

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsSubmitting(false);
    setCustomerId('');
    setEmail('');
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
            {plan ? `Join ${plan.name} Plan` : 'Join SeniorEase'}
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
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Registration Sent!</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Your details have been securely sent to our team. We've generated your unique Customer ID.
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-2">Your Customer ID</p>
                <p className="text-3xl font-bold text-teal-600 tracking-widest">{customerId}</p>
              </div>

              <div className="flex items-start gap-3 text-left bg-teal-50 p-4 rounded-xl border border-teal-100 mb-4">
                <ShieldCheck className="text-teal-600 shrink-0 mt-0.5" size={20} />
                <p className="text-teal-900 text-sm">
                  We have sent a confirmation email to <span className="font-bold">{email}</span>.
                </p>
              </div>

              <div className="flex items-start gap-3 text-left bg-blue-50 p-4 rounded-xl border border-blue-100">
                <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
                <p className="text-blue-900 text-sm">
                  <span className="font-bold">Next Steps:</span> Our team is processing your request. You will shortly receive an invoice and a secure payment link via email to activate your {plan ? plan.name : 'membership'}.
                </p>
              </div>

              <button
                onClick={handleClose}
                className="mt-8 w-full bg-teal-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-md"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-gray-600 mb-6">
                Please fill in your details below. Our team will process your registration and email you a secure payment link to activate your membership.
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
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
                  <span className="font-bold block mb-1">Subscription Consent</span>
                  By subscribing, you agree to recurring monthly billing until cancelled. You may cancel before your next billing date. By starting your membership immediately, you request that we begin providing the service during the cancellation period, which may affect your right to a full refund once service access begins.
                </div>
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
                    'Complete Registration'
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

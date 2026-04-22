import { Link } from 'react-router-dom';
import { Mail, Phone, Clock, MessageSquare, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Contact() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const ticketPayload = {
        name: (formData.get('name') as string) || 'No Name',
        email: (formData.get('email') as string) || '',
        phone: (formData.get('phone') as string) || '',
        enquiryType: (formData.get('enquiryType') as string) || 'General',
        message: (formData.get('message') as string) || 'No Message',
        status: 'Open',
        source: 'Contact Us',
        createdAt: serverTimestamp()
      };
      console.log('Sending Contact Ticket:', ticketPayload);
      
      await addDoc(collection(db, 'tickets'), ticketPayload);

      setShowSuccessModal(true);
      form.reset();
    } catch (error: any) {
      console.error("Error adding document: ", error);
      alert(`There was an issue sending your message: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 border-b border-gray-100 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&q=80&w=2000" 
            alt="Senior on phone" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-white/60"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">Contact Us</h1>
          <p className="text-2xl text-teal-600 font-medium mb-6">We’re here to help you get started</p>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            If you have any questions about our services, memberships, or support options, we’d be happy to help.
          </p>
        </div>
      </section>

      {/* Contact Details & Form */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            
            {/* Contact Details */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-teal-100 p-3 rounded-xl text-teal-600 shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                    <a href="mailto:support@senioreaseuk.co.uk" className="text-teal-600 hover:underline">support@senioreaseuk.co.uk</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-teal-100 p-3 rounded-xl text-teal-600 shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">+44 XXXX XXXXXX</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-teal-100 p-3 rounded-xl text-teal-600 shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Business Hours</h3>
                    <p className="text-gray-600">Monday to Friday<br/>9:00 AM – 5:30 PM (UK Time)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-teal-100 p-3 rounded-xl text-teal-600 shrink-0">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">WhatsApp</h3>
                    <p className="text-gray-600">Available for members as part of support access.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">Please fill in the form below and we’ll get back to you as soon as possible.</p>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input required name="name" type="text" id="name" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition-shadow" placeholder="Your name" />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input required name="email" type="email" id="email" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition-shadow" placeholder="your@email.com" />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input required name="phone" type="tel" id="phone" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition-shadow" placeholder="Your phone number" />
                </div>

                <div>
                  <label htmlFor="enquiryType" className="block text-sm font-medium text-gray-700 mb-2">Are you enquiring for yourself or a family member?</label>
                  <select required name="enquiryType" id="enquiryType" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition-shadow bg-white">
                    <option value="">Please select...</option>
                    <option value="self">For myself</option>
                    <option value="family">For a family member</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                  <textarea required name="message" id="message" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition-shadow resize-none" placeholder="How can we help?"></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-teal-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-md disabled:bg-teal-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Contact Us'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Want to Get Started Instead?</h2>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-700 transition-colors shadow-lg"
          >
            View Membership Plans <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => setShowSuccessModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
            >
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-50 text-teal-600 mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Request Sent!</h3>
                <p className="text-gray-600 mb-8 text-lg font-medium leading-relaxed">
                  Our team will get in touch with you within 24 hours. Thank you for your patience.
                </p>
                
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full bg-teal-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-md"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

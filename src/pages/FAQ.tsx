import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { HelpCircle, ArrowRight, Landmark, ShieldCheck, Calendar, Bell, RefreshCw, CheckCircle2, FileText } from 'lucide-react';
import faqHeroImage from '../assets/images/seniors_faq_hero_1784468031510.jpg';
import { usePageMeta } from '../hooks/usePageMeta';

export default function FAQ() {
  usePageMeta(
    "Frequently Asked Questions | SeniorEase",
    "Find clear answers to common questions about SeniorEase tech support, billing, device coverage, cancellations, and security training."
  );
  const [activeCategory, setActiveCategory] = useState<'all' | 'general' | 'direct-debit' | 'refunds'>('all');

  const generalFaqs = [
    {
      q: "What does the SeniorEase SaaS Platform educate on?",
      a: "The SeniorEase SaaS Platform educates on everyday digital tasks such as smartphones, WhatsApp, emails, video calls, online forms, reminders, and general digital confidence support via our secure portal."
    },
    {
      q: "Is SeniorEase a care or medical service?",
      a: "No. SeniorEase is strictly a Software as a Service (SaaS). We provide software tools, dashboards, and friendly digital assistance only. We are not a medical, emergency, nursing, or regulated care provider."
    },
    {
      q: "How do the SaaS monthly plans work?",
      a: "Our software subscriptions are billed monthly and renew automatically until cancelled. Each software plan includes a different level of portal access and ticketing features."
    },
    {
      q: "How do I cancel my membership?",
      a: "You can request cancellation before your next billing date by contacting us using the contact details on our website or directly through your self-service account dashboard."
    },
    {
      q: "Can a family member purchase a plan on behalf of a loved one?",
      a: "Yes. A family member or authorised person may subscribe on behalf of a senior citizen where appropriate."
    },
    {
      q: "What if I need more education than my plan includes?",
      a: "If you need more support than your current plan allows, we may recommend upgrading to a more suitable plan."
    },
    {
      q: "Do you offer emergency support?",
      a: "No. SeniorEase is not an emergency service. If urgent learning is needed, customers should contact the appropriate emergency or professional service."
    }
  ];

  const refundCancellationFaqs = [
    {
      q: "What is your refund policy for monthly subscription plans?",
      a: "We operate with a transparent, customer-first refund policy. Under the UK Consumer Contracts Regulations, new subscribers are entitled to a 14-day statutory cooling-off period. If you cancel within these 14 days and have not utilized our 1-on-1 tutoring or technical support helpline, you will receive a 100% full refund immediately. If services were used during this period, a pro-rata refund may be issued reflecting the active days of coverage."
    },
    {
      q: "How do I request a cancellation or refund?",
      a: "You can request a cancellation or refund at any time with zero hassle. Simply log into your SeniorEase 'My Account' dashboard and click 'Cancel Subscription', or reach out directly to our UK customer care team via email at support@senioreease.com or by telephone. We process all requests promptly without restrictive retention scripts or hidden hoops."
    },
    {
      q: "How quickly are approved refunds processed?",
      a: "Once approved by our billing team, refunds are initiated immediately. Depending on your bank or payment card provider, credited funds typically appear back in your original account or card within 3 to 5 business days. If you paid via GoCardless Direct Debit, your bank will process the refund directly to your bank account under UK banking protocols."
    },
    {
      q: "What happens to my portal access after I cancel my subscription?",
      a: "When you cancel a monthly subscription, your membership coverage, technical helpline access, and family safeguarding alerts remain fully active until the end of your current paid billing period. After that date, your account transitions to a free status—you will not be billed again, but your history and official payment receipts remain accessible in your dashboard."
    },
    {
      q: "Can I pause or suspend my membership instead of cancelling?",
      a: "Yes, absolutely! If you or your senior loved one is going on holiday, spending time in hospital, or simply taking a break from digital learning, you can request a temporary subscription pause for up to 3 months. Your assigned tutor and account preferences will be preserved at zero cost until you are ready to resume."
    },
    {
      q: "Are there any cancellation fees, penalties, or lock-in contracts?",
      a: "Never. SeniorEase is strictly a flexible month-to-month SaaS platform. There are zero cancellation fees, no hidden exit charges, and no long-term lock-in contracts. You remain in total control of your subscription at all times."
    },
    {
      q: "What if an accidental duplicate payment or Direct Debit error occurs?",
      a: "If a billing error or accidental duplicate collection occurs, you are fully protected. Under the UK Direct Debit Guarantee and our internal billing pledge, any erroneous charges made by SeniorEase or GoCardless will be refunded in full immediately upon notification."
    }
  ];

  const directDebitFaqs = [
    {
      q: "When will payment be collected?",
      a: "When you set up a Direct Debit mandate with SeniorEase through our secure partner GoCardless, your first monthly payment is typically collected within 3 to 5 working days after mandate confirmation. Subsequent monthly payments are automatically collected on or around the same date each month. You will always receive an automated email confirmation prior to any funds being debited from your bank account."
    },
    {
      q: "How do I cancel my subscription and Direct Debit?",
      a: "Cancelling your subscription is simple, transparent, and hassle-free. You can cancel at any time through your SeniorEase online account dashboard or by emailing our customer support team at support@senioreease.com. When your subscription is cancelled, we immediately cancel your GoCardless Direct Debit mandate so no further automated billing occurs. Furthermore, you retain the absolute right under UK banking rules to cancel the Direct Debit instruction directly with your bank or building society at any time."
    },
    {
      q: "Will I receive advance notice before collections?",
      a: "Yes, absolutely! In strict accordance with the UK Direct Debit Guarantee and GoCardless banking protocols, you will always receive advance notification by email (typically 3 working days prior) before any payment is collected from your bank account. This advance notice clearly states the collection amount, due date, and mandate reference number, ensuring total financial clarity and peace of mind."
    },
    {
      q: "What is the Direct Debit Guarantee?",
      a: "The Direct Debit Guarantee is offered by all UK banks and building societies that accept instructions to pay Direct Debits. It protects you against incorrect payments: if an error is made in the payment of your Direct Debit by SeniorEase, GoCardless, or your bank, you are entitled to a full and immediate refund of the amount paid from your bank or building society. Additionally, if you receive a refund you are not entitled to, you must pay it back when requested."
    },
    {
      q: "Can I change my bank details or payment method later?",
      a: "Yes! If you change your bank account or wish to switch your payment method (for example, moving from debit card billing via Stripe to Direct Debit via GoCardless, or vice versa), simply log into your SeniorEase dashboard and visit the 'Billing & Payment Methods' section. From there, you can securely update your bank details or set up a new mandate without any interruption to your tech support coverage. Our team is also happy to assist you over the phone or by email if needed."
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950 text-white py-16 md:py-28 overflow-hidden border-b border-teal-900/40">
        {/* Subtle background glow */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Text */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 text-center lg:text-left"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold text-sm mb-6 border border-teal-500/30 backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                Got Questions?
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-white leading-[1.1]">
                Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">Questions</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-teal-100/90 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8">
                Helpful answers about how our simple digital learning platform works, UK consumer protections, billing, and Direct Debit guarantees.
              </p>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-teal-200/80 font-semibold">
                <span className="flex items-center gap-1.5 bg-white/5 px-3.5 py-2 rounded-xl border border-white/10">
                  💬 UK Customer Helpline
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 px-3.5 py-2 rounded-xl border border-white/10">
                  📋 Transparent Billing Terms
                </span>
              </div>
            </motion.div>

            {/* Right Column: Hero Image Fully Displayed */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Decorative border frame effect */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-teal-500/40 via-emerald-500/30 to-teal-500/40 rounded-[2rem] blur-md opacity-75"></div>
                
                <div className="relative rounded-[1.75rem] overflow-hidden shadow-2xl bg-slate-800 border border-teal-400/30 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]">
                  <img 
                    src={faqHeroImage} 
                    alt="Friendly support representative helping seniors" 
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[1.75rem]"></div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 sm:left-4 bg-slate-900/95 text-white p-3.5 sm:p-4 rounded-2xl border border-teal-500/30 shadow-xl flex items-center gap-3 backdrop-blur-md">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-300 font-bold text-lg shrink-0">
                    ❓
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-teal-300 uppercase tracking-wider">Here to Assist</div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-200">Clear answers, zero hassle</div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* FAQs Content */}
      <section className="py-20 bg-gray-50">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-3 rounded-full font-bold text-sm md:text-base transition-all shadow-sm ${
                activeCategory === 'all'
                  ? 'bg-teal-600 text-white shadow-teal-600/25 scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Questions ({generalFaqs.length + directDebitFaqs.length + refundCancellationFaqs.length})
            </button>
            <button
              onClick={() => setActiveCategory('general')}
              className={`px-6 py-3 rounded-full font-bold text-sm md:text-base transition-all shadow-sm ${
                activeCategory === 'general'
                  ? 'bg-teal-600 text-white shadow-teal-600/25 scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              General & Support ({generalFaqs.length})
            </button>
            <button
              onClick={() => setActiveCategory('refunds')}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm md:text-base transition-all shadow-sm ${
                activeCategory === 'refunds'
                  ? 'bg-teal-600 text-white shadow-teal-600/25 scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <RefreshCw size={18} className={activeCategory === 'refunds' ? 'text-teal-200' : 'text-teal-600'} />
              Refunds & Cancellations ({refundCancellationFaqs.length})
            </button>
            <button
              onClick={() => setActiveCategory('direct-debit')}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm md:text-base transition-all shadow-sm ${
                activeCategory === 'direct-debit'
                  ? 'bg-teal-600 text-white shadow-teal-600/25 scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Landmark size={18} className={activeCategory === 'direct-debit' ? 'text-teal-200' : 'text-teal-600'} />
              Direct Debit & Billing ({directDebitFaqs.length})
            </button>
          </div>

          {/* General & Support Section */}
          {(activeCategory === 'all' || activeCategory === 'general') && (
            <div className="mb-16">
              {activeCategory === 'all' && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center font-bold">
                    <HelpCircle size={22} />
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-900">General Platform & Tech Support FAQs</h2>
                </div>
              )}
              <div className="space-y-6">
                {generalFaqs.map((faq, index) => (
                  <div key={index} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:border-teal-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-start gap-3">
                      <span className="text-teal-600 font-black shrink-0">{index + 1}.</span>
                      <span>{faq.q}</span>
                    </h3>
                    <p className="text-gray-600 leading-relaxed pl-7">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Refunds & Cancellations Section */}
          {(activeCategory === 'all' || activeCategory === 'refunds') && (
            <div className="mb-16">
              {activeCategory === 'all' && (
                <div className="flex items-center gap-3 mb-6 pt-6 border-t border-gray-200">
                  <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center font-bold">
                    <RefreshCw size={22} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900">Refunds, Cancellations & Billing Policy FAQs</h2>
                    <p className="text-sm text-gray-500">Transparent month-to-month terms, 14-day statutory cooling-off period, and zero lock-in contracts</p>
                  </div>
                </div>
              )}

              {/* Refund Policy Highlight Box */}
              <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white p-6 md:p-8 rounded-3xl shadow-md mb-8 border border-teal-700 flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-teal-500/20 border border-teal-400/30 text-teal-300 rounded-2xl flex items-center justify-center shrink-0">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <span>Our 100% No-Hassle Cancellation & Refund Pledge</span>
                  </h3>
                  <p className="text-teal-100 text-sm md:text-base leading-relaxed">
                    We believe in earning our customers' trust every single month. You can cancel your subscription with a single click in your dashboard or by sending us an email. If you cancel within the first 14 days without using our tutoring services, you receive an immediate, full 100% refund under UK consumer protection laws.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {refundCancellationFaqs.map((faq, index) => (
                  <div key={index} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:border-teal-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50/50 rounded-bl-full -mr-6 -mt-6 -z-0 pointer-events-none"></div>
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-start gap-3">
                        <span className="text-teal-600 font-black shrink-0">{index + 1}.</span>
                        <span>{faq.q}</span>
                      </h3>
                      <p className="text-gray-600 leading-relaxed pl-7">{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Direct Debit & Billing Section */}
          {(activeCategory === 'all' || activeCategory === 'direct-debit') && (
            <div className="mb-8">
              {activeCategory === 'all' && (
                <div className="flex items-center gap-3 mb-6 pt-6 border-t border-gray-200">
                  <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center font-bold">
                    <Landmark size={22} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900">Direct Debit & Payment FAQs</h2>
                    <p className="text-sm text-gray-500">Secure automated billing powered by GoCardless & protected by the UK Direct Debit Guarantee</p>
                  </div>
                </div>
              )}

              {/* Direct Debit Guarantee Badge Banner */}
              <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-md mb-8 border border-teal-700 flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-teal-500/20 border border-teal-400/30 text-teal-300 rounded-2xl flex items-center justify-center shrink-0">
                  <ShieldCheck size={36} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <span>Protected by the UK Direct Debit Guarantee</span>
                  </h3>
                  <p className="text-teal-100 text-sm md:text-base leading-relaxed">
                    All Direct Debit collections are processed securely by <strong>GoCardless</strong> and are fully protected by the UK Consumer Direct Debit Guarantee. You receive advance notice prior to any collection, and you are entitled to an immediate refund from your bank in the unlikely event of any error.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {directDebitFaqs.map((faq, index) => (
                  <div key={index} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:border-teal-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50/50 rounded-bl-full -mr-6 -mt-6 -z-0 pointer-events-none"></div>
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-start gap-3">
                        <span className="text-teal-600 font-black shrink-0">{index + 1}.</span>
                        <span>{faq.q}</span>
                      </h3>
                      <p className="text-gray-600 leading-relaxed pl-7">{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white text-center border-t border-gray-100">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Our friendly, patient support team is always here to help you or your loved ones get started.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-700 transition-colors shadow-lg"
          >
            Contact Us <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}

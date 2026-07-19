import { Link } from 'react-router-dom';
import { HelpCircle, ArrowRight } from 'lucide-react';
import faqHeroImage from '../assets/images/seniors_faq_hero_1784446901963.jpg';

export default function FAQ() {
  const faqs = [
    {
      q: "What does the Senior Ease SaaS Platform educate on?",
      a: "The Senior Ease SaaS Platform educates on everyday digital tasks such as smartphones, WhatsApp, emails, video calls, online forms, reminders, and general digital confidence support via our secure portal."
    },
    {
      q: "Is Senior Ease a care or medical service?",
      a: "No. Senior Ease is strictly a Software as a Service (SaaS). We provide software tools, dashboards, and friendly digital assistance only. We are not a medical, emergency, nursing, or regulated care provider."
    },
    {
      q: "How do the SaaS monthly plans work?",
      a: "Our software subscriptions are billed monthly and renew automatically until cancelled. Each software plan includes a different level of portal access and ticketing features."
    },
    {
      q: "How do I cancel my membership?",
      a: "You can request cancellation before your next billing date by contacting us using the contact details on our website."
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
      a: "No. Senior Ease is not an emergency service. If urgent learning is needed, customers should contact the appropriate emergency or professional service."
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative text-white py-16 md:py-40 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 hidden md:block">
          <img 
            src={faqHeroImage} 
            alt="Friendly support representative helping seniors" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-slate-950/65 backdrop-blur-[0.5px]"></div>
        </div>

        {/* Mobile background (soft dark gradient) */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 md:hidden"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold text-sm mb-6 border border-teal-500/30 backdrop-blur-md">
            Got Questions?
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-2xl text-teal-100 font-medium leading-relaxed max-w-3xl mx-auto mb-8 md:mb-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
            Helpful answers about how our simple digital learning platform works.
          </p>

          {/* Mobile Hero Image */}
          <div className="block md:hidden mb-2 relative">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-teal-500/20">
              <img 
                src={faqHeroImage} 
                alt="Friendly support representative helping seniors" 
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10"></div>
          </div>
        </div>
      </section>

      {/* FAQs List */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-start gap-3">
                  <span className="text-teal-600 font-black">{index + 1}.</span>
                  {faq.q}
                </h3>
                <p className="text-gray-600 leading-relaxed pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Still Have Questions?</h2>
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

import { Link } from 'react-router-dom';
import { HelpCircle, ArrowRight } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      q: "What does Senior Ease help with?",
      a: "Senior Ease helps with everyday digital tasks such as smartphones, WhatsApp, emails, video calls, online forms, reminders, and general digital confidence support."
    },
    {
      q: "Is Senior Ease a care or medical service?",
      a: "No. Senior Ease is not a medical, emergency, nursing, or regulated care service. We provide friendly digital assistance and everyday support only."
    },
    {
      q: "How do the monthly plans work?",
      a: "Our plans are billed monthly and renew automatically until cancelled. Each plan includes a different level of support access and service features."
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
      q: "What if I need more help than my plan includes?",
      a: "If you need more support than your current plan allows, we may recommend upgrading to a more suitable plan."
    },
    {
      q: "Do you offer emergency support?",
      a: "No. Senior Ease is not an emergency service. If urgent help is needed, customers should contact the appropriate emergency or professional service."
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative text-white py-32 overflow-hidden bg-teal-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-800 text-teal-100 mb-6">
            <HelpCircle size={32} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Frequently Asked Questions</h1>
          <p className="text-xl text-teal-100 leading-relaxed max-w-2xl mx-auto">
            Helpful answers about how SeniorEase works
          </p>
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

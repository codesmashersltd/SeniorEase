import { Link } from 'react-router-dom';
import { HelpCircle, ArrowRight } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      q: "What is SeniorEase?",
      a: "SeniorEase is a monthly digital support membership for senior citizens in the UK. We provide friendly help with everyday technology and online tasks."
    },
    {
      q: "Is this a medical or care service?",
      a: "No. We are not a medical, emergency, or personal care service. We provide non-medical digital help and everyday support only."
    },
    {
      q: "Who is this service for?",
      a: "Our service is designed for senior citizens, older adults who need digital help, and families supporting elderly parents or loved ones."
    },
    {
      q: "Can I buy a plan for my parent or relative?",
      a: "Yes. Many customers choose a membership for a parent, grandparent, or loved one."
    },
    {
      q: "What kind of things can you help with?",
      a: "We can help with smartphones, WhatsApp, emails, video calls, online forms, basic account access guidance, and scam awareness support."
    },
    {
      q: "Do you offer emergency support?",
      a: "No. We do not provide emergency or urgent support services."
    },
    {
      q: "Do you guarantee protection from scams?",
      a: "No. We provide general scam awareness guidance and digital safety support, but we do not guarantee prevention or recovery."
    },
    {
      q: "How do members request support?",
      a: "Members will receive guidance after signup on how to request help and contact support."
    },
    {
      q: "Can I cancel my plan?",
      a: "Yes. You can request cancellation in line with our cancellation policy."
    },
    {
      q: "Do you support all devices?",
      a: "We aim to help with common everyday devices and digital tasks, but support may vary depending on the issue."
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-white py-24 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-50 text-teal-600 mb-6">
            <HelpCircle size={32} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
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

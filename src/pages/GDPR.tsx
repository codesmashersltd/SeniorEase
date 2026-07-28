import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

export default function GDPR() {
  usePageMeta(
    "GDPR Compliance | SeniorEase",
    "Summary of how SeniorEase complies with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018."
  );

  return (
    <div className="bg-gray-50 py-24">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
          id="gdpr-container"
        >
          <div className="bg-teal-900 p-8 md:p-12 text-center relative overflow-hidden" id="gdpr-header">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-800 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <ShieldCheck className="w-16 h-16 text-teal-300 mx-auto mb-6" id="gdpr-icon" />
              <h1 className="text-4xl font-bold text-white mb-4" id="gdpr-title">GDPR Compliance</h1>
              <p className="text-teal-100 text-lg max-w-2xl mx-auto" id="gdpr-subtitle">
                How SeniorEase complies with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12 prose prose-teal max-w-none text-gray-600 space-y-8" id="gdpr-body">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-2" id="gdpr-metadata">
              <p className="font-semibold text-gray-900">Effective Date: 01 June 2026</p>
              <p className="font-semibold text-gray-900">Company Name: SeniorEase</p>
              <p className="font-semibold text-gray-900">Website: <a href="https://www.senioreease.com" className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.senioreease.com</a></p>
              <p className="font-semibold text-gray-900">Email: <a href="mailto:privacy@senioreease.com" className="text-teal-600 hover:underline">privacy@senioreease.com</a></p>
              <p className="font-semibold text-gray-900">Telephone: <a href="tel:+443304010019" className="text-teal-600 hover:underline">+44 (0) 330 401 0019</a></p>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">
              This page summarises how SeniorEase complies with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. For the full legal detail on what we collect, why, and how, please see our <Link to="/privacy" className="text-teal-600 hover:underline font-semibold">Privacy Policy</Link>.
            </p>

            <hr className="border-gray-200" />

            <section id="gdpr-section-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Our Approach</h2>
              <p className="leading-relaxed">
                SeniorEase takes data protection seriously, particularly given the nature of our customers. We are guided by the core principles of UK GDPR: we collect only what we need, we&apos;re clear about why we need it, we keep it secure, and we give you control over it.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="gdpr-section-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. What This Means in Practice</h2>
              <ul className="list-disc pl-6 space-y-3">
                <li><strong className="text-gray-900">Minimal data collection</strong> — we only collect the information required to deliver our Services (see our Privacy Policy for the full list).</li>
                <li><strong className="text-gray-900">Clear consent</strong> — where we rely on your consent (for example, sharing training progress with a family member), you can withdraw it at any time.</li>
                <li><strong className="text-gray-900">Secure payment handling</strong> — all billing is processed via Stripe; we do not store full card details ourselves.</li>
                <li><strong className="text-gray-900">Data retention limits</strong> — we don&apos;t keep your data longer than necessary, and closed accounts are deleted or anonymised in line with our published retention periods.</li>
                <li><strong className="text-gray-900">Your rights are respected</strong> — access, correction, erasure, portability, and objection requests are handled promptly by our team.</li>
              </ul>
            </section>

            <hr className="border-gray-200" />

            <section id="gdpr-section-3">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Protection Contact</h2>
              <p className="mb-4">
                For any question about how your data is handled, or to exercise your rights under UK GDPR:
              </p>
              <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-100/50 space-y-1 mb-4" id="gdpr-contact-box">
                <p className="font-bold text-teal-900 mb-1">SeniorEase Data Protection</p>
                <p><span className="font-semibold text-teal-800">Email:</span> <a href="mailto:privacy@senioreease.com" className="text-teal-700 hover:underline">privacy@senioreease.com</a></p>
                <p><span className="font-semibold text-teal-800">Phone:</span> <a href="tel:+443304010019" className="text-teal-700 hover:underline">+44 (0) 330 401 0019</a></p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We aim to acknowledge data protection queries within 5 business days and resolve formal requests within one calendar month, as required by law.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="gdpr-section-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Your Right to Complain</h2>
              <p className="mb-4 leading-relaxed">
                If you&apos;re ever unhappy with how we&apos;ve handled your personal data, we&apos;d like the chance to put it right directly — but you also have the right to complain to the UK&apos;s independent regulator:
              </p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-1" id="gdpr-ico-box">
                <p className="font-bold text-slate-900 mb-1">Information Commissioner&apos;s Office (ICO)</p>
                <p><span className="font-semibold text-slate-700">Website:</span> <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline inline-flex items-center gap-1">ico.org.uk <ExternalLink className="w-3.5 h-3.5" /></a></p>
                <p><span className="font-semibold text-slate-700">Telephone:</span> <a href="tel:03031231113" className="text-teal-600 hover:underline">0303 123 1113</a></p>
              </div>
            </section>

            <hr className="border-gray-200" />

            <section id="gdpr-section-5">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Where to Find the Full Detail</h2>
              <p className="leading-relaxed">
                This page is a summary for quick reference. The complete, legally detailed account of our data processing — including legal basis, international transfers, retention periods, and third-party processors — is set out in our <Link to="/privacy" className="text-teal-600 hover:underline font-semibold">Privacy Policy</Link>.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Disclaimer() {
  usePageMeta(
    "Disclaimer | SeniorEase",
    "Important legal disclosures and disclaimers regarding SeniorEase subscriptions, educational materials, and third-party device guidance."
  );

  return (
    <div className="bg-gray-50 py-24">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
          id="disclaimer-container"
        >
          <div className="bg-teal-900 p-8 md:p-12 text-center relative overflow-hidden" id="disclaimer-header">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-800 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <ShieldAlert className="w-16 h-16 text-teal-300 mx-auto mb-6" id="disclaimer-icon" />
              <h1 className="text-4xl font-bold text-white mb-4" id="disclaimer-title">Disclaimer</h1>
              <p className="text-teal-100 text-lg max-w-2xl mx-auto" id="disclaimer-subtitle">
                This Disclaimer explains the scope and limitations of the services provided by SeniorEase.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12 prose prose-teal max-w-none text-gray-600 space-y-8" id="disclaimer-body">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-2" id="disclaimer-metadata">
              <p className="font-semibold text-gray-900">Effective Date: 01 June 2026</p>
              <p className="font-semibold text-gray-900">Company Name: SeniorEase</p>
              <p className="font-semibold text-gray-900">Website: <a href="https://www.senioreease.com" className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.senioreease.com</a></p>
              <p className="font-semibold text-gray-900">Email: <a href="mailto:support@senioreease.com" className="text-teal-600 hover:underline">support@senioreease.com</a></p>
              <p className="font-semibold text-gray-900">Telephone: <a href="tel:+443304010019" className="text-teal-600 hover:underline">+44 (0) 330 401 0019</a></p>
            </div>

            <hr className="border-gray-200" />

            <section id="disclaimer-section-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction &amp; Brand Identity Notice</h2>
              <p className="mb-4">
                SeniorEase (senioreease.com) is an independent UK digital technology learning and support SaaS service for older adults.
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>We are not affiliated with any senior living provider, residential care home, or property discovery platform, including any similarly named business or service operating under the "SeniorEase" name elsewhere.</li>
                <li>We are not part of, endorsed by, or affiliated with the NHS, any NHS trust, or any other public healthcare body. Any reference to health, wellbeing, or safeguarding standards on our website reflects our own internal practices, not a formal certification, partnership, or endorsement.</li>
              </ul>
              <p className="bg-amber-50/80 p-4 rounded-xl border border-amber-200/80 text-amber-950 font-medium">
                If you believe you have reached this page in error while looking for a different organisation, please contact us and we will do our best to point you in the right direction.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="disclaimer-section-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. No Professional, Medical, Legal, or Financial Advice</h2>
              <p className="mb-3">
                SeniorEase provides general digital technology education and support only. Nothing on our website or delivered during a support session constitutes:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Medical or health advice</li>
                <li>Legal advice</li>
                <li>Financial or investment advice</li>
                <li>Formal social care or safeguarding assessment</li>
              </ul>
              <p className="font-semibold text-gray-900">
                If you require advice in any of these areas, please consult a qualified, regulated professional or relevant statutory body.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="disclaimer-section-3">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. No Guaranteed Outcomes &amp; Protecting Vulnerable Adults</h2>
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 text-amber-950 mb-6 shadow-sm">
                <p className="font-bold text-amber-900 text-lg mb-2 flex items-center gap-2">
                  <span>🛡️ Our Safeguarding Commitment:</span>
                </p>
                <p className="font-semibold text-amber-950 text-base leading-relaxed mb-3">
                  &ldquo;We know that many of the people we support are more vulnerable to online risks because of age, isolation, or unfamiliarity with technology. We can&apos;t make that risk disappear completely — no one can — but we&apos;ve built real safeguards into how we work, and we&apos;re upfront about where our role ends and a bank, family member, or the authorities should take over.&rdquo;
                </p>
                <p className="text-sm text-amber-900 leading-relaxed mb-4">
                  We acknowledge that serving older adults involves an inherent customer risk profile due to cognitive variance and third-party scam targeting. To mitigate this, we enforce strict safeguarding rules (such as zero access to banking apps and patient pacing) combined with transparent no-guarantee language.
                </p>
                <Link to="/safeguarding" className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-4 py-2 rounded-xl transition-colors">
                  <span>View Our Commitment to Protecting Vulnerable Adults</span>
                  <span>&rarr;</span>
                </Link>
              </div>
              <p className="mb-3">
                While we provide training in scam and fraud awareness, digital literacy, and safe technology use:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We cannot guarantee that a customer will avoid scams, fraud, or unwanted contact after completing our training.</li>
                <li>Learning outcomes vary between individuals, and we cannot guarantee a specific level of digital proficiency will be reached within any given timeframe.</li>
                <li>Our guidance reflects best practice and common scam patterns known to us at the time of training, which may not cover every emerging threat.</li>
              </ul>
            </section>

            <hr className="border-gray-200" />

            <section id="disclaimer-section-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Services and Platforms</h2>
              <p className="mb-3">
                Our support sessions may reference or make use of third-party platforms such as WhatsApp, Zoom, FaceTime, or various email providers. SeniorEase:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Does not own, operate, or control these third-party platforms.</li>
                <li>Is not responsible for their availability, functionality, security practices, or any changes they make to their services.</li>
                <li>Recommends customers refer to each platform's own terms and privacy policy for details on how their data is handled.</li>
              </ul>
            </section>

            <hr className="border-gray-200" />

            <section id="disclaimer-section-5">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Accuracy of Information</h2>
              <p className="mb-3">
                We take reasonable care to ensure the information provided on our website and during support sessions is accurate and up to date. However:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Technology, scams, and platform features change frequently, and some information may become outdated between updates.</li>
                <li>We do not warrant that all content is complete, current, or error-free, and recommend verifying critical information (e.g. current scam trends) through official sources such as Action Fraud or your bank.</li>
              </ul>
            </section>

            <hr className="border-gray-200" />

            <section id="disclaimer-section-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
              <p>
                This Disclaimer should be read alongside our <a href="/terms" className="text-teal-600 hover:underline font-medium">Terms &amp; Conditions</a>, which sets out the full limitation of liability applicable to our Services. To the fullest extent permitted by law, SeniorEase accepts no liability for losses arising from reliance on general guidance provided through our Services, except where such liability cannot be excluded under UK law (e.g. death, personal injury, or fraud caused by our negligence).
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="disclaimer-section-7">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Changes to This Disclaimer</h2>
              <p>
                We may update this Disclaimer from time to time to reflect changes in our Services or applicable law. The "Effective Date" above will always reflect the most recent version.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="disclaimer-section-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
              <p className="mb-6">
                If you have questions about this Disclaimer:
              </p>
              <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-100/50 space-y-1" id="disclaimer-contact-box">
                <p className="font-bold text-teal-900 mb-2">SeniorEase</p>
                <p><span className="font-semibold text-teal-800">Email:</span> <a href="mailto:support@senioreease.com" className="text-teal-700 hover:underline">support@senioreease.com</a></p>
                <p><span className="font-semibold text-teal-800">Phone:</span> <a href="tel:+443304010019" className="text-teal-700 hover:underline">+44 (0) 330 401 0019</a></p>
                <p><span className="font-semibold text-teal-800">Address:</span> SeniorEase, 160 City Road, Kemp House, London, EC1V 2NX</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

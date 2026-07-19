import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function Disclaimer() {
  return (
    <div className="bg-gray-50 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                This Disclaimer explains the scope and limitations of the services provided by Senior Ease.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12 prose prose-teal max-w-none text-gray-600 space-y-8" id="disclaimer-body">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-1" id="disclaimer-metadata">
              <p className="font-semibold text-gray-900">Effective Date: 01 June 2026</p>
              <p className="font-semibold text-gray-900">Business Name: Senior Ease</p>
              <p className="font-semibold text-gray-900">Website: <a href="https://www.senioreease.com" className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.senioreease.com</a></p>
              <p className="font-semibold text-gray-900">Email: <a href="mailto:support@senioreease.com" className="text-teal-600 hover:underline">support@senioreease.com</a></p>
              <p className="font-semibold text-gray-900">Telephone: <a href="tel:+443304010019" className="text-teal-600 hover:underline">+44 (0) 330 401 0019</a></p>
            </div>

            <hr className="border-gray-200" />

            <section id="disclaimer-section-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="mb-4">
                This Disclaimer explains the scope and limitations of the services provided by Senior Ease.
              </p>
              <p className="mb-4">
                Senior Ease is a subscription-based digital education and technical support service that helps senior citizens in the United Kingdom develop confidence in using everyday technology.
              </p>
              <p className="mb-4">
                Our trained support team provides friendly, patient, and practical guidance. We do not provide professional services that require regulation or licensing.
              </p>
              <p>
                By accessing our website or using our services, you acknowledge and agree to this Disclaimer.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="disclaimer-section-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. General Information</h2>
              <p className="mb-4">
                The information, educational materials, and technical guidance provided through our website and services are intended for general information and educational purposes only.
              </p>
              <p className="mb-4">
                Although we aim to provide accurate and helpful information, we do not guarantee that every recommendation or solution will be suitable for every individual, device, or situation.
              </p>
              <p>
                Customers should use their own judgement and seek independent professional advice where appropriate.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="disclaimer-section-3">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Digital Education and Technical Support</h2>
              <p className="mb-4">
                Senior Ease provides guidance to help customers use everyday digital technology more confidently.
              </p>
              <p className="mb-4 font-semibold text-gray-900">Our services may include assistance with:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>smartphones and tablets;</li>
                <li>WhatsApp and other messaging applications;</li>
                <li>email accounts;</li>
                <li>video calling;</li>
                <li>online forms;</li>
                <li>internet safety;</li>
                <li>recognising common online scams;</li>
                <li>improving digital confidence; and</li>
                <li>other everyday technology questions.</li>
              </ul>
              <p className="mb-4">
                Our services are educational and supportive in nature.
              </p>
              <p>
                We do not guarantee that every technical issue can be resolved or that every device or software application will operate as expected.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="disclaimer-section-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. No Professional Advice</h2>
              <p className="mb-4">
                Senior Ease does not provide regulated professional advice.
              </p>
              <p className="mb-4 font-semibold text-gray-900">In particular, we do not provide:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>medical or healthcare advice;</li>
                <li>nursing or personal care services;</li>
                <li>mental health services;</li>
                <li>legal advice;</li>
                <li>financial, investment, pension, or tax advice;</li>
                <li>insurance advice;</li>
                <li>regulated fraud recovery services; or</li>
                <li>any other regulated professional service.</li>
              </ul>
              <p>
                If you require professional advice, you should consult an appropriately qualified professional.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="disclaimer-section-5">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Not an Emergency Service</h2>
              <p className="mb-4">
                Senior Ease is not an emergency service.
              </p>
              <p className="mb-4 font-semibold text-gray-900">We do not provide:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>emergency response;</li>
                <li>crisis intervention;</li>
                <li>emergency call handling;</li>
                <li>urgent medical assistance; or</li>
                <li>personal supervision or safeguarding services.</li>
              </ul>
              <p className="font-semibold text-gray-900">
                If you believe there is an emergency or immediate risk to life, health, or safety, you should contact the appropriate emergency services by calling 999 or seek immediate assistance from the relevant emergency service.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="disclaimer-section-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Third-Party Services</h2>
              <p className="mb-4">
                Many support requests involve products or services provided by independent third parties, including mobile network operators, internet service providers, device manufacturers, software providers, banks, government services, and online platforms.
              </p>
              <p className="mb-4 font-semibold text-gray-900">
                Senior Ease does not own or control these third-party services and cannot guarantee:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>their availability;</li>
                <li>performance;</li>
                <li>compatibility;</li>
                <li>security;</li>
                <li>account access;</li>
                <li>future functionality; or</li>
                <li>uninterrupted operation.</li>
              </ul>
              <p>
                Any issues relating to third-party services may need to be resolved directly with the relevant provider.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="disclaimer-section-7">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Online Safety and Scam Awareness</h2>
              <p className="mb-4">
                As part of our educational services, we may provide general guidance to help customers recognise common online scams and unsafe digital practices.
              </p>
              <p className="mb-4">
                This guidance is intended to improve awareness only.
              </p>
              <p className="mb-4">
                Senior Ease cannot guarantee that fraud, scams, identity theft, or cybercrime will be prevented or detected.
              </p>
              <p>
                If you believe you have been the victim of fraud or a scam, you should immediately contact your bank, payment provider, or the appropriate law enforcement authority.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="disclaimer-section-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Customer Responsibilities</h2>
              <p className="mb-4 font-semibold text-gray-900">Customers remain responsible for:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>decisions made using their own devices or accounts;</li>
                <li>maintaining the confidentiality of passwords and security credentials;</li>
                <li>reviewing information before submitting applications or making payments;</li>
                <li>ensuring information provided to us is accurate and complete; and</li>
                <li>following guidance provided by third-party service providers where applicable.</li>
              </ul>
              <p>
                Senior Ease provides guidance and support, but customers remain responsible for their own actions and decisions.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="disclaimer-section-9">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Website Content</h2>
              <p className="mb-4">
                We make reasonable efforts to ensure that the information published on our website is accurate and up to date.
              </p>
              <p className="mb-4">
                However, we do not guarantee that all content will always be complete, accurate, or free from errors.
              </p>
              <p>
                Website content may be updated, corrected, or removed without prior notice.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="disclaimer-section-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
              <p className="mb-4 font-semibold text-gray-900">
                Nothing in this Disclaimer excludes or limits any liability that cannot legally be excluded under the laws of England and Wales.
              </p>
              <p className="mb-4 font-semibold text-gray-900">
                Subject to applicable law, Senior Ease shall not be liable for any indirect, incidental, consequential, or special loss arising from:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>the use of our website or services;</li>
                <li>reliance on information provided through our services;</li>
                <li>interruptions to third-party services;</li>
                <li>technical failures outside our reasonable control;</li>
                <li>loss of internet connectivity;</li>
                <li>unauthorised access to third-party accounts;</li>
                <li>delays caused by third-party providers; or</li>
                <li>customer actions that are inconsistent with our guidance.</li>
              </ul>
              <p>
                This limitation does not affect your statutory rights as a consumer.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="disclaimer-section-11">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Disclaimer</h2>
              <p className="mb-4">
                We may update this Disclaimer from time to time to reflect changes to our services, legal requirements, or business operations.
              </p>
              <p className="mb-4">
                The most recent version will always be published on our website with the updated Effective Date.
              </p>
              <p>
                Your continued use of our website or services after any update constitutes acceptance of the revised Disclaimer.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="disclaimer-section-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
              <p className="mb-4">
                This Disclaimer shall be governed by and interpreted in accordance with the laws of England and Wales.
              </p>
              <p>
                Any dispute relating to this Disclaimer shall be subject to the exclusive jurisdiction of the courts of England and Wales, except where applicable consumer protection law provides otherwise.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section id="disclaimer-section-13">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
              <p className="mb-6">
                If you have any questions about this Disclaimer or our services, please contact us:
              </p>
              <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-100/50" id="disclaimer-contact-box">
                <p className="font-bold text-teal-900 mb-2">Senior Ease</p>
                <p className="mb-1"><span className="font-semibold text-teal-800">Website:</span> <a href="https://www.senioreease.com" className="text-teal-700 hover:underline" target="_blank" rel="noopener noreferrer">https://www.senioreease.com</a></p>
                <p className="mb-1"><span className="font-semibold text-teal-800">Email:</span> <a href="mailto:support@senioreease.com" className="text-teal-700 hover:underline">support@senioreease.com</a></p>
                <p className="mb-3"><span className="font-semibold text-teal-800">Telephone:</span> <a href="tel:+443304010019" className="text-teal-700 hover:underline">+44 (0) 330 401 0019</a></p>
                <p className="font-semibold text-teal-900 mt-2">Business Hours:</p>
                <p className="text-teal-800">Monday to Friday</p>
                <p className="text-teal-800">9:00 AM to 5:30 PM (UK Time)</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

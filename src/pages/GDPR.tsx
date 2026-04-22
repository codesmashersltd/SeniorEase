import React from 'react';

export default function GDPR() {
  return (
    <div className="bg-gray-50 min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 prose prose-teal max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">GDPR Compliance Statement</h1>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            At our company, we are committed to protecting and respecting your privacy. As a UK-based SaaS startup, we adhere to the principles and requirements of the General Data Protection Regulation (GDPR) and the UK GDPR framework to ensure that personal data is handled securely, transparently, and responsibly.
          </p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Our Commitment to Data Protection</h2>
              <p>
                We take data privacy seriously. Any personal information collected through our platform is processed lawfully, fairly, and in a transparent manner. We only collect data that is necessary to provide and improve our services, particularly those designed to support senior citizens and enhance their digital experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Data We Collect</h2>
              <p className="mb-4">We may collect and process the following types of personal data:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Basic identification information (such as name and contact details)</li>
                <li>Account and usage data</li>
                <li>Communication data (such as messages or support inquiries)</li>
                <li>Technical data (such as device type, IP address, and browser information)</li>
              </ul>
              <p>We ensure that all data collection is relevant, limited, and aligned with specific purposes.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Personal Data</h2>
              <p className="mb-4">Your data is used to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Provide and maintain our services</li>
                <li>Enable key features such as communication tools and safety alerts</li>
                <li>Improve user experience and platform functionality</li>
                <li>Offer customer support</li>
                <li>Comply with legal and regulatory obligations</li>
              </ul>
              <p>We do not sell or misuse your personal data.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Lawful Basis for Processing</h2>
              <p className="mb-4">We process personal data under one or more of the following lawful bases:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>User consent</li>
                <li>Performance of a contract</li>
                <li>Compliance with legal obligations</li>
                <li>Legitimate interests, where these do not override your rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to safeguard personal data against unauthorized access, loss, or misuse. This includes secure servers, encryption where applicable, and strict access controls.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Sharing</h2>
              <p>
                We only share personal data with trusted third parties when necessary to deliver our services (such as hosting providers or support tools), and only under strict data protection agreements. We ensure all third parties comply with GDPR standards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
              <p>
                We retain personal data only for as long as necessary to fulfill the purposes for which it was collected, or to comply with legal requirements. When data is no longer needed, it is securely deleted or anonymized.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Rights Under GDPR</h2>
              <p className="mb-4">As a user, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data (“right to be forgotten”)</li>
                <li>Restrict or object to processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p>Requests can be made by contacting us directly, and we will respond within the legally required timeframe.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies and Tracking</h2>
              <p>
                We may use cookies and similar technologies to enhance user experience and analyze platform performance. You will be informed and given control over cookie preferences where required.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
              <p>
                We may update this GDPR statement from time to time to reflect changes in legal requirements or our services. Any updates will be communicated clearly on our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
              <p>
                If you have any questions about this GDPR Compliance Statement or how your data is handled, please contact us through our official communication channels.
              </p>
            </section>
            
            <p className="pt-8 border-t border-gray-100 text-gray-500 italic mt-8 text-center md:text-left">
              We are dedicated to maintaining the trust of our users by ensuring that privacy, security, and transparency remain at the heart of everything we do.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

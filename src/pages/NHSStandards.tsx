import React from 'react';

export default function NHSStandards() {
  return (
    <div className="bg-gray-50 min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 prose prose-teal max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">NHS Standards Compliance Statement</h1>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            As a UK-based SaaS company focused on supporting senior citizens through accessible technology, we are committed to aligning our platform with relevant NHS standards and best practices. While we are an independent technology provider, we design our services with the same principles of safety, accessibility, data protection, and user-centered care that underpin NHS digital and healthcare guidelines.
          </p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Commitment to Patient-Centered Design</h2>
              <p>
                We prioritize the needs, abilities, and comfort of senior users. Our platform is built with simplicity, clarity, and accessibility in mind—ensuring that individuals with varying levels of digital literacy can use our services confidently. This aligns with NHS principles of inclusive and patient-centered care.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Accessibility and Usability</h2>
              <p className="mb-4">Our solutions are designed to follow accessibility best practices inspired by NHS Digital Service Standards and WCAG (Web Content Accessibility Guidelines). This includes:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Clear and readable fonts</li>
                <li>High-contrast interfaces</li>
                <li>Simple navigation structures</li>
                <li>Minimal cognitive load</li>
              </ul>
              <p>We aim to ensure that our platform remains usable for individuals with visual, cognitive, or physical limitations.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Protection and Confidentiality</h2>
              <p className="mb-4">We handle personal data in accordance with UK GDPR and align with NHS expectations around patient confidentiality and secure data handling. We implement:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Secure data storage and encryption</li>
                <li>Controlled access to sensitive information</li>
                <li>Transparent data usage policies</li>
              </ul>
              <p>Where applicable, we work towards compatibility with NHS Data Security and Protection Toolkit (DSPT) principles.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Clinical Safety and Risk Management</h2>
              <p className="mb-4">Although our platform is not a medical device, we take a safety-first approach by:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Identifying and mitigating potential risks in system design</li>
                <li>Ensuring features like SOS alerts function reliably</li>
                <li>Regularly reviewing system performance and user feedback</li>
              </ul>
              <p>We aim to align with NHS clinical risk management standards (such as DCB0129 and DCB0160) where relevant.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Interoperability and Integration Readiness</h2>
              <p>
                We design our systems with future integration in mind, ensuring that our platform can potentially work alongside healthcare services and digital ecosystems where appropriate. This includes using standardized data structures and secure APIs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Transparency and Accountability</h2>
              <p>
                We maintain clear documentation of our processes, data handling practices, and system functionality. Users and partners can understand how our services work and how their data is managed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Continuous Improvement</h2>
              <p className="mb-4">We are committed to continuously improving our platform by:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Monitoring user feedback</li>
                <li>Keeping up with NHS digital guidelines and updates</li>
                <li>Enhancing security, usability, and performance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer</h2>
              <p>
                While we strive to align with NHS standards and best practices, our platform is an independent service and is not officially affiliated with or endorsed by the NHS unless explicitly stated.
              </p>
            </section>
            
            <p className="pt-8 border-t border-gray-100 text-gray-500 italic mt-8 text-center md:text-left">
              By aligning with NHS principles, we aim to build trust, ensure safety, and deliver technology that genuinely improves the quality of life for senior citizens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { usePageMeta } from '../hooks/usePageMeta';

export default function NHSStandards() {
  usePageMeta(
    "Our Standards & Commitment | SeniorEase",
    "Read our commitment to accessibility, privacy, safeguarding, and good practice for senior citizens across the United Kingdom."
  );

  return (
    <div className="bg-white py-24">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Standards</h1>
        
        <div className="prose prose-teal max-w-none text-gray-600 space-y-8">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-2">
            <p className="font-bold text-gray-900 text-lg mb-2">Commitment to Accessibility, Privacy and Good Practice</p>
            <p className="font-semibold text-gray-900">Effective Date: 01 June 2026</p>
            <p className="font-semibold text-gray-900">Website: <a href="https://www.senioreease.com" className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.senioreease.com</a></p>
            <p className="font-semibold text-gray-900">Business Name: SeniorEase</p>
            <p className="font-semibold text-gray-900">Email: <a href="mailto:support@senioreease.com" className="text-teal-600 hover:underline">support@senioreease.com</a></p>
            <p className="font-semibold text-gray-900">Telephone: <a href="tel:+443304010019" className="text-teal-600 hover:underline">+44 (0) 330 401 0019</a></p>
          </div>

          <div className="bg-amber-50/80 p-6 rounded-2xl border border-amber-200/80 text-amber-950 leading-relaxed">
            <p className="m-0">
              <strong className="font-bold text-amber-900">Important:</strong> SeniorEase is an independent, privately operated digital technology support service. We are not part of, endorsed by, or affiliated with the NHS, any NHS trust, or any other public healthcare body. Any reference to health, wellbeing, or safeguarding on this page reflects our own internal standards and good practice, not a formal certification or partnership.
            </p>
          </div>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Our Commitment</h2>
            <p className="mb-4">
              At SeniorEase, we are committed to providing a safe, accessible, and user-friendly digital education and technical support service for senior citizens across the United Kingdom.
            </p>
            <p>
              Our services are designed around the principles of accessibility, privacy, transparency, and continuous improvement. We aim to help older adults use everyday technology with greater confidence through clear guidance provided by our trained support team.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Accessibility Standards</h2>
            <p className="mb-3">We design our website, communications, and training materials with accessibility in mind, including:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Clear, plain-English guidance suitable for beginners and those with limited digital experience</li>
              <li>Large, legible text and high-contrast design where possible</li>
              <li>Patient, jargon-free verbal explanations during support sessions</li>
              <li>Flexibility to accommodate hearing, vision, or mobility considerations on request</li>
            </ul>
            <p className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              We welcome feedback on how we can make our Services more accessible — contact <a href="mailto:support@senioreease.com" className="text-teal-600 hover:underline font-medium">support@senioreease.com</a> with any suggestions.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Safeguarding and Vulnerable Adults</h2>
            <p className="mb-3">We recognise that many of our customers may be vulnerable due to age, isolation, or unfamiliarity with technology. Because of this:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>All support staff receive training on safeguarding awareness and respectful, patient communication with older adults.</li>
              <li>We do not pressure customers into purchases, upgrades, or decisions during support sessions.</li>
              <li>Where a customer discloses signs of financial abuse, scam victimisation, or safeguarding concerns, our team follows an internal escalation process and, where appropriate, signposts the customer to relevant support organisations (such as Action Fraud, Age UK, or the customer's GP or local authority safeguarding team).</li>
              <li>SeniorEase is not a substitute for statutory health, social care, or safeguarding services.</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Privacy and Data Handling</h2>
            <p>
              Our approach to personal data is governed by our full <a href="/privacy" className="text-teal-600 hover:underline font-medium">Privacy Policy</a>, which explains what we collect, why, and your rights under UK GDPR.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Staff Training and Conduct</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All support staff complete an induction covering our accessibility, safeguarding, and privacy standards before working with customers.</li>
              <li>Staff conduct is expected to reflect patience, respect, and clarity at all times, particularly given the nature of our customer base.</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Continuous Improvement</h2>
            <p>
              We review our practices periodically, incorporating customer feedback, to ensure our Services remain safe, accessible, and appropriate for the people we support. Suggestions can be sent to <a href="mailto:support@senioreease.com" className="text-teal-600 hover:underline font-medium">support@senioreease.com</a> at any time.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
            <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-100/50 space-y-1">
              <p className="font-bold text-teal-900 mb-2">SeniorEase</p>
              <p><span className="font-semibold text-teal-800">Email:</span> <a href="mailto:support@senioreease.com" className="text-teal-700 hover:underline">support@senioreease.com</a></p>
              <p><span className="font-semibold text-teal-800">Phone:</span> <a href="tel:+443304010019" className="text-teal-700 hover:underline">+44 (0) 330 401 0019</a></p>
              <p><span className="font-semibold text-teal-800">Address:</span> SeniorEase, 167-169 Great Portland Street, 5th Floor, London, W1W 5PF</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

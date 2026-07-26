import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Terms() {
  usePageMeta(
    "Terms & Conditions | SeniorEase",
    "Read the terms and conditions governing SeniorEase digital education and technical support services for older adults in the UK."
  );

  return (
    <div className="bg-white py-24">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-teal max-w-none text-gray-600 space-y-8">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-2">
            <p className="font-semibold text-gray-900">Effective Date: 01 June 2026</p>
            <p className="font-semibold text-gray-900">Business Name: SeniorEase</p>
            <p className="font-semibold text-gray-900">Company Registration Number: [Pending — to be added upon incorporation]</p>
            <p className="font-semibold text-gray-900">Registered/Trading Address: 167-169 Great Portland Street, 5th Floor, London, W1W 5PF</p>
            <p className="font-semibold text-gray-900">
              Contact: <a href="mailto:support@senioreease.com" className="text-teal-600 hover:underline">support@senioreease.com</a> | <a href="tel:+443304010019" className="text-teal-600 hover:underline">+44 (0) 330 401 0019</a>
            </p>
          </div>

          <p className="text-lg leading-relaxed text-gray-700">
            These Terms & Conditions ("Terms") govern your access to and use of the SeniorEase website (<a href="https://www.senioreease.com" className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer">senioreease.com</a>) and the digital technology learning and support services we provide ("Services"). By registering for an account, booking a session, or purchasing a subscription, you agree to be bound by these Terms. If you do not agree, please do not use our Services.
          </p>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. About Our Services</h2>
            <p className="mb-4">
              SeniorEase is a Software as a Service (SaaS) platform providing digital technology education and support for older adults in the United Kingdom, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Smartphone, tablet, and computer tutoring</li>
              <li>Guidance on messaging, video calling, and email</li>
              <li>Scam and fraud awareness training</li>
              <li>Progress updates shared with a nominated family member or carer (where authorized by the customer)</li>
            </ul>
            <p className="font-semibold text-gray-900 bg-teal-50/50 p-4 rounded-xl border border-teal-100/50">
              SeniorEase provides educational and support guidance only. We are not a healthcare, medical, or care provider, and our Services do not constitute medical, legal, or financial advice.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility and Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be 18 years or older to create an account and enter into a subscription on behalf of yourself or a family member.</li>
              <li>You are responsible for providing accurate registration information and for maintaining the confidentiality of your account credentials.</li>
              <li>Where a subscription is purchased by a family member on behalf of a senior relative, the purchasing party confirms they have the authority and consent of the person receiving the Service to share relevant personal information and training progress.</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Subscription Plans and Payment</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Current pricing plans are published on our <Link to="/pricing" className="text-teal-600 hover:underline font-medium">Pricing page</Link> and form part of these Terms.</li>
              <li>Payments are processed securely through Stripe. SeniorEase does not store full payment card details.</li>
              <li>Subscriptions renew automatically at the end of each billing cycle (monthly or annual, as selected) unless cancelled in accordance with our <Link to="/refund" className="text-teal-600 hover:underline font-medium">Refund & Cancellation Policy</Link>.</li>
              <li>We reserve the right to change subscription pricing with at least 30 days' written notice before the change takes effect for existing subscribers.</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cancellations and Refunds</h2>
            <p>
              Cancellation and refund terms are set out in full in our separate <Link to="/refund" className="text-teal-600 hover:underline font-medium">Refund & Cancellation Policy</Link>, which forms part of these Terms.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Customer Responsibilities</h2>
            <p className="mb-2 font-medium text-gray-900">You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide a safe and reasonable environment for any in-person or remote support sessions.</li>
              <li>Use the Services for lawful, personal, non-commercial purposes only.</li>
              <li>Not share account access with individuals outside your household without our consent.</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Family Notifications</h2>
            <p>
              Where enabled, SeniorEase may share training logs and learning progress with a nominated family member or carer, solely for the purpose of providing reassurance and support. This feature requires the explicit consent of the senior customer and can be switched off at any time by contacting <a href="mailto:support@senioreease.com" className="text-teal-600 hover:underline font-medium">support@senioreease.com</a>.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>SeniorEase provides technology education and guidance on a reasonable-skill-and-care basis but does not guarantee specific outcomes (e.g. complete elimination of scam risk).</li>
              <li>To the fullest extent permitted by law, SeniorEase's total liability for any claim arising from the Services is limited to the amount paid by the customer in the 12 months preceding the claim.</li>
              <li>Nothing in these Terms excludes or limits liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded under UK law.</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Protection</h2>
            <p>
              Your personal data is handled in accordance with our <Link to="/privacy" className="text-teal-600 hover:underline font-medium">Privacy Policy</Link> and applicable UK GDPR / Data Protection Act 2018 requirements.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
            <p>
              We may suspend or terminate an account where these Terms are breached, where payment fails and is not resolved within a reasonable period, or where continued provision of the Service is not reasonably possible.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Material changes will be notified by email or via the website at least 14 days before they take effect.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
            <p>
              These Terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Intellectual Property</h2>
            <p>
              All website content, logos, branding, software, graphics, text, and training materials are owned by or licensed to SeniorEase and are protected by applicable intellectual property laws. You may not copy, reproduce, distribute, or modify any content without our prior written permission.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
            <p className="mb-6">
              Questions about these Terms can be sent to:
            </p>
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

import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Privacy() {
  usePageMeta(
    "Privacy Policy | SeniorEase",
    "SeniorEase respects your privacy. Read our UK GDPR compliant policy on how we collect, use, store, protect, and share your personal data securely."
  );

  return (
    <div className="bg-white py-24">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-teal max-w-none text-gray-600 space-y-8">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-2">
            <p className="font-semibold text-gray-900">Effective Date: 01 June 2026</p>
            <p className="font-semibold text-gray-900">Website: <a href="https://www.senioreease.com" className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.senioreease.com</a></p>
            <p className="font-semibold text-gray-900">Company Name: SeniorEase</p>
            <p className="font-semibold text-gray-900">Email: <a href="mailto:privacy@senioreease.com" className="text-teal-600 hover:underline">privacy@senioreease.com</a></p>
            <p className="font-semibold text-gray-900">Telephone: <a href="tel:+443304010019" className="text-teal-600 hover:underline">+44 (0) 330 401 0019</a></p>
          </div>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="mb-4">
              SeniorEase respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, protect, and share your personal data when you:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>visit our website;</li>
              <li>create an account;</li>
              <li>purchase a subscription;</li>
              <li>receive digital training or support from us; or</li>
              <li>contact our support team.</li>
            </ul>
            <p className="font-semibold text-gray-900 bg-teal-50/50 p-4 rounded-xl border border-teal-100/50">
              This policy applies to all users of senioreease.com and our associated Services, and is written to comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            <p className="mb-4">We only collect the minimum information necessary to provide secure, reliable support. This includes:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong className="text-gray-900">Identity data:</strong> name, date of birth (where relevant for account verification)</li>
              <li><strong className="text-gray-900">Contact data:</strong> phone number, email address, postal address</li>
              <li><strong className="text-gray-900">Billing data:</strong> processed securely via Stripe; SeniorEase does not store full card numbers</li>
              <li><strong className="text-gray-900">Support and training data:</strong> session notes, learning progress, and topics covered during tutoring sessions</li>
              <li><strong className="text-gray-900">Family/carer data:</strong> where a family member sets up or manages an account on behalf of a senior relative, we collect that family member's contact details for billing and notification purposes</li>
              <li><strong className="text-gray-900">Technical data:</strong> IP address, browser type, and device information collected automatically via our website</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use your personal data to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and manage your subscription and support sessions</li>
              <li>Process payments securely through Stripe</li>
              <li>Send appointment reminders, service updates, and (where consented) family progress notifications</li>
              <li>Respond to support requests and enquiries</li>
              <li>Improve our Services and website</li>
              <li>Comply with legal and regulatory obligations</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Legal Basis for Processing</h2>
            <p className="mb-4">Under UK GDPR, we rely on the following legal bases:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong className="text-gray-900">Contract:</strong> processing necessary to deliver the Services you've subscribed to</li>
              <li><strong className="text-gray-900">Consent:</strong> where you (or the account holder) opt in to family progress notifications or marketing communications</li>
              <li><strong className="text-gray-900">Legitimate interests:</strong> to improve our Services, prevent fraud, and maintain the security of our systems</li>
              <li><strong className="text-gray-900">Legal obligation:</strong> where we must retain records for tax, accounting, or regulatory purposes</li>
            </ul>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
              You may withdraw consent at any time by contacting <a href="mailto:privacy@senioreease.com" className="text-teal-600 hover:underline font-medium">privacy@senioreease.com</a>; this will not affect the lawfulness of processing carried out before withdrawal.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Family and Carer Notifications</h2>
            <p className="mb-4">Where enabled, we share training progress and session summaries with a nominated family member or carer. This is only done:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>with the explicit, informed consent of the senior customer at the time of sign-up; and</li>
              <li>limited to training/session summaries — not full session content or sensitive personal disclosures.</li>
            </ul>
            <p>
              This feature can be switched off at any time by contacting <a href="mailto:privacy@senioreease.com" className="text-teal-600 hover:underline font-medium">privacy@senioreease.com</a>.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Sharing Your Information</h2>
            <p className="mb-4">We do not sell your personal data. We share information only with:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong className="text-gray-900">Stripe (payment processing)</strong> — see Stripe's own privacy policy at <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">stripe.com/privacy</a></li>
              <li><strong className="text-gray-900">Service delivery partners</strong> (e.g. scheduling, email/SMS notification providers) strictly as needed to deliver the Service</li>
              <li><strong className="text-gray-900">Regulators or law enforcement</strong>, where required by law</li>
            </ul>
            <p>
              All third-party processors are required to handle your data securely and only for the purposes we specify.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. International Data Transfers</h2>
            <p>
              Some of our service providers (including Stripe) may process data outside the UK. Where this occurs, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses or an equivalent adequacy mechanism recognised under UK GDPR.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
            <p className="mb-4">We retain personal data only for as long as necessary to provide the Services and meet legal obligations:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-gray-900">Active account data:</strong> retained for the duration of your subscription</li>
              <li><strong className="text-gray-900">Billing records:</strong> retained for 6 years to meet UK tax and accounting requirements</li>
              <li><strong className="text-gray-900">Closed account data:</strong> deleted or anonymised within 12 months of account closure, unless a longer retention period is required by law</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Your Rights</h2>
            <p className="mb-4">Under UK GDPR, you have the right to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request erasure of your data ("right to be forgotten"), subject to legal retention requirements</li>
              <li>Object to or restrict certain processing</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
              <li>Lodge a complaint with the Information Commissioner's Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">ico.org.uk</a> if you believe your data has been mishandled</li>
            </ul>
            <p>
              To exercise any of these rights, contact <a href="mailto:privacy@senioreease.com" className="text-teal-600 hover:underline font-medium">privacy@senioreease.com</a>. We aim to respond within one month, as required by law.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Cookies</h2>
            <p>
              Our website uses cookies to support core functionality and, where applicable, analytics. You can control or disable cookies through your browser settings. For details on the specific cookies we use, see our Cookie Policy (or the cookie banner presented on first visit).
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Children's Privacy</h2>
            <p>
              Our Services are intended for adult users. We do not knowingly collect personal data from individuals under 18. Where a family member manages an account on behalf of a senior relative, only the necessary contact and billing details of the managing adult are collected.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Data Security</h2>
            <p>
              We use appropriate technical and organisational measures — including encrypted payment processing via Stripe and access controls on internal systems — to protect your personal data against unauthorised access, loss, or misuse.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be notified by email or via a notice on our website at least 14 days before they take effect. The "Effective Date" at the top of this page will always reflect the latest version.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Us</h2>
            <p className="mb-6">
              If you have any questions about this Privacy Policy or how we handle your data:
            </p>
            <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-100/50 space-y-1">
              <p className="font-bold text-teal-900 mb-2">SeniorEase</p>
              <p><span className="font-semibold text-teal-800">Email:</span> <a href="mailto:privacy@senioreease.com" className="text-teal-700 hover:underline">privacy@senioreease.com</a></p>
              <p><span className="font-semibold text-teal-800">Phone:</span> <a href="tel:+443304010019" className="text-teal-700 hover:underline">+44 (0) 330 401 0019</a></p>
              <p><span className="font-semibold text-teal-800">Address:</span> SeniorEase, 160 City Road, Kemp House, London, EC1V 2NX</p>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              You may also contact the ICO directly at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">ico.org.uk</a> if you are not satisfied with our response.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

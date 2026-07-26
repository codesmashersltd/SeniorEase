import { usePageMeta } from '../hooks/usePageMeta';

export default function Refund() {
  usePageMeta(
    "Refund & Cancellation Policy | SeniorEase",
    "Learn about our clear refund and subscription cancellation policies. Cancel anytime with ease, 14-day cooling-off period, and transparent terms."
  );

  return (
    <div className="bg-white py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Refund & Cancellation Policy</h1>
        
        <div className="prose prose-teal max-w-none text-gray-600 space-y-8">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-1">
            <p className="font-semibold text-gray-900">Effective Date: 01 June 2026</p>
            <p className="font-semibold text-gray-900">Website: <a href="https://www.senioreease.com" className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.senioreease.com</a></p>
            <p className="font-semibold text-gray-900">Business Name: SeniorEase</p>
            <p className="font-semibold text-gray-900">Email: <a href="mailto:support@senioreease.com" className="text-teal-600 hover:underline">support@senioreease.com</a></p>
            <p className="font-semibold text-gray-900">Telephone: <a href="tel:+443304010019" className="text-teal-600 hover:underline">+44 (0) 330 401 0019</a></p>
          </div>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Free Introductory Call</h2>
            <p>
              Our free introductory call carries no charge and no obligation to continue. No refund is applicable as no payment is taken.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Cancelling a Subscription</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You may cancel your subscription at any time by emailing <a href="mailto:support@senioreease.com" className="text-teal-600 hover:underline font-medium">support@senioreease.com</a>, calling <a href="tel:+443304010019" className="text-teal-600 hover:underline font-medium">+44 (0) 330 401 0019</a>, or through your account dashboard (once available).</li>
              <li>Cancellations take effect at the end of the current paid billing period. You will continue to have access to your Services until that date, and no further payments will be taken afterward.</li>
              <li>We do not charge cancellation fees.</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cooling-Off Period (Right to Cancel)</h2>
            <p className="mb-4">
              In line with the UK Consumer Contracts Regulations 2013, if you are a consumer purchasing a subscription remotely (e.g. online or by phone), you have the right to cancel within <strong className="text-gray-900">14 days</strong> of your purchase for a full refund, provided the Service has not been fully delivered within that period with your express consent to begin immediately.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>If you request that support begins immediately within the 14-day window and later cancel, we may deduct a reasonable amount reflecting the sessions or support already provided.</li>
              <li>To exercise this right, contact us at <a href="mailto:support@senioreease.com" className="text-teal-600 hover:underline font-medium">support@senioreease.com</a> within 14 days of purchase.</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Refunds Outside the Cooling-Off Period</h2>
            <p className="mb-4">
              After the 14-day cooling-off period, subscription fees are generally non-refundable for the current billing period, except in the following cases:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong className="text-gray-900">Service unavailability:</strong> If we are unable to deliver a scheduled session and cannot offer a reasonable rescheduled alternative, the missed session will be refunded or credited.</li>
              <li><strong className="text-gray-900">Billing error:</strong> If you are charged in error (e.g. duplicate charge, incorrect amount), the error will be corrected and refunded in full within 10 business days of confirmation.</li>
              <li><strong className="text-gray-900">Exceptional circumstances:</strong> Refund requests due to bereavement, hospitalisation, or a change in the customer's care needs will be considered on a case-by-case basis and handled sensitively.</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. How Refunds Are Processed</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Approved refunds are returned to the original payment method via Stripe.</li>
              <li>Refunds are typically processed within 5–10 business days, though your bank or card issuer may take longer to reflect the refund.</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Family/Third-Party Purchasers</h2>
            <p>
              Where a subscription is purchased by a family member on behalf of a senior relative, refund and cancellation requests may be made by either the purchaser or the service recipient, provided identity can be reasonably confirmed.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Disputing a Charge</h2>
            <p>
              If you believe a charge is incorrect, please contact us first at <a href="mailto:support@senioreease.com" className="text-teal-600 hover:underline font-medium">support@senioreease.com</a> before raising a dispute with your bank or card provider — most issues can be resolved directly and more quickly this way. We aim to acknowledge all billing queries within 2 business days.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Any changes will be posted on this page with a revised effective date, and material changes affecting existing subscribers will be communicated by email at least 14 days in advance.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Internal note box */}
          <div className="bg-amber-50/80 border border-amber-200/80 p-5 rounded-2xl text-amber-900 text-sm italic">
            <p className="margin-0">
              [Internal note: confirm final cancellation cut-off timing (billing-period-end vs. immediate) and any minimum-term contract terms with the pricing team before publishing, so this matches the actual plans listed on /pricing.]
            </p>
          </div>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="mb-6">
              If you have any questions about this Refund & Cancellation Policy or wish to discuss your subscription, please contact us.
            </p>
            <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-100/50">
              <p className="font-bold text-teal-900 mb-2">SeniorEase</p>
              <p className="mb-1"><span className="font-semibold text-teal-800">Website:</span> <a href="https://www.senioreease.com" className="text-teal-700 hover:underline" target="_blank" rel="noopener noreferrer">https://www.senioreease.com</a></p>
              <p className="mb-1"><span className="font-semibold text-teal-800">Email:</span> <a href="mailto:support@senioreease.com" className="text-teal-700 hover:underline">support@senioreease.com</a></p>
              <p className="mb-3"><span className="font-semibold text-teal-800">Telephone:</span> <a href="tel:+443304010019" className="text-teal-700 hover:underline">+44 (0) 330 401 0019</a></p>
              <p className="font-semibold text-teal-900 mt-2">Business Hours:</p>
              <p className="text-teal-800">Monday to Friday</p>
              <p className="text-teal-800">9:00 AM to 5:00 PM (UK Time)</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

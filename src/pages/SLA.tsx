import { usePageMeta } from '../hooks/usePageMeta';

export default function SLA() {
  usePageMeta(
    "Service Level Agreement (SLA) | SeniorEase",
    "Read our Service Level Agreement outlining support response times, service availability commitments, and our dedicated customer support guidelines."
  );

  return (
    <div className="bg-white py-24">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Service Level Agreement (SLA)</h1>
        
        <div className="prose prose-teal max-w-none text-gray-600 space-y-8">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-2">
            <p className="font-semibold text-gray-900">Effective Date: 01 June 2026</p>
            <p className="font-semibold text-gray-900">Website: <a href="https://www.seniorease.com" className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.seniorease.com</a></p>
            <p className="font-semibold text-gray-900">Company Name: SeniorEase</p>
            <p className="font-semibold text-gray-900">Email: <a href="mailto:support@seniorease.com" className="text-teal-600 hover:underline">support@seniorease.com</a></p>
            <p className="font-semibold text-gray-900">Telephone: <a href="tel:+443304010019" className="text-teal-600 hover:underline">+44 (0) 330 401 0019</a></p>
          </div>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="mb-4">
              This Service Level Agreement ("SLA") explains the level of service customers can reasonably expect from SeniorEase.
            </p>
            <p className="mb-2 font-semibold text-gray-900">It outlines:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>the services we provide;</li>
              <li>the scope of our support;</li>
              <li>our standard support hours;</li>
              <li>how quickly we respond to enquiries and issues;</li>
              <li>what happens if we don't meet these standards; and</li>
              <li>what falls outside the scope of this SLA.</li>
            </ul>
            <p className="font-semibold text-gray-900 bg-teal-50/50 p-4 rounded-xl border border-teal-100/50">
              This SLA forms part of, and should be read alongside, our Terms &amp; Conditions.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Services Covered</h2>
            <p className="mb-3">This SLA applies to all SeniorEase subscription plans and covers:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-gray-900">Scheduled one-to-one tutoring sessions</strong> (smartphone, tablet, and computer support)</li>
              <li><strong className="text-gray-900">Scam and fraud awareness training</strong></li>
              <li><strong className="text-gray-900">General customer support</strong> via phone and email</li>
              <li><strong className="text-gray-900">Family progress notifications</strong> (where enabled)</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Support Hours</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-gray-900">Standard support hours:</strong> Monday to Friday, 9:00 AM – 5:00 PM GMT/BST</li>
              <li>Support requests received outside these hours will be addressed on the next business day.</li>
              <li>Scheduled tutoring sessions may be booked within standard support hours, subject to availability.</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Response Times</h2>
            <div className="overflow-x-auto my-4">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left font-semibold text-gray-900">Request Type</th>
                    <th scope="col" className="px-6 py-3 text-left font-semibold text-gray-900">Target Response Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-gray-700">
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">General enquiry (email/phone)</td>
                    <td className="px-6 py-4">Within 1 business day</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Support request</td>
                    <td className="px-6 py-4">Within 1 business day</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Urgent/safety-related concern (e.g. suspected scam in progress)</td>
                    <td className="px-6 py-4">Within 4 business hours</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Booking or rescheduling request</td>
                    <td className="px-6 py-4">Within 1 business day</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 italic mt-2">
              These are target response times, not guaranteed resolution times — some issues may take longer to fully resolve depending on complexity.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Session Scheduling and Rescheduling</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sessions should be rescheduled or cancelled with at least 24 hours' notice where possible.</li>
              <li>If SeniorEase needs to reschedule a confirmed session, we will notify the customer as early as possible and offer the next available alternative slot at no extra cost.</li>
              <li>Repeated late cancellations (less than 2 hours' notice) by the customer may be treated as a completed session, in line with our Refund &amp; Cancellation Policy.</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Platform Availability</h2>
            <p>
              Where SeniorEase provides access to an online account portal or app, we aim for at least 99% monthly uptime, excluding scheduled maintenance windows (which will be communicated in advance where possible).
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. What This SLA Does Not Cover</h2>
            <p className="mb-3">This SLA does not guarantee or cover:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Faults or limitations of the customer's own device, software, or internet connection</li>
              <li>Issues arising from third-party apps or services outside SeniorEase's control (e.g. WhatsApp, Zoom, the customer's email provider)</li>
              <li>Complete prevention of scams or fraud — we provide training and guidance, not a guarantee of outcome</li>
              <li>Delays caused by circumstances outside our reasonable control (e.g. network outages, extreme weather)</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Escalation Process</h2>
            <p className="mb-3">If a customer is not satisfied with the resolution of a support request:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Contact <a href="mailto:support@seniorease.com" className="text-teal-600 hover:underline font-medium">support@seniorease.com</a> referencing the original request.</li>
              <li>If unresolved within 5 business days, the matter will be escalated to a senior member of the support team for review.</li>
              <li>If still unresolved, the customer may raise the matter formally in writing, and SeniorEase will respond with a final position within 10 business days.</li>
            </ol>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Remedies for Missed Commitments</h2>
            <p className="mb-3">Where SeniorEase fails to meet the response times or scheduling commitments set out in this SLA:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The customer may request a complimentary make-up session, or</li>
              <li>A pro-rated credit against their next billing cycle, at SeniorEase's discretion, reflecting the missed service.</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Reviews and Changes to This SLA</h2>
            <p>
              This SLA is reviewed periodically and may be updated to reflect changes in our Services. Material changes will be communicated to active subscribers by email at least 14 days before they take effect.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="mb-6">
              If you have any questions about this Service Level Agreement or our support services:
            </p>
            <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-100/50 space-y-1">
              <p className="font-bold text-teal-900 mb-2">SeniorEase</p>
              <p><span className="font-semibold text-teal-800">Email:</span> <a href="mailto:support@seniorease.com" className="text-teal-700 hover:underline">support@seniorease.com</a></p>
              <p><span className="font-semibold text-teal-800">Phone:</span> <a href="tel:+443304010019" className="text-teal-700 hover:underline">+44 (0) 330 401 0019</a></p>
              <p><span className="font-semibold text-teal-800">Address:</span> SeniorEase, 160 City Road, Kemp House, London, EC1V 2NX</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

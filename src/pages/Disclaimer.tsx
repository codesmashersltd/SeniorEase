import { Link } from 'react-router-dom';
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
        >
          <div className="bg-teal-900 p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-800 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <ShieldAlert className="w-16 h-16 text-teal-300 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-white mb-4">Disclaimer</h1>
              <p className="text-teal-100 text-lg max-w-2xl mx-auto">
                Senior Ease provides friendly digital assistance and everyday support for senior citizens in the UK. We do not provide medical, emergency, legal, financial, or regulated care services.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12 prose prose-teal max-w-none">
            <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-200">
              <p className="mb-2"><strong>Business Name:</strong> Senior Ease</p>
              <p className="mb-2"><strong>Effective Date:</strong> April 2026</p>
              <p className="mb-2"><strong>Website:</strong> www.seniorease.co.uk</p>
              <p className="mb-2"><strong>Contact Email:</strong> hello@seniorease.co.uk</p>
              <p className="mb-0"><strong>Contact Phone:</strong> 0800 123 4567</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. General Information</h2>
            <p>Senior Ease provides friendly digital assistance and everyday support services for senior citizens in the United Kingdom.</p>
            <p>All information, guidance, and support provided through our website and services is intended for general assistance purposes only.</p>
            <p>While we aim to provide helpful and clear support, we do not guarantee that all information or guidance will be suitable for every situation.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. No Professional Advice</h2>
            <p>Senior Ease does not provide professional advice of any kind.</p>
            <p>This includes, but is not limited to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>medical advice</li>
              <li>healthcare services</li>
              <li>legal advice</li>
              <li>financial or investment advice</li>
              <li>tax or pension advice</li>
              <li>regulated fraud recovery services</li>
            </ul>
            <p>Any guidance we provide is informational and practical only, based on general everyday digital use.</p>
            <p>You should always seek advice from a qualified professional where appropriate.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Not a Medical or Care Service</h2>
            <p>Senior Ease is not:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>a medical provider</li>
              <li>a healthcare service</li>
              <li>a nursing or home care provider</li>
              <li>a regulated care service</li>
              <li>a safeguarding service</li>
            </ul>
            <p>We do not provide:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>medical diagnosis</li>
              <li>treatment</li>
              <li>health monitoring</li>
              <li>personal care services</li>
              <li>supervision or in-person care</li>
            </ul>
            <p>If medical or care support is required, you should contact an appropriate healthcare provider or care professional.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Not an Emergency Service</h2>
            <p>Senior Ease is not an emergency service.</p>
            <p>We do not provide:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>urgent response services</li>
              <li>emergency call handling</li>
              <li>real-time crisis support</li>
            </ul>
            <p>If you require urgent assistance, you should contact the appropriate emergency services.</p>
            <p className="font-bold text-red-600">UK Emergency Number: 999</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Digital Support Only</h2>
            <p>Our services are limited to general digital assistance and everyday technology support, including:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>smartphones</li>
              <li>messaging apps</li>
              <li>email</li>
              <li>video calls</li>
              <li>online forms</li>
              <li>basic online tasks</li>
              <li>general digital confidence support</li>
            </ul>
            <p>We do not guarantee that:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>all issues can be resolved</li>
              <li>all devices or systems will function correctly</li>
              <li>access to accounts can always be restored</li>
              <li>third-party services will operate without interruption</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Third-Party Services Disclaimer</h2>
            <p>Many support requests involve third-party services, such as:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>mobile networks</li>
              <li>internet providers</li>
              <li>messaging platforms</li>
              <li>email services</li>
              <li>websites and online portals</li>
              <li>government services</li>
            </ul>
            <p>Senior Ease does not control these third-party services and is not responsible for:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>outages or downtime</li>
              <li>account restrictions or suspensions</li>
              <li>changes in functionality</li>
              <li>security issues</li>
              <li>data loss</li>
              <li>service interruptions</li>
            </ul>
            <p>Any reliance on third-party services is at your own discretion.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Scam Awareness Guidance</h2>
            <p>Senior Ease may provide general scam awareness guidance to help customers recognise potentially suspicious messages or situations.</p>
            <p>However:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>we do not guarantee scam prevention</li>
              <li>we do not provide fraud investigation services</li>
              <li>we do not provide financial recovery services</li>
              <li>we do not replace banks, law enforcement, or official authorities</li>
            </ul>
            <p>If you believe fraud or a scam has occurred, you should contact:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>your bank or payment provider</li>
              <li>relevant authorities</li>
              <li>law enforcement</li>
            </ul>
            <p>immediately.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Customer Responsibility</h2>
            <p>Customers are responsible for:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>decisions made based on guidance provided</li>
              <li>actions taken on their devices or accounts</li>
              <li>maintaining the security of passwords and personal information</li>
              <li>verifying important information independently where necessary</li>
            </ul>
            <p>Senior Ease does not take responsibility for outcomes resulting from:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>customer decisions</li>
              <li>incomplete or incorrect information provided by the customer</li>
              <li>actions taken outside our guidance</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. No Guarantee of Results</h2>
            <p>While we aim to provide helpful and practical support, Senior Ease does not guarantee:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>that all issues will be resolved</li>
              <li>that support will be uninterrupted</li>
              <li>that solutions will always work in every situation</li>
              <li>that third-party systems will function correctly</li>
            </ul>
            <p>All services are provided on a reasonable effort basis.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Website Content Disclaimer</h2>
            <p>The content on our website is provided for general information purposes only.</p>
            <p>While we aim to keep information accurate and up to date, we do not guarantee:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>completeness</li>
              <li>accuracy</li>
              <li>reliability</li>
              <li>suitability for all users</li>
            </ul>
            <p>You use the website and its content at your own discretion.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, Senior Ease shall not be liable for:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>indirect or consequential losses</li>
              <li>loss arising from third-party services</li>
              <li>loss caused by scams or fraud by third parties</li>
              <li>loss of data or access to accounts</li>
              <li>missed appointments or deadlines</li>
              <li>outcomes based on user decisions</li>
            </ul>
            <p>Nothing in this disclaimer excludes liability where it cannot legally be excluded under UK law.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Family and Third-Party Use</h2>
            <p>Where services are used by or on behalf of a senior citizen:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>family members or authorised persons remain responsible for their involvement</li>
              <li>Senior Ease does not assume responsibility for supervision or safeguarding</li>
            </ul>
            <p>Our service is intended as support only, not supervision or care.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Changes to This Disclaimer</h2>
            <p>We may update this Disclaimer from time to time.</p>
            <p>The latest version will always be available on our website and will apply from the updated Effective Date.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">14. Contact Us</h2>
            <p>If you have any questions about this Disclaimer, please contact:</p>
            <p className="mt-4">
              <strong>Senior Ease</strong><br />
              Email: hello@seniorease.co.uk<br />
              Phone: 0800 123 4567<br />
              Website: www.seniorease.co.uk
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

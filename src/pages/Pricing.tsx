import { Link } from 'react-router-dom';
import { CheckCircle2, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import JoinModal from '../components/JoinModal';
const pricingHeroImage = '/images/seniors_pricing_hero_1784446914914.jpg';

export default function Pricing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null);

  // SEO & AI Bot Accessibility: dynamically update page title and meta description
  useEffect(() => {
    const originalTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription ? metaDescription.getAttribute('content') : '';

    document.title = "Simple Pricing Plans | Senior Ease - Digital Support & Education";
    
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Explore simple and clear monthly pricing plans for Senior Ease digital education and technical support. Choose from Essential Care (£9.99/mo), Plus Care (£17.99/mo), or Family Care (£29.99/mo) support tiers.');
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content = 'Explore simple and clear monthly pricing plans for Senior Ease digital education and technical support. Choose from Essential Care (£9.99/mo), Plus Care (£17.99/mo), or Family Care (£29.99/mo) support tiers.';
      document.head.appendChild(newMeta);
    }

    return () => {
      document.title = originalTitle;
      if (metaDescription && originalDescription) {
        metaDescription.setAttribute('content', originalDescription);
      }
    };
  }, []);

  // Structured Data (JSON-LD) for Search Engines and AI bots to parse pricing accurately
  const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "ProductCollection",
    "name": "Senior Ease Subscription Plans",
    "description": "Digital education and technology support subscriptions designed to help senior citizens become confident using everyday technology.",
    "provider": {
      "@type": "Organization",
      "name": "Senior Ease",
      "url": "https://www.seniorease.com",
      "email": "support@seniorease.com",
      "telephone": "+443304010019"
    },
    "itemListElement": [
      {
        "@type": "Product",
        "name": "Essential Care",
        "description": "Basic software platform access for occasional learning. Up to 2 support requests per month. Support via phone, WhatsApp, or email.",
        "offers": {
          "@type": "Offer",
          "price": "9.99",
          "priceCurrency": "GBP",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "9.99",
            "priceCurrency": "GBP",
            "unitText": "Month",
            "referenceQuantity": {
              "@type": "QuantitativeValue",
              "value": "1",
              "unitCode": "MON"
            }
          },
          "url": "https://www.seniorease.com/pricing"
        }
      },
      {
        "@type": "Product",
        "name": "Plus Care",
        "description": "Full portal access for seniors who need more regular support. Up to 5 support requests per month and 1 scheduled support call.",
        "offers": {
          "@type": "Offer",
          "price": "17.99",
          "priceCurrency": "GBP",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "17.99",
            "priceCurrency": "GBP",
            "unitText": "Month",
            "referenceQuantity": {
              "@type": "QuantitativeValue",
              "value": "1",
              "unitCode": "MON"
            }
          },
          "url": "https://www.seniorease.com/pricing"
        }
      },
      {
        "@type": "Product",
        "name": "Family Care",
        "description": "Multi-user software access designed for families to support a loved one with priority handling, monthly check-ins, and video call setup assistance.",
        "offers": {
          "@type": "Offer",
          "price": "29.99",
          "priceCurrency": "GBP",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "29.99",
            "priceCurrency": "GBP",
            "unitText": "Month",
            "referenceQuantity": {
              "@type": "QuantitativeValue",
              "value": "1",
              "unitCode": "MON"
            }
          },
          "url": "https://www.seniorease.com/pricing"
        }
      }
    ]
  };

  const handleGetStarted = (name: string, price: string) => {
    setSelectedPlan({ name, price });
    setIsModalOpen(true);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    }
  };

  return (
    <div className="flex flex-col overflow-hidden" id="pricing-page-wrapper">
      {/* Structured data injection for SEO & AI Crawlers */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      {/* Hero Section */}
      <section className="relative text-white py-16 md:py-40 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 hidden md:block">
          <img 
            src={pricingHeroImage} 
            alt="Happy seniors enjoying their afternoon with ease of mind" 
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-slate-950/65 backdrop-blur-[0.5px]"></div>
        </div>

        {/* Mobile background (soft dark gradient) */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 md:hidden"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold text-sm mb-6 border border-teal-500/30 backdrop-blur-md">
            Transparent Subscriptions
          </span>
          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
            Simple Plans
          </h1>
          <p className="text-base md:text-xl text-teal-100 leading-relaxed max-w-3xl mx-auto font-medium mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
            Choose the level of support that suits you or your loved one best. Our plans are designed to provide calm, practical digital learning on a monthly basis.
          </p>

          {/* Mobile Hero Image */}
          <div className="block md:hidden mb-8 relative">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-teal-500/20">
              <img 
                src={pricingHeroImage} 
                alt="Happy seniors enjoying their afternoon with ease of mind" 
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10"></div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-white font-bold text-sm md:text-xl bg-slate-950/85 inline-flex px-8 py-4 md:py-5 rounded-2xl md:rounded-full border border-teal-500/30 backdrop-blur-md shadow-2xl">
            <span className="flex items-center gap-2.5">
              <CheckCircle2 size={20} className="text-teal-300" /> Cancel Anytime
            </span>
            <span className="hidden md:inline text-teal-500/80 text-2xl">•</span>
            <span className="flex items-center gap-2.5">
              <CheckCircle2 size={20} className="text-teal-300" /> No Hidden Fees
            </span>
            <span className="hidden md:inline text-teal-500/80 text-2xl">•</span>
            <span className="flex items-center gap-2.5">
              <CheckCircle2 size={20} className="text-teal-300" /> No Setup Costs
            </span>
          </div>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            
            {/* Essential Plan */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-200 p-8 flex flex-col relative"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-wide">Essential Care</h2>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-gray-900">£9.99</span>
                  <span className="text-gray-500 font-medium">/ month</span>
                </div>
                <p className="text-gray-600 font-medium">Basic software platform access for occasional learning</p>
              </div>
              
              <div className="mb-8 flex-grow">
                <p className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Includes:</p>
                <ul className="space-y-4">
                  {[
                    'Up to 2 support requests per month',
                    'Support via phone, WhatsApp, or email ',
                    'Education on common digital issues ',
                    'Access during standard support hours ',
                    'General scam awareness guidance'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-teal-600 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl mb-8 text-sm text-gray-700 space-y-2.5 border border-gray-100">
                <p><span className="font-bold text-gray-900">Best for:</span> Seniors who only need light support from time to time.</p>
                <div className="border-t border-gray-200/60 pt-2.5 mt-2 space-y-1.5 text-xs">
                  <p className="flex justify-between gap-2"><span className="text-gray-500 font-medium">Response Time:</span> <span className="font-semibold text-gray-900">Within 24-48 hours</span></p>
                  <p className="flex justify-between gap-2"><span className="text-gray-500 font-medium">Support Hours:</span> <span className="font-semibold text-gray-900">Mon-Fri, 9am - 5:30pm GMT</span></p>
                  <p className="flex justify-between gap-2 flex-col sm:flex-row sm:justify-between"><span className="text-gray-500 font-medium">Delivery:</span> <span className="font-semibold text-gray-900 text-right">Same-day software setup</span></p>
                </div>
              </div>
              
              <button 
                onClick={() => handleGetStarted('Essential', '£9.99')}
                className="w-full block text-center bg-white border-2 border-teal-600 text-teal-600 px-6 py-3 rounded-full font-bold hover:bg-teal-50 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                Choose Essential
              </button>
            </motion.div>

            {/* Plus Plan */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-teal-900 rounded-3xl shadow-2xl border border-teal-800 p-8 flex flex-col relative transform md:-translate-y-4 z-10"
            >
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-teal-400 to-teal-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg flex items-center gap-1"
              >
                ⭐ Most Popular
              </motion.div>
              
              <div className="mb-8 mt-2">
                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">Plus Care</h2>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-white">£17.99</span>
                  <span className="text-teal-200 font-medium">/ month</span>
                </div>
                <p className="text-teal-100 font-medium">Full portal access for seniors who need more regular support</p>
              </div>
              
              <div className="mb-8 flex-grow">
                <p className="text-sm font-bold text-teal-200 uppercase tracking-wider mb-4">Includes:</p>
                <ul className="space-y-4">
                  {[
                    'Up to 5 support requests per month',
                    'Support via phone, WhatsApp, or email ',
                    'Email and login assistance',
                    'Ongoing educate on common digital tasks ',
                    'Scam awareness guidance',
                    '1 scheduled support call per month'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-teal-400 shrink-0 mt-0.5" />
                      <span className="text-white">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-teal-800/50 p-4 rounded-xl mb-8 text-sm text-teal-100 space-y-2.5 border border-teal-700/50">
                <p><span className="font-bold text-white">Best for:</span> Seniors who need regular monthly educate on everyday digital tasks.</p>
                <div className="border-t border-teal-700/60 pt-2.5 mt-2 space-y-1.5 text-xs">
                  <p className="flex justify-between gap-2"><span className="text-teal-200 font-medium">Response Time:</span> <span className="font-semibold text-white">Within 12-24 hours (Priority)</span></p>
                  <p className="flex justify-between gap-2"><span className="text-teal-200 font-medium">Support Hours:</span> <span className="font-semibold text-white">Mon-Sat, 9am - 6pm GMT</span></p>
                  <p className="flex justify-between gap-2 flex-col sm:flex-row sm:justify-between"><span className="text-teal-200 font-medium">Delivery:</span> <span className="font-semibold text-white text-right">Setup completed under 24 hours</span></p>
                </div>
              </div>
              
              <button 
                onClick={() => handleGetStarted('Plus', '£17.99')}
                className="w-full block text-center bg-teal-500 text-white px-6 py-3 rounded-full font-bold hover:bg-teal-400 hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer"
              >
                Choose Plus
              </button>
            </motion.div>

            {/* Family Care Plan */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-200 p-8 flex flex-col relative"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-wide">Family Care</h2>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-gray-900">£29.99</span>
                  <span className="text-gray-500 font-medium">/ month</span>
                </div>
                <p className="text-gray-600 font-medium">Multi-user software access designed for families to support a loved one</p>
              </div>
              
              <div className="mb-8 flex-grow">
                <p className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Includes:</p>
                <ul className="space-y-4">
                  {[
                    'Increased support access ',
                    'Priority handling within standard support operations ',
                    '1 monthly check-in ',
                    'Family support coordination where applicable ',
                    'Video call setup assistance',
                    'Educate on digital confidence, reminders, and communication tasks'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-teal-600 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl mb-8 text-sm text-gray-700 space-y-2.5 border border-gray-100">
                <p><span className="font-bold text-gray-900">Best for:</span> Adult children who want regular support available for a parent or loved one.</p>
                <div className="border-t border-gray-200/60 pt-2.5 mt-2 space-y-1.5 text-xs">
                  <p className="flex justify-between gap-2"><span className="text-gray-500 font-medium">Response Time:</span> <span className="font-semibold text-gray-900">Under 12 hours (Express Priority)</span></p>
                  <p className="flex justify-between gap-2"><span className="text-gray-500 font-medium">Support Hours:</span> <span className="font-semibold text-gray-900">Mon-Sun, 8am - 8pm GMT</span></p>
                  <p className="flex justify-between gap-2 flex-col sm:flex-row sm:justify-between"><span className="text-gray-500 font-medium">Delivery:</span> <span className="font-semibold text-gray-900 text-right">Fast onboarding under 12 hours</span></p>
                </div>
              </div>
              
              <button 
                onClick={() => handleGetStarted('Family Care', '£29.99')}
                className="w-full block text-center bg-white border-2 border-teal-600 text-teal-600 px-6 py-3 rounded-full font-bold hover:bg-teal-50 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                Choose Family Care
              </button>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Pricing Note & SLA Summary */}
      <section className="py-12 bg-white border-b border-gray-100">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <motion.div variants={fadeInUp} className="flex items-start gap-4 p-6 bg-teal-50 rounded-2xl border border-teal-100 hover:shadow-md transition-shadow h-full">
              <Info className="text-teal-600 shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Important Membership Information</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Support access, response times, and service scope vary by membership plan. Please review our Service Level Agreement and Terms & Conditions for full details.</li>
                  <li>• All plans are billed monthly</li>
                  <li>• Support is provided during stated support hours</li>
                  <li>• Service scope depends on the chosen plan</li>
                  <li>• Cancellation is available in accordance with our policy</li>
                </ul>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Our Support Standards</h3>
              <ul className="space-y-3 text-gray-700 text-sm mb-6 flex-grow">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-teal-600 mt-0.5 shrink-0" /> 
                  <span>Support available Monday to Friday, 9:00 AM – 5:30 PM (UK Time) Support requests received outside business hours will normally be reviewed on the next working day</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-teal-600 mt-0.5 shrink-0" /> 
                  <span>Friendly support via phone, WhatsApp, and email</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-teal-600 mt-0.5 shrink-0" /> 
                  <span>Response targets vary by membership plan</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-teal-600 mt-0.5 shrink-0" /> 
                  <span>Support is provided for general digital learning and everyday online tasks</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-teal-600 mt-0.5 shrink-0" /> 
                  <span>Senior Ease is a non-medical, non-emergency support service.</span>
                </li>
              </ul>
              <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 italic border border-gray-100 mt-auto">
                "Support is provided during stated business hours and subject to the scope of your selected plan. Response times vary by membership plan and issue type. Please review our <Link to="/sla" className="text-teal-600 hover:underline font-medium not-italic">Service Level Agreement</Link> for full details."
              </div>
            </motion.div>
          </div>
          
          <motion.div variants={fadeInUp} className="text-center text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <p>All plans are billed monthly and renew automatically until cancelled. You can cancel your subscription at any time from your account dashboard or by emailing <a href="mailto:support@seniorease.com" className="text-teal-600 hover:underline font-semibold">support@seniorease.com</a>. Cancellation takes effect at the end of the current billing period. No further recurring payments will be taken. Please see our <Link to="/refund" className="text-teal-600 hover:underline font-semibold">Refund & Cancellation Policy</Link> and <Link to="/terms" className="text-teal-600 hover:underline font-semibold">Terms & Conditions</Link> for full details. If paying by BACS Direct Debit, your membership will be activated once the payment has been successfully processed and confirmed.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-50 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Not Sure Which Plan Is Right?</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            We understand that every customer’s needs are different. If you’d like to understand how Senior Ease works before subscribing, you can request a free introductory call.
          </p>
          <button
            onClick={() => {
              setSelectedPlan(null);
              setIsModalOpen(true);
            }}
            className="inline-block bg-teal-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-700 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Book a Free Intro Call
          </button>
        </motion.div>
      </section>

      {/* Join Modal */}
      <JoinModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        plan={selectedPlan}
      />
    </div>
  );
}

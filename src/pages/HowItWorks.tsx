import { Link } from 'react-router-dom';
import { MousePointerClick, PlayCircle, PhoneCall, ShieldCheck, Clock, CheckCircle2, Users, Laptop, HeartHandshake, ShieldAlert, Sparkles, Award, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import howItWorksHeroImage from '../assets/images/seniors_how_it_works_1784468007445.jpg';
import { usePageMeta } from '../hooks/usePageMeta';

export default function HowItWorks() {
  usePageMeta(
    "How It Works | SeniorEase - Easy Support Steps",
    "Discover our easy 3-step setup to get digital support and learning with SeniorEase. No complex procedures, simple clear guidance."
  );
  const steps = [
    {
      icon: <MousePointerClick className="w-10 h-10 text-teal-600" />,
      title: "Step 1 – Choose Your SaaS Plan & Secure Setup",
      description: "Select the software subscription tier that best matches the support level you or your senior loved one needs. Whether looking for occasional tech learning, scam alerting, or comprehensive family safeguarding, our UK platform provides instant online registration.",
      timeframe: "Instant online activation (under 3 minutes)",
      whatYouNeed: "Email address & payment method (Card or BACS Direct Debit via Stripe)",
      highlights: "14-Day Statutory Money-Back Guarantee • Zero Lock-In Contracts • UK GDPR Compliant",
      bullets: [
        "Review our transparent, month-to-month pricing tiers.",
        "Select between Essential SaaS, Plus SaaS, or Family Portal.",
        "Sign up securely through our automated checkout with full consumer protection."
      ]
    },
    {
      icon: <PlayCircle className="w-10 h-10 text-teal-600" />,
      title: "Step 2 – Instant Portal Access & Welcome Kit",
      description: "Once registered, you will instantly receive your unique Portal Access ID and secure login credentials via automated email, unlocking your personal self-service dashboard.",
      timeframe: "Within 60 seconds of checkout confirmation",
      whatYouNeed: "Any device with a web browser (iPad, Smartphone, Laptop, PC)",
      highlights: "Automated Receipt • Link Authorized Caregivers • 24/7 Portal Visibility",
      bullets: [
        "Log in to 'My Account' using your secure credentials and temporary PIN.",
        "Review your automated welcome email and download official subscription receipts.",
        "Link trusted family members or caregivers for shared visibility and reassurance."
      ]
    },
    {
      icon: <Laptop className="w-10 h-10 text-teal-600" />,
      title: "Step 3 – Initial Guided Onboarding & Device Check",
      description: "Upon logging into your dashboard for the first time, complete a brief, friendly software onboarding process to help our UK care coordinators tailor our support to your exact devices.",
      timeframe: "10–15 minutes at your own relaxed pace",
      whatYouNeed: "Your primary devices (e.g., iPhone, Android, Tablet, Windows PC)",
      highlights: "No Technical Jargon • Tailored Learning Roadmap • Scam Vulnerability Audit",
      bullets: [
        "Select the devices you use daily and highlight your primary learning goals.",
        "Complete a 5-minute digital health check to identify potential security vulnerabilities.",
        "Get introduced to your assigned UK Senior Tech Coordinator."
      ]
    },
    {
      icon: <PhoneCall className="w-10 h-10 text-teal-600" />,
      title: "Step 4 – Request Support & 1-on-1 Tutoring",
      description: "Whenever you encounter a confusing error message, suspicious email, or want to learn how to use an everyday app like WhatsApp or online banking, file a ticket in seconds.",
      timeframe: "24/7 ticket submission; appointments booked at your convenience",
      whatYouNeed: "Your phone or computer with internet connection",
      highlights: "Patient UK Tutors • Repeat Explanations Without Frustration • Screen-Share Guidance",
      bullets: [
        "Easily submit requests directly from the web portal, email, or one-click WhatsApp helpline.",
        "Track the progress of your digital support ticket in real-time.",
        "Connect via phone or scheduled video calls for patient, step-by-step instruction."
      ]
    },
    {
      icon: <ShieldAlert className="w-10 h-10 text-teal-600" />,
      title: "Step 5 – Proactive Scam Prevention & Safeguarding",
      description: "Technology is not just about convenience; it is about staying safe from sophisticated online fraudsters. We act as an active digital shield for vulnerable seniors.",
      timeframe: "Continuous 24/7 proactive monitoring & weekly security bulletins",
      whatYouNeed: "No software installation needed; alerts delivered via SMS & email",
      highlights: "Vulnerable Adult Safeguarding Charter Active • SMS Phishing Blocking • Scam Alert Monitoring",
      bullets: [
        "Receive real-time alerts warning about emerging UK telephone and email scams.",
        "Forward suspicious text messages or emails to our security desk for verification.",
        "Implement caregiver connection controls to prevent unauthorized financial transactions."
      ]
    },
    {
      icon: <Award className="w-10 h-10 text-teal-600" />,
      title: "Step 6 – Long-Term Digital Mastery & Family Peace of Mind",
      description: "Over time, our SaaS platform transforms seniors from feeling overwhelmed into confident, independent digital citizens, while giving remote family members total reassurance.",
      timeframe: "Ongoing monthly progress & skill empowerment",
      whatYouNeed: "Desire to learn and stay connected with loved ones",
      highlights: "Monthly Family Reassurance Digests • 1-Click Pause/Cancel • Full Data Privacy",
      bullets: [
        "Access an expanding library of senior-friendly, large-font digital guides.",
        "Authorized family members receive monthly progress summaries and resolution digests.",
        "Enjoy total flexibility with month-to-month billing—pause or cancel anytime with zero hassle."
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950 text-white py-16 md:py-28 overflow-hidden border-b border-teal-900/40">
        {/* Subtle background glow */}
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Text */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 text-center lg:text-left"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold text-sm mb-6 border border-teal-500/30 backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                Step-by-Step Guidance
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-white leading-[1.1]">
                How <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">It Works</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-teal-100/90 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8">
                Getting started with the SeniorEase software platform is simple and straightforward. Here is our step-by-step process for onboarding and requesting digital support.
              </p>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-teal-200/80 font-semibold">
                <span className="flex items-center gap-1.5 bg-white/5 px-3.5 py-2 rounded-xl border border-white/10">
                  ⚡ Instant Online Activation
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 px-3.5 py-2 rounded-xl border border-white/10">
                  🛡️ 14-Day Money-Back Guarantee
                </span>
              </div>
            </motion.div>

            {/* Right Column: Hero Image Fully Displayed */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Decorative border frame effect */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-teal-500/40 via-emerald-500/30 to-teal-500/40 rounded-[2rem] blur-md opacity-75"></div>
                
                <div className="relative rounded-[1.75rem] overflow-hidden shadow-2xl bg-slate-800 border border-teal-400/30 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]">
                  <img 
                    src={howItWorksHeroImage} 
                    alt="Elderly senior learning with technology" 
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[1.75rem]"></div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 sm:left-4 bg-slate-900/95 text-white p-3.5 sm:p-4 rounded-2xl border border-teal-500/30 shadow-xl flex items-center gap-3 backdrop-blur-md">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-300 font-bold text-lg shrink-0">
                    💡
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-teal-300 uppercase tracking-wider">Simple & Patient</div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-200">No jargon, zero frustration</div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Steps List */}
      <section className="py-24 bg-white">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-6"
          >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              whileHover={{ scale: 1.02, translateY: -4 }}
              className="group flex flex-col md:flex-row gap-6 md:gap-8 items-start bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-teal-100 transition-all duration-300 relative overflow-hidden cursor-default"
            >
              {/* Subtle background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              <div className="relative bg-teal-50 group-hover:bg-teal-100 transition-colors duration-300 p-5 rounded-2xl shrink-0">
                {step.icon}
              </div>
              <div className="relative flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
                    {step.timeframe}
                  </span>
                  <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                    <Clock size={14} className="text-teal-600" /> What You Need: {step.whatYouNeed}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-700 transition-colors duration-300">{step.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">{step.description}</p>
                
                <div className="bg-gray-50/90 p-3.5 rounded-2xl border border-gray-200/80 mb-4 flex items-center gap-2 text-xs font-bold text-gray-700">
                  <Sparkles size={16} className="text-amber-500 shrink-0" />
                  <span>{step.highlights}</span>
                </div>

                <ul className="space-y-2 mt-4">
                  {step.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2.5 shrink-0"></div>
                      <span className="text-gray-700">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
          
          <motion.div 
            variants={itemVariants}
            className="text-center text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200 mt-8"
          >
            <span className="font-semibold">Note:</span> Ticketing limits and dashboard access are evaluated according to your active SaaS subscription plan.
          </motion.div>
        </motion.div>

        {/* Deep-Dive Architectural & Guarantee Section */}
        <div className="mt-20 pt-16 border-t border-gray-200">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-50 text-teal-700 font-bold text-xs uppercase tracking-wider mb-4 border border-teal-200">
              <CheckCircle2 size={14} /> Service Excellence & Guarantees
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Why SeniorEase Works Differently
            </h2>
            <p className="text-lg text-gray-600">
              We combine human patience with modern UK software standards to ensure our subscribers never feel rushed, judged, or locked into restrictive contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-white to-teal-50/30 p-8 rounded-3xl border border-teal-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-teal-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md">
                <HeartHandshake size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">The 1-on-1 UK Tutoring Philosophy</h3>
              <p className="text-gray-600 leading-relaxed mb-4 text-sm md:text-base">
                When family members try to teach technology, frustration often goes both ways. Our UK-based senior care specialists are rigorously trained in empathetic communication. We never use confusing developer jargon, we provide large-font step-by-step notes, and we happily repeat explanations as many times as needed until digital confidence is achieved.
              </p>
              <div className="text-xs font-bold text-teal-700 flex items-center gap-1.5 bg-teal-50 p-3 rounded-xl border border-teal-200/50">
                <CheckCircle2 size={16} /> 100% UK-Based Specialist Team • Zero Time Limits on Patient Learning
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-white to-blue-50/30 p-8 rounded-3xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Family & Caregiver Portal Linking</h3>
              <p className="text-gray-600 leading-relaxed mb-4 text-sm md:text-base">
                For adult children living away from aging parents, worry is constant. Our SaaS platform allows subscribers to authorize trusted family members to view support activity. Caregivers can remotely check ticket statuses, monitor scam prevention alerts, and handle billing invoices without intruding on their loved one's personal privacy.
              </p>
              <div className="text-xs font-bold text-blue-700 flex items-center gap-1.5 bg-blue-50 p-3 rounded-xl border border-blue-200/50">
                <CheckCircle2 size={16} /> Shared Family Reassurance • Automated Reassurance Digests
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-white to-amber-50/30 p-8 rounded-3xl border border-amber-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-amber-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Stripe BACS Direct Debit & Banking Protection</h3>
              <p className="text-gray-600 leading-relaxed mb-4 text-sm md:text-base">
                We partner with Stripe to provide industry-leading payment security for both Card and BACS Direct Debit. Direct Debit customers are covered by the UK Consumer Direct Debit Guarantee—receiving automated email notifications 3 working days before any collection and an immediate banking right to refund in the event of any billing discrepancy.
              </p>
              <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5 bg-amber-50 p-3 rounded-xl border border-amber-200/50">
                <CheckCircle2 size={16} /> UK Direct Debit Guarantee Protected • 3-Day Advance Notice
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-gradient-to-br from-white to-purple-50/30 p-8 rounded-3xl border border-purple-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md">
                <RefreshCw size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% No-Hassle Cancellation & Refund Pledge</h3>
              <p className="text-gray-600 leading-relaxed mb-4 text-sm md:text-base">
                We believe services should be retained through merit, not contracts. Under UK Consumer Contracts Regulations, all subscribers enjoy a 14-day statutory cooling-off period for a 100% full refund if no tutoring services were utilized. You can pause your subscription during hospital visits or holidays for up to 3 months, or cancel anytime with 1 click.
              </p>
              <div className="text-xs font-bold text-purple-700 flex items-center gap-1.5 bg-purple-50 p-3 rounded-xl border border-purple-200/50">
                <CheckCircle2 size={16} /> 14-Day Statutory Money-Back Guarantee • Zero Lock-In Contracts
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-20 text-center bg-teal-900 rounded-3xl p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-24 -right-24 w-64 h-64 bg-teal-500 rounded-full mix-blend-screen filter blur-3xl"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-400 rounded-full mix-blend-screen filter blur-3xl"
            />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to get started?</h2>
            <p className="text-teal-100 mb-8 text-lg max-w-2xl mx-auto">
              Take the first step towards digital confidence today. Browse our plans and find the perfect level of support.
            </p>
            <Link
              to="/pricing"
              className="inline-block bg-teal-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-400 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-teal-500/30"
            >
              View Pricing Plans
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  </div>
  );
}

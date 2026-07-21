import { Link } from 'react-router-dom';
import { MousePointerClick, PlayCircle, PhoneCall, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

const howItWorksHeroImage = '/images/seniors_how_it_works_hero_1784446891606.jpg';

export default function HowItWorks() {
  const steps = [
    {
      icon: <MousePointerClick className="w-10 h-10 text-teal-600" />,
      title: "Step 1 – Choose Your SaaS Plan",
      description: "Select the software subscription tier that best matches the support level you need. Whether you're looking for occasional tech learning or comprehensive family tracking, our platform has you covered.",
      bullets: [
        "Review our transparent pricing tiers.",
        "Select between Essential SaaS, Plus SaaS, or Family Portal.",
        "Sign up securely through our automated checkout platform."
      ]
    },
    {
      icon: <PlayCircle className="w-10 h-10 text-teal-600" />,
      title: "Step 2 – Access the Secure Portal",
      description: "Once registered, you will instantly receive your unique Portal Access ID and password via email so you can log into your personal, secure dashboard.",
      bullets: [
        "Log in to 'My Account' using your new credentials.",
        "Complete a brief, guided software onboarding process.",
        "Review your available dashboard features and support ticketing system."
      ]
    },
    {
      icon: <PhoneCall className="w-10 h-10 text-teal-600" />,
      title: "Step 3 – Request Support via Dashboard",
      description: "Whenever you encounter a technical issue, use our platform to file a ticket. Our friendly, UK-based customer success team will immediately handle your request.",
      bullets: [
        "Easily submit requests directly from the web portal, email, or WhatsApp.",
        "Track the progress of your digital support ticket in real-time.",
        "Connect via phone or scheduled video calls for patient, step-by-step guidance."
      ]
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-teal-600" />,
      title: "Step 4 – Build Digital Confidence",
      description: "Over time, our SaaS platform empowers senior citizens to navigate their devices with ease, turning overwhelming technology into simple, everyday tools.",
      bullets: [
        "Access educational resources and scam awareness alerts.",
        "Gain independence with regular, patient instruction.",
        "Families get peace of mind knowing loved ones are fully supported."
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
      <section className="relative text-white py-16 md:py-40 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 hidden md:block">
          <img 
            src={howItWorksHeroImage} 
            alt="Elderly senior learning with technology" 
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
            Step-by-Step Guidance
          </span>
          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
            How It Works
          </h1>
          <p className="text-lg md:text-2xl text-teal-100 font-medium leading-relaxed max-w-3xl mx-auto mb-8 md:mb-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
            Getting started with the Senior Ease software platform is simple and straightforward. Here is our step-by-step process for onboarding and requesting digital support.
          </p>

          {/* Mobile Hero Image */}
          <div className="block md:hidden mb-2 relative">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-teal-500/20">
              <img 
                src={howItWorksHeroImage} 
                alt="Elderly senior learning with technology" 
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10"></div>
          </div>
        </motion.div>
      </section>

      {/* Steps List */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div className="relative">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-700 transition-colors duration-300">{step.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">{step.description}</p>
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

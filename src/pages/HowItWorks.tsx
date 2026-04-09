import { Link } from 'react-router-dom';
import { MousePointerClick, PhoneCall, ClipboardCheck, PlayCircle, CalendarHeart, Unlock } from 'lucide-react';
import { motion } from 'motion/react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <MousePointerClick className="w-8 h-8 text-teal-600" />,
      title: "1. Choose Your Plan",
      description: "Review our simple, transparent pricing plans and select the one that best fits your needs or the needs of your loved one. Whether it's occasional help or regular monthly support, we have a plan for you."
    },
    {
      icon: <PhoneCall className="w-8 h-8 text-teal-600" />,
      title: "2. Book an Onboarding Call",
      description: "Once you've selected a plan, you'll be invited to book a friendly, no-obligation onboarding call. This is a relaxed chat to get to know each other and understand exactly what kind of digital help is needed."
    },
    {
      icon: <ClipboardCheck className="w-8 h-8 text-teal-600" />,
      title: "3. We Confirm Your Needs",
      description: "During our call, we'll discuss your specific devices, current challenges, and goals. We'll confirm that our service is the right fit and tailor our approach to provide the most effective, personalized support."
    },
    {
      icon: <PlayCircle className="w-8 h-8 text-teal-600" />,
      title: "4. Service Starts",
      description: "After confirming your needs and completing the simple registration process, your membership officially begins. You'll receive a welcome pack with all the details on how to reach us whenever you need help."
    },
    {
      icon: <CalendarHeart className="w-8 h-8 text-teal-600" />,
      title: "5. Monthly Support Provided",
      description: "Enjoy peace of mind with our ongoing support. Reach out via phone, WhatsApp, or email whenever you need help with your smartphone, tablet, emails, online forms, or general digital confidence."
    },
    {
      icon: <Unlock className="w-8 h-8 text-teal-600" />,
      title: "6. Cancel Anytime",
      description: "We believe in keeping things simple and fair. There are no long-term contracts, lock-ins, or hidden fees. If you ever feel you no longer need our support, you can easily cancel your membership before your next billing date."
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
    <div className="bg-white py-24 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">How It Works</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Getting started with Senior Ease is simple and straightforward. Here is our step-by-step process to getting you the digital support you need.
          </p>
        </motion.div>

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
                <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
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
    </div>
  );
}

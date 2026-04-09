import { Link } from 'react-router-dom';
import { Smartphone, Video, Mail, ShieldAlert, FileEdit, Users, ArrowRight, ShoppingBag, PlayCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Services() {
  const services = [
    {
      icon: Smartphone,
      title: 'Smartphone & Tablet Help',
      description: 'We help with common device issues and everyday use, making your phone or tablet feel like a helpful tool rather than a frustration:',
      items: [
        'Basic phone settings (volume, brightness, Wi-Fi)',
        'Managing contacts and saved numbers',
        'Setting alarms, reminders, and calendar events',
        'Understanding and clearing notifications',
        'Downloading and organizing apps',
        'Freeing up storage space',
        'Adjusting text size for easier reading'
      ]
    },
    {
      icon: Video,
      title: 'WhatsApp & Video Call Support',
      description: 'Stay connected with family and friends more easily. We can help you navigate messaging and video apps with confidence:',
      items: [
        'Sending and receiving text messages',
        'Recording and listening to voice notes',
        'Sharing and saving photos and videos',
        'Navigating family group chats',
        'Joining video calls (Zoom, FaceTime, WhatsApp)',
        'Basic audio and video troubleshooting'
      ]
    },
    {
      icon: Mail,
      title: 'Email & Password Assistance',
      description: 'Emails, passwords, and account logins can often be confusing. We provide patient help to keep your accounts accessible:',
      items: [
        'Reading, organizing, and deleting emails',
        'Sending emails with attachments',
        'Safe password reset guidance',
        'Account recovery and login support',
        'Unsubscribing from unwanted newsletters',
        'Creating secure, memorable passwords'
      ]
    },
    {
      icon: ShieldAlert,
      title: 'Scam Awareness & Online Safety',
      description: 'Online scams and suspicious messages are a growing concern. We provide general support to help you identify and avoid threats:',
      items: [
        'Identifying suspicious text messages (smishing)',
        'Spotting phishing emails',
        'Handling fake or automated phone calls',
        'Recognizing fake delivery or postal messages',
        'Dealing with urgent "account problem" alerts',
        'Safe browsing habits and what to avoid'
      ],
      note: 'We provide general awareness and guidance only and do not guarantee fraud prevention or financial recovery.'
    },
    {
      icon: ShoppingBag,
      title: 'Online Shopping & Groceries',
      description: 'Enjoy the convenience of having items delivered to your door. We guide you through the basics of safe online shopping:',
      items: [
        'Setting up supermarket delivery accounts',
        'Navigating basic online stores (e.g., Amazon)',
        'Understanding safe online payment methods',
        'Tracking parcel deliveries online',
        'Spotting secure websites (the padlock icon)',
        'Managing online subscriptions'
      ]
    },
    {
      icon: PlayCircle,
      title: 'Entertainment & Hobbies',
      description: 'Your device is a gateway to endless entertainment. Let us help you find and enjoy the content you love:',
      items: [
        'Navigating YouTube for videos and tutorials',
        'Setting up catch-up TV (BBC iPlayer, ITVX)',
        'Finding and listening to podcasts or radio',
        'Reading daily news online',
        'Using library apps for audiobooks (Libby, BorrowBox)',
        'Finding online games and puzzles'
      ]
    },
    {
      icon: FileEdit,
      title: 'Online Form & Digital Admin Help',
      description: 'Many essential tasks have moved online and can feel difficult without support. We can help you navigate:',
      items: [
        'Navigating local council websites',
        'Understanding and filling out simple online forms',
        'Booking doctor or clinic appointments online',
        'General account access guidance',
        'Renewing licenses or memberships online',
        'Basic digital admin support'
      ]
    },
    {
      icon: Users,
      title: 'Family Support Add-On',
      description: 'This service is designed specifically for families who want extra, reliable support for a parent or loved one:',
      items: [
        'Peace of mind for adult children',
        'Coordinating family video call setups',
        'Monthly check-ins and progress updates',
        'Reassurance that help is always a call away',
        'Assistance with setting up new devices remotely'
      ]
    }
  ];

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
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative text-white py-32 overflow-hidden bg-teal-900">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-teal-700 rounded-full mix-blend-screen filter blur-3xl"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-800 rounded-full mix-blend-screen filter blur-3xl"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Our Services</h1>
          <p className="text-2xl text-teal-300 font-medium mb-6">Simple, friendly help for everyday digital life</p>
          <p className="text-xl text-teal-100 leading-relaxed max-w-3xl mx-auto">
            SeniorEase offers patient, ongoing support for the common technology and online tasks that many seniors face every month. We're here to make the digital world feel a little smaller and a lot friendlier.
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-2 gap-8 lg:gap-10"
          >
            {services.map((service, index) => (
              <motion.div 
                key={index} 
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-white p-8 md:p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group"
              >
                <div className="bg-teal-50 group-hover:bg-teal-100 transition-colors duration-300 w-20 h-20 rounded-2xl flex items-center justify-center text-teal-600 mb-8">
                  <service.icon size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-teal-700 transition-colors duration-300">{service.title}</h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">{service.description}</p>
                
                <ul className="space-y-4 mb-8 flex-grow">
                  {service.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-teal-500 mt-2.5 shrink-0"></div>
                      <span className="text-gray-700 text-lg">{item}</span>
                    </li>
                  ))}
                </ul>

                {service.note && (
                  <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl mt-auto">
                    <p className="text-sm text-amber-800 font-medium leading-relaxed">
                      <span className="font-bold">Important Note:</span> {service.note}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white text-center relative overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 tracking-tight">Choose the Right Monthly Plan</motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Ready to get started? Review our simple, transparent pricing plans and find the perfect level of support for you or your loved one.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-3 bg-teal-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-teal-500 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-teal-500/30"
            >
              View Pricing Plans <ArrowRight size={24} />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

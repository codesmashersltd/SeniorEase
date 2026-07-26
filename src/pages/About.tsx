import { Link } from 'react-router-dom';
import { Heart, Shield, Users, CheckCircle2, Lightbulb, Smile, Clock, Phone, MapPin, Lock, CalendarCheck, Tag, EyeOff, ShieldCheck, Award, HeartHandshake } from 'lucide-react';
import { motion } from 'motion/react';
import { usePageMeta } from '../hooks/usePageMeta';
import aboutHeroImage from '../assets/images/seniors_learning_tablets_1784467977256.jpg';

export default function About() {
  usePageMeta(
    "About Us | SeniorEase - Empowering Senior Digital Confidence",
    "Learn about SeniorEase's mission to make technology less stressful and more accessible for older adults in the UK. Discover our story and values."
  );

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

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative text-white py-16 md:py-40 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 hidden md:block">
          <img 
            src={aboutHeroImage} 
            alt="Group of seniors learning digital skills" 
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/45 to-slate-950/60 backdrop-blur-[0.5px]"></div>
        </div>
        
        {/* Mobile background (soft dark gradient) */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 md:hidden"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold text-sm mb-6 border border-teal-500/30 backdrop-blur-md">
            Our Mission & Vision
          </span>
          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            About SeniorEase
          </h1>
          <p className="text-lg md:text-2xl text-teal-50 font-medium leading-relaxed max-w-3xl mx-auto mb-8 md:mb-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            Helping senior citizens feel more confident, comfortable, and supported in today’s fast-paced digital world.
          </p>

          {/* Mobile Hero Image */}
          <div className="block md:hidden mb-2 relative">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-teal-500/20">
              <img 
                src={aboutHeroImage} 
                alt="Group of seniors learning digital skills" 
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10"></div>
          </div>
        </motion.div>
      </section>

      {/* Identity Clarification Notice Banner */}
      <section className="bg-teal-900 text-white py-6 border-y border-teal-800 shadow-inner">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4 text-left">
          <div className="p-2.5 rounded-xl bg-teal-800/80 text-teal-300 shrink-0 hidden sm:block">
            <span className="text-xl font-bold">ℹ️</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-teal-200 uppercase tracking-wider mb-1">Brand Identity Notice</h3>
            <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
              <strong>SeniorEase (senioreease.com)</strong> is a dedicated software (SaaS) and digital technology education platform for older adults in the United Kingdom. We provide friendly tech support, smartphone learning, and anti-scam awareness. <span className="underline decoration-teal-400 font-semibold">We are NOT affiliated</span> with any senior living, retirement home, care home discovery platforms, or residential property directories.
            </p>
          </div>
        </div>
      </section>

      {/* Why We Started Section */}
      <section className="py-24 bg-gradient-to-b from-teal-50/50 to-white border-b border-teal-100/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="bg-white rounded-3xl p-8 sm:p-12 md:p-16 shadow-xl border border-teal-100 relative overflow-hidden"
          >
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-teal-50/80 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 text-teal-800 font-bold text-sm mb-6">
                Our Founding Purpose
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 tracking-tight">
                Why We Started
              </h2>
              
              <div className="space-y-6 text-gray-700 text-lg sm:text-xl leading-relaxed text-left sm:text-center font-normal">
                <p className="font-semibold text-teal-950 text-xl sm:text-2xl leading-snug">
                  SeniorEase was founded with one simple goal: to help older adults feel confident using everyday technology.
                </p>
                <p>
                  We believe no one should feel excluded from digital life because technology feels confusing or intimidating.
                </p>
                <p className="bg-teal-50/80 p-6 sm:p-8 rounded-2xl border border-teal-100/80 font-medium text-teal-900 shadow-inner">
                  Our mission is to provide friendly, patient, and reliable digital support that empowers seniors to stay connected, independent, and secure.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Technology Shouldn’t Feel Overwhelming</h2>
            <div className="w-24 h-1 bg-teal-500 mx-auto rounded-full"></div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="prose prose-lg text-gray-600 mx-auto"
          >
            <motion.p variants={fadeInUp} className="mb-6 text-xl leading-relaxed">
              SeniorEase was created to provide a Software as a Service (SaaS) platform that makes everyday technology feel less overwhelming for older adults and their families. As more parts of life move online, many senior citizens are left feeling confused, frustrated, or unsupported when it comes to using phones, apps, emails, online forms, and digital communication tools. SeniorEase exists to provide secure tools, a centralized dashboard, and practical learning that makes everyday digital life easier to manage.
            </motion.p>
            <motion.p variants={fadeInUp} className="mb-6 text-xl leading-relaxed">
              Everyday life now depends more than ever on smartphones, apps, emails, online accounts, and digital communication. From booking a doctor's appointment to staying in touch with grandchildren, the world has moved online.
            </motion.p>
            <motion.p variants={fadeInUp} className="mb-6 text-xl leading-relaxed">
              For many older adults, this rapid shift can feel frustrating, confusing, or stressful. Passwords get lost, scam messages cause anxiety, and simple tasks can suddenly feel like insurmountable hurdles.
            </motion.p>
            <motion.p variants={fadeInUp} className="mb-12 text-xl leading-relaxed font-medium text-gray-800">
              At SeniorEase, we created a comprehensive SaaS platform and support subscription to help make everyday technology easier, calmer, and less intimidating. We provide the software tools and the patient, friendly voice on the end of the phone when things go wrong.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="bg-teal-50 p-10 rounded-3xl mb-8 border border-teal-100 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">We believe seniors deserve support that is:</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { text: 'Patient & Unrushed', icon: <Clock size={20} /> },
                  { text: 'Respectful & Kind', icon: <Heart size={20} /> },
                  { text: 'Simple & Jargon-Free', icon: <Lightbulb size={20} /> },
                  { text: 'Reassuring & Safe', icon: <Shield size={20} /> },
                  { text: 'Easy to Access', icon: <Phone size={20} /> },
                  { text: 'Friendly & Warm', icon: <Smile size={20} /> }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-teal-900 font-medium text-lg bg-white p-4 rounded-xl shadow-sm">
                    <div className="text-teal-600 bg-teal-50 p-2 rounded-lg">{item.icon}</div>
                    {item.text}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-gray-50 border-t border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 text-teal-800 font-bold text-sm mb-4">
              What We Stand For
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Our Core Values
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Everything we build, teach, and communicate at SeniorEase is guided by six fundamental principles that place the dignity and confidence of older adults above all else.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Compassion',
                description: 'We lead with empathy, understanding the emotional hurdles and frustration that can sometimes accompany learning modern digital technology.',
                icon: <Heart className="text-rose-500" size={32} />,
                bg: 'bg-rose-50',
                border: 'border-rose-100 hover:border-rose-300'
              },
              {
                title: 'Patience',
                description: 'We never rush, never judge, and always move at a calm, unrushed pace that suits you. No question is ever too simple or asked too many times.',
                icon: <Clock className="text-teal-600" size={32} />,
                bg: 'bg-teal-50',
                border: 'border-teal-100 hover:border-teal-300'
              },
              {
                title: 'Simplicity',
                description: 'We strip away confusing tech jargon, buzzwords, and complex instructions, explaining everyday digital tasks in clear, plain English.',
                icon: <Lightbulb className="text-amber-500" size={32} />,
                bg: 'bg-amber-50',
                border: 'border-amber-100 hover:border-amber-300'
              },
              {
                title: 'Security',
                description: 'We prioritize your digital safety above all else, helping you identify scams, protect passwords, and keep personal accounts strictly secure.',
                icon: <ShieldCheck className="text-emerald-600" size={32} />,
                bg: 'bg-emerald-50',
                border: 'border-emerald-100 hover:border-emerald-300'
              },
              {
                title: 'Respect',
                description: 'We treat every older adult with the warmth, patience, and dignity they truly deserve, honoring their life experience and independence.',
                icon: <HeartHandshake className="text-indigo-600" size={32} />,
                bg: 'bg-indigo-50',
                border: 'border-indigo-100 hover:border-indigo-300'
              },
              {
                title: 'Reliability',
                description: 'You and your family can always depend on us for consistent, trustworthy UK-based support whenever technology gets confusing.',
                icon: <Award className="text-blue-600" size={32} />,
                bg: 'bg-blue-50',
                border: 'border-blue-100 hover:border-blue-300'
              }
            ].map((value, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`bg-white p-8 rounded-3xl border ${value.border} shadow-sm hover:shadow-md transition-all flex flex-col`}
              >
                <div className={`w-16 h-16 rounded-2xl ${value.bg} flex items-center justify-center mb-6 shrink-0 shadow-inner`}>
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed text-base flex-grow">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Support for Seniors. Peace of Mind for Families. */}
      <section className="py-24 bg-teal-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Support for Seniors. Peace of Mind for Families.</motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              SeniorEase is designed not only for older adults, but also for families who want extra reassurance for a loved one. Whether it’s educate on WhatsApp, video calls, online forms, or simply feeling more confident with everyday technology, we aim to provide support that feels calm, practical, and easy to access.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Our Mission & Why We Exist */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-12 lg:gap-16"
          >
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="bg-white p-10 lg:p-12 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="bg-teal-100 w-20 h-20 rounded-2xl flex items-center justify-center text-teal-600 mb-8">
                <Heart size={40} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our mission is to provide friendly, non-medical digital learning that gives senior citizens more confidence and gives families more peace of mind. We want to bridge the digital divide with empathy and patience.
              </p>
              <p className="text-lg text-gray-900 mb-6 font-bold">We’re here to support everyday digital tasks such as:</p>
              <ul className="space-y-4">
                {['Smartphone & Tablet learning', 'WhatsApp & Video Call support', 'Online forms & Shopping', 'Email & Password assistance', 'Scam awareness guidance', 'General digital confidence'].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-gray-700 text-lg">
                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                      <CheckCircle2 size={18} />
                    </div> 
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="bg-white p-10 lg:p-12 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="bg-teal-100 w-20 h-20 rounded-2xl flex items-center justify-center text-teal-600 mb-8">
                <Users size={40} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why SeniorEase Matters</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Many seniors don’t want to feel dependent, confused, or left behind by technology. They want to remain independent but simply need a educating hand from someone they can trust.
              </p>
              <p className="text-lg text-gray-900 mb-6 font-bold">Many families also worry about:</p>
              <ul className="space-y-4 mb-10">
                {['Suspicious scam messages & emails', 'Missed digital appointments', 'Phone confusion & lockouts', 'Online account problems', 'Parents struggling with digital tasks alone'].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-gray-700 text-lg">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-400 shrink-0">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    </div> 
                    {item}
                  </li>
                ))}
              </ul>
              <div className="bg-teal-900 p-6 rounded-2xl shadow-inner">
                <p className="text-white font-medium text-lg text-center">SeniorEase exists to make everyday online life feel easier and less stressful for everyone involved.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Customers Trust Us */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold text-sm mb-4 border border-teal-500/30">
              Our Guarantee to You
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Why Customers Trust Us
            </h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              We know that inviting digital support into your daily routine requires complete confidence. Here is how we ensure every interaction is safe, transparent, and dependable for seniors and families alike.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'UK-based support',
                description: 'Every phone call, email, and WhatsApp message is handled by our friendly, dedicated support team located right here in the UK. You will always speak with someone calm, patient, and easy to understand—no rushed automated menus.',
                icon: <MapPin className="text-teal-400" size={28} />
              },
              {
                title: 'Secure payments',
                description: 'All transactions and subscription billings are protected with bank-grade encryption. We partner with industry-leading, verified payment processors so your financial details are always kept strictly confidential and secure.',
                icon: <Lock className="text-teal-400" size={28} />
              },
              {
                title: 'Cancel anytime',
                description: 'We believe in earning your trust every single month. You are never locked into long-term contracts or complicated tie-ins. You can cancel your subscription at any time with complete ease through your portal or via support.',
                icon: <CalendarCheck className="text-teal-400" size={28} />
              },
              {
                title: 'Transparent pricing',
                description: 'What you see on our pricing plans is exactly what you pay. We make all membership tiers straightforward and easy to understand, ensuring you and your family can choose the right level of care without any guesswork.',
                icon: <Tag className="text-teal-400" size={28} />
              },
              {
                title: 'No hidden fees',
                description: 'There are no surprise call-out charges, unexpected setup costs, or mystery bill extras. You receive comprehensive digital education and assistance for one predictable, simple monthly membership fee.',
                icon: <EyeOff className="text-teal-400" size={28} />
              },
              {
                title: 'Privacy-first approach',
                description: 'We treat your personal data with the utmost respect and care. We adhere strictly to UK GDPR regulations, never sell your data to third parties, and ensure your personal family communications remain completely private.',
                icon: <ShieldCheck className="text-teal-400" size={28} />
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/80 hover:border-teal-500/50 transition-all duration-300 shadow-lg flex flex-col"
              >
                <div className="w-14 h-14 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-6 shrink-0">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-300 leading-relaxed text-base flex-1">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Approach & Important Note */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">How We Support</motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-gray-600 mb-10 leading-relaxed">
                We don’t overcomplicate things. We educate in a way that feels human, friendly, and reassuring. We focus on:
              </motion.p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {['Simple explanations', 'Calm support', 'Easy communication', 'Practical guidance', 'Patience and trust', 'No technical jargon'].map((item, i) => (
                  <motion.div variants={fadeInUp} key={i} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <CheckCircle2 className="text-teal-600 shrink-0" size={24} />
                    <span className="text-lg font-medium text-gray-800">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="bg-gray-900 text-white p-10 lg:p-12 rounded-3xl shadow-2xl relative overflow-hidden"
            >
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gray-800 rounded-full mix-blend-screen filter blur-3xl opacity-50 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-gray-800 p-3 rounded-xl">
                    <Shield className="text-teal-400" size={32} />
                  </div>
                  <h3 className="text-3xl font-bold">What We Do Not Provide</h3>
                </div>
                <p className="text-gray-300 mb-8 text-lg leading-relaxed">To ensure we provide the best possible digital support, it is important to clarify that SeniorEase is not:</p>
                <ul className="space-y-5 mb-10">
                  {['A medical service', 'An emergency service', 'A care provider', 'A legal advice service', 'A financial advice service'].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-gray-300 text-lg">
                      <div className="w-2 h-2 rounded-full bg-gray-500 shrink-0"></div> {item}
                    </li>
                  ))}
                </ul>
                <div className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className="text-base text-gray-200 font-medium text-center">We provide general digital assistance and everyday support only.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-teal-600 text-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500 rounded-full mix-blend-screen filter blur-3xl"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-400 rounded-full mix-blend-screen filter blur-3xl"
          />
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight"
          >
            Want Friendly Ongoing Support?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto"
          >
            Join SeniorEase today and let us take the stress out of everyday technology.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/pricing"
              className="inline-block bg-white text-teal-600 px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-xl"
            >
              View Membership Plans
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

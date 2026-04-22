import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Smartphone, Mail, FileText, Users, ArrowRight, PhoneCall, HeartHandshake, Video, Calendar, Star } from 'lucide-react';
import JoinModal from '../components/JoinModal';

export default function Home() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&q=80&w=2000" 
            alt="Seniors using technology" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-white/60"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 font-medium text-sm mb-8 border border-teal-100">
              <ShieldCheck size={18} />
              <span>Friendly UK-based assistance</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-8 leading-[1.1]">
              Friendly Digital Support Platform for <span className="text-teal-600">Senior Citizens</span> in the UK
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              Senior Ease is a Software as a Service (SaaS) platform that helps older adults with everyday technology — combining intuitive secure software with friendly digital confidence support.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link
                to="/pricing"
                className="bg-teal-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Choose Your Plan <ArrowRight size={20} />
              </Link>
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-full font-medium text-lg hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <PhoneCall size={20} /> Book a Free Intro Call
              </button>
            </div>
            
            {/* Trust Strip */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Secure SaaS Platform</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Friendly digital support</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Monthly software subscription</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> UK-focused service</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Supporting Text */}
      <section className="bg-teal-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Technology should make life easier — not more stressful.</h2>
          <p className="text-xl text-gray-700 mb-6 leading-relaxed">
            At SeniorEase, our dedicated Software as a Service (SaaS) platform provides calm, friendly, ongoing support tools for senior citizens who need help with phones, apps, online tasks, and everyday digital problems.
          </p>
          <p className="text-xl text-gray-700 leading-relaxed">
            Whether it’s using WhatsApp, spotting suspicious messages, joining a video call, or getting help with an online form, we’re here to make things simpler.
          </p>
        </div>
      </section>

      {/* How We Help */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">How Our SaaS Platform Helps Seniors Feel More Confident Online</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Many everyday tasks now happen online — from messages and emails to appointments, accounts, and family video calls.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                For many seniors, that can feel confusing or overwhelming. SeniorEase's proprietary software platform and dashboard provide simple monthly access to help with:
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  'Using smartphones and tablets',
                  'WhatsApp and video calling',
                  'Emails and account logins',
                  'Online forms and digital tasks',
                  'Scam awareness and online safety',
                  'Everyday technology questions'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-teal-600 mt-1 shrink-0" size={20} />
                    <span className="text-lg text-gray-800 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-teal-50 p-6 rounded-2xl border border-teal-100">
                <p className="text-teal-900 font-semibold text-lg">Secure dashboard access & friendly help when it’s needed — without the stress.</p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 relative">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1000" 
                  alt="Senior woman smiling while using a tablet" 
                  className="object-cover w-full h-full"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl max-w-xs border border-gray-100 hidden md:block">
                <div className="flex items-center gap-4 mb-2">
                  <div className="bg-green-100 p-2 rounded-full text-green-600">
                    <ShieldCheck size={24} />
                  </div>
                  <p className="font-bold text-gray-900">Peace of Mind</p>
                </div>
                <p className="text-sm text-gray-600">Ongoing support for everyday digital tasks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">What SeniorEase SaaS Platform Provides</h2>
            <p className="text-xl text-gray-600 mb-4">SeniorEase is a powerful Software as a Service (SaaS) platform providing digital dashboard tools and non-medical digital support for senior citizens and their families.
Through our portal, you can request help with common everyday tasks such as:</p>
            <p className="text-lg text-teal-700 font-medium">Our software platform is designed to make everyday technology easier, simpler, and less stressful for older adults.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Smartphone, title: 'Smartphone and tablet Help', desc: 'Support with basic phone use, settings, contacts, reminders, apps, and everyday device issues.' },
              { icon: Users, title: 'WhatsApp & messaging support ', desc: 'Help with messages, voice notes, family group chats, photos, and video calls with loved ones.' },
              { icon: Video, title: 'Video Call Setup & Troubleshooting', desc: 'Step-by-step guidance for Zoom, FaceTime, and Skype so you can easily connect with family and friends without technical frustration.' },
              { icon: Mail, title: 'Email & Login Guidance', desc: 'Assistance with reading emails, resetting passwords, understanding account access, and avoiding suspicious emails.' },
              { icon: Calendar, title: 'Appointment & Reminder Support', desc: 'Help setting up digital calendars, medical appointment reminders, and daily alarms to keep your schedule organized.' },
              { icon: ShieldCheck, title: 'Scam Awareness Guidance', desc: 'General support to help identify suspicious messages, fake calls, phishing attempts, and online scams.' },
              { icon: FileText, title: 'Online Form and Account assistance ', desc: 'Simple guidance with forms, website navigation, online accounts, and digital admin tasks.' },
              { icon: Star, title: 'Everyday Digital Confidence Support', desc: 'Patient, ongoing encouragement to help you build confidence and overcome the fear of making mistakes with technology.' },
              { icon: HeartHandshake, title: 'Family Support Add-On', desc: 'Ideal for adult children who want extra support and reassurance for a parent or loved one.' }
            ].map((service, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="bg-teal-50 w-14 h-14 rounded-2xl flex items-center justify-center text-teal-600 mb-6">
                  <service.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/services" className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 transition-colors text-lg">
              View all our services <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Who SeniorEase Is For */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Who Our Software Is For</h2>
              <p className="text-xl text-gray-600">The Senior Ease SaaS Platform is designed for:</p>
            </div>

            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="bg-teal-100 text-teal-600 p-3 rounded-full shrink-0 mt-1">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Senior citizens who want patient help with everyday technology</h3>
                  <p className="text-gray-600">We provide step-by-step, jargon-free guidance so you can use your devices with confidence.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="bg-teal-100 text-teal-600 p-3 rounded-full shrink-0 mt-1">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Families who want extra reassurance for a parent or loved one</h3>
                  <p className="text-gray-600">Give yourself peace of mind knowing your loved ones have a friendly, reliable place to turn for tech support.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="bg-teal-100 text-teal-600 p-3 rounded-full shrink-0 mt-1">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Older adults who feel confused, frustrated, or left behind by modern apps and devices</h3>
                  <p className="text-gray-600">You don't have to figure it out alone. We're here to patiently walk you through any digital hurdle.</p>
                </div>
              </div>
            </div>

            <div className="bg-teal-50 border border-teal-100 rounded-3xl p-8 text-center">
              <p className="text-xl text-teal-900 font-medium leading-relaxed">
                Whether it’s help using WhatsApp, joining a video call, understanding a suspicious message, or navigating an online form — we’re here to make things easier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-teal-900 rounded-[3rem] p-8 md:p-16 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-800 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Families Choose SeniorEase</h2>
                <p className="text-xl text-teal-100 leading-relaxed">
                  We know that technology can feel overwhelming — especially when everyday tasks become more digital. Senior Ease is designed to provide calm, practical support without pressure, jargon, or confusion.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { title: 'Friendly, Respectful Support', desc: 'We treat every older adult with patience and dignity, explaining things simply without any confusing technical jargon.' },
                  { title: 'Clear Monthly Plans', desc: 'Simple, transparent pricing with no hidden surprises, setup fees, or unexpected charges.' },
                  { title: 'UK-Focused Support Model', desc: 'Our service is tailored to the needs of UK seniors, understanding local services, apps, and common concerns.' },
                  { title: 'Help via Phone, WhatsApp & Email', desc: 'We offer support through the channels you already use and feel most comfortable with.' },
                  { title: 'Family-Friendly Communication', desc: 'We keep adult children in the loop when needed, providing peace of mind for the whole family.' },
                  { title: 'Easy Cancellation', desc: 'No long-term contracts. You can easily cancel your membership at any time before your next billing date.' },
                  { title: 'Privacy-First Approach', desc: 'We maintain clear support boundaries, never asking for sensitive financial details or passwords, ensuring your data stays safe.' }
                ].map((reason, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">{reason.title}</h3>
                    <p className="text-teal-100 leading-relaxed">{reason.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 tracking-tight">Ready to Make Everyday Technology Easier?</h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Whether you’re looking for support for yourself or peace of mind for a loved one, SeniorEase is here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/pricing"
              className="bg-teal-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-teal-700 transition-colors shadow-lg"
            >
              Choose your Plans
            </Link>
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-full font-medium text-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Book a Free Intro Call
            </button>
          </div>
        </div>
      </section>

      {/* Join Modal */}
      <JoinModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
    </div>
  );
}

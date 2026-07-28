import React, { useState } from 'react';
import { Shield, ShieldAlert, CheckCircle2, AlertTriangle, HeartHandshake, PhoneCall, Mail, Lock, UserCheck, FileText, ArrowRight, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Safeguarding() {
  usePageMeta(
    "Our Commitment to Protecting Vulnerable Adults | SeniorEase",
    "Our transparent safeguarding policy explaining how we actively protect older adults while maintaining clear, supportive guidance."
  );

  // State for Interactive Caregiver Safety Checklist
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    noRemoteDesktop: true,
    screenLock: true,
    twoFactor: false,
    caregiverCc: false,
    noBankDetailsShared: true,
    scamAwarenessCompleted: false,
  });

  const [checklistSubmitted, setChecklistSubmitted] = useState(false);

  const toggleCheck = (key: string) => {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = Object.keys(checkedItems).length;
  const scorePercentage = Math.round((completedCount / totalCount) * 100);

  const checklistItems = [
    {
      id: 'noRemoteDesktop',
      title: 'No Unverified Remote Desktop Apps Installed',
      desc: 'Verify that anyDesk, TeamViewer, or unverified remote control software is removed from the senior’s device.'
    },
    {
      id: 'screenLock',
      title: 'Biometric or PIN Screen Lock Enabled',
      desc: 'Ensure smartphones and tablets require FaceID, fingerprint, or a secure PIN to unlock.'
    },
    {
      id: 'twoFactor',
      title: 'Two-Factor Authentication (2FA) Active on Key Accounts',
      desc: 'Email and banking accounts have secondary SMS or app verification enabled.'
    },
    {
      id: 'caregiverCc',
      title: 'Caregiver CC / Family Notification Loop Active',
      desc: 'A trusted family member is linked in SeniorEase settings to receive copies of learning summaries and fraud warnings.'
    },
    {
      id: 'noBankDetailsShared',
      title: 'Adherence to Zero Financial Access Rule',
      desc: 'The user understands that SeniorEase advisors will NEVER ask for bank passwords, PINs, or card security codes.'
    },
    {
      id: 'scamAwarenessCompleted',
      title: 'Completed Initial Scam Awareness Learning Session',
      desc: 'Reviewed common UK fraud patterns (fake bank calls, WhatsApp parent scams, phishing emails).'
    }
  ];

  return (
    <div className="bg-gray-50 py-24">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
          id="safeguarding-container"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-teal-950 p-8 md:p-16 text-center relative overflow-hidden" id="safeguarding-header">
            <div className="absolute top-0 right-0 w-80 h-80 bg-teal-800 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-700 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-300 font-bold text-sm mb-6 border border-amber-500/30 backdrop-blur-md">
                <ShieldAlert size={18} className="text-amber-400" />
                <span>Customer Protection &amp; Safeguarding Policy</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                Our Commitment to Protecting Vulnerable Adults
              </h1>
              <p className="text-teal-100 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-medium">
                Our transparent safeguarding policy explaining how we actively support and protect older adults while maintaining clear, honest boundaries about online security.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-16 max-w-6xl mx-auto space-y-16">
            
            {/* Core Principle Callout Box (Explicitly addressing user query) */}
            <div className="bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 p-8 md:p-10 rounded-3xl border-2 border-amber-300 shadow-sm relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
                <div className="p-4 bg-amber-500 text-white rounded-2xl shrink-0 shadow-md">
                  <Shield size={36} />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-amber-950 mb-3 flex items-center gap-2">
                    <span>Our Safeguarding Commitment</span>
                  </h2>
                  <p className="text-xl font-bold text-amber-900 mb-4 leading-snug">
                    &ldquo;We know that many of the people we support are more vulnerable to online risks because of age, isolation, or unfamiliarity with technology. We can&apos;t make that risk disappear completely — no one can — but we&apos;ve built real safeguards into how we work, and we&apos;re upfront about where our role ends and a bank, family member, or the authorities should take over.&rdquo;
                  </p>
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                    When providing digital technology tutoring and non-medical online guidance to senior citizens, we recognize that our customer base inherently includes individuals who may be vulnerable due to age, isolation, or digital unfamiliarity. While no software platform can eliminate 100% of online risks, we enforce rigorous, multi-layered safeguarding protocols combined with clear, advisory-only boundaries to protect our users and empower their families.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1: Why This Risk Profile is Inherent to Our Model */}
            <section className="space-y-6">
              <div className="border-l-4 border-teal-600 pl-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">1. Why This Risk Profile is Inherent to Our Model</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                SeniorEase operates as an educational Software as a Service (SaaS) platform designed to bridge the digital divide for older adults. In serving this demographic, we acknowledge three baseline realities that make a vulnerable adult risk profile inherent to our operating model:
              </p>
              <div className="grid md:grid-cols-3 gap-6 pt-2">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center mb-4 font-bold text-xl">
                      01
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Cognitive &amp; Technical Variance</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Seniors experience varying rates of digital recall and cognitive fatigue. A concept mastered during a tutoring session may be forgotten when an app interface updates or an unexpected system prompt appears.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center mb-4 font-bold text-xl">
                      02
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Aggressive Scam Ecosystems</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Older adults are disproportionately targeted by sophisticated phishing campaigns, impersonation scams (fake bank or NHS texts), and deceptive pop-ups on third-party websites outside our platform.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center mb-4 font-bold text-xl">
                      03
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Third-Party Platform Independence</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      We educate seniors on tools like WhatsApp, email, banking apps, and online shopping, but we do not own or control those external systems, their security flaws, or their algorithmic changes.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-gray-200" />

            {/* Section 2: Active Safeguarding Mitigations */}
            <section className="space-y-6">
              <div className="border-l-4 border-teal-600 pl-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">2. Our Active Safeguarding Mitigations (The Defense Layer)</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                To actively mitigate the inherent risks associated with serving vulnerable adults, SeniorEase enforces strict operational protocols across our software dashboard and human support interactions:
              </p>

              <div className="grid md:grid-cols-2 gap-8 pt-2">
                <div className="bg-white p-8 rounded-3xl border-2 border-teal-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-teal-600 text-white rounded-xl">
                      <Lock size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Zero Financial &amp; Credential Access Policy</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Our advisors and software tools operate under a strict zero-access rule. We will <strong className="text-gray-900">never</strong> request passwords, banking PINs, two-factor SMS codes, or remote desktop control of banking, cryptocurrency, or financial applications. If a senior asks us to perform a financial transaction on their behalf, we strictly decline and guide them on how to safely contact their official bank or family caregiver.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-3xl border-2 border-teal-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-teal-600 text-white rounded-xl">
                      <HeartHandshake size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Calm Pacing &amp; Anti-Coercion Guarantee</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    We recognize that high-pressure environments exacerbate vulnerability. Our staff are trained in dementia-friendly communication, patient pacing, and anti-coercion. We never upsell, rush, or pressure seniors into decisions during support calls, and all session notes are summarized in plain, jargon-free English in their account portal.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-3xl border-2 border-teal-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-teal-600 text-white rounded-xl">
                      <UserCheck size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Trusted Caregiver / Family Loop</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    We provide optional Caregiver CC notifications. With the senior’s consent, family members can receive automated copies of learning logs, session summaries, and instant alerts if our advisors notice red flags (such as a senior mentioning unsolicited phone calls or suspicious crypto investment schemes).
                  </p>
                </div>

                <div className="bg-white p-8 rounded-3xl border-2 border-teal-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-teal-600 text-white rounded-xl">
                      <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Scam Signposting &amp; Rapid Escalation</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Where our team identifies active signs of scam victimization or financial abuse, we initiate our safeguarding escalation protocol. We immediately advise the user to contact their bank’s fraud department and signpost them to UK statutory bodies including Action Fraud (0300 123 2040), Age UK, and local authority adult safeguarding teams.
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-gray-200" />

            {/* Section 3: Strict No-Guarantee & Liability Boundaries */}
            <section className="space-y-6">
              <div className="border-l-4 border-amber-500 pl-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">3. Strict No-Guarantee Language (The Legal Boundary)</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                To ensure complete legal and ethical transparency with customers, caregivers, and regulatory partners, our safeguarding measures are paired with explicit, unambiguous no-guarantee language:
              </p>

              <div className="bg-slate-900 text-white p-8 md:p-10 rounded-3xl space-y-6 shadow-xl">
                <div className="flex items-center gap-3 text-amber-400 font-bold text-lg">
                  <FileText size={24} />
                  <span>Mandatory Terms of Engagement &amp; Disclaimer Scope</span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 text-gray-300 text-sm md:text-base leading-relaxed">
                  <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
                    <h4 className="font-bold text-white text-lg mb-2 flex items-center gap-2">
                      <span className="text-teal-400">✓</span> Educational Scope Only
                    </h4>
                    <p>
                      SeniorEase is an educational guidance tool and non-medical support service. We do not act as power of attorney, financial advisors, IT security insurers, or statutory healthcare providers.
                    </p>
                  </div>
                  
                  <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
                    <h4 className="font-bold text-white text-lg mb-2 flex items-center gap-2">
                      <span className="text-amber-400">⚠️</span> No Guarantee of Scam Immunity
                    </h4>
                    <p>
                      While our scam awareness training significantly improves digital vigilance, <strong className="text-white font-semibold">we cannot and do not guarantee</strong> that a customer will never fall victim to third-party fraud, malware, or social engineering.
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
                    <h4 className="font-bold text-white text-lg mb-2 flex items-center gap-2">
                      <span className="text-amber-400">⚠️</span> Third-Party Liability Exclusion
                    </h4>
                    <p>
                      SeniorEase is not liable for financial losses, device malfunctions, or data breaches occurring on third-party applications (e.g., WhatsApp, banks, email providers) utilized or discussed during tutoring sessions.
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
                    <h4 className="font-bold text-white text-lg mb-2 flex items-center gap-2">
                      <span className="text-teal-400">✓</span> User Execution Variance
                    </h4>
                    <p>
                      Digital competence depends on individual practice and device health. We make no warranty that a specific technological proficiency level will be achieved within a set timeframe.
                    </p>
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 pt-2 border-t border-slate-800">
                  By subscribing to or using SeniorEase, customers and their authorizing family members explicitly accept these boundaries as a fundamental condition of our service delivery model.
                </p>
              </div>
            </section>

            <hr className="border-gray-200" />

            {/* Section 4: Interactive Caregiver & Senior Safety Checklist */}
            <section className="space-y-8">
              <div className="border-l-4 border-teal-600 pl-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">4. Interactive Caregiver &amp; Senior Safety Self-Assessment</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Use this interactive checklist to verify that key digital safeguarding practices are active for yourself or your senior loved one. This tool calculates a live safety score and helps identify areas where extra support is recommended.
              </p>

              <div className="bg-teal-50/60 p-8 md:p-10 rounded-3xl border border-teal-100 shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-6 border-b border-teal-200">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">Digital Safeguarding Score</h3>
                    <p className="text-gray-600 text-sm">Check off completed safety measures below:</p>
                  </div>
                  <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl shadow-sm border border-teal-200">
                    <div className="text-center">
                      <span className="text-3xl font-extrabold text-teal-600">{completedCount} / {totalCount}</span>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Measures Active</p>
                    </div>
                    <div className="w-px h-10 bg-gray-200"></div>
                    <div className="text-center">
                      <span className={`text-3xl font-extrabold ${scorePercentage === 100 ? 'text-green-600' : scorePercentage >= 60 ? 'text-teal-600' : 'text-amber-600'}`}>
                        {scorePercentage}%
                      </span>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Safety Rating</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {checklistItems.map((item) => {
                    const isChecked = checkedItems[item.id];
                    return (
                      <div 
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                          isChecked 
                            ? 'bg-white border-teal-500 shadow-sm' 
                            : 'bg-white/60 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isChecked ? 'bg-teal-600 text-white' : 'border-2 border-gray-300 bg-gray-50'
                        }`}>
                          {isChecked && <Check size={16} strokeWidth={3} />}
                        </div>
                        <div>
                          <h4 className={`font-bold text-base mb-1 ${isChecked ? 'text-gray-900' : 'text-gray-700'}`}>
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {checklistSubmitted ? (
                  <div className="bg-white p-6 rounded-2xl border border-teal-200 text-center animate-fade-in">
                    <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 size={24} />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Assessment Recorded!</h4>
                    <p className="text-gray-600 text-sm max-w-xl mx-auto mb-4">
                      {scorePercentage === 100 
                        ? 'Excellent! All core safeguarding precautions are active. Continue reviewing our scam awareness updates regularly.'
                        : 'We recommend completing the remaining unchecked items. You can request dedicated tutoring on these topics via your SeniorEase account dashboard.'}
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <Link
                        to="/account"
                        className="px-5 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-colors shadow-sm"
                      >
                        Go to My Account &amp; Request Tutoring
                      </Link>
                      <button
                        onClick={() => window.print()}
                        className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                      >
                        Print Checklist
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <button
                      onClick={() => setChecklistSubmitted(true)}
                      className="px-8 py-3.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-md inline-flex items-center gap-2"
                    >
                      <span>Verify &amp; Save Assessment</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            </section>

            <hr className="border-gray-200" />

            {/* Section 5: Emergency Escalation & Statutory Signposting */}
            <section className="space-y-6">
              <div className="border-l-4 border-teal-600 pl-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">5. Emergency Signposting &amp; Safeguarding Contacts</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                If you suspect that a senior has been victimized by financial fraud, identity theft, or online coercion, take immediate action using official statutory channels:
              </p>

              <div className="grid md:grid-cols-3 gap-6 pt-2">
                <div className="bg-red-50 p-6 rounded-2xl border border-red-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-red-700 font-bold text-lg mb-2">
                      <PhoneCall size={20} />
                      <span>Action Fraud UK</span>
                    </div>
                    <p className="text-red-950 text-sm mb-4 leading-relaxed">
                      The UK’s national reporting centre for fraud and cybercrime. Contact immediately if bank accounts or funds are compromised.
                    </p>
                  </div>
                  <a 
                    href="tel:03001232040" 
                    className="w-full py-2.5 bg-red-600 text-white text-center rounded-xl font-bold text-sm hover:bg-red-700 transition-colors shadow-sm block"
                  >
                    Call 0300 123 2040
                  </a>
                </div>

                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-blue-700 font-bold text-lg mb-2">
                      <PhoneCall size={20} />
                      <span>Age UK Advice Line</span>
                    </div>
                    <p className="text-blue-950 text-sm mb-4 leading-relaxed">
                      Free, confidential advice and support for older people, their families, and carers on everyday concerns and wellbeing.
                    </p>
                  </div>
                  <a 
                    href="tel:08006781602" 
                    className="w-full py-2.5 bg-blue-600 text-white text-center rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm block"
                  >
                    Call 0800 678 1602
                  </a>
                </div>

                <div className="bg-teal-50 p-6 rounded-2xl border border-teal-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-teal-800 font-bold text-lg mb-2">
                      <Mail size={20} />
                      <span>SeniorEase Safeguarding</span>
                    </div>
                    <p className="text-teal-950 text-sm mb-4 leading-relaxed">
                      Contact our internal Safeguarding Officer to flag a concern regarding a tutoring session or request immediate account pacing.
                    </p>
                  </div>
                  <a 
                    href="mailto:safeguarding@seniorease.com" 
                    className="w-full py-2.5 bg-teal-700 text-white text-center rounded-xl font-bold text-sm hover:bg-teal-800 transition-colors shadow-sm block"
                  >
                    Email Safeguarding
                  </a>
                </div>
              </div>
            </section>

            {/* Bottom Navigation CTA */}
            <div className="bg-gray-100 p-8 rounded-3xl text-center space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Have Questions About Our Safeguarding Commitment?</h3>
              <p className="text-gray-600 max-w-xl mx-auto">
                We believe that transparent governance protects everyone. Review our full legal framework or contact our support team today.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Link
                  to="/terms"
                  className="px-6 py-3 bg-white text-gray-800 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors border border-gray-300 shadow-sm"
                >
                  Read Terms &amp; Conditions
                </Link>
                <Link
                  to="/disclaimer"
                  className="px-6 py-3 bg-white text-gray-800 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors border border-gray-300 shadow-sm"
                >
                  Read Full Disclaimer
                </Link>
                <Link
                  to="/contact"
                  className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-colors shadow-md"
                >
                  Contact Support Team
                </Link>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}

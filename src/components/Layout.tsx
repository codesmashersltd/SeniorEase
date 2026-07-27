import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, HeartHandshake } from 'lucide-react';
import { useState, useEffect } from 'react';
import JoinModal from './JoinModal';
import WhatsAppButton from './WhatsAppButton';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const location = useLocation();

  // Close menu and scroll to top when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'How it Works', path: '/how-it-works' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
    { name: 'Login', path: '/account' },
  ];

  // Site Organization Schema for SEO & AI Bots accessibility
  const siteSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SeniorEase",
    "url": "https://www.senioreease.com",
    "logo": "https://www.senioreease.com/logo.svg",
    "email": "support@senioreease.com",
    "telephone": "+443304010019",
    "description": "UK Digital Technology Learning & Support Platform for Seniors. We provide smartphone, tablet, computer, and anti-scam assistance.",
    "disambiguatingDescription": "SeniorEase is a digital technology education and technical support platform for older adults in the United Kingdom. It is an independent SaaS tech support service and is distinct from and not affiliated with any US or international senior living community discovery platforms or residential care directories.",
    "knowsAbout": ["Digital Technology Support for Seniors", "Smartphone Learning", "Scam Awareness", "Tablet Training", "Online Banking Help"],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "167-169 Great Portland Street, 5th Floor",
      "addressLocality": "London",
      "postalCode": "W1W 5PF",
      "addressCountry": "GB"
    },
    "sameAs": [
      "https://www.senioreease.com"
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-gray-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Structured data injection for SEO & AI Crawlers */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
      />
      {/* Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-teal-600 text-white p-2 rounded-xl group-hover:bg-teal-700 transition-colors">
                  <HeartHandshake size={28} />
                </div>
                <div>
                  <span className="font-bold text-2xl tracking-tight text-gray-900 block leading-none">SeniorEase</span>
                  <span className="text-xs text-gray-500 font-medium tracking-wide border px-1.5 rounded bg-gray-50">DiGITAL LEARNING</span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-base font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-teal-600'
                      : 'text-gray-600 hover:text-teal-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="bg-teal-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-teal-700 transition-colors shadow-sm hover:shadow-md cursor-pointer"
              >
                Join Now
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 p-2"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-3 py-4 text-lg font-medium rounded-xl ${
                    location.pathname === link.path
                      ? 'bg-teal-50 text-teal-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 px-3">
                <button
                  onClick={() => {
                    setIsJoinModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-center bg-teal-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-teal-700 transition-colors text-lg cursor-pointer"
                >
                  Join Now
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800" aria-label="Footer">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-8 lg:gap-10 mb-12">
            <div className="col-span-1 md:col-span-3 lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-6 inline-flex" aria-label="SeniorEase Home">
                <div className="bg-teal-500 text-white p-2 rounded-xl">
                  <HeartHandshake size={24} />
                </div>
                <span className="font-bold text-2xl tracking-tight text-white">SeniorEase</span>
              </Link>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                SeniorEase is a Software as a Service (SaaS) monthly subscription platform providing non-medical digital assistance tools and everyday admin support. Platform tools include smartphone learning resources, communication support, secure portal guidance, scam awareness tracking, and a support ticketing system.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white border-b border-gray-800 pb-2">Quick Links</h3>
              <ul className="space-y-4">
                {navLinks.slice(0, 4).map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-gray-300 hover:text-white transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-white border-b border-gray-800 pb-2">Resources</h3>
              <ul className="space-y-4">
                {navLinks.slice(4, 7).map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-gray-300 hover:text-white transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/account" className="text-teal-400 hover:text-teal-300 font-semibold transition-colors text-sm">
                    My Account
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-white border-b border-gray-800 pb-2">Legal</h3>
              <ul className="space-y-4">
                <li>
                  <Link to="/safeguarding" className="text-amber-400 hover:text-amber-300 font-bold transition-colors text-sm flex items-center gap-1">
                    <span>🛡️ Protecting Vulnerable Adults</span>
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-300 hover:text-white transition-colors text-sm">Terms & Conditions</Link>
                </li>
                <li>
                  <Link to="/sla" className="text-gray-300 hover:text-white transition-colors text-sm">Service Level Agreement</Link>
                </li>
                <li>
                  <Link to="/disclaimer" className="text-gray-300 hover:text-white transition-colors text-sm">Disclaimer</Link>
                </li>
                <li>
                  <Link to="/nhs-standards" className="text-gray-300 hover:text-white transition-colors text-sm">Our Commitment</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-white border-b border-gray-800 pb-2">Policies</h3>
              <ul className="space-y-4">
                <li>
                  <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/gdpr" className="text-gray-300 hover:text-white transition-colors text-sm">GDPR Compliance</Link>
                </li>
                <li>
                  <Link to="/refund" className="text-gray-300 hover:text-white transition-colors text-sm">Refund / Cancellation</Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2 lg:col-span-1">
              <h3 className="text-lg font-semibold mb-6 text-white border-b border-gray-800 pb-2">Contact</h3>
              <div className="space-y-4 text-gray-300 text-sm">
                <p className="flex flex-col gap-0.5">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Address</span>
                  <span className="leading-relaxed text-gray-300">
                    167-169 Great Portland Street<br />
                    5th Floor<br />
                    London, W1W 5PF
                  </span>
                </p>
                <p className="flex flex-col gap-0.5">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Phone</span>
                  <a href="tel:+443304010019" className="hover:text-white text-gray-200 transition-colors">+44 (0) 330 401 0019</a>
                </p>
                <p className="flex flex-col gap-0.5">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Email</span>
                  <a href="mailto:support@senioreease.com" className="hover:text-white text-gray-200 transition-colors break-all">support@senioreease.com</a>
                </p>
              </div>
            </div>
          </div>
          
          <div className="py-6 border-t border-gray-800 text-center">
            <p className="text-xs md:text-sm font-semibold text-teal-400 tracking-wide">
              Secure payments • SSL encrypted • UK-based support • GDPR compliant
            </p>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center md:text-left text-gray-300 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p>&copy; {new Date().getFullYear()} Silverbridge Technologies Ltd. Trading as SeniorEase. All rights reserved.</p>
              <p className="text-xs text-gray-400 mt-1.5 max-w-xl leading-relaxed">
                <strong className="text-teal-400">Important Notice:</strong> SeniorEase (senioreease.com) is a digital technology education and technical support service for older adults. We are an independent UK technology support platform and are <span className="underline decoration-teal-500">not affiliated</span> with any senior living, residential care homes, or property discovery platforms.
              </p>
            </div>
            <div className="max-w-2xl text-xs text-gray-400 text-center md:text-right space-y-2">
              <p>Monthly SaaS plans renew automatically until cancelled. Please review our legal and software billing policies before subscribing.</p>
            </div>
          </div>
        </div>
      </footer>
      {/* Join Modal */}
      <JoinModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
      
      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}

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

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-gray-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-teal-600 text-white p-2 rounded-xl group-hover:bg-teal-700 transition-colors">
                  <HeartHandshake size={28} />
                </div>
                <div>
                  <span className="font-bold text-2xl tracking-tight text-gray-900 block leading-none">SeniorEase</span>
                  <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">SaaS Platform</span>
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
      <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-8 lg:gap-10 mb-12">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-6 inline-flex">
                <div className="bg-teal-500 text-white p-2 rounded-xl">
                  <HeartHandshake size={24} />
                </div>
                <span className="font-bold text-2xl tracking-tight text-white">SeniorEase</span>
              </Link>
              <p className="text-gray-400 text-lg mb-6 max-w-md leading-relaxed">
                Senior Ease provides a software platform with friendly digital support tracking and everyday technology tools for senior citizens in the UK.
              </p>
              <p className="text-gray-500 text-sm max-w-md">
                SeniorEase is a Software as a Service (SaaS) monthly subscription platform providing non-medical digital assistance tools and everyday admin support. Platform tools include smartphone help resources, communication support, secure portal guidance, scam awareness tracking, and a support ticketing system.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-4">
                {navLinks.slice(0, 4).map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-white opacity-0 hidden md:block">More Links</h3>
              <ul className="space-y-4">
                {navLinks.slice(4, 7).map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/account" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
                    My Account
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Legal</h3>
              <ul className="space-y-4">
                <li>
                  <a href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms & Conditions</a>
                </li>
                <li>
                  <a href="/sla" className="text-gray-300 hover:text-white transition-colors">Service Level Agreement</a>
                </li>
                <li>
                  <a href="/disclaimer" className="text-gray-300 hover:text-white transition-colors">Disclaimer</a>
                </li>
                <li>
                  <Link to="/nhs-standards" className="text-gray-300 hover:text-white transition-colors">NHS Standards</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Policies</h3>
              <ul className="space-y-4">
                <li>
                  <a href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <Link to="/gdpr" className="text-gray-300 hover:text-white transition-colors">GDPR Compliance</Link>
                </li>
                <li>
                  <a href="/refund" className="text-gray-300 hover:text-white transition-colors">Refund / Cancellation</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Contact</h3>
              <div className="space-y-3 text-gray-400">
                <p className="flex flex-col">
                  <span className="text-gray-500 text-sm">Email</span>
                  <a href="mailto:support@senioreaseuk.co.uk" className="hover:text-white transition-colors">support@senioreaseuk.co.uk</a>
                </p>
                <p className="flex flex-col">
                  <span className="text-gray-500 text-sm">Phone</span>
                  <span>+44 XXXX XXXXXX</span>
                </p>
                <p className="flex flex-col">
                  <span className="text-gray-500 text-sm">WhatsApp</span>
                  <span>Available to members</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center md:text-left text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} SeniorEase. All rights reserved.</p>
            <div className="max-w-2xl text-xs text-gray-400 text-center md:text-right space-y-2">
              <p>Monthly SaaS plans renew automatically until cancelled. Please review our legal and software billing policies before subscribing.</p>
              <p>Senior Ease provides a software platform with friendly digital support tracking and everyday technology tools for senior citizens in the UK.</p>
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

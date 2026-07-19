/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import HowItWorks from './pages/HowItWorks';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';
import SLA from './pages/SLA';
import Disclaimer from './pages/Disclaimer';
import MyAccount from './pages/MyAccount';
import GDPR from './pages/GDPR';
import NHSStandards from './pages/NHSStandards';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import MobileAppGuide from './pages/MobileAppGuide';

// Import hero images for background preloading
import heroImage from './assets/images/senior_tech_support_1784443978651.jpg';
import aboutHeroImage from './assets/images/seniors_learning_tablets_group_1784445191695.jpg';
import servicesHeroImage from './assets/images/seniors_laptop_group_learning_1784446651691.jpg';
import howItWorksHeroImage from './assets/images/seniors_how_it_works_hero_1784446891606.jpg';
import faqHeroImage from './assets/images/seniors_faq_hero_1784446901963.jpg';
import pricingHeroImage from './assets/images/seniors_pricing_hero_1784446914914.jpg';
import contactHeroImage from './assets/images/seniors_contact_hero_1784446926253.jpg';
import featureImage from './assets/images/senior_couple_computer_learning_1784446449833.jpg';

export default function App() {
  useEffect(() => {
    const imagesToPreload = [
      heroImage,
      aboutHeroImage,
      servicesHeroImage,
      howItWorksHeroImage,
      faqHeroImage,
      pricingHeroImage,
      contactHeroImage,
      featureImage
    ];

    // Wait 1.5s after the initial mount, then preload one image every 300ms to avoid network congestion
    const mainTimer = setTimeout(() => {
      imagesToPreload.forEach((src, index) => {
        setTimeout(() => {
          const img = new Image();
          img.src = src;
        }, index * 300);
      });
    }, 1500);

    return () => clearTimeout(mainTimer);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="refund" element={<Refund />} />
          <Route path="sla" element={<SLA />} />
          <Route path="disclaimer" element={<Disclaimer />} />
          <Route path="account" element={<MyAccount />} />
          <Route path="gdpr" element={<GDPR />} />
          <Route path="nhs-standards" element={<NHSStandards />} />
          <Route path="mobile-app" element={<MobileAppGuide />} />
        </Route>
      </Routes>
    </Router>
  );
}

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.resolve(__dirname, "dist");
const indexPath = path.resolve(distPath, "index.html");

if (!fs.existsSync(indexPath)) {
  console.error("❌ No index.html found at " + indexPath + ". Please build first!");
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexPath, "utf8");

// Common Header Navigation for pre-rendered pages
const getHeader = (active) => `
  <header style="padding: 20px; background: #0d9488; color: white; border-bottom: 4px solid #0f766e; font-family: system-ui, -apple-system, sans-serif;">
    <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
      <strong style="font-size: 1.5rem; letter-spacing: -0.05em; font-weight: bold;">SeniorEase</strong>
      <nav style="display: flex; gap: 15px; flex-wrap: wrap;">
        <a href="/" style="color: white; font-weight: 500; text-decoration: ${active === "home" ? "underline" : "none"};">Home</a>
        <a href="/about" style="color: white; font-weight: 500; text-decoration: ${active === "about" ? "underline" : "none"};">About Us</a>
        <a href="/services" style="color: white; font-weight: 500; text-decoration: ${active === "services" ? "underline" : "none"};">Our Services</a>
        <a href="/how-it-works" style="color: white; font-weight: 500; text-decoration: ${active === "how-it-works" ? "underline" : "none"};">How It Works</a>
        <a href="/pricing" style="color: white; font-weight: 500; text-decoration: ${active === "pricing" ? "underline" : "none"};">Pricing Plans</a>
        <a href="/faq" style="color: white; font-weight: 500; text-decoration: ${active === "faq" ? "underline" : "none"};">FAQ</a>
        <a href="/contact" style="color: white; font-weight: 500; text-decoration: ${active === "contact" ? "underline" : "none"};">Contact Support</a>
      </nav>
    </div>
  </header>
`;

// Common Footer for pre-rendered pages
const footerHTML = `
  <footer style="background: #0f172a; color: #94a3b8; padding: 40px 20px; border-top: 1px solid #1e293b; font-family: system-ui, -apple-system, sans-serif; text-align: center; font-size: 0.9rem; margin-top: 60px;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <p>&copy; 2026 SeniorEase. All rights reserved.</p>
      <p style="margin-top: 10px; font-size: 0.8rem; color: #64748b; max-width: 750px; margin-left: auto; margin-right: auto; line-height: 1.5;">
        <strong style="color: #2dd4bf;">Important Notice:</strong> SeniorEase (senioreease.com) is a digital technology learning and support SaaS service for older adults. We are an independent UK technology support platform and are <span style="text-decoration: underline; color: #99f6e4;">not affiliated</span> with any senior living, residential care homes, or property discovery platforms.
      </p>
      <p style="margin-top: 15px; display: flex; justify-content: center; flex-wrap: wrap; gap: 15px;">
        <a href="/terms" style="color: #0d9488; text-decoration: none;">Terms & Conditions</a>
        <a href="/privacy" style="color: #0d9488; text-decoration: none;">Privacy Policy</a>
        <a href="/refund" style="color: #0d9488; text-decoration: none;">Refund / Cancellation Policy</a>
        <a href="/sla" style="color: #0d9488; text-decoration: none;">SLA Agreement</a>
        <a href="/disclaimer" style="color: #0d9488; text-decoration: none;">Disclaimer</a>
        <a href="/gdpr" style="color: #0d9488; text-decoration: none;">GDPR Compliance</a>
        <a href="/nhs-standards" style="color: #0d9488; text-decoration: none;">NHS Standards</a>
      </p>
    </div>
  </footer>
`;

// Define routes and their content
const routes = [
  {
    path: "/",
    title: "SeniorEase - Easy Digital Learning & Support for Seniors in the UK",
    description: "SeniorEase is a Software as a Service (SaaS) platform that assists older adults with everyday technology — combining intuitive secure software with friendly digital confidence support. Get smartphone, tablet, and online support today.",
    staticHTML: `
      <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
        ${getHeader("home")}
        <main style="max-width: 1000px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
          <div style="text-align: center; margin-bottom: 50px;">
            <span style="color: #0d9488; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.9rem; display: inline-block; padding: 5px 15px; background: #e0f2fe; border-radius: 9999px;">Friendly UK-Based Assistance</span>
            <h1 style="font-size: 3rem; font-weight: 800; margin-top: 15px; color: #0f172a; tracking: -0.02em;">Digital Education & Gentle Tech Support for Seniors</h1>
            <p style="font-size: 1.25rem; color: #475569; max-width: 750px; margin: 20px auto; line-height: 1.6;">SeniorEase is a Software as a Service (SaaS) platform that assists older adults with everyday technology — combining intuitive secure software with friendly digital confidence support.</p>
            <div style="margin: 30px 0;">
              <a href="/pricing" style="background: #0d9488; color: white; padding: 14px 28px; text-decoration: none; border-radius: 9999px; font-weight: bold; margin-right: 15px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(13, 148, 136, 0.2);">View Pricing Plans</a>
              <a href="/contact" style="background: #e2e8f0; color: #1e293b; padding: 14px 28px; text-decoration: none; border-radius: 9999px; font-weight: bold; display: inline-block;">Book Free Intro Call</a>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; margin-top: 50px;">
            <div style="background: white; padding: 30px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
              <h3 style="color: #0d9488; margin-top: 0; font-size: 1.3rem;">Gentle Device Tutoring</h3>
              <p style="color: #475569; margin-bottom: 0;">Learn how to send photos, chat on WhatsApp, read emails, and call your family using Zoom or FaceTime safely.</p>
            </div>
            <div style="background: white; padding: 30px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
              <h3 style="color: #0d9488; margin-top: 0; font-size: 1.3rem;">Scam Protection Training</h3>
              <p style="color: #475569; margin-bottom: 0;">Learn to detect suspicious messages, verify links, block automated calls, and protect your digital privacy.</p>
            </div>
            <div style="background: white; padding: 30px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
              <h3 style="color: #0d9488; margin-top: 0; font-size: 1.3rem;">Family Notifications</h3>
              <p style="color: #475569; margin-bottom: 0;">We keep families updated on the training logs and learning progress of their loved ones for extra reassurance.</p>
            </div>
          </div>
        </main>
        ${footerHTML}
      </div>
    `
  },
  {
    path: "/pricing",
    title: "Simple Pricing Plans | SeniorEase - Digital Support & Education",
    description: "Explore simple and clear monthly pricing plans for SeniorEase digital education and technical support. Choose from Essential Care (£9.99/mo), Plus Care (£17.99/mo), or Family Care (£29.99/mo) support tiers.",
    staticHTML: `
      <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
        ${getHeader("pricing")}
        <main style="max-width: 1000px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
          <div style="text-align: center; margin-bottom: 40px;">
            <span style="color: #0d9488; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.9rem;">Simple Subscriptions</span>
            <h1 style="font-size: 2.8rem; font-weight: 800; margin-top: 10px; color: #0f172a; tracking: -0.02em;">Affordable Tech Support Plans for Seniors</h1>
            <p style="font-size: 1.25rem; color: #475569; max-width: 650px; margin: 20px auto; line-height: 1.6;">Our simple subscription packages are tailored for seniors and their families. Transparent, cancel-anytime, with zero hidden fees.</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; margin-top: 30px;">
            <!-- Essential Care -->
            <div style="border: 2px solid #e2e8f0; border-radius: 16px; padding: 30px; background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
              <h3 style="font-size: 1.5rem; color: #1e293b; margin: 0; font-weight: bold;">Essential Care</h3>
              <p style="color: #64748b; margin-top: 5px;">Basic software platform access for occasional learning.</p>
              <div style="margin: 20px 0;">
                <span style="font-size: 2.5rem; font-weight: bold; color: #0d9488;">£9.99</span>
                <span style="color: #64748b;"> / month</span>
              </div>
              <ul style="padding-left: 20px; color: #475569; line-height: 1.8;">
                <li>Up to 2 support requests per month</li>
                <li>Help with smartphones, tablets, or laptops</li>
                <li>Support via Phone, WhatsApp, or Email</li>
                <li>Centralized SeniorEase user dashboard</li>
                <li>Comprehensive digital learning library</li>
              </ul>
              <a href="/pricing" style="display: block; text-align: center; background: #0d9488; color: white; padding: 12px; border-radius: 8px; font-weight: bold; text-decoration: none; margin-top: 30px;">Get Started</a>
            </div>

            <!-- Plus Care -->
            <div style="border: 2px solid #0d9488; border-radius: 16px; padding: 30px; background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); position: relative;">
              <span style="position: absolute; top: -15px; right: 20px; background: #0d9488; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 0.8rem; font-weight: bold;">Most Popular</span>
              <h3 style="font-size: 1.5rem; color: #1e293b; margin: 0; font-weight: bold;">Plus Care</h3>
              <p style="color: #64748b; margin-top: 5px;">Full portal access for seniors who need more regular support.</p>
              <div style="margin: 20px 0;">
                <span style="font-size: 2.5rem; font-weight: bold; color: #0d9488;">£17.99</span>
                <span style="color: #64748b;"> / month</span>
              </div>
              <ul style="padding-left: 20px; color: #475569; line-height: 1.8;">
                <li>Up to 5 support requests per month</li>
                <li>1 Scheduled 1-on-1 support/learning call</li>
                <li>Priority queue handling</li>
                <li>Comprehensive help with all devices</li>
                <li>Family notification options</li>
              </ul>
              <a href="/pricing" style="display: block; text-align: center; background: #0d9488; color: white; padding: 12px; border-radius: 8px; font-weight: bold; text-decoration: none; margin-top: 30px;">Get Started</a>
            </div>

            <!-- Family Care -->
            <div style="border: 2px solid #e2e8f0; border-radius: 16px; padding: 30px; background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
              <h3 style="font-size: 1.5rem; color: #1e293b; margin: 0; font-weight: bold;">Family Care</h3>
              <p style="color: #64748b; margin-top: 5px;">Multi-user software access designed for families to support a loved one.</p>
              <div style="margin: 20px 0;">
                <span style="font-size: 2.5rem; font-weight: bold; color: #0d9488;">£29.99</span>
                <span style="color: #64748b;"> / month</span>
              </div>
              <ul style="padding-left: 20px; color: #475569; line-height: 1.8;">
                <li>Priority handling & dedicated support team</li>
                <li>Monthly check-in call with your loved one</li>
                <li>Assistance setting up video call systems</li>
                <li>Email/WhatsApp progress updates for family</li>
                <li>Unlimited learning portal access</li>
              </ul>
              <a href="/pricing" style="display: block; text-align: center; background: #0d9488; color: white; padding: 12px; border-radius: 8px; font-weight: bold; text-decoration: none; margin-top: 30px;">Get Started</a>
            </div>
          </div>

          <div style="margin-top: 50px; background: #f8fafc; padding: 30px; border-radius: 16px; border: 1px solid #e2e8f0;">
            <h2 style="font-size: 1.8rem; font-weight: bold; color: #0f172a; text-align: center; margin-bottom: 20px;">Payment Methods & Options</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
              <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <h3 style="color: #0f172a; font-size: 1.2rem; margin: 0 0 10px 0;">Pay by Direct Debit (GoCardless)</h3>
                <ul style="color: #475569; padding-left: 20px; line-height: 1.6;">
                  <li>Payments collected securely through GoCardless</li>
                  <li>Protected by the Direct Debit Guarantee</li>
                  <li>Advance notice before collections</li>
                  <li>Easy cancellation process</li>
                </ul>
              </div>
              <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <h3 style="color: #0f172a; font-size: 1.2rem; margin: 0 0 10px 0;">Pay by Card (Stripe)</h3>
                <ul style="color: #475569; padding-left: 20px; line-height: 1.6;">
                  <li>Secure payments powered by Stripe</li>
                  <li>Supports all major debit and credit cards</li>
                  <li>256-bit bank-grade SSL encryption</li>
                  <li>Instant automated payment receipts</li>
                </ul>
              </div>
            </div>
            <div style="background: #0f172a; color: white; padding: 20px; border-radius: 12px; margin-top: 20px;">
              <p style="margin: 0; font-size: 0.95rem; line-height: 1.6;"><strong>Note: Invoices & Payment Links:</strong> We will send the invoice along with the payment link directly to your registered email address, and you can make the payment as per your desire using your preferred payment method.</p>
            </div>
          </div>
        </main>
        ${footerHTML}
      </div>
    `
  },
  {
    path: "/about",
    title: "About Us | SeniorEase - Empowering Senior Digital Confidence",
    description: "Learn about SeniorEase's mission to make technology less stressful and more accessible for older adults in the UK. Discover our story and values.",
    staticHTML: `
      <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
        ${getHeader("about")}
        <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
          <span style="color: #0d9488; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.9rem;">Our Mission & Vision</span>
          <h1 style="font-size: 2.8rem; font-weight: 800; margin-top: 10px; color: #0f172a;">About SeniorEase</h1>
          <p style="font-size: 1.25rem; color: #475569; line-height: 1.6; font-weight: bold; margin-bottom: 30px;">Helping senior citizens feel more confident, comfortable, and supported in today’s fast-paced digital world.</p>
          
          <h2 style="font-size: 1.8rem; font-weight: 700; color: #0f172a; margin-top: 30px;">Why We Started</h2>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
            <p style="color: #166534; font-size: 1.15rem; font-weight: bold; margin-top: 0;">SeniorEase was founded with one simple goal: to help older adults feel confident using everyday technology.</p>
            <p style="color: #15803d; margin-bottom: 0;">We believe no one should feel excluded from digital life because technology feels confusing or intimidating. Our mission is to provide friendly, patient, and reliable digital support that empowers seniors to stay connected, independent, and secure.</p>
          </div>

          <h2 style="font-size: 1.8rem; font-weight: 700; color: #0f172a; margin-top: 30px;">Technology Shouldn’t Feel Overwhelming</h2>
          <p style="color: #475569;">SeniorEase was created to provide a Software as a Service (SaaS) platform that makes everyday technology feel less overwhelming for older adults and their families. As more parts of life move online, many senior citizens are left feeling confused, frustrated, or unsupported when it comes to using phones, apps, emails, online forms, and digital communication tools. SeniorEase exists to provide secure tools, a centralized dashboard, and practical learning that makes everyday digital life easier to manage.</p>
          <p style="color: #475569;">At SeniorEase, we created a comprehensive SaaS platform and support subscription to help make everyday technology easier, calmer, and less intimidating. We provide the software tools and the patient, friendly voice on the end of the phone when things go wrong.</p>
          
          <h3 style="font-size: 1.4rem; font-weight: 700; color: #0f172a; margin-top: 30px;">Our Core Values</h3>
          <p style="color: #475569;">Everything we build, teach, and communicate at SeniorEase is guided by six fundamental principles:</p>
          <ul style="line-height: 2; color: #475569; padding-left: 20px;">
            <li><strong>Compassion:</strong> We lead with empathy, understanding the emotional hurdles that can accompany learning new technology.</li>
            <li><strong>Patience:</strong> We never rush, never judge, and always move at a calm, unrushed pace that suits you.</li>
            <li><strong>Simplicity:</strong> We strip away confusing tech jargon and explain everyday digital tasks in clear, plain English.</li>
            <li><strong>Security:</strong> We prioritize your digital safety, helping you identify scams and keep personal accounts protected.</li>
            <li><strong>Respect:</strong> We treat every older adult with the warmth, patience, and dignity they truly deserve.</li>
            <li><strong>Reliability:</strong> You and your family can always depend on us for consistent, trustworthy UK-based support.</li>
          </ul>

          <h2 style="font-size: 1.8rem; font-weight: 700; color: #0f172a; margin-top: 40px;">Why Customers Trust Us</h2>
          <ul style="line-height: 2; color: #475569; padding-left: 20px;">
            <li><strong>UK-based support:</strong> Friendly, dedicated support team located in the UK with calm, patient instruction.</li>
            <li><strong>Secure payments:</strong> All transactions are protected with bank-grade encryption and verified processors.</li>
            <li><strong>Cancel anytime:</strong> Never locked into long-term contracts; cancel anytime with ease.</li>
            <li><strong>Transparent pricing:</strong> Straightforward membership tiers with clear pricing and no guesswork.</li>
            <li><strong>No hidden fees:</strong> No surprise call-out charges or setup costs—just one predictable monthly fee.</li>
            <li><strong>Privacy-first approach:</strong> Strictly adhering to UK GDPR regulations and never selling data to third parties.</li>
          </ul>
        </main>
        ${footerHTML}
      </div>
    `
  },
  {
    path: "/services",
    title: "Our Services | SeniorEase - Digital Support Platform",
    description: "SeniorEase provides simple digital learning, smartphone and tablet guidance, scam awareness, online account setups, and patient technology assistance tailored for UK seniors.",
    staticHTML: `
      <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
        ${getHeader("services")}
        <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
          <span style="color: #0d9488; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.9rem;">Gentle Technology Support</span>
          <h1 style="font-size: 2.8rem; font-weight: 800; margin-top: 10px; color: #0f172a;">Our Support Services</h1>
          <p style="font-size: 1.25rem; color: #475569; margin-bottom: 30px;">Simple training, patient troubleshooting, and friendly guidance for smartphones, tablets, banking, and online safety.</p>
          
          <h2 style="font-size: 1.8rem; font-weight: 700; color: #0f172a; margin-top: 30px;">Who Can Benefit?</h2>
          <ul style="line-height: 2; color: #475569; padding-left: 20px; font-size: 1.1rem;">
            <li><strong>Older adults learning new technology:</strong> Build confidence with smartphones, tablets, or computers at a calm, comfortable pace.</li>
            <li><strong>Family members supporting loved ones:</strong> Ensure your parents or grandparents have dependable, friendly, UK-based technical support.</li>
            <li><strong>People new to smartphones:</strong> Clear, jargon-free guidance on everyday touch-screen apps and phone settings.</li>
            <li><strong>Users needing ongoing digital guidance:</strong> Regular check-ins, continuous learning, and a reliable helping hand for day-to-day questions.</li>
            <li><strong>Seniors wanting to stay safe from scams:</strong> Learn to recognize fake emails, fraudulent text messages, and phishing attempts.</li>
            <li><strong>Anyone seeking patient, jargon-free support:</strong> Real human conversations and respectful step-by-step explanations without automated menus.</li>
          </ul>

          <h2 style="font-size: 1.8rem; font-weight: 700; color: #0f172a; margin-top: 40px;">Services We Offer</h2>
          <ul style="line-height: 2; color: #475569; padding-left: 20px; font-size: 1.1rem;">
            <li><strong>Smartphone & Tablet Help:</strong> Learn apps, send photos on WhatsApp, and video call family.</li>
            <li><strong>Safe Online Accounts:</strong> Access online banking safely, manage energy/water utilities, and pay securely.</li>
            <li><strong>Anti-Scam Awareness:</strong> Identify fraudulent messages, fake links, and dangerous phishing scams.</li>
            <li><strong>Digital Confidence Training:</strong> Empowering seniors to navigate modern web interfaces with absolute peace of mind.</li>
          </ul>

          <h2 style="font-size: 1.8rem; font-weight: 700; color: #0f172a; margin-top: 40px;">Why customers choose SeniorEase</h2>
          <ul style="line-height: 2; color: #475569; padding-left: 20px; font-size: 1.1rem;">
            <li><strong>Secure customer portal:</strong> Access your centralized dashboard with bank-grade encryption to log support requests and track learning.</li>
            <li><strong>Transparent monthly billing:</strong> Straightforward, predictable pricing with zero surprises, no hidden call-out fees, or setup extras.</li>
            <li><strong>Dedicated UK support:</strong> Friendly, patient support team based in the UK explaining things clearly without technical jargon.</li>
            <li><strong>Non-medical digital assistance:</strong> Exclusively practical technology education and software support without overstepping into medical care.</li>
            <li><strong>Cancel anytime:</strong> Zero long-term contracts or lock-in periods; upgrade, downgrade, or cancel your plan at any time with total ease.</li>
            <li><strong>Privacy-focused service:</strong> Treating personal data and family communications with respect and strictly adhering to UK GDPR standards.</li>
          </ul>
        </main>
        ${footerHTML}
      </div>
    `
  },
  {
    path: "/how-it-works",
    title: "How It Works | SeniorEase - Easy Support Steps",
    description: "Discover our easy 3-step setup to get digital support and learning with SeniorEase. No complex procedures, simple clear guidance.",
    staticHTML: `
      <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
        ${getHeader("how-it-works")}
        <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
          <span style="color: #0d9488; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.9rem;">Simple Setup</span>
          <h1 style="font-size: 2.8rem; font-weight: 800; margin-top: 10px; color: #0f172a;">How SeniorEase Works</h1>
          <p style="font-size: 1.25rem; color: #475569; margin-bottom: 30px;">We have designed our support process to be as straightforward and friendly as possible. Here is how we get you set up with stress-free technology support.</p>
          
          <div style="margin-top: 30px; display: flex; flex-direction: column; gap: 30px;">
            <div style="background: white; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <h3 style="color: #0d9488; margin-top: 0; font-size: 1.4rem; font-weight: bold;">Step 1: Free Introductory Call</h3>
              <p style="color: #475569; margin-bottom: 0;">We speak with you or a family member to understand what devices you use and where you need help. No pressure, just a friendly chat.</p>
            </div>
            <div style="background: white; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <h3 style="color: #0d9488; margin-top: 0; font-size: 1.4rem; font-weight: bold;">Step 2: Choose Your Support Plan</h3>
              <p style="color: #475569; margin-bottom: 0;">Select a monthly support plan that matches your needs. No contracts, cancel anytime with a single click or email.</p>
            </div>
            <div style="background: white; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <h3 style="color: #0d9488; margin-top: 0; font-size: 1.4rem; font-weight: bold;">Step 3: Access Dedicated Digital Care</h3>
              <p style="color: #475569; margin-bottom: 0;">Get in touch via phone, WhatsApp, or email whenever you have a technical question or need assistance. Our UK-based helpdesk handles everything patiently.</p>
            </div>
          </div>
        </main>
        ${footerHTML}
      </div>
    `
  },
  {
    path: "/faq",
    title: "Frequently Asked Questions | SeniorEase",
    description: "Find clear answers to common questions about SeniorEase tech support, billing, device coverage, cancellations, and security training.",
    staticHTML: `
      <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
        ${getHeader("faq")}
        <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
          <span style="color: #0d9488; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.9rem;">Help Center</span>
          <h1 style="font-size: 2.8rem; font-weight: 800; margin-top: 10px; color: #0f172a;">Frequently Asked Questions</h1>
          <p style="font-size: 1.25rem; color: #475569; margin-bottom: 30px;">Find clear, jargon-free answers to common questions about SeniorEase services, devices, and billing.</p>
          
          <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 30px;">
            <div style="background: white; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0;">
              <h3 style="color: #0d9488; margin-top: 0; font-weight: bold;">What devices do you support?</h3>
              <p style="color: #475569; margin-bottom: 0;">We support all common personal devices including iPhones, Android smartphones, iPads, Android tablets, Windows laptops/computers, MacBooks, and smart home assistance speakers.</p>
            </div>
            <div style="background: white; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0;">
              <h3 style="color: #0d9488; margin-top: 0; font-weight: bold;">How does billing work?</h3>
              <p style="color: #475569; margin-bottom: 0;">Subscriptions are processed securely via Stripe or GoCardless Direct Debit. Payments are billed automatically on a rolling monthly basis on the date you subscribe. There are absolutely no contracts or hidden fees.</p>
            </div>
            <div style="background: white; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0;">
              <h3 style="color: #0d9488; margin-top: 0; font-weight: bold;">Can I cancel or change plans?</h3>
              <p style="color: #475569; margin-bottom: 0;">Yes, absolutely! You can cancel, upgrade, or downgrade your subscription at any time. Simply sign into your dashboard, click "Cancel Subscription", or email support@senioreease.com and we will take care of it immediately.</p>
            </div>
            <div style="background: white; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0;">
              <h3 style="color: #0d9488; margin-top: 0; font-weight: bold;">Who is this service designed for?</h3>
              <p style="color: #475569; margin-bottom: 0;">It's designed for senior citizens who want to become confident online and families who want reassurance that their older loved ones have expert, safe, friendly tech support always ready to help.</p>
            </div>

            <h2 style="font-size: 1.8rem; font-weight: bold; color: #0f172a; margin-top: 30px; margin-bottom: 10px;">Direct Debit & Payment FAQs</h2>
            <div style="background: #0f172a; color: white; padding: 25px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 10px;">
              <h3 style="color: #2dd4bf; margin-top: 0; font-weight: bold;">Protected by the UK Direct Debit Guarantee</h3>
              <p style="color: #94a3b8; margin-bottom: 0; line-height: 1.6;">All Direct Debit collections are processed securely by GoCardless and are fully protected by the UK Consumer Direct Debit Guarantee. You receive advance notice prior to any collection, and you are entitled to an immediate refund from your bank in the unlikely event of any error.</p>
            </div>
            <div style="background: white; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0;">
              <h3 style="color: #0d9488; margin-top: 0; font-weight: bold;">When will payment be collected?</h3>
              <p style="color: #475569; margin-bottom: 0;">When you set up a Direct Debit mandate with SeniorEase through our secure partner GoCardless, your first monthly payment is typically collected within 3 to 5 working days after mandate confirmation. Subsequent monthly payments are automatically collected on or around the same date each month. You will always receive an automated email confirmation prior to any funds being debited from your bank account.</p>
            </div>
            <div style="background: white; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0;">
              <h3 style="color: #0d9488; margin-top: 0; font-weight: bold;">How do I cancel my subscription and Direct Debit?</h3>
              <p style="color: #475569; margin-bottom: 0;">Cancelling your subscription is simple, transparent, and hassle-free. You can cancel at any time through your SeniorEase online account dashboard or by emailing our customer support team at support@senioreease.com. When your subscription is cancelled, we immediately cancel your GoCardless Direct Debit mandate so no further automated billing occurs. Furthermore, you retain the absolute right under UK banking rules to cancel the Direct Debit instruction directly with your bank or building society at any time.</p>
            </div>
            <div style="background: white; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0;">
              <h3 style="color: #0d9488; margin-top: 0; font-weight: bold;">Will I receive advance notice before collections?</h3>
              <p style="color: #475569; margin-bottom: 0;">Yes, absolutely! In strict accordance with the UK Direct Debit Guarantee and GoCardless banking protocols, you will always receive advance notification by email (typically 3 working days prior) before any payment is collected from your bank account. This advance notice clearly states the collection amount, due date, and mandate reference number, ensuring total financial clarity and peace of mind.</p>
            </div>
            <div style="background: white; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0;">
              <h3 style="color: #0d9488; margin-top: 0; font-weight: bold;">What is the Direct Debit Guarantee?</h3>
              <p style="color: #475569; margin-bottom: 0;">The Direct Debit Guarantee is offered by all UK banks and building societies that accept instructions to pay Direct Debits. It protects you against incorrect payments: if an error is made in the payment of your Direct Debit by SeniorEase, GoCardless, or your bank, you are entitled to a full and immediate refund of the amount paid from your bank or building society. Additionally, if you receive a refund you are not entitled to, you must pay it back when requested.</p>
            </div>
            <div style="background: white; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0;">
              <h3 style="color: #0d9488; margin-top: 0; font-weight: bold;">Can I change my bank details or payment method later?</h3>
              <p style="color: #475569; margin-bottom: 0;">Yes! If you change your bank account or wish to switch your payment method (for example, moving from debit card billing via Stripe to Direct Debit via GoCardless, or vice versa), simply log into your SeniorEase dashboard and visit the 'Billing & Payment Methods' section. From there, you can securely update your bank details or set up a new mandate without any interruption to your tech support coverage. Our team is also happy to assist you over the phone or by email if needed.</p>
            </div>
          </div>
        </main>
        ${footerHTML}
      </div>
    `
  },
  {
    path: "/contact",
    title: "Contact Support | SeniorEase - Here to Assist You",
    description: "Get in touch with the SeniorEase support team. Phone us on +44 330 401 0019, email support@senioreease.com, or book an introductory call.",
    staticHTML: `
      <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
        ${getHeader("contact")}
        <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
          <span style="color: #0d9488; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.9rem;">Contact Us</span>
          <h1 style="font-size: 2.8rem; font-weight: 800; margin-top: 10px; color: #0f172a;">Contact SeniorEase</h1>
          <p style="font-size: 1.25rem; color: #475569; margin-bottom: 30px;">Speak with our UK-based team of patient support advisors. We're here to help.</p>
          
          <div style="background: white; padding: 35px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <h2 style="font-size: 1.5rem; color: #1e293b; margin-top: 0; margin-bottom: 20px; font-weight: bold;">Contact Information</h2>
            <p style="font-size: 1.1rem; color: #334155; margin-bottom: 15px;"><strong>Telephone Support:</strong> <a href="tel:+443304010019" style="color: #0d9488; text-decoration: none; font-weight: 600;">+44 (0) 330 401 0019</a></p>
            <p style="font-size: 1.1rem; color: #334155; margin-bottom: 15px;"><strong>Email Support:</strong> <a href="mailto:support@senioreease.com" style="color: #0d9488; text-decoration: none; font-weight: 600;">support@senioreease.com</a></p>
            <p style="font-size: 1.1rem; color: #334155; margin-bottom: 15px;"><strong>Business Address:</strong> SeniorEase, 86-90 Paul Street, London, EC2A 4NE, United Kingdom</p>
            <p style="font-size: 1.1rem; color: #334155; margin-bottom: 0;"><strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM GMT</p>
          </div>
        </main>
        ${footerHTML}
      </div>
    `
  },
  {
    path: "/terms",
    title: "Terms & Conditions | SeniorEase",
    description: "Please read these Terms & Conditions carefully before using the SeniorEase website or purchasing subscriptions.",
    staticHTML: `
      <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
        ${getHeader("")}
        <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
          <h1 style="font-size: 2.8rem; font-weight: 800; color: #0f172a;">Terms & Conditions</h1>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 0;"><strong>Effective Date:</strong> 01 June 2026</p>
            <p style="margin: 5px 0 0 0;"><strong>Business Name:</strong> SeniorEase</p>
            <p style="margin: 5px 0 0 0;"><strong>Email:</strong> support@senioreease.com</p>
            <p style="margin: 5px 0 0 0;"><strong>Telephone:</strong> +44 (0) 330 401 0019</p>
          </div>
          <h2>1. Welcome</h2>
          <p>Welcome to SeniorEase.</p>
          <p>These Terms & Conditions govern your access to and use of the SeniorEase website, customer portal, subscription services, and digital technical support services. Please read these Terms carefully before using our website or purchasing any of our services.</p>
          <p>By visiting our website, creating an account, purchasing a subscription, or using our services, you agree to be bound by these Terms & Conditions.</p>
          <h2>2. About SeniorEase</h2>
          <p>SeniorEase is a subscription-based digital education and technical support service designed to help senior citizens become more confident using everyday technology. Our support team provides friendly, patient, and practical guidance to assist customers with smartphones, tablets, computers, and recognizing online scams.</p>
        </main>
        ${footerHTML}
      </div>
    `
  },
  {
    path: "/privacy",
    title: "Privacy Policy | SeniorEase",
    description: "SeniorEase values your privacy. Read our policy on how we gather, protect, and handle your personal data.",
    staticHTML: `
      <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
        ${getHeader("")}
        <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
          <h1 style="font-size: 2.8rem; font-weight: 800; color: #0f172a;">Privacy Policy</h1>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 0;"><strong>Effective Date:</strong> 01 June 2026</p>
            <p style="margin: 5px 0 0 0;"><strong>Business Name:</strong> SeniorEase</p>
            <p style="margin: 5px 0 0 0;"><strong>Email:</strong> privacy@senioreease.com</p>
          </div>
          <h2>Our Commitment to Your Privacy</h2>
          <p>SeniorEase is committed to protecting your privacy and security. This Privacy Policy explains how we collect, use, store, and share your personal data when you visit our website, register for an account, purchase a subscription, or receive technical support from us.</p>
          <h2>What Information We Collect</h2>
          <p>We only collect the minimum required information necessary to provide you with secure, reliable tech support. This includes: name, contact information (phone number, email, address), and billing information processed securely via Stripe.</p>
        </main>
        ${footerHTML}
      </div>
    `
  },
  {
    path: "/refund",
    title: "Refund & Cancellation Policy | SeniorEase",
    description: "Learn about our clear refund and subscription cancellation policies. Cancel anytime with ease.",
    staticHTML: `
      <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
        ${getHeader("")}
        <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
          <h1 style="font-size: 2.8rem; font-weight: 800; color: #0f172a;">Refund & Cancellation Policy</h1>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 0;"><strong>Effective Date:</strong> 01 June 2026</p>
            <p style="margin: 5px 0 0 0;"><strong>Business Name:</strong> SeniorEase</p>
            <p style="margin: 5px 0 0 0;"><strong>Email:</strong> support@senioreease.com</p>
          </div>
          <h2>1. Free Introductory Call</h2>
          <p>Our free introductory call carries no charge and no obligation to continue. No refund is applicable as no payment is taken.</p>
          <h2>2. Cancelling a Subscription</h2>
          <ul>
            <li>You may cancel your subscription at any time by emailing support@senioreease.com, calling +44 (0) 330 401 0019, or through your account dashboard (once available).</li>
            <li>Cancellations take effect at the end of the current paid billing period. You will continue to have access to your Services until that date, and no further payments will be taken afterward.</li>
            <li>We do not charge cancellation fees.</li>
          </ul>
          <h2>3. Cooling-Off Period (Right to Cancel)</h2>
          <p>In line with the UK Consumer Contracts Regulations 2013, if you are a consumer purchasing a subscription remotely (e.g. online or by phone), you have the right to cancel within <strong>14 days</strong> of your purchase for a full refund, provided the Service has not been fully delivered within that period with your express consent to begin immediately.</p>
          <ul>
            <li>If you request that support begins immediately within the 14-day window and later cancel, we may deduct a reasonable amount reflecting the sessions or support already provided.</li>
            <li>To exercise this right, contact us at support@senioreease.com within 14 days of purchase.</li>
          </ul>
          <h2>4. Refunds Outside the Cooling-Off Period</h2>
          <p>After the 14-day cooling-off period, subscription fees are generally non-refundable for the current billing period, except in the following cases:</p>
          <ul>
            <li><strong>Service unavailability:</strong> If we are unable to deliver a scheduled session and cannot offer a reasonable rescheduled alternative, the missed session will be refunded or credited.</li>
            <li><strong>Billing error:</strong> If you are charged in error (e.g. duplicate charge, incorrect amount), the error will be corrected and refunded in full within 10 business days of confirmation.</li>
            <li><strong>Exceptional circumstances:</strong> Refund requests due to bereavement, hospitalisation, or a change in the customer's care needs will be considered on a case-by-case basis and handled sensitively.</li>
          </ul>
          <h2>5. How Refunds Are Processed</h2>
          <ul>
            <li>Approved refunds are returned to the original payment method via Stripe.</li>
            <li>Refunds are typically processed within 5–10 business days, though your bank or card issuer may take longer to reflect the refund.</li>
          </ul>
          <h2>6. Family/Third-Party Purchasers</h2>
          <p>Where a subscription is purchased by a family member on behalf of a senior relative, refund and cancellation requests may be made by either the purchaser or the service recipient, provided identity can be reasonably confirmed.</p>
          <h2>7. Disputing a Charge</h2>
          <p>If you believe a charge is incorrect, please contact us first at support@senioreease.com before raising a dispute with your bank or card provider — most issues can be resolved directly and more quickly this way. We aim to acknowledge all billing queries within 2 business days.</p>
          <h2>8. Changes to This Policy</h2>
          <p>We may update this policy from time to time. Any changes will be posted on this page with a revised effective date, and material changes affecting existing subscribers will be communicated by email at least 14 days in advance.</p>
          <div style="background: #fffbeb; border: 1px solid #fde68a; padding: 15px; border-radius: 12px; margin-top: 30px; font-style: italic; color: #92400e; font-size: 0.9rem;">
            [Internal note: confirm final cancellation cut-off timing (billing-period-end vs. immediate) and any minimum-term contract terms with the pricing team before publishing, so this matches the actual plans listed on /pricing.]
          </div>
        </main>
        ${footerHTML}
      </div>
    `
  },
  {
    path: "/sla",
    title: "Service Level Agreement (SLA) | SeniorEase",
    description: "Our commitment to high-quality service, support response times, and platform availability.",
    staticHTML: `
      <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
        ${getHeader("")}
        <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
          <h1 style="font-size: 2.8rem; font-weight: 800; color: #0f172a;">Service Level Agreement (SLA)</h1>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 0;"><strong>Effective Date:</strong> 01 June 2026</p>
            <p style="margin: 5px 0 0 0;"><strong>Business Name:</strong> SeniorEase</p>
          </div>
          <h2>Service Response Commitments</h2>
          <p>At SeniorEase, we commit to high-quality assistance. Support tickets and calls receive prioritized queues based on your subscription tier:</p>
          <ul>
            <li><strong>Family Care & Plus Care:</strong> Under 4 hours response window during office hours.</li>
            <li><strong>Essential Care:</strong> Under 24 hours response window during office hours.</li>
          </ul>
        </main>
        ${footerHTML}
      </div>
    `
  },
  {
    path: "/disclaimer",
    title: "Disclaimer | SeniorEase",
    description: "Important disclosures regarding our technical support services and limits of liability.",
    staticHTML: `
      <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
        ${getHeader("")}
        <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
          <h1 style="font-size: 2.8rem; font-weight: 800; color: #0f172a;">Disclaimer</h1>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 0;"><strong>Effective Date:</strong> 01 June 2026</p>
            <p style="margin: 5px 0 0 0;"><strong>Business Name:</strong> SeniorEase</p>
          </div>
          <h2>Information & Services Disclaimer</h2>
          <p>The information and support services provided by SeniorEase are intended solely for educational and general digital confidence building. While we make every effort to provide accurate, safe, and up-to-date guidance, technology platforms change rapidly. SeniorEase does not guarantee that third-party systems, applications, or devices will always function error-free.</p>
        </main>
        ${footerHTML}
      </div>
    `
  },
  {
    path: "/gdpr",
    title: "GDPR Compliance Statement | SeniorEase",
    description: "Learn about our commitment to General Data Protection Regulation (GDPR) and how we safeguard user privacy in the UK and Europe.",
    staticHTML: `
      <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
        ${getHeader("")}
        <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
          <h1 style="font-size: 2.8rem; font-weight: 800; color: #0f172a;">GDPR Compliance</h1>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 0;"><strong>Effective Date:</strong> 01 June 2026</p>
            <p style="margin: 5px 0 0 0;"><strong>Business Name:</strong> SeniorEase</p>
          </div>
          <h2>GDPR Protection Principles</h2>
          <p>SeniorEase fully adheres to General Data Protection Regulation (GDPR) guidelines to ensure that senior citizen and family member records are handled transparently, securely, and with clear user consent. You have the right to request access to, correction of, or permanent erasure of your personal data at any time.</p>
        </main>
        ${footerHTML}
      </div>
    `
  },
  {
    path: "/nhs-standards",
    title: "NHS Standards Alignment | SeniorEase",
    description: "Our technical systems and support protocols align with NHS Digital service standards for digital health accessibility.",
    staticHTML: `
      <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
        ${getHeader("")}
        <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
          <h1 style="font-size: 2.8rem; font-weight: 800; color: #0f172a;">NHS Standards Alignment</h1>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 0;"><strong>Effective Date:</strong> 01 June 2026</p>
            <p style="margin: 5px 0 0 0;"><strong>Business Name:</strong> SeniorEase</p>
          </div>
          <h2>Digital Accessibility & Safety</h2>
          <p>We build our portal interfaces and support services following NHS Digital Service Manual standards, ensuring high-contrast design, clean font sizes, keyboard accessibility, and safe assistance processes when tutoring seniors on accessing their local GP accounts, NHS app, or online medical services.</p>
        </main>
        ${footerHTML}
      </div>
    `
  }
];

// Run the prerendering
console.log("🚀 Starting Prerendering Script...");

for (const route of routes) {
  let pageHtml = baseHtml;

  // 1. Replace title tag
  pageHtml = pageHtml.replace(
    /<title>.*?<\/title>/gi,
    `<title>${route.title}</title>`
  );

  // 2. Replace description tag if present
  pageHtml = pageHtml.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/gi,
    `<meta name="description" content="${route.description}" />`
  );

  // 3. Replace og:description tag if present
  pageHtml = pageHtml.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/gi,
    `<meta property="og:description" content="${route.description}" />`
  );

  // 4. Inject static content inside <div id="root"></div>
  if (route.staticHTML) {
    // Robust replacement targeting any spacing, quotes, or form of <div id="root">
    pageHtml = pageHtml.replace(
      /<div\s+id=["']?root["']?\s*>\s*<\/div>/gi,
      `<div id="root">${route.staticHTML}</div>`
    );
  }

  if (route.path === "/") {
    // Overwrite dist/index.html
    fs.writeFileSync(indexPath, pageHtml, "utf8");
    console.log(`✅ Prerendered homepage (/) -> dist/index.html`);
  } else {
    // Create folder and write index.html inside it
    const folderPath = path.join(distPath, route.path);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    const routeIndexPath = path.join(folderPath, "index.html");
    fs.writeFileSync(routeIndexPath, pageHtml, "utf8");
    console.log(`✅ Prerendered route (${route.path}) -> dist${route.path}/index.html`);
  }
}

console.log("🎉 Prerendering complete! All public routes successfully written to dist/ as flat static HTML files.");

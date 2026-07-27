import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import Stripe from "stripe";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootPath = process.cwd();

let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      console.warn("STRIPE_SECRET_KEY is missing. Payments will not work.");
    }
    stripeClient = new Stripe(key || "sk_test_mock_key", {
      apiVersion: "2025-01-27.acacia" as any,
    });
  }
  return stripeClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProduction = process.env.NODE_ENV === "production";

  console.log(`[Server] Starting in ${isProduction ? "PRODUCTION" : "DEVELOPMENT"} mode on port ${PORT}`);

  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  app.use(express.json());

  // ── API Routes ────────────────────────────────────────────────────────────
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV, port: PORT });
  });

  app.get("/admin-ping", (req, res) => {
    res.send("✅ Admin server is alive at " + new Date().toISOString());
  });

  app.post("/api/checkout", async (req, res) => {
    try {
      const { planPrice, planName, customerEmail } = req.body;
      const stripe = getStripe();

      if (process.env.STRIPE_SECRET_KEY) {
        const numericPrice = parseFloat(planPrice.replace(/[^0-9.]/g, ""));
        const unitAmount = Math.round(numericPrice * 100);

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          customer_email: customerEmail,
          line_items: [{
            price_data: {
              currency: "gbp",
              product_data: { name: planName },
              unit_amount: unitAmount,
              recurring: { interval: "month" },
            },
            quantity: 1,
          }],
          mode: "subscription",
          success_url: `${req.headers.origin}/account?setup_intent=success`,
          cancel_url: `${req.headers.origin}/pricing?canceled=true`,
        });

        res.json({ status: "success", url: session.url, session_id: session.id });
      } else {
        res.json({
          status: "success",
          message: "Stripe intent simulated (no API key)",
          mock_session_id: "cs_test_mock_123",
        });
      }
    } catch (error: any) {
      console.error("[Stripe Error]", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  });

  // ── Static / SPA Serving ──────────────────────────────────────────────────
  let distPath = "";
  let vite: any = null;

  if (!isProduction) {
    // Dev mode: use Vite middleware with custom appType to intercept HTML requests
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve built files from dist/
    // Try to find the correct dist directory in multiple common locations
    const possiblePaths = [
      path.resolve(process.cwd(), "dist"),
      path.resolve(__dirname, "../dist"),
      path.resolve(__dirname, "dist"),
      path.resolve(__dirname, "../../dist"),
    ];

    distPath = possiblePaths[0];
    console.log(`[Server] Searching for dist folder. Current directory: ${process.cwd()}, __dirname: ${__dirname}`);
    
    for (const p of possiblePaths) {
      const indexCheck = path.join(p, "index.html");
      console.log(`[Server] Checking path: ${p} (index.html exists: ${fs.existsSync(indexCheck)})`);
      if (fs.existsSync(p) && fs.existsSync(indexCheck)) {
        distPath = p;
        console.log(`[Server] Found valid dist folder at: ${distPath}`);
        break;
      }
    }

    console.log(`[Server] Final choice for serving static files: ${distPath}`);

    // Serve static assets (JS, CSS, images, etc.) without automatic directory redirection
    app.use(express.static(distPath, { index: false, redirect: false }));
  }

  // Unified routing handler for HTML pages (both Dev & Production)
  app.get("*", (req, res, next) => {
    // Ignore API and admin-ping routes
    if (req.path.startsWith("/api/") || req.path === "/admin-ping") {
      return next();
    }

    // Do not serve index.html for static assets / physical files that were not found
    const ext = path.extname(req.path).toLowerCase();
    const isAssetRoute = req.path.startsWith("/assets/") || req.path.startsWith("/images/") || [
      ".js", ".css", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".woff", ".woff2", ".ttf", ".json", ".xml", ".txt"
    ].includes(ext);

    if (isAssetRoute) {
      if (vite) return next();
      res.status(404).send("Asset not found");
      return;
    }

    const normalizedPath = req.path.toLowerCase().replace(/\/$/, "") || "/";

    // 1. Check if a pre-rendered static HTML file exists for this route (Production only)
    if (!vite) {
      let routeFile = normalizedPath;
      if (routeFile === "/") {
        routeFile = "/index.html";
      } else {
        routeFile = `${routeFile}/index.html`;
      }

      const preRenderedPath = path.join(distPath, routeFile);
      if (fs.existsSync(preRenderedPath)) {
        console.log(`[SPA Fallback] Serving pre-rendered static file for ${req.path}`);
        res.sendFile(preRenderedPath);
        return;
      }
    }

    // 2. Otherwise fall back to reading index.html and doing runtime replacements
    const indexPath = vite 
      ? path.resolve(rootPath, "index.html")
      : path.resolve(distPath, "index.html");

    fs.readFile(indexPath, "utf8", async (err, html) => {
        if (err) {
          console.error("[SPA Fallback Error]", err);
          res.status(500).send("Could not serve app. Please check the build.");
          return;
        }

        const normalizedPath = req.path.toLowerCase().replace(/\/$/, "") || "/";
        
        let pageTitle = "SeniorEase - Making Everyday Technology Easier for Seniors";
        let pageDescription = "SeniorEase makes technology simple and accessible for seniors. Check out our affordable, clear, and transparent pricing packages for smartphone, tablet, and online support.";
        let staticHTML = "";

        // Common Header Navigation for pre-rendered pages
        const getHeader = (active: string) => `
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
              <div style="padding: 15px 0; border-bottom: 1px solid #1e293b; margin-bottom: 20px;">
                <p style="font-size: 0.85rem; font-weight: 600; color: #2dd4bf; margin: 0; letter-spacing: 0.5px;">
                  Secure payments • SSL encrypted • UK-based support • GDPR compliant
                </p>
              </div>
              <p>&copy; 2026 Silverbridge Technologies Ltd. Trading as SeniorEase. All rights reserved.</p>
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
                <a href="/nhs-standards" style="color: #0d9488; text-decoration: none;">Our Commitment</a>
              </p>
            </div>
          </footer>
        `;

        if (normalizedPath === "/") {
          pageTitle = "SeniorEase - Easy Digital Learning & Support for Seniors in the UK";
          pageDescription = "SeniorEase is a Software as a Service (SaaS) platform that assists older adults with everyday technology — combining intuitive secure software with friendly digital confidence support. Get smartphone, tablet, and online support today.";
          staticHTML = `
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
          `;
        } else if (normalizedPath === "/pricing") {
          pageTitle = "Simple Pricing Plans | SeniorEase - Digital Support & Education";
          pageDescription = "Explore simple and clear monthly pricing plans for SeniorEase digital education and technical support. Choose from Essential Care (£9.99/mo), Plus Care (£17.99/mo), or Family Care (£29.99/mo) support tiers.";
          staticHTML = `
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
          `;
        } else if (normalizedPath === "/about") {
          pageTitle = "About Us | SeniorEase - Empowering Senior Digital Confidence";
          pageDescription = "Learn about SeniorEase's mission to make technology less stressful and more accessible for older adults in the UK. Discover our story and values.";
          staticHTML = `
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
              </main>
              ${footerHTML}
            </div>
          `;
        } else if (normalizedPath === "/services") {
          pageTitle = "Our Services | SeniorEase - Digital Support Platform";
          pageDescription = "SeniorEase provides simple digital learning, smartphone and tablet guidance, scam awareness, online account setups, and patient technology assistance tailored for UK seniors.";
          staticHTML = `
            <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
              ${getHeader("services")}
              <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
                <span style="color: #0d9488; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.9rem;">Gentle Technology Support</span>
                <h1 style="font-size: 2.8rem; font-weight: 800; margin-top: 10px; color: #0f172a;">Our Support Services</h1>
                <p style="font-size: 1.25rem; color: #475569; margin-bottom: 30px;">Simple training, patient troubleshooting, and friendly guidance for smartphones, tablets, banking, and online safety.</p>
                
                <h2 style="font-size: 1.8rem; font-weight: 700; color: #0f172a; margin-top: 30px;">How We Can Help You:</h2>
                <ul style="line-height: 2; color: #475569; padding-left: 20px; font-size: 1.1rem;">
                  <li><strong>Smartphone & Tablet Help:</strong> Learn apps, send photos on WhatsApp, and video call family.</li>
                  <li><strong>Safe Online Accounts:</strong> Access online banking safely, manage energy/water utilities, and pay securely.</li>
                  <li><strong>Anti-Scam Awareness:</strong> Identify fraudulent messages, fake links, and dangerous phishing scams.</li>
                  <li><strong>Digital Confidence Training:</strong> Empowering seniors to navigate modern web interfaces with absolute peace of mind.</li>
                </ul>
              </main>
              ${footerHTML}
            </div>
          `;
        } else if (normalizedPath === "/how-it-works") {
          pageTitle = "How It Works | SeniorEase - Easy Support Steps";
          pageDescription = "Discover our easy 3-step setup to get digital support and learning with SeniorEase. No complex procedures, simple clear guidance.";
          staticHTML = `
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
          `;
        } else if (normalizedPath === "/faq") {
          pageTitle = "Frequently Asked Questions | SeniorEase";
          pageDescription = "Find clear answers to common questions about SeniorEase tech support, billing, device coverage, cancellations, and security training.";
          staticHTML = `
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
          `;
        } else if (normalizedPath === "/contact") {
          pageTitle = "Contact Support | SeniorEase - Here to Assist You";
          pageDescription = "Get in touch with the SeniorEase support team. Phone us on +44 330 401 0019, email support@senioreease.com, or book an introductory call.";
          staticHTML = `
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
                  <p style="font-size: 1.1rem; color: #334155; margin-bottom: 15px;"><strong>Business Address:</strong> SeniorEase, 167-169 Great Portland Street, 5th Floor, London, W1W 5PF</p>
                  <p style="font-size: 1.1rem; color: #334155; margin-bottom: 0;"><strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM GMT</p>
                </div>
              </main>
              ${footerHTML}
            </div>
          `;
        } else if (normalizedPath === "/terms") {
          pageTitle = "Terms & Conditions | SeniorEase";
          pageDescription = "Please read these Terms & Conditions carefully before using the SeniorEase website or purchasing subscriptions.";
          staticHTML = `
            <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
              ${getHeader("")}
              <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
                <h1 style="font-size: 2.8rem; font-weight: 800; color: #0f172a;">Terms & Conditions</h1>
                <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
                  <p style="margin: 0;"><strong>Effective Date:</strong> 01 June 2026</p>
                  <p style="margin: 5px 0 0 0;"><strong>Company Name:</strong> Silverbridge Technologies Ltd. (Trading as SeniorEase)</p>
                  <p style="margin: 5px 0 0 0;"><strong>Company Registration Number:</strong> [Pending — to be added upon incorporation]</p>
                  <p style="margin: 5px 0 0 0;"><strong>Registered/Trading Address:</strong> 167-169 Great Portland Street, 5th Floor, London, W1W 5PF</p>
                  <p style="margin: 5px 0 0 0;"><strong>Contact:</strong> support@senioreease.com | +44 (0) 330 401 0019</p>
                </div>
                <p>These Terms & Conditions ("Terms") govern your access to and use of the SeniorEase website (senioreease.com) and the digital technology learning and support services we provide ("Services"). By registering for an account, booking a session, or purchasing a subscription, you agree to be bound by these Terms. If you do not agree, please do not use our Services.</p>
                <h2>1. About Our Services</h2>
                <p>SeniorEase is a Software as a Service (SaaS) platform providing digital technology education and support for older adults in the United Kingdom, including but not limited to:</p>
                <ul>
                  <li>Smartphone, tablet, and computer tutoring</li>
                  <li>Guidance on messaging, video calling, and email</li>
                  <li>Scam and fraud awareness training</li>
                  <li>Progress updates shared with a nominated family member or carer (where authorized by the customer)</li>
                </ul>
                <p>SeniorEase provides educational and support guidance only. We are not a healthcare, medical, or care provider, and our Services do not constitute medical, legal, or financial advice.</p>
                <h2>2. Eligibility and Accounts</h2>
                <ul>
                  <li>You must be 18 years or older to create an account and enter into a subscription on behalf of yourself or a family member.</li>
                  <li>You are responsible for providing accurate registration information and for maintaining the confidentiality of your account credentials.</li>
                  <li>Where a subscription is purchased by a family member on behalf of a senior relative, the purchasing party confirms they have the authority and consent of the person receiving the Service to share relevant personal information and training progress.</li>
                </ul>
                <h2>3. Subscription Plans and Payment</h2>
                <ul>
                  <li>Current pricing plans are published on our Pricing page and form part of these Terms.</li>
                  <li>Payments are processed securely through Stripe. SeniorEase does not store full payment card details.</li>
                  <li>Subscriptions renew automatically at the end of each billing cycle (monthly or annual, as selected) unless cancelled in accordance with our Refund & Cancellation Policy.</li>
                  <li>We reserve the right to change subscription pricing with at least 30 days' written notice before the change takes effect for existing subscribers.</li>
                </ul>
                <h2>4. Cancellations and Refunds</h2>
                <p>Cancellation and refund terms are set out in full in our separate Refund & Cancellation Policy, which forms part of these Terms.</p>
                <h2>5. Customer Responsibilities</h2>
                <p>You agree to:</p>
                <ul>
                  <li>Provide a safe and reasonable environment for any in-person or remote support sessions.</li>
                  <li>Use the Services for lawful, personal, non-commercial purposes only.</li>
                  <li>Not share account access with individuals outside your household without our consent.</li>
                </ul>
                <h2>6. Family Notifications</h2>
                <p>Where enabled, SeniorEase may share training logs and learning progress with a nominated family member or carer, solely for the purpose of providing reassurance and support. This feature requires the explicit consent of the senior customer and can be switched off at any time by contacting support@senioreease.com.</p>
                <h2>7. Limitation of Liability</h2>
                <ul>
                  <li>SeniorEase provides technology education and guidance on a reasonable-skill-and-care basis but does not guarantee specific outcomes (e.g. complete elimination of scam risk).</li>
                  <li>To the fullest extent permitted by law, SeniorEase's total liability for any claim arising from the Services is limited to the amount paid by the customer in the 12 months preceding the claim.</li>
                  <li>Nothing in these Terms excludes or limits liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded under UK law.</li>
                </ul>
                <h2>8. Data Protection</h2>
                <p>Your personal data is handled in accordance with our Privacy Policy and applicable UK GDPR / Data Protection Act 2018 requirements.</p>
                <h2>9. Termination</h2>
                <p>We may suspend or terminate an account where these Terms are breached, where payment fails and is not resolved within a reasonable period, or where continued provision of the Service is not reasonably possible.</p>
                <h2>10. Changes to These Terms</h2>
                <p>We may update these Terms from time to time. Material changes will be notified by email or via the website at least 14 days before they take effect.</p>
                <h2>11. Governing Law</h2>
                <p>These Terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
                <h2>12. Intellectual Property</h2>
                <p>All website content, logos, branding, software, graphics, text, and training materials are owned by or licensed to SeniorEase and are protected by applicable intellectual property laws. You may not copy, reproduce, distribute, or modify any content without our prior written permission.</p>
                <h2>13. Contact Us</h2>
                <p>Questions about these Terms can be sent to:<br /><strong>Email:</strong> support@senioreease.com<br /><strong>Phone:</strong> +44 (0) 330 401 0019<br /><strong>Address:</strong> SeniorEase, 167-169 Great Portland Street, 5th Floor, London, W1W 5PF</p>
              </main>
              ${footerHTML}
            </div>
          `;
        } else if (normalizedPath === "/privacy") {
          pageTitle = "Privacy Policy | SeniorEase";
          pageDescription = "SeniorEase respects your privacy. Read our UK GDPR compliant policy on how we collect, use, store, protect, and share your personal data securely.";
          staticHTML = `
            <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
              ${getHeader("")}
              <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
                <h1 style="font-size: 2.8rem; font-weight: 800; color: #0f172a;">Privacy Policy</h1>
                <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
                  <p style="margin: 0;"><strong>Effective Date:</strong> 01 June 2026</p>
                  <p style="margin: 5px 0 0 0;"><strong>Website:</strong> https://www.senioreease.com</p>
                  <p style="margin: 5px 0 0 0;"><strong>Company Name:</strong> Silverbridge Technologies Ltd. (Trading as SeniorEase)</p>
                  <p style="margin: 5px 0 0 0;"><strong>Email:</strong> privacy@senioreease.com</p>
                  <p style="margin: 5px 0 0 0;"><strong>Telephone:</strong> +44 (0) 330 401 0019</p>
                </div>
                <p>SeniorEase respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, protect, and share your personal data when you visit our website, create an account, purchase a subscription, receive technical support or training from us, or contact our support team.</p>
                <p>This policy applies to all users of senioreease.com and our associated Services, and is written to comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>
                <h2>1. Information We Collect</h2>
                <p>We only collect the minimum information necessary to provide secure, reliable support. This includes:</p>
                <ul>
                  <li><strong>Identity data:</strong> name, date of birth (where relevant for account verification)</li>
                  <li><strong>Contact data:</strong> phone number, email address, postal address</li>
                  <li><strong>Billing data:</strong> processed securely via Stripe; SeniorEase does not store full card numbers</li>
                  <li><strong>Support and training data:</strong> session notes, learning progress, and topics covered during tutoring sessions</li>
                  <li><strong>Family/carer data:</strong> where a family member sets up or manages an account on behalf of a senior relative, we collect that family member's contact details for billing and notification purposes</li>
                  <li><strong>Technical data:</strong> IP address, browser type, and device information collected automatically via our website</li>
                </ul>
                <h2>2. How We Use Your Information</h2>
                <p>We use your personal data to:</p>
                <ul>
                  <li>Provide and manage your subscription and support sessions</li>
                  <li>Process payments securely through Stripe</li>
                  <li>Send appointment reminders, service updates, and (where consented) family progress notifications</li>
                  <li>Respond to support requests and enquiries</li>
                  <li>Improve our Services and website</li>
                  <li>Comply with legal and regulatory obligations</li>
                </ul>
                <h2>3. Legal Basis for Processing</h2>
                <p>Under UK GDPR, we rely on the following legal bases:</p>
                <ul>
                  <li><strong>Contract:</strong> processing necessary to deliver the Services you've subscribed to</li>
                  <li><strong>Consent:</strong> where you (or the account holder) opt in to family progress notifications or marketing communications</li>
                  <li><strong>Legitimate interests:</strong> to improve our Services, prevent fraud, and maintain the security of our systems</li>
                  <li><strong>Legal obligation:</strong> where we must retain records for tax, accounting, or regulatory purposes</li>
                </ul>
                <p>You may withdraw consent at any time by contacting privacy@senioreease.com; this will not affect the lawfulness of processing carried out before withdrawal.</p>
                <h2>4. Family and Carer Notifications</h2>
                <p>Where enabled, we share training progress and session summaries with a nominated family member or carer. This is only done with the explicit, informed consent of the senior customer at the time of sign-up; and limited to training/session summaries — not full session content or sensitive personal disclosures. This feature can be switched off at any time by contacting privacy@senioreease.com.</p>
                <h2>5. Sharing Your Information</h2>
                <p>We do not sell your personal data. We share information only with:</p>
                <ul>
                  <li><strong>Stripe (payment processing)</strong> — see Stripe's own privacy policy at stripe.com/privacy</li>
                  <li><strong>Service delivery partners</strong> (e.g. scheduling, email/SMS notification providers) strictly as needed to deliver the Service</li>
                  <li><strong>Regulators or law enforcement</strong>, where required by law</li>
                </ul>
                <p>All third-party processors are required to handle your data securely and only for the purposes we specify.</p>
                <h2>6. International Data Transfers</h2>
                <p>Some of our service providers (including Stripe) may process data outside the UK. Where this occurs, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses or an equivalent adequacy mechanism recognised under UK GDPR.</p>
                <h2>7. Data Retention</h2>
                <p>We retain personal data only for as long as necessary to provide the Services and meet legal obligations:</p>
                <ul>
                  <li><strong>Active account data:</strong> retained for the duration of your subscription</li>
                  <li><strong>Billing records:</strong> retained for 6 years to meet UK tax and accounting requirements</li>
                  <li><strong>Closed account data:</strong> deleted or anonymised within 12 months of account closure, unless a longer retention period is required by law</li>
                </ul>
                <h2>8. Your Rights</h2>
                <p>Under UK GDPR, you have the right to access the personal data we hold about you, request correction of inaccurate data, request erasure of your data ("right to be forgotten"), object to or restrict certain processing, request data portability, withdraw consent at any time, or lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk if you believe your data has been mishandled.</p>
                <p>To exercise any of these rights, contact privacy@senioreease.com. We aim to respond within one month, as required by law.</p>
                <h2>9. Cookies</h2>
                <p>Our website uses cookies to support core functionality and, where applicable, analytics. You can control or disable cookies through your browser settings. For details on the specific cookies we use, see our Cookie Policy (or the cookie banner presented on first visit).</p>
                <h2>10. Children's Privacy</h2>
                <p>Our Services are intended for adult users. We do not knowingly collect personal data from individuals under 18. Where a family member manages an account on behalf of a senior relative, only the necessary contact and billing details of the managing adult are collected.</p>
                <h2>11. Data Security</h2>
                <p>We use appropriate technical and organisational measures — including encrypted payment processing via Stripe and access controls on internal systems — to protect your personal data against unauthorised access, loss, or misuse.</p>
                <h2>12. Changes to This Policy</h2>
                <p>We may update this Privacy Policy from time to time. Material changes will be notified by email or via a notice on our website at least 14 days before they take effect. The "Effective Date" at the top of this page will always reflect the latest version.</p>
                <h2>13. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy or how we handle your data:<br /><strong>Email:</strong> privacy@senioreease.com<br /><strong>Phone:</strong> +44 (0) 330 401 0019<br /><strong>Address:</strong> SeniorEase, 167-169 Great Portland Street, 5th Floor, London, W1W 5PF</p>
                <p>You may also contact the ICO directly at ico.org.uk if you are not satisfied with our response.</p>
              </main>
              ${footerHTML}
            </div>
          `;
        } else if (normalizedPath === "/refund") {
          pageTitle = "Refund & Cancellation Policy | SeniorEase";
          pageDescription = "Learn about our clear refund and subscription cancellation policies. Cancel anytime with ease.";
          staticHTML = `
            <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
              ${getHeader("")}
              <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
                <h1 style="font-size: 2.8rem; font-weight: 800; color: #0f172a;">Refund & Cancellation Policy</h1>
                <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
                  <p style="margin: 0;"><strong>Effective Date:</strong> 01 June 2026</p>
                  <p style="margin: 5px 0 0 0;"><strong>Company Name:</strong> Silverbridge Technologies Ltd. (Trading as SeniorEase)</p>
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
          `;
        } else if (normalizedPath === "/sla") {
          pageTitle = "Service Level Agreement (SLA) | SeniorEase";
          pageDescription = "Read our Service Level Agreement outlining support response times, service availability commitments, and our dedicated customer support guidelines.";
          staticHTML = `
            <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
              ${getHeader("")}
              <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
                <h1 style="font-size: 2.8rem; font-weight: 800; color: #0f172a;">Service Level Agreement (SLA)</h1>
                <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
                  <p style="margin: 0;"><strong>Effective Date:</strong> 01 June 2026</p>
                  <p style="margin: 5px 0 0 0;"><strong>Website:</strong> https://www.senioreease.com</p>
                  <p style="margin: 5px 0 0 0;"><strong>Company Name:</strong> Silverbridge Technologies Ltd. (Trading as SeniorEase)</p>
                  <p style="margin: 5px 0 0 0;"><strong>Email:</strong> support@senioreease.com</p>
                  <p style="margin: 5px 0 0 0;"><strong>Telephone:</strong> +44 (0) 330 401 0019</p>
                </div>
                <h2>1. Introduction</h2>
                <p>This Service Level Agreement ("SLA") explains the level of service customers can reasonably expect from SeniorEase. It outlines the services we provide, the scope of our support, our standard support hours, how quickly we respond to enquiries and issues, what happens if we don't meet these standards, and what falls outside the scope of this SLA. This SLA forms part of, and should be read alongside, our Terms &amp; Conditions.</p>
                <h2>2. Services Covered</h2>
                <p>This SLA applies to all SeniorEase subscription plans and covers:</p>
                <ul>
                  <li><strong>Scheduled one-to-one tutoring sessions</strong> (smartphone, tablet, and computer support)</li>
                  <li><strong>Scam and fraud awareness training</strong></li>
                  <li><strong>General technical support</strong> via phone and email</li>
                  <li><strong>Family progress notifications</strong> (where enabled)</li>
                </ul>
                <h2>3. Support Hours</h2>
                <ul>
                  <li><strong>Standard support hours:</strong> Monday to Friday, 9:00 AM – 5:00 PM GMT/BST</li>
                  <li>Support requests received outside these hours will be addressed on the next business day.</li>
                  <li>Scheduled tutoring sessions may be booked within standard support hours, subject to availability.</li>
                </ul>
                <h2>4. Response Times</h2>
                <ul>
                  <li><strong>General enquiry (email/phone):</strong> Within 1 business day</li>
                  <li><strong>Technical support issue:</strong> Within 1 business day</li>
                  <li><strong>Urgent/safety-related concern (e.g. suspected scam in progress):</strong> Within 4 business hours</li>
                  <li><strong>Booking or rescheduling request:</strong> Within 1 business day</li>
                </ul>
                <p><em>These are target response times, not guaranteed resolution times — some issues may take longer to fully resolve depending on complexity.</em></p>
                <h2>5. Session Scheduling and Rescheduling</h2>
                <ul>
                  <li>Sessions should be rescheduled or cancelled with at least 24 hours' notice where possible.</li>
                  <li>If SeniorEase needs to reschedule a confirmed session, we will notify the customer as early as possible and offer the next available alternative slot at no extra cost.</li>
                  <li>Repeated late cancellations (less than 2 hours' notice) by the customer may be treated as a completed session, in line with our Refund &amp; Cancellation Policy.</li>
                </ul>
                <h2>6. Platform Availability</h2>
                <p>Where SeniorEase provides access to an online account portal or app, we aim for at least 99% monthly uptime, excluding scheduled maintenance windows (which will be communicated in advance where possible).</p>
                <h2>7. What This SLA Does Not Cover</h2>
                <p>This SLA does not guarantee or cover: faults or limitations of the customer's own device, software, or internet connection; issues arising from third-party apps or services outside SeniorEase's control (e.g. WhatsApp, Zoom, the customer's email provider); complete prevention of scams or fraud — we provide training and guidance, not a guarantee of outcome; delays caused by circumstances outside our reasonable control (e.g. network outages, extreme weather).</p>
                <h2>8. Escalation Process</h2>
                <p>If a customer is not satisfied with the resolution of a support request:<br />
                1. Contact support@senioreease.com referencing the original request.<br />
                2. If unresolved within 5 business days, the matter will be escalated to a senior member of the support team for review.<br />
                3. If still unresolved, the customer may raise the matter formally in writing, and SeniorEase will respond with a final position within 10 business days.</p>
                <h2>9. Remedies for Missed Commitments</h2>
                <p>Where SeniorEase fails to meet the response times or scheduling commitments set out in this SLA: the customer may request a complimentary make-up session, or a pro-rated credit against their next billing cycle, at SeniorEase's discretion, reflecting the missed service.</p>
                <h2>10. Reviews and Changes to This SLA</h2>
                <p>This SLA is reviewed periodically and may be updated to reflect changes in our Services. Material changes will be communicated to active subscribers by email at least 14 days before they take effect.</p>
                <h2>11. Contact Us</h2>
                <p><strong>Email:</strong> support@senioreease.com<br /><strong>Phone:</strong> +44 (0) 330 401 0019<br /><strong>Address:</strong> SeniorEase, 167-169 Great Portland Street, 5th Floor, London, W1W 5PF</p>
              </main>
              ${footerHTML}
            </div>
          `;
        } else if (normalizedPath === "/disclaimer") {
          pageTitle = "Disclaimer | SeniorEase";
          pageDescription = "Important legal disclosures and disclaimers regarding SeniorEase technical support, educational materials, and third-party device guidance.";
          staticHTML = `
            <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
              ${getHeader("")}
              <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
                <h1 style="font-size: 2.8rem; font-weight: 800; color: #0f172a;">Disclaimer</h1>
                <p style="font-size: 1.1rem; color: #475569;">This Disclaimer explains the scope and limitations of the services provided by SeniorEase.</p>
                <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
                  <p style="margin: 0;"><strong>Effective Date:</strong> 01 June 2026</p>
                  <p style="margin: 5px 0 0 0;"><strong>Company Name:</strong> Silverbridge Technologies Ltd. (Trading as SeniorEase)</p>
                  <p style="margin: 5px 0 0 0;"><strong>Website:</strong> https://www.senioreease.com</p>
                  <p style="margin: 5px 0 0 0;"><strong>Email:</strong> support@senioreease.com</p>
                  <p style="margin: 5px 0 0 0;"><strong>Telephone:</strong> +44 (0) 330 401 0019</p>
                </div>
                <h2>1. Introduction & Brand Identity Notice</h2>
                <p>SeniorEase (senioreease.com) is an independent UK digital technology learning and support SaaS service for older adults.</p>
                <ul>
                  <li>We are not affiliated with any senior living provider, residential care home, or property discovery platform, including any similarly named business or service operating under the "SeniorEase" name elsewhere.</li>
                  <li>We are not part of, endorsed by, or affiliated with the NHS, any NHS trust, or any other public healthcare body. Any reference to health, wellbeing, or safeguarding standards on our website reflects our own internal practices, not a formal certification, partnership, or endorsement.</li>
                </ul>
                <p style="background: #fffbeb; padding: 15px; border-radius: 8px; border: 1px solid #fde68a; color: #78350f;">If you believe you have reached this page in error while looking for a different organisation, please contact us and we will do our best to point you in the right direction.</p>
                <h2>2. No Professional, Medical, Legal, or Financial Advice</h2>
                <p>SeniorEase provides general digital technology education and support only. Nothing on our website or delivered during a support session constitutes:</p>
                <ul>
                  <li>Medical or health advice</li>
                  <li>Legal advice</li>
                  <li>Financial or investment advice</li>
                  <li>Formal social care or safeguarding assessment</li>
                </ul>
                <p>If you require advice in any of these areas, please consult a qualified, regulated professional or relevant statutory body.</p>
                <h2>3. No Guaranteed Outcomes</h2>
                <p>While we provide training in scam and fraud awareness, digital literacy, and safe technology use:</p>
                <ul>
                  <li>We cannot guarantee that a customer will avoid scams, fraud, or unwanted contact after completing our training.</li>
                  <li>Learning outcomes vary between individuals, and we cannot guarantee a specific level of digital proficiency will be reached within any given timeframe.</li>
                  <li>Our guidance reflects best practice and common scam patterns known to us at the time of training, which may not cover every emerging threat.</li>
                </ul>
                <h2>4. Third-Party Services and Platforms</h2>
                <p>Our support sessions may reference or make use of third-party platforms such as WhatsApp, Zoom, FaceTime, or various email providers. SeniorEase:</p>
                <ul>
                  <li>Does not own, operate, or control these third-party platforms.</li>
                  <li>Is not responsible for their availability, functionality, security practices, or any changes they make to their services.</li>
                  <li>Recommends customers refer to each platform's own terms and privacy policy for details on how their data is handled.</li>
                </ul>
                <h2>5. Accuracy of Information</h2>
                <p>We take reasonable care to ensure the information provided on our website and during support sessions is accurate and up to date. However:</p>
                <ul>
                  <li>Technology, scams, and platform features change frequently, and some information may become outdated between updates.</li>
                  <li>We do not warrant that all content is complete, current, or error-free, and recommend verifying critical information (e.g. current scam trends) through official sources such as Action Fraud or your bank.</li>
                </ul>
                <h2>6. Limitation of Liability</h2>
                <p>This Disclaimer should be read alongside our Terms & Conditions, which sets out the full limitation of liability applicable to our Services. To the fullest extent permitted by law, SeniorEase accepts no liability for losses arising from reliance on general guidance provided through our Services, except where such liability cannot be excluded under UK law (e.g. death, personal injury, or fraud caused by our negligence).</p>
                <h2>7. Changes to This Disclaimer</h2>
                <p>We may update this Disclaimer from time to time to reflect changes in our Services or applicable law. The "Effective Date" above will always reflect the most recent version.</p>
                <h2>8. Contact Us</h2>
                <p><strong>Email:</strong> support@senioreease.com<br /><strong>Phone:</strong> +44 (0) 330 401 0019<br /><strong>Address:</strong> SeniorEase, 167-169 Great Portland Street, 5th Floor, London, W1W 5PF</p>
              </main>
              ${footerHTML}
            </div>
          `;
        } else if (normalizedPath === "/gdpr") {
          pageTitle = "GDPR Compliance | SeniorEase";
          pageDescription = "Summary of how SeniorEase complies with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.";
          staticHTML = `
            <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
              ${getHeader("")}
              <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
                <h1 style="font-size: 2.8rem; font-weight: 800; color: #0f172a;">GDPR Compliance</h1>
                <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
                  <p style="margin: 0;"><strong>Effective Date:</strong> 01 June 2026</p>
                  <p style="margin: 5px 0 0 0;"><strong>Company Name:</strong> Silverbridge Technologies Ltd. (Trading as SeniorEase)</p>
                  <p style="margin: 5px 0 0 0;"><strong>Website:</strong> https://www.senioreease.com</p>
                  <p style="margin: 5px 0 0 0;"><strong>Email:</strong> privacy@senioreease.com</p>
                  <p style="margin: 5px 0 0 0;"><strong>Telephone:</strong> +44 (0) 330 401 0019</p>
                </div>
                <p style="font-size: 1.1rem; color: #475569;">This page summarises how SeniorEase complies with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. For the full legal detail on what we collect, why, and how, please see our <a href="/privacy" style="color: #0d9488; text-decoration: none; font-weight: 600;">Privacy Policy</a>.</p>
                <h2>1. Our Approach</h2>
                <p>SeniorEase takes data protection seriously, particularly given the nature of our customers. We are guided by the core principles of UK GDPR: we collect only what we need, we're clear about why we need it, we keep it secure, and we give you control over it.</p>
                <h2>2. What This Means in Practice</h2>
                <ul>
                  <li><strong>Minimal data collection</strong> — we only collect the information required to deliver our Services (see our Privacy Policy for the full list).</li>
                  <li><strong>Clear consent</strong> — where we rely on your consent (for example, sharing training progress with a family member), you can withdraw it at any time.</li>
                  <li><strong>Secure payment handling</strong> — all billing is processed via Stripe; we do not store full card details ourselves.</li>
                  <li><strong>Data retention limits</strong> — we don't keep your data longer than necessary, and closed accounts are deleted or anonymised in line with our published retention periods.</li>
                  <li><strong>Your rights are respected</strong> — access, correction, erasure, portability, and objection requests are handled promptly by our team.</li>
                </ul>
                <h2>3. Data Protection Contact</h2>
                <p>For any question about how your data is handled, or to exercise your rights under UK GDPR:</p>
                <p><strong>Email:</strong> privacy@senioreease.com<br /><strong>Phone:</strong> +44 (0) 330 401 0019</p>
                <p>We aim to acknowledge data protection queries within 5 business days and resolve formal requests within one calendar month, as required by law.</p>
                <h2>4. Your Right to Complain</h2>
                <p>If you're ever unhappy with how we've handled your personal data, we'd like the chance to put it right directly — but you also have the right to complain to the UK's independent regulator:</p>
                <p><strong>Information Commissioner's Office (ICO)</strong><br />Website: ico.org.uk<br />Telephone: 0303 123 1113</p>
                <h2>5. Where to Find the Full Detail</h2>
                <p>This page is a summary for quick reference. The complete, legally detailed account of our data processing — including legal basis, international transfers, retention periods, and third-party processors — is set out in our <a href="/privacy" style="color: #0d9488; text-decoration: none; font-weight: 600;">Privacy Policy</a>.</p>
              </main>
              ${footerHTML}
            </div>
          `;
        } else if (normalizedPath === "/nhs-standards") {
          pageTitle = "Our Standards & Commitment | SeniorEase";
          pageDescription = "Read our commitment to accessibility, privacy, safeguarding, and good practice for senior citizens across the United Kingdom.";
          staticHTML = `
            <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
              ${getHeader("")}
              <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
                <h1 style="font-size: 2.8rem; font-weight: 800; color: #0f172a;">Our Standards</h1>
                <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
                  <p style="margin: 0; font-size: 1.1rem;"><strong>Commitment to Accessibility, Privacy and Good Practice</strong></p>
                  <p style="margin: 8px 0 0 0;"><strong>Effective Date:</strong> 01 June 2026</p>
                  <p style="margin: 5px 0 0 0;"><strong>Website:</strong> https://www.senioreease.com</p>
                  <p style="margin: 5px 0 0 0;"><strong>Company Name:</strong> Silverbridge Technologies Ltd. (Trading as SeniorEase)</p>
                  <p style="margin: 5px 0 0 0;"><strong>Email:</strong> support@senioreease.com</p>
                  <p style="margin: 5px 0 0 0;"><strong>Telephone:</strong> +44 (0) 330 401 0019</p>
                </div>
                <div style="background: #fffbeb; padding: 15px 20px; border-radius: 12px; border: 1px solid #fde68a; color: #78350f; margin-bottom: 25px;">
                  <p style="margin: 0;"><strong>Important:</strong> SeniorEase is an independent, privately operated digital technology support service. We are not part of, endorsed by, or affiliated with the NHS, any NHS trust, or any other public healthcare body. Any reference to health, wellbeing, or safeguarding on this page reflects our own internal standards and good practice, not a formal certification or partnership.</p>
                </div>
                <h2>1. Our Commitment</h2>
                <p>At SeniorEase, we are committed to providing a safe, accessible, and user-friendly digital education and technical support service for senior citizens across the United Kingdom. Our services are designed around the principles of accessibility, privacy, transparency, and continuous improvement. We aim to help older adults use everyday technology with greater confidence through clear guidance provided by our trained support team.</p>
                <h2>2. Accessibility Standards</h2>
                <p>We design our website, communications, and training materials with accessibility in mind, including:</p>
                <ul>
                  <li>Clear, plain-English guidance suitable for beginners and those with limited digital experience</li>
                  <li>Large, legible text and high-contrast design where possible</li>
                  <li>Patient, jargon-free verbal explanations during support sessions</li>
                  <li>Flexibility to accommodate hearing, vision, or mobility considerations on request</li>
                </ul>
                <p>We welcome feedback on how we can make our Services more accessible — contact support@senioreease.com with any suggestions.</p>
                <h2>3. Safeguarding and Vulnerable Adults</h2>
                <p>We recognise that many of our customers may be vulnerable due to age, isolation, or unfamiliarity with technology. Because of this:</p>
                <ul>
                  <li>All support staff receive training on safeguarding awareness and respectful, patient communication with older adults.</li>
                  <li>We do not pressure customers into purchases, upgrades, or decisions during support sessions.</li>
                  <li>Where a customer discloses signs of financial abuse, scam victimisation, or safeguarding concerns, our team follows an internal escalation process and, where appropriate, signposts the customer to relevant support organisations (such as Action Fraud, Age UK, or the customer's GP or local authority safeguarding team).</li>
                  <li>SeniorEase is not a substitute for statutory health, social care, or safeguarding services.</li>
                </ul>
                <h2>4. Privacy and Data Handling</h2>
                <p>Our approach to personal data is governed by our full Privacy Policy, which explains what we collect, why, and your rights under UK GDPR.</p>
                <h2>5. Staff Training and Conduct</h2>
                <ul>
                  <li>All support staff complete an induction covering our accessibility, safeguarding, and privacy standards before working with customers.</li>
                  <li>Staff conduct is expected to reflect patience, respect, and clarity at all times, particularly given the nature of our customer base.</li>
                </ul>
                <h2>6. Continuous Improvement</h2>
                <p>We review our practices periodically, incorporating customer feedback, to ensure our Services remain safe, accessible, and appropriate for the people we support. Suggestions can be sent to support@senioreease.com at any time.</p>
                <h2>7. Contact Us</h2>
                <p><strong>Email:</strong> support@senioreease.com<br /><strong>Phone:</strong> +44 (0) 330 401 0019<br /><strong>Address:</strong> SeniorEase, 167-169 Great Portland Street, 5th Floor, London, W1W 5PF</p>
              </main>
              ${footerHTML}
            </div>
          `;
        }

        // Dynamically replace the metadata & content
        let modifiedHtml = html;
        
        // 1. Replace title tag
        modifiedHtml = modifiedHtml.replace(
          /<title>.*?<\/title>/gi,
          `<title>${pageTitle}</title>`
        );

        // 2. Replace description tag if present
        modifiedHtml = modifiedHtml.replace(
          /<meta\s+name="description"\s+content=".*?"\s*\/?>/gi,
          `<meta name="description" content="${pageDescription}" />`
        );

        // 3. Replace og:title tag if present
        modifiedHtml = modifiedHtml.replace(
          /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/gi,
          `<meta property="og:title" content="${pageTitle}" />`
        );

        // 4. Replace og:description tag if present
        modifiedHtml = modifiedHtml.replace(
          /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/gi,
          `<meta property="og:description" content="${pageDescription}" />`
        );

        // 5. Replace og:url tag if present
        const fullUrl = `https://www.senioreease.com${normalizedPath === "/" ? "" : normalizedPath}`;
        modifiedHtml = modifiedHtml.replace(
          /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/gi,
          `<meta property="og:url" content="${fullUrl}" />`
        );

        // 4. Inject static content inside <div id="root"></div>
        if (staticHTML) {
          modifiedHtml = modifiedHtml.replace(
            /<div\s+id=["']?root["']?\s*>\s*<\/div>/gi,
            `<div id="root">${staticHTML}</div>`
          );
        }

        if (vite) {
          try {
            const transformedHtml = await vite.transformIndexHtml(req.url, modifiedHtml);
            res.status(200).set({ "Content-Type": "text/html" }).send(transformedHtml);
          } catch (e) {
            next(e);
          }
        } else {
          res.send(modifiedHtml);
        }
      });
    });

  // ── Error Handler ─────────────────────────────────────────────────────────
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("[Express Error]", err);
    res.status(500).send("Internal Server Error");
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on http://0.0.0.0:${PORT} [${process.env.NODE_ENV || "development"}]`);
  });
}

startServer();

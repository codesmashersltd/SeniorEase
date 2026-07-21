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

    // Serve static assets (JS, CSS, images, etc.)
    app.use(express.static(distPath, { index: false }));
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
              <p>&copy; 2026 SeniorEase. All rights reserved.</p>
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
          pageDescription = "Explore simple and clear monthly pricing plans for Senior Ease digital education and technical support. Choose from Essential Care (£9.99/mo), Plus Care (£17.99/mo), or Family Care (£29.99/mo) support tiers.";
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
                
                <h2 style="font-size: 1.8rem; font-weight: 700; color: #0f172a; margin-top: 30px;">Technology Shouldn’t Feel Overwhelming</h2>
                <p style="color: #475569;">Senior Ease was created to provide a Software as a Service (SaaS) platform that makes everyday technology feel less overwhelming for older adults and their families. As more parts of life move online, many senior citizens are left feeling confused, frustrated, or unsupported when it comes to using phones, apps, emails, online forms, and digital communication tools. Senior Ease exists to provide secure tools, a centralized dashboard, and practical learning that makes everyday digital life easier to manage.</p>
                <p style="color: #475569;">At SeniorEase, we created a comprehensive SaaS platform and support subscription to help make everyday technology easier, calmer, and less intimidating. We provide the software tools and the patient, friendly voice on the end of the phone when things go wrong.</p>
                
                <h3 style="font-size: 1.4rem; font-weight: 700; color: #0f172a; margin-top: 30px;">We believe seniors deserve support that is:</h3>
                <ul style="line-height: 2; color: #475569; padding-left: 20px;">
                  <li><strong>Patient & Unrushed:</strong> We move at your pace with clear, calm instruction.</li>
                  <li><strong>Respectful & Kind:</strong> Treating our seniors with the dignity they deserve.</li>
                  <li><strong>Simple & Jargon-Free:</strong> No confusing tech words, only real everyday concepts.</li>
                  <li><strong>Reassuring & Safe:</strong> Ensuring seniors feel secure using online services.</li>
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
                    <p style="color: #475569; margin-bottom: 0;">Subscriptions are processed securely via Stripe. Payments are billed automatically on a rolling monthly basis on the date you subscribe. There are absolutely no contracts or hidden fees.</p>
                  </div>
                  <div style="background: white; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <h3 style="color: #0d9488; margin-top: 0; font-weight: bold;">Can I cancel or change plans?</h3>
                    <p style="color: #475569; margin-bottom: 0;">Yes, absolutely! You can cancel, upgrade, or downgrade your subscription at any time. Simply sign into your dashboard, click "Cancel Subscription", or email support@senioreease.com and we will take care of it immediately.</p>
                  </div>
                  <div style="background: white; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <h3 style="color: #0d9488; margin-top: 0; font-weight: bold;">Who is this service designed for?</h3>
                    <p style="color: #475569; margin-bottom: 0;">It's designed for senior citizens who want to become confident online and families who want reassurance that their older loved ones have expert, safe, friendly tech support always ready to help.</p>
                  </div>
                </div>
              </main>
              ${footerHTML}
            </div>
          `;
        } else if (normalizedPath === "/contact") {
          pageTitle = "Contact Support | SeniorEase - Here to Assist You";
          pageDescription = "Get in touch with the SeniorEase UK support team. Phone us on +44 330 401 0019, email support@senioreease.com, or book an introductory call.";
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
                  <p style="font-size: 1.1rem; color: #334155; margin-bottom: 15px;"><strong>Business Address:</strong> SeniorEase, 86-90 Paul Street, London, EC2A 4NE, United Kingdom</p>
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
                  <p style="margin: 5px 0 0 0;"><strong>Business Name:</strong> Senior Ease</p>
                  <p style="margin: 5px 0 0 0;"><strong>Email:</strong> support@senioreease.com</p>
                  <p style="margin: 5px 0 0 0;"><strong>Telephone:</strong> +44 (0) 330 401 0019</p>
                </div>
                <h2>1. Welcome</h2>
                <p>Welcome to Senior Ease.</p>
                <p>These Terms & Conditions govern your access to and use of the Senior Ease website, customer portal, subscription services, and digital technical support services. Please read these Terms carefully before using our website or purchasing any of our services.</p>
                <p>By visiting our website, creating an account, purchasing a subscription, or using our services, you agree to be bound by these Terms & Conditions.</p>
                <h2>2. About Senior Ease</h2>
                <p>Senior Ease is a subscription-based digital education and technical support service designed to help senior citizens become more confident using everyday technology. Our support team provides friendly, patient, and practical guidance to assist customers with smartphones, tablets, computers, and recognizing online scams.</p>
              </main>
              ${footerHTML}
            </div>
          `;
        } else if (normalizedPath === "/privacy") {
          pageTitle = "Privacy Policy | SeniorEase";
          pageDescription = "SeniorEase values your privacy. Read our policy on how we gather, protect, and handle your personal data.";
          staticHTML = `
            <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
              ${getHeader("")}
              <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
                <h1 style="font-size: 2.8rem; font-weight: 800; color: #0f172a;">Privacy Policy</h1>
                <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
                  <p style="margin: 0;"><strong>Effective Date:</strong> 01 June 2026</p>
                  <p style="margin: 5px 0 0 0;"><strong>Business Name:</strong> Senior Ease</p>
                  <p style="margin: 5px 0 0 0;"><strong>Email:</strong> privacy@senioreease.com</p>
                </div>
                <h2>Our Commitment to Your Privacy</h2>
                <p>SeniorEase is committed to protecting your privacy and security. This Privacy Policy explains how we collect, use, store, and share your personal data when you visit our website, register for an account, purchase a subscription, or receive technical support from us.</p>
                <h2>What Information We Collect</h2>
                <p>We only collect the minimum required information necessary to provide you with secure, reliable tech support. This includes: name, contact information (phone number, email, address), and billing information processed securely via Stripe.</p>
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
                  <p style="margin: 5px 0 0 0;"><strong>Business Name:</strong> Senior Ease</p>
                  <p style="margin: 5px 0 0 0;"><strong>Email:</strong> support@senioreease.com</p>
                </div>
                <h2>Subscription Cancellation</h2>
                <p>You can cancel your subscription at any time. Cancellation will prevent future automated billing, and your service will remain active until the end of your current paid billing period. To cancel, use the self-service dashboard or email us at support@senioreease.com.</p>
                <h2>14-Day Cooling-off Period & Refunds</h2>
                <p>In accordance with UK Consumer Contracts Regulations, you have the right to cancel your subscription within 14 days of purchase and request a full refund, provided you have not utilized the service's direct support features.</p>
              </main>
              ${footerHTML}
            </div>
          `;
        } else if (normalizedPath === "/sla") {
          pageTitle = "Service Level Agreement (SLA) | SeniorEase";
          pageDescription = "Our commitment to high-quality service, support response times, and platform availability.";
          staticHTML = `
            <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
              ${getHeader("")}
              <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
                <h1 style="font-size: 2.8rem; font-weight: 800; color: #0f172a;">Service Level Agreement (SLA)</h1>
                <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
                  <p style="margin: 0;"><strong>Effective Date:</strong> 01 June 2026</p>
                  <p style="margin: 5px 0 0 0;"><strong>Business Name:</strong> Senior Ease</p>
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
          `;
        } else if (normalizedPath === "/disclaimer") {
          pageTitle = "Disclaimer | SeniorEase";
          pageDescription = "Important disclosures regarding our technical support services and limits of liability.";
          staticHTML = `
            <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
              ${getHeader("")}
              <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
                <h1 style="font-size: 2.8rem; font-weight: 800; color: #0f172a;">Disclaimer</h1>
                <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
                  <p style="margin: 0;"><strong>Effective Date:</strong> 01 June 2026</p>
                  <p style="margin: 5px 0 0 0;"><strong>Business Name:</strong> Senior Ease</p>
                </div>
                <h2>Information & Services Disclaimer</h2>
                <p>The information and support services provided by SeniorEase are intended solely for educational and general digital confidence building. While we make every effort to provide accurate, safe, and up-to-date guidance, technology platforms change rapidly. SeniorEase does not guarantee that third-party systems, applications, or devices will always function error-free.</p>
              </main>
              ${footerHTML}
            </div>
          `;
        } else if (normalizedPath === "/gdpr") {
          pageTitle = "GDPR Compliance Statement | SeniorEase";
          pageDescription = "Learn about our commitment to General Data Protection Regulation (GDPR) and how we safeguard user privacy in the UK and Europe.";
          staticHTML = `
            <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
              ${getHeader("")}
              <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
                <h1 style="font-size: 2.8rem; font-weight: 800; color: #0f172a;">GDPR Compliance</h1>
                <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
                  <p style="margin: 0;"><strong>Effective Date:</strong> 01 June 2026</p>
                  <p style="margin: 5px 0 0 0;"><strong>Business Name:</strong> Senior Ease</p>
                </div>
                <h2>GDPR Protection Principles</h2>
                <p>SeniorEase fully adheres to General Data Protection Regulation (GDPR) guidelines to ensure that senior citizen and family member records are handled transparently, securely, and with clear user consent. You have the right to request access to, correction of, or permanent erasure of your personal data at any time.</p>
              </main>
              ${footerHTML}
            </div>
          `;
        } else if (normalizedPath === "/nhs-standards") {
          pageTitle = "NHS Standards Alignment | SeniorEase";
          pageDescription = "Our technical systems and support protocols align with NHS Digital service standards for digital health accessibility.";
          staticHTML = `
            <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column;">
              ${getHeader("")}
              <main style="max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; flex: 1;">
                <h1 style="font-size: 2.8rem; font-weight: 800; color: #0f172a;">NHS Standards Alignment</h1>
                <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
                  <p style="margin: 0;"><strong>Effective Date:</strong> 01 June 2026</p>
                  <p style="margin: 5px 0 0 0;"><strong>Business Name:</strong> Senior Ease</p>
                </div>
                <h2>Digital Accessibility & Safety</h2>
                <p>We build our portal interfaces and support services following NHS Digital Service Manual standards, ensuring high-contrast design, clean font sizes, keyboard accessibility, and safe assistance processes when tutoring seniors on accessing their local GP accounts, NHS app, or online medical services.</p>
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

        // 3. Replace og:description tag if present
        modifiedHtml = modifiedHtml.replace(
          /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/gi,
          `<meta property="og:description" content="${pageDescription}" />`
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

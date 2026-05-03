import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";
import Stripe from "stripe";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = process.cwd();

// Ensure stripe is lazily initialized to prevent crash if key is missing during boot
let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      console.warn('STRIPE_SECRET_KEY is missing. Using dummy key for dev (WARNING: Real payments will fail).');
    }
    stripeClient = new Stripe(key || 'sk_test_mock_key', {
      apiVersion: '2025-01-27.acacia' as any
    });
  }
  return stripeClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  let vite: any = null;

  // Initialize Vite early if in dev mode
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
  }

  // Add request logging
  app.use((req, res, next) => {
    console.log(`[DEBUG] ${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // Needed to parse JSON payloads
  app.use(express.json());

  // 1. API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV });
  });

  // Explicit admin test route
  app.get("/admin-ping", (req, res) => {
    res.send("Admin server is alive at " + new Date().toISOString());
  });

  // Stripe Checkout Endpoint
  app.post("/api/checkout", async (req, res) => {
    try {
      const { planPrice, planName, customerEmail } = req.body;
      const stripe = getStripe();
      
      if (process.env.STRIPE_SECRET_KEY) {
        const numericPrice = parseFloat(planPrice.replace(/[^0-9.]/g, ''));
        const unitAmount = Math.round(numericPrice * 100);

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          customer_email: customerEmail,
          line_items: [{
            price_data: {
              currency: 'gbp',
              product_data: { name: planName },
              unit_amount: unitAmount,
              recurring: { interval: 'month' }
            },
            quantity: 1,
          }],
          mode: 'subscription',
          success_url: `${req.headers.origin}/account?setup_intent=success`,
          cancel_url: `${req.headers.origin}/pricing?canceled=true`,
        });

        res.json({ status: "success", url: session.url, session_id: session.id });
      } else {
        res.json({ 
          status: "success", 
          message: "Stripe intent simulated (No API Key provided)",
          mock_session_id: "cs_test_mock_123"
        });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  // 2. Asset Serving & Routing
  if (process.env.NODE_ENV !== "production") {
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(rootPath, "dist");
    // Serve static files
    app.use(express.static(distPath, { index: false }));
    
    // Explicitly handle all routes that are NOT assets
    app.get("*", (req, res, next) => {
      // If it looks like a file (has a dot), let it fall through to static or 404
      if (req.path.includes('.') && !req.path.endsWith('.html')) {
        return next();
      }
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  // 4. Error Handling
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Express Error:", err);
    res.status(500).send("Internal Server Error");
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
}

startServer();

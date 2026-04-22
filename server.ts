import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Stripe from "stripe";
import * as dotenv from "dotenv";

dotenv.config();

// Ensure stripe is lazily initialized to prevent crash if key is missing during boot
let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      console.warn('STRIPE_SECRET_KEY is missing. Using dummy key for dev (WARNING: Real payments will fail).');
    }
    stripeClient = new Stripe(key || 'sk_test_mock_key', {
      apiVersion: '2025-02-24.acacia'
    });
  }
  return stripeClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Needed to parse JSON payloads for Stripe
  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Stripe Checkout Endpoint
  app.post("/api/checkout", async (req, res) => {
    try {
      const { planPrice, planName, customerEmail } = req.body;
      const stripe = getStripe();
      
      // If a real key is present, create an actual checkout session.
      // If none is present, we bypass safely so the app doesn't crash during preview checking.
      if (process.env.STRIPE_SECRET_KEY) {
        // Convert string price (e.g., "£19.99/mo") to integer cents for Stripe
        const numericPrice = parseFloat(planPrice.replace(/[^0-9.]/g, ''));
        const unitAmount = Math.round(numericPrice * 100);

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          customer_email: customerEmail,
          line_items: [
            {
              price_data: {
                currency: 'gbp',
                product_data: {
                  name: planName,
                },
                unit_amount: unitAmount,
                recurring: {
                  interval: 'month'
                }
              },
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: `${req.headers.origin}/account?setup_intent=success`,
          cancel_url: `${req.headers.origin}/pricing?canceled=true`,
        });

        res.json({ 
          status: "success", 
          url: session.url,
          session_id: session.id
        });
      } else {
        // Mock success response representing what would happen in background (for UI preview when Key is missing)
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

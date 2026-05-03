import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
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
  const PORT = parseInt(process.env.PORT || "3000", 10);
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
  if (!isProduction) {
    // Dev mode: use Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve built files from dist/
    const distPath = path.resolve(process.cwd(), "dist");
    console.log(`[Server] Serving static files from: ${distPath}`);

    // Serve static assets (JS, CSS, images, etc.)
    app.use(express.static(distPath, { index: false }));

    // SPA fallback — serve index.html for ALL non-asset routes
    // This makes React Router work for /admin, /admin/dashboard, /account, etc.
    app.get("*", (req, res) => {
      const indexPath = path.resolve(distPath, "index.html");
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error("[SPA Fallback Error]", err);
          res.status(500).send("Could not serve app. Please check the build.");
        }
      });
    });
  }

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

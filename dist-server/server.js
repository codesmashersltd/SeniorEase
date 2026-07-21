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
let stripeClient = null;
function getStripe() {
    if (!stripeClient) {
        const key = process.env.STRIPE_SECRET_KEY;
        if (!key) {
            console.warn("STRIPE_SECRET_KEY is missing. Payments will not work.");
        }
        stripeClient = new Stripe(key || "sk_test_mock_key", {
            apiVersion: "2025-01-27.acacia",
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
            }
            else {
                res.json({
                    status: "success",
                    message: "Stripe intent simulated (no API key)",
                    mock_session_id: "cs_test_mock_123",
                });
            }
        }
        catch (error) {
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
    }
    else {
        // Production mode: serve built files from dist/
        // Try to find the correct dist directory in multiple common locations
        const possiblePaths = [
            path.resolve(process.cwd(), "dist"),
            path.resolve(__dirname, "../dist"),
            path.resolve(__dirname, "dist"),
            path.resolve(__dirname, "../../dist"),
        ];
        let distPath = possiblePaths[0];
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
        // SPA fallback — serve index.html for ALL non-asset routes
        // This makes React Router work for /admin, /admin/dashboard, /account, etc.
        app.get("*", (req, res) => {
            // Do not serve index.html for static assets / physical files that were not found
            const ext = path.extname(req.path).toLowerCase();
            const isAssetRoute = req.path.startsWith("/assets/") || req.path.startsWith("/images/") || [
                ".js", ".css", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".woff", ".woff2", ".ttf", ".json", ".xml", ".txt"
            ].includes(ext);
            if (isAssetRoute) {
                res.status(404).send("Asset not found");
                return;
            }
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
    app.use((err, req, res, next) => {
        console.error("[Express Error]", err);
        res.status(500).send("Internal Server Error");
    });
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`✅ Server running on http://0.0.0.0:${PORT} [${process.env.NODE_ENV || "development"}]`);
    });
}
startServer();

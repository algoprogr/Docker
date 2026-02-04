import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.LEMON_API_KEY;

if (!API_KEY) {
    console.error("❌ LEMON_API_KEY is missing in .env");
    process.exit(1);
}

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(morgan("dev"));

// Serve static files (HTML page)
app.use(express.static(__dirname));

/**
 * ACTIVATE LICENSE
 * Optional instance registration
 */
app.post("/activate", async (req, res) => {
    const { license_key, instance_name } = req.body;

    if (!license_key || !instance_name) {
        return res
            .status(400)
            .json({ error: "license_key and instance_name required" });
    }

    try {
        const r = await axios.post(
            "https://api.lemonsqueezy.com/v1/licenses/activate",
            { license_key, instance_name },
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.json({
            activated: r.data.activated === true,
            instance_id: r.data.instance?.id || null,
            meta: r.data.meta || null,
        });
    } catch (e) {
        console.error("Activation error:", e.response?.data || e.message);
        res
            .status(e.response?.status || 500)
            .json({ error: "Activation failed" });
    }
});

/**
 * VALIDATE LICENSE
 * Works with or without instance_id
 */
app.post("/validate", async (req, res) => {
    const { license_key, instance_id } = req.body;

    if (!license_key) {
        return res
            .status(400)
            .json({ valid: false, error: "license_key required" });
    }

    try {
        const payload = { license_key };
        if (instance_id) payload.instance_id = instance_id; // optional

        const r = await axios.post(
            "https://api.lemonsqueezy.com/v1/licenses/validate",
            payload,
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const valid = r.data.valid === true;

        res.json({
            valid,
            expires_at: r.data.license_key?.expires_at || null,
            error: valid ? null : r.data.error || "License invalid",
            meta: r.data.meta || null,
        });
    } catch (e) {
        console.error("Validation error:", e.response?.data || e.message);
        res.status(e.response?.status || 500).json({
            valid: false,
            error: "Validation failed",
        });
    }
});

/**
 * Health check
 */
app.get("/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`✅ License server running on http://localhost:${PORT}`);
});

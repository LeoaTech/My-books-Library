const express = require("express");
const stripe = require("../../config/stripe");
const stripeRouter = express.Router();
const db = require("../../config/dbConfig.js");
const { checkAuth } = require("../../middleware/authMiddleware.js");
const {
  updateEntityStripeInfo,
  getEntityInfo,
} = require("../../helpers/stripe_onbaording.js");

require("dotenv").config();

stripeRouter.use(checkAuth);


const backend_url = process.env.SERVER_URL ||"http://localhost:8000";


// Generate OAuth URL for Existing Stripe Account
stripeRouter.get(
  "/api/library/:entityId/stripe/oauth-url",
  async (req, res) => {
    try {
      const { entityId } = req.user;

      const entity = await getEntityInfo(db, entityId);
      if (!entity) return res.status(404).json({ error: "Entity ID not found" });

      const clientId = process.env.STRIPE_CONNECT_CLIENT_ID;
      
      if (!clientId) throw new Error("Missing STRIPE_CONNECT_CLIENT_ID");
      
      const stateData = { entityId, timestamp: Date.now() };
      const state = Buffer.from(JSON.stringify(stateData)).toString(
        "base64url"
      ); 
      const fixedRedirectUri = `${backend_url}/api/stripe/oauth-callback`; // No query params!
      const oauthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write&state=${state}&redirect_uri=${encodeURIComponent(
        fixedRedirectUri
      )}`;

      res.json({ url: oauthUrl });
    } catch (error) {
      console.error("OAuth URL error:", error);
      res.status(500).json({ error: "Failed to generate OAuth URL to connect existing stripe account" });
    }
  }
);



module.exports = stripeRouter;

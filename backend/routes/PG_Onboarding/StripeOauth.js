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

const backend_url = process.env.SERVER_URL || "http://localhost:8000";

// Generate OAuth URL for Existing Stripe Account
stripeRouter.get(
  "/api/library/:entityId/stripe/oauth-url",
  async (req, res) => {
    try {
      const entityId = req?.user?.entityId || req?.user?.entity_id;

      const entity = await getEntityInfo(db, entityId);
      if (!entity)
        return res.status(404).json({ error: "Entity ID not found" });

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
      res
        .status(500)
        .json({
          error:
            "Failed to generate OAuth URL to connect existing stripe account",
        });
    }
  }
);

//OAuth Callback Handler
stripeRouter.get("/api/stripe/oauth-callback", async (req, res) => {
  try {
    const entityId = req?.user?.entityId || req?.user?.entity_id;

    const { code, state, error } = req.query;

    if (error || !code) {
      console.error("OAuth Callback error:", error);
      return res.redirect(
        `${process.env.CLIENT_URL}/dashboard?error=oauth-failed&details=${
          error || "No code"
        }`
      );
    }

    let entity_Id;
    try {
      const decodedState = Buffer.from(state, "base64").toString("utf8");
      const stateData = JSON.parse(decodedState);

      entity_Id = stateData?.entityId;
    } catch (decodeErr) {
      return res.redirect(
        `${process.env.CLIENT_URL}/dashboard?error=invalid-state`
      );
    }

    const entity = await getEntityInfo(db, entityId);
    if (!entity.entity_id)
      return res.status(404).json({ error: "Entity ID not found" });

    const tokenResponse = await stripe.oauth.token({
      grant_type: "authorization_code",
      code: code,
      client_secret: process.env.STRIPE_SECRET_KEY,
    });

    // console.log("oauth Token response: ", tokenResponse);

    const accountId = tokenResponse.stripe_user_id;
    if (!accountId) throw new Error("No account ID in response");

    // Retrieve account info to confirm account status
    const account = await stripe.accounts.retrieve(accountId);

    if (!account.charges_enabled) {
      return res.redirect(
        `${process.env.CLIENT_URL}/dashboard?status=pending&account=${accountId}`
      );
    }

    // Save stripe status info in DB
    await updateEntityStripeInfo(db, entityId, accountId, {
      charges_enabled: true,
      payouts_enabled: account.payouts_enabled,
    });

    res.redirect(`${process.env.CLIENT_URL}/dashboard?status=connected`);
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.redirect(
      `${process.env.CLIENT_URL}/dashboard?error=oauth-callback-failed&details=${error.message}`
    );
  }
});

module.exports = stripeRouter;

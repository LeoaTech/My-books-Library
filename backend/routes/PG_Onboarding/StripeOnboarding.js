const express = require("express");
const stripe = require("../../config/stripe");
const router = express.Router();
const db = require("../../config/dbConfig.js");
const { checkAuth } = require("../../middleware/authMiddleware.js");
const { updateEntityStripeInfo, getEntityInfo } = require("../../helpers/stripe_onbaording.js");
require("dotenv").config();

router.use(checkAuth);

router.get("/", async (req, res) => {
  const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
  try {
    const entityId = req?.user?.entityId || req?.user?.entity_id;
    const { account } = req.query;
    if (!account)
      return res.redirect(
        `${CLIENT_URL}/dashboard/profile?error=no-account`
      );
    // Get Account Details by Account ID
    const accountDetails = await stripe.accounts.retrieve(account);

    // Get User ID to update Record (required for updateEntityStripeInfo)
    const entity = await getEntityInfo(db, entityId);
    if (!entity) {
       console.error("Entity not found for ID:", entityId);
       return res.redirect(`${CLIENT_URL}/dashboard?error=entity-not-found`);
    }
    const userId = entity.user_id;

    // Verify If charges enables for the Account ID
    if (accountDetails.charges_enabled) {
      await updateEntityStripeInfo(db, userId, account, {
        ...accountDetails.metadata,
        charges_enabled: true,
        payouts_enabled: accountDetails.payouts_enabled,
      });
    } else {
      // Redirect if Account status is still pending
      return res.redirect(
        `${CLIENT_URL}/dashboard/profile?status=pending&account=${account}`
      );
    }

    res.redirect(`${CLIENT_URL}/dashboard/profile?status=connected`);
  } catch (error) {
    console.error("Stripe Onboarding completion error:", error);
    res.redirect(`${CLIENT_URL}/dashboard/profile?error=onboarding-failed`);
  }
});

module.exports = router;

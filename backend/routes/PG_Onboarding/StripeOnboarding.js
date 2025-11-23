const express = require("express");
const stripe = require("../../config/stripe");
const router = express.Router();
const { checkAuth } = require("../../middleware/authMiddleware.js");
require("dotenv").config();

router.use(checkAuth);


router.get("/", async (req, res) => {
  try {
    const { entityId } = req.user;
    const { account } = req.query; 
    if (!account)
      return res.redirect(
        `${process.env.CLIENT_URL}/dashboard?error=no-account`
      ); 
    // Get Account Details by Account ID
    const accountDetails = await stripe.accounts.retrieve(account);

    
    // Verify If charges enables for the Account ID
    if (accountDetails.charges_enabled) {
      await updateEntityStripeInfo(entityId, account, {
        ...accountDetails.metadata,
        charges_enabled: true,
        payouts_enabled: accountDetails.payouts_enabled,
        
      });
    } else {
      // Redirect if Account status is still pending
      return res.redirect(
        `${process.env.CLIENT_URL}/dashboard?status=pending&account=${account}`
      );
    }

    res.redirect(`${process.env.CLIENT_URL}/dashboard?status=connected`); 
  } catch (error) {
    console.error("Stripe Onboarding completion error:", error);
    res.redirect(`${process.env.CLIENT_URL}/dashboard?error=onboarding-failed`);
  }
});

module.exports = router;

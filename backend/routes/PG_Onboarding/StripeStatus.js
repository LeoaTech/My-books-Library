const express = require("express");
const stripe = require("../../config/stripe");
const router = express.Router();
const db = require("../../config/dbConfig.js");
const { checkAuth } = require("../../middleware/authMiddleware.js");
const { getEntityInfo } = require("../../helpers/stripe_onbaording.js");

router.use(checkAuth);
router.get("/", async (req, res) => {
  try {
    // console.log("Params", req.params);

    const { entityId } = req.user;

    const entity = await getEntityInfo(db, entityId);

    if (!entity) res.status(404).json({ error: "Library ID not found" });

    let status = "disconnected";
    let connected = false;
    const paymentMethods = entity?.user_details?.stripe;

    if (paymentMethods?.stripe_account_id) {

      const account = await stripe.accounts.retrieve(
        paymentMethods.stripe_account_id
      );

      status = account.charges_enabled ? "connected" : "pending";
      connected =
        account?.charges_enabled ||
        paymentMethods?.onboarding_complete ||
        false;
    }

    res.json({
      connected,
      account_id: paymentMethods?.stripe_account_id,
      status,
    });
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({ error: "Failed to fetch Library stripe status info" });
  }
});

module.exports = router;

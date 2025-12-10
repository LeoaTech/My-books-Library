const express = require("express");
const stripe = require("../../config/stripe.js"); 
const { checkAuth } = require("../../middleware/authMiddleware.js");

const db = require("../../config/dbConfig.js");

require("dotenv").config();

const router = express.Router();

router.use(checkAuth);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";



// API Endpoint to Checkout URL for Subscription
router.post("/", async (req, res) => {
  const user = req.user;

  const userId = user?.userId || user?.user_id;
  const entityId = req?.user?.entityId || req?.user?.entity_id;
  const subdomain =req?.user?.subdomain;

  const customerEmail = await db.query(`SELECT email from users where id =$1`, [
    userId,
  ]);

  const userEmail = customerEmail?.rows[0]?.email;
  const { priceId , planName} = req.body;

  if (!priceId) {
    return res.status(400).json({ error: "priceId is required" });
  }

  try {

     const existingSub = await db.query(
      `SELECT id, status, stripe_price_id 
       FROM client_subscription 
       WHERE user_id = $1 
         AND status IN ('active', 'past_due') 
       LIMIT 1`,
      [userId]
    );

    if (existingSub.rows.length > 0) {
      return res.status(409).json({ 
        error: 'User already has an active subscription.', 
        current_plan: existingSub.rows[0].stripe_price_id 
      });
    }
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: userEmail,
      line_items: [
        {
          price: priceId, 
          quantity: 1,
        },
      ],
      metadata: {
        user_type: "client",
        entityId,
        subdomain,
        app_client_id: userId, 
        planName:planName
      },
      client_reference_id: userId,
      success_url: `${CLIENT_URL}/${subdomain}/success`,
      cancel_url: `${CLIENT_URL}/pricing?payment=canceled`,
    });
    // console.log(session, "Checkout session");
    res.json({ url: session.url });
  } catch (e) {
    console.error("Stripe session creation failed:", e);
    res.status(500).json({ error: "Could not create payment session." });
  }
});

module.exports = router;

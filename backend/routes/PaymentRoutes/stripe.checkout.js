// Install Stripe: npm install stripe
const express = require("express");
const stripe = require("../../config/stripe.js"); // Use your Stripe secret key
const { checkAuth } = require("../../middleware/authMiddleware");

const db = require("../../config/dbConfig.js");

require("dotenv").config();

const router = express.Router();

router.use(checkAuth);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

router.post("/", async (req, res) => {
  const user = req.user;

  // console.log(req.user, "User ");

  const userId = user?.userId || user?.user_id;
  const entityId = req?.user?.entityId || req?.user?.entity_id;
  const subdomain =req?.user?.subdomain;

  const customerEmail = await db.query(`SELECT email from users where id =$1`, [
    userId,
  ]);
  // console.log(req.body, "priceId");

  const userEmail = customerEmail?.rows[0]?.email;
  // 2. Get the price ID from the frontend request
  const { priceId } = req.body;

  if (!priceId) {
    return res.status(400).json({ error: "priceId is required" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: userEmail,
      line_items: [
        {
          price: priceId, // The ID of the plan
          quantity: 1,
        },
      ],
      metadata: {
        user_type: "client",
        entityId,
        subdomain,
        app_client_id: userId, 
      },
      client_reference_id: userId,
      success_url: `${CLIENT_URL}/${subdomain}/success`,
      cancel_url: `${CLIENT_URL}/pricing?payment=cancelled`,
    });
    // console.log(session, "Checkout session");
    res.json({ url: session.url });
  } catch (e) {
    console.error("Stripe session creation failed:", e);
    res.status(500).json({ error: "Could not create payment session." });
  }
});

module.exports = router;

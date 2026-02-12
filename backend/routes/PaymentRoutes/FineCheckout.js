const express = require("express");
const stripe = require("../../config/stripe.js");
const { checkAuth } = require("../../middleware/authMiddleware.js");
const db = require("../../config/dbConfig.js");
const { getEntityInfo } = require("../../helpers/stripe_onbaording.js");
require("dotenv").config();

const router = express.Router();

router.use(checkAuth);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

router.post("/", async (req, res) => {
  const user = req.user;
  const userId = user?.userId || user?.user_id;
  const entityId = user?.entityId || user?.entity_id;
 
  const { bookingId, fineAmount, bookTitle, targetEntityId } = req.body;
  
  if (!bookingId || !fineAmount) {
      return res.status(400).json({ error: "Booking ID and Fine Amount are required" });
  }

  const libraryEntityId = targetEntityId || entityId;

  if (!libraryEntityId) {
      return res.status(400).json({ error: "Library Identifier (Entity ID) is missing" });
  }

  try {
      const entityInfo = await getEntityInfo(db, libraryEntityId);
      
      const stripeAccountId = entityInfo?.user_details?.stripe?.stripe_account_id;
      const subdomain = entityInfo?.user_details?.stripe?.stripe_info?.business_profile?.name || "library"; 

      if (!stripeAccountId) {
          return res.status(400).json({ error: "This library has not set up payments yet." });
      }
      const userRes = await db.query("SELECT email FROM users WHERE id = $1", [userId]);
      const userEmail = userRes.rows[0]?.email;

      const session = await stripe.checkout.sessions.create({
          mode: "payment",
          payment_method_types: ["card"],
          customer_email: userEmail,
          line_items: [
              {
                  price_data: {
                      currency: "usd", 
                      product_data: {
                          name: `Overdue Fine for Book : ${bookTitle || "Library Book"}`,
                          description: `Fine payment for booking #${bookingId}`,
                      },
                      unit_amount: Math.round(fineAmount * 100), 
                  },
                  quantity: 1,
              },
          ],
          metadata: {
              type: "fine",
              booking_id: bookingId,
              user_id: userId,
              entity_id: libraryEntityId,
              book_title: bookTitle,
          },
          client_reference_id: userId,
          success_url: `${CLIENT_URL}/${subdomain}/bookings?status=success&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${CLIENT_URL}/${subdomain}/bookings?status=canceled`,
          payment_intent_data: {
            application_fee_amount: Math.round(fineAmount * 100 * 0.05), 
            transfer_data: {
              destination: stripeAccountId,
            },
          },
      });

      res.json({ url: session.url });

  } catch (error) {
      console.error("Error creating fine checkout session:", error);
      res.status(500).json({ error: "Failed to initiate fine payment." });
  }
});

module.exports = router;


const express = require("express");
const stripe = require("../../config/stripe");
const router = express.Router();
const db = require("../../config/dbConfig.js");
const { getEntityInfo, updateEntityStripeInfo } = require("../../helpers/stripe_onbaording.js");
const { checkAuth } = require("../../middleware/authMiddleware.js");

router.use(checkAuth);
router.post('/', async (req, res) => {
    
  try {
    const { entityId } = req.user;
    const entity = await getEntityInfo(db,entityId);
    if (!entity) return res.status(404).json({ error: 'Entity ID not found' });

    const userId= entity?.user_id;
    let accountId = entity?.user_details?.stripe?.stripe_account_id;

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express', 
        country: 'US', 
        email: entity.email, 
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        individual: {
          full_name: entity.name || '',       
          email: entity.email,
        },
      });
      
      accountId = account.id;
      // Saved the stripe account info in db
      await updateEntityStripeInfo(db,userId, accountId,  account);
    }

    // Generate onboarding link (Stripe's pre-built hosted UI)
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${req.headers.origin}/entitys/${entityId}/stripe/reauth`, 
      return_url: `${req.headers.origin}/api/library/${entityId}/stripe/onboarding-complete?account=${accountId}`,
      type: 'account_onboarding',
    });

    // console.log(accountLink, "Account  On-boadridng link");
    

    res.json({ url: accountLink.url });
  } catch (error) {
    console.error('Stripe connect error:', error);
    res.status(500).json({ error: 'Failed to initiate Stripe connection' });
  }
});


module.exports = router;
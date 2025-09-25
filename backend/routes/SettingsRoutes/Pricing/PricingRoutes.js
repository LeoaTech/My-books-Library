const express = require("express");
const { checkAuth } = require("../../../middleware/authMiddleware");
const { FetchPricingPlans } = require("../../../controllers/SettingsController/Pricing.Controller");

const router = express.Router();
// Verify User Authentication (Logged-in users can see this route)
router.use(checkAuth);

//Get: fetch pricing plans List
router.get("/", FetchPricingPlans);


module.exports = router;

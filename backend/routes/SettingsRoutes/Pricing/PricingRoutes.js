const express = require("express");
const { checkAuth } = require("../../../middleware/authMiddleware");
const { FetchPricingPlans, CreatePlan , UpdatePlan, DeletePlan} = require("../../../controllers/SettingsController/Pricing.Controller");

const router = express.Router();
// Verify User Authentication (Logged-in users can see this route)
router.use(checkAuth);

//Get: fetch pricing plans List
router.get("/", FetchPricingPlans);

// Post: Add New Plan
router.post("/create", CreatePlan);

// PUT:Update Plan details

router.put("/update/:plan_id", UpdatePlan);


// Delete: remove a Pricing Plan

router.delete("/delete/:plan_id", DeletePlan);

module.exports = router;

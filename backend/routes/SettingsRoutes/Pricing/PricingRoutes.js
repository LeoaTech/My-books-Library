const express = require("express");
const { checkAuth } = require("../../../middleware/authMiddleware");
const { FetchPricingPlans, UpdatePlan, DeletePlan, CreateDualPlan, UpdateSortingOrder} = require("../../../controllers/SettingsController/Pricing.Controller");

const router = express.Router();

// Verify user auth status
router.use(checkAuth);

//Get: fetch pricing plans List
router.get("/", FetchPricingPlans);

// Post: Add New Plan
router.post("/create", CreateDualPlan);

// PUT: Update Plan details
router.put("/update/:plan_id", UpdatePlan);

// PUT: Update Plan sorting order
router.put("/update-order", UpdateSortingOrder);


// Delete: remove a Pricing Plan

router.delete("/delete/:plan_id", DeletePlan);

module.exports = router;

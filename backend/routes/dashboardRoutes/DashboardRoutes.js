const { Router } = require("express");
const { checkAuth } = require("../../middleware/authMiddleware");
const {getDashboardMetrics} = require("../../controllers/dashboardController/DashboardController.js")
const router = Router();
router.use(checkAuth)
router.get("/", getDashboardMetrics);

module.exports = router;

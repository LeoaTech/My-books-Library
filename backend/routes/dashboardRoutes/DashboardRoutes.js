const { Router } = require("express");
const getDashboardMetrics = require("../../controllers/dashboardController/DashboardController");
const { checkAuth } = require("../../middleware/authMiddleware");

const router = Router();
router.use(checkAuth)
router.get("/", getDashboardMetrics);

module.exports = router;

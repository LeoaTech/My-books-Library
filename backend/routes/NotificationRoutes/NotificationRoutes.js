const express = require("express");
const router = express.Router();
const { checkAuth } = require("../../middleware/authMiddleware"); // Your auth funcs
const { fetchTemplates, UpdateTemplate } = require("../../controllers/NotificationController/NotificationTemplateController");

router.use(checkAuth);

// Templates API Routes
router.get("/template",fetchTemplates);
router.post("/template",UpdateTemplate)

module.exports = router;

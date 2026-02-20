const express = require('express');
const { addCustomColorScheme } = require('../../controllers/ColorsController/Colors.Controller');
const { checkAuth } = require("../../middleware/authMiddleware");

const router = express.Router();

router.use(checkAuth)

router.post('/:entityId', addCustomColorScheme);

module.exports = router;
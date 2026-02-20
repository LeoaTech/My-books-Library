const express = require('express');
const { getCustomColorSchemes, addCustomColorScheme } = require('../../controllers/ColorsController/Colors.Controller');
const { checkAuth } = require("../../middleware/authMiddleware");

const router = express.Router();

router.use(checkAuth)

router.post('/:entityId', addCustomColorScheme);
router.get('/:entityId', getCustomColorSchemes);


module.exports = router;
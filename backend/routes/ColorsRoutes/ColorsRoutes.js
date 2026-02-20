const express = require('express');
const { getCustomColorSchemes, addCustomColorScheme, updateCustomColorScheme } = require('../../controllers/ColorsController/Colors.Controller');
const { checkAuth } = require("../../middleware/authMiddleware");

const router = express.Router();

router.use(checkAuth)

router.post('/:entityId', addCustomColorScheme);
router.get('/:entityId', getCustomColorSchemes);
router.put('/:entityId/:themeId', updateCustomColorScheme);

module.exports = router;
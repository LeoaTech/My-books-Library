const express = require("express");
const requiredAuth = require("../../middleware/authMiddleware.js");
// require("../../controllers/AuthController/GoogleAuth.js");

const router = express.Router();

router.get("/", requiredAuth, (req, res) => {
  res.send("Welcome to Book requests");
});


module.exports =router
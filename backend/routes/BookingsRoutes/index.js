
const { Router} = require("express");
const BookingRouter = require("./BookingRoutes.js");
const router = Router();



router.use("/api/bookings", BookingRouter);


module.exports= router;
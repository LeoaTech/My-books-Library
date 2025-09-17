const { Router } = require("express");
const {
  getBookings,
  CreateBooking,
} = require("../../controllers/BookingController/Booking.Controller");
const { checkAuth } = require("../../middleware/authMiddleware");
const router = Router();

router.use(checkAuth);

router.get("/", getBookings);
router.post("/create", CreateBooking);

module.exports = router;

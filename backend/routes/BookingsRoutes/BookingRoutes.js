const { Router } = require("express");
const {
  getBookings,
  CreateBooking,
} = require("../../controllers/BookingController/Booking.Controller");

const router = Router();

router.get("/", getBookings);
router.post("/create", CreateBooking);

module.exports = router;

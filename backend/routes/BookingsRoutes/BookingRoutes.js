const { Router } = require("express");
const {
  getBookings,
  CreateBooking,
  UpdateBooking,
  DeleteBooking
} = require("../../controllers/BookingController/Booking.Controller");
const { checkAuth } = require("../../middleware/authMiddleware");
const router = Router();

router.use(checkAuth);

router.get("/", getBookings);

router.post("/create", CreateBooking);


router.put("/update/:booking_id", UpdateBooking);


router.delete("/delete/:booking_id", DeleteBooking);

module.exports = router;

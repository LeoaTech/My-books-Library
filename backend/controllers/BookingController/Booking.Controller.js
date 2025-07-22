const asyncHanlder = require("express-async-handler");
const db = require("../../config/dbConfig.js");

/* Get ALL Bookings Details */
const getBookings = asyncHanlder(async (req, res) => {
  try {
    const BookingsQuery = `SELECT * FROM bookings`;
    const bookingsQueryResponse = await db.query(BookingsQuery);

    res.status(200).json({
      bookings: bookingsQueryResponse?.rows || [],
      message: "Bookings Data retrieved Successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        bookings: [],
        message: error.message || "Failed to get Bookings details",
      });
  }
});

/* Create New Bookngs */

const CreateBooking = asyncHanlder(async (req, res) => {
  console.log(req.body);
  try {
    // const createBookingQuery = await db.query(
    //   `INSERT INTO bookings (name) VALUES ($1)`,
    //   [req.body.name]
    // );

    // console.log(createBookingQuery?.rows[0], "Booking added");

    res.status(200).json({
    //   booking: createBookingQuery?.rows[0],
      message: "New Booking Added ",
    });
  } catch (error) {
    console.log(error, "Error creating new Booking");
  }
});

/* Fetch Booking Details By ID */


module.exports = {getBookings, CreateBooking };

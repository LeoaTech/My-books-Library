const asyncHanlder = require("express-async-handler");
const db = require("../../config/dbConfig.js");

/* Get ALL Bookings Details */
const getBookings = asyncHanlder(async (req, res) => {
  const entityId = req?.user?.entityId || req.user?.entity_id;

  if (!entityId) {
    res.send(400).json({ message: "Invalid Request, No Library ID provided" });
  }
  try {
    const BookingsQuery = `SELECT * FROM bookings where entity_id =$1`;
    const bookingsQueryResponse = await db.query(BookingsQuery, [entityId]);

    res.status(200).json({
      bookings: bookingsQueryResponse?.rows || [],
      message: "Bookings Data retrieved Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      bookings: [],
      message: error.message || "Failed to get Bookings details",
    });
  }
});

/* Create New Bookngs */

const CreateBooking = asyncHanlder(async (req, res) => {
  console.log(req.body);
  const entityId = req?.user?.entityId || req.user?.entity_id;
  if (!entityId) {
    res.send(400).json({ message: "Invalid Request, No Library ID provided" });
  }
  try {
    const { bookingForm } = req.body;
    const {
      user_id,
      vendor_id,
      items,
      borrow_date,
      return_due,
      return_date,
      status,
      shipping_address,
      shipping_city,
      shipping_country,
      shipping_phone,
      credits_used,
      renewed,
    } = bookingForm;

    const itemsJson = JSON.stringify(items);

    const createBookingQuery = await db.query(
      `INSERT INTO bookings (user_id, vendor_id, items, 
      borrow_date, return_due,return_date,booking_status,
       shipping_address,shipping_city, shipping_country,
       shipping_phone,credits_used,entity_id )
      VALUES ($1,$2, $3, $4, $5, $6, $7, $8, $9,$10, $11, $12, $13)`,
      [
        user_id,
        vendor_id,
        itemsJson,
        borrow_date,
        return_due,
        return_date,
        status,
        shipping_address,
        shipping_city,
        shipping_country,
        shipping_phone,
        credits_used,
        entityId,
      ]
    );

    console.log(createBookingQuery?.rows[0], "Booking added");

    res.status(200).json({
      booking: createBookingQuery?.rows[0],
      message: "New Booking Added ",
    });
  } catch (error) {
    console.log(error, "Error creating new Booking");
    res.status(500).json({
      error: error,
      message: "Failed to Issue books ",
    });
  }
});

/* Fetch Booking Details By ID */

module.exports = { getBookings, CreateBooking };

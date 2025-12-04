const asyncHandler = require("express-async-handler");
const db = require("../../config/dbConfig.js");
const { pushQueue, emailQueue } = require("../../queues/index.js");

const queryBooking = `SELECT 
    b.id AS booking_id,
    b.user_id,
    b.vendor_id,
    b.items,
    b.borrow_date,
    b.return_due,
    b.return_date,
    b.renew_return_date,
    b.renewed,
    b.booking_status,
    b.shipping_address,
    b.shipping_city,
    b.shipping_country,
    b.shipping_phone,
    b.credits_used,
    b.entity_id,
    b.created_at AS booking_created_at,
    b.updated_at AS booking_updated_at,
    u.id AS user_id,
    u.name AS user_name,
    u.email AS email,
    v.id AS vendor_id,
    v.name AS vendor_name
    -- Add other vendor fields as needed
FROM bookings b
LEFT JOIN users u ON b.user_id = u.id
LEFT JOIN vendors v ON b.vendor_id = v.id
WHERE entity_id =$1`;

/* Get ALL Bookings Details */
const getBookings = asyncHandler(async (req, res) => {
  const entityId = req?.user?.entityId || req.user?.entity_id;

  if (!entityId) {
    res.send(400).json({ message: "Invalid Request, No Library ID provided" });
  }
  try {
    const bookingsQueryResponse = await db.query(queryBooking, [entityId]);

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

const CreateBooking = asyncHandler(async (req, res) => {
  console.log(req.body);
  const entityId = req?.user?.entityId || req.user?.entity_id;
  const userId = req?.user?.userId || req.user?.user_id;

  if (!entityId) {
    res.send(400).json({ message: "Invalid Request, No Library ID provided" });
  }
  try {
    const { bookingForm } = req.body;
    const {
      user_id,
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
    } = bookingForm;

    const itemsJson = JSON.stringify(items);

    const createBookingQuery = await db.query(
      `INSERT INTO bookings (user_id, vendor_id, items, 
      borrow_date, return_due,return_date,booking_status,
       shipping_address,shipping_city, shipping_country,
       shipping_phone,credits_used,entity_id )
      VALUES ($1,$2, $3, $4, $5, $6, $7, $8, $9,$10, $11, $12, $13) RETURNING *`,
      [
        user_id,
        null,
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

    const bookingData = createBookingQuery?.rows[0];

    if (createBookingQuery.rowCount > 0) {
      const userTokenQuery = `
    SELECT 
    uft.token,
    u.name,
    u.email
    FROM users u
  LEFT JOIN user_fcm_tokens uft 
    ON uft.user_id = u.id
  WHERE u.id = $1`;
      const userTokenResult = await db.query(userTokenQuery, [user_id]);

      let userInfo = userTokenResult?.rows[0];
      await emailQueue.add("booking-created-email", {
        to: userInfo?.email,
        entityId,
        userData: userInfo,
        bookingData,
      });
      const userTokens = userTokenResult.rows.map((row) => row?.token);
      if (userTokens.length > 0) {
        await pushQueue.add("booking-created-push", {
          tokens: userTokens,
          userData,
          bookingData,
        });
      }
    }
    res.status(200).json({
      booking: bookingData,
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

/* Update Booking Details */

const UpdateBooking = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const entityId = req?.user?.entityId || req.user?.entity_id;
  if (!entityId) {
    res.send(400).json({ message: "Invalid Request, No Library ID provided" });
  }

  // console.log(req.params);

  try {
    const { bookingForm } = req.body;

    const {
      user_id,
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
      renew_return_date,
      booking_id,
    } = bookingForm;

    const itemsJson = JSON.stringify(items);

    const updateBookingQuery = await db.query(
      `UPDATE bookings SET 
      user_id=$1, vendor_id =$2, items=$3, 
      borrow_date=$4, return_due=$5,return_date=$6,booking_status=$7,
       shipping_address=$8,shipping_city=$9, shipping_country=$10,
       shipping_phone=$11,credits_used=$12,renewed=$13,
      renew_return_date =$14 
       WHERE entity_id=$15 AND id =$16 RETURNING * `,
      [
        user_id,
        null,
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
        renewed,
        renew_return_date,
        entityId,
        booking_id,
      ]
    );

    // console.log(updateBookingQuery?.rows[0], "Booking details updated");

    res.status(200).json({
      booking: updateBookingQuery?.rows[0],
      message: "Booking details updated ",
    });
  } catch (error) {
    console.log(error, "Error updating Booking details");
    res.status(500).json({
      error: error,
      message: "Failed to update booking details ",
    });
  }
});

/* Delete Booking */

const DeleteBooking = asyncHandler(async (req, res) => {
  const { booking_id } = req.params;
  const entityId = req?.user?.entityId || req.user?.entity_id;
  if (!entityId) {
    res.send(400).json({ message: "Invalid Request, No Library ID provided" });
  }
  try {
    // Delete booking from DB
    const deleteQuery = await db.query(
      `DELETE FROM bookings WHERE id=$1 AND entity_id=$2 returning id`,
      [booking_id, entityId]
    );

    // console.log(deleteQuery?.rowCount, "Deleted");

    if (deleteQuery?.rowCount > 0) {
      res.status(200).json({ message: "Booking deleted Suuccessfully" });
    } else {
      res.status(204).json({ message: "Failed To Delete Booking" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = { getBookings, CreateBooking, UpdateBooking, DeleteBooking };

const { pool } = require("../config/dbConfig");
const { emailQueue, pushQueue } = require("../queues/index");

async function checkOverdueStatusAndFine() {
  const client = await pool.connect();
  try {
    // console.log('Running overdue staus check for all bookings for all tenants...');

    const query = `
        UPDATE bookings
        SET items = (
            SELECT jsonb_agg(
                CASE 
                    WHEN 
                        (item->>'status') NOT IN ('returned', 'cancelled') 
                        AND (item->>'return_due')::date < CURRENT_DATE
                    THEN
                        jsonb_set(
                            jsonb_set(
                                jsonb_set(item, '{status}', '"overdue"'),
                                '{is_fine_applied}', 'true'::jsonb
                            ),
                            '{overdue_fine}', 
                            to_jsonb(
                                (
                                    COALESCE(
                                        (SELECT late_returns_fine FROM settings s WHERE s.entity_id = bookings.entity_id),
                                        200
                                    )::numeric
                                    * 
                                    (CURRENT_DATE - (item->>'return_due')::date)
                                )
                            )
                        )
                    ELSE item
                END
            )
            FROM jsonb_array_elements(bookings.items) AS item
        )
        WHERE booking_status NOT IN ('returned', 'cancelled')
        AND EXISTS (
            SELECT 1 
            FROM jsonb_array_elements(bookings.items) AS item
            WHERE 
                (item->>'status') NOT IN ('returned', 'cancelled')
                AND (item->>'return_due')::date < CURRENT_DATE
        );
    `;

    const result = await client.query(query);
    // console.log(
    //   `Overdue fines applied to ${result.rowCount} bookings across all tenants.`
    // );
  } catch (error) {
    console.error("Error applying overdue fines :", error);
  } finally {
    client.release();
  }
}

// Check upcoming due dates in all booking
async function checkUpcomingDueDates() {
  const client = await pool.connect();
  try {
    // console.log("Checking for upcoming due dates...");

    const query = `
      SELECT 
        b.id as booking_id,
        b.entity_id,
        b.user_id,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone,
        items.item->>'title' as book_title,
        items.item->>'return_due' as return_due,
        e.name as entity_name,
        e.subdomain
      FROM bookings b
      CROSS JOIN jsonb_array_elements(b.items) as items(item)
      JOIN users u ON b.user_id = u.id
      LEFT JOIN entities e ON b.entity_id = e.id
      WHERE 
        (items.item->>'status') NOT IN ('returned', 'cancelled')
        AND (items.item->>'return_due')::date = CURRENT_DATE + INTERVAL '2 days'
    `;

    const result = await client.query(query);

    if (result.rowCount === 0) {
      // console.log("No bookings found with return due date in coming 2 days.");
      return;
    }

    // console.log(
    //   `Found ${result.rowCount} booking items return due in 2 days. sending reminders...`
    // );

    const bookingsMap = new Map();

    for (const row of result.rows) {
      if (!bookingsMap.has(row.booking_id)) {
        bookingsMap.set(row.booking_id, {
          userData: {
            name: row.user_name,
            email: row.user_email,
            phone: row.user_phone,
            entity_name: row.entity_name,
            subdomain: row.subdomain,
            entity_id: row.entity_id,
          },
          entityId: row.entity_id,
          bookingData: { id: row.booking_id, user_id: row.user_id },
          book_title: row.book_title,
          due_date: new Date(row.return_due).toLocaleString(),
          books: [],
        });
      }
      bookingsMap.get(row.booking_id).books.push({
        title: row.book_title,
        due_date: new Date(row.return_due).toLocaleString(),
      });
    }

    for (const [bookingId, data] of bookingsMap) {
      const emailData = {
        userData: data.userData,
        entityId: data.entityId,
        book_title: data.book_title,
        due_date: new Date(data.due_date).toLocaleString(),
        books: data.books,
        bookingData: data.bookingData,
        to: data.userData.email,
      };

      await emailQueue.add("booking-due-reminder-email", emailData);

      // added push job to send reminder
      await pushQueue.add("booking-due-reminder-push", {
        ...emailData,
        userId: data?.bookingData?.user_id,
      });
    }

    // console.log(
    //   `Reminder jobs added successfully for ${bookingsMap.size} bookings in queues.`
    // );
  } catch (error) {
    console.error("Error checking upcoming due dates:", error);
  } finally {
    client.release();
  }
}

//Check Late Returns / Overdue Fine Payments for Bookings
async function checkFineReminders() {
  const client = await pool.connect();
  try {
    // console.log("Checking for Pending fine payment reminders...");

    const query = `
      SELECT 
        b.id as booking_id,
        b.entity_id,
        b.user_id,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone,
        items.item->>'title' as book_title,
        items.item->>'return_due' as return_due,
        items.item->>'return_date' as return_date,
        items.item->>'overdue_fine' as fine_amount,
        items.item->>'status' as item_status,
        e.name as entity_name,
        e.subdomain
      FROM bookings b
      CROSS JOIN jsonb_array_elements(b.items) as items(item)
      JOIN users u ON b.user_id = u.id
      LEFT JOIN entities e ON b.entity_id = e.id
      WHERE 
        (items.item->>'overdue_fine')::numeric > 0
        AND (
            (
                (items.item->>'status') = 'overdue' 
                AND (items.item->>'return_due')::date = CURRENT_DATE - INTERVAL '1 day'
            )
            OR 
            (
                (items.item->>'status') = 'returned' 
                AND (items.item->>'return_date')::date = CURRENT_DATE - INTERVAL '1 day'
            )
        )
    `;

    const result = await client.query(query);

    if (result.rowCount === 0) {
      // console.log("No fine reminders to send.");
      return;
    }
    // console.log(
    //   `Pending ${result.rowCount} items for fine pament reminders. Sending reminders...`
    // );


     const bookingsMap = new Map();

    for (const row of result.rows) {
        if (!bookingsMap.has(row.booking_id)) {
            bookingsMap.set(row.booking_id, {
                userData: {
                    name: row.user_name,
                    email: row.user_email,
                    phone: row.user_phone,
                    entity_name: row.entity_name,
                    subdomain: row.subdomain,
                    entity_id: row.entity_id
                },
                entityId: row.entity_id,
                bookingData: { id: row.booking_id, user_id: row.user_id },
                books: [],
                total_fine: 0
            });
        }
        
        const fine = parseFloat(row.fine_amount) || 0;
        bookingsMap.get(row.booking_id).books.push({
            title: row.book_title,
            fine: fine.toFixed(2),
            status: row.item_status
        });
        bookingsMap.get(row.booking_id).total_fine += fine;
    }

    for (const [bookingId, data] of bookingsMap) {
        const emailData = {
            userData: data.userData,
            entityId: data.entityId,
            books: data.books,
            total_fine: data.total_fine.toFixed(2),
            bookingData: data.bookingData,
            to: data.userData.email
        };

        await emailQueue.add("fine-payment-reminder-email", emailData);
    }

    // console.log(`Pending Fine reminders added for ${bookingsMap.size} bookings into the worker queue.`);

  } catch (error) {
    // console.error("Error checking fine payment reminders:", error);
  } finally {
    client.release();
  }
}

module.exports = {
  checkUpcomingDueDates,
  checkOverdueStatusAndFine,
  checkFineReminders,
};

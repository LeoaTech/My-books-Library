const {pool} = require("../config/dbConfig");

async function checkOverdueStatusAndFine() {
  const client = await pool.connect();
  try {
    console.log('Running overdue staus check for all bookings for all tenants...');
    
    const query = `
        UPDATE bookings
        SET items = (
            SELECT jsonb_agg(
                CASE 
                    WHEN 
                        (item->>'status') NOT IN ('returned', 'cancelled') 
                        AND (item->>'is_fine_applied')::boolean IS DISTINCT FROM true
                        AND (item->>'return_due')::date < CURRENT_DATE
                    THEN
                        jsonb_set(
                            jsonb_set(
                                jsonb_set(item, '{status}', '"overdue"'),
                                '{is_fine_applied}', 'true'::jsonb
                            ),
                            '{overdue_fine}', 
                            to_jsonb(
                                COALESCE(
                                    (SELECT late_returns_fine FROM settings s WHERE s.entity_id = bookings.entity_id),
                                    200
                                )::numeric
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
                AND (item->>'is_fine_applied')::boolean IS DISTINCT FROM true
                AND (item->>'return_due')::date < CURRENT_DATE
        );
    `;

    const result = await client.query(query);
    console.log(`Overdue fines applied to ${result.rowCount} bookings across all tenants.`);
  } catch (error) {
    console.error("Error applying overdue fines :", error);
  } finally {
    client.release();
  }
}


module.exports = {  checkOverdueStatusAndFine };

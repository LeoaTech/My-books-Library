const dbConfig = require("../config/dbConfig");


async function getFineForLateReturnItems(entityId) {
  try {
    const result = await dbConfig.query(
      `SELECT late_returns_fine FROM settings WHERE entity_id = $1 LIMIT 1`,
      [entityId]
    );

    if (result.rowCount === 0) {
      console.warn(` No fine settings found for entity_id=${entityId}.`);
      return 200;
    }
    // return fine amount from the settings of library
    return parseFloat(result.rows[0].late_returns_fine) || 0;
  } catch (error) {
    console.error(`Error fetching fine amount for entity ${entityId}:`, error);
    return 0;
  }
}

async function checkOverdueStatusAndFine() {
  try {
    const entities = await dbConfig.query(
      `SELECT DISTINCT entity_id FROM bookings`
    );
    if (entities.rowCount === 0) {
      console.log("No entity_ids found in bookings.");
      return;
    }

    // When entities exists
    for (const row of entities.rows) {
      const entityId = row.entity_id;

      console.log(entityId,"EntityId");
      

      // Get fine amount from settings or a default fine amount
      const FIXED_FINE_AMOUNT = await getFineForLateReturnItems(entityId);
      console.log(
        `Got the Library =${entityId} with fine=${FIXED_FINE_AMOUNT}`
      );

      // Apply fine only for overdue items in this entity

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
              '{overdue_fine}', to_jsonb($1::numeric)
            )
          ELSE item
        END
      )
      FROM jsonb_array_elements(bookings.items) AS item
    )
     WHERE entity_id = $2
          AND booking_status NOT IN ('returned', 'cancelled')
      AND EXISTS (
        SELECT 1 
        FROM jsonb_array_elements(bookings.items) AS item
        WHERE 
          (item->>'status') NOT IN ('returned', 'cancelled')
          AND (item->>'is_fine_applied')::boolean IS DISTINCT FROM true
          AND (item->>'return_due')::date < CURRENT_DATE
      );
  `;

      const result = await dbConfig.query(query, [FIXED_FINE_AMOUNT, entityId]);
      console.log(`Overdue fines applied to ${result.rowCount} bookings.`);
    }
  } catch (error) {
    console.error("Error applying overdue fines :", error);
  }
}


module.exports = { checkOverdueStatusAndFine };

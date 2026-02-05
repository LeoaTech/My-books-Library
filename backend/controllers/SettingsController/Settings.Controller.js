const asyncHandler = require("express-async-handler");
const db = require("../../config/dbConfig");

/* Get ALL Settings */
const FetchSettings = asyncHandler(async (req, res) => {
  const entityId = req?.user?.entityId || req?.user?.entity_id;

  if (!entityId) {
    return res.status(403).json("Invalid Request, No Library ID provided");
  }
  try {
    const SettingsQuery = `SELECT * FROM settings WHERE entity_id =$1`;
    const getSettings = await db.query(SettingsQuery, [entityId]);

    res.status(200).json({
      settings: getSettings?.rows,
      message: "Settings Found ",
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      message: error.message || "Failed to fetch library settings",
    });
  }
});

/* Update Settings */

const UpdateSettings = asyncHandler(async (req, res) => {
  const entityId = req?.user?.entityId || req?.user?.entity_id;

  if (!entityId) {
    return res.status(403).json("Invalid Request, No Library ID provided");
  }

  const checkSettingsExist = await db.query(
    `Select id from settings where entity_id =$1`,
    [entityId],
  );

  try {
    if (!req.body) {
      return res.status(400).json("Invalid Settings Details");
    }

    const {
      allow_select_booking_date,
      default_booking_duration,
      allow_purchase,
      allow_borrow,
      consecutive_renewals,
      late_returns_fine,
    } = req.body;

    if (checkSettingsExist.rowCount === 0) {
      const createNewSettingsQuery = await db.query(
        `INSERT INTO settings (allow_select_booking_date,
    default_booking_duration,
    allow_purchase,
    allow_borrow,
    consecutive_renewals,
    late_returns_fine,
     entity_id) VALUES ($1,$2,$3, $4, $5,$6,$7)`,
        [
          allow_select_booking_date,
          default_booking_duration,
          allow_purchase,
          allow_borrow,
          consecutive_renewals,
          late_returns_fine,
          entityId,
        ],
      );
    } else {
      const updateSettingsQuery = await db.query(
        `UPDATE settings SET 
    allow_select_booking_date =$1,
    default_booking_duration =$2,
    allow_purchase =$3,
    allow_borrow =$4,
    consecutive_renewals =$5,
    late_returns_fine =$6
    Where 
       id=$7 
    AND entity_id=$8 RETURNING id`,
        [
          allow_select_booking_date,
          default_booking_duration,
          allow_purchase,
          allow_borrow,
          consecutive_renewals,
          late_returns_fine,
          checkSettingsExist?.rows[0]?.id,
          entityId,
        ],
      );
    }

    res.status(200).json({
      message: "Settings Updated Successfully ",
    });
  } catch (error) {
    // console.log(error, "Error saving settings");
    res.status(500).json({
      error,
      message: error.message || "Error saving settings",
    });
  }
});

module.exports = { FetchSettings, UpdateSettings };

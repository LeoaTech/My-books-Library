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
    console.log(error);
  }
});

module.exports = { FetchSettings };

const { pool } = require("../../config/dbConfig");
const SYSTEM_DEFAULTS = require("../../config/SystemDefaultTemplates");
const {connection}= require("../../config/redisConfig");


const fetchTemplates = async (req, res) => {
  const { entityId } = req.user;

  try {
    const query = `
      SELECT * FROM notification_templates 
      WHERE entity_id = $1
    `;
    const result = await pool.query(query, [entityId]);

    const dbSavedTemplates = result.rows;

    const allEvents = Object.keys(SYSTEM_DEFAULTS).map((key) => {
      const def = SYSTEM_DEFAULTS[key];

      return {
        event: key,
        ...def,
        id: null,
        is_active: true,
      };
    });

    allEvents.forEach((defaultTpl) => {
      const alreadyExists = dbSavedTemplates.find(
        (dbTpl) =>
          dbTpl.event === defaultTpl.event &&
          dbTpl.channel === defaultTpl.channel
      );

      if (!alreadyExists) {
        dbSavedTemplates.push(defaultTpl);
      }
    });

    dbSavedTemplates.sort((a, b) => a.event.localeCompare(b.event));

    res.json(dbSavedTemplates);
  } catch (error) {
    console.error("Fetch Template Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



module.exports = { fetchTemplates };

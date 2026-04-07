const { pool } = require("../../config/dbConfig");
const SYSTEM_DEFAULTS = require("../../config/SystemDefaultTemplates");
const { connection } = require("../../config/redisConfig");

const fetchTemplates = async (req, res) => {
  try {
    const entityId = req?.user?.entityId || req?.user?.entity_id;

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
          dbTpl.channel === defaultTpl.channel,
      );

      if (!alreadyExists) {
        dbSavedTemplates.push(defaultTpl);
      }
    });

    const finalTemplates = dbSavedTemplates
      .filter((template) => !template.event.startsWith("saas"))
      .sort((a, b) => a.event.localeCompare(b.event));

    res.json(finalTemplates);
  } catch (error) {
    console.error("Fetch Template Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const UpdateTemplate = async (req, res) => {
  const { event, channel, subject, body, is_active } = req.body;

  try {
    const entityId = req?.user?.entityId || req?.user?.entity_id;

    const query = `
      INSERT INTO notification_templates (entity_id, channel, event, subject, body, is_active, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (entity_id, channel, event) 
      DO UPDATE SET 
        subject = EXCLUDED.subject,
        body = EXCLUDED.body,
        is_active = EXCLUDED.is_active,
        updated_at = NOW()
      RETURNING *;
    `;

    const values = [entityId, channel, event, subject, body, is_active];
    const result = await pool.query(query, values);

    const cacheKey = `template:${entityId}:${channel}:${event}`;
    await connection.del(cacheKey);

    res.json({ success: true, template: result.rows[0] });
  } catch (error) {
    console.error("Save Template Error:", error);
    res.status(500).json({ message: "Failed to save template" });
  }
};

module.exports = { fetchTemplates, UpdateTemplate };

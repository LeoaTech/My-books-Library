const db = require("../config/dbConfig");
const { connection } = require("../config/redisConfig");
const SYSTEM_DEFAULTS = require("../config/SystemDefaultTemplates");

// parsing Notification Template
const parseTemplate = (text, variables) => {
  if (!text) return "";
  return text.replace(/{{(\w+)}}/g, (match, key) => {
    return typeof variables[key] !== "undefined" ? variables[key] : match;
  });
};

const CACHE_TTL = 600;

// Cache Templates 
const fetchRawTemplate = async (entityId, channel, event) => {
  const cacheKey = `template:${entityId}:${channel}:${event}`;

  try {
    const cachedData = await connection.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const query = `
      SELECT subject, body
      FROM notification_templates 
      WHERE entity_id = $1 
        AND channel = $2 
        AND event = $3 
      LIMIT 1;
    `;

    const result = await db.query(query, [entityId, channel, event]);

    let templateData = null;

    if (result.rows.length > 0) {
      templateData = result.rows[0];
    }

    await connection.set(
      cacheKey,
      JSON.stringify(templateData),
      "EX",
      CACHE_TTL
    );

    return templateData;
  } catch (error) {
    console.error("Cache and DB Error:", error);
    return null;
  }
};

const getNotificationContent = async ({
  entityId,
  event,
  channel,
  variables,
}) => {
  try {
    const systemDefault = SYSTEM_DEFAULTS[event];

    const dbTemplate = await fetchRawTemplate(entityId, channel, event);

    if (!systemDefault) {
      console.warn(`No default template found for event: ${event}`);
    }

    let subjectTemplate = "";
    let bodyTemplate = "";
    if (dbTemplate) {
      subjectTemplate = dbTemplate.subject || systemDefault?.subject || "";
      bodyTemplate = dbTemplate.body(systemDefault?.body || "");
    } else {
      subjectTemplate = systemDefault?.subject || "";
      bodyTemplate = systemDefault?.body || "";
    }

    return {
      subject: parseTemplate(subjectTemplate, variables),
      body: parseTemplate(bodyTemplate, variables),
    };
  } catch (error) {
    console.error("Error fetching notification templates:", error);
    return {
      subject: "",
      body: "",
    };
  }
};

module.exports = { getNotificationContent, parseTemplate };

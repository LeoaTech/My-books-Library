/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const up = (pgm) => {
  pgm.createType("notification_type", ["email", "push", "in-app"]);

  pgm.createTable("notification_templates", {
    id: {
      type: "bigserial",
      primaryKey: true,
    },
    entity_id: {
      type: "integer",
      notNull: true,
      references: "entities(id)",
      onDelete: "CASCADE",
    },
    channel: {
      type: "notification_type",
      notNull: true,
    },
    event: {
      type: "varchar(255)",
      notNull: true,
    },
    subject: {
      type: "text",
    },
    body: {
      type: "text",
      notNull: true,
    },
    variables: {
      type: "jsonb",
    },
    is_active: {
      type: "boolean",
      default: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  pgm.createIndex("notification_templates", ["entity_id", "channel", "event"], {
    name: "unique_template",
    unique: true,
  });

  pgm.createIndex("notification_templates", ["entity_id", "event"], {
    name: "idx_entity_event",
  });
  pgm.createIndex("notification_templates", ["entity_id", "channel", "event"], {
    name: "idx_entity_type_event",
  });

 
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
 pgm.dropIndex("notification_templates", "unique_template", {
    ifExists: true,
  });
  pgm.dropIndex("notification_templates", "idx_entity_event", {
    ifExists: true,
  });
  pgm.dropIndex("notification_templates", "idx_entity_type_event", {
    ifExists: true,
  });

  pgm.dropTable("notification_templates", { ifExists: true });

  pgm.dropType("notification_type", { ifExists: true });
};

module.exports = { up, down, shorthands };

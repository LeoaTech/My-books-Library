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
  pgm.createTable("settings", {
    id: {
      type: "serial",
      primaryKey: true,
      notNull: true,
    },
    allow_select_booking_date: { type: "boolean" },
    default_booking_duration: { type: "integer" },
    allow_purchase: { type: "boolean" },
    allow_borrow: { type: "boolean" },
    consecutive_renewals: { type: "integer" },
    late_returns_fine: { type: "integer" },
    entity_id: {
      type: "integer",
      references: "entities",
      onDelete: "CASCADE",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: { type: "timestamp without time zone" },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.dropTable("settings");
};



module.exports= {up,down, shorthands}
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
  pgm.createTable("membership_plan", {
    plan_id: {
      type: "serial",
      primaryKey: true,
      notNull: true,
    },
    plan_name: { type: "text", notNull: true },
    price: { type: "integer", default: 0 },
    duration: { type: "integer" },
    credits_allocated: { type: "integer" },
    features: { type: "jsonb" },
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
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.dropTable("membership_plan");
};

module.exports = { up, down, shorthands };

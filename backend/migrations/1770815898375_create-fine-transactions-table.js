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
  pgm.createTable("fine_transactions", {
    id: {
      type: "SERIAL",
      primaryKey: true,
      notNull: true,
    },
    user_id: {
      type: "INTEGER",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    booking_id: {
      type: "INTEGER",
      notNull: true,
      references: "bookings",
      onDelete: "CASCADE",
    },
    stripe_session_id: {
      type: "TEXT",
      notNull: true,
      unique: true,
    },
    stripe_payment_intent_id: {
      type: "TEXT",
      unique: true,
    },
    amount_paid: {
      type: "DECIMAL(10, 2)",
      notNull: true,
    },
    status: {
      type: "TEXT",
      notNull: true,
      default: "pending",
    },
    created_at: {
      type: "TIMESTAMP WITHOUT TIME ZONE",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "TIMESTAMP WITHOUT TIME ZONE",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.dropTable("fine_transactions");
};

module.exports = { up, down, shorthands };

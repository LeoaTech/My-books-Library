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
  pgm.createTable("subscription_transactions", {
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
    subscription_id: {
      type: "INTEGER",
      notNull: true,
      references: "subscriptions",
      onDelete: "CASCADE",
    },
    stripe_subscription_id: {
      type: "TEXT",
      notNull: true,
    },
    stripe_invoice_id: {
      type: "TEXT",
      notNull: true,
      unique: true,
    },
    stripe_charge_id: {
      type: "TEXT",
      unique: true,
    },
    amount_paid: {
      type: "INTEGER",
      notNull: true,
    },
    status: {
      type: "TEXT",
      notNull: true,
    },
    billing_reason: {
      type: "TEXT",
      notNull: true,
    },
    invoice_pdf: {
      type: "TEXT",
    },
    created_at: {
      type: "TIMESTAMP WITHOUT TIME ZONE",
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
  pgm.dropTable("subscription_transactions");
};

module.exports = { up, down, shorthands };

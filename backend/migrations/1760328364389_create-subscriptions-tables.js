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
  pgm.addColumn("users", {
    stripe_customer_id: {
      type: "text",
      unique: true,
    },
  });
  pgm.createTable("subscriptions", {
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
    plan_id: {
      type: "INTEGER",
      notNull: true,
      references: "membership_plan",
    },
    stripe_price_id: { type: "TEXT", notNull: true },
    subscription_id: {
      type: "TEXT",
      notNull: true,
      unique: true,
    },
    current_period_end: {
      type: "TIMESTAMP WITHOUT TIME ZONE",
    },
    latest_invoice_id: {
      type: "TEXT",
    },
    status: {
      type: "TEXT",
      notNull: true, //active, cancelled,
    },
    start_date: {
      type: "TIMESTAMP WITHOUT TIME ZONE",
      notNull: true,
    },
    end_date: {
      type: "TIMESTAMP WITHOUT TIME ZONE",
    },
    auto_renew: {
      type: "BOOLEAN",
      notNull: true,
      default: true,
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
  pgm.dropColumn("users", "stripe_customer_id");

  pgm.dropTable("subscriptions");
};


module.exports = {up,down, shorthands}

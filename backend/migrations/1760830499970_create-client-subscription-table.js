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
  pgm.createTable("client_subscription", {
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
    stripe_price_id: { type: "TEXT", notNull: false },
    stripe_product_id: { type: "TEXT", notNull: false },
    stripe_subscription_id: {
      type: "TEXT",
      notNull: true,
      unique: true,
    },
    current_period_end: {
      type: "TIMESTAMP WITHOUT TIME ZONE",
    },

    cancel_at_period_end: {
      type: "boolean",
    },

    status: {
      type: "TEXT",
      notNull: true, //active, cancelled,
    },
    start_date: {
      type: "TIMESTAMP WITHOUT TIME ZONE",
      notNull: true,
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

  pgm.createTable("client_transactions", {
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
   
    client_subscription_id: {
      type: "INTEGER",
      notNull: true,
      references: "client_subscription",
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
      type: "TEXT", // 'subscription_create', 'subscription_cycle'
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
  pgm.dropTable("client_transactions");
  pgm.dropTable("client_subscription");
};

module.exports = { up, down, shorthands };

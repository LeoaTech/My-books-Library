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
  pgm.dropColumns("membership_plan", [
    "duration",
    "credits_allocated",
    "price",
    "features",
  ]);

  pgm.addColumns("membership_plan", {
    stripe_product_id: {
      type: "text",
      notNull: false,
    },
    plan_details: {
      type: "jsonb",
    },
  });
};
/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.dropColumns("membership_plan", ["stripe_product_id", "plan_details"]);

  // Re-add the old columns for a complete rollback if needed
  pgm.addColumns("membership_plan", {
    price: { type: "integer", default: 0 },
    duration: { type: "integer" },
    credits_allocated: { type: "integer" },
    features: { type: "jsonb" },
  });
};

module.exports = { up, down, shorthands };

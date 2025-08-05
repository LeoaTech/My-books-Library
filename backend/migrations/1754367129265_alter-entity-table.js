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
  pgm.addColumns("entity", {
    city: { type: "text" },
    country: { type: "text" },
    phone: { type: "text" },
    address: { type: "text" },
    description: { type: "text" },
    updated_at: { type: "timestamp without time zone" },
  });
  pgm.renameColumn("entity", "deliver_inner_city", "deliver_inter_city");

  pgm.alterColumn("entity", "multiple_branches", {
    default: false,
  });

  pgm.alterColumn("entity", "deliver_inter_city", {
    default: false,
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.dropColumns("entity", [
    "city",
    "country",
    "phone",
    "address",
    "description",
    "updated_at",
  ]);

  //rename column name
  pgm.renameColumn("entity", "deliver_inter_city", "deliver_inner_city");

  pgm.alterColumn("entity", "multiple_branches", {
    default: null,
  });

  pgm.alterColumn("entity", "deliver_inter_city", {
    default: null,
  });
};

module.exports = { up, down, shorthands };

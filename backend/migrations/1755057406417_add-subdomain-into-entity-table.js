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

  // Add new column
  pgm.addColumn("entity", {
    subdomain: { type: "text" },
  });

  // Updated the existing rows
  pgm.sql(`UPDATE entity SET subdomain = LOWER(regexp_replace(name, '[^a-zA-Z0-9]', '', 'g'))`);


  // add constraints unique and not null
  pgm.alterColumn("entity", "subdomain", { notNull: true });

  pgm.addConstraint("entity", "entity_subdomain_unique", {
    unique: ["subdomain"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.dropConstraint("entity", "entity_subdomain_unique");
  pgm.dropColumn("entity", "subdomain");
};

module.exports = { up, down, shorthands };

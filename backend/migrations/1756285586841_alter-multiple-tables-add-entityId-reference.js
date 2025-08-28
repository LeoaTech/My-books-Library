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

  // Add entity_id columns to related tables
  pgm.addColumn("authors", {
    entity_id: {
      type: "integer",
      references: "entity(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addColumn("categories", {
    entity_id: {
      type: "integer",
      references: "entity(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addColumn("covers", {
    entity_id: {
      type: "integer",
      references: "entity(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addColumn("conditions", {
    entity_id: {
      type: "integer",
      references: "entity(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addColumn("publishers", {
    entity_id: {
      type: "integer",
      references: "entity(id)",
      onDelete: "CASCADE",
    },
  });


};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {

  // Drop entity_id columns reference
  pgm.dropColumn("authors", "entity_id");
  pgm.dropColumn("categories", "entity_id");
  pgm.dropColumn("covers", "entity_id");
  pgm.dropColumn("conditions", "entity_id");
  pgm.dropColumn("publishers", "entity_id");
};

module.exports= {up, down, shorthands}
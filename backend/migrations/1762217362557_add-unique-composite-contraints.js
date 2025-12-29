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
  pgm.sql(`
ALTER TABLE authors
ADD CONSTRAINT authors_name_entity_id_unique UNIQUE (name, entity_id);


ALTER TABLE publishers
ADD CONSTRAINT publishers_name_entity_id_unique UNIQUE (name, entity_id);


ALTER TABLE categories
ADD CONSTRAINT categories_name_entity_id_unique UNIQUE (name, entity_id);


ALTER TABLE conditions
ADD CONSTRAINT conditions_name_entity_id_unique UNIQUE (name, entity_id);


ALTER TABLE covers
ADD CONSTRAINT covers_name_entity_id_unique UNIQUE (name, entity_id);

ALTER TABLE users ALTER COLUMN user_details TYPE jsonb USING user_details::jsonb;`);


};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
      pgm.dropConstraint("authors", "authors_name_entity_id_unique");
      pgm.dropConstraint("publishers", "publishers_name_entity_id_unique");
      pgm.dropConstraint("categories", "categories_name_entity_id_unique");
      pgm.dropConstraint("conditions", "conditions_name_entity_id_unique");
      pgm.dropConstraint("covers", "covers_name_entity_id_unique");

};

module.exports ={up,down, shorthands}
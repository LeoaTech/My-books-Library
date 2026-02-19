/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('custom_color_schemes', {
        id: 'id',
        entity_id: {
            type: 'integer',
            notNull: true,
            references: 'entities', 
            onDelete: 'CASCADE',
        },
        name: {
            type: 'varchar(255)',
            notNull: true,
        },
        colors: {
            type: 'jsonb',
            notNull: true,
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    // unique theme names for each library
    pgm.createConstraint('custom_color_schemes', 'unique_entity_id', {
        unique: ['entity_id', 'name'],
    });
};
/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('custom_color_schemes');
};



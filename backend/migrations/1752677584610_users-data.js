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
            INSERT INTO public.users (name,email,password,role_id) VALUES 
            ('Admin User', 'admin@leoatech.com','$2y$10$/bH6cFeueqwXYOaSNfKxUOvA2hgUnNI.XdiojxDNtd8IWHPQzdrx.', 1),
            ('Vendor User', 'vendor@leoatech.com','$2y$10$/bH6cFeueqwXYOaSNfKxUOvA2hgUnNI.XdiojxDNtd8IWHPQzdrx.', 3),
            ('Member User', 'member@leoatech.com','$2y$10$/bH6cFeueqwXYOaSNfKxUOvA2hgUnNI.XdiojxDNtd8IWHPQzdrx.', 2)
        `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
 const down = (pgm) => {
  pgm.sql(`
         DELETE FROM public.users;
        `);
};



module.exports = {up,down,shorthands}
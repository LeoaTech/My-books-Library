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

    INSERT INTO public.roles (name) VALUES
      ('admin'),
      ('member'),
      ('vendor');


    INSERT INTO public.permissions (name) VALUES
      ('EDIT BOOK'),
      ('READ BOOK'),
      ('DELETE BOOK'),
      ('CREATE BOOK'),
      ('EDIT USER'),
      ('READ USER'),
      ('DELETE USER'),
      ('CREATE USER'),
      ('EDIT ORDER'),
      ('READ ORDER'),
      ('DELETE ORDER'),
      ('CREATE ORDER');
    

      INSERT INTO public.role_permissions (role_id, permission_id) VALUES
      (1, 1),  
      (1, 2),  
      (1, 3), 
      (1, 4),  
      (1, 5),  
      (1, 6),  
      (1, 7),  
      (1, 8),  
      (1, 9),  
      (1, 10), 
      (1, 11), 
      (1, 12), 
      (2, 2),  
      (2, 6),  
      (2, 10), 
      (3, 1),  
      (3, 2),  
      (3, 4);  
        `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.sql(`
    DELETE FROM public.role_permissions;
    DELETE FROM public.permissions;
    DELETE FROM public.roles;
  `);
};

module.exports = { up, down, shorthands };

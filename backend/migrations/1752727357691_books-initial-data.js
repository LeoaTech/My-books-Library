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

    INSERT INTO public.authors (name) VALUES 
        ('James Clear'),
        ('Rebecca Yarros'),
        ('Suzanne Collins'),
        ('Emily Henry'),
        ('Bina Shah'),
        ('Daniyal Mueenuddin');
    
    INSERT INTO public.entity (name, type_of_books, multiple_branches,deliver_inner_city) VALUES
        ('Library1','both',true, true) ,
        ('Library2', 'Hardcover', false, true),
        ('Library3', 'both',false, true);
   

    INSERT INTO public.publishers (name) VALUES 
        ('Albakio International'),
        ('Dogar Publishers'),
        ('Auraq Publishers'),
        ('Harper Collins'),
        ('Europa Editions'),
        ('Bloomsbury Publishing'),
        ('Coffee House Press');

    INSERT INTO public.vendors (name) VALUES 
        ('Leighton'),
        ('Kylan'),
        ('Dilan'),
        ('Jaylen'),
        ('Kareem');
       

    INSERT INTO public.categories (name) VALUES 
        ('Fiction'),
        ('History'),
        ('Action'),
        ('Crime'),
        ('Biography'),
        ('Health'),
        ('Gardening'),
        ('Romance'),
        ('Adventure'),
        ('Fantasy'),
        ('Other'),
        ('Horror');


    INSERT INTO public.covers (name) VALUES 
        ('Hardcover'),
        ('Ebook'),
        ('Softcover'),
        ('binding'),
        ('materials');


    INSERT INTO public.conditions (name) VALUES 
        ('New'),
        ('Old'),
        ('Good'),
        ('Used'),
        ('Near Fine'),
        ('Fine');    
    `);

  pgm.sql(`
         INSERT INTO public.branches (name,entity_id, country,city) VALUES 
        ('Library1-LHR', 1,'Pakistan','Lahore'),
        ('Library3-KHI',3,'Pakistan','Karachi'),
        ('Library1-FSD',1,'Pakistan','Faisalabad'),
        ('Library2-ISL',2,'Pakistan','Islamabad');
        
        `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.sql(`
    DELETE FROM public.authors ;
    DELETE FROM public.publishers;
    DELETE FROM public.vendors;
    DELETE FROM public.branches;
    DELETE FROM public.categories ;
    DELETE FROM public.covers;
    DELETE FROM public.conditions;
  `);
};


module.exports={up,down,shorthands}
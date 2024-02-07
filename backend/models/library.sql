


drop table if exists public.users
CREATE TABLE public.users (
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),    name text NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL,
    role text not null,
    auth_token text not null,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    verify_email_token text,
    is_email_verified boolean,
    last_signed_in timestamp without time zone NOT NULL
);
ALTER TABLE IF EXISTS public.users OWNER to postgres;
     
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);   
   


--  TABLE NAME TOKENS
--   Create Token Table
   drop table if exists public.tokens

   create table public.tokens(
       id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
       user_id text,	
       token text,
   	   created_at timestamp without time zone DEFAULT now() NOT NULL,
       expired_at timestamp without time zone
   );
  
  ALTER TABLE IF EXISTS public.tokens
    OWNER to postgres;  
   	
  
  
   
   --  TABLE  NAME PERMISSIONS 
   drop table if exists public.permissions
   CREATE TABLE public.permissions (
    permission_id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),  
    name text NOT null
);

-- Add Permissions id and type
INSERT INTO public.permissions VALUES (1, 'EDIT');
INSERT INTO public.permissions VALUES (2, 'READ');
INSERT INTO public.permissions VALUES (3, 'DELETE');
INSERT INTO public.permissions VALUES (4, 'CREATE');

ALTER TABLE IF EXISTS public.permissions
    OWNER to postgres;  
   
ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permission_pkey PRIMARY KEY (permission_id);   
   
   
--   TEBLE NAME ROLES
   drop table if exists public.roles 
   CREATE TABLE public.roles (
    role_id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),  
    name text NOT null,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now(),
    permission_id integer not null,
    permission_name text,
    CONSTRAINT roles_pkey PRIMARY KEY (role_id),
    CONSTRAINT "permissionID" FOREIGN KEY (permission_id)
    REFERENCES public.permissions (permission_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);

-- Add Some Roles into table

INSERT INTO public.roles VALUES (1, 'admin');
INSERT INTO public.roles VALUES (2, 'user');
INSERT INTO public.roles VALUES (3, 'moderator');
INSERT INTO public.roles VALUES (4, 'librarian');
INSERT INTO public.roles VALUES (5, 'visitor');
INSERT INTO public.roles VALUES (6, 'seller');

ALTER TABLE IF EXISTS public.roles
    OWNER to postgres;  
   
-- from the terminal run:
-- psql < expensebud.sql

DROP DATABASE IF EXISTS expensebud;
CREATE DATABASE expensebud;
\c expensebud

\i expensebud_schema.sql
\i expensebud_seed.sql 


DROP DATABASE IF EXISTS expensebud_test;
CREATE DATABASE expensebud_test;

-- ... existing code
ALTER TABLE users ADD COLUMN is_first_login BOOLEAN DEFAULT true;
-- ... existing code

\c expensebud_test

\i expensebud_schema.sql


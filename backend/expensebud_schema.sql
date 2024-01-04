CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(20) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  isFirstLogin BOOLEAN DEFAULT true,
  profile_pic_url TEXT
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  category VARCHAR(30) UNIQUE NOT NULL
);


CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  amount NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category_id INTEGER REFERENCES categories ON DELETE SET NULL,
  user_id INTEGER REFERENCES users ON DELETE CASCADE
);

CREATE TABLE accounts (
  id SERIAL PRIMARY KEY, 
  user_id INTEGER REFERENCES users ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  item_id TEXT NOT NULL,
  account_id TEXT NOT NULL, 
  institution_id TEXT,
  institution_name TEXT,
  account_type TEXT
);

CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  amount NUMERIC(10, 2) NOT NULL,
  date DATE NOT NULL,
  vendor TEXT,
  description TEXT,
  transaction_id TEXT, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category_id INTEGER REFERENCES categories ON DELETE SET NULL,
  user_id INTEGER REFERENCES users ON DELETE CASCADE,
  account_id INTEGER REFERENCES accounts ON DELETE CASCADE
);










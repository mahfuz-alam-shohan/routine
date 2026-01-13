export const SCHEMA_SQL = `
  -- 1. CENTRAL AUTH ACCOUNTS
  CREATE TABLE IF NOT EXISTS auth_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- 2. INSTITUTION PROFILES
  CREATE TABLE IF NOT EXISTS profiles_institution (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    auth_id INTEGER,
    school_name TEXT,
    eiin_code TEXT,
    FOREIGN KEY(auth_id) REFERENCES auth_accounts(id)
  );

  -- 3. TEACHER PROFILES
  CREATE TABLE IF NOT EXISTS profiles_teacher (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    auth_id INTEGER,
    full_name TEXT,
    FOREIGN KEY(auth_id) REFERENCES auth_accounts(id)
  );
`;
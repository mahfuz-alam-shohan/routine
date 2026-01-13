export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS auth_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles_institution (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    auth_id INTEGER,
    school_name TEXT,
    eiin_code TEXT,
    FOREIGN KEY(auth_id) REFERENCES auth_accounts(id)
);

CREATE TABLE IF NOT EXISTS profiles_teacher (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    auth_id INTEGER,
    full_name TEXT,
    FOREIGN KEY(auth_id) REFERENCES auth_accounts(id)
);
`;
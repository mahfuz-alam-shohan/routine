// src/core/schema_manager.js

// 1. THE DEFINITION (The "Truth")
// Define your tables and columns here. 
// If you need a new column later, just add it here.
const DEFINED_SCHEMA = {
  
  auth_accounts: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    email: "TEXT UNIQUE NOT NULL",
    password_hash: "TEXT NOT NULL",
    salt: "TEXT NOT NULL",
    role: "TEXT NOT NULL",
    is_active: "BOOLEAN DEFAULT 1",
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
  },

  profiles_institution: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    auth_id: "INTEGER",
    school_name: "TEXT",
    eiin_code: "TEXT",
    address: "TEXT", // Example: Added a new column
    "FOREIGN KEY(auth_id)": "REFERENCES auth_accounts(id)" // Constraints handled specially
  },

  profiles_teacher: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    auth_id: "INTEGER",
    school_id: "INTEGER",
    full_name: "TEXT",
    phone: "TEXT",
    "FOREIGN KEY(auth_id)": "REFERENCES auth_accounts(id)"
  },

  system_settings: {
    key: "TEXT PRIMARY KEY",
    value: "TEXT"
  }
};

// 2. THE SYNC LOGIC (The "Engine")
export async function syncDatabase(env) {
  const report = []; // Log what we did

  // A. Get List of Existing Tables in DB
  const existingTablesResult = await env.DB.prepare("PRAGMA table_list").all();
  // Filter out internal SQLite tables
  const existingTables = existingTablesResult.results
      .map(t => t.name)
      .filter(name => !name.startsWith("sqlite_") && !name.startsWith("d1_"));

  // --- PHASE 1: CREATE or UPDATE Tables ---
  for (const [tableName, columns] of Object.entries(DEFINED_SCHEMA)) {
    
    if (!existingTables.includes(tableName)) {
      // 1.1 Table Missing? CREATE IT.
      await createTable(env, tableName, columns);
      report.push(`Created table: ${tableName}`);
    } else {
      // 1.2 Table Exists? CHECK COLUMNS.
      await syncColumns(env, tableName, columns, report);
    }
  }

  // --- PHASE 2: CLEANUP (Drop Unused Tables) ---
  for (const existingTable of existingTables) {
    if (!DEFINED_SCHEMA[existingTable]) {
      // DANGER: Table exists in DB but not in Code. DROP IT.
      await env.DB.prepare(`DROP TABLE "${existingTable}"`).run();
      report.push(`DROPPED unused table: ${existingTable}`);
    }
  }

  return report;
}

// --- HELPER FUNCTIONS ---

async function createTable(env, tableName, columns) {
  const colDefs = Object.entries(columns).map(([colName, colType]) => {
    // Handle Constraints (keys that start with FOREIGN KEY, etc)
    if (colName.includes(" ")) return `${colName} ${colType}`; 
    return `"${colName}" ${colType}`;
  }).join(", ");
  
  const sql = `CREATE TABLE IF NOT EXISTS "${tableName}" (${colDefs});`;
  await env.DB.prepare(sql).run();
}

async function syncColumns(env, tableName, schemaColumns, report) {
  // Get existing columns from DB
  const dbColsResult = await env.DB.prepare(`PRAGMA table_info("${tableName}")`).all();
  const dbColNames = dbColsResult.results.map(c => c.name);

  // A. Add Missing Columns
  for (const [colName, colType] of Object.entries(schemaColumns)) {
    // Skip constraints like "FOREIGN KEY" in this check
    if (colName.includes(" ")) continue; 

    if (!dbColNames.includes(colName)) {
      // Column missing! Add it.
      try {
        await env.DB.prepare(`ALTER TABLE "${tableName}" ADD COLUMN "${colName}" ${colType}`).run();
        report.push(`Added column '${colName}' to '${tableName}'`);
      } catch (e) {
        report.push(`Error adding column ${colName}: ${e.message}`);
      }
    }
  }

  // B. Drop Unused Columns (Strict Mode)
  // Note: SQLite allows dropping columns, but it can be slow on huge data.
  const schemaColNames = Object.keys(schemaColumns).filter(k => !k.includes(" "));
  
  for (const dbCol of dbColNames) {
    if (!schemaColNames.includes(dbCol)) {
      // Column exists in DB but not in Schema. DROP IT.
      try {
        await env.DB.prepare(`ALTER TABLE "${tableName}" DROP COLUMN "${dbCol}"`).run();
        report.push(`DROPPED column '${dbCol}' from '${tableName}'`);
      } catch (e) {
        report.push(`Error dropping column ${dbCol}: ${e.message}`);
      }
    }
  }
}
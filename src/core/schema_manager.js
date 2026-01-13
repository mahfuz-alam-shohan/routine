// src/core/schema_manager.js

// 1. THE DEFINITION (The "Truth")
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
    address: "TEXT", 
    "FOREIGN KEY(auth_id)": "REFERENCES auth_accounts(id)" 
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
  const report = []; 

  // A. Get List of Existing Tables
  const existingTablesResult = await env.DB.prepare("PRAGMA table_list").all();
  
  // --- SAFETY FIX IS HERE ---
  // Filter out sqlite_, d1_, and anything starting with _ (internal CF tables)
  const existingTables = existingTablesResult.results
      .map(t => t.name)
      .filter(name => 
          !name.startsWith("sqlite_") && 
          !name.startsWith("d1_") && 
          !name.startsWith("_")
      );

  // --- PHASE 1: CREATE or UPDATE Tables ---
  for (const [tableName, columns] of Object.entries(DEFINED_SCHEMA)) {
    if (!existingTables.includes(tableName)) {
      await createTable(env, tableName, columns);
      report.push(`Created table: ${tableName}`);
    } else {
      await syncColumns(env, tableName, columns, report);
    }
  }

  // --- PHASE 2: CLEANUP (Drop Unused Tables) ---
  for (const existingTable of existingTables) {
    if (!DEFINED_SCHEMA[existingTable]) {
      // DANGER: Table exists in DB but not in Code. DROP IT.
      try {
          await env.DB.prepare(`DROP TABLE "${existingTable}"`).run();
          report.push(`DROPPED unused table: ${existingTable}`);
      } catch(e) {
          // If we can't drop it (auth error), just ignore it.
          report.push(`Skipped dropping protected table: ${existingTable}`);
      }
    }
  }

  return report;
}

// --- HELPER FUNCTIONS ---

async function createTable(env, tableName, columns) {
  const colDefs = Object.entries(columns).map(([colName, colType]) => {
    if (colName.includes(" ")) return `${colName} ${colType}`; 
    return `"${colName}" ${colType}`;
  }).join(", ");
  
  const sql = `CREATE TABLE IF NOT EXISTS "${tableName}" (${colDefs});`;
  await env.DB.prepare(sql).run();
}

async function syncColumns(env, tableName, schemaColumns, report) {
  const dbColsResult = await env.DB.prepare(`PRAGMA table_info("${tableName}")`).all();
  const dbColNames = dbColsResult.results.map(c => c.name);

  // Add Missing Columns
  for (const [colName, colType] of Object.entries(schemaColumns)) {
    if (colName.includes(" ")) continue; 

    if (!dbColNames.includes(colName)) {
      try {
        await env.DB.prepare(`ALTER TABLE "${tableName}" ADD COLUMN "${colName}" ${colType}`).run();
        report.push(`Added column '${colName}' to '${tableName}'`);
      } catch (e) {
        report.push(`Error adding column ${colName}: ${e.message}`);
      }
    }
  }
}
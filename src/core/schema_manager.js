// src/core/schema_manager.js

// 1. THE DEFINITION
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
    max_teachers: "INTEGER DEFAULT 10", // <--- NEW: Limit for monetization
    "FOREIGN KEY(auth_id)": "REFERENCES auth_accounts(id)" 
  },

  profiles_teacher: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    auth_id: "INTEGER", // Optional (if teacher has login)
    school_id: "INTEGER",
    full_name: "TEXT",
    phone: "TEXT",
    "FOREIGN KEY(auth_id)": "REFERENCES auth_accounts(id)"
  },

  academic_classes: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    class_name: "TEXT",  
    section_name: "TEXT", 
    shift: "TEXT",        
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
  },

  system_settings: {
    key: "TEXT PRIMARY KEY",
    value: "TEXT"
  }
};

// 2. THE SYNC LOGIC
export async function syncDatabase(env) {
  const report = []; 
  const existingTablesResult = await env.DB.prepare("PRAGMA table_list").all();
  
  const existingTables = existingTablesResult.results
      .map(t => t.name)
      .filter(name => !name.startsWith("sqlite_") && !name.startsWith("d1_") && !name.startsWith("_"));

  for (const [tableName, columns] of Object.entries(DEFINED_SCHEMA)) {
    if (!existingTables.includes(tableName)) {
      await createTable(env, tableName, columns);
      report.push(`Created table: ${tableName}`);
    } else {
      await syncColumns(env, tableName, columns, report);
    }
  }

  for (const existingTable of existingTables) {
    if (!DEFINED_SCHEMA[existingTable]) {
      try {
          await env.DB.prepare(`DROP TABLE "${existingTable}"`).run();
          report.push(`DROPPED unused table: ${existingTable}`);
      } catch(e) {
          report.push(`Skipped dropping protected table: ${existingTable}`);
      }
    }
  }

  return report;
}

async function createTable(env, tableName, columns) {
  const colDefs = Object.entries(columns).map(([colName, colType]) => {
    if (colName.includes(" ")) return `${colName} ${colType}`; 
    return `"${colName}" ${colType}`;
  }).join(", ");
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS "${tableName}" (${colDefs});`).run();
}

async function syncColumns(env, tableName, schemaColumns, report) {
  const dbColsResult = await env.DB.prepare(`PRAGMA table_info("${tableName}")`).all();
  const dbColNames = dbColsResult.results.map(c => c.name);

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
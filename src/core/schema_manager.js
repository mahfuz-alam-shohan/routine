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
    max_teachers: "INTEGER DEFAULT 10", 
    "FOREIGN KEY(auth_id)": "REFERENCES auth_accounts(id)" 
  },

  profiles_admin: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    auth_id: "INTEGER",
    full_name: "TEXT",
    phone: "TEXT",
    dob: "DATE",
    "FOREIGN KEY(auth_id)": "REFERENCES auth_accounts(id)"
  },

  profiles_teacher: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    auth_id: "INTEGER",
    school_id: "INTEGER",
    full_name: "TEXT",
    subject: "TEXT", 
    email: "TEXT",
    phone: "TEXT",
    "FOREIGN KEY(auth_id)": "REFERENCES auth_accounts(id)"
  },

  academic_classes: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    class_name: "TEXT",
    has_groups: "INTEGER DEFAULT 0", // 0 = no groups, 1 = has groups
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)"
  },

  class_groups: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    class_id: "INTEGER",
    group_name: "TEXT",
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)",
    "FOREIGN KEY(class_id)": "REFERENCES academic_classes(id)"
  },

  class_sections: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    class_id: "INTEGER",
    group_id: "INTEGER", // null if class has no groups
    section_name: "TEXT",
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)",
    "FOREIGN KEY(class_id)": "REFERENCES academic_classes(id)",
    "FOREIGN KEY(group_id)": "REFERENCES class_groups(id)"
  },

  academic_subjects: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    subject_name: "TEXT" 
  },

  // --- SUBJECT ASSIGNMENT TABLES ---
  class_subjects: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    class_id: "INTEGER",
    subject_id: "INTEGER",
    classes_per_week: "INTEGER", // Actual number of classes assigned
    min_classes: "INTEGER", // Minimum required classes per week
    max_classes: "INTEGER", // Maximum allowed classes per week
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)",
    "FOREIGN KEY(class_id)": "REFERENCES academic_classes(id)",
    "FOREIGN KEY(subject_id)": "REFERENCES academic_subjects(id)"
  },

  group_subjects: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    group_id: "INTEGER",
    subject_id: "INTEGER",
    classes_per_week: "INTEGER", // Actual number of classes assigned
    min_classes: "INTEGER", // Minimum required classes per week
    max_classes: "INTEGER", // Maximum allowed classes per week
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)",
    "FOREIGN KEY(group_id)": "REFERENCES class_groups(id)",
    "FOREIGN KEY(subject_id)": "REFERENCES academic_subjects(id)"
  },

  // --- SIMPLIFIED SCHEDULE CONFIGURATION ---
  schedule_config: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER UNIQUE", // One config per school
    strategy: "TEXT", // Keep for backward compatibility
    shifts_json: "TEXT", // Keep for backward compatibility  
    start_time: "TEXT DEFAULT '08:00'", // School start time
    active_days: "INTEGER DEFAULT 5", // Number of active school days per week
    periods_per_day: "INTEGER DEFAULT 8" // Number of periods per day
  },

  schedule_slots: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    slot_index: "INTEGER", // Keep for backward compatibility
    start_time: "TEXT", // "08:00"
    end_time: "TEXT",   // "08:45"
    duration: "INTEGER", // Duration in minutes
    type: "TEXT",       // 'class', 'break'
    label: "TEXT",      // "1st Period", "Tiffin"
    applicable_shifts: "TEXT", // Keep for backward compatibility
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)"
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
  const existingTables = existingTablesResult.results.map(t => t.name).filter(n => !n.startsWith("_") && !n.startsWith("sqlite") && !n.startsWith("d1"));

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
      try { await env.DB.prepare(`DROP TABLE "${existingTable}"`).run(); } catch(e) {}
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
        try { await env.DB.prepare(`ALTER TABLE "${tableName}" ADD COLUMN "${colName}" ${colType}`).run(); } catch (e) {}
    }
  }
}

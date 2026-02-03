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
    subject: "TEXT", // Keep for backward compatibility
    email: "TEXT",
    phone: "TEXT",
    "FOREIGN KEY(auth_id)": "REFERENCES auth_accounts(id)"
  },

  // --- TEACHER SUBJECT ASSIGNMENTS ---
  teacher_subjects: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    teacher_id: "INTEGER",
    subject_id: "INTEGER",
    is_primary: "BOOLEAN DEFAULT 0", // Main subject vs additional subjects
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)",
    "FOREIGN KEY(teacher_id)": "REFERENCES profiles_teacher(id)",
    "FOREIGN KEY(subject_id)": "REFERENCES academic_subjects(id)"
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
    classes_per_week: "INTEGER", // Total classes per week (when fixed is true)
    min_classes: "INTEGER", // Minimum classes per week (when fixed is false)
    max_classes: "INTEGER", // Maximum classes per week (when fixed is false)
    is_fixed: "BOOLEAN DEFAULT 1", // Whether classes_per_week is fixed or flexible
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)",
    "FOREIGN KEY(class_id)": "REFERENCES academic_classes(id)",
    "FOREIGN KEY(subject_id)": "REFERENCES academic_subjects(id)"
  },

  group_subjects: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    group_id: "INTEGER",
    subject_id: "INTEGER",
    classes_per_week: "INTEGER", // Total classes per week (when fixed is true)
    min_classes: "INTEGER", // Minimum classes per week (when fixed is false)
    max_classes: "INTEGER", // Maximum classes per week (when fixed is false)
    is_fixed: "BOOLEAN DEFAULT 1", // Whether classes_per_week is fixed or flexible
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
    active_days: "INTEGER DEFAULT 5", // Keep for backward compatibility
    periods_per_day: "INTEGER DEFAULT 8", // Keep for backward compatibility
    // New working days fields
    working_days: "TEXT DEFAULT '[\"monday\",\"tuesday\",\"wednesday\",\"thursday\",\"friday\"]'", // JSON array of working days
    off_days: "TEXT DEFAULT '[\"saturday\",\"sunday\"]'" // JSON array of off days
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
  },

  teacher_assignments: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    class_id: "INTEGER",
    group_id: "INTEGER",
    section_id: "INTEGER",
    subject_id: "INTEGER",
    teacher_id: "INTEGER",
    is_auto: "BOOLEAN DEFAULT 0", // 0 = manual assignment, 1 = auto-assign by system
    is_primary: "BOOLEAN DEFAULT 0", // 0 = additional teacher, 1 = primary teacher
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)",
    "FOREIGN KEY(class_id)": "REFERENCES academic_classes(id)",
    "FOREIGN KEY(group_id)": "REFERENCES class_groups(id)",
    "FOREIGN KEY(section_id)": "REFERENCES class_sections(id)",
    "FOREIGN KEY(subject_id)": "REFERENCES academic_subjects(id)",
    "FOREIGN KEY(teacher_id)": "REFERENCES profiles_teacher(id)"
  },

  // --- ROUTINE GENERATION SYSTEM ---
  generated_routines: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    name: "TEXT", // e.g., "Final Routine 2024", "Draft Routine v1"
    version: "INTEGER DEFAULT 1", // For versioning
    is_active: "BOOLEAN DEFAULT 0", // Only one routine can be active per school
    generated_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    generated_by: "TEXT", // "auto" or teacher email
    total_periods: "INTEGER DEFAULT 0",
    conflicts_resolved: "INTEGER DEFAULT 0",
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)"
  },

  routine_entries: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    routine_id: "INTEGER",
    school_id: "INTEGER",
    day_of_week: "TEXT", // "monday", "tuesday", etc.
    slot_index: "INTEGER", // References schedule_slots.slot_index
    class_id: "INTEGER",
    group_id: "INTEGER", // null if no groups
    section_id: "INTEGER", // null if no sections
    subject_id: "INTEGER",
    teacher_id: "INTEGER",
    room_number: "TEXT", // Optional room assignment
    is_conflict: "BOOLEAN DEFAULT 0", // Flag for scheduling conflicts
    conflict_reason: "TEXT", // Description of conflict if any
    "FOREIGN KEY(routine_id)": "REFERENCES generated_routines(id)",
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)",
    "FOREIGN KEY(class_id)": "REFERENCES academic_classes(id)",
    "FOREIGN KEY(group_id)": "REFERENCES class_groups(id)",
    "FOREIGN KEY(section_id)": "REFERENCES class_sections(id)",
    "FOREIGN KEY(subject_id)": "REFERENCES academic_subjects(id)",
    "FOREIGN KEY(teacher_id)": "REFERENCES profiles_teacher(id)"
  },

  routine_generation_settings: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER UNIQUE",
    // Generation preferences
    prefer_same_teacher_consecutive: "BOOLEAN DEFAULT 1", // Try to give same teacher consecutive periods
    avoid_teacher_duplicates: "BOOLEAN DEFAULT 1", // Avoid teacher teaching same class multiple times per day
    balance_subject_distribution: "BOOLEAN DEFAULT 1", // Distribute subjects evenly across week
    respect_preferred_times: "BOOLEAN DEFAULT 1", // Consider teacher time preferences
    // Conflict resolution
    auto_resolve_conflicts: "BOOLEAN DEFAULT 1",
    allow_split_periods: "BOOLEAN DEFAULT 0", // Allow splitting double periods
    max_teacher_daily_periods: "INTEGER DEFAULT 8",
    break_between_same_subject: "INTEGER DEFAULT 1", // Minimum periods between same subject for same class
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)"
  },

  teacher_preferences: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    teacher_id: "INTEGER",
    preferred_days: "TEXT", // JSON array of preferred days
    preferred_time_slots: "TEXT", // JSON array of preferred slot indices
    unavailable_times: "TEXT", // JSON array of unavailable slot indices
    max_daily_periods: "INTEGER DEFAULT 8",
    notes: "TEXT", // Additional preferences
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)",
    "FOREIGN KEY(teacher_id)": "REFERENCES profiles_teacher(id)"
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

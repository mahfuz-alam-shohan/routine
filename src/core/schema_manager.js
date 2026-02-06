


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
    shifts_enabled: "BOOLEAN DEFAULT 0",
    plan_id: "INTEGER",
    plan_name: "TEXT",
    plan_billing_cycle: "TEXT",
    plan_price_taka: "INTEGER",
    max_subjects: "INTEGER",
    max_routines_yearly: "INTEGER",
    max_shifts: "INTEGER",
    allow_teacher_dashboard: "BOOLEAN DEFAULT 0",
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


  teacher_subjects: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    teacher_id: "INTEGER",
    subject_id: "INTEGER",
    is_primary: "BOOLEAN DEFAULT 0",
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)",
    "FOREIGN KEY(teacher_id)": "REFERENCES profiles_teacher(id)",
    "FOREIGN KEY(subject_id)": "REFERENCES academic_subjects(id)"
  },

  academic_classes: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    class_name: "TEXT",
    has_groups: "INTEGER DEFAULT 0",
    shift_name: "TEXT DEFAULT 'Full Day'",
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
    group_id: "INTEGER",
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


  class_subjects: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    class_id: "INTEGER",
    subject_id: "INTEGER",
    classes_per_week: "INTEGER",
    min_classes: "INTEGER",
    max_classes: "INTEGER",
    is_fixed: "BOOLEAN DEFAULT 1",
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)",
    "FOREIGN KEY(class_id)": "REFERENCES academic_classes(id)",
    "FOREIGN KEY(subject_id)": "REFERENCES academic_subjects(id)"
  },

  group_subjects: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    group_id: "INTEGER",
    subject_id: "INTEGER",
    classes_per_week: "INTEGER",
    min_classes: "INTEGER",
    max_classes: "INTEGER",
    is_fixed: "BOOLEAN DEFAULT 1",
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)",
    "FOREIGN KEY(group_id)": "REFERENCES class_groups(id)",
    "FOREIGN KEY(subject_id)": "REFERENCES academic_subjects(id)"
  },


  schedule_config: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER UNIQUE",
    strategy: "TEXT",
    shifts_json: "TEXT",
    start_time: "TEXT DEFAULT '08:00'",
    active_days: "INTEGER DEFAULT 5",
    periods_per_day: "INTEGER DEFAULT 8",

    working_days: "TEXT DEFAULT '[\"monday\",\"tuesday\",\"wednesday\",\"thursday\",\"friday\"]'",
    off_days: "TEXT DEFAULT '[\"saturday\",\"sunday\"]'"
  },

  schedule_slots: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    slot_index: "INTEGER",
    start_time: "TEXT",
    end_time: "TEXT",
    duration: "INTEGER",
    type: "TEXT",
    label: "TEXT",
    applicable_shifts: "TEXT",
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)"
  },

  system_settings: {
    key: "TEXT PRIMARY KEY",
    value: "TEXT"
  },

  pricing_plans: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    name: "TEXT",
    billing_cycle: "TEXT",
    price_taka: "INTEGER",
    is_published: "BOOLEAN DEFAULT 0",
    max_teachers: "INTEGER",
    max_subjects: "INTEGER",
    max_routines_yearly: "INTEGER",
    max_shifts: "INTEGER",
    allow_teacher_dashboard: "BOOLEAN DEFAULT 0",
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
  },

  pricing_features: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    plan_id: "INTEGER",
    feature_text: "TEXT",
    is_highlight: "BOOLEAN DEFAULT 0",
    is_auto: "BOOLEAN DEFAULT 0",
    "FOREIGN KEY(plan_id)": "REFERENCES pricing_plans(id)"
  },

  pricing_orders: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    plan_id: "INTEGER",
    plan_name: "TEXT",
    billing_cycle: "TEXT",
    price_taka: "INTEGER",
    requester_name: "TEXT",
    requester_email: "TEXT",
    requester_phone: "TEXT",
    institution_name: "TEXT",
    status: "TEXT DEFAULT 'new'",
    school_id: "INTEGER",
    auth_id: "INTEGER",
    processed_at: "TIMESTAMP",
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    "FOREIGN KEY(plan_id)": "REFERENCES pricing_plans(id)"
  },

  teacher_assignments: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    class_id: "INTEGER",
    group_id: "INTEGER",
    section_id: "INTEGER",
    subject_id: "INTEGER",
    teacher_id: "INTEGER",
    is_auto: "BOOLEAN DEFAULT 0",
    is_primary: "BOOLEAN DEFAULT 0",
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)",
    "FOREIGN KEY(class_id)": "REFERENCES academic_classes(id)",
    "FOREIGN KEY(group_id)": "REFERENCES class_groups(id)",
    "FOREIGN KEY(section_id)": "REFERENCES class_sections(id)",
    "FOREIGN KEY(subject_id)": "REFERENCES academic_subjects(id)",
    "FOREIGN KEY(teacher_id)": "REFERENCES profiles_teacher(id)"
  },


  generated_routines: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    name: "TEXT",
    version: "INTEGER DEFAULT 1",
    is_active: "BOOLEAN DEFAULT 0",
    generated_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    generated_by: "TEXT",
    total_periods: "INTEGER DEFAULT 0",
    conflicts_resolved: "INTEGER DEFAULT 0",
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)"
  },

  routine_generation_tokens: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    routine_id: "INTEGER",
    generated_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)"
  },

  routine_entries: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    routine_id: "INTEGER",
    school_id: "INTEGER",
    day_of_week: "TEXT",
    slot_index: "INTEGER",
    class_id: "INTEGER",
    group_id: "INTEGER",
    section_id: "INTEGER",
    subject_id: "INTEGER",
    teacher_id: "INTEGER",
    room_number: "TEXT",
    is_conflict: "BOOLEAN DEFAULT 0",
    conflict_reason: "TEXT",
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

    prefer_same_teacher_consecutive: "BOOLEAN DEFAULT 1",
    avoid_teacher_duplicates: "BOOLEAN DEFAULT 1",
    balance_subject_distribution: "BOOLEAN DEFAULT 1",
    respect_preferred_times: "BOOLEAN DEFAULT 1",

    auto_resolve_conflicts: "BOOLEAN DEFAULT 1",
    allow_split_periods: "BOOLEAN DEFAULT 0",
    max_teacher_daily_periods: "INTEGER DEFAULT 8",
    break_between_same_subject: "INTEGER DEFAULT 1",
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)"
  },

  teacher_preferences: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    teacher_id: "INTEGER",
    preferred_days: "TEXT",
    preferred_time_slots: "TEXT",
    unavailable_times: "TEXT",
    max_daily_periods: "INTEGER DEFAULT 8",
    notes: "TEXT",
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)",
    "FOREIGN KEY(teacher_id)": "REFERENCES profiles_teacher(id)"
  },

  routine_print_layouts: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    name: "TEXT",
    config_json: "TEXT",
    is_default: "BOOLEAN DEFAULT 0",
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)"
  }
};


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
      try { await env.DB.prepare(`DROP TABLE "${existingTable}"`).run(); } catch (e) { }
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
      try { await env.DB.prepare(`ALTER TABLE "${tableName}" ADD COLUMN "${colName}" ${colType}`).run(); } catch (e) { }
    }
  }
}

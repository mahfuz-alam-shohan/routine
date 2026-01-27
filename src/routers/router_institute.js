import { htmlResponse, jsonResponse, getCookie } from '../core/utils.js';
import { InstituteLayout } from '../ui/institute/layout.js';
import { InstituteDashboardHTML } from '../ui/institute/dashboard.js';
import { TeachersPageHTML } from '../ui/institute/teachers.js'; 
import { ClassesPageHTML } from '../ui/institute/classes.js'; 
import { SubjectsPageHTML } from '../ui/institute/subjects.js'; 
import { SchedulesPageHTML } from '../ui/institute/schedules.js'; 
import { syncDatabase } from '../core/schema_manager.js';

export async function handleInstituteRequest(request, env) {
  const url = new URL(request.url);
  const email = getCookie(request, 'user_email');
  if (!email) return htmlResponse("<h1>Login Failed</h1>");

  const school = await env.DB.prepare(`SELECT p.* FROM profiles_institution p JOIN auth_accounts a ON p.auth_id = a.id WHERE a.email = ?`).bind(email).first();
  if(!school) return new Response("Error", {status: 404});

  // --- DASHBOARD ---
  if (url.pathname === '/school/dashboard') {
    const tCount = await env.DB.prepare("SELECT count(*) as count FROM profiles_teacher WHERE school_id = ?").bind(school.id).first();
    const cCount = await env.DB.prepare("SELECT count(*) as count FROM academic_classes WHERE school_id = ?").bind(school.id).first();
    return htmlResponse(InstituteLayout(InstituteDashboardHTML({teachers: tCount.count, classes: cCount.count}), "Dashboard", school.school_name));
  }

  // --- MASTER SCHEDULE ---
  if (url.pathname === '/school/schedules') {
      
      if (request.method === 'POST') {
          try {
              const body = await request.json();
              if(body.action === 'save_schedule') {
                  // Clear existing slots
                  await env.DB.prepare("DELETE FROM schedule_slots WHERE school_id = ?").bind(school.id).run();
                  
                  // Insert new slots with proper slot_index
                  for(let i = 0; i < body.slots.length; i++) {
                      const slot = body.slots[i];
                      await env.DB.prepare("INSERT INTO schedule_slots (school_id, slot_index, start_time, end_time, label, duration, type, applicable_shifts) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
                          .bind(school.id, i, slot.start_time, slot.end_time, slot.label, slot.duration, slot.type, JSON.stringify(["all"])).run();
                  }
                  
                  // Update working days in schedule config
                  const workingDays = JSON.stringify(body.working_days || ["monday","tuesday","wednesday","thursday","friday"]);
                  const allDays = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
                  const offDays = JSON.stringify(allDays.filter(day => !body.working_days?.includes(day)));
                  const workingDaysCount = body.working_days?.length || 5;
                  
                  // Update both fields for consistency
                  await env.DB.prepare("UPDATE schedule_config SET working_days = ?, off_days = ?, active_days = ? WHERE school_id = ?")
                      .bind(workingDays, offDays, workingDaysCount, school.id).run();
              }
              return jsonResponse({ success: true });
          } catch(e) { 
              if(e.message.includes("no such table")) await syncDatabase(env);
              return jsonResponse({ error: e.message }, 500); 
          }
      }

      // RESET SCHEDULE
      if (request.method === 'DELETE') {
          await env.DB.prepare("DELETE FROM schedule_slots WHERE school_id = ?").bind(school.id).run();
          await env.DB.prepare("DELETE FROM schedule_config WHERE school_id = ?").bind(school.id).run();
          return jsonResponse({ success: true });
      }

      // LOAD DATA
      let config = null;
      let slots = [];
      try { 
          config = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first(); 
          slots = (await env.DB.prepare("SELECT * FROM schedule_slots WHERE school_id = ? ORDER BY slot_index ASC").bind(school.id).all()).results;
          
          // Handle existing data format - ensure duration is calculated if missing
          slots = slots.map(slot => {
              if (!slot.duration && slot.start_time && slot.end_time) {
                  const [h1, m1] = slot.start_time.split(':').map(Number);
                  const [h2, m2] = slot.end_time.split(':').map(Number);
                  slot.duration = Math.round((new Date(2000, 0, 1, h2, m2) - new Date(2000, 0, 1, h1, m1)) / 60000);
              }
              return slot;
          });
      } catch(e) { 
          console.error('Database error:', e);
          await syncDatabase(env); 
      }
      
      return htmlResponse(InstituteLayout(SchedulesPageHTML(config, slots), "Master Schedule", school.school_name));
  }

  // --- SUBJECTS (NEW STRUCTURE: Subject Bank + Class Curriculum) ---
  if (url.pathname === '/school/subjects') {
      if(request.method === 'POST') {
          try {
              const body = await request.json();
              
              // Subject Bank actions
              if(body.action === 'create') {
                  await env.DB.prepare("INSERT INTO academic_subjects (school_id, subject_name) VALUES (?, ?)").bind(school.id, body.name).run();
                  return jsonResponse({success:true});
              }
              if(body.action === 'rename') {
                  await env.DB.prepare("UPDATE academic_subjects SET subject_name = ? WHERE id = ?").bind(body.name, body.id).run();
                  return jsonResponse({success:true});
              }
              
              // Class Curriculum actions
              if(body.action === 'add_class_subject') {
                  await env.DB.prepare("INSERT INTO class_subjects (school_id, class_id, subject_id, classes_per_week, min_classes, max_classes) VALUES (?, ?, ?, ?, ?, ?)")
                      .bind(body.school_id, body.class_id, body.subject_id, body.classes_per_week, body.min_classes, body.max_classes).run();
                  return jsonResponse({success:true});
              }
              if(body.action === 'add_group_subject') {
                  await env.DB.prepare("INSERT INTO group_subjects (school_id, group_id, subject_id, classes_per_week, min_classes, max_classes) VALUES (?, ?, ?, ?, ?, ?)")
                      .bind(body.school_id, body.group_id, body.subject_id, body.classes_per_week, body.min_classes, body.max_classes).run();
                  return jsonResponse({success:true});
              }
              
              return jsonResponse({error:"Invalid action"},400);
          } catch(e) {
              console.error('Subjects API Error:', e);
              return jsonResponse({error: e.message}, 500);
          }
      }
      
      if(request.method === 'DELETE') {
          const body = await request.json();
          
          // Subject Bank actions
          if(body.type === 'bank') {
              await env.DB.prepare("DELETE FROM academic_subjects WHERE id = ?").bind(body.id).run();
              await env.DB.prepare("DELETE FROM class_subjects WHERE subject_id = ?").bind(body.id).run(); 
              await env.DB.prepare("DELETE FROM group_subjects WHERE subject_id = ?").bind(body.id).run(); 
              return jsonResponse({success:true});
          }
          
          // Class Curriculum actions
          if(body.action === 'delete_class_subject') {
              await env.DB.prepare("DELETE FROM class_subjects WHERE id=?").bind(body.id).run();
              return jsonResponse({success:true});
          }
          if(body.action === 'delete_group_subject') {
              await env.DB.prepare("DELETE FROM group_subjects WHERE id=?").bind(body.id).run();
              return jsonResponse({success:true});
          }
      }
      
      // Get all data for subjects page
      const subjects = await env.DB.prepare("SELECT * FROM academic_subjects WHERE school_id = ? ORDER BY subject_name ASC").bind(school.id).all();
      const classes = await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ? ORDER BY class_name ASC").bind(school.id).all();
      const groups = await env.DB.prepare("SELECT * FROM class_groups WHERE school_id = ? ORDER BY class_id, group_name").bind(school.id).all();
      const sections = await env.DB.prepare("SELECT cs.*, cg.group_name FROM class_sections cs LEFT JOIN class_groups cg ON cs.group_id = cg.id WHERE cs.school_id = ?").bind(school.id).all();
      
      // Get subject assignments
      const classSubjects = await env.DB.prepare(`
        SELECT cs.*, sub.subject_name 
        FROM class_subjects cs 
        JOIN academic_subjects sub ON cs.subject_id = sub.id 
        WHERE cs.school_id = ?
      `).bind(school.id).all();
      
      const groupSubjects = await env.DB.prepare(`
        SELECT gs.*, sub.subject_name, g.group_name, g.class_id
        FROM group_subjects gs 
        JOIN academic_subjects sub ON gs.subject_id = sub.id
        JOIN class_groups g ON gs.group_id = g.id
        WHERE gs.school_id = ?
      `).bind(school.id).all();
      
      // Get schedule configuration for capacity display
      let scheduleConfig = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
      if (!scheduleConfig) {
        await env.DB.prepare("INSERT INTO schedule_config (school_id, active_days, periods_per_day, working_days, off_days) VALUES (?, ?, ?, ?, ?)")
          .bind(school.id, 5, 8, '["monday","tuesday","wednesday","thursday","friday"]', '["saturday","sunday"]').run();
        scheduleConfig = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
      }
      
      // Parse working days and calculate capacity
      const workingDaysArray = scheduleConfig.working_days ? JSON.parse(scheduleConfig.working_days) : ["monday","tuesday","wednesday","thursday","friday"];
      const workingDaysCount = workingDaysArray.length; // Dynamic from user input
      const scheduleSlots = await env.DB.prepare("SELECT * FROM schedule_slots WHERE school_id = ? AND type = 'class'").bind(school.id).all();
      const actualClassPeriodsPerDay = scheduleSlots.results.length || 8;
      const maxClassesPerSection = workingDaysCount * actualClassPeriodsPerDay;
      
      scheduleConfig.actualClassPeriodsPerDay = actualClassPeriodsPerDay;
      scheduleConfig.maxClassesPerSection = maxClassesPerSection;
      scheduleConfig.workingDaysCount = workingDaysCount;
      scheduleConfig.workingDaysArray = workingDaysArray;
      
      return htmlResponse(InstituteLayout(
        SubjectsPageHTML(
          school,
          subjects.results, 
          classes.results,
          groups.results,
          sections.results,
          classSubjects.results,
          groupSubjects.results,
          scheduleConfig
        ), 
        "Subjects Management", 
        school.school_name
      ));
  }

  // --- TEACHERS (NEW SYSTEM: Table Interface + Subject Assignment) ---
  if (url.pathname === '/school/teachers') {
      if (request.method === 'POST') {
          const body = await request.json();
          
          // Add new teacher (without subjects)
          if (body.full_name && body.email && body.phone_digits) {
              const current = await env.DB.prepare("SELECT count(*) as count FROM profiles_teacher WHERE school_id = ?").bind(school.id).first();
              if (current.count >= (school.max_teachers || 10)) return jsonResponse({ error: "Limit Reached" }, 403);
              
              const cleanPhone = body.phone_digits.replace(/\D/g, ''); 
              await env.DB.prepare("INSERT INTO profiles_teacher (school_id, full_name, subject, email, phone) VALUES (?, ?, ?, ?, ?)")
                  .bind(school.id, body.full_name, '', body.email, `880-${cleanPhone}`).run();
              return jsonResponse({ success: true });
          }
          
          // Assign subjects to teacher
          if (body.action === 'assign_subjects') {
              // Clear existing assignments for this teacher
              await env.DB.prepare("DELETE FROM teacher_subjects WHERE teacher_id = ?").bind(body.teacher_id).run();
              
              // Add main subject
              if (body.main_subject) {
                  await env.DB.prepare("INSERT INTO teacher_subjects (school_id, teacher_id, subject_id, is_primary) VALUES (?, ?, ?, 1)")
                      .bind(school.id, body.teacher_id, body.main_subject, 1).run();
              }
              
              // Add additional subjects
              if (body.additional_subjects && Array.isArray(body.additional_subjects)) {
                  for (const subjectId of body.additional_subjects) {
                      await env.DB.prepare("INSERT INTO teacher_subjects (school_id, teacher_id, subject_id, is_primary) VALUES (?, ?, ?, 0)")
                          .bind(school.id, body.teacher_id, subjectId, 0).run();
                  }
              }
              
              return jsonResponse({ success: true });
          }
          
          return jsonResponse({ error: "Invalid action" }, 400);
      }
      
      if (request.method === 'DELETE') {
          const body = await request.json();
          
          // Remove teacher
          if (body.id) {
              await env.DB.prepare("DELETE FROM profiles_teacher WHERE id = ?").bind(body.id).run();
              await env.DB.prepare("DELETE FROM teacher_subjects WHERE teacher_id = ?").bind(body.id).run();
              return jsonResponse({ success: true });
          }
          
          return jsonResponse({ error: "Invalid request" }, 400);
      }
      
      // Get all data for teachers page
      const teachers = await env.DB.prepare("SELECT * FROM profiles_teacher WHERE school_id = ? ORDER BY id DESC").bind(school.id).all();
      const allSubjects = await env.DB.prepare("SELECT * FROM academic_subjects WHERE school_id = ? ORDER BY subject_name ASC").bind(school.id).all();
      const teacherSubjects = await env.DB.prepare(`
        SELECT ts.*, sub.subject_name 
        FROM teacher_subjects ts 
        JOIN academic_subjects sub ON ts.subject_id = sub.id 
        WHERE ts.school_id = ?
        ORDER BY ts.is_primary DESC, sub.subject_name ASC
      `).bind(school.id).all();
      
      return htmlResponse(InstituteLayout(
        TeachersPageHTML(
          school,
          teachers.results, 
          allSubjects.results,
          teacherSubjects.results
        ), 
        "Teachers Management", 
        school.school_name
      ));
  }
  
  // --- CLASSES (READ-ONLY HIERARCHY VIEW) ---
  if (url.pathname === '/school/classes') {
      // Get all data for read-only classes view
      const classes = await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ? ORDER BY class_name ASC").bind(school.id).all();
      const groups = await env.DB.prepare("SELECT * FROM class_groups WHERE school_id = ? ORDER BY class_id, group_name").bind(school.id).all();
      const sections = await env.DB.prepare("SELECT cs.*, cg.group_name FROM class_sections cs LEFT JOIN class_groups cg ON cs.group_id = cg.id WHERE cs.school_id = ?").bind(school.id).all();
      
      // Get subjects for capacity display
      const subjects = await env.DB.prepare("SELECT * FROM academic_subjects WHERE school_id = ? ORDER BY subject_name ASC").bind(school.id).all();
      const classSubjects = await env.DB.prepare(`
        SELECT cs.*, sub.subject_name 
        FROM class_subjects cs 
        JOIN academic_subjects sub ON cs.subject_id = sub.id 
        WHERE cs.school_id = ?
      `).bind(school.id).all();
      
      const groupSubjects = await env.DB.prepare(`
        SELECT gs.*, sub.subject_name, g.group_name, g.class_id
        FROM group_subjects gs 
        JOIN academic_subjects sub ON gs.subject_id = sub.id
        JOIN class_groups g ON gs.group_id = g.id
        WHERE gs.school_id = ?
      `).bind(school.id).all();
      
      // Get schedule configuration for capacity display
      let scheduleConfig = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
      if (!scheduleConfig) {
        await env.DB.prepare("INSERT INTO schedule_config (school_id, active_days, periods_per_day, working_days, off_days) VALUES (?, ?, ?, ?, ?)")
          .bind(school.id, 5, 8, '["monday","tuesday","wednesday","thursday","friday"]', '["saturday","sunday"]').run();
        scheduleConfig = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
      }
      
      // Parse working days and calculate capacity
      const workingDaysArray = scheduleConfig.working_days ? JSON.parse(scheduleConfig.working_days) : ["monday","tuesday","wednesday","thursday","friday"];
      const workingDaysCount = workingDaysArray.length; // Dynamic from user input
      const scheduleSlots = await env.DB.prepare("SELECT * FROM schedule_slots WHERE school_id = ? AND type = 'class'").bind(school.id).all();
      const actualClassPeriodsPerDay = scheduleSlots.results.length || 8;
      const maxClassesPerSection = workingDaysCount * actualClassPeriodsPerDay;
      
      scheduleConfig.actualClassPeriodsPerDay = actualClassPeriodsPerDay;
      scheduleConfig.maxClassesPerSection = maxClassesPerSection;
      scheduleConfig.workingDaysCount = workingDaysCount;
      scheduleConfig.workingDaysArray = workingDaysArray;
      
      return htmlResponse(InstituteLayout(
        ClassesPageHTML(
          school,
          classes.results, 
          groups.results, 
          sections.results,
          subjects.results,
          classSubjects.results,
          groupSubjects.results,
          scheduleConfig
        ), 
        "Classes & Groups", 
        school.school_name
      ));
  }

  return new Response("Not Found", {status:404});
}

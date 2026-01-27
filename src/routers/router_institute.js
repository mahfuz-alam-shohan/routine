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
              
              // SAVE SCHEDULE
              if (body.action === 'save_schedule') {
                  const slots = body.slots;
                  
                  // Delete existing slots and re-insert
                  await env.DB.prepare("DELETE FROM schedule_slots WHERE school_id = ?").bind(school.id).run();
                  
                  const stmt = env.DB.prepare("INSERT INTO schedule_slots (school_id, start_time, end_time, duration, label, type) VALUES (?, ?, ?, ?, ?, ?)");
                  const batch = slots.map(s => stmt.bind(school.id, s.start_time, s.end_time, s.duration, s.label, s.type));
                  
                  await env.DB.batch(batch);
                  
                  // Update school start time
                  if (slots.length > 0) {
                      await env.DB.prepare("UPDATE schedule_config SET start_time = ? WHERE school_id = ?")
                          .bind(slots[0].start_time, school.id).run();
                      
                      // If no config exists, insert it
                      const existing = await env.DB.prepare("SELECT id FROM schedule_config WHERE school_id = ?").bind(school.id).first();
                      if (!existing) {
                          await env.DB.prepare("INSERT INTO schedule_config (school_id, start_time) VALUES (?, ?)")
                              .bind(school.id, slots[0].start_time).run();
                      }
                  }
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
          slots = (await env.DB.prepare("SELECT * FROM schedule_slots WHERE school_id = ? ORDER BY start_time ASC").bind(school.id).all()).results;
          
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

  // --- SUBJECTS ---
  if (url.pathname === '/school/subjects') {
      // ... (Keep existing Subjects Logic) ...
      // For brevity in this response, assume existing logic remains or use previous block
      // Just ensure the imports match
       if (request.method === 'POST') {
          const body = await request.json();
          if (body.action === 'create') await env.DB.prepare("INSERT INTO academic_subjects (school_id, subject_name) VALUES (?, ?)").bind(school.id, body.name).run();
          if (body.action === 'rename') await env.DB.prepare("UPDATE academic_subjects SET subject_name = ? WHERE id = ?").bind(body.name, body.id).run();
          if (body.action === 'assign') {
               const exists = await env.DB.prepare("SELECT id FROM class_subjects_link WHERE class_name = ? AND subject_id = ?").bind(body.class_name, body.subject_id).first();
               if(!exists) await env.DB.prepare("INSERT INTO class_subjects_link (school_id, class_name, subject_id) VALUES (?, ?, ?)").bind(school.id, body.class_name, body.subject_id).run();
          }
          return jsonResponse({ success: true });
      }
      if (request.method === 'DELETE') {
          const body = await request.json();
          if (body.type === 'bank') {
              await env.DB.prepare("DELETE FROM academic_subjects WHERE id = ?").bind(body.id).run();
              await env.DB.prepare("DELETE FROM class_subjects_link WHERE subject_id = ?").bind(body.id).run(); 
          }
          if (body.type === 'curriculum') await env.DB.prepare("DELETE FROM class_subjects_link WHERE class_name = ? AND subject_id = ?").bind(body.class_name, body.subject_id).run();
          return jsonResponse({ success: true });
      }
      const subjects = await env.DB.prepare("SELECT * FROM academic_subjects WHERE school_id = ? ORDER BY subject_name ASC").bind(school.id).all();
      const classes = await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ?").bind(school.id).all();
      const allocations = await env.DB.prepare(`SELECT l.*, s.subject_name FROM class_subjects_link l JOIN academic_subjects s ON l.subject_id = s.id WHERE l.school_id = ?`).bind(school.id).all();
      return htmlResponse(InstituteLayout(SubjectsPageHTML(subjects.results, classes.results, allocations.results), "Subjects", school.school_name));
  }

  // --- TEACHERS ---
  if (url.pathname === '/school/teachers') {
      // ... (Keep existing Teachers Logic) ...
      if (request.method === 'POST') {
          const current = await env.DB.prepare("SELECT count(*) as count FROM profiles_teacher WHERE school_id = ?").bind(school.id).first();
          if (current.count >= (school.max_teachers || 10)) return jsonResponse({ error: "Limit Reached" }, 403);
          const body = await request.json();
          const cleanPhone = body.phone_digits.replace(/\D/g, ''); 
          await env.DB.prepare("INSERT INTO profiles_teacher (school_id, full_name, subject, email, phone) VALUES (?, ?, ?, ?, ?)")
              .bind(school.id, body.full_name, body.subject, body.email, `880-${cleanPhone}`).run();
          return jsonResponse({ success: true });
      }
      const teachers = await env.DB.prepare("SELECT * FROM profiles_teacher WHERE school_id = ? ORDER BY id DESC").bind(school.id).all();
      const allSubjects = await env.DB.prepare("SELECT * FROM academic_subjects WHERE school_id = ? ORDER BY subject_name ASC").bind(school.id).all();
      return htmlResponse(InstituteLayout(TeachersPageHTML(teachers.results, allSubjects.results), "Teachers", school.school_name));
  }
  
  // --- CLASSES (CURRICULUM MANAGEMENT) ---
  if (url.pathname === '/school/classes') {
      if(request.method === 'POST') {
          try {
              const body = await request.json();
              
              if(body.action === 'add_class_subject') {
                  // Add subject to class (common for all groups)
                  await env.DB.prepare("INSERT INTO class_subjects (school_id, class_id, subject_id, classes_per_week, min_classes, max_classes) VALUES (?, ?, ?, ?, ?, ?)")
                      .bind(body.school_id, body.class_id, body.subject_id, body.classes_per_week, body.min_classes, body.max_classes).run();
                  return jsonResponse({success:true});
              }
              
              if(body.action === 'add_group_subject') {
                  // Add subject to specific group
                  await env.DB.prepare("INSERT INTO group_subjects (school_id, group_id, subject_id, classes_per_week, min_classes, max_classes) VALUES (?, ?, ?, ?, ?, ?)")
                      .bind(body.school_id, body.group_id, body.subject_id, body.classes_per_week, body.min_classes, body.max_classes).run();
                  return jsonResponse({success:true});
              }
          } catch(e) {
              console.error('Classes API Error:', e);
              return jsonResponse({error: e.message}, 500);
          }
      }
      
      if(request.method === 'DELETE') {
          const body = await request.json();
          
          if(body.action === 'delete_class_subject') {
              await env.DB.prepare("DELETE FROM class_subjects WHERE id=?").bind(body.id).run();
              return jsonResponse({success:true});
          }
          
          if(body.action === 'delete_group_subject') {
              await env.DB.prepare("DELETE FROM group_subjects WHERE id=?").bind(body.id).run();
              return jsonResponse({success:true});
          }
      }
      
      // Get all data for curriculum management
      const classes = await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ? ORDER BY class_name ASC").bind(school.id).all();
      const groups = await env.DB.prepare("SELECT * FROM class_groups WHERE school_id = ? ORDER BY class_id, group_name").bind(school.id).all();
      const sections = await env.DB.prepare("SELECT cs.*, cg.group_name FROM class_sections cs LEFT JOIN class_groups cg ON cs.group_id = cg.id WHERE cs.school_id = ?").bind(school.id).all();
      
      // Get subjects and assignments
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
      
      // Get schedule configuration and calculate capacity from master schedule
      let scheduleConfig = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
      if (!scheduleConfig) {
        // Create default config if doesn't exist
        await env.DB.prepare("INSERT INTO schedule_config (school_id, active_days, periods_per_day) VALUES (?, ?, ?)")
          .bind(school.id, 5, 8).run();
        scheduleConfig = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
      }

      // Calculate actual class periods from master schedule (excluding breaks)
      const scheduleSlots = await env.DB.prepare("SELECT * FROM schedule_slots WHERE school_id = ? AND type = 'class'").bind(school.id).all();
      const actualClassPeriodsPerDay = scheduleSlots.results.length || 8; // Fallback to 8 if no slots found
      const maxClassesPerSection = (scheduleConfig.active_days || 5) * actualClassPeriodsPerDay;
      
      // Update scheduleConfig with calculated values
      scheduleConfig.actualClassPeriodsPerDay = actualClassPeriodsPerDay;
      scheduleConfig.maxClassesPerSection = maxClassesPerSection;
      
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
        "Classes & Curriculum", 
        school.school_name
      ));
  }

  return new Response("Not Found", {status:404});
}

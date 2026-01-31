import { htmlResponse, jsonResponse, getCookie } from '../core/utils.js';
import { InstituteLayout } from '../ui/institute/layout.js';
import { InstituteDashboardHTML } from '../ui/institute/dashboard.js';
import { TeachersPageHTML } from '../ui/institute/teachers_list.js'; 
import { ClassesPageHTML } from '../ui/institute/classes.js'; 
import { SubjectsPageHTML } from '../ui/institute/subjects.js'; 
import { SchedulesPageHTML } from '../ui/institute/schedules.js'; 
import { TeachersAssignmentPageHTML } from '../ui/institute/teachers_assignment.js';
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

  // --- SUBJECT USAGE CHECK API ---
  if (url.pathname === '/school/subjects/usage') {
      const subjectId = url.searchParams.get('id');
      if (!subjectId) {
          return jsonResponse({error: 'Subject ID required'}, 400);
      }
      
      try {
          console.log('Checking usage for subject:', subjectId);
          
          // Get all usage for this subject
          const classUsage = await env.DB.prepare(`
              SELECT cs.id, c.class_name, cs.classes_per_week, 
                     cs.is_fixed, cs.min_classes, cs.max_classes
              FROM class_subjects cs 
              JOIN academic_classes c ON cs.class_id = c.id
              WHERE cs.subject_id = ? AND cs.school_id = ?
          `).bind(subjectId, school.id).all();
          
          console.log('Class usage:', classUsage.results);
          
          const groupUsage = await env.DB.prepare(`
              SELECT gs.id, g.group_name, gs.classes_per_week,
                     gs.is_fixed, gs.min_classes, gs.max_classes
              FROM group_subjects gs
              JOIN class_groups g ON gs.group_id = g.id
              WHERE gs.subject_id = ? AND gs.school_id = ?
          `).bind(subjectId, school.id).all();
          
          console.log('Group usage:', groupUsage.results);
          
          // Check teacher assignments (with error handling for missing table)
          let teacherUsage = { results: [] };
          try {
              // First check if table exists
              const tableCheck = await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='teacher_assignments'").first();
              if (tableCheck) {
                  teacherUsage = await env.DB.prepare(`
                      SELECT ta.id, t.full_name as teacher_name, sub.subject_name
                      FROM teacher_assignments ta
                      JOIN profiles_teacher t ON ta.teacher_id = t.id
                      JOIN academic_subjects sub ON ta.subject_id = sub.id
                      WHERE ta.subject_id = ? AND ta.school_id = ?
                  `).bind(subjectId, school.id).all();
                  console.log('Teacher usage:', teacherUsage.results);
              } else {
                  console.log('Teacher assignments table does not exist');
              }
          } catch (error) {
              console.log('Teacher assignments query failed:', error.message);
              teacherUsage = { results: [] };
          }
          
          const subjectInfo = await env.DB.prepare("SELECT subject_name FROM academic_subjects WHERE id = ? AND school_id = ?").bind(subjectId, school.id).first();
          console.log('Subject info:', subjectInfo);
          
          return jsonResponse({
              success: true,
              data: {
                  subject: subjectInfo,
                  classes: classUsage.results,
                  groups: groupUsage.results,
                  teachers: teacherUsage.results
              }
          });
      } catch (error) {
          console.error('Usage check error:', error);
          return jsonResponse({error: 'Error checking subject usage: ' + error.message}, 500);
      }
  }

  // --- SUBJECT REPLACEMENT API ---
  if (url.pathname === '/school/subjects/replace') {
      const body = await request.json();
      
      try {
          if (body.action === 'replace_subject') {
              const { oldSubjectId, newSubjectId } = body;
              
              // Update class_subjects assignments
              await env.DB.prepare(`
                  UPDATE class_subjects 
                  SET subject_id = ? 
                  WHERE subject_id = ? AND school_id = ?
              `).bind(newSubjectId, oldSubjectId, school.id).run();
              
              // Update group_subjects assignments  
              await env.DB.prepare(`
                  UPDATE group_subjects 
                  SET subject_id = ? 
                  WHERE subject_id = ? AND school_id = ?
              `).bind(newSubjectId, oldSubjectId, school.id).run();
              
              // Delete old subject
              await env.DB.prepare("DELETE FROM academic_subjects WHERE id = ? AND school_id = ?").bind(oldSubjectId, school.id).run();
              
              return jsonResponse({success:true});
          }
          
          return jsonResponse({error:"Invalid action"},400);
      } catch (error) {
          console.error('Replace error:', error);
          return jsonResponse({error: 'Error replacing subject: ' + error.message}, 500);
      }
  }
  
  // --- REMOVE ASSIGNMENTS AND DELETE API ---
  if (url.pathname === '/school/subjects/remove-assignments') {
      const body = await request.json();
      
      try {
          if (body.action === 'remove_assignments_and_delete') {
              const { subjectId } = body;
              
              // Remove from class_subjects
              await env.DB.prepare("DELETE FROM class_subjects WHERE subject_id = ? AND school_id = ?").bind(subjectId, school.id).run();
              
              // Remove from group_subjects
              await env.DB.prepare("DELETE FROM group_subjects WHERE subject_id = ? AND school_id = ?").bind(subjectId, school.id).run();
              
              // Remove from teacher assignments (if table exists)
              try {
                  await env.DB.prepare("DELETE FROM teacher_assignments WHERE subject_id = ? AND school_id = ?").bind(subjectId, school.id).run();
              } catch (error) {
                  console.log('Teacher assignments table not found, skipping...');
              }
              
              // Delete the subject
              await env.DB.prepare("DELETE FROM academic_subjects WHERE id = ? AND school_id = ?").bind(subjectId, school.id).run();
              
              return jsonResponse({success:true});
          }
          
          return jsonResponse({error:"Invalid action"},400);
      } catch (error) {
          console.error('Remove assignments error:', error);
          return jsonResponse({error: 'Error removing assignments: ' + error.message}, 500);
      }
  }
  
  // --- SUBJECTS LIST API ---
  if (url.pathname === '/school/subjects/list') {
      try {
          const subjects = await env.DB.prepare("SELECT id, subject_name FROM academic_subjects WHERE school_id = ? ORDER BY subject_name ASC").bind(school.id).all();
          return jsonResponse({
              success: true,
              data: subjects.results
          });
      } catch (error) {
          console.error('Subjects list error:', error);
          return jsonResponse({error: 'Error fetching subjects'}, 500);
      }
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
                  const isFixed = body.is_fixed === true || body.is_fixed === 'true';
                  if(isFixed) {
                      // Fixed schedule - only classes_per_week matters
                      await env.DB.prepare("INSERT INTO class_subjects (school_id, class_id, subject_id, classes_per_week, is_fixed) VALUES (?, ?, ?, ?, ?)")
                          .bind(body.school_id, body.class_id, body.subject_id, body.classes_per_week, 1).run();
                  } else {
                      // Flexible schedule - min/max matters
                      await env.DB.prepare("INSERT INTO class_subjects (school_id, class_id, subject_id, min_classes, max_classes, is_fixed) VALUES (?, ?, ?, ?, ?, ?)")
                          .bind(body.school_id, body.class_id, body.subject_id, body.min_classes, body.max_classes, 0).run();
                  }
                  
                  // Auto-create auto-assignment for this class subject
                  await env.DB.prepare(`
                      INSERT INTO teacher_assignments (school_id, class_id, group_id, section_id, subject_id, teacher_id, is_auto) 
                      VALUES (?, ?, ?, ?, ?, ?, 1)
                  `).bind(body.school_id, body.class_id, null, null, body.subject_id, null).run();
                  
                  return jsonResponse({success:true});
              }
              if(body.action === 'add_group_subject') {
                  const isFixed = body.is_fixed === true || body.is_fixed === 'true';
                  if(isFixed) {
                      // Fixed schedule - only classes_per_week matters
                      await env.DB.prepare("INSERT INTO group_subjects (school_id, group_id, subject_id, classes_per_week, is_fixed) VALUES (?, ?, ?, ?, ?)")
                          .bind(body.school_id, body.group_id, body.subject_id, body.classes_per_week, 1).run();
                  } else {
                      // Flexible schedule - min/max matters
                      await env.DB.prepare("INSERT INTO group_subjects (school_id, group_id, subject_id, min_classes, max_classes, is_fixed) VALUES (?, ?, ?, ?, ?, ?)")
                          .bind(body.school_id, body.group_id, body.subject_id, body.min_classes, body.max_classes, 0).run();
                  }
                  
                  // Auto-create auto-assignment for this group subject
                  const classInfo = await env.DB.prepare("SELECT class_id FROM class_groups WHERE id = ?").bind(body.group_id).first();
                  await env.DB.prepare(`
                      INSERT INTO teacher_assignments (school_id, class_id, group_id, section_id, subject_id, teacher_id, is_auto) 
                      VALUES (?, ?, ?, ?, ?, ?, 1)
                  `).bind(body.school_id, classInfo.class_id, body.group_id, null, body.subject_id, null).run();
                  
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
          console.log('DELETE request body:', body);
          
          try {
              // Subject Bank actions
              if(body.type === 'bank') {
                  console.log('Attempting to delete subject from bank:', body.id);
                  
                  // Check if subject exists first
                  const subjectExists = await env.DB.prepare("SELECT id, subject_name FROM academic_subjects WHERE id = ? AND school_id = ?").bind(body.id, school.id).first();
                  console.log('Subject exists:', subjectExists);
                  
                  if (!subjectExists) {
                      return jsonResponse({error: "Subject not found"}, 404);
                  }
                  
                  // Check if subject is being used in curriculum before deleting
                  const classUsage = await env.DB.prepare("SELECT COUNT(*) as count FROM class_subjects WHERE subject_id = ? AND school_id = ?").bind(body.id, school.id).first();
                  const groupUsage = await env.DB.prepare("SELECT COUNT(*) as count FROM group_subjects WHERE subject_id = ? AND school_id = ?").bind(body.id, school.id).first();
                  
                  console.log('Subject usage check:', { subjectId: body.id, classUsage: classUsage.count, groupUsage: groupUsage.count });
                  
                  if (classUsage.count > 0) {
                      return jsonResponse({ 
                          error: "Cannot delete subject - it is assigned to " + classUsage.count + " class(es). Remove from curriculum first." 
                      }, 400);
                  }
                  
                  if (groupUsage.count > 0) {
                      return jsonResponse({ 
                          error: "Cannot delete subject - it is assigned to " + groupUsage.count + " group(s). Remove from curriculum first." 
                      }, 400);
                  }
                  
                  // Safe to delete now
                  console.log('Deleting subject:', body.id);
                  const deleteResult = await env.DB.prepare("DELETE FROM academic_subjects WHERE id = ? AND school_id = ?").bind(body.id, school.id).run();
                  console.log('Delete result:', deleteResult);
                  
                  return jsonResponse({success:true, deleted: subjectExists});
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
              
              return jsonResponse({error:"Invalid delete request"},400);
          } catch (error) {
              console.error('Delete error:', error);
              return jsonResponse({ 
                  error: "Database error: " + error.message 
              }, 500);
          }
      }
      
      // Get all data for subjects page
      
      // Clean up existing data - migrate old format to new format
      try {
          // Update existing class_subjects to have is_fixed = 1 (fixed by default)
          await env.DB.prepare("UPDATE class_subjects SET is_fixed = 1 WHERE is_fixed IS NULL").run();
          // Update existing group_subjects to have is_fixed = 1 (fixed by default)
          await env.DB.prepare("UPDATE group_subjects SET is_fixed = 1 WHERE is_fixed IS NULL").run();
      } catch(e) {
          console.log('Data migration completed or not needed');
      }
      
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

  // --- TEACHER ASSIGNMENT (DEFAULT TEACHERS PAGE) ---
  if (url.pathname === '/school/teachers') {
      // Get all data for teacher assignment page
      const classes = await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ? ORDER BY class_name ASC").bind(school.id).all();
      const groups = await env.DB.prepare("SELECT * FROM class_groups WHERE school_id = ? ORDER BY class_id, group_name").bind(school.id).all();
      const sections = await env.DB.prepare("SELECT * FROM class_sections WHERE school_id = ?").bind(school.id).all();
      const subjects = await env.DB.prepare("SELECT * FROM academic_subjects WHERE school_id = ? ORDER BY subject_name ASC").bind(school.id).all();
      const teachers = await env.DB.prepare("SELECT * FROM profiles_teacher WHERE school_id = ? ORDER BY full_name ASC").bind(school.id).all();
      const teacherSubjects = await env.DB.prepare(`
        SELECT ts.*, sub.subject_name 
        FROM teacher_subjects ts 
        JOIN academic_subjects sub ON ts.subject_id = sub.id 
        WHERE ts.school_id = ?
      `).bind(school.id).all();
      
      const teacherAssignments = await env.DB.prepare(`
        SELECT ta.*, t.full_name as teacher_name, sub.subject_name
        FROM teacher_assignments ta
        LEFT JOIN profiles_teacher t ON ta.teacher_id = t.id
        JOIN academic_subjects sub ON ta.subject_id = sub.id
        WHERE ta.school_id = ?
      `).bind(school.id).all();
      
      // Get subject assignments
      const classSubjects = await env.DB.prepare(`
        SELECT cs.*, sub.subject_name 
        FROM class_subjects cs 
        JOIN academic_subjects sub ON cs.subject_id = sub.id 
        WHERE cs.school_id = ?
      `).bind(school.id).all();
      
      const groupSubjects = await env.DB.prepare(`
        SELECT gs.*, sub.subject_name 
        FROM group_subjects gs 
        JOIN academic_subjects sub ON gs.subject_id = sub.id
        WHERE gs.school_id = ?
      `).bind(school.id).all();
      
      return htmlResponse(InstituteLayout(
        TeachersAssignmentPageHTML(
          school,
          classes.results || classes, 
          groups.results || groups,
          sections.results || sections,
          subjects.results || subjects,
          classSubjects.results || classSubjects,
          groupSubjects.results || groupSubjects,
          teachers.results || teachers,
          teacherSubjects.results || teacherSubjects,
          teacherAssignments.results || teacherAssignments
        ), 
        "Teacher Assignment", 
        school.school_name
      ));
  }

  // --- TEACHERS LIST ---
  if (url.pathname === '/school/teachers-list') {
      if (request.method === 'POST') {
          const body = await request.json();
          
          // Add new teacher
          if (body.full_name && body.email && body.phone) {
              const current = await env.DB.prepare("SELECT count(*) as count FROM profiles_teacher WHERE school_id = ?").bind(school.id).first();
              if (current.count >= (school.max_teachers || 10)) return jsonResponse({ error: "Teacher limit reached" }, 403);
              
              await env.DB.prepare("INSERT INTO profiles_teacher (school_id, full_name, email, phone) VALUES (?, ?, ?, ?)")
                  .bind(school.id, body.full_name, body.email, body.phone).run();
              return jsonResponse({ success: true });
          }
          
          // Assign subjects to teacher
          if (body.action === 'assign_subjects') {
              // Clear existing assignments for this teacher
              await env.DB.prepare("DELETE FROM teacher_subjects WHERE teacher_id = ?").bind(body.teacher_id).run();
              
              // Add primary subject
              if (body.primary_subject) {
                  await env.DB.prepare("INSERT INTO teacher_subjects (school_id, teacher_id, subject_id, is_primary) VALUES (?, ?, ?, 1)")
                      .bind(school.id, body.teacher_id, body.primary_subject).run();
              }
              
              // Add additional subjects
              if (body.additional_subjects && Array.isArray(body.additional_subjects)) {
                  for (const subjectId of body.additional_subjects) {
                      await env.DB.prepare("INSERT INTO teacher_subjects (school_id, teacher_id, subject_id, is_primary) VALUES (?, ?, ?, 0)")
                          .bind(school.id, body.teacher_id, subjectId).run();
                  }
              }
              
              return jsonResponse({ success: true });
          }
          
          return jsonResponse({ error: "Invalid request" }, 400);
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
      console.log('Loading teachers page for school:', school.id);
      const teachers = await env.DB.prepare("SELECT * FROM profiles_teacher WHERE school_id = ? ORDER BY id DESC").bind(school.id).all();
      const allSubjects = await env.DB.prepare("SELECT * FROM academic_subjects WHERE school_id = ? ORDER BY subject_name ASC").bind(school.id).all();
      const teacherSubjects = await env.DB.prepare(`
        SELECT ts.*, sub.subject_name 
        FROM teacher_subjects ts 
        JOIN academic_subjects sub ON ts.subject_id = sub.id 
        WHERE ts.school_id = ?
        ORDER BY ts.is_primary DESC, sub.subject_name ASC
      `).bind(school.id).all();
      
      console.log('Teachers data:', teachers.results);
      console.log('Subjects data:', allSubjects.results);
      console.log('Teacher subjects data:', teacherSubjects.results);
      
      return htmlResponse(InstituteLayout(
        TeachersPageHTML(
          school,
          teachers.results || teachers, 
          allSubjects.results || allSubjects,
          teacherSubjects.results || teacherSubjects
        ), 
        "Teachers Management", 
        school.school_name
      ));
  }
  
  // --- TEACHER ASSIGNMENT API ---
  if (url.pathname === '/school/teacher-assignments') {
      if (request.method === 'POST') {
          const body = await request.json();
          
          if (body.action === 'assign_teacher') {
              // Check if there's already an auto-assignment for this subject
              const existingAssignment = await env.DB.prepare(`
                  SELECT id FROM teacher_assignments 
                  WHERE school_id = ? AND class_id = ? AND 
                        (group_id = ? OR (group_id IS NULL AND ? IS NULL)) AND
                        (section_id = ? OR (section_id IS NULL AND ? IS NULL)) AND
                        subject_id = ?
              `).bind(
                  school.id,
                  body.class_id,
                  body.group_id,
                  body.group_id,
                  body.section_id,
                  body.section_id,
                  body.subject_id
              ).first();
              
              if (existingAssignment) {
                  // Update existing assignment to manual with specific teacher
                  await env.DB.prepare(`
                      UPDATE teacher_assignments 
                      SET teacher_id = ?, is_auto = 0
                      WHERE id = ? AND school_id = ?
                  `).bind(
                      body.teacher_id,
                      existingAssignment.id,
                      school.id
                  ).run();
              } else {
                  // Create new teacher assignment record
                  await env.DB.prepare(`
                      INSERT INTO teacher_assignments (school_id, class_id, group_id, section_id, subject_id, teacher_id, is_auto) 
                      VALUES (?, ?, ?, ?, ?, ?, 0)
                  `).bind(
                      school.id,
                      body.class_id,
                      body.group_id,
                      body.section_id,
                      body.subject_id,
                      body.teacher_id
                  ).run();
              }
              
              return jsonResponse({ success: true });
          }
          
          if (body.action === 'replace_teacher') {
              // Update existing teacher assignment
              await env.DB.prepare(`
                  UPDATE teacher_assignments 
                  SET teacher_id = ?, is_auto = 0
                  WHERE id = ? AND school_id = ?
              `).bind(
                  body.teacher_id,
                  body.existing_assignment_id,
                  school.id
              ).run();
              
              return jsonResponse({ success: true });
          }
          
          if (body.action === 'assign_auto') {
              // Create auto-assignment record (teacher_id can be null)
              await env.DB.prepare(`
                  INSERT INTO teacher_assignments (school_id, class_id, group_id, section_id, subject_id, teacher_id, is_auto) 
                  VALUES (?, ?, ?, ?, ?, ?, 1)
              `).bind(
                  school.id,
                  body.class_id,
                  body.group_id || null,
                  body.section_id || null,
                  body.subject_id,
                  null // teacher_id is null for auto assignments
              ).run();
              
              return jsonResponse({ success: true });
          }
          
          if (body.action === 'set_auto') {
              // Convert existing assignment to auto
              await env.DB.prepare(`
                  UPDATE teacher_assignments 
                  SET teacher_id = null, is_auto = 1
                  WHERE id = ? AND school_id = ?
              `).bind(
                  body.assignment_id,
                  school.id
              ).run();
              
              return jsonResponse({ success: true });
          }
          
          if (body.action === 'set_manual') {
              // Convert auto assignment to manual with specific teacher
              await env.DB.prepare(`
                  UPDATE teacher_assignments 
                  SET teacher_id = ?, is_auto = 0
                  WHERE id = ? AND school_id = ?
              `).bind(
                  body.teacher_id,
                  body.assignment_id,
                  school.id
              ).run();
              
              return jsonResponse({ success: true });
          }
          
          return jsonResponse({ error: "Invalid action" }, 400);
      }
      
      if (request.method === 'DELETE') {
          const body = await request.json();
          
          if (body.action === 'remove_teacher') {
              // Remove teacher assignment
              await env.DB.prepare(`
                  DELETE FROM teacher_assignments 
                  WHERE id = ? AND school_id = ?
              `).bind(
                  body.assignment_id,
                  school.id
              ).run();
              
              return jsonResponse({ success: true });
          }
          
          return jsonResponse({ error: "Invalid action" }, 400);
      }
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

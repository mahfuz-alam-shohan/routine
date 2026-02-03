import { htmlResponse, jsonResponse, getCookie } from '../core/utils.js';
import { InstituteLayout } from '../ui/institute/layout.js';
import { InstituteDashboardHTML } from '../ui/institute/dashboard.js';
import { TeachersPageHTML } from '../ui/institute/teachers_list.js'; 
import { ClassesPageHTML } from '../ui/institute/classes.js'; 
import { SubjectsPageHTML } from '../ui/institute/subjects.js'; 
import { SchedulesPageHTML } from '../ui/institute/schedules.js'; 
import { TeachersAssignmentPageHTML } from '../ui/institute/teachers_assignment.js';
import { RoutineGeneratorHTML } from '../ui/institute/routine_generator.js';
import { RoutineViewerHTML } from '../ui/institute/routine_viewer.js';
import { syncDatabase } from '../core/schema_manager.js';

export async function handleInstituteRequest(request, env) {
  const url = new URL(request.url);
  const email = getCookie(request, 'user_email');
  if (!email) return htmlResponse("<h1>Login Failed</h1>");

  const school = await env.DB.prepare(`SELECT p.* FROM profiles_institution p JOIN auth_accounts a ON p.auth_id = a.id WHERE a.email = ?`).bind(email).first();
  if(!school) return new Response("Error", {status: 404});

  
  if (url.pathname === '/school/dashboard') {
    const tCount = await env.DB.prepare("SELECT count(*) as count FROM profiles_teacher WHERE school_id = ?").bind(school.id).first();
    const cCount = await env.DB.prepare("SELECT count(*) as count FROM academic_classes WHERE school_id = ?").bind(school.id).first();
    const rCount = await env.DB.prepare("SELECT count(*) as count FROM generated_routines WHERE school_id = ?").bind(school.id).first();
    return htmlResponse(InstituteLayout(InstituteDashboardHTML({teachers: tCount.count, classes: cCount.count, routines: rCount.count}), "Dashboard", school.school_name));
  }

  
  if (url.pathname === '/school/schedules') {
      
      if (request.method === 'POST') {
          try {
              const body = await request.json();
              if(body.action === 'save_schedule') {
                  let scheduleConfig = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
                  if (!scheduleConfig) {
                      await env.DB.prepare("INSERT INTO schedule_config (school_id, active_days, periods_per_day, working_days, off_days, shifts_json) VALUES (?, ?, ?, ?, ?, ?)")
                          .bind(school.id, 5, 8, '["monday","tuesday","wednesday","thursday","friday"]', '["saturday","sunday"]', '["Full Day"]').run();
                      scheduleConfig = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
                  }
                  const shiftList = school.shifts_enabled ? parseShiftList(scheduleConfig?.shifts_json) : ['Full Day'];

                  await env.DB.prepare("DELETE FROM schedule_slots WHERE school_id = ?").bind(school.id).run();

                  for(let i = 0; i < body.slots.length; i++) {
                      const slot = body.slots[i];
                      const applicableShifts = school.shifts_enabled
                        ? parseApplicableShifts(slot.applicable_shifts, shiftList)
                        : ['Full Day'];
                      await env.DB.prepare("INSERT INTO schedule_slots (school_id, slot_index, start_time, end_time, label, duration, type, applicable_shifts) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
                          .bind(school.id, i, slot.start_time, slot.end_time, slot.label, slot.duration, slot.type, JSON.stringify(applicableShifts)).run();
                  }

                  const workingDaysArray = parseWorkingDays(body.working_days);
                  const workingDays = JSON.stringify(workingDaysArray);
                  const allDays = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
                  const offDays = JSON.stringify(allDays.filter(day => !workingDaysArray.includes(day)));
                  const workingDaysCount = workingDaysArray.length || 5;
                  
                  
                  await env.DB.prepare("UPDATE schedule_config SET working_days = ?, off_days = ?, active_days = ? WHERE school_id = ?")
                      .bind(workingDays, offDays, workingDaysCount, school.id).run();
              }
              return jsonResponse({ success: true });
          } catch(e) { 
              if(e.message.includes("no such table")) await syncDatabase(env);
              return jsonResponse({ error: e.message }, 500); 
          }
      }

      
      if (request.method === 'DELETE') {
          await env.DB.prepare("DELETE FROM schedule_slots WHERE school_id = ?").bind(school.id).run();
          let shiftsJson = '["Full Day"]';
          try {
              const existingConfig = await env.DB.prepare("SELECT shifts_json FROM schedule_config WHERE school_id = ?").bind(school.id).first();
              if (existingConfig?.shifts_json) shiftsJson = existingConfig.shifts_json;
          } catch (e) {}
          await env.DB.prepare("DELETE FROM schedule_config WHERE school_id = ?").bind(school.id).run();
          await env.DB.prepare("INSERT INTO schedule_config (school_id, active_days, periods_per_day, working_days, off_days, shifts_json) VALUES (?, ?, ?, ?, ?, ?)")
              .bind(school.id, 5, 8, '["monday","tuesday","wednesday","thursday","friday"]', '["saturday","sunday"]', shiftsJson).run();
          return jsonResponse({ success: true });
      }

      
      let config = null;
      let slots = [];
      try { 
          config = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first(); 
          slots = (await env.DB.prepare("SELECT * FROM schedule_slots WHERE school_id = ? ORDER BY slot_index ASC").bind(school.id).all()).results;
          
          
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
      const shiftList = parseShiftList(config?.shifts_json);
      if (config) {
          const workingDaysArray = parseWorkingDays(config.working_days);
          if (config.working_days !== JSON.stringify(workingDaysArray)) {
              await env.DB.prepare("UPDATE schedule_config SET working_days = ?, active_days = ? WHERE school_id = ?")
                  .bind(JSON.stringify(workingDaysArray), workingDaysArray.length, school.id).run();
              config.working_days = workingDaysArray;
              config.active_days = workingDaysArray.length;
          } else {
              config.working_days = workingDaysArray;
          }
      }
      if (config && config.shifts_json !== JSON.stringify(shiftList)) {
          await env.DB.prepare("UPDATE schedule_config SET shifts_json = ? WHERE school_id = ?")
              .bind(JSON.stringify(shiftList), school.id).run();
          config.shifts_json = JSON.stringify(shiftList);
      }
      let normalizedSlots = normalizeSlotsForShifts(slots, shiftList);
      const slotUpdates = normalizedSlots.filter(slot => {
          const normalized = parseApplicableShifts(slot.applicable_shifts, shiftList);
          const normalizedJson = JSON.stringify(normalized);
          const raw = typeof slot.applicable_shifts === 'string'
              ? slot.applicable_shifts
              : JSON.stringify(slot.applicable_shifts || []);
          return normalizedJson !== raw;
      });
      for (const slot of slotUpdates) {
          const normalized = parseApplicableShifts(slot.applicable_shifts, shiftList);
          await env.DB.prepare("UPDATE schedule_slots SET applicable_shifts = ? WHERE id = ?")
              .bind(JSON.stringify(normalized), slot.id).run();
      }
      if (slotUpdates.length) {
          const refreshed = (await env.DB.prepare("SELECT * FROM schedule_slots WHERE school_id = ? ORDER BY slot_index ASC").bind(school.id).all()).results;
          normalizedSlots = normalizeSlotsForShifts(refreshed, shiftList);
      }
      const shiftConfig = {
          enabled: !!school.shifts_enabled,
          shifts: shiftList
      };
      slots = normalizedSlots;
      return htmlResponse(InstituteLayout(SchedulesPageHTML(config, slots, shiftConfig), "Master Schedule", school.school_name));
  }

  
  if (url.pathname === '/school/subjects/usage') {
      const subjectId = url.searchParams.get('id');
      if (!subjectId) {
          return jsonResponse({error: 'Subject ID required'}, 400);
      }
      
      try {
          
          
          const classUsage = await env.DB.prepare(`
              SELECT cs.id, c.class_name, cs.classes_per_week, 
                     cs.is_fixed, cs.min_classes, cs.max_classes
              FROM class_subjects cs 
              JOIN academic_classes c ON cs.class_id = c.id
              WHERE cs.subject_id = ? AND cs.school_id = ?
          `).bind(subjectId, school.id).all();
          
          
          const groupUsage = await env.DB.prepare(`
              SELECT gs.id, g.group_name, gs.classes_per_week,
                     gs.is_fixed, gs.min_classes, gs.max_classes
              FROM group_subjects gs
              JOIN class_groups g ON gs.group_id = g.id
              WHERE gs.subject_id = ? AND gs.school_id = ?
          `).bind(subjectId, school.id).all();
          
          
          
          let teacherUsage = { results: [] };
          try {
              
              const tableCheck = await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='teacher_assignments'").first();
              if (tableCheck) {
                  teacherUsage = await env.DB.prepare(`
                      SELECT ta.id, t.full_name as teacher_name, sub.subject_name
                      FROM teacher_assignments ta
                      JOIN profiles_teacher t ON ta.teacher_id = t.id
                      JOIN academic_subjects sub ON ta.subject_id = sub.id
                      WHERE ta.subject_id = ? AND ta.school_id = ?
                  `).bind(subjectId, school.id).all();
              } else {
              }
          } catch (error) {
              teacherUsage = { results: [] };
          }
          
          const subjectInfo = await env.DB.prepare("SELECT subject_name FROM academic_subjects WHERE id = ? AND school_id = ?").bind(subjectId, school.id).first();
          
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

  
  if (url.pathname === '/school/subjects/replace') {
      const body = await request.json();
      
      try {
          if (body.action === 'replace_subject') {
              const { oldSubjectId, newSubjectId } = body;
              
              
              await env.DB.prepare(`
                  UPDATE class_subjects 
                  SET subject_id = ? 
                  WHERE subject_id = ? AND school_id = ?
              `).bind(newSubjectId, oldSubjectId, school.id).run();
              
              
              await env.DB.prepare(`
                  UPDATE group_subjects 
                  SET subject_id = ? 
                  WHERE subject_id = ? AND school_id = ?
              `).bind(newSubjectId, oldSubjectId, school.id).run();
              
              
              await env.DB.prepare("DELETE FROM academic_subjects WHERE id = ? AND school_id = ?").bind(oldSubjectId, school.id).run();
              
              return jsonResponse({success:true});
          }
          
          return jsonResponse({error:"Invalid action"},400);
      } catch (error) {
          console.error('Replace error:', error);
          return jsonResponse({error: 'Error replacing subject: ' + error.message}, 500);
      }
  }
  
  
  if (url.pathname === '/school/subjects/remove-assignments') {
      const body = await request.json();
      
      try {
          if (body.action === 'remove_assignments_and_delete') {
              const { subjectId } = body;
              
              
              await env.DB.prepare("DELETE FROM class_subjects WHERE subject_id = ? AND school_id = ?").bind(subjectId, school.id).run();
              
              
              await env.DB.prepare("DELETE FROM group_subjects WHERE subject_id = ? AND school_id = ?").bind(subjectId, school.id).run();
              
              
              try {
                  await env.DB.prepare("DELETE FROM teacher_assignments WHERE subject_id = ? AND school_id = ?").bind(subjectId, school.id).run();
              } catch (error) {
              }
              
              
              await env.DB.prepare("DELETE FROM academic_subjects WHERE id = ? AND school_id = ?").bind(subjectId, school.id).run();
              
              return jsonResponse({success:true});
          }
          
          return jsonResponse({error:"Invalid action"},400);
      } catch (error) {
          console.error('Remove assignments error:', error);
          return jsonResponse({error: 'Error removing assignments: ' + error.message}, 500);
      }
  }
  
  
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

  
  if (url.pathname === '/school/subjects') {
      if(request.method === 'POST') {
          try {
              const body = await request.json();
              
              
              if(body.action === 'create') {
                  const created = await env.DB.prepare("INSERT INTO academic_subjects (school_id, subject_name) VALUES (?, ?) RETURNING id")
                      .bind(school.id, body.name)
                      .first();
                  return jsonResponse({ success: true, id: created?.id || null, subject_name: body.name });
              }
              if(body.action === 'rename') {
                  await env.DB.prepare("UPDATE academic_subjects SET subject_name = ? WHERE id = ?").bind(body.name, body.id).run();
                  return jsonResponse({success:true});
              }
              
              
              if(body.action === 'add_class_subject') {
                  
                  const existingSubject = await env.DB.prepare("SELECT id FROM class_subjects WHERE school_id = ? AND class_id = ? AND subject_id = ?")
                      .bind(body.school_id, body.class_id, body.subject_id).first();
                  if(existingSubject) return jsonResponse({error: "This subject is already added to this class"}, 400);
                  
                  
                  const existingGroupSubject = await env.DB.prepare(`
                      SELECT gs.id FROM group_subjects gs 
                      JOIN class_groups cg ON gs.group_id = cg.id 
                      WHERE gs.school_id = ? AND cg.class_id = ? AND gs.subject_id = ?
                  `).bind(body.school_id, body.class_id, body.subject_id).first();
                  if(existingGroupSubject) return jsonResponse({error: "This subject is already added to one or more groups in this class. Remove it from groups first, or keep it only in groups."}, 400);
                  
                  const isFixed = body.is_fixed === true || body.is_fixed === 'true';
                  let insertResult = null;
                  if(isFixed) {
                      insertResult = await env.DB.prepare("INSERT INTO class_subjects (school_id, class_id, subject_id, classes_per_week, is_fixed) VALUES (?, ?, ?, ?, ?) RETURNING id")
                          .bind(body.school_id, body.class_id, body.subject_id, body.classes_per_week, 1).first();
                  } else {
                      insertResult = await env.DB.prepare("INSERT INTO class_subjects (school_id, class_id, subject_id, min_classes, max_classes, is_fixed) VALUES (?, ?, ?, ?, ?, ?) RETURNING id")
                          .bind(body.school_id, body.class_id, body.subject_id, body.min_classes, body.max_classes, 0).first();
                  }
                  
                  
                  await env.DB.prepare(`
                      INSERT INTO teacher_assignments (school_id, class_id, group_id, section_id, subject_id, teacher_id, is_auto, is_primary) 
                      VALUES (?, ?, ?, ?, ?, ?, 1, 0)
                  `).bind(body.school_id, body.class_id, null, null, body.subject_id, null).run();
                  
                  return jsonResponse({success:true, id: insertResult?.id || null});
              }
              if(body.action === 'add_group_subject') {
                  
                  const existingSubject = await env.DB.prepare("SELECT id FROM group_subjects WHERE school_id = ? AND group_id = ? AND subject_id = ?")
                      .bind(body.school_id, body.group_id, body.subject_id).first();
                  if(existingSubject) return jsonResponse({error: "This subject is already added to this group"}, 400);
                  
                  
                  const classInfo = await env.DB.prepare("SELECT class_id FROM class_groups WHERE id = ?").bind(body.group_id).first();
                  if(!classInfo) return jsonResponse({error: "Group not found"}, 400);
                  
                  
                  const existingClassSubject = await env.DB.prepare("SELECT id FROM class_subjects WHERE school_id = ? AND class_id = ? AND subject_id = ?")
                      .bind(body.school_id, classInfo.class_id, body.subject_id).first();
                  if(existingClassSubject) return jsonResponse({error: "This subject is already added to the entire class. Remove it from class first, or keep it only as class subject."}, 400);
                  
                  const isFixed = body.is_fixed === true || body.is_fixed === 'true';
                  let insertResult = null;
                  if(isFixed) {
                      insertResult = await env.DB.prepare("INSERT INTO group_subjects (school_id, group_id, subject_id, classes_per_week, is_fixed) VALUES (?, ?, ?, ?, ?) RETURNING id")
                          .bind(body.school_id, body.group_id, body.subject_id, body.classes_per_week, 1).first();
                  } else {
                      insertResult = await env.DB.prepare("INSERT INTO group_subjects (school_id, group_id, subject_id, min_classes, max_classes, is_fixed) VALUES (?, ?, ?, ?, ?, ?) RETURNING id")
                          .bind(body.school_id, body.group_id, body.subject_id, body.min_classes, body.max_classes, 0).first();
                  }
                  
                  
                  await env.DB.prepare(`
                      INSERT INTO teacher_assignments (school_id, class_id, group_id, section_id, subject_id, teacher_id, is_auto, is_primary) 
                      VALUES (?, ?, ?, ?, ?, ?, 1, 0)
                  `).bind(body.school_id, classInfo.class_id, body.group_id, null, body.subject_id, null).run();
                  
                  return jsonResponse({success:true, id: insertResult?.id || null});
              }
              
              return jsonResponse({error:"Invalid action"},400);
          } catch(e) {
              console.error('Subjects API Error:', e);
              return jsonResponse({error: e.message}, 500);
          }
      }
      
      if(request.method === 'DELETE') {
          const body = await request.json();
          
          try {
              
              if(body.type === 'bank') {
                  
                  
                  const subjectExists = await env.DB.prepare("SELECT id, subject_name FROM academic_subjects WHERE id = ? AND school_id = ?").bind(body.id, school.id).first();
                  
                  if (!subjectExists) {
                      return jsonResponse({error: "Subject not found"}, 404);
                  }
                  
                  
                  const classUsage = await env.DB.prepare("SELECT COUNT(*) as count FROM class_subjects WHERE subject_id = ? AND school_id = ?").bind(body.id, school.id).first();
                  const groupUsage = await env.DB.prepare("SELECT COUNT(*) as count FROM group_subjects WHERE subject_id = ? AND school_id = ?").bind(body.id, school.id).first();
                  
                  
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
                  
                  
                  const deleteResult = await env.DB.prepare("DELETE FROM academic_subjects WHERE id = ? AND school_id = ?").bind(body.id, school.id).run();
                  
                  return jsonResponse({success:true, deleted: subjectExists});
              }
              
              
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
      
      
      
      
      try {
          
          await env.DB.prepare("UPDATE class_subjects SET is_fixed = 1 WHERE is_fixed IS NULL").run();
          
          await env.DB.prepare("UPDATE group_subjects SET is_fixed = 1 WHERE is_fixed IS NULL").run();
      } catch(e) {
      }
      
      const subjects = await env.DB.prepare("SELECT * FROM academic_subjects WHERE school_id = ? ORDER BY subject_name ASC").bind(school.id).all();
      const classes = await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ? ORDER BY class_name ASC").bind(school.id).all();
      const groups = await env.DB.prepare("SELECT * FROM class_groups WHERE school_id = ? ORDER BY class_id, group_name").bind(school.id).all();
      const sections = await env.DB.prepare("SELECT cs.*, cg.group_name FROM class_sections cs LEFT JOIN class_groups cg ON cs.group_id = cg.id WHERE cs.school_id = ?").bind(school.id).all();
      
      
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
      
      
      let scheduleConfig = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
      if (!scheduleConfig) {
        await env.DB.prepare("INSERT INTO schedule_config (school_id, active_days, periods_per_day, working_days, off_days, shifts_json) VALUES (?, ?, ?, ?, ?, ?)")
          .bind(school.id, 5, 8, '["monday","tuesday","wednesday","thursday","friday"]', '["saturday","sunday"]', '["Full Day"]').run();
        scheduleConfig = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
      }
      
      
      const workingDaysArray = parseWorkingDays(scheduleConfig?.working_days);
      const workingDaysCount = workingDaysArray.length; 
      const scheduleSlots = await env.DB.prepare("SELECT * FROM schedule_slots WHERE school_id = ? AND type = 'class'").bind(school.id).all();
      const shiftList = parseShiftList(scheduleConfig?.shifts_json);
      const normalizedSlots = normalizeSlotsForShifts(scheduleSlots.results || [], shiftList);
      const slotIndexesByShift = buildSlotIndexesByShift(normalizedSlots, shiftList);
      const shiftSlotCounts = {};
      shiftList.forEach(shift => { shiftSlotCounts[shift] = (slotIndexesByShift[shift] || []).length; });
      const fallbackPeriods = normalizedSlots.length || 8;
      const fullDaySlots = shiftSlotCounts['Full Day'] || fallbackPeriods;
      const maxClassesPerSection = workingDaysCount * fullDaySlots;
      const classShiftMap = {};
      const classSlotsPerDayMap = {};
      const classCapacityMap = {};
      (classes.results || []).forEach(cls => {
        const rawShift = cls.shift_name || 'Full Day';
        const shiftName = shiftList.includes(rawShift) ? rawShift : 'Full Day';
        classShiftMap[cls.id] = shiftName;
        const slotsPerDay = shiftSlotCounts[shiftName] || fallbackPeriods;
        classSlotsPerDayMap[cls.id] = slotsPerDay;
        classCapacityMap[cls.id] = workingDaysCount * slotsPerDay;
      });
      const shiftCapacityMap = {};
      shiftList.forEach(shift => { shiftCapacityMap[shift] = workingDaysCount * (shiftSlotCounts[shift] || 0); });
      
      scheduleConfig.actualClassPeriodsPerDay = fullDaySlots;
      scheduleConfig.maxClassesPerSection = maxClassesPerSection;
      scheduleConfig.workingDaysCount = workingDaysCount;
      scheduleConfig.workingDaysArray = workingDaysArray;
      scheduleConfig.shiftsEnabled = !!school.shifts_enabled;
      scheduleConfig.shiftList = shiftList;
      scheduleConfig.shiftSlotCounts = shiftSlotCounts;
      scheduleConfig.shiftCapacityMap = shiftCapacityMap;
      scheduleConfig.classCapacityMap = classCapacityMap;
      scheduleConfig.classSlotsPerDayMap = classSlotsPerDayMap;
      scheduleConfig.classShiftMap = classShiftMap;
      
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

  
  if (url.pathname === '/school/teachers') {
      
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
        SELECT ta.*, t.full_name as teacher_name, sub.subject_name, g.group_name, g.class_id
        FROM teacher_assignments ta
        LEFT JOIN profiles_teacher t ON ta.teacher_id = t.id
        JOIN academic_subjects sub ON ta.subject_id = sub.id
        LEFT JOIN class_groups g ON ta.group_id = g.id
        WHERE ta.school_id = ?
      `).bind(school.id).all();
      
      
      
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

  
  if (url.pathname === '/school/teachers-list') {
      if (request.method === 'POST') {
          const body = await request.json();
          
          
          if (body.full_name && body.email && body.phone) {
              const current = await env.DB.prepare("SELECT count(*) as count FROM profiles_teacher WHERE school_id = ?").bind(school.id).first();
              if (current.count >= (school.max_teachers || 10)) return jsonResponse({ error: "Teacher limit reached" }, 403);
              
              await env.DB.prepare("INSERT INTO profiles_teacher (school_id, full_name, email, phone) VALUES (?, ?, ?, ?)")
                  .bind(school.id, body.full_name, body.email, body.phone).run();
              return jsonResponse({ success: true });
          }
          
          
          if (body.action === 'assign_subjects') {
              
              await env.DB.prepare("DELETE FROM teacher_subjects WHERE teacher_id = ?").bind(body.teacher_id).run();
              
              
              if (body.primary_subject) {
                  await env.DB.prepare("INSERT INTO teacher_subjects (school_id, teacher_id, subject_id, is_primary) VALUES (?, ?, ?, 1)")
                      .bind(school.id, body.teacher_id, body.primary_subject).run();
              }
              
              
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
          
          
          if (body.id) {
              await env.DB.prepare("DELETE FROM profiles_teacher WHERE id = ?").bind(body.id).run();
              await env.DB.prepare("DELETE FROM teacher_subjects WHERE teacher_id = ?").bind(body.id).run();
              return jsonResponse({ success: true });
          }
          
          return jsonResponse({ error: "Invalid request" }, 400);
      }
      
      
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
          teachers.results || teachers, 
          allSubjects.results || allSubjects,
          teacherSubjects.results || teacherSubjects
        ), 
        "Teachers Management", 
        school.school_name
      ));
  }
  
  
  if (url.pathname === '/school/teacher-assignments') {
      if (request.method === 'GET') {
          const classId = Number(url.searchParams.get('class_id'));
          const subjectId = Number(url.searchParams.get('subject_id'));
          const groupParam = url.searchParams.get('group_id');
          const sectionParam = url.searchParams.get('section_id');
          const groupId = groupParam === null || groupParam === '' || groupParam === 'null' ? null : Number(groupParam);
          const sectionId = sectionParam === null || sectionParam === '' || sectionParam === 'null' ? null : Number(sectionParam);
          
          if (!Number.isFinite(classId) || !Number.isFinite(subjectId)) {
              return jsonResponse({ error: "Missing or invalid identifiers" }, 400);
          }
          
          if ((groupId !== null && Number.isNaN(groupId)) || (sectionId !== null && Number.isNaN(sectionId))) {
              return jsonResponse({ error: "Invalid identifiers" }, 400);
          }
          
          const assignments = await env.DB.prepare(`
              SELECT ta.*, t.full_name as teacher_name
              FROM teacher_assignments ta
              LEFT JOIN profiles_teacher t ON ta.teacher_id = t.id
              WHERE ta.school_id = ? AND ta.class_id = ? AND
                    (ta.group_id = ? OR (ta.group_id IS NULL AND ? IS NULL)) AND
                    (ta.section_id = ? OR (ta.section_id IS NULL AND ? IS NULL)) AND
                    ta.subject_id = ?
              ORDER BY ta.is_primary DESC, ta.id ASC
          `).bind(
              school.id,
              classId,
              groupId,
              groupId,
              sectionId,
              sectionId,
              subjectId
          ).all();
          
          return jsonResponse({ success: true, data: assignments.results || [] });
      }
      if (request.method === 'POST') {
          const body = await request.json();
          
          if (body.action === 'assign_teacher') {
              if (!body.teacher_id) {
                  return jsonResponse({ error: "Please select a teacher before assigning." }, 400);
              }
              
              const existingTeacherAssignment = await env.DB.prepare(`
                  SELECT id FROM teacher_assignments 
                  WHERE school_id = ? AND class_id = ? AND 
                        (group_id = ? OR (group_id IS NULL AND ? IS NULL)) AND
                        (section_id = ? OR (section_id IS NULL AND ? IS NULL)) AND
                        subject_id = ? AND teacher_id = ?
              `).bind(
                  school.id,
                  body.class_id,
                  body.group_id,
                  body.group_id,
                  body.section_id,
                  body.section_id,
                  body.subject_id,
                  body.teacher_id
              ).first();
              
              if (existingTeacherAssignment) {
                  return jsonResponse({ error: "This teacher is already assigned to this subject" }, 400);
              }
              
              
              const primaryAssignment = await env.DB.prepare(`
                  SELECT id FROM teacher_assignments
                  WHERE school_id = ? AND class_id = ? AND
                        (group_id = ? OR (group_id IS NULL AND ? IS NULL)) AND
                        (section_id = ? OR (section_id IS NULL AND ? IS NULL)) AND
                        subject_id = ? AND is_primary = 1 AND is_auto = 0 AND teacher_id IS NOT NULL
                  LIMIT 1
              `).bind(
                  school.id,
                  body.class_id,
                  body.group_id,
                  body.group_id,
                  body.section_id,
                  body.section_id,
                  body.subject_id
              ).first();
              
              const hasPrimaryAssignment = !!primaryAssignment;
              const isPrimary = hasPrimaryAssignment ? 0 : 1; 
              
              
              const autoAssignment = await env.DB.prepare(`
                  SELECT id FROM teacher_assignments
                  WHERE school_id = ? AND class_id = ? AND
                        (group_id = ? OR (group_id IS NULL AND ? IS NULL)) AND
                        (section_id = ? OR (section_id IS NULL AND ? IS NULL)) AND
                        subject_id = ? AND (is_auto = 1 OR teacher_id IS NULL)
                  ORDER BY id ASC
                  LIMIT 1
              `).bind(
                  school.id,
                  body.class_id,
                  body.group_id,
                  body.group_id,
                  body.section_id,
                  body.section_id,
                  body.subject_id
              ).first();
              
              if (autoAssignment) {
                  await env.DB.prepare(`
                      UPDATE teacher_assignments
                      SET teacher_id = ?, is_auto = 0, is_primary = ?
                      WHERE id = ? AND school_id = ?
                  `).bind(
                      body.teacher_id,
                      isPrimary,
                      autoAssignment.id,
                      school.id
                  ).run();
                  
                  if (!hasPrimaryAssignment) {
                      await env.DB.prepare(`
                          UPDATE teacher_assignments
                          SET is_primary = 0
                          WHERE school_id = ? AND class_id = ? AND
                                (group_id = ? OR (group_id IS NULL AND ? IS NULL)) AND
                                (section_id = ? OR (section_id IS NULL AND ? IS NULL)) AND
                                subject_id = ? AND id != ? AND (is_auto = 1 OR teacher_id IS NULL)
                      `).bind(
                          school.id,
                          body.class_id,
                          body.group_id,
                          body.group_id,
                          body.section_id,
                          body.section_id,
                          body.subject_id,
                          autoAssignment.id
                      ).run();
                  }
                  
                  return jsonResponse({ success: true });
              }
              
              
              await env.DB.prepare(`
                  INSERT INTO teacher_assignments (school_id, class_id, group_id, section_id, subject_id, teacher_id, is_auto, is_primary)
                  VALUES (?, ?, ?, ?, ?, ?, 0, ?)
              `).bind(
                  school.id,
                  body.class_id,
                  body.group_id,
                  body.section_id,
                  body.subject_id,
                  body.teacher_id,
                  isPrimary
              ).run();
              
              return jsonResponse({ success: true });
          }
          
          if (body.action === 'replace_teacher') {
              const currentAssignment = await env.DB.prepare(`
                  SELECT id, class_id, group_id, section_id, subject_id, is_primary FROM teacher_assignments
                  WHERE id = ? AND school_id = ?
              `).bind(
                  body.existing_assignment_id,
                  school.id
              ).first();
              
              if (!currentAssignment) {
                  return jsonResponse({ error: "Assignment not found" }, 404);
              }
              
              if (!body.teacher_id) {
                  await env.DB.prepare(`
                      UPDATE teacher_assignments
                      SET teacher_id = null, is_auto = 1, is_primary = 0
                      WHERE id = ? AND school_id = ?
                  `).bind(
                      body.existing_assignment_id,
                      school.id
                  ).run();
              } else {
                  const primaryExists = await env.DB.prepare(`
                      SELECT id FROM teacher_assignments
                      WHERE school_id = ? AND class_id = ? AND
                            (group_id = ? OR (group_id IS NULL AND ? IS NULL)) AND
                            (section_id = ? OR (section_id IS NULL AND ? IS NULL)) AND
                            subject_id = ? AND is_primary = 1 AND is_auto = 0 AND teacher_id IS NOT NULL AND id != ?
                      LIMIT 1
                  `).bind(
                      school.id,
                      currentAssignment.class_id,
                      currentAssignment.group_id,
                      currentAssignment.group_id,
                      currentAssignment.section_id,
                      currentAssignment.section_id,
                      currentAssignment.subject_id,
                      body.existing_assignment_id
                  ).first();
                  
                  const shouldBePrimary = currentAssignment.is_primary === 1 || !primaryExists;
                  
                  await env.DB.prepare(`
                      UPDATE teacher_assignments
                      SET teacher_id = ?, is_auto = 0, is_primary = ?
                      WHERE id = ? AND school_id = ?
                  `).bind(
                      body.teacher_id,
                      shouldBePrimary ? 1 : 0,
                      body.existing_assignment_id,
                      school.id
                  ).run();
              }
              
              return jsonResponse({ success: true });
          }
          
          if (body.action === 'assign_auto') {
              
              await env.DB.prepare(`
                  INSERT INTO teacher_assignments (school_id, class_id, group_id, section_id, subject_id, teacher_id, is_auto, is_primary) 
                  VALUES (?, ?, ?, ?, ?, ?, 1, 0)
              `).bind(
                  school.id,
                  body.class_id,
                  body.group_id || null,
                  body.section_id || null,
                  body.subject_id,
                  null 
              ).run();
              
              return jsonResponse({ success: true });
          }
          
          if (body.action === 'set_auto') {
              
              await env.DB.prepare(`
                  UPDATE teacher_assignments 
                  SET teacher_id = null, is_auto = 1, is_primary = 0
                  WHERE id = ? AND school_id = ?
              `).bind(
                  body.assignment_id,
                  school.id
              ).run();
              
              return jsonResponse({ success: true });
          }
          
          if (body.action === 'set_manual') {
              
              const currentAssignment = await env.DB.prepare(`
                  SELECT id, class_id, group_id, section_id, subject_id, is_primary
                  FROM teacher_assignments
                  WHERE id = ? AND school_id = ?
              `).bind(
                  body.assignment_id,
                  school.id
              ).first();
              
              if (!currentAssignment) {
                  return jsonResponse({ error: "Assignment not found" }, 404);
              }
              
              const primaryExists = await env.DB.prepare(`
                  SELECT id FROM teacher_assignments
                  WHERE school_id = ? AND class_id = ? AND
                        (group_id = ? OR (group_id IS NULL AND ? IS NULL)) AND
                        (section_id = ? OR (section_id IS NULL AND ? IS NULL)) AND
                        subject_id = ? AND is_primary = 1 AND is_auto = 0 AND teacher_id IS NOT NULL AND id != ?
                  LIMIT 1
              `).bind(
                  school.id,
                  currentAssignment.class_id,
                  currentAssignment.group_id,
                  currentAssignment.group_id,
                  currentAssignment.section_id,
                  currentAssignment.section_id,
                  currentAssignment.subject_id,
                  body.assignment_id
              ).first();
              
              const shouldBePrimary = currentAssignment.is_primary === 1 || !primaryExists;
              
              await env.DB.prepare(`
                  UPDATE teacher_assignments 
                  SET teacher_id = ?, is_auto = 0, is_primary = ?
                  WHERE id = ? AND school_id = ?
              `).bind(
                  body.teacher_id,
                  shouldBePrimary ? 1 : 0,
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
  
  
  if (url.pathname === '/school/classes') {
      
      const classes = await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ? ORDER BY class_name ASC").bind(school.id).all();
      const groups = await env.DB.prepare("SELECT * FROM class_groups WHERE school_id = ? ORDER BY class_id, group_name").bind(school.id).all();
      const sections = await env.DB.prepare("SELECT cs.*, cg.group_name FROM class_sections cs LEFT JOIN class_groups cg ON cs.group_id = cg.id WHERE cs.school_id = ?").bind(school.id).all();
      
      
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
      
      
      let scheduleConfig = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
      if (!scheduleConfig) {
        await env.DB.prepare("INSERT INTO schedule_config (school_id, active_days, periods_per_day, working_days, off_days, shifts_json) VALUES (?, ?, ?, ?, ?, ?)")
          .bind(school.id, 5, 8, '["monday","tuesday","wednesday","thursday","friday"]', '["saturday","sunday"]', '["Full Day"]').run();
        scheduleConfig = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
      }
      
      
      const workingDaysArray = parseWorkingDays(scheduleConfig?.working_days);
      const workingDaysCount = workingDaysArray.length; 
      const scheduleSlots = await env.DB.prepare("SELECT * FROM schedule_slots WHERE school_id = ? AND type = 'class'").bind(school.id).all();
      const shiftList = parseShiftList(scheduleConfig?.shifts_json);
      const normalizedSlots = normalizeSlotsForShifts(scheduleSlots.results || [], shiftList);
      const slotIndexesByShift = buildSlotIndexesByShift(normalizedSlots, shiftList);
      const shiftSlotCounts = {};
      shiftList.forEach(shift => { shiftSlotCounts[shift] = (slotIndexesByShift[shift] || []).length; });
      const fallbackPeriods = normalizedSlots.length || 8;
      const fullDaySlots = shiftSlotCounts['Full Day'] || fallbackPeriods;
      const maxClassesPerSection = workingDaysCount * fullDaySlots;
      const classShiftMap = {};
      const classSlotsPerDayMap = {};
      const classCapacityMap = {};
      (classes.results || []).forEach(cls => {
        const rawShift = cls.shift_name || 'Full Day';
        const shiftName = shiftList.includes(rawShift) ? rawShift : 'Full Day';
        classShiftMap[cls.id] = shiftName;
        const slotsPerDay = shiftSlotCounts[shiftName] || fallbackPeriods;
        classSlotsPerDayMap[cls.id] = slotsPerDay;
        classCapacityMap[cls.id] = workingDaysCount * slotsPerDay;
      });
      const shiftCapacityMap = {};
      shiftList.forEach(shift => { shiftCapacityMap[shift] = workingDaysCount * (shiftSlotCounts[shift] || 0); });
      
      scheduleConfig.actualClassPeriodsPerDay = fullDaySlots;
      scheduleConfig.maxClassesPerSection = maxClassesPerSection;
      scheduleConfig.workingDaysCount = workingDaysCount;
      scheduleConfig.workingDaysArray = workingDaysArray;
      scheduleConfig.shiftsEnabled = !!school.shifts_enabled;
      scheduleConfig.shiftList = shiftList;
      scheduleConfig.shiftSlotCounts = shiftSlotCounts;
      scheduleConfig.shiftCapacityMap = shiftCapacityMap;
      scheduleConfig.classCapacityMap = classCapacityMap;
      scheduleConfig.classSlotsPerDayMap = classSlotsPerDayMap;
      scheduleConfig.classShiftMap = classShiftMap;
      
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

  
  if (url.pathname === '/school/routine-generator') {
    try {
      const existingRoutines = (await env.DB.prepare("SELECT * FROM generated_routines WHERE school_id = ? ORDER BY generated_at DESC").bind(school.id).all()).results;
      const generationSettings = await env.DB.prepare("SELECT * FROM routine_generation_settings WHERE school_id = ?").bind(school.id).first();
      const classes = (await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ?").bind(school.id).all()).results;
      const groups = (await env.DB.prepare("SELECT * FROM class_groups WHERE school_id = ?").bind(school.id).all()).results;
      const sections = (await env.DB.prepare("SELECT * FROM class_sections WHERE school_id = ?").bind(school.id).all()).results;
      const teachers = (await env.DB.prepare("SELECT * FROM profiles_teacher WHERE school_id = ?").bind(school.id).all()).results;
      const subjects = (await env.DB.prepare("SELECT * FROM academic_subjects WHERE school_id = ?").bind(school.id).all()).results;
      const classSubjects = (await env.DB.prepare("SELECT * FROM class_subjects WHERE school_id = ?").bind(school.id).all()).results;
      const groupSubjects = (await env.DB.prepare("SELECT * FROM group_subjects WHERE school_id = ?").bind(school.id).all()).results;
      const teacherAssignments = (await env.DB.prepare("SELECT * FROM teacher_assignments WHERE school_id = ?").bind(school.id).all()).results;
      const teacherSubjects = (await env.DB.prepare("SELECT * FROM teacher_subjects WHERE school_id = ?").bind(school.id).all()).results;
      const scheduleConfig = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
      let workingDays = parseWorkingDays(scheduleConfig?.working_days);
      const slots = (await env.DB.prepare("SELECT * FROM schedule_slots WHERE school_id = ? ORDER BY slot_index ASC").bind(school.id).all()).results;
      const shiftList = parseShiftList(scheduleConfig?.shifts_json);
      const normalizedSlots = normalizeSlotsForShifts(slots, shiftList);
      const classSlots = normalizedSlots.filter(slot => slot.type === 'class');
      let generationWarnings = { items: [] };
      try {
        generationWarnings = buildGenerationWarnings({
          sections,
          classes,
          groups,
          subjects,
          classSubjects,
          groupSubjects,
          teacherAssignments,
          teacherSubjects,
          workingDays,
          classSlots,
          shiftList
        });
      } catch (error) {
        console.error('Generation warnings failed:', error);
      }
      const schoolData = { classes, teachers, subjects, slots: normalizedSlots };
      return htmlResponse(InstituteLayout(
        RoutineGeneratorHTML(existingRoutines, generationSettings, schoolData, generationWarnings), 
        "Routine Generator", 
        school.school_name
      ));
    } catch (error) {
      console.error('Routine generator error:', error);
      try {
        await syncDatabase(env);
        const existingRoutines = (await env.DB.prepare("SELECT * FROM generated_routines WHERE school_id = ? ORDER BY generated_at DESC").bind(school.id).all()).results;
        const generationSettings = await env.DB.prepare("SELECT * FROM routine_generation_settings WHERE school_id = ?").bind(school.id).first();
        const classes = (await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ?").bind(school.id).all()).results;
        const groups = (await env.DB.prepare("SELECT * FROM class_groups WHERE school_id = ?").bind(school.id).all()).results;
        const sections = (await env.DB.prepare("SELECT * FROM class_sections WHERE school_id = ?").bind(school.id).all()).results;
        const teachers = (await env.DB.prepare("SELECT * FROM profiles_teacher WHERE school_id = ?").bind(school.id).all()).results;
        const subjects = (await env.DB.prepare("SELECT * FROM academic_subjects WHERE school_id = ?").bind(school.id).all()).results;
        const classSubjects = (await env.DB.prepare("SELECT * FROM class_subjects WHERE school_id = ?").bind(school.id).all()).results;
        const groupSubjects = (await env.DB.prepare("SELECT * FROM group_subjects WHERE school_id = ?").bind(school.id).all()).results;
        const teacherAssignments = (await env.DB.prepare("SELECT * FROM teacher_assignments WHERE school_id = ?").bind(school.id).all()).results;
        const teacherSubjects = (await env.DB.prepare("SELECT * FROM teacher_subjects WHERE school_id = ?").bind(school.id).all()).results;
        const scheduleConfig = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
        let workingDays = parseWorkingDays(scheduleConfig?.working_days);
        const slots = (await env.DB.prepare("SELECT * FROM schedule_slots WHERE school_id = ? ORDER BY slot_index ASC").bind(school.id).all()).results;
        const shiftList = parseShiftList(scheduleConfig?.shifts_json);
        const normalizedSlots = normalizeSlotsForShifts(slots, shiftList);
        const classSlots = normalizedSlots.filter(slot => slot.type === 'class');
        let generationWarnings = { items: [] };
        try {
          generationWarnings = buildGenerationWarnings({
            sections,
            classes,
            groups,
            subjects,
            classSubjects,
            groupSubjects,
            teacherAssignments,
            teacherSubjects,
            workingDays,
          classSlots,
          shiftList
        });
      } catch (error) {
        console.error('Generation warnings failed:', error);
      }
        const schoolData = { classes, teachers, subjects, slots: normalizedSlots };
        return htmlResponse(InstituteLayout(
          RoutineGeneratorHTML(existingRoutines, generationSettings, schoolData, generationWarnings), 
          "Routine Generator", 
          school.school_name
        ));
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        return htmlResponse("<h1>Database Error</h1><p>Unable to initialize routine generator. Please try again.</p>");
      }
    }
  }

  
  if (url.pathname === '/school/routine-viewer') {
    const routineId = url.searchParams.get('id');
    if (!routineId) {
      return new Response("Routine ID required", {status: 400});
    }
    
    const routine = await env.DB.prepare("SELECT * FROM generated_routines WHERE id = ? AND school_id = ?").bind(routineId, school.id).first();
    if (!routine) {
      return new Response("Routine not found", {status: 404});
    }
    
    const entries = (await env.DB.prepare(`
      SELECT re.*, 
             c.class_name, 
             s.subject_name, 
             t.full_name as teacher_name,
             sl.start_time, 
             sl.end_time,
             sl.label as slot_label,
             sec.section_name,
             g.group_name
      FROM routine_entries re
      LEFT JOIN academic_classes c ON re.class_id = c.id
      LEFT JOIN academic_subjects s ON re.subject_id = s.id  
      LEFT JOIN profiles_teacher t ON re.teacher_id = t.id
      LEFT JOIN schedule_slots sl ON re.slot_index = sl.slot_index AND sl.school_id = re.school_id
      LEFT JOIN class_sections sec ON re.section_id = sec.id
      LEFT JOIN class_groups g ON re.group_id = g.id
      WHERE re.routine_id = ? AND re.school_id = ?
      ORDER BY re.day_of_week, re.slot_index
    `).bind(routineId, school.id).all()).results;
    
    const classes = (await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ?").bind(school.id).all()).results;
    const teachers = (await env.DB.prepare("SELECT * FROM profiles_teacher WHERE school_id = ?").bind(school.id).all()).results;
    const subjects = (await env.DB.prepare("SELECT * FROM academic_subjects WHERE school_id = ?").bind(school.id).all()).results;
    const slots = (await env.DB.prepare("SELECT * FROM schedule_slots WHERE school_id = ? ORDER BY slot_index ASC").bind(school.id).all()).results;
    const groups = (await env.DB.prepare("SELECT * FROM class_groups WHERE school_id = ?").bind(school.id).all()).results;
    const sections = (await env.DB.prepare("SELECT * FROM class_sections WHERE school_id = ?").bind(school.id).all()).results;
    const classSubjects = (await env.DB.prepare("SELECT * FROM class_subjects WHERE school_id = ?").bind(school.id).all()).results;
    const groupSubjects = (await env.DB.prepare("SELECT * FROM group_subjects WHERE school_id = ?").bind(school.id).all()).results;
    const teacherAssignments = (await env.DB.prepare("SELECT * FROM teacher_assignments WHERE school_id = ?").bind(school.id).all()).results;
    const teacherSubjects = (await env.DB.prepare("SELECT * FROM teacher_subjects WHERE school_id = ?").bind(school.id).all()).results;
    const scheduleConfig = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
    let workingDays = parseWorkingDays(scheduleConfig?.working_days);
    const shiftList = parseShiftList(scheduleConfig?.shifts_json);
    const normalizedSlots = normalizeSlotsForShifts(slots, shiftList);
    const classSlots = normalizedSlots.filter(slot => slot.type === 'class');
    
    const conflictSummary = buildConflictSummary({
      entries,
      classes,
      groups,
      sections,
      subjects,
      classSubjects,
      groupSubjects,
      teacherAssignments,
      teacherSubjects,
      workingDays,
      classSlots,
      shiftList
    });
    
    const routineData = { routine, entries, classes, teachers, subjects, slots: normalizedSlots, groups, sections, workingDays, conflictSummary, shiftList };
    
    return htmlResponse(InstituteLayout(
      RoutineViewerHTML(routineData), 
      routine.name, 
      school.school_name
    ));
  }

  
  if (url.pathname === '/school/api/routine-generation-data' && request.method === 'GET') {
    try {
      const classes = (await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ?").bind(school.id).all()).results;
      const groups = (await env.DB.prepare("SELECT * FROM class_groups WHERE school_id = ?").bind(school.id).all()).results;
      const sections = (await env.DB.prepare("SELECT * FROM class_sections WHERE school_id = ?").bind(school.id).all()).results;
      const subjects = (await env.DB.prepare("SELECT * FROM academic_subjects WHERE school_id = ?").bind(school.id).all()).results;
      const classSubjects = (await env.DB.prepare("SELECT * FROM class_subjects WHERE school_id = ?").bind(school.id).all()).results;
      const groupSubjects = (await env.DB.prepare("SELECT * FROM group_subjects WHERE school_id = ?").bind(school.id).all()).results;
      const teacherAssignments = (await env.DB.prepare("SELECT * FROM teacher_assignments WHERE school_id = ?").bind(school.id).all()).results;
      const teacherSubjects = (await env.DB.prepare("SELECT * FROM teacher_subjects WHERE school_id = ?").bind(school.id).all()).results;
      const scheduleConfig = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
      const slots = (await env.DB.prepare("SELECT * FROM schedule_slots WHERE school_id = ? ORDER BY slot_index ASC").bind(school.id).all()).results;

      let workingDays = parseWorkingDays(scheduleConfig?.working_days);
      const shiftList = parseShiftList(scheduleConfig?.shifts_json);
      const normalizedSlots = normalizeSlotsForShifts(slots, shiftList);
      const classSlots = normalizedSlots.filter(slot => slot.type === 'class').sort((a, b) => a.slot_index - b.slot_index);

      return jsonResponse({
        success: true,
        data: {
          classes,
          groups,
          sections,
          subjects,
          classSubjects,
          groupSubjects,
          teacherAssignments,
          teacherSubjects,
          workingDays,
          classSlots,
          shifts: shiftList,
          shiftsEnabled: !!school.shifts_enabled
        }
      });
    } catch (error) {
      console.error('Routine generation data error:', error);
      return jsonResponse({ error: error.message }, 500);
    }
  }

  
  if (url.pathname === '/school/api/generate-routine' && request.method === 'POST') {
    try {
      const body = await request.json();

      const classes = (await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ?").bind(school.id).all()).results;
      const groups = (await env.DB.prepare("SELECT * FROM class_groups WHERE school_id = ?").bind(school.id).all()).results;
      const sections = (await env.DB.prepare("SELECT * FROM class_sections WHERE school_id = ?").bind(school.id).all()).results;
      const subjects = (await env.DB.prepare("SELECT * FROM academic_subjects WHERE school_id = ?").bind(school.id).all()).results;
      const classSubjects = (await env.DB.prepare("SELECT * FROM class_subjects WHERE school_id = ?").bind(school.id).all()).results;
      const groupSubjects = (await env.DB.prepare("SELECT * FROM group_subjects WHERE school_id = ?").bind(school.id).all()).results;
      const teacherAssignments = (await env.DB.prepare("SELECT * FROM teacher_assignments WHERE school_id = ?").bind(school.id).all()).results;
      const teacherSubjects = (await env.DB.prepare("SELECT * FROM teacher_subjects WHERE school_id = ?").bind(school.id).all()).results;
      const scheduleConfig = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
      const slots = (await env.DB.prepare("SELECT * FROM schedule_slots WHERE school_id = ? ORDER BY slot_index ASC").bind(school.id).all()).results;

      let workingDays = parseWorkingDays(scheduleConfig?.working_days);

      const shiftList = parseShiftList(scheduleConfig?.shifts_json);
      const normalizedSlots = normalizeSlotsForShifts(slots, shiftList);
      const classSlots = normalizedSlots.filter(slot => slot.type === 'class').sort((a, b) => a.slot_index - b.slot_index);

      if (!sections.length) return jsonResponse({ error: "No sections configured for routine generation." }, 400);
      if (!classSlots.length) return jsonResponse({ error: "No class periods found in Master Schedule." }, 400);

      const plan = generateRoutinePlan({
        schoolId: school.id,
        sections,
        classes,
        groups,
        subjects,
        classSubjects,
        groupSubjects,
        teacherAssignments,
        teacherSubjects,
        workingDays,
        classSlots,
        shiftList
      });

      const routineName = body.name || `Generated Routine ${new Date().toLocaleDateString()}`;
      const result = await env.DB.prepare(`
        INSERT INTO generated_routines (school_id, name, generated_by, total_periods, conflicts_resolved) 
        VALUES (?, ?, 'auto', ?, ?)
      `).bind(school.id, routineName, plan.totalPeriods, plan.conflicts).run();
      
      const routineId = result.meta.last_row_id;
      
      for (const entry of plan.entries) {
        await env.DB.prepare(`
          INSERT INTO routine_entries (routine_id, school_id, day_of_week, slot_index, class_id, group_id, section_id, subject_id, teacher_id, is_conflict, conflict_reason)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          routineId, school.id, entry.day_of_week, entry.slot_index,
          entry.class_id, entry.group_id, entry.section_id,
          entry.subject_id, entry.teacher_id, entry.is_conflict || 0, entry.conflict_reason || null
        ).run();
      }
      
      return jsonResponse({ 
        success: true, 
        routineId,
        message: `Generated routine with ${plan.totalPeriods} periods for ${sections.length} sections. ${plan.conflicts} conflicts.` 
      });
    } catch (error) {
      console.error('Routine generation error:', error);
      return jsonResponse({ error: error.message }, 500);
    }
  }

  
  if (url.pathname === '/school/api/routine/save-generated' && request.method === 'POST') {
    try {
      const body = await request.json();
      const entries = Array.isArray(body.entries) ? body.entries : [];
      if (!entries.length) return jsonResponse({ error: "No routine entries provided." }, 400);

      const classes = (await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ?").bind(school.id).all()).results;
      const groups = (await env.DB.prepare("SELECT * FROM class_groups WHERE school_id = ?").bind(school.id).all()).results;
      const sections = (await env.DB.prepare("SELECT * FROM class_sections WHERE school_id = ?").bind(school.id).all()).results;
      const subjects = (await env.DB.prepare("SELECT * FROM academic_subjects WHERE school_id = ?").bind(school.id).all()).results;
      const classSubjects = (await env.DB.prepare("SELECT * FROM class_subjects WHERE school_id = ?").bind(school.id).all()).results;
      const groupSubjects = (await env.DB.prepare("SELECT * FROM group_subjects WHERE school_id = ?").bind(school.id).all()).results;
      const teacherAssignments = (await env.DB.prepare("SELECT * FROM teacher_assignments WHERE school_id = ?").bind(school.id).all()).results;
      const teacherSubjects = (await env.DB.prepare("SELECT * FROM teacher_subjects WHERE school_id = ?").bind(school.id).all()).results;
      const scheduleConfig = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
      const slots = (await env.DB.prepare("SELECT * FROM schedule_slots WHERE school_id = ? ORDER BY slot_index ASC").bind(school.id).all()).results;

      let workingDays = parseWorkingDays(scheduleConfig?.working_days);

      const shiftList = parseShiftList(scheduleConfig?.shifts_json);
      const normalizedSlots = normalizeSlotsForShifts(slots, shiftList);
      const classSlots = normalizedSlots.filter(slot => slot.type === 'class').sort((a, b) => a.slot_index - b.slot_index);

      const validation = validateGeneratedRoutine({
        entries,
        classes,
        groups,
        sections,
        subjects,
        classSubjects,
        groupSubjects,
        teacherAssignments,
        teacherSubjects,
        workingDays,
        classSlots,
        shiftList
      });

      if (!validation.valid) {
        return jsonResponse({ error: validation.errors[0] || "Routine validation failed.", errors: validation.errors }, 400);
      }

      const routineName = body.name || `Generated Routine ${new Date().toLocaleDateString()}`;
      const result = await env.DB.prepare(`
        INSERT INTO generated_routines (school_id, name, generated_by, total_periods, conflicts_resolved)
        VALUES (?, ?, 'client', ?, ?)
      `).bind(school.id, routineName, entries.length, 0).run();

      const routineId = result.meta.last_row_id;

      for (const entry of entries) {
        await env.DB.prepare(`
          INSERT INTO routine_entries (routine_id, school_id, day_of_week, slot_index, class_id, group_id, section_id, subject_id, teacher_id, is_conflict, conflict_reason)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          routineId,
          school.id,
          entry.day_of_week,
          entry.slot_index,
          entry.class_id,
          entry.group_id ?? null,
          entry.section_id ?? null,
          entry.subject_id,
          entry.teacher_id ?? null,
          0,
          null
        ).run();
      }

      return jsonResponse({
        success: true,
        routineId,
        message: `Routine saved with ${entries.length} periods.`
      });
    } catch (error) {
      console.error('Routine save error:', error);
      return jsonResponse({ error: error.message }, 500);
    }
  }

  
  if (url.pathname.startsWith('/school/api/routine/') && request.method === 'DELETE') {
    const routineId = url.pathname.split('/').pop();
    
    try {
      await env.DB.prepare("DELETE FROM routine_entries WHERE routine_id = ? AND school_id = ?").bind(routineId, school.id).run();
      await env.DB.prepare("DELETE FROM generated_routines WHERE id = ? AND school_id = ?").bind(routineId, school.id).run();
      return jsonResponse({ success: true });
    } catch (error) {
      return jsonResponse({ error: error.message }, 500);
    }
  }

  if (url.pathname.startsWith('/school/api/routine/') && request.method === 'POST') {
    const parts = url.pathname.split('/');
    const routineId = parts[parts.length - 2];
    const action = parts[parts.length - 1];
    
    if (action === 'activate') {
      try {
        await env.DB.prepare("UPDATE generated_routines SET is_active = 0 WHERE school_id = ?").bind(school.id).run();
        await env.DB.prepare("UPDATE generated_routines SET is_active = 1 WHERE id = ? AND school_id = ?").bind(routineId, school.id).run();
        return jsonResponse({ success: true });
      } catch (error) {
        return jsonResponse({ error: error.message }, 500);
      }
    }
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function parseShiftList(raw) {
    if (!raw) return ['Full Day'];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) {
        const cleaned = parsed
          .map(item => String(item).trim())
          .filter(Boolean)
          .filter(name => name.toLowerCase() !== 'standard');
        if (!cleaned.includes('Full Day')) cleaned.unshift('Full Day');
        return Array.from(new Set(cleaned));
      }
    } catch (e) {}
    return ['Full Day'];
  }

  function parseWorkingDays(raw) {
    const defaultDays = ["monday","tuesday","wednesday","thursday","friday"];
    if (!raw) return defaultDays.slice();
    let parsed = raw;
    if (typeof parsed === 'string') {
      try { parsed = JSON.parse(parsed); } catch (e) { parsed = null; }
    }
    if (typeof parsed === 'string') {
      try { parsed = JSON.parse(parsed); } catch (e) { parsed = null; }
    }
    if (!Array.isArray(parsed)) return defaultDays.slice();
    const validDays = new Set(["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]);
    const cleaned = parsed
      .map(day => String(day || '').toLowerCase().trim())
      .filter(day => validDays.has(day));
    const unique = Array.from(new Set(cleaned));
    return unique.length ? unique : defaultDays.slice();
  }

  function parseApplicableShifts(raw, shiftList) {
    if (!raw) return shiftList.slice();
    let parsed = [];
    if (Array.isArray(raw)) {
      parsed = raw;
    } else if (typeof raw === 'string') {
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        parsed = raw ? [raw] : [];
      }
    }
    if (!Array.isArray(parsed)) parsed = [];
    if (!parsed.length || parsed.includes('all')) return shiftList.slice();
    const filtered = parsed.filter(name => shiftList.includes(name));
    const result = filtered.length ? filtered : shiftList.slice();
    const ordered = shiftList.filter(name => result.includes(name));
    if (ordered.length) {
      ordered.push(...result.filter(name => !ordered.includes(name)));
    }
    const finalList = ordered.length ? ordered : result.slice();
    if (shiftList.includes('Full Day') && !finalList.includes('Full Day')) {
      finalList.unshift('Full Day');
    }
    return finalList;
  }

  function normalizeSlotsForShifts(slots, shiftList) {
    return (slots || []).map(slot => ({
      ...slot,
      applicable_shifts: parseApplicableShifts(slot.applicable_shifts, shiftList)
    }));
  }

  function buildSlotIndexesByShift(classSlots, shiftList) {
    const byShift = {};
    shiftList.forEach(shift => { byShift[shift] = []; });
    (classSlots || []).forEach(slot => {
      const applicable = parseApplicableShifts(slot.applicable_shifts, shiftList);
      shiftList.forEach(shift => {
        if (applicable.includes(shift)) byShift[shift].push(slot.slot_index);
      });
    });
    Object.keys(byShift).forEach(shift => {
      byShift[shift] = Array.from(new Set(byShift[shift])).sort((a, b) => a - b);
    });
    return byShift;
  }

  function buildSectionListWithSlots({ sections, classes, classSlots, shiftList }) {
    const slotIndexesByShift = buildSlotIndexesByShift(classSlots, shiftList);
    const allSlotIndexes = (classSlots || []).map(slot => slot.slot_index).sort((a, b) => a - b);
    const classShiftMap = new Map((classes || []).map(cls => [cls.id, cls.shift_name || 'Full Day']));

    const resolveSlots = (classId) => {
      const rawShift = classShiftMap.get(classId) || 'Full Day';
      const shiftName = shiftList.includes(rawShift) ? rawShift : 'Full Day';
      let slotIndexes = slotIndexesByShift[shiftName] || [];
      if (!slotIndexes.length && !shiftList.includes(rawShift)) {
        slotIndexes = allSlotIndexes.slice();
      }
      return slotIndexes;
    };

    const baseSections = sections.length ? sections : (classes || []).map(cls => ({
      id: 0,
      class_id: cls.id,
      group_id: null,
      section_name: 'Main'
    }));

    const sectionList = baseSections.map(sec => ({
      ...sec,
      slotIndexes: resolveSlots(sec.class_id)
    }));

    return { sectionList, slotIndexesByShift, allSlotIndexes };
  }

  function pickAssignmentsForSection(assignments, section, subjectId) {
    const relevant = assignments.filter(a => a.subject_id === subjectId && a.class_id === section.class_id);
    const sectionLevel = relevant.filter(a => a.section_id === section.id);
    if (sectionLevel.length) return sectionLevel;
    if (section.group_id) {
      const groupLevel = relevant.filter(a => a.group_id === section.group_id && !a.section_id);
      if (groupLevel.length) return groupLevel;
    }
    const classLevel = relevant.filter(a => !a.group_id && !a.section_id);
    return classLevel;
  }

  function buildSectionTargets({
    section,
    classSubjects,
    groupSubjects,
    workingDays,
    slotsPerDay
  }) {
    const subjectMap = {};
    const addSubject = (subjectId, minCount, maxCount) => {
      if (!subjectMap[subjectId]) {
        subjectMap[subjectId] = { min: 0, max: 0, fixed: true };
      }
      subjectMap[subjectId].min += Math.max(0, minCount || 0);
      subjectMap[subjectId].max += Math.max(0, maxCount || 0);
    };

    classSubjects
      .filter(cs => cs.class_id === section.class_id)
      .forEach(cs => {
        if (cs.is_fixed) {
          addSubject(cs.subject_id, cs.classes_per_week, cs.classes_per_week);
        } else {
          addSubject(cs.subject_id, cs.min_classes, cs.max_classes);
        }
      });

    if (section.group_id) {
      groupSubjects
        .filter(gs => gs.group_id === section.group_id)
        .forEach(gs => {
          if (gs.is_fixed) {
            addSubject(gs.subject_id, gs.classes_per_week, gs.classes_per_week);
          } else {
            addSubject(gs.subject_id, gs.min_classes, gs.max_classes);
          }
        });
    }

    const totalSlots = workingDays.length * (slotsPerDay || 0);
    const subjectIds = Object.keys(subjectMap);
    const targets = {};
    let minSum = 0;

    subjectIds.forEach(subjectId => {
      const subject = subjectMap[subjectId];
      const rawMin = subject.min;
      const rawMax = Math.max(subject.max, rawMin);

      subjectMap[subjectId].max = rawMax;
      subjectMap[subjectId].min = rawMin;
      subjectMap[subjectId].fixed = rawMin === rawMax;

      targets[subjectId] = rawMin;
      minSum += rawMin;
    });

    return { targets, totalSlots };
  }

  function buildTeacherPools({ section, subjectIds, teacherAssignments, teacherSubjects }) {
    const pools = {};
    subjectIds.forEach(subjectId => {
      const assignments = pickAssignmentsForSection(teacherAssignments || [], section, subjectId);
      const manualTeachers = assignments.filter(a => a.is_auto === 0 && a.teacher_id).map(a => a.teacher_id);
      let pool = [];
      if (manualTeachers.length) {
        pool = [...new Set(manualTeachers)];
      } else {
        pool = (teacherSubjects || []).filter(ts => ts.subject_id === subjectId).map(ts => ts.teacher_id);
      }
      pools[subjectId] = [...new Set(pool)];
    });
    return pools;
  }

  function generateRoutinePlanGreedy({
    sectionList,
    classSubjects,
    groupSubjects,
    teacherAssignments,
    teacherSubjects,
    workingDays,
    classSlots
  }) {
    const entries = [];
    const maxTeacherDaily = classSlots.length;
    const teacherSchedule = {};
    const teacherDailyCount = {};
    const teacherWeeklyCount = {};
    const teacherSubjectCount = {};

    const sectionPlans = sectionList.map(section => {
      const slotIndexes = (section.slotIndexes && section.slotIndexes.length)
        ? section.slotIndexes
        : classSlots.map(slot => slot.slot_index);
      const slotsPerDay = slotIndexes.length;
      const { targets } = buildSectionTargets({
        section,
        classSubjects,
        groupSubjects,
        workingDays,
        slotsPerDay
      });
      const subjectIds = Object.keys(targets).map(id => Number(id));
      const teacherPools = buildTeacherPools({
        section,
        subjectIds,
        teacherAssignments,
        teacherSubjects
      });
      const remaining = {};
      let remainingTotal = 0;
      subjectIds.forEach(subjectId => {
        remaining[subjectId] = targets[subjectId] || 0;
        remainingTotal += remaining[subjectId];
      });
      const usedSubjectsByDay = {};
      workingDays.forEach(day => {
        usedSubjectsByDay[day] = new Set();
      });
      return {
        section,
        remaining,
        remainingTotal,
        subjectIds,
        teacherPools,
        usedSubjectsByDay,
        slotIndexSet: new Set(slotIndexes)
      };
    });

    sectionPlans.sort((a, b) => b.remainingTotal - a.remainingTotal);

    const pickTeacherCandidateFast = (pool, day, slotIndex, subjectId) => {
      let best = null;
      for (const teacherId of pool) {
        if (teacherSchedule[teacherId]?.[day]?.[slotIndex]) continue;
        if ((teacherDailyCount[teacherId]?.[day] || 0) >= maxTeacherDaily) continue;
        const weekly = teacherWeeklyCount[teacherId] || 0;
        const daily = teacherDailyCount[teacherId]?.[day] || 0;
        const subjectCount = teacherSubjectCount[teacherId]?.[subjectId] || 0;
        const score = weekly * 10 + daily * 5 + subjectCount;
        if (!best || score < best.score) {
          best = { teacherId, score };
        }
      }
      return best ? best.teacherId : null;
    };

    const chooseAssignmentForSlotFast = (plan, day, slotIndex) => {
      const options = [];
      plan.subjectIds.forEach(subjectId => {
        const remaining = plan.remaining[subjectId] || 0;
        if (remaining <= 0) return;
        if (plan.usedSubjectsByDay[day].has(subjectId)) return;
        const pool = plan.teacherPools[subjectId] || [];
        if (!pool.length) {
          options.push({ subjectId, teacherId: null, score: remaining * 10 });
          return;
        }
        const teacherId = pickTeacherCandidateFast(pool, day, slotIndex, subjectId);
        if (!teacherId) return;
        const score = remaining * 100 - pool.length * 10;
        options.push({ subjectId, teacherId, score });
      });

      if (!options.length) return null;
      options.sort((a, b) => {
        const aUnassigned = !a.teacherId;
        const bUnassigned = !b.teacherId;
        if (aUnassigned !== bUnassigned) return aUnassigned ? 1 : -1;
        return b.score - a.score;
      });
      return options[0];
    };

    workingDays.forEach(day => {
      classSlots.forEach(slot => {
        const sectionsByNeed = sectionPlans.slice().sort((a, b) => b.remainingTotal - a.remainingTotal);
        sectionsByNeed.forEach(plan => {
          if (plan.remainingTotal <= 0) return;
          if (!plan.slotIndexSet.has(slot.slot_index)) return;
          const assignment = chooseAssignmentForSlotFast(plan, day, slot.slot_index);
          if (!assignment) return;

          entries.push({
            day_of_week: day,
            slot_index: slot.slot_index,
            class_id: plan.section.class_id,
            group_id: plan.section.group_id,
            section_id: plan.section.id,
            subject_id: assignment.subjectId,
            teacher_id: assignment.teacherId,
            is_conflict: 0,
            conflict_reason: null
          });

          plan.remaining[assignment.subjectId] -= 1;
          plan.remainingTotal -= 1;
          plan.usedSubjectsByDay[day].add(assignment.subjectId);

          if (assignment.teacherId) {
            if (!teacherSchedule[assignment.teacherId]) teacherSchedule[assignment.teacherId] = {};
            if (!teacherSchedule[assignment.teacherId][day]) teacherSchedule[assignment.teacherId][day] = {};
            teacherSchedule[assignment.teacherId][day][slot.slot_index] = true;

            if (!teacherDailyCount[assignment.teacherId]) teacherDailyCount[assignment.teacherId] = {};
            teacherDailyCount[assignment.teacherId][day] = (teacherDailyCount[assignment.teacherId][day] || 0) + 1;
            teacherWeeklyCount[assignment.teacherId] = (teacherWeeklyCount[assignment.teacherId] || 0) + 1;

            if (!teacherSubjectCount[assignment.teacherId]) teacherSubjectCount[assignment.teacherId] = {};
            teacherSubjectCount[assignment.teacherId][assignment.subjectId] = (teacherSubjectCount[assignment.teacherId][assignment.subjectId] || 0) + 1;
          }
        });
      });
    });

    return { success: true, entries };
  }

  function generateRoutinePlan({
    schoolId,
    sections,
    classes,
    groups,
    subjects,
    classSubjects,
    groupSubjects,
    teacherAssignments,
    teacherSubjects,
    workingDays,
    classSlots,
    shiftList
  }) {
    const { sectionList } = buildSectionListWithSlots({ sections, classes, classSlots, shiftList: shiftList || ['Full Day'] });

    const plan = generateRoutinePlanGreedy({
      sectionList,
      classSubjects,
      groupSubjects,
      teacherAssignments,
      teacherSubjects,
      workingDays,
      classSlots
    });

    const totalRequired = sectionList.reduce((sum, section) => {
      const slotsPerDay = section.slotIndexes ? section.slotIndexes.length : classSlots.length;
      const targets = buildSectionTargets({ section, classSubjects, groupSubjects, workingDays, slotsPerDay }).targets;
      const subjectIds = Object.keys(targets);
      const sectionTotal = subjectIds.reduce((acc, id) => acc + (targets[id] || 0), 0);
      return sum + sectionTotal;
    }, 0);

    const conflicts = Math.max(0, totalRequired - plan.entries.length);
    return { entries: plan.entries, totalPeriods: plan.entries.length, conflicts };
  }

  function validateGeneratedRoutine({
    entries,
    classes,
    groups,
    sections,
    subjects,
    classSubjects,
    groupSubjects,
    teacherAssignments,
    teacherSubjects,
    workingDays,
    classSlots,
    shiftList
  }) {
    const errors = [];
    const { sectionList } = buildSectionListWithSlots({ sections, classes, classSlots, shiftList: shiftList || ['Full Day'] });
    if (!sectionList.length) {
      return { valid: false, errors: ["No sections configured. Add sections before generating routines."] };
    }

    const workingDaySet = new Set(workingDays);
    const slotIndexMap = new Map();
    sectionList.forEach(sec => {
      const key = `${sec.class_id}-${sec.group_id || 0}-${sec.id || 0}`;
      const slotIndexes = (sec.slotIndexes && sec.slotIndexes.length)
        ? sec.slotIndexes
        : classSlots.map(slot => slot.slot_index);
      slotIndexMap.set(key, new Set(slotIndexes));
    });

    const sectionMap = new Map();
    sectionList.forEach(sec => {
      const key = `${sec.class_id}-${sec.group_id || 0}-${sec.id || 0}`;
      sectionMap.set(key, sec);
    });

    const subjectNameMap = new Map((subjects || []).map(subject => [subject.id, subject.subject_name || `Subject ${subject.id}`]));
    const classNameMap = new Map((classes || []).map(cls => [cls.id, cls.class_name || `Class ${cls.id}`]));
    const groupNameMap = new Map((groups || []).map(group => [group.id, group.group_name || `Group ${group.id}`]));
    const sectionNameMap = new Map((sections || []).map(sec => [sec.id, sec.section_name || 'Main']));

    const getSubjectLabel = (subjectId) => subjectNameMap.get(subjectId) || `Subject ${subjectId}`;
    const getSectionLabel = (classId, groupId, sectionId) => {
      const className = classNameMap.get(classId) || `Class ${classId}`;
      const groupName = groupId ? (groupNameMap.get(groupId) || `Group ${groupId}`) : '';
      const sectionName = sectionId ? (sectionNameMap.get(sectionId) || `Section ${sectionId}`) : 'Main';
      let label = className;
      if (groupName) label += ` - ${groupName}`;
      if (sectionName) label += ` - ${sectionName}`;
      return label;
    };

    const subjectRequirements = {};
    sectionList.forEach(section => {
      const sectionKey = `${section.class_id}-${section.group_id || 0}-${section.id || 0}`;
      subjectRequirements[sectionKey] = {};

      classSubjects
        .filter(cs => cs.class_id === section.class_id)
        .forEach(cs => {
          const min = cs.is_fixed ? (cs.classes_per_week || 0) : (cs.min_classes || 0);
          const max = cs.is_fixed ? (cs.classes_per_week || 0) : (cs.max_classes || 0);
          subjectRequirements[sectionKey][cs.subject_id] = {
            min,
            max: Math.max(max, min)
          };
        });

      if (section.group_id) {
        groupSubjects
          .filter(gs => gs.group_id === section.group_id)
          .forEach(gs => {
            const min = gs.is_fixed ? (gs.classes_per_week || 0) : (gs.min_classes || 0);
            const max = gs.is_fixed ? (gs.classes_per_week || 0) : (gs.max_classes || 0);
            const existing = subjectRequirements[sectionKey][gs.subject_id] || { min: 0, max: 0 };
            subjectRequirements[sectionKey][gs.subject_id] = {
              min: existing.min + min,
              max: Math.max(existing.max + max, existing.min + min)
            };
          });
      }
    });

    const sectionSlotMap = new Map();
    const sectionDaySubject = new Map();
    const sectionSubjectCount = {};
    const teacherSlotMap = new Map();
    const teacherDailyCount = {};

    for (const entry of entries) {
      const sectionKey = `${entry.class_id}-${entry.group_id || 0}-${entry.section_id || 0}`;
      const section = sectionMap.get(sectionKey);
      if (!section) {
        errors.push(`Invalid section mapping for class ${entry.class_id}.`);
        continue;
      }

      if (!workingDaySet.has(entry.day_of_week)) {
        errors.push(`Invalid day ${entry.day_of_week} for section ${sectionKey}.`);
        continue;
      }

      const allowedSlots = slotIndexMap.get(sectionKey);
      if (!allowedSlots || !allowedSlots.has(entry.slot_index)) {
        errors.push(`Invalid slot ${entry.slot_index} for section ${sectionKey}.`);
        continue;
      }

      if (!entry.subject_id) {
        errors.push(`Missing subject for ${getSectionLabel(entry.class_id, entry.group_id, entry.section_id)} on ${entry.day_of_week}.`);
        continue;
      }

      const subjectReqs = subjectRequirements[sectionKey] || {};
      if (!subjectReqs[entry.subject_id]) {
        errors.push(`${getSubjectLabel(entry.subject_id)} not allowed for ${getSectionLabel(entry.class_id, entry.group_id, entry.section_id)}.`);
        continue;
      }

      const assignments = pickAssignmentsForSection(teacherAssignments || [], section, entry.subject_id);
      const manualTeachers = assignments.filter(a => a.is_auto === 0 && a.teacher_id).map(a => a.teacher_id);
      let qualifiedTeachers = [];
      if (manualTeachers.length) {
        qualifiedTeachers = manualTeachers;
      } else {
        qualifiedTeachers = (teacherSubjects || []).filter(ts => ts.subject_id === entry.subject_id).map(ts => ts.teacher_id);
      }

      if (!entry.teacher_id) {
        if (qualifiedTeachers.length) {
          errors.push(`Missing teacher for ${getSectionLabel(entry.class_id, entry.group_id, entry.section_id)} on ${entry.day_of_week}.`);
          continue;
        }
      } else if (!qualifiedTeachers.includes(entry.teacher_id)) {
        if (manualTeachers.length) {
          errors.push(`Teacher ${entry.teacher_id} not allowed for ${getSubjectLabel(entry.subject_id)} in ${getSectionLabel(entry.class_id, entry.group_id, entry.section_id)}.`);
        } else {
          errors.push(`Teacher ${entry.teacher_id} not qualified for ${getSubjectLabel(entry.subject_id)}.`);
        }
        continue;
      }

      const sectionSlotKey = `${sectionKey}-${entry.day_of_week}-${entry.slot_index}`;
      if (sectionSlotMap.has(sectionSlotKey)) {
        errors.push(`Duplicate entry for ${getSectionLabel(entry.class_id, entry.group_id, entry.section_id)} on ${entry.day_of_week} slot ${entry.slot_index}.`);
        continue;
      }
      sectionSlotMap.set(sectionSlotKey, true);

      const sectionDayKey = `${sectionKey}-${entry.day_of_week}`;
      if (!sectionDaySubject.has(sectionDayKey)) sectionDaySubject.set(sectionDayKey, new Set());
      if (sectionDaySubject.get(sectionDayKey).has(entry.subject_id)) {
        errors.push(`${getSubjectLabel(entry.subject_id)} repeated on same day for ${getSectionLabel(entry.class_id, entry.group_id, entry.section_id)} (${entry.day_of_week}).`);
        continue;
      }
      sectionDaySubject.get(sectionDayKey).add(entry.subject_id);

      if (entry.teacher_id) {
        const teacherSlotKey = `${entry.teacher_id}-${entry.day_of_week}-${entry.slot_index}`;
        if (teacherSlotMap.has(teacherSlotKey)) {
          errors.push(`Teacher ${entry.teacher_id} double-booked on ${entry.day_of_week} slot ${entry.slot_index}.`);
          continue;
        }
        teacherSlotMap.set(teacherSlotKey, true);

        if (!teacherDailyCount[entry.teacher_id]) teacherDailyCount[entry.teacher_id] = {};
        teacherDailyCount[entry.teacher_id][entry.day_of_week] = (teacherDailyCount[entry.teacher_id][entry.day_of_week] || 0) + 1;
        if (teacherDailyCount[entry.teacher_id][entry.day_of_week] > classSlots.length) {
          errors.push(`Teacher ${entry.teacher_id} exceeds daily maximum on ${entry.day_of_week}.`);
          continue;
        }
      }

      if (!sectionSubjectCount[sectionKey]) sectionSubjectCount[sectionKey] = {};
      sectionSubjectCount[sectionKey][entry.subject_id] = (sectionSubjectCount[sectionKey][entry.subject_id] || 0) + 1;
    }

    sectionList.forEach(section => {
      const sectionKey = `${section.class_id}-${section.group_id || 0}-${section.id || 0}`;

      const subjectReqs = subjectRequirements[sectionKey] || {};
      Object.entries(subjectReqs).forEach(([subjectId, req]) => {
        const actual = sectionSubjectCount[sectionKey]?.[subjectId] || 0;
        if (actual < req.min) {
          errors.push(`${getSectionLabel(section.class_id, section.group_id, section.id)} requires at least ${req.min} of ${getSubjectLabel(Number(subjectId))}, found ${actual}.`);
        }
        if (actual > req.max) {
          errors.push(`${getSectionLabel(section.class_id, section.group_id, section.id)} exceeds max ${req.max} for ${getSubjectLabel(Number(subjectId))}, found ${actual}.`);
        }
      });
    });

    return { valid: errors.length === 0, errors };
  }

  function buildConflictSummary({ entries, classes, groups, sections, subjects, classSubjects, groupSubjects, teacherAssignments, teacherSubjects, workingDays, classSlots, shiftList }) {
    const entryConflicts = entries.filter(entry => entry.is_conflict || entry.conflict_reason).map(entry => ({
      day_of_week: entry.day_of_week,
      slot_index: entry.slot_index,
      class_id: entry.class_id,
      group_id: entry.group_id,
      section_id: entry.section_id,
      subject_id: entry.subject_id,
      teacher_id: entry.teacher_id,
      reason: entry.conflict_reason || 'Conflict'
    }));

    const teacherSchedule = {};
    entries.forEach(entry => {
      if (!entry.teacher_id) return;
      if (!teacherSchedule[entry.teacher_id]) teacherSchedule[entry.teacher_id] = {};
      if (!teacherSchedule[entry.teacher_id][entry.day_of_week]) teacherSchedule[entry.teacher_id][entry.day_of_week] = {};
      teacherSchedule[entry.teacher_id][entry.day_of_week][entry.slot_index] = true;
    });

    const { sectionList } = buildSectionListWithSlots({ sections, classes, classSlots, shiftList: shiftList || ['Full Day'] });
    const classSectionMap = new Map();
    sectionList.forEach(sec => {
      classSectionMap.set(`${sec.class_id}-${sec.group_id || 0}-${sec.id || 0}`, sec);
    });

    const requiredBySection = {};
    const ensureSection = (sectionKey) => {
      if (!requiredBySection[sectionKey]) requiredBySection[sectionKey] = {};
      return requiredBySection[sectionKey];
    };

    sectionList.forEach(sec => {
      const sectionKey = `${sec.class_id}-${sec.group_id || 0}-${sec.id || 0}`;
      const sectionSubjects = classSubjects.filter(cs => cs.class_id === sec.class_id);
      sectionSubjects.forEach(cs => {
        const subjectId = cs.subject_id;
        const required = cs.is_fixed ? (cs.classes_per_week || 0) : (cs.min_classes || 0);
        if (!required) return;
        const sectionReq = ensureSection(sectionKey);
        sectionReq[subjectId] = (sectionReq[subjectId] || 0) + required;
      });
      if (sec.group_id) {
        const groupReqs = groupSubjects.filter(gs => gs.group_id === sec.group_id);
        groupReqs.forEach(gs => {
          const subjectId = gs.subject_id;
          const required = gs.is_fixed ? (gs.classes_per_week || 0) : (gs.min_classes || 0);
          if (!required) return;
          const sectionReq = ensureSection(sectionKey);
          sectionReq[subjectId] = (sectionReq[subjectId] || 0) + required;
        });
      }
    });

    const actualBySection = {};
    const usedSubjectsByDay = {};
    entries.forEach(entry => {
      const sectionKey = `${entry.class_id}-${entry.group_id || 0}-${entry.section_id || 0}`;
      if (!actualBySection[sectionKey]) actualBySection[sectionKey] = {};
      actualBySection[sectionKey][entry.subject_id] = (actualBySection[sectionKey][entry.subject_id] || 0) + 1;
      if (!usedSubjectsByDay[sectionKey]) usedSubjectsByDay[sectionKey] = {};
      if (!usedSubjectsByDay[sectionKey][entry.day_of_week]) usedSubjectsByDay[sectionKey][entry.day_of_week] = new Set();
      usedSubjectsByDay[sectionKey][entry.day_of_week].add(entry.subject_id);
    });

    const missingRequirements = [];
    Object.entries(requiredBySection).forEach(([sectionKey, subjectMap]) => {
      const [classId, groupId, sectionId] = sectionKey.split('-').map(Number);
      const classInfo = classes.find(c => c.id === classId);
      const groupInfo = groups.find(g => g.id === groupId);
      const mappedSection = classSectionMap.get(sectionKey);
      const sectionInfo = sections.find(s => s.id === sectionId) || mappedSection;
      const className = classInfo?.class_name || 'Class';
      const groupName = groupInfo?.group_name || '';
      const sectionName = sectionInfo?.section_name || 'Main';

      Object.entries(subjectMap).forEach(([subjectId, required]) => {
        const actual = actualBySection[sectionKey]?.[subjectId] || 0;
        if (actual < required) {
          const subjectInfo = subjects.find(s => s.id === Number(subjectId));
          missingRequirements.push({
            class_id: classId,
            group_id: groupId || null,
            section_id: sectionId || null,
            class_name: className,
            group_name: groupName,
            section_name: sectionName,
            subject_id: Number(subjectId),
            subject_name: subjectInfo?.subject_name || 'Subject',
            required,
            scheduled: actual,
            missing: required - actual
          });
        }
      });
    });

    const gapReasons = [];
    const sectionKeys = Object.keys(requiredBySection);
    sectionKeys.forEach(sectionKey => {
      const [classId, groupId, sectionId] = sectionKey.split('-').map(Number);
      const classInfo = classes.find(c => c.id === classId);
      const groupInfo = groups.find(g => g.id === groupId);
      const mappedSection = classSectionMap.get(sectionKey);
      const sectionInfo = sections.find(s => s.id === sectionId) || mappedSection;
      const className = classInfo?.class_name || 'Class';
      const groupName = groupInfo?.group_name || '';
      const sectionName = sectionInfo?.section_name || 'Main';

      const remainingBySubject = {};
      Object.entries(requiredBySection[sectionKey]).forEach(([subjectId, required]) => {
        const actual = actualBySection[sectionKey]?.[subjectId] || 0;
        remainingBySubject[subjectId] = Math.max(0, required - actual);
      });

      const slotIndexes = (mappedSection && mappedSection.slotIndexes && mappedSection.slotIndexes.length)
        ? mappedSection.slotIndexes
        : classSlots.map(slot => slot.slot_index);

      workingDays.forEach(day => {
        slotIndexes.forEach(slotIndex => {
          const existingEntry = entries.find(entry =>
            entry.class_id === classId &&
            (entry.group_id || 0) === (groupId || 0) &&
            (entry.section_id || 0) === (sectionId || 0) &&
            entry.day_of_week === day &&
            entry.slot_index === slotIndex
          );
          if (existingEntry) return;

          const usedToday = usedSubjectsByDay[sectionKey]?.[day] || new Set();
          const candidates = Object.entries(remainingBySubject)
            .filter(([subjectId, remaining]) => remaining > 0 && !usedToday.has(Number(subjectId)))
            .map(([subjectId]) => Number(subjectId));

          if (!candidates.length) {
            gapReasons.push({
              day_of_week: day,
              slot_index: slotIndex,
              class_id: classId,
              group_id: groupId || null,
              section_id: sectionId || null,
              class_name: className,
              group_name: groupName,
              section_name: sectionName,
              reason: 'No remaining subject without breaking one-per-day rule'
            });
            return;
          }

          let hasAvailableTeacher = false;
          for (const subjectId of candidates) {
            const assignments = pickAssignmentsForSection(teacherAssignments || [], { class_id: classId, group_id: groupId || null, id: sectionId || null }, subjectId);
            const manualTeachers = assignments.filter(a => a.is_auto === 0 && a.teacher_id).map(a => a.teacher_id);
            let pool = [];
            if (manualTeachers.length) {
              pool = [...new Set(manualTeachers)];
            } else {
              pool = (teacherSubjects || []).filter(ts => ts.subject_id === subjectId).map(ts => ts.teacher_id);
            }

            for (const teacherId of pool) {
              if (!teacherSchedule[teacherId]?.[day]?.[slotIndex]) {
                hasAvailableTeacher = true;
                break;
              }
            }
            if (hasAvailableTeacher) break;
          }

          gapReasons.push({
            day_of_week: day,
            slot_index: slotIndex,
            class_id: classId,
            group_id: groupId || null,
            section_id: sectionId || null,
            class_name: className,
            group_name: groupName,
            section_name: sectionName,
            reason: hasAvailableTeacher
              ? 'Scheduler could not place a subject at this slot'
              : 'No available teacher for remaining subjects'
          });
        });
      });
    });

    return { entryConflicts, missingRequirements, gapReasons };
  }

  function buildGenerationWarnings({ sections, classes, groups, subjects, classSubjects, groupSubjects, teacherAssignments, teacherSubjects, workingDays, classSlots, shiftList }) {
    const warnings = [];
    const workingDaysCount = workingDays.length;
    const { sectionList } = buildSectionListWithSlots({ sections, classes, classSlots, shiftList: shiftList || ['Full Day'] });

    sectionList.forEach(section => {
      const classInfo = classes.find(c => c.id === section.class_id);
      const groupInfo = groups.find(g => g.id === section.group_id);
      const className = classInfo?.class_name || 'Class';
      const groupName = groupInfo?.group_name || '';
      const sectionName = section.section_name || 'Main';
      const sectionLabel = `${className}${groupName ? ' - ' + groupName : ''} - ${sectionName}`;
      const slotsPerDay = (section.slotIndexes && section.slotIndexes.length)
        ? section.slotIndexes.length
        : classSlots.length;
      const capacityPerSection = workingDaysCount * slotsPerDay;
      if (slotsPerDay === 0) {
        warnings.push({
          type: 'shift',
          message: `${sectionLabel}: no periods selected for the assigned shift.`
        });
      }

      const subjectReqs = [];
      classSubjects.filter(cs => cs.class_id === section.class_id).forEach(cs => {
        const required = cs.is_fixed ? (cs.classes_per_week || 0) : (cs.min_classes || 0);
        if (required > 0) subjectReqs.push({ subject_id: cs.subject_id, required });
      });
      if (section.group_id) {
        groupSubjects.filter(gs => gs.group_id === section.group_id).forEach(gs => {
          const required = gs.is_fixed ? (gs.classes_per_week || 0) : (gs.min_classes || 0);
          if (required > 0) subjectReqs.push({ subject_id: gs.subject_id, required });
        });
      }

      const totalRequired = subjectReqs.reduce((sum, item) => sum + item.required, 0);
      if (totalRequired !== capacityPerSection) {
        warnings.push({
          type: 'capacity',
          message: `${sectionLabel}: total required (${totalRequired}) does not match capacity (${capacityPerSection}).`
        });
      }

      const effectivePlaceable = subjectReqs.reduce((sum, item) => sum + Math.min(item.required, workingDaysCount), 0);
      if (effectivePlaceable < capacityPerSection) {
        warnings.push({
          type: 'one-per-day',
          message: `${sectionLabel}: one-per-day rule caps subjects, leaving ${(capacityPerSection - effectivePlaceable)} slot(s) empty.`
        });
      }

      subjectReqs.forEach(item => {
        const subjectInfo = subjects.find(s => s.id === item.subject_id);
        const subjectName = subjectInfo?.subject_name || `Subject ${item.subject_id}`;
        if (item.required > workingDaysCount) {
          warnings.push({
            type: 'one-per-day',
            message: `${sectionLabel}: ${subjectName} requires ${item.required} but only ${workingDaysCount} days are available.`
          });
        }

        const assignments = pickAssignmentsForSection(teacherAssignments || [], section, item.subject_id);
        const manualTeachers = assignments.filter(a => a.is_auto === 0 && a.teacher_id).map(a => a.teacher_id);
        let pool = [];
        if (manualTeachers.length) {
          pool = [...new Set(manualTeachers)];
        } else {
          pool = (teacherSubjects || []).filter(ts => ts.subject_id === item.subject_id).map(ts => ts.teacher_id);
        }

        if (!pool.length) {
          warnings.push({
            type: 'teacher',
            message: `${sectionLabel}: no qualified teachers found for ${subjectName}.`
          });
        }
      });
    });

    return { items: warnings };
  }

  return new Response("Not Found", {status:404});
}

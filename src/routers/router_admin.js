import { htmlResponse, jsonResponse, getCookie, getCompanyName } from '../core/utils.js';
import { hashPassword } from '../core/auth.js';
import { ADMIN_SETUP_HTML } from '../ui/admin/setup.js';
import { AdminLayout } from '../ui/admin/layout.js';
import { SettingsPageHTML } from '../ui/admin/settings.js';
import { SchoolsPageHTML } from '../ui/admin/schools.js'; 
import { SchoolDetailHTML } from '../ui/admin/school_detail.js'; 
import { SchoolClassesHTML } from '../ui/admin/school_classes.js'; 
import { SchoolTeachersHTML } from '../ui/admin/school_teachers.js'; 
import { ROLES } from '../config.js';
import { syncDatabase } from '../core/schema_manager.js';

export async function handleAdminRequest(request, env) {
  const url = new URL(request.url);
  const companyName = await getCompanyName(env);

  
  const email = getCookie(request, 'user_email');
  if (!email && url.pathname !== '/admin/setup') {
      return htmlResponse("<h1>Unauthorized</h1><p>Please log in.</p>", 401);
  }

  
  if (url.pathname === '/admin/dashboard') {
    const content = `
    <div class="p-4 bg-white border border-gray-300">
        <h3 class="text-base font-bold text-gray-900 mb-2">Welcome to your Control Center</h3>
        <p class="text-sm text-gray-600">Select an option from the sidebar to manage schools, settings, or view reports.</p>
    </div>`;
    return htmlResponse(AdminLayout(content, "Dashboard", companyName, {email}));
  }

  
  if (url.pathname === '/admin/settings') {
      const admin = await env.DB.prepare("SELECT * FROM auth_accounts WHERE email = ?").bind(email).first();
      
      if (request.method === 'POST') {
          try {
              const body = await request.json();
              
              if (body.action === 'update_profile') {
                  const exists = await env.DB.prepare("SELECT id FROM profiles_admin WHERE auth_id = ?").bind(admin.id).first();
                  if (exists) {
                      await env.DB.prepare("UPDATE profiles_admin SET full_name=?, phone=?, dob=? WHERE auth_id=?").bind(body.full_name, body.phone, body.dob, admin.id).run();
                  } else {
                      await env.DB.prepare("INSERT INTO profiles_admin (auth_id, full_name, phone, dob) VALUES (?, ?, ?, ?)").bind(admin.id, body.full_name, body.phone, body.dob).run();
                  }
                  return jsonResponse({ success: true });
              }

              if (body.action === 'change_password') {
                  const { hash, salt } = await hashPassword(body.password);
                  await env.DB.prepare("UPDATE auth_accounts SET password_hash=?, salt=? WHERE id=?").bind(hash, salt, admin.id).run();
                  return jsonResponse({ success: true });
              }
          } catch(e) { 
              if(e.message.includes("no such table")) await syncDatabase(env);
              return jsonResponse({ error: e.message }, 500); 
          }
      }

      let profile = {};
      try { profile = await env.DB.prepare("SELECT * FROM profiles_admin WHERE auth_id = ?").bind(admin.id).first(); } catch(e) {}
      return htmlResponse(AdminLayout(SettingsPageHTML(profile, email), "Settings", companyName, {email}));
  }

  
  if (url.pathname === '/admin/schools') {
    if (request.method === 'POST') {
        try {
            const body = await request.json();
            if (!body.email || !body.password || !body.school_name) return jsonResponse({ error: "Missing fields" }, 400);
            
            const exists = await env.DB.prepare("SELECT id FROM auth_accounts WHERE email = ?").bind(body.email).first();
            if (exists) return jsonResponse({ error: "Email exists" }, 400);

            const { hash, salt } = await hashPassword(body.password);
            const authResult = await env.DB.prepare("INSERT INTO auth_accounts (email, password_hash, salt, role) VALUES (?, ?, ?, ?) RETURNING id").bind(body.email, hash, salt, ROLES.INSTITUTE).first();
            await env.DB.prepare("INSERT INTO profiles_institution (auth_id, school_name, eiin_code, address) VALUES (?, ?, ?, ?)").bind(authResult.id, body.school_name, body.eiin || '', body.address || '').run();
            return jsonResponse({ success: true });
        } catch(e) { return jsonResponse({ error: e.message }, 500); }
    }
    const result = await env.DB.prepare(`SELECT p.auth_id, p.school_name, p.eiin_code, a.email FROM profiles_institution p JOIN auth_accounts a ON p.auth_id = a.id ORDER BY p.id DESC`).all();
    return htmlResponse(AdminLayout(SchoolsPageHTML(result.results || []), "Schools", companyName, {email}));
  }

  
  if (url.pathname === '/admin/school/view') {
    const authId = url.searchParams.get('id');
    const school = await env.DB.prepare(`SELECT * FROM profiles_institution WHERE auth_id = ?`).bind(authId).first();
    if(school) school.email = (await env.DB.prepare("SELECT email FROM auth_accounts WHERE id=?").bind(authId).first()).email;
    return htmlResponse(AdminLayout(SchoolDetailHTML(school), "Manage Client", companyName, {email}));
  }

  
  if (url.pathname === '/admin/school/teachers') {
      if(request.method === 'POST') {
          const body = await request.json();
          if(body.action === 'update_limit') {
              await env.DB.prepare("UPDATE profiles_institution SET max_teachers = ? WHERE id = ?").bind(body.max_val, body.school_id).run();
              return jsonResponse({success:true});
          }
      }
      const authId = url.searchParams.get('id');
      const school = await env.DB.prepare(`SELECT * FROM profiles_institution WHERE auth_id = ?`).bind(authId).first();
      const teachers = await env.DB.prepare("SELECT * FROM profiles_teacher WHERE school_id = ?").bind(school.id).all();
      const teacherSubjects = await env.DB.prepare(`
          SELECT ts.teacher_id, ts.is_primary, sub.subject_name
          FROM teacher_subjects ts
          JOIN academic_subjects sub ON ts.subject_id = sub.id
          WHERE ts.school_id = ?
          ORDER BY ts.is_primary DESC, sub.subject_name ASC
      `).bind(school.id).all();
      const teacherAssignmentSubjects = await env.DB.prepare(`
          SELECT DISTINCT ta.teacher_id, sub.subject_name
          FROM teacher_assignments ta
          JOIN academic_subjects sub ON ta.subject_id = sub.id
          WHERE ta.school_id = ? AND ta.teacher_id IS NOT NULL
          ORDER BY sub.subject_name ASC
      `).bind(school.id).all();
      
      const subjectsByTeacher = {};
      (teacherSubjects.results || []).forEach(ts => {
          if (!subjectsByTeacher[ts.teacher_id]) {
              subjectsByTeacher[ts.teacher_id] = { primary: [], additional: [] };
          }
          if (ts.is_primary === 1) subjectsByTeacher[ts.teacher_id].primary.push(ts.subject_name);
          else subjectsByTeacher[ts.teacher_id].additional.push(ts.subject_name);
      });
      const assignmentSubjectsByTeacher = {};
      (teacherAssignmentSubjects.results || []).forEach(row => {
          if (!assignmentSubjectsByTeacher[row.teacher_id]) {
              assignmentSubjectsByTeacher[row.teacher_id] = [];
          }
          assignmentSubjectsByTeacher[row.teacher_id].push(row.subject_name);
      });
      
      const teachersWithSubjects = (teachers.results || []).map(t => {
          const entry = subjectsByTeacher[t.id];
          const assignmentList = assignmentSubjectsByTeacher[t.id] || [];
          const subjectSet = new Set();
          const ordered = [];
          if (entry) {
              entry.primary.forEach(name => {
                  if (!subjectSet.has(name)) {
                      subjectSet.add(name);
                      ordered.push(name);
                  }
              });
              entry.additional.forEach(name => {
                  if (!subjectSet.has(name)) {
                      subjectSet.add(name);
                      ordered.push(name);
                  }
              });
          }
          assignmentList.forEach(name => {
              if (!subjectSet.has(name)) {
                  subjectSet.add(name);
                  ordered.push(name);
              }
          });
          const subjectText = ordered.length ? ordered.join(', ') : '-';
          return { ...t, subject: subjectText };
      });
      
      return htmlResponse(AdminLayout(SchoolTeachersHTML(school, teachersWithSubjects), "Teachers", companyName, {email}));
  }

  
  if (url.pathname === '/admin/school/classes') {
      if(request.method === 'POST') {
          try {
              const body = await request.json();
              
              if(body.action === 'create_class') {
                  
                  await env.DB.prepare("INSERT INTO academic_classes (school_id, class_name, has_groups) VALUES (?, ?, ?)")
                      .bind(body.school_id, body.class_name, body.has_groups ? 1 : 0).run();
                  return jsonResponse({success:true});
              }
              
              if(body.action === 'edit_class') {
                  
                  await env.DB.prepare("UPDATE academic_classes SET class_name = ? WHERE id = ? AND school_id = ?")
                      .bind(body.class_name, body.class_id, body.school_id).run();
                  return jsonResponse({success:true});
              }
              
              if(body.action === 'add_group') {
                  
                  await env.DB.prepare("INSERT INTO class_groups (school_id, class_id, group_name) VALUES (?, ?, ?)")
                      .bind(body.school_id, body.class_id, body.group_name).run();
                  return jsonResponse({success:true});
              }
              
              if(body.action === 'edit_group') {
                  
                  await env.DB.prepare("UPDATE class_groups SET group_name = ? WHERE id = ? AND school_id = ?")
                      .bind(body.group_name, body.group_id, body.school_id).run();
                  return jsonResponse({success:true});
              }
              
              if(body.action === 'add_section') {
                  
                  await env.DB.prepare("INSERT INTO class_sections (school_id, class_id, group_id, section_name) VALUES (?, ?, ?, ?)")
                      .bind(body.school_id, body.class_id, body.group_id || null, body.section_name).run();
                  return jsonResponse({success:true});
              }
              
              if(body.action === 'edit_section') {
                  
                  await env.DB.prepare("UPDATE class_sections SET section_name = ? WHERE id = ? AND school_id = ?")
                      .bind(body.section_name, body.section_id, body.school_id).run();
                  return jsonResponse({success:true});
              }
          } catch(e) {
              console.error('Classes API Error:', e);
              
              if(e.message.includes("no such table")) {
                  await syncDatabase(env);
                  return jsonResponse({error: "Database tables are being created. Please try again in a moment."}, 500);
              }
              return jsonResponse({error: e.message}, 500);
          }
      }
      
      if(request.method === 'DELETE') {
          const body = await request.json();
          
          if(body.action === 'delete_class') {
              
              await forceDeleteClass(env, body.id, body.school_id);
              return jsonResponse({success:true});
          }
          
          if(body.action === 'delete_group') {
              
              await forceDeleteGroup(env, body.id, body.school_id);
              return jsonResponse({success:true});
          }
          
          if(body.action === 'delete_section') {
              
              await forceDeleteSection(env, body.id, body.school_id);
              return jsonResponse({success:true});
          }
      }
      
      const authId = url.searchParams.get('id');
      const school = await env.DB.prepare(`SELECT * FROM profiles_institution WHERE auth_id = ?`).bind(authId).first();
      
      
      const classes = await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ? ORDER BY class_name ASC").bind(school.id).all();
      const groups = await env.DB.prepare("SELECT * FROM class_groups WHERE school_id = ? ORDER BY class_id, group_name").bind(school.id).all();
      const sections = await env.DB.prepare("SELECT * FROM class_sections WHERE school_id = ? ORDER BY class_id, section_name").bind(school.id).all();
      
      return htmlResponse(AdminLayout(
        SchoolClassesHTML(
          school, 
          classes.results, 
          groups.results, 
          sections.results
        ), 
        "Classes", 
        companyName, 
        {email}
      ));
  }

  
  async function checkClassDependencies(env, classId, schoolId) {
      const details = [];
      let hasDependencies = false;
      
      
      const sections = await env.DB.prepare("SELECT COUNT(*) as count FROM class_sections WHERE class_id = ? AND school_id = ?").bind(classId, schoolId).first();
      if(sections.count > 0) {
          details.push({type: 'sections', count: sections.count, message: `${sections.count} section(s)`});
          hasDependencies = true;
      }
      
      
      const groups = await env.DB.prepare("SELECT COUNT(*) as count FROM class_groups WHERE class_id = ? AND school_id = ?").bind(classId, schoolId).first();
      if(groups.count > 0) {
          details.push({type: 'groups', count: groups.count, message: `${groups.count} group(s)`});
          hasDependencies = true;
      }
      
      
      const subjects = await env.DB.prepare("SELECT COUNT(*) as count FROM class_subjects WHERE class_id = ? AND school_id = ?").bind(classId, schoolId).first();
      if(subjects.count > 0) {
          details.push({type: 'subjects', count: subjects.count, message: `${subjects.count} subject assignment(s)`});
          hasDependencies = true;
      }
      
      
      const teachers = await env.DB.prepare("SELECT COUNT(*) as count FROM teacher_assignments WHERE class_id = ? AND school_id = ?").bind(classId, schoolId).first();
      if(teachers.count > 0) {
          details.push({type: 'teachers', count: teachers.count, message: `${teachers.count} teacher assignment(s)`});
          hasDependencies = true;
      }
      
      
      const routines = await env.DB.prepare("SELECT COUNT(*) as count FROM routine_entries WHERE class_id = ? AND school_id = ?").bind(classId, schoolId).first();
      if(routines.count > 0) {
          details.push({type: 'routines', count: routines.count, message: `${routines.count} routine entrie(s)`});
          hasDependencies = true;
      }
      
      return { hasDependencies, details };
  }
  
  async function checkGroupDependencies(env, groupId, schoolId) {
      const details = [];
      let hasDependencies = false;
      
      
      const sections = await env.DB.prepare("SELECT COUNT(*) as count FROM class_sections WHERE group_id = ? AND school_id = ?").bind(groupId, schoolId).first();
      if(sections.count > 0) {
          details.push({type: 'sections', count: sections.count, message: `${sections.count} section(s)`});
          hasDependencies = true;
      }
      
      
      const subjects = await env.DB.prepare("SELECT COUNT(*) as count FROM group_subjects WHERE group_id = ? AND school_id = ?").bind(groupId, schoolId).first();
      if(subjects.count > 0) {
          details.push({type: 'subjects', count: subjects.count, message: `${subjects.count} subject assignment(s)`});
          hasDependencies = true;
      }
      
      
      const teachers = await env.DB.prepare("SELECT COUNT(*) as count FROM teacher_assignments WHERE group_id = ? AND school_id = ?").bind(groupId, schoolId).first();
      if(teachers.count > 0) {
          details.push({type: 'teachers', count: teachers.count, message: `${teachers.count} teacher assignment(s)`});
          hasDependencies = true;
      }
      
      
      const routines = await env.DB.prepare("SELECT COUNT(*) as count FROM routine_entries WHERE group_id = ? AND school_id = ?").bind(groupId, schoolId).first();
      if(routines.count > 0) {
          details.push({type: 'routines', count: routines.count, message: `${routines.count} routine entrie(s)`});
          hasDependencies = true;
      }
      
      return { hasDependencies, details };
  }
  
  async function checkSectionDependencies(env, sectionId, schoolId) {
      const details = [];
      let hasDependencies = false;
      
      
      const teachers = await env.DB.prepare("SELECT COUNT(*) as count FROM teacher_assignments WHERE section_id = ? AND school_id = ?").bind(sectionId, schoolId).first();
      if(teachers.count > 0) {
          details.push({type: 'teachers', count: teachers.count, message: `${teachers.count} teacher assignment(s)`});
          hasDependencies = true;
      }
      
      
      const routines = await env.DB.prepare("SELECT COUNT(*) as count FROM routine_entries WHERE section_id = ? AND school_id = ?").bind(sectionId, schoolId).first();
      if(routines.count > 0) {
          details.push({type: 'routines', count: routines.count, message: `${routines.count} routine entrie(s)`});
          hasDependencies = true;
      }
      
      return { hasDependencies, details };
  }
  
  async function forceDeleteClass(env, classId, schoolId) {
      
      await env.DB.prepare("DELETE FROM routine_entries WHERE class_id = ? AND school_id = ?").bind(classId, schoolId).run();
      await env.DB.prepare("DELETE FROM teacher_assignments WHERE class_id = ? AND school_id = ?").bind(classId, schoolId).run();
      await env.DB.prepare("DELETE FROM class_subjects WHERE class_id = ? AND school_id = ?").bind(classId, schoolId).run();
      await env.DB.prepare("DELETE FROM class_sections WHERE class_id = ? AND school_id = ?").bind(classId, schoolId).run();
      await env.DB.prepare("DELETE FROM class_groups WHERE class_id = ? AND school_id = ?").bind(classId, schoolId).run();
      await env.DB.prepare("DELETE FROM academic_classes WHERE id = ? AND school_id = ?").bind(classId, schoolId).run();
  }
  
  async function forceDeleteGroup(env, groupId, schoolId) {
      await env.DB.prepare("DELETE FROM routine_entries WHERE group_id = ? AND school_id = ?").bind(groupId, schoolId).run();
      await env.DB.prepare("DELETE FROM teacher_assignments WHERE group_id = ? AND school_id = ?").bind(groupId, schoolId).run();
      await env.DB.prepare("DELETE FROM group_subjects WHERE group_id = ? AND school_id = ?").bind(groupId, schoolId).run();
      await env.DB.prepare("DELETE FROM class_sections WHERE group_id = ? AND school_id = ?").bind(groupId, schoolId).run();
      await env.DB.prepare("DELETE FROM class_groups WHERE id = ? AND school_id = ?").bind(groupId, schoolId).run();
  }
  
  async function forceDeleteSection(env, sectionId, schoolId) {
      await env.DB.prepare("DELETE FROM routine_entries WHERE section_id = ? AND school_id = ?").bind(sectionId, schoolId).run();
      await env.DB.prepare("DELETE FROM teacher_assignments WHERE section_id = ? AND school_id = ?").bind(sectionId, schoolId).run();
      await env.DB.prepare("DELETE FROM class_sections WHERE id = ? AND school_id = ?").bind(sectionId, schoolId).run();
  }

  
  if (url.pathname === '/admin/setup') {
    try { await syncDatabase(env); } catch (e) {}
    if (request.method === 'POST') {
        const { email, password } = await request.json();
        const { hash, salt } = await hashPassword(password);
        await env.DB.prepare("INSERT INTO auth_accounts (email, password_hash, salt, role) VALUES (?, ?, ?, ?)").bind(email, hash, salt, ROLES.ADMIN).run();
        return jsonResponse({ success: true });
    }
    return htmlResponse(ADMIN_SETUP_HTML);
  }

  return new Response("Page Not Found", { status: 404 });
}

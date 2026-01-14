import { htmlResponse, jsonResponse, getCookie } from '../core/utils.js';
import { InstituteLayout } from '../ui/institute/layout.js';
import { InstituteDashboardHTML } from '../ui/institute/dashboard.js';
import { TeachersPageHTML } from '../ui/institute/teachers.js'; 
import { ClassesPageHTML } from '../ui/institute/classes.js'; 
import { SubjectsPageHTML } from '../ui/institute/subjects.js'; // <--- NEW IMPORT
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

  // --- ROUTE: SUBJECTS (NEW) ---
  if (url.pathname === '/school/subjects') {
      
      if (request.method === 'POST') {
          try {
              const body = await request.json();
              
              // Action 1: Create Global Subject
              if (body.action === 'create') {
                  await env.DB.prepare("INSERT INTO academic_subjects (school_id, subject_name) VALUES (?, ?)").bind(school.id, body.name).run();
              }
              // Action 2: Assign to Class
              if (body.action === 'assign') {
                   // Prevent duplicates
                   const exists = await env.DB.prepare("SELECT id FROM class_subjects_link WHERE class_name = ? AND subject_id = ?").bind(body.class_name, body.subject_id).first();
                   if(!exists) {
                       await env.DB.prepare("INSERT INTO class_subjects_link (school_id, class_name, subject_id) VALUES (?, ?, ?)").bind(school.id, body.class_name, body.subject_id).run();
                   }
              }
              return jsonResponse({ success: true });
          } catch(e) {
              if (e.message.includes("no such table")) { await syncDatabase(env); return jsonResponse({error: "Synced"}, 500); }
              return jsonResponse({ error: e.message }, 500);
          }
      }

      if (request.method === 'DELETE') {
          const body = await request.json();
          await env.DB.prepare("DELETE FROM academic_subjects WHERE id = ?").bind(body.id).run();
          await env.DB.prepare("DELETE FROM class_subjects_link WHERE subject_id = ?").bind(body.id).run(); // Cascade delete
          return jsonResponse({ success: true });
      }

      // Load Data
      try {
          const subjects = await env.DB.prepare("SELECT * FROM academic_subjects WHERE school_id = ? ORDER BY subject_name ASC").bind(school.id).all();
          const classes = await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ?").bind(school.id).all();
          
          // Get allocations (Join to get names)
          const allocations = await env.DB.prepare(`
            SELECT l.*, s.subject_name 
            FROM class_subjects_link l 
            JOIN academic_subjects s ON l.subject_id = s.id 
            WHERE l.school_id = ?
          `).bind(school.id).all();

          return htmlResponse(InstituteLayout(SubjectsPageHTML(subjects.results, classes.results, allocations.results), "Subjects", school.school_name));
      } catch(e) {
          await syncDatabase(env);
          return htmlResponse(InstituteLayout(SubjectsPageHTML([], [], []), "Subjects", school.school_name));
      }
  }


  // --- TEACHERS (UPDATED FOR MULTI-SUBJECT) ---
  if (url.pathname === '/school/teachers') {
      if (request.method === 'POST') {
          try {
            const current = await env.DB.prepare("SELECT count(*) as count FROM profiles_teacher WHERE school_id = ?").bind(school.id).first();
            const limit = school.max_teachers || 10;
            if (current.count >= limit) return jsonResponse({ error: "Limit Reached" }, 403);

            const body = await request.json();
            
            // Validate & Format
            if(!body.full_name || !body.subject || !body.email || !body.phone_digits) return jsonResponse({ error: "Missing fields" }, 400);
            const cleanPhone = body.phone_digits.replace(/\D/g, ''); 
            if (cleanPhone.length !== 10) return jsonResponse({ error: "Phone must be 10 digits" }, 400);
            const formattedPhone = `880-${cleanPhone}`;

            // Save (Subject is now a JSON string)
            await env.DB.prepare("INSERT INTO profiles_teacher (school_id, full_name, subject, email, phone) VALUES (?, ?, ?, ?, ?)")
                .bind(school.id, body.full_name, body.subject, body.email, formattedPhone)
                .run();
            
            return jsonResponse({ success: true });
          } catch(e) { return jsonResponse({ error: e.message }, 500); }
      }

      // Load List (Fetch subjects too for the dropdown)
      try {
        const teachers = await env.DB.prepare("SELECT * FROM profiles_teacher WHERE school_id = ? ORDER BY id DESC").bind(school.id).all();
        const allSubjects = await env.DB.prepare("SELECT * FROM academic_subjects WHERE school_id = ? ORDER BY subject_name ASC").bind(school.id).all();
        
        return htmlResponse(InstituteLayout(TeachersPageHTML(teachers.results, allSubjects.results), "Teachers", school.school_name));
      } catch(e) {
        await syncDatabase(env); 
        return htmlResponse(InstituteLayout(TeachersPageHTML([], []), "Teachers", school.school_name));
      }
  }
  
  // --- CLASSES ---
  if (url.pathname === '/school/classes') {
      const classes = await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ?").bind(school.id).all();
      return htmlResponse(InstituteLayout(ClassesPageHTML(classes.results), "Classes", school.school_name));
  }

  return new Response("Not Found", {status:404});
}
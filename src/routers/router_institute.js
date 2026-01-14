import { htmlResponse, jsonResponse, getCookie } from '../core/utils.js';
import { InstituteLayout } from '../ui/institute/layout.js';
import { InstituteDashboardHTML } from '../ui/institute/dashboard.js';
import { TeachersPageHTML } from '../ui/institute/teachers.js'; 
import { ClassesPageHTML } from '../ui/institute/classes.js'; 
import { syncDatabase } from '../core/schema_manager.js';

export async function handleInstituteRequest(request, env) {
  const url = new URL(request.url);

  // 1. AUTH CHECK
  const email = getCookie(request, 'user_email');
  
  if (!email) {
      return htmlResponse(`
        <div style="padding: 50px; font-family: sans-serif; text-align: center;">
            <h1 style="color: red;">Login Failed (No Cookie Found)</h1>
            <p>The browser did not send the 'user_email' cookie.</p>
            <p>Please try logging in again.</p>
            <a href="/login" style="background: blue; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Login</a>
        </div>
      `);
  }

  // 2. CONTEXT (Find the school_id)
  const schoolProfile = await env.DB.prepare(`
      SELECT p.id, p.school_name 
      FROM profiles_institution p
      JOIN auth_accounts a ON p.auth_id = a.id
      WHERE a.email = ?
  `).bind(email).first();

  if (!schoolProfile) return new Response("School Profile Not Found. Please contact Admin.", { status: 404 });
  
  const { id: schoolId, school_name: schoolName } = schoolProfile;


  // --- ROUTE: DASHBOARD ---
  if (url.pathname === '/school/dashboard') {
    const tCount = await env.DB.prepare("SELECT count(*) as count FROM profiles_teacher WHERE school_id = ?").bind(schoolId).first();
    
    // Auto-fix attempt for dashboard stats
    let cCount = { count: 0 };
    try {
        cCount = await env.DB.prepare("SELECT count(*) as count FROM academic_classes WHERE school_id = ?").bind(schoolId).first();
    } catch(e) {
        // If table missing, ignore
    }
    
    const stats = { teachers: tCount.count, classes: cCount.count };
    return htmlResponse(InstituteLayout(InstituteDashboardHTML(stats), "Dashboard", schoolName));
  }


  // --- ROUTE: TEACHERS ---
  if (url.pathname === '/school/teachers') {
      if (request.method === 'POST') {
          try {
              const body = await request.json();
              if(!body.full_name) return jsonResponse({error:"Name required"}, 400);

              await env.DB.prepare("INSERT INTO profiles_teacher (school_id, full_name, phone) VALUES (?, ?, ?)")
                .bind(schoolId, body.full_name, body.phone || '')
                .run();
              
              return jsonResponse({ success: true });
          } catch(e) {
              return jsonResponse({ error: e.message }, 500);
          }
      }

      const teachers = await env.DB.prepare("SELECT * FROM profiles_teacher WHERE school_id = ? ORDER BY id DESC").bind(schoolId).all();
      return htmlResponse(InstituteLayout(TeachersPageHTML(teachers.results), "Teachers", schoolName));
  }


  // --- ROUTE: CLASSES (READ ONLY) ---
  if (url.pathname === '/school/classes') {
      // NOTE: POST method removed to prevent Institutes from creating classes.
      
      // GET: List Classes
      try {
          const classes = await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ? ORDER BY class_name ASC").bind(schoolId).all();
          return htmlResponse(InstituteLayout(ClassesPageHTML(classes.results), "Classes", schoolName));
      } catch (e) {
          if (e.message && (e.message.includes("no such table") || e.message.includes("prepare"))) {
             await syncDatabase(env);
             const classesRetry = await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ? ORDER BY class_name ASC").bind(schoolId).all();
             return htmlResponse(InstituteLayout(ClassesPageHTML(classesRetry.results), "Classes", schoolName));
          }
          throw e; 
      }
  }

  return new Response("Page Not Found", { status: 404 });
}
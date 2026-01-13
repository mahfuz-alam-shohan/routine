import { htmlResponse, jsonResponse, getCookie } from '../core/utils.js';
import { InstituteLayout } from '../ui/institute/layout.js';
import { InstituteDashboardHTML } from '../ui/institute/dashboard.js';
import { TeachersPageHTML } from '../ui/institute/teachers.js'; // <--- Import UI

export async function handleInstituteRequest(request, env) {
  const url = new URL(request.url);

  // 1. AUTH & CONTEXT (Find the school_id)
  const email = getCookie(request, 'user_email');
  if (!email) return new Response("Session Expired", { status: 403 });

  // Fetch School ID and Name
  const schoolProfile = await env.DB.prepare(`
      SELECT p.id, p.school_name 
      FROM profiles_institution p
      JOIN auth_accounts a ON p.auth_id = a.id
      WHERE a.email = ?
  `).bind(email).first();

  if (!schoolProfile) return new Response("School Not Found", { status: 404 });
  
  const { id: schoolId, school_name: schoolName } = schoolProfile;


  // --- ROUTE: DASHBOARD ---
  if (url.pathname === '/school/dashboard') {
    // Get Real Stats
    const tCount = await env.DB.prepare("SELECT count(*) as count FROM profiles_teacher WHERE school_id = ?").bind(schoolId).first();
    // (Classes table doesn't exist yet, so we mock it as 0)
    
    const stats = { teachers: tCount.count, classes: 0 };
    return htmlResponse(InstituteLayout(InstituteDashboardHTML(stats), "Dashboard", schoolName));
  }


  // --- ROUTE: TEACHERS ---
  if (url.pathname === '/school/teachers') {
      
      // POST: Add Teacher
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

      // GET: List Teachers
      const teachers = await env.DB.prepare("SELECT * FROM profiles_teacher WHERE school_id = ? ORDER BY id DESC").bind(schoolId).all();
      return htmlResponse(InstituteLayout(TeachersPageHTML(teachers.results), "Teachers", schoolName));
  }


  // --- ROUTE: CLASSES (Placeholder) ---
  if (url.pathname === '/school/classes') {
      return htmlResponse(InstituteLayout("<h1>Classes Page (Coming Next)</h1>", "Classes", schoolName));
  }

  return new Response("Page Not Found", { status: 404 });
}
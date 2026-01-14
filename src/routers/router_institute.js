import { htmlResponse, jsonResponse, getCookie } from '../core/utils.js';
import { InstituteLayout } from '../ui/institute/layout.js';
import { InstituteDashboardHTML } from '../ui/institute/dashboard.js';
import { TeachersPageHTML } from '../ui/institute/teachers.js'; 
import { ClassesPageHTML } from '../ui/institute/classes.js'; 

export async function handleInstituteRequest(request, env) {
  const url = new URL(request.url);
  const email = getCookie(request, 'user_email');
  if (!email) return htmlResponse("<h1>Login Failed</h1>");

  const school = await env.DB.prepare(`SELECT p.* FROM profiles_institution p JOIN auth_accounts a ON p.auth_id = a.id WHERE a.email = ?`).bind(email).first();
  if(!school) return new Response("Error", {status: 404});

  // --- DASHBOARD ---
  if (url.pathname === '/school/dashboard') {
    return htmlResponse(InstituteLayout(InstituteDashboardHTML({}), "Dashboard", school.school_name));
  }

  // --- TEACHERS (WITH LIMIT CHECK) ---
  if (url.pathname === '/school/teachers') {
      if (request.method === 'POST') {
          // 1. Check Limit
          const current = await env.DB.prepare("SELECT count(*) as count FROM profiles_teacher WHERE school_id = ?").bind(school.id).first();
          const limit = school.max_teachers || 10;
          
          if (current.count >= limit) {
              return jsonResponse({ error: `Limit Reached! Upgrade plan to add more than ${limit} teachers.` }, 403);
          }

          const body = await request.json();
          await env.DB.prepare("INSERT INTO profiles_teacher (school_id, full_name, phone) VALUES (?, ?, ?)").bind(school.id, body.full_name, body.phone || '').run();
          return jsonResponse({ success: true });
      }
      const teachers = await env.DB.prepare("SELECT * FROM profiles_teacher WHERE school_id = ?").bind(school.id).all();
      return htmlResponse(InstituteLayout(TeachersPageHTML(teachers.results), "Teachers", school.school_name));
  }
  
  // --- CLASSES (READ ONLY) ---
  if (url.pathname === '/school/classes') {
      const classes = await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ?").bind(school.id).all();
      return htmlResponse(InstituteLayout(ClassesPageHTML(classes.results), "Classes", school.school_name));
  }

  return new Response("Not Found", {status:404});
}
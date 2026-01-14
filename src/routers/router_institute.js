import { htmlResponse, jsonResponse, getCookie } from '../core/utils.js';
import { InstituteLayout } from '../ui/institute/layout.js';
import { InstituteDashboardHTML } from '../ui/institute/dashboard.js';
import { TeachersPageHTML } from '../ui/institute/teachers.js'; 
import { ClassesPageHTML } from '../ui/institute/classes.js'; 
import { syncDatabase } from '../core/schema_manager.js';

export async function handleInstituteRequest(request, env) {
  const url = new URL(request.url);

  // 1. AUTH
  const email = getCookie(request, 'user_email');
  if (!email) return htmlResponse("<h1>Login Failed</h1><a href='/login'>Go Login</a>");

  const schoolProfile = await env.DB.prepare(`SELECT p.id, p.school_name FROM profiles_institution p JOIN auth_accounts a ON p.auth_id = a.id WHERE a.email = ?`).bind(email).first();
  if (!schoolProfile) return new Response("Profile Not Found", { status: 404 });
  const { id: schoolId, school_name: schoolName } = schoolProfile;

  // --- DASHBOARD ---
  if (url.pathname === '/school/dashboard') {
    const tCount = await env.DB.prepare("SELECT count(*) as count FROM profiles_teacher WHERE school_id = ?").bind(schoolId).first();
    let cCount = { count: 0 };
    try { cCount = await env.DB.prepare("SELECT count(*) as count FROM academic_classes WHERE school_id = ?").bind(schoolId).first(); } catch(e){}
    return htmlResponse(InstituteLayout(InstituteDashboardHTML({ teachers: tCount.count, classes: cCount.count }), "Dashboard", schoolName));
  }

  // --- TEACHERS (Editable) ---
  if (url.pathname === '/school/teachers') {
      if (request.method === 'POST') {
          const body = await request.json();
          await env.DB.prepare("INSERT INTO profiles_teacher (school_id, full_name, phone) VALUES (?, ?, ?)").bind(schoolId, body.full_name, body.phone || '').run();
          return jsonResponse({ success: true });
      }
      const teachers = await env.DB.prepare("SELECT * FROM profiles_teacher WHERE school_id = ? ORDER BY id DESC").bind(schoolId).all();
      return htmlResponse(InstituteLayout(TeachersPageHTML(teachers.results), "Teachers", schoolName));
  }

  // --- CLASSES (READ ONLY) ---
  if (url.pathname === '/school/classes') {
      try {
          const classes = await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ? ORDER BY class_name ASC").bind(schoolId).all();
          return htmlResponse(InstituteLayout(ClassesPageHTML(classes.results), "Classes", schoolName));
      } catch (e) {
          if (e.message && e.message.includes("no such table")) {
             await syncDatabase(env);
             return htmlResponse(InstituteLayout(ClassesPageHTML([]), "Classes", schoolName));
          }
          throw e; 
      }
  }
  return new Response("Page Not Found", { status: 404 });
}
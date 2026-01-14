import { htmlResponse, jsonResponse, getCookie } from '../core/utils.js';
import { getCompanyName } from '../core/utils.js'; 
import { AdminLayout } from '../ui/admin/layout.js';
import { SchoolsPageHTML } from '../ui/admin/schools.js'; 
import { SchoolDetailHTML } from '../ui/admin/school_detail.js'; // The Menu
import { SchoolClassesHTML } from '../ui/admin/school_classes.js'; // The Hierarchy
import { SchoolTeachersHTML } from '../ui/admin/school_teachers.js'; // The Limits
import { ROLES } from '../config.js';
import { syncDatabase } from '../core/schema_manager.js';
import { hashPassword } from '../core/auth.js';

export async function handleAdminRequest(request, env) {
  const url = new URL(request.url);
  const companyName = await getCompanyName(env);
  
  // AUTH CHECK
  const email = getCookie(request, 'user_email');
  if (!email && url.pathname !== '/admin/setup') return htmlResponse("<h1>Unauthorized</h1>", 401);

  // --- DASHBOARD & SCHOOLS LIST ---
  if (url.pathname === '/admin/dashboard') {
      return htmlResponse(AdminLayout("<h1>Dashboard</h1>", "Dashboard", companyName));
  }
  if (url.pathname === '/admin/schools') {
      // (Keep existing schools list logic here - shortened for brevity, assumes standard get/post)
      const result = await env.DB.prepare(`SELECT p.auth_id, p.school_name, p.eiin_code, a.email FROM profiles_institution p JOIN auth_accounts a ON p.auth_id = a.id ORDER BY p.id DESC`).all();
      return htmlResponse(AdminLayout(SchoolsPageHTML(result.results || []), "Manage Schools", companyName));
  }

  // --- 1. THE MENU PAGE ---
  if (url.pathname === '/admin/school/view') {
    const authId = url.searchParams.get('id');
    const school = await env.DB.prepare(`SELECT * FROM profiles_institution WHERE auth_id = ?`).bind(authId).first();
    // Add email fetch if needed
    school.email = (await env.DB.prepare("SELECT email FROM auth_accounts WHERE id=?").bind(authId).first()).email;
    
    return htmlResponse(AdminLayout(SchoolDetailHTML(school), "Settings Menu", companyName));
  }

  // --- 2. TEACHERS & LIMITS ---
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
      return htmlResponse(AdminLayout(SchoolTeachersHTML(school, teachers.results), "Teachers", companyName));
  }

  // --- 3. CLASSES (HIERARCHY) ---
  if (url.pathname === '/admin/school/classes') {
      if(request.method === 'POST') {
          const body = await request.json();
          await env.DB.prepare("INSERT INTO academic_classes (school_id, class_name, section_name, shift) VALUES (?, ?, ?, ?)").bind(body.school_id, body.class_name, body.section_name, body.shift || 'Morning').run();
          return jsonResponse({success:true});
      }
      if(request.method === 'DELETE') {
           const id = url.searchParams.get('id');
           await env.DB.prepare("DELETE FROM academic_classes WHERE id=?").bind(id).run();
           return jsonResponse({success:true});
      }

      const authId = url.searchParams.get('id');
      const school = await env.DB.prepare(`SELECT * FROM profiles_institution WHERE auth_id = ?`).bind(authId).first();
      const classes = await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ? ORDER BY class_name ASC").bind(school.id).all();
      return htmlResponse(AdminLayout(SchoolClassesHTML(school, classes.results), "Classes", companyName));
  }

  // SETUP
  if (url.pathname === '/admin/setup') {
      await syncDatabase(env);
      return htmlResponse(AdminLayout("<h1>Synced</h1>", "Setup", companyName));
  }

  return new Response("Not Found", { status: 404 });
}
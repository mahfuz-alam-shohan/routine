import { htmlResponse, jsonResponse, getCookie } from '../core/utils.js';
import { getCompanyName } from '../core/utils.js'; 
import { hashPassword } from '../core/auth.js';
import { ADMIN_SETUP_HTML } from '../ui/admin/setup.js';
import { AdminLayout } from '../ui/admin/layout.js';
import { SettingsPageHTML } from '../ui/admin/settings.js'; // <--- Using new settings page
import { SchoolsPageHTML } from '../ui/admin/schools.js'; 
import { SchoolDetailHTML } from '../ui/admin/school_detail.js'; 
import { SchoolClassesHTML } from '../ui/admin/school_classes.js'; 
import { SchoolTeachersHTML } from '../ui/admin/school_teachers.js'; 
import { ROLES } from '../config.js';
import { syncDatabase } from '../core/schema_manager.js';

export async function handleAdminRequest(request, env) {
  const url = new URL(request.url);
  const companyName = await getCompanyName(env);

  // AUTH CHECK
  const email = getCookie(request, 'user_email');
  if (!email && url.pathname !== '/admin/setup') return htmlResponse("<h1>Unauthorized</h1>", 401);

  // --- DASHBOARD ---
  if (url.pathname === '/admin/dashboard') {
    const content = `<div class="p-6 bg-white rounded shadow-sm border border-gray-200">
        <h3 class="text-lg font-bold mb-2">Welcome Back, Admin</h3>
        <p class="text-gray-500">Select an option from the sidebar to manage your institution.</p>
    </div>`;
    // Pass user email to layout for Avatar
    return htmlResponse(AdminLayout(content, "Dashboard", companyName, {email}));
  }

  // --- SETTINGS (PROFILE & SECURITY) ---
  if (url.pathname === '/admin/settings') {
      
      // 1. Get Current Admin ID
      const admin = await env.DB.prepare("SELECT * FROM auth_accounts WHERE email = ?").bind(email).first();
      
      if (request.method === 'POST') {
          try {
              const body = await request.json();
              
              // ACTION: UPDATE PROFILE
              if (body.action === 'update_profile') {
                  // Check if profile exists
                  const exists = await env.DB.prepare("SELECT id FROM profiles_admin WHERE auth_id = ?").bind(admin.id).first();
                  
                  if (exists) {
                      await env.DB.prepare("UPDATE profiles_admin SET full_name=?, phone=?, dob=? WHERE auth_id=?")
                          .bind(body.full_name, body.phone, body.dob, admin.id).run();
                  } else {
                      await env.DB.prepare("INSERT INTO profiles_admin (auth_id, full_name, phone, dob) VALUES (?, ?, ?, ?)")
                          .bind(admin.id, body.full_name, body.phone, body.dob).run();
                  }
                  return jsonResponse({ success: true });
              }

              // ACTION: CHANGE PASSWORD
              if (body.action === 'change_password') {
                  const { hash, salt } = await hashPassword(body.password);
                  await env.DB.prepare("UPDATE auth_accounts SET password_hash=?, salt=? WHERE id=?")
                      .bind(hash, salt, admin.id).run();
                  return jsonResponse({ success: true });
              }

          } catch(e) { 
              if(e.message.includes("no such table")) await syncDatabase(env); // Auto-fix
              return jsonResponse({ error: e.message }, 500); 
          }
      }

      // LOAD PROFILE
      let profile = {};
      try {
          profile = await env.DB.prepare("SELECT * FROM profiles_admin WHERE auth_id = ?").bind(admin.id).first();
      } catch(e) { await syncDatabase(env); }

      const content = SettingsPageHTML(profile, email);
      return htmlResponse(AdminLayout(content, "Settings", companyName, {email}));
  }

  // --- SCHOOLS ---
  if (url.pathname === '/admin/schools') {
      if (request.method === 'POST') {
        // ... (Keep existing Create School logic)
      }
      const result = await env.DB.prepare(`SELECT p.auth_id, p.school_name, p.eiin_code, a.email FROM profiles_institution p JOIN auth_accounts a ON p.auth_id = a.id ORDER BY p.id DESC`).all();
      return htmlResponse(AdminLayout(SchoolsPageHTML(result.results || []), "Schools", companyName, {email}));
  }

  // --- SCHOOL DETAILS ---
  if (url.pathname === '/admin/school/view') {
      const authId = url.searchParams.get('id');
      const school = await env.DB.prepare(`SELECT * FROM profiles_institution WHERE auth_id = ?`).bind(authId).first();
      if(school) school.email = (await env.DB.prepare("SELECT email FROM auth_accounts WHERE id=?").bind(authId).first()).email;
      return htmlResponse(AdminLayout(SchoolDetailHTML(school), "Manage Client", companyName, {email}));
  }

  // --- SETUP ---
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
  
  // (Include other routes like classes/teachers if they were there, maintaining 'email' param for layout)

  return new Response("Not Found", { status: 404 });
}

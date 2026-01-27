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

  // 1. AUTH CHECK
  const email = getCookie(request, 'user_email');
  if (!email && url.pathname !== '/admin/setup') {
      return htmlResponse("<h1>Unauthorized</h1><p>Please log in.</p>", 401);
  }

  // --- DASHBOARD ---
  if (url.pathname === '/admin/dashboard') {
    const content = `
    <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Welcome to your Control Center</h3>
        <p class="text-gray-500">Select an option from the sidebar to manage schools, settings, or view reports.</p>
    </div>`;
    return htmlResponse(AdminLayout(content, "Dashboard", companyName, {email}));
  }

  // --- SETTINGS (The New Profile Page) ---
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

  // --- MANAGE SCHOOLS ---
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

  // --- SCHOOL MENU (The Settings List) ---
  if (url.pathname === '/admin/school/view') {
    const authId = url.searchParams.get('id');
    const school = await env.DB.prepare(`SELECT * FROM profiles_institution WHERE auth_id = ?`).bind(authId).first();
    if(school) school.email = (await env.DB.prepare("SELECT email FROM auth_accounts WHERE id=?").bind(authId).first()).email;
    return htmlResponse(AdminLayout(SchoolDetailHTML(school), "Manage Client", companyName, {email}));
  }

  // --- SCHOOL TEACHERS (Limits & List) ---
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
      return htmlResponse(AdminLayout(SchoolTeachersHTML(school, teachers.results), "Teachers", companyName, {email}));
  }

  // --- SCHOOL CLASSES (New Logic) ---
  if (url.pathname === '/admin/school/classes') {
      if(request.method === 'POST') {
          const body = await request.json();
          
          if(body.action === 'create_class') {
              // Create new class
              await env.DB.prepare("INSERT INTO academic_classes (school_id, class_name, has_groups) VALUES (?, ?, ?)")
                  .bind(body.school_id, body.class_name, body.has_groups ? 1 : 0).run();
              return jsonResponse({success:true});
          }
          
          if(body.action === 'add_group') {
              // Add group to existing class
              await env.DB.prepare("INSERT INTO class_groups (school_id, class_id, group_name) VALUES (?, ?, ?)")
                  .bind(body.school_id, body.class_id, body.group_name).run();
              return jsonResponse({success:true});
          }
          
          if(body.action === 'add_section') {
              // Add section to class (with optional group)
              await env.DB.prepare("INSERT INTO class_sections (school_id, class_id, group_id, section_name, shift) VALUES (?, ?, ?, ?, ?)")
                  .bind(body.school_id, body.class_id, body.group_id || null, body.section_name, body.shift || 'Morning').run();
              return jsonResponse({success:true});
          }
      }
      
      if(request.method === 'DELETE') {
          const body = await request.json();
          
          if(body.action === 'delete_class') {
              await env.DB.prepare("DELETE FROM academic_classes WHERE id=?").bind(body.id).run();
              return jsonResponse({success:true});
          }
          
          if(body.action === 'delete_group') {
              await env.DB.prepare("DELETE FROM class_groups WHERE id=?").bind(body.id).run();
              return jsonResponse({success:true});
          }
          
          if(body.action === 'delete_section') {
              await env.DB.prepare("DELETE FROM class_sections WHERE id=?").bind(body.id).run();
              return jsonResponse({success:true});
          }
      }
      
      const authId = url.searchParams.get('id');
      const school = await env.DB.prepare(`SELECT * FROM profiles_institution WHERE auth_id = ?`).bind(authId).first();
      
      // Get all data
      const classes = await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ? ORDER BY class_name ASC").bind(school.id).all();
      const groups = await env.DB.prepare("SELECT * FROM class_groups WHERE school_id = ? ORDER BY class_id, group_name").bind(school.id).all();
      const sections = await env.DB.prepare("SELECT * FROM class_sections WHERE school_id = ? ORDER BY class_id, section_name").bind(school.id).all();
      
      return htmlResponse(AdminLayout(SchoolClassesHTML(school, classes.results, groups.results, sections.results), "Classes", companyName, {email}));
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

  return new Response("Page Not Found", { status: 404 });
}

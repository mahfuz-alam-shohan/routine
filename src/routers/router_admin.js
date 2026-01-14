import { htmlResponse, jsonResponse, getCookie } from '../core/utils.js';
import { getCompanyName } from '../core/utils.js'; 
import { hashPassword } from '../core/auth.js';
import { ADMIN_SETUP_HTML } from '../ui/admin/setup.js';
import { AdminLayout } from '../ui/admin/layout.js';
import { SettingsPageHTML } from '../ui/admin/settings.js';
import { SchoolsPageHTML } from '../ui/admin/schools.js'; 
import { SchoolDetailHTML } from '../ui/admin/school_detail.js'; 
import { ROLES } from '../config.js';
import { syncDatabase } from '../core/schema_manager.js';

export async function handleAdminRequest(request, env) {
  const url = new URL(request.url);
  const companyName = await getCompanyName(env);

  // 1. SECURITY CHECK
  const email = getCookie(request, 'user_email');
  if (!email && url.pathname !== '/admin/setup') {
      return htmlResponse(`<h1>Unauthorized</h1><p>Admin login required.</p>`, 401);
  }

  // --- DASHBOARD ---
  if (url.pathname === '/admin/dashboard') {
    const content = `<div class="p-6 bg-white rounded shadow"><h3>Welcome to Admin Dashboard</h3></div>`;
    return htmlResponse(AdminLayout(content, "Dashboard", companyName));
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
    return htmlResponse(AdminLayout(SchoolsPageHTML(result.results || []), "Manage Schools", companyName));
  }

  // --- SCHOOL MASTER VIEW (With Class Manager) ---
  if (url.pathname === '/admin/school/view') {
    
    // ACTION: Add/Delete Classes
    if (request.method === 'POST') {
        const action = url.searchParams.get('action');
        const body = await request.json();

        try {
            if (action === 'add_class') {
                await env.DB.prepare("INSERT INTO academic_classes (school_id, class_name, section_name, shift) VALUES (?, ?, ?, ?)")
                  .bind(body.school_id, body.class_name, body.section_name, body.shift)
                  .run();
                return jsonResponse({ success: true });
            }
            if (action === 'delete_class') {
                await env.DB.prepare("DELETE FROM academic_classes WHERE id = ?").bind(body.id).run();
                return jsonResponse({ success: true });
            }
        } catch (e) {
            // Auto-Fix Table
            if (e.message && e.message.includes("no such table")) {
                 await syncDatabase(env);
                 return jsonResponse({ error: "Database synced. Try again." }, 500);
            }
            return jsonResponse({ error: e.message }, 500);
        }
    }

    // VIEW PAGE
    const authId = url.searchParams.get('id');
    const school = await env.DB.prepare(`SELECT p.*, a.email FROM profiles_institution p JOIN auth_accounts a ON p.auth_id = a.id WHERE a.id = ?`).bind(authId).first();
    
    if (!school) return htmlResponse("<h1>School Not Found</h1>");

    let classes = [];
    try {
        const res = await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ? ORDER BY class_name ASC").bind(school.id).all();
        classes = res.results || [];
    } catch(e) {}

    return htmlResponse(AdminLayout(SchoolDetailHTML(school, classes), "Manage Client", companyName));
  }

  // --- SETTINGS ---
  if (url.pathname === '/admin/settings') {
    if (url.searchParams.get('action') === 'sync_db') { const report = await syncDatabase(env); return jsonResponse({ success: true, report: report }); }
    if (request.method === 'POST') {
        const body = await request.json(); 
        await env.DB.prepare("INSERT OR REPLACE INTO system_settings (key, value) VALUES ('site_name', ?)").bind(body.site_name).run(); 
        return jsonResponse({ success: true }); 
    }
    return htmlResponse(AdminLayout(SettingsPageHTML(companyName), "Settings", companyName));
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

  return new Response("Admin Route Not Found", { status: 404 });
}
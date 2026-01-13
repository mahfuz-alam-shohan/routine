import { htmlResponse, jsonResponse } from '../core/utils.js';
import { hashPassword } from '../core/auth.js';
import { ADMIN_SETUP_HTML } from '../ui/admin/setup.js';
import { AdminLayout } from '../ui/admin/layout.js';
import { SettingsPageHTML } from '../ui/admin/settings.js';
import { ROLES } from '../config.js';
import { syncDatabase } from '../core/schema_manager.js';

export async function handleAdminRequest(request, env) {
  const url = new URL(request.url);

  // --- SUB-ROUTE: SETUP (Create first admin) ---
  if (url.pathname === '/admin/setup') {
    
    // 1. RUN SMART SYNC (Creates tables if missing)
    try {
      await syncDatabase(env);
    } catch (e) {
      return htmlResponse(`<h1>DB Sync Error</h1><p>${e.message}</p>`);
    }

    // 2. Check if admin exists
    const check = await env.DB.prepare("SELECT count(*) as count FROM auth_accounts WHERE role = ?").bind(ROLES.ADMIN).first();
    
    if (check && check.count > 0) {
      return htmlResponse("<h1>System Locked</h1><p>Admin already exists.</p>");
    }

    // 3. Handle Creation (POST)
    if (request.method === 'POST') {
      try {
        const { email, password } = await request.json();
        const { hash, salt } = await hashPassword(password);
        
        // Create Admin
        await env.DB.prepare(
          "INSERT INTO auth_accounts (email, password_hash, salt, role) VALUES (?, ?, ?, ?)"
        ).bind(email, hash, salt, ROLES.ADMIN).run();

        // Set Default Site Name
        await env.DB.prepare("INSERT OR IGNORE INTO system_settings (key, value) VALUES ('site_name', 'RoutineAI')").run();

        return jsonResponse({ success: true });
      } catch (e) {
        return jsonResponse({ error: e.message }, 500);
      }
    }

    return htmlResponse(ADMIN_SETUP_HTML);
  }

  // --- SUB-ROUTE: SETTINGS ---
  if (url.pathname === '/admin/settings') {
    
    // ACTION: Force DB Sync (Clicked from Maintenance Button)
    if (url.searchParams.get('action') === 'sync_db') {
        const report = await syncDatabase(env);
        return jsonResponse({ success: true, report: report });
    }

    // POST: Save Site Name
    if (request.method === 'POST') {
        try {
            const body = await request.json();
            // Upsert Logic (Insert or Replace)
            await env.DB.prepare("INSERT OR REPLACE INTO system_settings (key, value) VALUES ('site_name', ?)").bind(body.site_name).run();
            return jsonResponse({ success: true });
        } catch(e) {
            return jsonResponse({ error: e.message }, 500);
        }
    }

    // GET: Show Page
    const result = await env.DB.prepare("SELECT value FROM system_settings WHERE key = 'site_name'").first();
    const currentName = result ? result.value : 'RoutineAI';

    const content = SettingsPageHTML(currentName);
    return htmlResponse(AdminLayout(content, "System Settings"));
  }

  // --- SUB-ROUTE: DASHBOARD ---
  if (url.pathname === '/admin/dashboard') {
    const content = `
    <div class="p-6 bg-white rounded shadow">
        <h3 class="text-lg font-bold mb-2">Welcome to the Dashboard</h3>
        <p class="text-gray-600">Select an option from the sidebar to manage schools, users, or settings.</p>
    </div>`;
    return htmlResponse(AdminLayout(content, "Dashboard"));
  }

  return new Response("Admin Route Not Found", { status: 404 });
}
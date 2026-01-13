import { htmlResponse, jsonResponse } from '../core/utils.js';
import { getCompanyName } from '../core/utils.js'; 
import { hashPassword } from '../core/auth.js';
import { ADMIN_SETUP_HTML } from '../ui/admin/setup.js';
import { AdminLayout } from '../ui/admin/layout.js';
import { SettingsPageHTML } from '../ui/admin/settings.js';
import { SchoolsPageHTML } from '../ui/admin/schools.js'; // <--- New Import
import { ROLES } from '../config.js';
import { syncDatabase } from '../core/schema_manager.js';

export async function handleAdminRequest(request, env) {
  const url = new URL(request.url);

  // 1. FETCH COMPANY NAME (For the Sidebar)
  const companyName = await getCompanyName(env);

  // --- SUB-ROUTE: DASHBOARD ---
  if (url.pathname === '/admin/dashboard') {
    const content = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="p-6 bg-white rounded-lg shadow border-l-4 border-blue-500">
            <h3 class="text-gray-500 text-sm font-medium">Total Schools</h3>
            <p class="text-2xl font-bold text-gray-900">0</p>
        </div>
        <div class="p-6 bg-white rounded-lg shadow border-l-4 border-green-500">
            <h3 class="text-gray-500 text-sm font-medium">Active Teachers</h3>
            <p class="text-2xl font-bold text-gray-900">0</p>
        </div>
        <div class="p-6 bg-white rounded-lg shadow border-l-4 border-purple-500">
            <h3 class="text-gray-500 text-sm font-medium">System Status</h3>
            <p class="text-2xl font-bold text-green-600">Healthy</p>
        </div>
    </div>

    <div class="p-6 bg-white rounded shadow">
        <h3 class="text-lg font-bold mb-2">Welcome to ${companyName}</h3>
        <p class="text-gray-600">This is the Super Admin control panel. Here you will add schools (clients) in the future.</p>
    </div>`;
    
    return htmlResponse(AdminLayout(content, "Super Admin Dashboard", companyName));
  }


  // --- SUB-ROUTE: MANAGE SCHOOLS ---
  if (url.pathname === '/admin/schools') {
    
    // POST: Create New School
    if (request.method === 'POST') {
        try {
            const body = await request.json();
            
            // 1. Validation
            if (!body.email || !body.password || !body.school_name) {
                return jsonResponse({ error: "Missing required fields" }, 400);
            }

            // 2. Check if Email Exists
            const exists = await env.DB.prepare("SELECT id FROM auth_accounts WHERE email = ?").bind(body.email).first();
            if (exists) return jsonResponse({ error: "Email already registered" }, 400);

            // 3. Create Auth Account (Role = INSTITUTE)
            const { hash, salt } = await hashPassword(body.password);
            
            // We use RETURNING id to get the new user's ID immediately
            const authResult = await env.DB.prepare(
                "INSERT INTO auth_accounts (email, password_hash, salt, role) VALUES (?, ?, ?, ?) RETURNING id"
            ).bind(body.email, hash, salt, ROLES.INSTITUTE).first();

            // 4. Create School Profile
            await env.DB.prepare(
                "INSERT INTO profiles_institution (auth_id, school_name, eiin_code, address) VALUES (?, ?, ?, ?)"
            ).bind(authResult.id, body.school_name, body.eiin || '', body.address || '').run();

            return jsonResponse({ success: true });

        } catch(e) {
            return jsonResponse({ error: e.message }, 500);
        }
    }

    // GET: List Schools
    try {
        const result = await env.DB.prepare(`
            SELECT 
                p.school_name, 
                p.eiin_code, 
                a.email 
            FROM profiles_institution p
            JOIN auth_accounts a ON p.auth_id = a.id
            ORDER BY p.id DESC
        `).all();

        const content = SchoolsPageHTML(result.results || []);
        return htmlResponse(AdminLayout(content, "Manage Schools", companyName));
    } catch (e) {
        return htmlResponse(AdminLayout(`<h1>Error loading schools</h1><p>${e.message}</p>`, "Error", companyName));
    }
  }


  // --- SUB-ROUTE: SETTINGS (Platform Name) ---
  if (url.pathname === '/admin/settings') {
    
    // Action: Sync DB
    if (url.searchParams.get('action') === 'sync_db') {
        const report = await syncDatabase(env);
        return jsonResponse({ success: true, report: report });
    }

    // POST: Save Company Name
    if (request.method === 'POST') {
        try {
            const body = await request.json();
            await env.DB.prepare("INSERT OR REPLACE INTO system_settings (key, value) VALUES ('site_name', ?)").bind(body.site_name).run();
            return jsonResponse({ success: true });
        } catch(e) {
            return jsonResponse({ error: e.message }, 500);
        }
    }

    // GET: Show Page
    const content = SettingsPageHTML(companyName);
    return htmlResponse(AdminLayout(content, "Platform Settings", companyName));
  }


  // --- SUB-ROUTE: SETUP ---
  if (url.pathname === '/admin/setup') {
    try { await syncDatabase(env); } catch (e) {}

    const check = await env.DB.prepare("SELECT count(*) as count FROM auth_accounts WHERE role = ?").bind(ROLES.ADMIN).first();
    if (check && check.count > 0) return htmlResponse("<h1>System Locked</h1><p>Admin already exists.</p>");

    if (request.method === 'POST') {
      try {
        const { email, password } = await request.json();
        const { hash, salt } = await hashPassword(password);
        
        await env.DB.prepare("INSERT INTO auth_accounts (email, password_hash, salt, role) VALUES (?, ?, ?, ?)").bind(email, hash, salt, ROLES.ADMIN).run();
        
        // Default Company Name
        await env.DB.prepare("INSERT OR IGNORE INTO system_settings (key, value) VALUES ('site_name', 'Routine SaaS')").run();
        
        return jsonResponse({ success: true });
      } catch (e) {
        return jsonResponse({ error: e.message }, 500);
      }
    }
    return htmlResponse(ADMIN_SETUP_HTML);
  }

  return new Response("Admin Route Not Found", { status: 404 });
}
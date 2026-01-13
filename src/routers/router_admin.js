import { htmlResponse, jsonResponse } from '../core/utils.js';
import { hashPassword } from '../core/auth.js';
import { ADMIN_SETUP_HTML } from '../ui/admin/setup.js';
import { ROLES } from '../config.js';
import { SCHEMA_SQL } from '../db_schema.js'; // <--- Import this

export async function handleAdminRequest(request, env) {
  const url = new URL(request.url);

  // --- SUB-ROUTE: SETUP (Create first admin) ---
  if (url.pathname === '/admin/setup') {
    
    // 1. ENSURE TABLES EXIST (Run this ONLY here)
    // We run this here so the homepage never crashes.
    try {
        await env.DB.exec(SCHEMA_SQL);
    } catch (e) {
        return htmlResponse(`<h1>DB Error</h1><p>${e.message}</p>`);
    }

    // 2. Check if admin already exists
    const check = await env.DB.prepare("SELECT count(*) as count FROM auth_accounts WHERE role = ?").bind(ROLES.ADMIN).first();
    
    if (check.count > 0) {
      return htmlResponse("<h1>System Locked</h1><p>Admin already exists.</p>");
    }

    // Handle POST (Create logic)
    if (request.method === 'POST') {
      try {
        const { email, password } = await request.json();
        const { hash, salt } = await hashPassword(password);
        
        await env.DB.prepare(
          "INSERT INTO auth_accounts (email, password_hash, salt, role) VALUES (?, ?, ?, ?)"
        ).bind(email, hash, salt, ROLES.ADMIN).run();

        return jsonResponse({ success: true });
      } catch (e) {
        return jsonResponse({ error: e.message }, 500);
      }
    }

    // Show HTML Form
    return htmlResponse(ADMIN_SETUP_HTML);
  }

  // --- SUB-ROUTE: DASHBOARD ---
  if (url.pathname === '/admin/dashboard') {
    return htmlResponse("<h1>Admin Dashboard</h1><p>Welcome, Super Admin.</p>");
  }

  return new Response("Admin Route Not Found", { status: 404 });
}
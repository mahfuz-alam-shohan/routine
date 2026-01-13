import { htmlResponse, jsonResponse } from '../core/utils.js';
import { hashPassword } from '../core/auth.js';
import { ADMIN_SETUP_HTML } from '../ui/admin/setup.js';
import { ROLES } from '../config.js';
import { SCHEMA_SQL } from '../db_schema.js'; 

export async function handleAdminRequest(request, env) {
  const url = new URL(request.url);

  // --- SUB-ROUTE: SETUP (Create first admin) ---
  if (url.pathname === '/admin/setup') {
    
    // 1. SAFE DATABASE MIGRATION (The Fix)
    // We split the SQL by ";" and run commands one by one. 
    // This prevents the "undefined duration" crash.
    try {
      const statements = SCHEMA_SQL.split(';')
                          .map(s => s.trim()) // Remove spaces
                          .filter(s => s.length > 0); // Remove empty lines

      for (const statement of statements) {
        await env.DB.prepare(statement).run();
      }
      
    } catch (e) {
      // If table already exists, it might throw an error, which is fine.
      // We log it but don't crash the page.
      console.log("DB Init Note:", e.message);
    }

    // 2. Check if admin already exists
    const check = await env.DB.prepare("SELECT count(*) as count FROM auth_accounts WHERE role = ?").bind(ROLES.ADMIN).first();
    
    if (check && check.count > 0) {
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
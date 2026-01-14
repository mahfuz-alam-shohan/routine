import { htmlResponse, jsonResponse, getCookie } from '../core/utils.js';
import { InstituteLayout } from '../ui/institute/layout.js';
import { InstituteDashboardHTML } from '../ui/institute/dashboard.js';
import { TeachersPageHTML } from '../ui/institute/teachers.js'; 
import { ClassesPageHTML } from '../ui/institute/classes.js'; 
import { syncDatabase } from '../core/schema_manager.js';

export async function handleInstituteRequest(request, env) {
  const url = new URL(request.url);
  const email = getCookie(request, 'user_email');
  if (!email) return htmlResponse("<h1>Login Failed</h1>");

  const school = await env.DB.prepare(`SELECT p.* FROM profiles_institution p JOIN auth_accounts a ON p.auth_id = a.id WHERE a.email = ?`).bind(email).first();
  if(!school) return new Response("Error", {status: 404});

  // --- DASHBOARD ---
  if (url.pathname === '/school/dashboard') {
    const tCount = await env.DB.prepare("SELECT count(*) as count FROM profiles_teacher WHERE school_id = ?").bind(school.id).first();
    const cCount = await env.DB.prepare("SELECT count(*) as count FROM academic_classes WHERE school_id = ?").bind(school.id).first();
    return htmlResponse(InstituteLayout(InstituteDashboardHTML({teachers: tCount.count, classes: cCount.count}), "Dashboard", school.school_name));
  }

  // --- TEACHERS (UPDATED) ---
  if (url.pathname === '/school/teachers') {
      if (request.method === 'POST') {
          try {
            // 1. Check Limit
            const current = await env.DB.prepare("SELECT count(*) as count FROM profiles_teacher WHERE school_id = ?").bind(school.id).first();
            const limit = school.max_teachers || 10;
            if (current.count >= limit) return jsonResponse({ error: `Limit Reached! Max ${limit} teachers allowed.` }, 403);

            const body = await request.json();
            
            // 2. Validate Fields
            if(!body.full_name || !body.subject || !body.email || !body.phone_digits) {
                return jsonResponse({ error: "All fields are required" }, 400);
            }

            // 3. Format Phone (880-XXXXXXXXXX)
            const cleanPhone = body.phone_digits.replace(/\D/g, ''); // Ensure numbers only
            if (cleanPhone.length !== 10) return jsonResponse({ error: "Phone must be 10 digits" }, 400);
            const formattedPhone = `880-${cleanPhone}`;

            // 4. Save
            await env.DB.prepare("INSERT INTO profiles_teacher (school_id, full_name, subject, email, phone) VALUES (?, ?, ?, ?, ?)")
                .bind(school.id, body.full_name, body.subject, body.email, formattedPhone)
                .run();
            
            return jsonResponse({ success: true });
          } catch(e) {
             // Auto-fix DB column if missing
             if(e.message && e.message.includes("no such column")) {
                 await syncDatabase(env);
                 return jsonResponse({ error: "Database updated. Please try again." }, 500);
             }
             return jsonResponse({ error: e.message }, 500);
          }
      }

      // Load List
      try {
        const teachers = await env.DB.prepare("SELECT * FROM profiles_teacher WHERE school_id = ? ORDER BY id DESC").bind(school.id).all();
        return htmlResponse(InstituteLayout(TeachersPageHTML(teachers.results), "Teachers", school.school_name));
      } catch(e) {
        await syncDatabase(env); // Retry if table issue
        return htmlResponse(InstituteLayout(TeachersPageHTML([]), "Teachers", school.school_name));
      }
  }
  
  // --- CLASSES ---
  if (url.pathname === '/school/classes') {
      const classes = await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ?").bind(school.id).all();
      return htmlResponse(InstituteLayout(ClassesPageHTML(classes.results), "Classes", school.school_name));
  }

  return new Response("Not Found", {status:404});
}
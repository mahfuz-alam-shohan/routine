import { htmlResponse, getCookie } from '../core/utils.js'; // Import getCookie
import { InstituteLayout } from '../ui/institute/layout.js';
import { InstituteDashboardHTML } from '../ui/institute/dashboard.js';

export async function handleInstituteRequest(request, env) {
  const url = new URL(request.url);

  // 1. IDENTIFY THE SCHOOL
  // We read the email from the cookie we just saved in login
  const email = getCookie(request, 'user_email');
  let schoolName = "School Portal"; // Default fallback
  let stats = { teachers: 0, classes: 0 };

  if (email) {
      // Fetch the School Profile linked to this email
      const profile = await env.DB.prepare(`
          SELECT p.school_name 
          FROM profiles_institution p
          JOIN auth_accounts a ON p.auth_id = a.id
          WHERE a.email = ?
      `).bind(email).first();

      if (profile) {
          schoolName = profile.school_name;
      }
  }

  // --- SUB-ROUTE: DASHBOARD ---
  if (url.pathname === '/school/dashboard') {
    const content = InstituteDashboardHTML(stats);
    return htmlResponse(InstituteLayout(content, "Dashboard", schoolName));
  }

  // --- SUB-ROUTE: TEACHERS ---
  if (url.pathname === '/school/teachers') {
      return htmlResponse(InstituteLayout("<h1>Teachers Page (Coming Next)</h1>", "Teachers", schoolName));
  }

  // --- SUB-ROUTE: CLASSES ---
  if (url.pathname === '/school/classes') {
      return htmlResponse(InstituteLayout("<h1>Classes Page (Coming Next)</h1>", "Classes", schoolName));
  }

  return new Response("School Page Not Found", { status: 404 });
}
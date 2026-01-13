import { htmlResponse } from '../core/utils.js';
import { InstituteLayout } from '../ui/institute/layout.js';
import { InstituteDashboardHTML } from '../ui/institute/dashboard.js';

export async function handleInstituteRequest(request, env) {
  const url = new URL(request.url);

  // MOCK DATA (We will connect real DB later)
  let schoolName = "School Portal";
  let stats = { teachers: 0, classes: 0 };

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
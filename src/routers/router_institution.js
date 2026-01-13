import { htmlResponse, jsonResponse } from '../core/utils.js';
import { InstituteLayout } from '../ui/institute/layout.js';
import { InstituteDashboardHTML } from '../ui/institute/dashboard.js';

export async function handleInstituteRequest(request, env) {
  const url = new URL(request.url);

  // 1. GET USER INFO (Mock for now, normally from Cookie/Session)
  // In a real app, you parse the 'user_role' and 'email' from the cookie
  // For now, since we don't have a full session manager yet, we will look up the school 
  // based on the assumption they just logged in.
  
  // TODO: Replace this with real Session lookup later.
  // We need to fetch the School Profile for the logged-in user.
  // Since we haven't built the "Session to User ID" middleware yet, 
  // I will show you how to fetch it *safely* once we add that.
  
  // For this step, to prevent crashing, we will default to a "Demo School" view
  // or fetch the last created school if we are testing locally.
  
  let schoolName = "School Portal";
  let stats = { teachers: 0, classes: 0 };

  // --- SUB-ROUTE: DASHBOARD ---
  if (url.pathname === '/school/dashboard') {
    
    // FETCH DATA (Mocking the query for safety until Session is active)
    // const school = await env.DB.prepare("SELECT * FROM profiles_institution LIMIT 1").first();
    // if(school) schoolName = school.school_name;

    const content = InstituteDashboardHTML(stats);
    return htmlResponse(InstituteLayout(content, "Dashboard", schoolName));
  }

  // --- SUB-ROUTE: TEACHERS (Placeholder for next step) ---
  if (url.pathname === '/school/teachers') {
      return htmlResponse(InstituteLayout("<h1>Teachers Page (Coming Next)</h1>", "Teachers", schoolName));
  }

  // --- SUB-ROUTE: CLASSES (Placeholder for next step) ---
  if (url.pathname === '/school/classes') {
      return htmlResponse(InstituteLayout("<h1>Classes Page (Coming Next)</h1>", "Classes", schoolName));
  }

  return new Response("School Page Not Found", { status: 404 });
}
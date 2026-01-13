import { htmlResponse } from '../core/utils.js';
import { LANDING_PAGE_CONTENT } from '../ui/public/home.js';
import { PublicLayout } from '../ui/public/layout.js'; // Import the wrapper

export async function handlePublicRequest(request, env) {
  const url = new URL(request.url);

  if (url.pathname === '/') {
    // WRAP the content inside the Layout before sending
    const fullHtml = PublicLayout(LANDING_PAGE_CONTENT, "Home - RoutineAI");
    return htmlResponse(fullHtml);
  }
  
  if (url.pathname === '/login') {
     // You can create a login content variable later
     const loginContent = `<div class="p-20 text-center"><h1>Login Page Coming Soon</h1></div>`;
     return htmlResponse(PublicLayout(loginContent, "Login"));
  }

  return new Response("Page Not Found", { status: 404 });
}
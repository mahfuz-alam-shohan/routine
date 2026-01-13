import { htmlResponse } from '../core/utils.js';
import { LANDING_PAGE_HTML } from '../ui/public/home.js';

export async function handlePublicRequest(request, env) {
  const url = new URL(request.url);

  if (url.pathname === '/') {
    return htmlResponse(LANDING_PAGE_HTML);
  }
  
  if (url.pathname === '/login') {
     return htmlResponse("<h1>Global Login Page Coming Soon</h1>");
  }

  return new Response("Page Not Found", { status: 404 });
}
import { htmlResponse, jsonResponse } from '../core/utils.js';
import { PublicLayout } from '../ui/public/layout.js';
import { LOGIN_HTML } from '../ui/public/login.js';
import { verifyPassword } from '../core/auth.js';

export async function handlePublicRequest(request, env) {
  const url = new URL(request.url);

  // --- HOME PAGE ---
  if (url.pathname === '/') {
    const { LANDING_PAGE_CONTENT } = await import('../ui/public/home.js');
    return htmlResponse(PublicLayout(LANDING_PAGE_CONTENT, "RoutineAI - Home"));
  }
  
  // --- LOGIN PAGE ---
  if (url.pathname === '/login') {
    
    // POST: Handle Login
    if (request.method === 'POST') {
        try {
            const { email, password } = await request.json();

            // 1. Find User
            const user = await env.DB.prepare("SELECT * FROM auth_accounts WHERE email = ?").bind(email).first();
            
            if (!user) return jsonResponse({ error: "Invalid credentials" }, 401);

            // 2. Verify Password
            const isValid = await verifyPassword(password, user.password_hash, user.salt);
            if (!isValid) return jsonResponse({ error: "Invalid credentials" }, 401);

            // 3. Login Success (Set Cookies)
            const headers = new Headers();
            // CRITICAL: We need all 3 of these
            headers.append("Set-Cookie", `user_role=${user.role}; Path=/; HttpOnly; Secure; SameSite=Strict`);
            headers.append("Set-Cookie", `user_email=${user.email}; Path=/; HttpOnly; Secure; SameSite=Strict`); 
            headers.append("Set-Cookie", `auth_status=active; Path=/; HttpOnly; Secure; SameSite=Strict`);

            return new Response(JSON.stringify({ success: true, role: user.role }), {
                headers: { ...Object.fromEntries(headers), 'Content-Type': 'application/json' }
            });

        } catch (e) {
            return jsonResponse({ error: e.message }, 500);
        }
    }

    // GET: Show Form
    return htmlResponse(PublicLayout(LOGIN_HTML, "Login - RoutineAI"));
  }

  // --- LOGOUT ---
  if (url.pathname === '/logout') {
    const headers = new Headers();
    headers.append("Set-Cookie", "user_role=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
    headers.append("Set-Cookie", "user_email=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
    headers.append("Set-Cookie", "auth_status=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
    headers.append("Location", "/login"); 

    return new Response("Logging out...", { status: 302, headers: headers });
  }

  return new Response("Page Not Found", { status: 404 });
}
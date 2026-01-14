import { htmlResponse, jsonResponse, getCookie } from '../core/utils.js';
import { PublicLayout } from '../ui/public/layout.js';
import { LOGIN_HTML } from '../ui/public/login.js';
import { verifyPassword } from '../core/auth.js';

export async function handlePublicRequest(request, env) {
  const url = new URL(request.url);

  // --- HOME PAGE (AUTO-REDIRECT) ---
  if (url.pathname === '/') {
    const email = getCookie(request, 'user_email');
    const role = getCookie(request, 'user_role');

    if (email && role) {
        if (role === 'admin') return Response.redirect(url.origin + '/admin/dashboard', 302);
        if (role === 'institute') return Response.redirect(url.origin + '/school/dashboard', 302);
        if (role === 'teacher') return Response.redirect(url.origin + '/teacher/dashboard', 302);
    }

    const { LANDING_PAGE_CONTENT } = await import('../ui/public/home.js');
    return htmlResponse(PublicLayout(LANDING_PAGE_CONTENT, "RoutineAI - Home"));
  }
  
  // --- LOGIN PAGE ---
  if (url.pathname === '/login') {
    if (request.method === 'POST') {
        try {
            const { email, password } = await request.json();
            const user = await env.DB.prepare("SELECT * FROM auth_accounts WHERE email = ?").bind(email).first();
            if (!user) return jsonResponse({ error: "Account not found" }, 401);

            const isValid = await verifyPassword(password, user.password_hash, user.salt);
            if (!isValid) return jsonResponse({ error: "Wrong password" }, 401);

            const headers = new Headers();
            const safeRole = user.role || 'unknown'; 
            const isSecure = url.protocol === 'https:';
            const secureFlag = isSecure ? 'Secure;' : ''; 

            headers.set('Content-Type', 'application/json');
            // 'Lax' + Correct headers ensures cookie persistence
            headers.append("Set-Cookie", `user_role=${safeRole}; Path=/; HttpOnly; ${secureFlag} SameSite=Lax`);
            headers.append("Set-Cookie", `user_email=${user.email}; Path=/; HttpOnly; ${secureFlag} SameSite=Lax`); 
            headers.append("Set-Cookie", `auth_status=active; Path=/; HttpOnly; ${secureFlag} SameSite=Lax`);

            return new Response(JSON.stringify({ success: true, role: safeRole }), { headers: headers });

        } catch (e) { return jsonResponse({ error: e.message }, 500); }
    }
    return htmlResponse(PublicLayout(LOGIN_HTML, "Login"));
  }

  // --- LOGOUT ---
  if (url.pathname === '/logout') {
    const headers = new Headers();
    headers.append("Set-Cookie", "user_role=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax");
    headers.append("Set-Cookie", "user_email=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax");
    headers.append("Set-Cookie", "auth_status=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax");
    headers.append("Location", "/login"); 
    return new Response("Logging out...", { status: 302, headers: headers });
  }

  return new Response("Page Not Found", { status: 404 });
}
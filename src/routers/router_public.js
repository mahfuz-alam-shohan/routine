import { htmlResponse, jsonResponse, getCookie, getCompanyName } from '../core/utils.js';
import { PublicLayout } from '../ui/public/layout.js';
import { verifyPassword } from '../core/auth.js';

export async function handlePublicRequest(request, env) {
  const url = new URL(request.url);
  const companyName = await getCompanyName(env);

  // AUTH STATUS CHECK
  let email = getCookie(request, 'user_email');
  let role = getCookie(request, 'user_role');
  if (role) role = role.replace(/['"]+/g, '').trim(); 
  if (email) email = email.replace(/['"]+/g, '').trim();

  const isLoggedIn = !!(email && role);
  const currentUser = isLoggedIn ? { email, role } : null;

  // --- HOME PAGE ---
  if (url.pathname === '/') {
    const { HomeHTML } = await import('../ui/public/home.js');
    return htmlResponse(PublicLayout(HomeHTML(companyName), "Home", companyName, currentUser));
  }
  
  // --- LOGIN PAGE ---
  if (url.pathname === '/login') {
    
    // STRICT REDIRECT: If logged in, go to dashboard
    if (isLoggedIn) {
        if (role === 'admin') return Response.redirect(url.origin + '/admin/dashboard', 302);
        if (role === 'institute') return Response.redirect(url.origin + '/school/dashboard', 302);
        if (role === 'teacher') return Response.redirect(url.origin + '/teacher/dashboard', 302);
        return Response.redirect(url.origin + '/', 302);
    }

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
            // 7-Day Persistence
            const cookieSettings = `Path=/; HttpOnly; ${secureFlag} SameSite=Lax; Max-Age=604800`;

            headers.set('Content-Type', 'application/json');
            headers.append("Set-Cookie", `user_role=${safeRole}; ${cookieSettings}`);
            headers.append("Set-Cookie", `user_email=${user.email}; ${cookieSettings}`); 
            headers.append("Set-Cookie", `auth_status=active; ${cookieSettings}`);

            return new Response(JSON.stringify({ success: true, role: safeRole }), { headers });

        } catch (e) { return jsonResponse({ error: e.message }, 500); }
    }

    const { LOGIN_HTML } = await import('../ui/public/login.js');
    return htmlResponse(PublicLayout(LOGIN_HTML(companyName), "Sign In", companyName, null));
  }

  // --- LOGOUT ---
  if (url.pathname === '/logout') {
    const headers = new Headers();
    headers.append("Set-Cookie", "user_role=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax");
    headers.append("Set-Cookie", "user_email=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax");
    headers.append("Set-Cookie", "auth_status=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax");
    headers.append("Location", "/login"); 
    return new Response("Logging out...", { status: 302, headers: headers });
  }

  return new Response("Page Not Found", { status: 404 });
}

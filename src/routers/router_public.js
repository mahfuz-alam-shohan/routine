import { htmlResponse, jsonResponse } from '../core/utils.js';
import { PublicLayout } from '../ui/public/layout.js';
import { LOGIN_HTML } from '../ui/public/login.js'; // Import the new UI
import { verifyPassword } from '../core/auth.js';     // Import the new Verify Logic

export async function handlePublicRequest(request, env) {
  const url = new URL(request.url);

  // --- HOME PAGE ---
  if (url.pathname === '/') {
    // Import content dynamically to keep this file clean
    const { LANDING_PAGE_CONTENT } = await import('../ui/public/home.js');
    return htmlResponse(PublicLayout(LANDING_PAGE_CONTENT, "RoutineAI - Home"));
  }
  
  // --- LOGIN PAGE ---
  if (url.pathname === '/login') {
    
    // A. Handle POST (The actual login attempt)
    if (request.method === 'POST') {
        try {
            const { email, password } = await request.json();

            // 1. Find User
            const user = await env.DB.prepare("SELECT * FROM auth_accounts WHERE email = ?").bind(email).first();
            
            if (!user) {
                return jsonResponse({ error: "Invalid credentials" }, 401);
            }

            // 2. Verify Password
            const isValid = await verifyPassword(password, user.password_hash, user.salt);
            if (!isValid) {
                return jsonResponse({ error: "Invalid credentials" }, 401);
            }

            // 3. Login Success! (Create a simple cookie for now)
            // In a pro app, you'd store a session ID in DB. For now, we set a "role" cookie.
            const headers = new Headers();
            headers.append("Set-Cookie", `user_role=${user.role}; Path=/; HttpOnly; Secure; SameSite=Strict`);
            // Add a simple "auth" cookie to prove they are logged in
            headers.append("Set-Cookie", `auth_status=active; Path=/; HttpOnly; Secure; SameSite=Strict`);

            return new Response(JSON.stringify({ success: true, role: user.role }), {
                headers: { ...Object.fromEntries(headers), 'Content-Type': 'application/json' }
            });

        } catch (e) {
            return jsonResponse({ error: e.message }, 500);
        }
    }

    // B. Handle GET (Show the form)
    return htmlResponse(PublicLayout(LOGIN_HTML, "Login - RoutineAI"));
  }

  return new Response("Page Not Found", { status: 404 });
}
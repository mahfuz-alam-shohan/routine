import { htmlResponse, jsonResponse, getCookie, getCompanyName } from '../core/utils.js';
import { PublicLayout } from '../ui/public/layout.js';
import { verifyPassword } from '../core/auth.js';

export async function handlePublicRequest(request, env) {
  const url = new URL(request.url);
  const companyName = await getCompanyName(env);

  
  let email = getCookie(request, 'user_email');
  let role = getCookie(request, 'user_role');
  if (role) role = role.replace(/['"]+/g, '').trim(); 
  if (email) email = email.replace(/['"]+/g, '').trim();

  const isLoggedIn = !!(email && role);
  const currentUser = isLoggedIn ? { email, role } : null;

  if (url.pathname === '/') {
    if (isLoggedIn) {
        if (role === 'admin') return Response.redirect(url.origin + '/admin/dashboard', 302);
        if (role === 'institute') return Response.redirect(url.origin + '/school/dashboard', 302);
        if (role === 'teacher') return Response.redirect(url.origin + '/teacher/dashboard', 302);
    }
    let schools = [];
    let plans = [];
    let features = [];
    try {
        const schoolRows = await env.DB.prepare("SELECT school_name FROM profiles_institution ORDER BY school_name ASC").all();
        schools = schoolRows.results || [];
    } catch (e) {}

    try {
        const planRows = await env.DB.prepare("SELECT * FROM pricing_plans WHERE is_published = 1 ORDER BY price_taka ASC").all();
        plans = planRows.results || [];
        const planIds = plans.map(p => p.id).filter(Boolean);
        if (planIds.length) {
            const placeholders = planIds.map(() => '?').join(',');
            const featureRows = await env.DB.prepare(`SELECT * FROM pricing_features WHERE plan_id IN (${placeholders}) ORDER BY id ASC`).bind(...planIds).all();
            features = featureRows.results || [];
        }
    } catch (e) {}

    const { HomeHTML } = await import('../ui/public/home.js');
    return htmlResponse(PublicLayout(HomeHTML(companyName, { schools, plans, features }), "Home", companyName, currentUser));
  }
  
  if (url.pathname === '/login') {
    
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

  if (url.pathname === '/order') {
    if (request.method === 'POST') {
        try {
            const body = await request.json();
            const planId = Number(body.plan_id);
            const name = (body.name || '').toString().trim();
            const emailInput = (body.email || '').toString().trim();
            const phone = (body.phone || '').toString().trim();
            const institution = (body.institution_name || '').toString().trim();

            if (!planId) return jsonResponse({ error: "Plan is required" }, 400);
            if (!name || !emailInput || !phone || !institution) {
                return jsonResponse({ error: "All fields are required" }, 400);
            }
            if (!/^\d+$/.test(phone)) {
                return jsonResponse({ error: "Phone number must contain digits only." }, 400);
            }

            const plan = await env.DB.prepare("SELECT * FROM pricing_plans WHERE id = ? AND is_published = 1").bind(planId).first();
            if (!plan) return jsonResponse({ error: "Pricing plan not found" }, 404);

            await env.DB.prepare(`
                INSERT INTO pricing_orders (plan_id, plan_name, billing_cycle, price_taka, requester_name, requester_email, requester_phone, institution_name)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(plan.id, plan.name, plan.billing_cycle, plan.price_taka, name, emailInput, phone, institution).run();

            return jsonResponse({ success: true });
        } catch (e) {
            return jsonResponse({ error: e.message }, 500);
        }
    }

    const planId = url.searchParams.get('plan');
    let plan = null;
    if (planId) {
        try {
            plan = await env.DB.prepare("SELECT * FROM pricing_plans WHERE id = ? AND is_published = 1").bind(planId).first();
        } catch (e) {}
    }
    const { OrderPageHTML } = await import('../ui/public/order.js');
    return htmlResponse(PublicLayout(OrderPageHTML(companyName, plan), "Order", companyName, currentUser));
  }

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



export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function htmlResponse(html) {
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}


export async function getCompanyName(env) {
  try {
    const result = await env.DB.prepare("SELECT value FROM system_settings WHERE key = 'site_name'").first();
    return result ? result.value : 'RoutineAI SaaS'; 
  } catch (e) {
    return 'RoutineAI SaaS';
  }
}




export function getCookie(request, name) {
  const cookieString = request.headers.get('Cookie');
  if (!cookieString) return null;
  
  const cookies = cookieString.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return value;
  }
  return null;
}

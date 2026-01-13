// Append this to the bottom of src/core/utils.js

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

// NEW: Helper to get the Company Name (SaaS Provider Name)
export async function getCompanyName(env) {
  try {
    const result = await env.DB.prepare("SELECT value FROM system_settings WHERE key = 'site_name'").first();
    return result ? result.value : 'RoutineAI SaaS'; // Default Name
  } catch (e) {
    return 'RoutineAI SaaS';
  }
}
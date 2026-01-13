import { SCHEMA_SQL } from './db_schema.js';
import { handlePublicRequest } from './routers/router_public.js';
import { handleAdminRequest } from './routers/router_admin.js';
// import { handleInstituteRequest } from './routers/router_institute.js';  <-- Temporarily disabled
// import { handleTeacherRequest } from './routers/router_teacher.js';      <-- Temporarily disabled

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // --- 1. HEALTH CHECK & DB INIT ---
    try {
      await env.DB.exec(SCHEMA_SQL);
    } catch (e) {
      return new Response("Database Error: " + e.message, { status: 500 });
    }

    // --- 2. ROUTING LOGIC ---

    // A. Admin Area
    if (path.startsWith('/admin')) {
      return await handleAdminRequest(request, env);
    }

    // B. Institute Area (Disabled for now)
    // if (path.startsWith('/school')) {
    //   return await handleInstituteRequest(request, env);
    // }

    // C. Teacher Area (Disabled for now)
    // if (path.startsWith('/teacher')) {
    //   return await handleTeacherRequest(request, env);
    // }

    // D. Public Area
    return await handlePublicRequest(request, env);
  }
};
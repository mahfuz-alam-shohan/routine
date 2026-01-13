import { SCHEMA_SQL } from './db_schema.js';
import { handlePublicRequest } from './routers/router_public.js';
import { handleAdminRequest } from './routers/router_admin.js';
import { handleInstituteRequest } from './routers/router_institute.js';
import { handleTeacherRequest } from './routers/router_teacher.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // --- 1. HEALTH CHECK & DB INIT ---
    // In production, move this to a migration script. For now, it ensures tables exist.
    try {
      await env.DB.exec(SCHEMA_SQL);
    } catch (e) {
      return new Response("Database Error: " + e.message, { status: 500 });
    }

    // --- 2. ROUTING LOGIC ---

    // A. Admin Area (/admin/...)
    if (path.startsWith('/admin')) {
      return await handleAdminRequest(request, env);
    }

    // B. Institute Area (/school/...)
    if (path.startsWith('/school')) {
      return await handleInstituteRequest(request, env);
    }

    // C. Teacher Area (/teacher/...)
    if (path.startsWith('/teacher')) {
      return await handleTeacherRequest(request, env);
    }

    // D. Public Area (Everything else)
    return await handlePublicRequest(request, env);
  }
};
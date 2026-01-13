import { SCHEMA_SQL } from './db_schema.js';
import { handlePublicRequest } from './routers/router_public.js';
import { handleAdminRequest } from './routers/router_admin.js';
import { handleInstituteRequest } from './routers/router_institute.js'; // <--- ENABLED
import { handleTeacherRequest } from './routers/router_teacher.js';     // <--- ENABLED

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // --- ROUTING LOGIC ---

    // A. Admin Area
    if (path.startsWith('/admin')) {
      return await handleAdminRequest(request, env);
    }

    // B. Institute Area (This was disabled!)
    if (path.startsWith('/school')) {
      return await handleInstituteRequest(request, env);
    }

    // C. Teacher Area (Placeholder)
    if (path.startsWith('/teacher')) {
      return await handleTeacherRequest(request, env);
    }

    // D. Public Area (Login, Home)
    return await handlePublicRequest(request, env);
  }
};
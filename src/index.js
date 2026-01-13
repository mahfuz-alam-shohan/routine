import { SCHEMA_SQL } from './db_schema.js';
import { handlePublicRequest } from './routers/router_public.js';
import { handleAdminRequest } from './routers/router_admin.js';
// import { handleInstituteRequest } from './routers/router_institute.js'; 
// import { handleTeacherRequest } from './routers/router_teacher.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // --- REMOVED THE DATABASE EXECUTION FROM HERE ---
    // The landing page should load fast without checking the DB.

    // --- ROUTING LOGIC ---

    // A. Admin Area
    if (path.startsWith('/admin')) {
      return await handleAdminRequest(request, env);
    }

    // D. Public Area
    return await handlePublicRequest(request, env);
  }
};
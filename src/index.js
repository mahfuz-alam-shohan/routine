import { handlePublicRequest } from './routers/router_public.js';
import { handleAdminRequest } from './routers/router_admin.js';
import { handleInstituteRequest } from './routers/router_institute.js'; 
import { handleTeacherRequest } from './routers/router_teacher.js';     
import { syncDatabase } from './core/schema_manager.js';

let schemaSyncPromise = null;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (!schemaSyncPromise) {
      schemaSyncPromise = syncDatabase(env).catch((error) => {
        console.error('Database sync failed', error);
        schemaSyncPromise = null;
      });
    }
    if (schemaSyncPromise) {
      await schemaSyncPromise;
    }

    

    
    if (path.startsWith('/admin')) {
      return await handleAdminRequest(request, env);
    }

    
    if (path.startsWith('/school')) {
      return await handleInstituteRequest(request, env);
    }

    
    if (path.startsWith('/teacher')) {
      return await handleTeacherRequest(request, env);
    }

    
    return await handlePublicRequest(request, env);
  }
};


export function AdminLayout(contentHTML, title = "Dashboard", companyName = "RoutineAI", user = {email: 'A'}) {
  const initial = (user.email || 'A').charAt(0).toUpperCase();

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
      <title>${title} - ${companyName}</title>
      <script>
          window.TAILWIND_DISABLE_PRODUCTION_WARNING = true;
          window.TAILWIND_DISABLE_WARNINGS = true;
      </script>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
      <style>
        :root {
          color-scheme: light;
          --ui-bg: #f8fafc;
          --ui-line: #cbd5e1;
          --ui-line-soft: #e2e8f0;
          --ui-ink: #0f172a;
          --ui-muted: #64748b;
          --ui-accent: #1d4ed8;
          --ui-accent-soft: #2563eb;
          --ui-accent-light: #eff6ff;
          --ui-header: #f1f5f9;
        }
        body { 
          font-family: 'Inter', sans-serif; 
          -webkit-tap-highlight-color: transparent;
          padding-top: env(safe-area-inset-top);
          touch-action: manipulation;
          background: var(--ui-bg);
          color: var(--ui-ink);
        }
        html {
          -webkit-text-size-adjust: 100%;
        }
        .sidebar-transition { transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .admin-nav-link {
          border-left: 2px solid transparent;
          border-radius: 0;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .admin-nav-link:hover {
          background: var(--ui-accent-light);
          color: var(--ui-ink);
          border-left-color: var(--ui-line);
        }
        .admin-nav-link.text-gray-900 {
          background: var(--ui-accent-light);
          border-left-color: var(--ui-accent);
        }
        @media (max-width: 768px) {
          .mobile-header {
            padding-top: env(safe-area-inset-top);
            background: white;
            position: sticky;
            top: 0;
            z-index: 40;
          }
          .mobile-content {
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
        input, select, textarea {
          font-size: 16px !important;
        }
        * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        input, textarea {
          -webkit-user-select: text;
          -moz-user-select: text;
          -ms-user-select: text;
          user-select: text;
        }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid var(--ui-line); padding: 6px 8px; vertical-align: top; }
        thead th { background: var(--ui-header); font-size: 11px; text-transform: uppercase; color: var(--ui-muted); }
        tbody tr:nth-child(even) { background: #f8fafc; }
        tbody tr:hover { background: #eef2ff; }
        .page-shell {
          animation: pageFadeIn 220ms ease-out both;
        }
        .page-leave .page-shell {
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 160ms ease, transform 160ms ease;
        }
        @keyframes pageFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        button,
        .ui-button {
          transition: transform 120ms ease, background-color 120ms ease, color 120ms ease, border-color 120ms ease;
          will-change: transform;
        }
        button:active,
        .ui-button:active {
          transform: translateY(1px);
        }
        button:disabled,
        .ui-button:disabled {
          transform: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .page-shell { animation: none; }
          .page-leave .page-shell { transition: none; }
          button,
          .ui-button { transition: none; }
        }
        @media (max-width: 640px) {
          .page-shell .mx-3,
          .page-shell .mx-4 {
            margin-left: 8px !important;
            margin-right: 8px !important;
          }
          .page-shell .px-3,
          .page-shell .px-4 {
            padding-left: 8px !important;
            padding-right: 8px !important;
          }
          .page-shell .p-4 {
            padding: 12px !important;
          }
          .page-shell .p-3 {
            padding: 8px !important;
          }
        }
      </style>
  </head>
  <body class="bg-slate-50 h-[100dvh] overflow-hidden flex flex-col text-gray-900 relative">

      <header class="md:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 z-30 shrink-0">
          <div class="flex items-center gap-3">
              <button onclick="toggleSidebar()" class="text-gray-500 hover:text-gray-900 p-2 -ml-2">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
              <span class="text-sm font-bold text-gray-800 truncate max-w-[150px]">${companyName}</span>
          </div>
          <a href="/admin/settings" class="w-8 h-8 border border-gray-300 text-gray-700 flex items-center justify-center text-xs font-bold">
              ${initial}
          </a>
      </header>

      <div class="flex flex-1 overflow-hidden relative">
          
          <div id="sidebar-overlay" onclick="toggleSidebar()" class="fixed inset-0 bg-black/20 z-40 hidden md:hidden transition-opacity"></div>

          <aside id="sidebar" class="sidebar-transition fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-40 transform -translate-x-full md:relative md:translate-x-0 flex flex-col h-full">
              
              <div class="h-16 hidden md:flex items-center border-b border-gray-100 px-6 shrink-0">
                  <span class="text-sm font-bold text-gray-900 tracking-wide uppercase">${companyName}</span>
              </div>

              <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-1 no-scrollbar">
                  
                  <div class="px-3 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Overview</div>
                  <a href="/admin/dashboard" class="admin-nav-link flex items-center px-3 py-2 text-[13px] font-medium text-gray-600 transition-colors">
                      <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                      Dashboard
                  </a>

                  <div class="px-3 mt-6 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Management</div>
                  <a href="/admin/schools" class="admin-nav-link flex items-center px-3 py-2 text-[13px] font-medium text-gray-600 transition-colors">
                      <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                      Schools & Clients
                  </a>
                  <a href="/admin/policy-management" class="admin-nav-link flex items-center px-3 py-2 text-[13px] font-medium text-gray-600 transition-colors">
                      <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m-7 4h8a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      Policy Management
                  </a>
                  <a href="/admin/orders" class="admin-nav-link flex items-center px-3 py-2 text-[13px] font-medium text-gray-600 transition-colors">
                      <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18M3 17h18"></path></svg>
                      Orders
                  </a>

                  <div class="px-3 mt-6 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account</div>
                  <a href="/admin/settings" class="admin-nav-link flex items-center px-3 py-2 text-[13px] font-medium text-gray-600 transition-colors">
                      <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      Admin Settings
                  </a>
                  
              </nav>

              <div class="p-4 border-t border-gray-100 shrink-0">
                  <a href="/logout" data-no-prefetch class="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-red-600 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                      Sign Out
                  </a>
              </div>
          </aside>

          <div class="flex-1 flex flex-col min-w-0 bg-white">
              <main class="page-shell flex-1 overflow-y-auto px-0 pt-4 pb-20 sm:px-4 md:px-8 relative z-10">
                  ${contentHTML}
              </main>
          </div>
      </div>

      <script>
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            const isClosed = sidebar.classList.contains('-translate-x-full');
            if (isClosed) { sidebar.classList.remove('-translate-x-full'); overlay.classList.remove('hidden'); }
            else { sidebar.classList.add('-translate-x-full'); overlay.classList.add('hidden'); }
        }

        function setActiveNav() {
            const currentPath = window.location.pathname;
            const links = document.querySelectorAll('.admin-nav-link');
            links.forEach(link => {
                link.classList.remove('text-gray-900');
                link.classList.add('text-gray-600');
                if (currentPath === link.getAttribute('href')) {
                    link.classList.remove('text-gray-600');
                    link.classList.add('text-gray-900');
                }
            });
        }

        function setupPrefetch() {
            const prefetched = new Set();
            const shouldPrefetch = (link) => {
                if (!link || !link.href) return false;
                if (link.hasAttribute('data-no-prefetch')) return false;
                if (link.target && link.target !== '_self') return false;
                const url = new URL(link.href, window.location.origin);
                if (url.origin !== window.location.origin) return false;
                if (url.pathname === '/logout') return false;
                if (url.pathname === window.location.pathname && url.search === window.location.search) return false;
                return true;
            };
            const prefetch = (href) => {
                if (!href || prefetched.has(href)) return;
                prefetched.add(href);
                fetch(href, { credentials: 'include', cache: 'force-cache' }).catch(() => {});
            };
            document.addEventListener('pointerover', (event) => {
                const link = event.target.closest('a');
                if (!shouldPrefetch(link)) return;
                prefetch(link.href);
            });
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                    document.querySelectorAll('a.admin-nav-link').forEach(link => {
                        if (shouldPrefetch(link)) prefetch(link.href);
                    });
            }, { timeout: 1500 });
            }
        }

        function enablePageTransitions() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            document.addEventListener('click', (event) => {
                const link = event.target.closest('a');
                if (!link) return;
                if (link.hasAttribute('data-no-transition') || link.hasAttribute('data-no-prefetch')) return;
                if (link.target && link.target !== '_self') return;
                if (link.hasAttribute('download')) return;
                const href = link.getAttribute('href') || '';
                if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
                const url = new URL(link.href, window.location.href);
                if (url.origin !== window.location.origin) return;
                event.preventDefault();
                document.body.classList.add('page-leave');
                setTimeout(() => { window.location.href = link.href; }, 160);
            });
        }

        window.addEventListener('DOMContentLoaded', () => {
            setActiveNav();
            setupPrefetch();
            enablePageTransitions();
        });
      </script>
  </body>
  </html>
  `;
}

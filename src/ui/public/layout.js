// src/ui/public/layout.js

export function PublicLayout(contentHTML, title = "Home", companyName = "RoutineAI", user = null) {
  
  // ROBUST LINK LOGIC
  let dashboardLink = '/login'; // Default
  if (user && user.role) {
      const r = user.role.toLowerCase(); // Handle 'Institute' vs 'institute'
      if (r === 'admin') dashboardLink = '/admin/dashboard';
      else if (r === 'institute') dashboardLink = '/school/dashboard';
      else if (r === 'teacher') dashboardLink = '/teacher/dashboard';
  }

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <title>${title} - ${companyName}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Inter', sans-serif; -webkit-tap-highlight-color: transparent; }
        .smooth-scroll { -webkit-overflow-scrolling: touch; }
        .page-shell { animation: pageFadeIn 320ms ease-out both; }
        .page-leave .page-shell { opacity: 0; transform: translateY(6px); transition: opacity 180ms ease, transform 180ms ease; }
        .ui-glow::before {
          content: "";
          position: fixed;
          inset: -10% -10% auto -10%;
          height: 40vh;
          background:
            radial-gradient(circle at top left, rgba(59, 130, 246, 0.18), transparent 55%),
            radial-gradient(circle at top right, rgba(168, 85, 247, 0.16), transparent 55%),
            radial-gradient(circle at 40% 10%, rgba(16, 185, 129, 0.12), transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        @keyframes pageFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .page-shell { animation: none; }
          .page-leave .page-shell { transition: none; }
        }
      </style>
  </head>
  <body class="ui-glow bg-slate-50 text-gray-900 flex flex-col min-h-screen relative overflow-x-hidden">

      <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all">
          <div class="h-0.5 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400"></div>
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="flex justify-between items-center h-16">
                  
                  <div class="flex items-center">
                      <a href="/" class="text-xl font-bold text-gray-900 tracking-tight hover:opacity-80 transition-opacity">
                          ${companyName}
                      </a>
                  </div>

                  <div class="flex items-center gap-6">
                      
                      ${user ? `
                        <div class="flex items-center gap-3">
                            <a href="${dashboardLink}" class="group flex items-center gap-3 hover:opacity-80 transition-opacity">
                                <span class="hidden md:block text-sm font-medium text-gray-700 group-hover:text-blue-600">
                                    My Dashboard
                                </span>
                                <div class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
                                    ${user.email.charAt(0).toUpperCase()}
                                </div>
                            </a>
                        </div>
                      ` : `
                        <div class="flex items-center gap-4">
                            <a href="/login" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Log in</a>
                            <a href="/login" class="hidden sm:inline-flex items-center justify-center px-5 py-2 text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-black transition-all shadow-sm">
                                Get Started
                            </a>
                        </div>
                      `}
                      
                  </div>
              </div>
          </div>
      </nav>

      <main class="page-shell flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 smooth-scroll relative z-10">
          ${contentHTML}
      </main>

      <footer class="bg-gray-50 border-t border-gray-200 mt-auto">
          <div class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <p class="text-sm text-gray-500">© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
              <div class="flex gap-6 text-sm text-gray-500">
                  <a href="#" class="hover:text-gray-900 transition-colors">Privacy Policy</a>
                  <a href="#" class="hover:text-gray-900 transition-colors">Terms of Service</a>
                  <a href="#" class="hover:text-gray-900 transition-colors">Contact Support</a>
              </div>
          </div>
      </footer>

      <script>
        const enablePageTransitions = () => {
          if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
          document.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
            const href = link.getAttribute('href') || '';
            if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
            const url = new URL(link.href, window.location.href);
            if (url.origin !== window.location.origin) return;
            event.preventDefault();
            document.body.classList.add('page-leave');
            setTimeout(() => { window.location.href = link.href; }, 180);
          });
        };

        const enableAutoRefresh = () => {
          let lastInteraction = Date.now();
          const mark = () => { lastInteraction = Date.now(); };
          ['click', 'keydown', 'scroll', 'mousemove', 'touchstart'].forEach((evt) => {
            document.addEventListener(evt, mark, { passive: true });
          });
          const intervalMs = 120000;
          setInterval(() => {
            if (document.hidden) return;
            const active = document.activeElement;
            if (active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName)) return;
            if (Date.now() - lastInteraction < intervalMs) return;
            window.location.reload();
          }, intervalMs);
        };

        window.addEventListener('DOMContentLoaded', () => {
          enablePageTransitions();
          enableAutoRefresh();
        });
      </script>
  </body>
  </html>
  `;
}

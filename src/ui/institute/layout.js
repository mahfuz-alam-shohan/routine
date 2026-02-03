export function InstituteLayout(content, title, schoolName) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>${title} - ${schoolName}</title>
        <script>
            // Suppress production warning - must be set before Tailwind loads
            window.TAILWIND_DISABLE_PRODUCTION_WARNING = true;
        </script>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
            :root {
                color-scheme: light;
            }
            .nav-link {
                border-left: 2px solid transparent;
                border-radius: 0;
                transition: color 0.15s ease, border-color 0.15s ease;
                border-bottom: 1px solid #f1f5f9;
            }
            .nav-link:hover {
                background: transparent;
                color: #111827;
                border-left-color: #e5e7eb;
            }
            .nav-link.nav-active {
                color: #0f172a;
                border-left-color: #0f172a;
                font-weight: 600;
                background: transparent;
            }
        </style>
    </head>
    <body class="bg-gray-50 text-gray-800 antialiased h-screen flex flex-col md:flex-row overflow-hidden relative">

        <header class="md:hidden min-h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3 z-30 flex-shrink-0 relative">
            <div class="flex items-center gap-3">
                <button onclick="toggleSidebar()" class="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
                <span class="font-bold text-gray-900 whitespace-normal break-words leading-tight">${schoolName}</span>
            </div>
        </header>

        <div id="sidebar-backdrop" onclick="toggleSidebar()" class="fixed inset-0 bg-gray-900/50 z-40 hidden transition-opacity opacity-0"></div>

        <aside id="sidebar" class="fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform -translate-x-full md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col md:shadow-none">
            <div class="min-h-14 flex items-center px-4 py-3 border-b border-gray-200 flex-shrink-0 justify-between">
                <div class="flex items-center">
                    <span class="font-bold text-gray-900 text-sm whitespace-normal break-words leading-tight">${schoolName}</span>
                </div>
                <button onclick="toggleSidebar()" class="md:hidden p-1 text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <nav class="flex-1 overflow-y-auto py-3 space-y-0 px-3">
                <a href="/school/dashboard" class="nav-link flex items-center px-3 py-2 text-gray-600 text-sm font-medium" data-page="dashboard">Dashboard</a>
                <div class="pt-4 pb-2 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Academic</div>
                <a href="/school/schedules" class="nav-link flex items-center px-3 py-2 text-gray-600 text-sm font-medium" data-page="schedules">Master Schedule</a>
                <a href="/school/routine-generator" class="nav-link flex items-center px-3 py-2 text-gray-600 text-sm font-medium" data-page="routine-generator">Routine Generator</a>
                <a href="/school/teachers" class="nav-link flex items-center px-3 py-2 text-gray-600 text-sm font-medium" data-page="teachers">Teachers</a>
                <a href="/school/subjects" class="nav-link flex items-center px-3 py-2 text-gray-600 text-sm font-medium" data-page="subjects">Subjects</a>
                <a href="/school/classes" class="nav-link flex items-center px-3 py-2 text-gray-600 text-sm font-medium" data-page="classes">Classes</a>
                <div class="mt-auto pt-4 border-t">
                    <a href="/logout" class="flex items-center px-3 py-2 text-red-600 text-sm font-medium">Sign Out</a>
                </div>
            </nav>
        </aside>

        <main class="page-shell flex-1 flex flex-col min-w-0 bg-gray-50 overflow-hidden relative z-10">
            <div class="flex-1 overflow-auto p-4 pb-20 md:pb-6">
                ${content}
            </div>
        </main>

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

            function toggleSidebar() {
                const sb = document.getElementById('sidebar');
                const bd = document.getElementById('sidebar-backdrop');
                const isClosed = sb.classList.contains('-translate-x-full');
                if (isClosed) {
                    sb.classList.remove('-translate-x-full');
                    bd.classList.remove('hidden');
                    setTimeout(() => bd.classList.remove('opacity-0'), 10);
                } else {
                    sb.classList.add('-translate-x-full');
                    bd.classList.add('opacity-0');
                    setTimeout(() => bd.classList.add('hidden'), 200);
                }
            }

            function setActiveNav() {
                const currentPath = window.location.pathname;
                const navLinks = document.querySelectorAll('.nav-link');
                
                navLinks.forEach(link => {
                    const page = link.getAttribute('data-page');
                    link.classList.remove('nav-active');
                    link.classList.add('text-gray-600');
                    
                    if (currentPath.includes(\`/school/\${page}\`)) {
                        link.classList.remove('text-gray-600');
                        link.classList.add('nav-active');
                    }
                });
            }

            window.addEventListener('DOMContentLoaded', () => {
                enablePageTransitions();
                enableAutoRefresh();
                setActiveNav();
            });
        </script>
    </body>
    </html>
    `;
}

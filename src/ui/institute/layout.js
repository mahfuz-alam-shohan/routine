export function InstituteLayout(content, title, schoolName) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>${title} - ${schoolName}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
            body { font-family: 'Inter', sans-serif; font-size: 0.875rem; } 
            
            /* Hide Scrollbar for Chrome/Safari/Opera */
            .no-scrollbar::-webkit-scrollbar { display: none; }
            /* Hide Scrollbar for IE, Edge and Firefox */
            .no-scrollbar { -ms-overflow-style: none;  scrollbar-width: none; }

            /* Professional custom scrollbar for main content */
            ::-webkit-scrollbar { width: 6px; height: 6px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
            ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

            /* Prevent iOS Zoom on inputs */
            @media screen and (max-width: 768px) {
                input, select, textarea { font-size: 16px !important; }
            }

            .page-shell { animation: pageFadeIn 320ms ease-out both; }
            .page-leave .page-shell { opacity: 0; transform: translateY(6px); transition: opacity 180ms ease, transform 180ms ease; }
            .ui-glow::before {
                content: "";
                position: fixed;
                inset: -10% -10% auto -10%;
                height: 40vh;
                background:
                  radial-gradient(circle at top left, rgba(59, 130, 246, 0.14), transparent 55%),
                  radial-gradient(circle at top right, rgba(168, 85, 247, 0.14), transparent 55%),
                  radial-gradient(circle at 40% 10%, rgba(16, 185, 129, 0.1), transparent 50%);
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
    <body class="ui-glow bg-gray-50 text-gray-800 antialiased h-screen flex flex-col md:flex-row overflow-hidden relative">

        <header class="md:hidden h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-30 flex-shrink-0 relative">
            <div class="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400"></div>
            <div class="flex items-center gap-3">
                <button onclick="toggleSidebar()" class="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
                <span class="font-bold text-gray-900 truncate max-w-[200px]">${schoolName}</span>
            </div>
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                ${schoolName.charAt(0)}
            </div>
        </header>

        <div id="sidebar-backdrop" onclick="toggleSidebar()" class="fixed inset-0 bg-gray-900/50 z-40 hidden transition-opacity opacity-0"></div>

        <aside id="sidebar" class="fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform -translate-x-full md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col shadow-2xl md:shadow-none">
            <div class="h-14 flex items-center px-4 border-b border-gray-200 flex-shrink-0 justify-between">
                <div class="flex items-center">
                    <div class="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs mr-2">S</div>
                    <span class="font-bold text-gray-900 truncate text-sm max-w-[150px]">${schoolName}</span>
                </div>
                <button onclick="toggleSidebar()" class="md:hidden p-1 text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <nav class="flex-1 overflow-y-auto py-3 space-y-1 px-3">
                <a href="/school/dashboard" class="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium">Dashboard</a>
                <div class="pt-4 pb-2 px-3 text-xs font-bold text-gray-400 uppercase">Academic</div>
                <a href="/school/schedules" class="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium">Master Schedule</a>
                <a href="/school/teachers" class="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium">Teachers</a>
                <a href="/school/subjects" class="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium">Subjects</a>
                <a href="/school/classes" class="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium">Classes</a>
                <div class="mt-auto pt-4 border-t">
                    <a href="/logout" class="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium">Sign Out</a>
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

            window.addEventListener('DOMContentLoaded', () => {
                enablePageTransitions();
                enableAutoRefresh();
            });
        </script>
    </body>
    </html>
    `;
}

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
            window.TAILWIND_DISABLE_WARNINGS = true;
        </script>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
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
                --ui-danger: #dc2626;
                --ui-header: #f1f5f9;
            }
            html {
                -webkit-text-size-adjust: 100%;
            }
            body {
                background: var(--ui-bg);
                color: var(--ui-ink);
                font-family: 'Inter', sans-serif;
                touch-action: manipulation;
            }
            .nav-link {
                border-left: 2px solid transparent;
                border-radius: 0;
                transition: color 0.15s ease, border-color 0.15s ease;
                border-bottom: 1px solid var(--ui-line-soft);
            }
            .nav-link:hover {
                background: var(--ui-accent-light);
                color: var(--ui-ink);
                border-left-color: var(--ui-line);
            }
            .nav-link.nav-active {
                color: var(--ui-ink);
                border-left-color: var(--ui-accent);
                font-weight: 600;
                background: var(--ui-accent-light);
            }
            table {
                border-collapse: collapse;
                width: 100%;
            }
            th, td {
                border: 1px solid var(--ui-line);
                padding: 6px 8px;
                font-size: 12px;
                vertical-align: top;
            }
            thead th {
                background: var(--ui-header);
                color: var(--ui-muted);
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.04em;
            }
            tbody tr:nth-child(even) {
                background: #f8fafc;
            }
            tbody tr:hover {
                background: #eef2ff;
            }
            .ui-panel {
                background: #ffffff;
                border: 1px solid var(--ui-line);
            }
            .ui-header {
                background: #ffffff;
                border-bottom: 1px solid var(--ui-line);
            }
            .ui-button {
                border: 1px solid var(--ui-line);
                background: #ffffff;
                color: var(--ui-ink);
                padding: 6px 10px;
                font-size: 12px;
                font-weight: 600;
                border-radius: 0;
            }
            .ui-button--primary {
                background: var(--ui-accent);
                border-color: var(--ui-accent);
                color: #ffffff;
            }
            .ui-button--danger {
                background: var(--ui-danger);
                border-color: var(--ui-danger);
                color: #ffffff;
            }
            .ui-button--ghost {
                background: #ffffff;
                color: var(--ui-muted);
                border-color: var(--ui-line-soft);
            }
            .ui-input,
            .ui-select,
            input,
            select,
            textarea {
                border: 1px solid var(--ui-line);
                border-radius: 0;
                padding: 6px 8px;
                font-size: 12px;
                background: #ffffff;
                color: var(--ui-ink);
            }
            .ui-muted {
                color: var(--ui-muted);
                font-size: 12px;
            }
            .ui-title {
                font-size: 18px;
                font-weight: 700;
                color: var(--ui-ink);
            }
            .ui-subtitle {
                font-size: 12px;
                color: var(--ui-muted);
            }
            .ui-chip {
                border: 1px solid var(--ui-line);
                background: #ffffff;
                color: var(--ui-muted);
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 0;
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }
            .rounded,
            .rounded-sm,
            .rounded-md,
            .rounded-lg,
            .rounded-xl,
            .rounded-2xl,
            .rounded-full {
                border-radius: 0 !important;
            }
            .shadow,
            .shadow-sm,
            .shadow-md,
            .shadow-lg,
            .shadow-xl,
            .shadow-2xl {
                box-shadow: none !important;
            }
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
            .ui-button,
            .rg-btn,
            .rg-btn-mini {
                transition: transform 120ms ease, background-color 120ms ease, color 120ms ease, border-color 120ms ease;
                will-change: transform;
            }
            button:active,
            .ui-button:active,
            .rg-btn:active,
            .rg-btn-mini:active {
                transform: translateY(1px);
            }
            button:disabled,
            .ui-button:disabled,
            .rg-btn:disabled,
            .rg-btn-mini:disabled {
                transform: none;
            }
            @media (prefers-reduced-motion: reduce) {
                .page-shell { animation: none; }
                .page-leave .page-shell { transition: none; }
                button,
                .ui-button,
                .rg-btn,
                .rg-btn-mini {
                    transition: none;
                }
            }
            @media (max-width: 640px) {
                input,
                select,
                textarea,
                .ui-input,
                .ui-select {
                    font-size: 16px;
                }
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
    <body class="bg-slate-50 text-gray-800 antialiased h-screen flex flex-col md:flex-row overflow-hidden relative">

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
                <a href="/school/schedules" class="nav-link flex items-center px-3 py-2 text-gray-600 text-sm font-medium" data-page="schedules">Schedules</a>
                <a href="/school/routine-generator" class="nav-link flex items-center px-3 py-2 text-gray-600 text-sm font-medium" data-page="routine-generator">Routine Generator</a>
                <a href="/school/teachers" class="nav-link flex items-center px-3 py-2 text-gray-600 text-sm font-medium" data-page="teachers">Teachers</a>
                <a href="/school/subjects" class="nav-link flex items-center px-3 py-2 text-gray-600 text-sm font-medium" data-page="subjects">Subjects</a>
                <a href="/school/classes" class="nav-link flex items-center px-3 py-2 text-gray-600 text-sm font-medium" data-page="classes">Classes</a>
                <div class="mt-auto pt-4 border-t">
                    <a href="/logout" data-no-prefetch class="flex items-center px-3 py-2 text-red-600 text-sm font-medium">Sign Out</a>
                </div>
            </nav>
        </aside>

        <main class="page-shell flex-1 flex flex-col min-w-0 bg-white overflow-hidden relative z-10">
            <div class="page-body flex-1 overflow-auto px-2 py-4 pb-20 sm:px-4 md:px-6 md:pb-6">
                ${content}
            </div>
        </main>

        <script>
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
                        document.querySelectorAll('a.nav-link').forEach(link => {
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

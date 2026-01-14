// src/ui/institute/layout.js

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
            
            /* Professional Scrollbars */
            ::-webkit-scrollbar { width: 6px; height: 6px; }
            ::-webkit-scrollbar-track { background: #f1f1f1; }
            ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
            ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

            /* Mobile Optimizations */
            input, select, textarea { font-size: 16px !important; } /* Prevents iOS Zoom */
            @media (min-width: 768px) {
                input, select, textarea { font-size: 0.875rem !important; } /* Return to compact on PC */
            }
        </style>
    </head>
    <body class="bg-gray-50 text-gray-800 antialiased h-screen flex flex-col md:flex-row overflow-hidden">

        <header class="md:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-30 flex-shrink-0">
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

        <div id="sidebar-backdrop" onclick="toggleSidebar()" class="fixed inset-0 bg-gray-900/50 z-40 hidden md:hidden transition-opacity opacity-0"></div>

        <aside id="sidebar" class="fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform -translate-x-full md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col shadow-2xl md:shadow-none">
            
            <div class="hidden md:flex h-14 items-center px-4 border-b border-gray-200 flex-shrink-0">
                <div class="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs mr-2">S</div>
                <span class="font-bold text-gray-900 truncate text-sm">${schoolName}</span>
            </div>

            <div class="md:hidden h-16 flex items-center justify-between px-4 border-b border-gray-200">
                <span class="font-bold text-gray-900">Menu</span>
                <button onclick="toggleSidebar()" class="p-2 text-gray-500">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <nav class="flex-1 overflow-y-auto py-3 space-y-1 px-3">
                <a href="/school/dashboard" class="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md group transition-colors text-sm font-medium">
                    <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                    Dashboard
                </a>
                
                <div class="pt-4 pb-2 px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Academic</div>
                
                <a href="/school/schedules" class="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md group transition-colors text-sm font-medium">
                    <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Master Schedule
                </a>
                <a href="/school/teachers" class="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md group transition-colors text-sm font-medium">
                    <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    Teachers
                </a>
                <a href="/school/subjects" class="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md group transition-colors text-sm font-medium">
                    <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    Subjects & Curriculum
                </a>
                <a href="/school/classes" class="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md group transition-colors text-sm font-medium">
                    <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    Classes
                </a>
                
                <div class="mt-auto border-t border-gray-200 pt-4">
                    <a href="/logout" class="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-md group transition-colors text-sm font-medium">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Sign Out
                    </a>
                </div>
            </nav>
        </aside>

        <main class="flex-1 flex flex-col min-w-0 bg-gray-50 overflow-hidden relative">
            
            <header class="hidden md:flex h-14 bg-white border-b border-gray-200 items-center justify-between px-6 flex-shrink-0">
                <h1 class="text-sm font-bold text-gray-800 uppercase tracking-wide">${title}</h1>
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        ${schoolName.charAt(0)}
                    </div>
                </div>
            </header>

            <div class="flex-1 overflow-auto p-4 sm:p-6 pb-20 md:pb-6">
                ${content}
            </div>
        </main>

        <script>
            function toggleSidebar() {
                const sidebar = document.getElementById('sidebar');
                const backdrop = document.getElementById('sidebar-backdrop');
                const isClosed = sidebar.classList.contains('-translate-x-full');
                
                if (isClosed) {
                    sidebar.classList.remove('-translate-x-full');
                    backdrop.classList.remove('hidden');
                    // Small delay for opacity transition to work
                    setTimeout(() => backdrop.classList.remove('opacity-0'), 10);
                } else {
                    sidebar.classList.add('-translate-x-full');
                    backdrop.classList.add('opacity-0');
                    setTimeout(() => backdrop.classList.add('hidden'), 200);
                }
            }
        </script>
    </body>
    </html>
    `;
}

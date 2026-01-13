export function AdminLayout(contentHTML, title = "Dashboard", companyName = "RoutineAI") {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - ${companyName}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Inter', sans-serif; }
        /* Smooth Slide Animation */
        .sidebar-transition { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        /* Hide scrollbar for sidebar but allow scroll */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      </style>
  </head>
  <body class="bg-gray-50 h-screen overflow-hidden flex flex-col text-gray-900">

      <header class="md:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 z-30 shrink-0">
          <div class="flex items-center">
              <button onclick="toggleSidebar()" class="text-gray-500 hover:text-blue-600 focus:outline-none p-2 -ml-2 rounded-md">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
              </button>
              <span class="ml-2 text-lg font-bold text-gray-800 truncate max-w-[200px]">${companyName}</span>
          </div>
          <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">A</div>
      </header>

      <div class="flex flex-1 overflow-hidden relative">
          
          <div id="sidebar-overlay" onclick="toggleSidebar()" 
               class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 hidden md:hidden transition-opacity duration-300"></div>

          <aside id="sidebar" class="sidebar-transition fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 z-50 transform -translate-x-full md:relative md:translate-x-0 flex flex-col h-full shadow-2xl md:shadow-none">
              
              <div class="h-16 hidden md:flex items-center border-b border-gray-200 px-6 bg-white shrink-0">
                  <span class="text-lg font-bold text-blue-700 truncate" title="${companyName}">
                    ${companyName}
                  </span>
              </div>

              <nav class="flex-1 overflow-y-auto py-6 px-3 no-scrollbar space-y-6">
                  
                  <div>
                      <div class="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Management</div>
                      <ul class="space-y-1">
                          <li>
                              <a href="/admin/dashboard" class="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 group transition-colors">
                                  <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                  Dashboard
                              </a>
                          </li>
                          <li>
                              <a href="/admin/schools" class="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 group transition-colors">
                                  <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                  Manage Schools
                              </a>
                          </li>
                      </ul>
                  </div>

                  <div>
                      <div class="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">System</div>
                      <ul class="space-y-1">
                          <li>
                              <a href="/admin/settings" class="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 group transition-colors">
                                  <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                  Global Settings
                              </a>
                          </li>
                      </ul>
                  </div>
              </nav>

              <div class="p-4 border-t border-gray-200 bg-gray-50 shrink-0">
                  <a href="/logout" class="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                      Sign Out
                  </a>
              </div>
          </aside>

          <div class="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50">
              <header class="hidden md:flex bg-white border-b border-gray-200 h-16 items-center justify-between px-8 shadow-sm z-10">
                  <h1 class="text-xl font-bold text-gray-800 tracking-tight">${title}</h1>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Super Admin
                  </span>
              </header>

              <main class="flex-1 overflow-y-auto p-4 md:p-8">
                  <div class="max-w-7xl mx-auto">
                      ${contentHTML}
                  </div>
              </main>
          </div>
      </div>

      <script>
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            const isClosed = sidebar.classList.contains('-translate-x-full');

            if (isClosed) {
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
                // Prevent scrolling on body when menu is open
                document.body.style.overflow = 'hidden';
            } else {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
                document.body.style.overflow = '';
            }
        }
      </script>
  </body>
  </html>
  `;
}
// src/ui/admin/layout.js

export function AdminLayout(contentHTML, title = "Dashboard", companyName = "RoutineAI") {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - ${companyName}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Inter', sans-serif; }
        /* Smooth Slide Animation */
        .sidebar-transition { transition: transform 0.3s ease-in-out; }
      </style>
  </head>
  <body class="bg-gray-100 h-screen overflow-hidden flex flex-col">

      <header class="md:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 z-20">
          <span class="text-lg font-bold text-blue-700 truncate">${companyName}</span>
          <button onclick="toggleSidebar()" class="text-gray-500 hover:text-gray-700 focus:outline-none p-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
          </button>
      </header>

      <div class="flex flex-1 overflow-hidden relative">
          
          <div id="sidebar-overlay" onclick="toggleSidebar()" 
               class="fixed inset-0 bg-gray-800 bg-opacity-50 z-20 hidden md:hidden glass-effect"></div>

          <aside id="sidebar" class="sidebar-transition absolute inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-30 transform -translate-x-full md:relative md:translate-x-0 flex flex-col h-full shadow-xl md:shadow-none">
              
              <div class="h-16 hidden md:flex items-center justify-center border-b border-gray-200 px-4 bg-gray-50">
                  <span class="text-lg font-bold text-blue-700 truncate" title="${companyName}">
                    ${companyName}
                  </span>
              </div>

              <nav class="flex-1 overflow-y-auto py-4">
                  
                  <div class="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Management
                  </div>
                  <ul class="space-y-1 px-2 mb-8">
                      <li>
                          <a href="/admin/dashboard" class="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md group">
                              <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                              <span class="font-medium">Dashboard</span>
                          </a>
                      </li>
                      <li>
                          <a href="/admin/schools" class="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md group">
                              <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                              <span class="font-medium">Manage Schools</span>
                          </a>
                      </li>
                  </ul>

                  <div class="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      System
                  </div>
                  <ul class="space-y-1 px-2">
                      <li>
                          <a href="/admin/settings" class="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md group">
                              <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                              <span class="font-medium">Global Settings</span>
                          </a>
                      </li>
                  </ul>
              </nav>

              <div class="p-4 border-t border-gray-200">
                  <a href="/logout" class="block w-full text-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md font-medium">
                      Logout
                  </a>
              </div>
          </aside>

          <div class="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-100">
              
              <header class="hidden md:flex bg-white border-b border-gray-200 h-16 items-center justify-between px-6">
                  <h1 class="text-xl font-bold text-gray-800">${title}</h1>
                  <div class="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                     <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                     <span>Super Admin</span>
                  </div>
              </header>

              <div class="md:hidden p-4 pb-0">
                 <h1 class="text-xl font-bold text-gray-800">${title}</h1>
              </div>

              <main class="flex-1 overflow-y-auto p-4 md:p-6">
                  ${contentHTML}
              </main>
          </div>
      </div>

      <script>
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            const isHidden = sidebar.classList.contains('-translate-x-full');

            if (isHidden) {
                // OPEN IT
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
            } else {
                // CLOSE IT
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
        }
      </script>
  </body>
  </html>
  `;
}
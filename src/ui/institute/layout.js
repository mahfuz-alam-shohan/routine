export function InstituteLayout(contentHTML, title = "Dashboard", schoolName = "My School") {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - ${schoolName}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Inter', sans-serif; }
        .sidebar-transition { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      </style>
  </head>
  <body class="bg-gray-50 h-screen overflow-hidden flex flex-col text-gray-900">

      <header class="md:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 z-30 shrink-0">
          <div class="flex items-center">
              <button onclick="toggleSidebar()" class="text-gray-500 hover:text-indigo-600 focus:outline-none p-2 -ml-2">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
              <span class="ml-2 text-lg font-bold text-gray-800 truncate max-w-[200px]">${schoolName}</span>
          </div>
      </header>

      <div class="flex flex-1 overflow-hidden relative">
          
          <div id="sidebar-overlay" onclick="toggleSidebar()" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 hidden md:hidden transition-opacity"></div>

          <aside id="sidebar" class="sidebar-transition fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 z-50 transform -translate-x-full md:relative md:translate-x-0 flex flex-col h-full shadow-2xl md:shadow-none">
              
              <div class="h-16 hidden md:flex items-center border-b border-gray-200 px-6 bg-indigo-50 shrink-0">
                  <span class="text-lg font-bold text-indigo-700 truncate" title="${schoolName}">
                    ${schoolName}
                  </span>
              </div>

              <nav class="flex-1 overflow-y-auto py-6 px-3 no-scrollbar space-y-6">
                  <div>
                      <div class="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Academic</div>
                      <ul class="space-y-1">
                          <li>
                              <a href="/school/dashboard" class="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 group transition-colors">
                                  <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                  Dashboard
                              </a>
                          </li>
                          <li>
                              <a href="/school/teachers" class="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 group transition-colors">
                                  <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                  Teachers
                              </a>
                          </li>
                          <li>
                              <a href="/school/classes" class="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 group transition-colors">
                                  <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                  Classes & Sections
                              </a>
                          </li>
                      </ul>
                  </div>

                  <div>
                      <div class="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Routine</div>
                      <ul class="space-y-1">
                          <li>
                              <a href="/school/routine-generator" class="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 group transition-colors">
                                  <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                                  Auto-Generate
                              </a>
                          </li>
                      </ul>
                  </div>
              </nav>

              <div class="p-4 border-t border-gray-200 bg-gray-50 shrink-0">
                  <a href="/logout" class="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors">Sign Out</a>
              </div>
          </aside>

          <div class="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50">
              <header class="hidden md:flex bg-white border-b border-gray-200 h-16 items-center justify-between px-8 shadow-sm z-10">
                  <h1 class="text-xl font-bold text-gray-800 tracking-tight">${title}</h1>
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
            sidebar.classList.toggle('-translate-x-full');
            overlay.classList.toggle('hidden');
        }
      </script>
  </body>
  </html>
  `;
}
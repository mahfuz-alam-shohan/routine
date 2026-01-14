export function InstituteLayout(contentHTML, title = "Dashboard", schoolName = "My School") {
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
        body { font-family: 'Inter', sans-serif; -webkit-tap-highlight-color: transparent; }
        
        /* SMOOTH SCROLLING FOR IOS */
        .smooth-scroll { -webkit-overflow-scrolling: touch; }
        
        /* HIDE SCROLLBAR BUT KEEP FUNCTIONALITY */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* SIDEBAR TRANSITION */
        .sidebar-transition { transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
      </style>
  </head>
  <body class="bg-gray-50 h-[100dvh] overflow-hidden flex flex-col text-gray-900 antialiased selection:bg-blue-100 selection:text-blue-900">

      <header class="md:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 z-30 shrink-0 shadow-sm">
          <div class="flex items-center gap-3">
              <button onclick="toggleSidebar()" class="text-gray-500 hover:text-blue-600 p-2 -ml-2 rounded-lg active:bg-gray-100 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
              <span class="text-lg font-bold text-gray-800 truncate max-w-[200px]">${schoolName}</span>
          </div>
      </header>

      <div class="flex flex-1 overflow-hidden relative">
          
          <div id="sidebar-overlay" onclick="toggleSidebar()" class="fixed inset-0 bg-black/40 z-40 hidden md:hidden transition-opacity duration-300"></div>

          <aside id="sidebar" class="sidebar-transition fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 z-50 transform -translate-x-full md:relative md:translate-x-0 flex flex-col h-full shadow-2xl md:shadow-none">
              
              <div class="h-16 hidden md:flex items-center border-b border-gray-200 px-6 bg-blue-50/50 shrink-0">
                  <span class="text-lg font-bold text-blue-900 truncate" title="${schoolName}">
                    ${schoolName}
                  </span>
              </div>

              <nav class="flex-1 overflow-y-auto py-6 px-3 no-scrollbar space-y-6 smooth-scroll">
                  <div>
                      <div class="px-3 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Academic</div>
                      <ul class="space-y-1">
                          <li>
                              <a href="/school/dashboard" class="flex items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 group transition-all active:scale-95">
                                  <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                  Dashboard
                              </a>
                          </li>
                          <li>
                              <a href="/school/teachers" class="flex items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 group transition-all active:scale-95">
                                  <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                  Teachers
                              </a>
                          </li>
                          <li>
                              <a href="/school/classes" class="flex items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 group transition-all active:scale-95">
                                  <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                  Classes & Sections
                              </a>
                          </li>
                          <li>
                              <a href="/school/subjects" class="flex items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 group transition-all active:scale-95">
                                  <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                  Subjects
                              </a>
                          </li>
                      </ul>
                  </div>

                  <div>
                      <div class="px-3 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Routine</div>
                      <ul class="space-y-1">
                          <li>
                              <a href="/school/routine-generator" class="flex items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 group transition-all active:scale-95">
                                  <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                                  Auto-Generate
                              </a>
                          </li>
                      </ul>
                  </div>
              </nav>

              <div class="p-4 border-t border-gray-200 bg-gray-50 shrink-0">
                  <a href="/logout" class="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Sign Out</a>
              </div>
          </aside>

          <div class="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50">
              <header class="hidden md:flex bg-white border-b border-gray-200 h-16 items-center justify-between px-8 shadow-sm z-10 shrink-0">
                  <h1 class="text-xl font-bold text-gray-800 tracking-tight">${title}</h1>
              </header>

              <main class="flex-1 overflow-y-auto smooth-scroll p-4 md:p-8">
                  ${contentHTML}
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
            } else {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
        }
      </script>
  </body>
  </html>
  `;
}

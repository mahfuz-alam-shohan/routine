// src/ui/public/layout.js

export function PublicLayout(contentHTML, title = "Home", companyName = "RoutineAI", user = null) {
  
  // Determine where the "Dashboard" button should link to
  let dashboardLink = '/login';
  if (user) {
      if (user.role === 'admin') dashboardLink = '/admin/dashboard';
      else if (user.role === 'institute') dashboardLink = '/school/dashboard';
      else if (user.role === 'teacher') dashboardLink = '/teacher/dashboard';
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
      </style>
  </head>
  <body class="bg-white text-gray-900 flex flex-col min-h-screen">

      <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="flex justify-between items-center h-16">
                  
                  <div class="flex items-center">
                      <a href="/" class="text-xl font-bold text-gray-900 tracking-tight hover:opacity-80 transition-opacity">
                          ${companyName}
                      </a>
                  </div>

                  <div class="flex items-center gap-4">
                      
                      ${user ? `
                        <div class="flex items-center gap-3">
                            <span class="hidden md:block text-xs font-medium text-gray-500 uppercase tracking-wide">
                                ${user.role} Account
                            </span>
                            <a href="${dashboardLink}" class="flex items-center gap-2 pl-1 pr-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-all border border-gray-200 group">
                                <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs group-hover:bg-blue-700">
                                    ${user.email.charAt(0).toUpperCase()}
                                </div>
                                <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">Dashboard</span>
                            </a>
                        </div>
                      ` : `
                        <a href="/login" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Log in</a>
                        <a href="/login" class="hidden sm:inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-black transition-all shadow-sm">
                            Get Started
                        </a>
                      `}
                      
                  </div>
              </div>
          </div>
      </nav>

      <main class="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 smooth-scroll">
          ${contentHTML}
      </main>

      <footer class="bg-gray-50 border-t border-gray-200 mt-auto">
          <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p class="text-sm text-gray-400">© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
              <div class="flex gap-4 text-sm text-gray-400">
                  <a href="#" class="hover:text-gray-600">Privacy</a>
                  <a href="#" class="hover:text-gray-600">Terms</a>
                  <a href="#" class="hover:text-gray-600">Contact</a>
              </div>
          </div>
      </footer>

  </body>
  </html>
  `;
}

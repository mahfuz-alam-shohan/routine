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
      </style>
  </head>
  <body class="bg-white text-gray-900 flex flex-col min-h-screen">

      <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all">
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

      <main class="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 smooth-scroll">
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

  </body>
  </html>
  `;
}

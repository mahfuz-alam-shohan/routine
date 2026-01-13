// src/ui/admin/layout.js

export function AdminLayout(contentHTML, title = "Admin Dashboard") {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
      <style>body { font-family: 'Inter', sans-serif; }</style>
  </head>
  <body class="bg-gray-100">
      
      <div class="flex h-screen overflow-hidden">
          
          <aside class="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
              <div class="h-16 flex items-center justify-center border-b border-gray-200">
                  <span class="text-xl font-bold text-blue-600">Admin Panel</span>
              </div>
              <nav class="flex-1 overflow-y-auto py-4">
                  <ul class="space-y-1 px-2">
                      <li>
                          <a href="/admin/dashboard" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                              <span class="font-medium">Dashboard</span>
                          </a>
                      </li>
                      <li>
                          <a href="/admin/users" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                              <span class="font-medium">Users / Schools</span>
                          </a>
                      </li>
                      <li>
                          <a href="/admin/settings" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                              <span class="font-medium">Settings</span>
                          </a>
                      </li>
                  </ul>
              </nav>
              <div class="p-4 border-t border-gray-200">
                  <a href="/logout" class="block w-full text-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">Logout</a>
              </div>
          </aside>

          <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
              
              <header class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                  <h1 class="text-lg font-semibold text-gray-900">${title}</h1>
                  </header>

              <main class="flex-1 overflow-y-auto p-6">
                  ${contentHTML}
              </main>
          </div>
      </div>

  </body>
  </html>
  `;
}
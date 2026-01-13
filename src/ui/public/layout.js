// src/ui/public/layout.js
import { NAVBAR, FOOTER } from './components.js';

export function PublicLayout(contentHTML, title = "School Routine AI") {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Inter', sans-serif; }
      </style>
  </head>
  <body class="bg-gray-50 text-gray-900 pt-20"> 
      ${NAVBAR}

      <main class="min-h-screen">
        ${contentHTML}
      </main>

      ${FOOTER}

      <script>
        function toggleMenu() {
            const menu = document.getElementById('navbar-sticky');
            menu.classList.toggle('hidden');
        }
      </script>
  </body>
  </html>
  `;
}
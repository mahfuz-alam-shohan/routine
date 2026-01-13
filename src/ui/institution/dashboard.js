export function InstituteDashboardHTML(stats) {
    return `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
              <div class="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <div>
                  <p class="text-gray-500 text-sm font-medium">Total Teachers</p>
                  <h3 class="text-2xl font-bold text-gray-900">${stats.teachers || 0}</h3>
              </div>
          </div>
          
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
              <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <div>
                  <p class="text-gray-500 text-sm font-medium">Classes</p>
                  <h3 class="text-2xl font-bold text-gray-900">${stats.classes || 0}</h3>
              </div>
          </div>
  
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
              <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
              </div>
              <div>
                  <p class="text-gray-500 text-sm font-medium">Routine Status</p>
                  <h3 class="text-lg font-bold text-gray-900">Not Generated</h3>
              </div>
          </div>
      </div>
  
      <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
          <h2 class="text-2xl font-bold mb-2">Setup Your School Routine</h2>
          <p class="text-indigo-100 mb-6 max-w-2xl">Complete the following steps to automatically generate your first class routine.</p>
          
          <div class="flex flex-col md:flex-row gap-4">
              <a href="/school/teachers" class="flex items-center justify-center px-5 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                  1. Add Teachers
              </a>
              <a href="/school/classes" class="flex items-center justify-center px-5 py-3 bg-indigo-700/50 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                  2. Add Classes
              </a>
          </div>
      </div>
    `;
  }
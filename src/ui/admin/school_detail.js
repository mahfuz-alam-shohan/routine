export function SchoolDetailHTML(school) {
    return `
      <div class="space-y-8">
          
          <div class="border-b pb-6">
              <h1 class="text-2xl font-bold text-gray-900">${school.school_name}</h1>
              <div class="flex items-center gap-2 mt-2">
                  <span class="px-2 py-0.5 text-xs font-semibold border border-gray-300 text-gray-700">EIIN: ${school.eiin_code || 'N/A'}</span>
                  <span class="text-sm text-gray-500">Auth ID: ${school.auth_id}</span>
              </div>
          </div>
          
          <div class="bg-white border border-gray-300 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <p class="text-xs font-bold text-gray-400 uppercase">Contact Email</p>
                 <p class="text-gray-900">${school.email}</p>
               </div>
               <div>
                 <p class="text-xs font-bold text-gray-400 uppercase">Address</p>
                 <p class="text-gray-900">${school.address || 'N/A'}</p>
               </div>
          </div>

          <div>
              <h3 class="font-bold text-gray-900 mb-4 text-lg">Configuration</h3>
              <div class="bg-white border border-gray-300 overflow-hidden divide-y divide-gray-200">
                  
                  <a href="/admin/school/teachers?id=${school.auth_id}" class="block p-4 group">
                      <div class="flex items-center justify-between">
                          <div class="flex items-center gap-4">
                              <div class="border border-gray-300 p-2 text-gray-700">
                                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                              </div>
                              <div>
                                  <h4 class="font-bold text-gray-900">Teachers</h4>
                                  <p class="text-sm text-gray-500">Set limits and view staff list</p>
                              </div>
                          </div>
                          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                      </div>
                  </a>

                  <a href="/admin/school/classes?id=${school.auth_id}" class="block p-4 group">
                      <div class="flex items-center justify-between">
                          <div class="flex items-center gap-4">
                              <div class="border border-gray-300 p-2 text-gray-700">
                                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                              </div>
                              <div>
                                  <h4 class="font-bold text-gray-900">Classes & Sections</h4>
                                  <p class="text-sm text-gray-500">Hierarchy view and structure management</p>
                              </div>
                          </div>
                          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                      </div>
                  </a>

                  </div>
          </div>
      </div>
    `;
}

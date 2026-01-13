export function SchoolDetailHTML(school, stats) {
    return `
      <div class="space-y-6">
          
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                  <nav class="flex text-sm text-gray-500 mb-1">
                      <a href="/admin/dashboard" class="hover:text-blue-600">Dashboard</a>
                      <span class="mx-2">/</span>
                      <a href="/admin/schools" class="hover:text-blue-600">Schools</a>
                      <span class="mx-2">/</span>
                      <span class="text-gray-900 font-medium">Overview</span>
                  </nav>
                  <h1 class="text-3xl font-bold text-gray-900">${school.school_name}</h1>
                  <div class="flex items-center gap-2 mt-1">
                      <span class="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">EIIN: ${school.eiin_code || 'N/A'}</span>
                      <span class="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600">${school.address || 'No Address'}</span>
                  </div>
              </div>
  
              <div class="flex gap-3 w-full md:w-auto">
                  <button class="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 shadow-sm">
                      Edit Details
                  </button>
                  <button class="flex-1 md:flex-none px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm flex items-center justify-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                      Login as Admin
                  </button>
              </div>
          </div>
  
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <p class="text-xs font-semibold text-gray-500 uppercase">Teachers</p>
                  <p class="text-2xl font-bold text-gray-900 mt-1">${stats.teachers || 0}</p>
              </div>
              <div class="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <p class="text-xs font-semibold text-gray-500 uppercase">Students</p>
                  <p class="text-2xl font-bold text-gray-900 mt-1">${stats.students || 0}</p>
              </div>
              <div class="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <p class="text-xs font-semibold text-gray-500 uppercase">Routines</p>
                  <p class="text-2xl font-bold text-gray-900 mt-1">${stats.routines || 0}</p>
              </div>
              <div class="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <p class="text-xs font-semibold text-gray-500 uppercase">Status</p>
                  <p class="text-lg font-bold text-green-600 mt-1">Active</p>
              </div>
          </div>
  
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div class="lg:col-span-2 space-y-6">
                  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                          <h3 class="font-semibold text-gray-900">Account Information</h3>
                      </div>
                      <div class="p-6 space-y-4">
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                  <label class="block text-sm font-medium text-gray-500">Admin Email</label>
                                  <div class="mt-1 text-sm text-gray-900">${school.email}</div>
                              </div>
                              <div>
                                  <label class="block text-sm font-medium text-gray-500">Joined Date</label>
                                  <div class="mt-1 text-sm text-gray-900">Oct 24, 2025</div> </div>
                              <div>
                                  <label class="block text-sm font-medium text-gray-500">Subscription Plan</label>
                                  <div class="mt-1"><span class="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700 font-semibold">Free Tier</span></div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
  
              <div class="space-y-6">
                  
                  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
                          <h3 class="font-semibold text-gray-900">Administration</h3>
                      </div>
                      <div class="p-4 space-y-2">
                          <button class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center transition-colors">
                              <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 19l-1 1-1 1-2-2m-4.707-4.707a3.001 3.001 0 004.242 4.242"></path></svg>
                              Reset Password
                          </button>
                          <hr class="border-gray-100 my-2">
                          <button class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 flex items-center transition-colors">
                              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                              Suspend Account
                          </button>
                      </div>
                  </div>
  
              </div>
          </div>
      </div>
    `;
  }
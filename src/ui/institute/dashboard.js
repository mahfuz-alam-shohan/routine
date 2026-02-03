export function InstituteDashboardHTML(stats) {
    return `
      <div class="space-y-6 max-w-6xl mx-auto pt-4 md:pt-6">
          
          <div>
            <h1 class="text-xl md:text-3xl font-semibold text-gray-900">Overview</h1>
            <p class="text-sm md:text-base text-gray-500 mt-1">Welcome to your academic control center.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 border-t border-b border-gray-100 py-4 md:py-6">
              <div>
                  <div class="text-xs md:text-sm uppercase tracking-widest text-gray-400 mb-1 md:mb-2">Total Teachers</div>
                  <div class="text-3xl md:text-4xl font-light text-gray-900">${stats.teachers || 0}</div>
              </div>
              <div>
                  <div class="text-xs md:text-sm uppercase tracking-widest text-gray-400 mb-1 md:mb-2">Active Classes</div>
                  <div class="text-3xl md:text-4xl font-light text-gray-900">${stats.classes || 0}</div>
              </div>
              <div>
                  <div class="text-xs md:text-sm uppercase tracking-widest text-gray-400 mb-1 md:mb-2">Routines</div>
                  <div class="text-3xl md:text-4xl font-light text-gray-900">${stats.routines || 0}</div>
              </div>
              <div>
                  <div class="text-xs md:text-sm uppercase tracking-widest text-gray-400 mb-1 md:mb-2">System Status</div>
                  <div class="text-sm md:text-base font-medium text-green-600 mt-1 flex items-center">
                    <span class="w-2 md:w-3 h-2 md:h-3 bg-green-500 rounded-full mr-2"></span> Operational
                  </div>
              </div>
          </div>

          <div>
              <h3 class="text-xs md:text-sm font-semibold text-gray-900 uppercase tracking-widest mb-6">Quick Actions</h3>
              <div class="flex flex-col sm:flex-row gap-4 md:gap-6 text-sm md:text-base">
                  <a href="/school/teachers" class="group flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                      <span class="border-b border-gray-300 group-hover:border-blue-600 pb-0.5">Add Staff Member</span>
                      <svg class="w-4 md:w-5 h-4 md:h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </a>
                  <a href="/school/classes" class="group flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                      <span class="border-b border-gray-300 group-hover:border-blue-600 pb-0.5">Configure Classes</span>
                      <svg class="w-4 md:w-5 h-4 md:h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </a>
              </div>
          </div>
      </div>
    `;
}

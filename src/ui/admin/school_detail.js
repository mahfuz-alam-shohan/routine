export function SchoolDetailHTML(school, stats) {
    return `
      <div class="space-y-6">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                  <h1 class="text-3xl font-bold text-gray-900">${school.school_name}</h1>
                  <div class="flex items-center gap-2 mt-1">
                      <span class="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">EIIN: ${school.eiin_code || 'N/A'}</span>
                  </div>
              </div>
          </div>
          
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
             <h3 class="font-bold text-gray-900 mb-4">Account Details</h3>
             <p><strong>Email:</strong> ${school.email}</p>
             <p><strong>Address:</strong> ${school.address || 'N/A'}</p>
          </div>
      </div>
    `;
}
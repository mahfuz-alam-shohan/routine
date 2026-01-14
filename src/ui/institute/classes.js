// src/ui/institute/classes.js

export function ClassesPageHTML(classes = []) {
    const rows = classes.map(c => `
        <div class="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors px-2">
            <div>
                <div class="font-medium text-gray-900">${c.class_name}</div>
                <div class="text-xs text-gray-500 mt-0.5 flex gap-2">
                    <span class="bg-blue-50 text-blue-700 px-1.5 rounded">Sec: ${c.section_name}</span>
                    <span class="bg-gray-100 text-gray-600 px-1.5 rounded">${c.shift || 'General'}</span>
                </div>
            </div>
            <div class="text-sm text-gray-400">
                <span class="text-xs bg-gray-100 px-2 py-1 rounded">Active</span>
            </div>
        </div>
    `).join('');

    return `
      <div class="max-w-3xl mx-auto pt-6">
          
          <div class="flex items-center justify-between mb-8">
              <div>
                <h1 class="text-2xl font-light text-gray-900">Classes & Sections</h1>
                <p class="text-sm text-gray-500 mt-1">Academic structure assigned by System Admin.</p>
              </div>
              </div>

          <div class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div class="border-b border-gray-100 pb-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Your Assigned Classes
              </div>
              ${classes.length > 0 ? rows : '<div class="py-12 text-center text-gray-400 font-light">No classes assigned yet. <br>Please contact the System Admin.</div>'}
          </div>

      </div>
    `;
}
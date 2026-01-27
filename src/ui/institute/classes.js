export function ClassesPageHTML(classes = []) {
    const rows = classes.map(c => `
        <div class="flex items-center justify-between py-4 md:py-5 border-b border-gray-100 last:border-0 px-2 md:px-4">
            <div>
                <div class="font-medium md:text-lg text-gray-900">${c.class_name}</div>
                <div class="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1 flex gap-2">
                    <span class="bg-blue-50 text-blue-700 px-1.5 md:px-2 py-0.5 md:py-1 rounded text-xs md:text-sm">Sec: ${c.section_name}</span>
                    <span class="bg-gray-100 text-gray-600 px-1.5 md:px-2 py-0.5 md:py-1 rounded text-xs md:text-sm">${c.shift}</span>
                </div>
            </div>
            <div class="text-xs md:text-sm bg-green-100 text-green-700 px-2 md:px-3 py-1 md:py-2 rounded">Active</div>
        </div>
    `).join('');

    return `
      <div class="max-w-5xl md:max-w-6xl mx-auto pt-6 md:pt-8">
          <div class="flex items-center justify-between mb-8 md:mb-10">
              <div>
                <h1 class="text-2xl md:text-4xl font-light text-gray-900">Classes & Sections</h1>
                <p class="text-sm md:text-base text-gray-500 mt-1">Managed by System Admin.</p>
              </div>
          </div>
          <div class="bg-white rounded-lg md:rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
              ${classes.length > 0 ? rows : '<div class="py-12 md:py-16 text-center text-gray-400 font-light text-sm md:text-base">No classes assigned yet.</div>'}
          </div>
      </div>
    `;
}
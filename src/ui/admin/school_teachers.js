export function SchoolTeachersHTML(school, teachers = []) {
    const teacherLimitLabel = school.max_teachers === null || school.max_teachers === undefined ? 'Unlimited' : school.max_teachers;
    return `
      <div class="px-3 sm:px-4">
         <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/admin/school/view?id=${school.auth_id}" class="hover:text-blue-600">Back to Menu</a>
            <span>/</span>
            <span class="text-gray-900 font-bold">Teacher Management</span>
         </div>

         <div class="border border-gray-300 p-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
                 <h2 class="text-gray-900 font-bold text-base">Teacher Limits</h2>
                 <p class="text-gray-600 text-sm">Limits follow the assigned membership policy.</p>
             </div>
             <div class="text-sm text-gray-600">
                Max Allowed: <span class="font-semibold text-gray-900">${teacherLimitLabel}</span>
             </div>
         </div>

         <div class="bg-white border border-gray-300 overflow-hidden">
             <div class="bg-gray-50 px-4 py-2 border-b border-gray-300 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                 <h3 class="font-bold text-gray-700">Registered Teachers</h3>
                 <span class="text-xs text-gray-600">Count: ${teachers.length} / ${teacherLimitLabel}</span>
             </div>
             <div class="md:hidden p-4 space-y-3">
                ${teachers.map(t => `
                    <div class="border border-gray-300 p-3">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <div class="text-sm font-semibold text-gray-900">${t.full_name}</div>
                                <div class="text-xs text-gray-500">${t.email || '-'}</div>
                            </div>
                            <span class="text-[10px] text-gray-600">${t.subject || '-'}</span>
                        </div>
                        <div class="text-xs font-mono text-gray-600 mt-2">${t.phone || '-'}</div>
                    </div>
                `).join('')}
                ${teachers.length === 0 ? '<div class="py-6 text-center text-gray-400 text-sm">No teachers added yet.</div>' : ''}
             </div>
             <div class="hidden md:block overflow-x-auto">
                 <table class="min-w-full border-collapse text-sm">
                     <thead class="bg-gray-50">
                        <tr>
                            <th class="border border-gray-300 px-4 py-2 text-left text-[11px] font-bold text-gray-500 uppercase">Name & Email</th>
                            <th class="border border-gray-300 px-4 py-2 text-left text-[11px] font-bold text-gray-500 uppercase">Subject</th>
                            <th class="border border-gray-300 px-4 py-2 text-left text-[11px] font-bold text-gray-500 uppercase">Phone</th>
                        </tr>
                     </thead>
                     <tbody class="bg-white">
                        ${teachers.map(t => `
                            <tr>
                                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">
                                    <div class="text-sm font-semibold text-gray-900">${t.full_name}</div>
                                    <div class="text-xs text-gray-500">${t.email || '-'}</div>
                                </td>
                                <td class="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                                    ${t.subject || '-'}
                                </td>
                                <td class="border border-gray-300 px-4 py-2 whitespace-nowrap text-sm font-mono text-gray-600">
                                    ${t.phone || '-'}
                                </td>
                            </tr>
                        `).join('')}
                        ${teachers.length === 0 ? '<tr><td colspan="3" class="border border-gray-300 px-4 py-4 text-center text-gray-400">No teachers added yet.</td></tr>' : ''}
                     </tbody>
                 </table>
             </div>
         </div>
      </div>

    `;
}

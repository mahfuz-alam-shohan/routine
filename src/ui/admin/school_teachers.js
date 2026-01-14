// src/ui/admin/school_teachers.js

export function SchoolTeachersHTML(school, teachers = []) {
    return `
      <div>
         <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/admin/school/view?id=${school.auth_id}" class="hover:text-blue-600">Back to Menu</a>
            <span>/</span>
            <span class="text-gray-900 font-bold">Teacher Management</span>
         </div>

         <div class="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
             <div>
                 <h2 class="text-purple-900 font-bold text-lg">Teacher Limit Control</h2>
                 <p class="text-purple-700 text-sm">Enforce limits based on payment plan.</p>
             </div>
             <form onsubmit="updateLimit(event)" class="flex items-center gap-2">
                 <div class="bg-white border border-purple-200 rounded px-3 py-2 text-sm">
                    <span class="text-gray-500 mr-2">Max Allowed:</span>
                    <input type="number" name="max_teachers" value="${school.max_teachers || 10}" class="w-16 font-bold text-center outline-none">
                 </div>
                 <button type="submit" class="bg-purple-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-purple-700">Save Limit</button>
             </form>
         </div>

         <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                 <h3 class="font-bold text-gray-700">Registered Teachers</h3>
                 <span class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    Count: ${teachers.length} / ${school.max_teachers || 10}
                 </span>
             </div>
             <table class="min-w-full divide-y divide-gray-200">
                 <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name & Email</th>
                        <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Subject</th>
                        <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Phone</th>
                    </tr>
                 </thead>
                 <tbody class="bg-white divide-y divide-gray-200">
                    ${teachers.map(t => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-bold text-gray-900">${t.full_name}</div>
                                <div class="text-xs text-gray-500">${t.email || '-'}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span class="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">${t.subject || '-'}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                                ${t.phone || '-'}
                            </td>
                        </tr>
                    `).join('')}
                    ${teachers.length === 0 ? '<tr><td colspan="3" class="px-6 py-4 text-center text-gray-400">No teachers added yet.</td></tr>' : ''}
                 </tbody>
             </table>
         </div>
      </div>

      <script>
        async function updateLimit(e) {
            e.preventDefault();
            const form = new FormData(e.target);
            const val = form.get('max_teachers');
            
            try {
                const res = await fetch('/admin/school/teachers', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ 
                        action: 'update_limit', 
                        school_id: ${school.id}, 
                        max_val: val 
                    })
                });
                if(res.ok) alert("Limit Updated!");
                else alert("Error");
            } catch(e) { alert("Network Error"); }
        }
      </script>
    `;
}
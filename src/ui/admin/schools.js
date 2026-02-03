export function SchoolsPageHTML(schoolsList = []) {
  const rows = schoolsList.map(school => `
    <tr class="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 group">
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">${school.school_name}</div>
            <div class="text-xs text-gray-500 md:hidden">EIIN: ${school.eiin_code || 'N/A'}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap hidden md:table-cell text-sm text-gray-500">${school.eiin_code || 'N/A'}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${school.email}</td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Active
            </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <a href="/admin/school/view?id=${school.auth_id}" class="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors">
                Manage
            </a>
        </td>
    </tr>
  `).join('');

  const mobileCards = schoolsList.map(school => `
    <div class="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        <div class="flex items-start justify-between gap-3">
            <div>
                <div class="text-sm font-semibold text-gray-900">${school.school_name}</div>
                <div class="text-xs text-gray-500 mt-1">EIIN: ${school.eiin_code || 'N/A'}</div>
                <div class="text-xs text-gray-500 mt-1">${school.email}</div>
            </div>
            <span class="px-2 inline-flex text-[10px] leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Active
            </span>
        </div>
        <div class="mt-3">
            <a href="/admin/school/view?id=${school.auth_id}" class="inline-flex items-center text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded">
                Manage
            </a>
        </div>
    </div>
  `).join('');

  return `
    <div class="space-y-6">
        
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Schools</h2>
                <p class="text-sm text-gray-500 mt-1">Manage all registered institutions.</p>
            </div>
            
            <button onclick="toggleForm()" id="add-btn" class="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center shadow-sm transition-all focus:ring-2 focus:ring-blue-200 text-sm">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Add New School
            </button>
        </div>

        <div id="list-view" class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
            <div class="md:hidden space-y-3 p-4">
                ${mobileCards.length > 0 ? mobileCards : '<div class="py-10 text-center text-gray-500 text-sm">No schools found.</div>'}
            </div>
            <div class="hidden md:block overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School Name</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">EIIN Code</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Email</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${rows.length > 0 ? rows : '<tr><td colspan="5" class="px-6 py-12 text-center text-gray-500">No schools found. <br><span class="text-sm">Click "Add New School" to create one.</span></td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>

        <div id="add-form" class="hidden fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onclick="toggleForm()"></div>

            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                    
                    <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                <h3 class="text-xl font-semibold leading-6 text-gray-900" id="modal-title">Register New Institution</h3>
                                <div class="mt-4">
                                    <form onsubmit="createSchool(event)" class="space-y-4">
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div class="col-span-2">
                                                <label class="block text-sm font-medium text-gray-700">School Name</label>
                                                <input type="text" name="school_name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">EIIN Code</label>
                                                <input type="text" name="eiin" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">Address</label>
                                                <input type="text" name="address" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                            </div>

                                            <div class="col-span-2 border-t pt-4 mt-2">
                                                <span class="text-xs font-bold text-gray-500 uppercase">Admin Account</span>
                                            </div>

                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">Email</label>
                                                <input type="email" name="email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">Password</label>
                                                <input type="password" name="password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                            </div>
                                        </div>
                                        
                                        <div class="mt-6 sm:flex sm:flex-row-reverse">
                                            <button type="submit" class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">Create School</button>
                                            <button type="button" onclick="toggleForm()" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <script>
        function toggleForm() {
            const form = document.getElementById('add-form');
            form.classList.toggle('hidden');
        }

        async function createSchool(e) {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = "Creating...";
            btn.disabled = true;

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await fetch('/admin/schools', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await res.json();
                
                if (result.success) {
                    window.location.reload(); 
                } else {
                    alert("Error: " + result.error);
                    btn.innerText = originalText;
                    btn.disabled = false;
                }
            } catch (err) {
                alert("Network Error");
                btn.innerText = originalText;
                btn.disabled = false;
            }
        }
    </script>
  `;
}

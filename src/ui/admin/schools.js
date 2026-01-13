export function SchoolsPageHTML(schoolsList = []) {
  // Convert the list of schools into HTML Table Rows
  const rows = schoolsList.map(school => `
    <tr class="hover:bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${school.school_name}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${school.eiin_code || 'N/A'}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${school.email}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Active
            </span>
        </td>
    </tr>
  `).join('');

  return `
    <div class="space-y-6">
        
        <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-800">Managed Schools</h2>
            <button onclick="toggleForm()" id="add-btn" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center shadow-sm">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Add New School
            </button>
        </div>

        <div id="list-view" class="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EIIN Code</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Email</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${rows.length > 0 ? rows : '<tr><td colspan="4" class="px-6 py-10 text-center text-gray-500">No schools added yet. Click "Add New School" to start.</td></tr>'}
                </tbody>
            </table>
        </div>

        <div id="add-form" class="hidden bg-white shadow rounded-lg p-6 border border-gray-200 max-w-3xl">
            <div class="flex justify-between items-center mb-6 border-b pb-4">
                <h3 class="text-lg font-bold text-gray-900">Register New Institution</h3>
                <button onclick="toggleForm()" class="text-gray-400 hover:text-gray-600">Close</button>
            </div>

            <form onsubmit="createSchool(event)" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                        <input type="text" name="school_name" required class="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Greenwood High School">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">EIIN Code</label>
                        <input type="text" name="eiin" class="w-full border-gray-300 rounded-md shadow-sm p-2 border" placeholder="e.g. 102345">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address / Location</label>
                        <input type="text" name="address" class="w-full border-gray-300 rounded-md shadow-sm p-2 border" placeholder="District, City">
                    </div>

                    <div class="col-span-2 mt-4">
                        <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 border-b pb-1">Admin Credentials</h4>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                        <input type="email" name="email" required class="w-full border-gray-300 rounded-md shadow-sm p-2 border" placeholder="admin@school.com">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" name="password" required class="w-full border-gray-300 rounded-md shadow-sm p-2 border" placeholder="********">
                    </div>
                </div>

                <div class="pt-4 flex justify-end space-x-3">
                    <button type="button" onclick="toggleForm()" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm">Create School</button>
                </div>
            </form>
        </div>

    </div>

    <script>
        function toggleForm() {
            const list = document.getElementById('list-view');
            const form = document.getElementById('add-form');
            const btn = document.getElementById('add-btn');

            if (list.classList.contains('hidden')) {
                // Show List
                list.classList.remove('hidden');
                form.classList.add('hidden');
                btn.classList.remove('hidden');
            } else {
                // Show Form
                list.classList.add('hidden');
                form.classList.remove('hidden');
                btn.classList.add('hidden');
            }
        }

        async function createSchool(e) {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = "Creating...";
            btn.disabled = true;

            // Gather Data
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
                    alert("School Added Successfully!");
                    window.location.reload(); // Refresh to see new list
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
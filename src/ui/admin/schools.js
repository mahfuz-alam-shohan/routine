export function SchoolsPageHTML(schoolsList = []) {
    const rows = schoolsList.map(school => `
    <tr>
        <td class="border border-gray-300 px-4 py-2 whitespace-nowrap">
            <div class="text-sm font-semibold text-gray-900">${school.school_name}</div>
            <div class="text-xs text-gray-500 md:hidden">EIIN: ${school.eiin_code || 'N/A'}</div>
        </td>
        <td class="border border-gray-300 px-4 py-2 whitespace-nowrap hidden md:table-cell text-sm text-gray-600">${school.eiin_code || 'N/A'}</td>
        <td class="border border-gray-300 px-4 py-2 whitespace-nowrap text-sm text-gray-600">${school.email}</td>
        <td class="border border-gray-300 px-4 py-2 whitespace-nowrap text-sm text-gray-600">Active</td>
        <td class="border border-gray-300 px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
            <a href="/admin/school/view?id=${school.auth_id}" class="border border-gray-400 text-gray-700 px-3 py-1 text-xs hover:bg-gray-100">
                Manage
            </a>
            <button onclick="deleteSchool(event, '${school.auth_id}')" class="border border-red-400 text-red-700 px-3 py-1 text-xs hover:bg-red-50 ml-2">
                Delete
            </button>
        </td>
    </tr>
  `).join('');

    const mobileCards = schoolsList.map(school => `
    <div class="border border-gray-300 p-4 bg-white">
        <div class="flex items-start justify-between gap-3">
            <div>
                <div class="text-sm font-semibold text-gray-900">${school.school_name}</div>
                <div class="text-xs text-gray-500 mt-1">EIIN: ${school.eiin_code || 'N/A'}</div>
                <div class="text-xs text-gray-500 mt-1">${school.email}</div>
            </div>
            <span class="text-[10px] text-gray-600">Active</span>
        </div>
        <div class="mt-3">
            <a href="/admin/school/view?id=${school.auth_id}" class="inline-flex items-center text-xs font-semibold text-gray-700 border border-gray-400 px-3 py-1 hover:bg-gray-100">
                Manage
            </a>
            <button onclick="deleteSchool(event, '${school.auth_id}')" class="inline-flex items-center text-xs font-semibold text-red-700 border border-red-400 px-3 py-1 hover:bg-red-50 ml-2">
                Delete
            </button>
        </div>
    </div>
  `).join('');

    return `
    <div class="space-y-6 px-3 sm:px-4">
        
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 class="text-xl font-bold text-gray-900">Schools</h2>
                <p class="text-sm text-gray-500 mt-1">Manage all registered institutions.</p>
            </div>
            
            <button onclick="toggleForm()" id="add-btn" class="w-full md:w-auto border border-gray-900 text-gray-900 px-4 py-2 flex items-center justify-center text-sm">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Add New School
            </button>
        </div>

        <div id="list-view" class="bg-white border border-gray-300 overflow-hidden">
            <div id="schools-mobile-list" class="md:hidden space-y-3 p-4">
                ${mobileCards.length > 0 ? mobileCards : '<div class="py-10 text-center text-gray-500 text-sm">No schools found.</div>'}
            </div>
            <div class="hidden md:block overflow-x-auto">
                <table class="min-w-full border-collapse text-sm">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="border border-gray-300 px-4 py-2 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">School Name</th>
                            <th scope="col" class="border border-gray-300 px-4 py-2 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">EIIN Code</th>
                            <th scope="col" class="border border-gray-300 px-4 py-2 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Admin Email</th>
                            <th scope="col" class="border border-gray-300 px-4 py-2 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" class="border border-gray-300 px-4 py-2 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="schools-table-body" class="bg-white">
                        ${rows.length > 0 ? rows : '<tr><td colspan="5" class="border border-gray-300 px-6 py-12 text-center text-gray-500">No schools found. <br><span class="text-sm">Click "Add New School" to create one.</span></td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>

        <div id="add-form" class="hidden fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75" onclick="toggleForm()"></div>

            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div class="relative transform overflow-hidden bg-white text-left border border-gray-300 sm:my-8 sm:w-full sm:max-w-2xl">
                    
                    <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                <h3 class="text-xl font-semibold leading-6 text-gray-900" id="modal-title">Register New Institution</h3>
                                <div class="mt-4">
                                    <form onsubmit="createSchool(event)" class="space-y-4">
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div class="col-span-2">
                                                <label class="block text-sm font-medium text-gray-700">School Name</label>
                                                <input type="text" name="school_name" required class="mt-1 block w-full border border-gray-300 p-2 text-sm">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">EIIN Code</label>
                                                <input type="text" name="eiin" class="mt-1 block w-full border border-gray-300 p-2 text-sm">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">Address</label>
                                                <input type="text" name="address" class="mt-1 block w-full border border-gray-300 p-2 text-sm">
                                            </div>

                                            <div class="col-span-2 border-t pt-4 mt-2">
                                                <span class="text-xs font-bold text-gray-500 uppercase">Admin Account</span>
                                            </div>

                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">Email</label>
                                                <input type="email" name="email" required class="mt-1 block w-full border border-gray-300 p-2 text-sm">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">Password</label>
                                                <input type="password" name="password" required class="mt-1 block w-full border border-gray-300 p-2 text-sm">
                                            </div>
                                        </div>
                                        
                                        <div class="mt-6 sm:flex sm:flex-row-reverse">
                                            <button type="submit" class="inline-flex w-full justify-center border border-gray-900 px-3 py-2 text-sm font-semibold text-gray-900 sm:ml-3 sm:w-auto">Create School</button>
                                            <button type="button" onclick="toggleForm()" class="mt-3 inline-flex w-full justify-center border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 sm:mt-0 sm:w-auto">Cancel</button>
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
        window.adminSchools = ${JSON.stringify(schoolsList || [])};

        function escapeHtml(text) {
            if (!text) return '';
            return text.toString()
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        function renderSchoolsList() {
            const list = Array.isArray(window.adminSchools) ? window.adminSchools.slice() : [];
            list.sort((a, b) => String(a.school_name || '').localeCompare(String(b.school_name || '')));

            const tableBody = document.getElementById('schools-table-body');
            if (tableBody) {
                if (!list.length) {
                    tableBody.innerHTML = '<tr><td colspan="5" class="border border-gray-300 px-6 py-12 text-center text-gray-500">No schools found. <br><span class="text-sm">Click "Add New School" to create one.</span></td></tr>';
                } else {
                    tableBody.innerHTML = list.map(function(school) {
                        const authId = encodeURIComponent(school.auth_id || '');
                        return '<tr>' +
                            '<td class="border border-gray-300 px-4 py-2 whitespace-nowrap">' +
                                '<div class="text-sm font-semibold text-gray-900">' + escapeHtml(school.school_name) + '</div>' +
                                '<div class="text-xs text-gray-500 md:hidden">EIIN: ' + escapeHtml(school.eiin_code || 'N/A') + '</div>' +
                            '</td>' +
                            '<td class="border border-gray-300 px-4 py-2 whitespace-nowrap hidden md:table-cell text-sm text-gray-600">' + escapeHtml(school.eiin_code || 'N/A') + '</td>' +
                            '<td class="border border-gray-300 px-4 py-2 whitespace-nowrap text-sm text-gray-600">' + escapeHtml(school.email || '') + '</td>' +
                            '<td class="border border-gray-300 px-4 py-2 whitespace-nowrap text-sm text-gray-600">Active</td>' +
                            '<td class="border border-gray-300 px-4 py-2 whitespace-nowrap text-right text-sm font-medium">' +
                                '<a href="/admin/school/view?id=' + authId + '" class="border border-gray-400 text-gray-700 px-3 py-1 text-xs hover:bg-gray-100">' +
                                    'Manage' +
                                '</a>' +
                                '<button onclick="deleteSchool(event, \\'' + escapeHtml(school.auth_id || '') + '\\')" class="border border-red-400 text-red-700 px-3 py-1 text-xs hover:bg-red-50 ml-2">' +
                                    'Delete' +
                                '</button>' +
                            '</td>' +
                        '</tr>';
                    }).join('');
                }
            }

            const mobileList = document.getElementById('schools-mobile-list');
            if (mobileList) {
                if (!list.length) {
                    mobileList.innerHTML = '<div class="py-10 text-center text-gray-500 text-sm">No schools found.</div>';
                } else {
                    mobileList.innerHTML = list.map(function(school) {
                        const authId = encodeURIComponent(school.auth_id || '');
                        return '<div class="border border-gray-300 p-4 bg-white">' +
                            '<div class="flex items-start justify-between gap-3">' +
                                '<div>' +
                                    '<div class="text-sm font-semibold text-gray-900">' + escapeHtml(school.school_name) + '</div>' +
                                    '<div class="text-xs text-gray-500 mt-1">EIIN: ' + escapeHtml(school.eiin_code || 'N/A') + '</div>' +
                                    '<div class="text-xs text-gray-500 mt-1">' + escapeHtml(school.email || '') + '</div>' +
                                '</div>' +
                                '<span class="text-[10px] text-gray-600">Active</span>' +
                            '</div>' +
                            '<div class="mt-3">' +
                                '<a href="/admin/school/view?id=' + authId + '" class="inline-flex items-center text-xs font-semibold text-gray-700 border border-gray-400 px-3 py-1 hover:bg-gray-100">' +
                                    'Manage' +
                                '</a>' +
                                '<button onclick="deleteSchool(event, \\'' + escapeHtml(school.auth_id || '') + '\\')" class="inline-flex items-center text-xs font-semibold text-red-700 border border-red-400 px-3 py-1 hover:bg-red-50 ml-2">' +
                                    'Delete' +
                                '</button>' +
                            '</div>' +
                        '</div>';
                    }).join('');
                }
            }
        }

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
                    if (result.school && result.school.auth_id) {
                        window.adminSchools = window.adminSchools || [];
                        window.adminSchools.unshift(result.school);
                        renderSchoolsList();
                    }
                    toggleForm();
                    e.target.reset();
                    btn.innerText = originalText;
                    btn.disabled = false;
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

        async function deleteSchool(e, authId) {
            e.preventDefault();
            if (!confirm("Are you sure you want to permanently delete this institution? This action cannot be undone.")) {
                return;
            }

            const btn = e.target;
            const originalText = btn.innerText;
            btn.innerText = "...";
            btn.disabled = true;

            try {
                const res = await fetch('/admin/school/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ auth_id: authId })
                });

                const result = await res.json();
                
                if (result.success) {
                    window.adminSchools = window.adminSchools.filter(s => String(s.auth_id) !== String(authId));
                    renderSchoolsList();
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

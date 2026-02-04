export function SchoolDetailHTML(school, shiftConfig = null) {
    const shiftsEnabled = !!(shiftConfig && shiftConfig.enabled);
    const shifts = (shiftConfig && Array.isArray(shiftConfig.shifts) && shiftConfig.shifts.length)
        ? shiftConfig.shifts
        : ['Full Day'];
    const escapeHtml = (value) => String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    return `
      <div class="space-y-8">
          
          <div class="border-b pb-6">
              <h1 class="text-2xl font-bold text-gray-900">${school.school_name}</h1>
              <div class="flex items-center gap-2 mt-2">
                  <span class="px-2 py-0.5 text-xs font-semibold border border-gray-300 text-gray-700">EIIN: ${school.eiin_code || 'N/A'}</span>
                  <span class="text-sm text-gray-500">Auth ID: ${school.auth_id}</span>
              </div>
          </div>
          
          <div class="bg-white border border-gray-300 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <p class="text-xs font-bold text-gray-400 uppercase">Contact Email</p>
                 <p class="text-gray-900">${school.email}</p>
               </div>
               <div>
                 <p class="text-xs font-bold text-gray-400 uppercase">Address</p>
                 <p class="text-gray-900">${school.address || 'N/A'}</p>
               </div>
          </div>

          <div>
              <h3 class="font-bold text-gray-900 mb-4 text-lg">Configuration</h3>
              <div class="bg-white border border-gray-300 overflow-hidden divide-y divide-gray-200">
                  
                  <a href="/admin/school/teachers?id=${school.auth_id}" class="block p-4 group">
                      <div class="flex items-center justify-between">
                          <div class="flex items-center gap-4">
                              <div class="border border-gray-300 p-2 text-gray-700">
                                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                              </div>
                              <div>
                                  <h4 class="font-bold text-gray-900">Teachers</h4>
                                  <p class="text-sm text-gray-500">Set limits and view staff list</p>
                              </div>
                          </div>
                          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                      </div>
                  </a>

                  <a href="/admin/school/classes?id=${school.auth_id}" class="block p-4 group">
                      <div class="flex items-center justify-between">
                          <div class="flex items-center gap-4">
                              <div class="border border-gray-300 p-2 text-gray-700">
                                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                              </div>
                              <div>
                                  <h4 class="font-bold text-gray-900">Classes & Sections</h4>
                                  <p class="text-sm text-gray-500">Hierarchy view and structure management</p>
                              </div>
                          </div>
                          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                      </div>
                  </a>

                  </div>
          </div>

          <div>
              <h3 class="font-bold text-gray-900 mb-4 text-lg">Shift Scheduling</h3>
              <div class="bg-white border border-gray-300 p-4 space-y-4">
                  <label class="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" id="shift-enabled" ${shiftsEnabled ? 'checked' : ''} onchange="toggleShiftEnabled(this)" class="w-4 h-4">
                      <span>Enable shift scheduling for this institution</span>
                  </label>
                  <div id="shift-config-panel" class="${shiftsEnabled ? '' : 'hidden'}">
                      <div class="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase mb-2">
                          <span>Shifts</span>
                          <span>Full Day is default</span>
                      </div>
                      <div id="shift-list" class="space-y-2">
                          <div class="text-xs text-gray-500">Loading shifts...</div>
                      </div>
                      <form onsubmit="addShift(event)" class="flex flex-col sm:flex-row gap-2 mt-3">
                          <input type="text" id="shift-name" placeholder="Shift name (e.g. Morning)" class="flex-1 border border-gray-300 px-2 py-1 text-sm" required>
                          <button type="submit" class="bg-gray-900 text-white px-3 py-1 text-sm">Add Shift</button>
                      </form>
                      <p class="text-xs text-gray-500 mt-2">Shift tabs will appear in the Master Schedule for selecting applicable periods.</p>
                  </div>
              </div>
          </div>
      </div>

      <script>
        const SCHOOL_ID = ${school.id};
        window.adminShiftList = ${JSON.stringify(shifts || []).replace(/</g, '\\u003c')};

        function escapeHtmlClient(value) {
            if (value === null || value === undefined) return '';
            let result = String(value);
            result = result.split('&').join('&amp;');
            result = result.split('<').join('&lt;');
            result = result.split('>').join('&gt;');
            result = result.split('"').join('&quot;');
            result = result.split("'").join('&#39;');
            return result;
        }

        function renderShiftList() {
            const container = document.getElementById('shift-list');
            if (!container) return;
            const list = Array.isArray(window.adminShiftList) && window.adminShiftList.length
                ? window.adminShiftList.slice()
                : ['Full Day'];
            container.innerHTML = list.map(shift => {
                const safeName = escapeHtmlClient(shift);
                if (shift === 'Full Day') {
                    return '<div class="flex items-center justify-between border border-gray-300 px-3 py-2">' +
                        '<span class="text-sm text-gray-900">' + safeName + '</span>' +
                        '<span class="text-xs text-gray-500">Default</span>' +
                    '</div>';
                }
                const encoded = encodeURIComponent(shift);
                return '<div class="flex items-center justify-between border border-gray-300 px-3 py-2">' +
                    '<span class="text-sm text-gray-900">' + safeName + '</span>' +
                    '<button type="button" data-action="remove-shift" data-shift="' + encoded + '" class="text-xs text-red-600 hover:text-red-700">Remove</button>' +
                '</div>';
            }).join('');
        }

        function toggleShiftEnabled(input) {
            fetch('/admin/school/shifts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'set_enabled', school_id: SCHOOL_ID, enabled: input.checked })
            }).then(res => res.json()).then(result => {
                if (result.success) {
                    document.getElementById('shift-config-panel').classList.toggle('hidden', !input.checked);
                } else {
                    alert(result.error || 'Unable to update shift settings.');
                    input.checked = !input.checked;
                }
            }).catch(() => {
                alert('Network error. Please try again.');
                input.checked = !input.checked;
            });
        }

        function addShift(event) {
            event.preventDefault();
            const input = document.getElementById('shift-name');
            const name = input.value.trim();
            if (!name) return;

            fetch('/admin/school/shifts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'add_shift', school_id: SCHOOL_ID, shift_name: name })
            }).then(res => res.json()).then(result => {
                if (result.success) {
                    const nameNormalized = name;
                    window.adminShiftList = window.adminShiftList || [];
                    if (!window.adminShiftList.includes(nameNormalized)) {
                        window.adminShiftList.push(nameNormalized);
                    }
                    renderShiftList();
                    input.value = '';
                } else {
                    alert(result.error || 'Unable to add shift.');
                }
            }).catch(() => {
                alert('Network error. Please try again.');
            });
        }

        function removeShift(name) {
            if (!confirm('Remove shift ' + name + '?')) return;
            fetch('/admin/school/shifts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'remove_shift', school_id: SCHOOL_ID, shift_name: name })
            }).then(res => res.json()).then(result => {
                if (result.success) {
                    window.adminShiftList = (window.adminShiftList || []).filter(shift => shift !== name);
                    renderShiftList();
                } else {
                    alert(result.error || 'Unable to remove shift.');
                }
            }).catch(() => {
                alert('Network error. Please try again.');
            });
        }

        const shiftList = document.getElementById('shift-list');
        if (shiftList) {
            shiftList.addEventListener('click', function(event) {
                const target = event.target.closest('[data-action="remove-shift"]');
                if (!target) return;
                const encoded = target.getAttribute('data-shift') || '';
                removeShift(decodeURIComponent(encoded));
            });
        }

        renderShiftList();
      </script>
    `;
}

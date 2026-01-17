// src/ui/institute/teachers.js

export function TeachersPageHTML(teachers = [], allSubjects = []) {
    
    // Helper to format subject display (JSON array -> String)
    const formatSub = (jsonStr) => {
        try {
            const arr = JSON.parse(jsonStr);
            if(Array.isArray(arr)) return arr.join(', ');
            return jsonStr; // Fallback if plain text
        } catch(e) { return jsonStr || '-'; }
    };

    const rows = teachers.map(t => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${t.full_name}</div>
                <div class="text-xs text-gray-500">${t.email}</div>
            </td>
            <td class="px-6 py-4 whitespace-normal max-w-xs">
                <div class="flex flex-wrap gap-1">
                    ${formatSub(t.subject).split(', ').map(s => 
                        `<span class="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide border border-blue-100">${s}</span>`
                    ).join('')}
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                ${t.phone}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-red-600 hover:text-red-900 text-xs">Remove</button>
            </td>
        </tr>
    `).join('');

    return `
      <div class="max-w-4xl mx-auto pt-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h1 class="text-2xl font-semibold text-gray-900">Teachers</h1>
                <p class="text-sm text-gray-500 mt-1">Manage faculty members.</p>
              </div>
              <button onclick="toggleAdd()" class="text-sm bg-gray-900 text-white px-4 py-2 rounded hover:bg-black transition-colors w-full sm:w-auto">
                  + Add Teacher
              </button>
          </div>

          <div id="add-box" class="hidden mb-6 bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
              <h3 class="text-base font-semibold text-gray-900 mb-3">New Teacher Profile</h3>
              <form onsubmit="addTeacher(event)" class="space-y-4">
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                          <input type="text" name="full_name" required class="w-full border border-gray-300 p-2 rounded text-sm outline-none">
                      </div>

                      <div>
                          <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Subjects (Multi-Select)</label>
                          <div class="border border-gray-300 rounded p-2 max-h-32 overflow-y-auto bg-gray-50">
                              ${allSubjects.map(s => `
                                  <label class="flex items-center gap-2 text-sm p-1 hover:bg-white rounded cursor-pointer">
                                      <input type="checkbox" name="subjects" value="${s.subject_name}" class="rounded text-blue-600">
                                      <span>${s.subject_name}</span>
                                  </label>
                              `).join('')}
                              ${allSubjects.length === 0 ? '<span class="text-xs text-red-500">No subjects found. Go to "Subjects" page first.</span>' : ''}
                          </div>
                          <p class="text-[10px] text-gray-400 mt-1">Select all subjects this teacher can teach.</p>
                      </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                          <input type="email" name="email" required class="w-full border border-gray-300 p-2 rounded text-sm outline-none">
                      </div>
                      <div>
                          <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Phone (BD)</label>
                          <div class="flex items-center border border-gray-300 rounded overflow-hidden bg-white">
                              <span class="bg-gray-100 text-gray-600 px-3 py-2 text-sm font-bold border-r border-gray-300">880</span>
                              <input type="text" id="phone-input" name="phone_digits" required oninput="validatePhone(this)" class="w-full p-2 text-sm outline-none font-mono" placeholder="1XXXXXXXXX" maxlength="10">
                          </div>
                          <p id="phone-msg" class="text-xs mt-1 h-4"></p>
                      </div>
                  </div>

                  <div class="pt-2">
                      <button id="submit-btn" type="submit" class="bg-blue-600 text-white px-8 py-2.5 rounded text-sm font-medium hover:bg-blue-700">Save Teacher</button>
                  </div>
              </form>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div class="md:hidden p-4 space-y-3">
                  ${teachers.map(t => `
                      <div class="border border-gray-200 rounded-lg p-3">
                          <div class="text-sm font-semibold text-gray-900">${t.full_name}</div>
                          <div class="text-xs text-gray-500">${t.email}</div>
                          <div class="flex flex-wrap gap-1 mt-2">
                              ${formatSub(t.subject).split(', ').map(s => 
                                  `<span class="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide border border-blue-100">${s}</span>`
                              ).join('')}
                          </div>
                          <div class="text-xs font-mono text-gray-600 mt-2">${t.phone}</div>
                      </div>
                  `).join('')}
                  ${teachers.length > 0 ? '' : '<div class="py-8 text-center text-gray-400 text-sm">No teachers added yet.</div>'}
              </div>
              <div class="hidden md:block overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                          <tr>
                              <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Teacher</th>
                              <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Subjects</th>
                              <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Phone</th>
                              <th class="px-6 py-3"></th>
                          </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                          ${teachers.length > 0 ? rows : '<tr><td colspan="4" class="px-6 py-12 text-center text-gray-400">No teachers added yet.</td></tr>'}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>

      <script>
        function toggleAdd() { document.getElementById('add-box').classList.toggle('hidden'); }

        function validatePhone(input) {
            let val = input.value.replace(/\\D/g, '');
            if (val.startsWith('0')) val = val.substring(1);
            input.value = val;
            const msg = document.getElementById('phone-msg');
            const btn = document.getElementById('submit-btn');
            
            if (val.length < 10) {
                msg.textContent = "Must be 10 digits"; msg.className = "text-xs mt-1 text-red-600 font-bold"; btn.disabled = true;
            } else {
                msg.textContent = "Valid"; msg.className = "text-xs mt-1 text-green-600 font-bold"; btn.disabled = false;
            }
        }

        async function addTeacher(e) {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            
            // Gather Multi-Select Checkboxes
            const checkboxes = document.querySelectorAll('input[name="subjects"]:checked');
            const selectedSubjects = Array.from(checkboxes).map(cb => cb.value);

            if(selectedSubjects.length === 0) {
                alert("Please select at least one subject.");
                return;
            }

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.subject = JSON.stringify(selectedSubjects); // Send as JSON array

            btn.innerText = "Saving..."; btn.disabled = true;
            try {
                const res = await fetch('/school/teachers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if(res.ok) window.location.reload();
                else { const err = await res.json(); alert("Error: " + err.error); }
            } catch(e) { alert("Network Error"); } 
            finally { btn.innerText = "Save Teacher"; btn.disabled = false; }
        }
      </script>
    `;
}

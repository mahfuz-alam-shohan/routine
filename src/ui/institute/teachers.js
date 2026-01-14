// src/ui/institute/teachers.js

export function TeachersPageHTML(teachers = []) {
    const rows = teachers.map(t => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${t.full_name}</div>
                <div class="text-xs text-gray-500">${t.email || 'No Email'}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">${t.subject || 'General'}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                ${t.phone || '-'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-red-600 hover:text-red-900 text-xs">Remove</button>
            </td>
        </tr>
    `).join('');

    return `
      <div class="max-w-4xl mx-auto pt-6">
          
          <div class="flex items-center justify-between mb-6">
              <div>
                <h1 class="text-2xl font-light text-gray-900">Teachers</h1>
                <p class="text-sm text-gray-500 mt-1">Manage your faculty members.</p>
              </div>
              <button onclick="toggleAdd()" class="text-sm bg-gray-900 text-white px-5 py-2 hover:bg-black transition-colors">
                  + Add Teacher
              </button>
          </div>

          <div id="add-box" class="hidden mb-10 bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
              <h3 class="text-lg font-medium text-gray-900 mb-4">New Teacher Profile</h3>
              <form onsubmit="addTeacher(event)" class="space-y-4">
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                          <input type="text" name="full_name" required class="w-full border border-gray-300 p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Mahfuz Alam">
                      </div>

                      <div>
                          <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Subject</label>
                          <input type="text" name="subject" required class="w-full border border-gray-300 p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Mathematics, English">
                      </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Email (For Login)</label>
                          <input type="email" name="email" required class="w-full border border-gray-300 p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="teacher@school.com">
                      </div>

                      <div>
                          <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number (BD)</label>
                          <div class="flex items-center border border-gray-300 rounded overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 bg-white">
                              <span class="bg-gray-100 text-gray-600 px-3 py-2 text-sm font-bold border-r border-gray-300">880</span>
                              <input type="text" id="phone-input" name="phone_digits" required 
                                     oninput="validatePhone(this)"
                                     class="w-full p-2 text-sm outline-none font-mono tracking-wide" 
                                     placeholder="1XXXXXXXXX" maxlength="10">
                          </div>
                          <p id="phone-msg" class="text-xs mt-1 h-4"></p>
                      </div>
                  </div>

                  <div class="pt-2">
                      <button id="submit-btn" type="submit" class="w-full md:w-auto bg-blue-600 text-white px-8 py-2.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                          Save Teacher
                      </button>
                  </div>
              </form>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                      <tr>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone (880-)</th>
                          <th class="px-6 py-3"></th>
                      </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                      ${teachers.length > 0 ? rows : '<tr><td colspan="4" class="px-6 py-12 text-center text-gray-400">No teachers added yet.</td></tr>'}
                  </tbody>
              </table>
          </div>

      </div>

      <script>
        function toggleAdd() {
            document.getElementById('add-box').classList.toggle('hidden');
        }

        // SMART VALIDATION LOGIC
        function validatePhone(input) {
            const msg = document.getElementById('phone-msg');
            const btn = document.getElementById('submit-btn');
            
            // 1. Remove non-digits
            let val = input.value.replace(/\\D/g, '');

            // 2. Remove leading '0' if user tries to type '017...'
            if (val.startsWith('0')) {
                val = val.substring(1);
            }

            // 3. Update field value
            input.value = val;

            // 4. Check length (Must be exactly 10 digits)
            if (val.length === 0) {
                msg.textContent = "";
                btn.disabled = false; // Allow empty initially? No, required handles it.
            } else if (val.length < 10) {
                msg.textContent = "Must be 10 digits (e.g. 17XXXXXXXX)";
                msg.className = "text-xs mt-1 text-red-600 font-bold";
                btn.disabled = true;
            } else {
                msg.textContent = "Valid Bangladeshi Number";
                msg.className = "text-xs mt-1 text-green-600 font-bold";
                btn.disabled = false;
            }
        }

        async function addTeacher(e) {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            
            // Final check on phone length
            const phoneInput = document.getElementById('phone-input').value;
            if (phoneInput.length !== 10) {
                alert("Phone number must be exactly 10 digits (excluding 880)");
                return;
            }

            const originalText = btn.innerText;
            btn.innerText = "Saving...";
            btn.disabled = true;

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await fetch('/school/teachers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if(res.ok) window.location.reload();
                else {
                    const err = await res.json();
                    alert("Error: " + err.error);
                }
            } catch(e) {
                console.error(e);
                alert("Network Error");
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        }
      </script>
    `;
}
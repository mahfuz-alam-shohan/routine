export function SubjectsPageHTML(subjects = [], classes = [], allocations = []) {
    
    // Helper to group allocations
    const assignedMap = {}; 
    allocations.forEach(a => {
        if(!assignedMap[a.class_name]) assignedMap[a.class_name] = [];
        assignedMap[a.class_name].push({ id: a.subject_id, name: a.subject_name });
    });

    const uniqueClassNames = [...new Set(classes.map(c => c.class_name))].sort();

    return `
      <div class="max-w-7xl mx-auto h-auto md:h-[calc(100vh-140px)] flex flex-col">
          
          <div class="md:hidden flex border-b border-gray-200 mb-4 shrink-0">
              <button onclick="switchTab('bank')" id="tab-bank" class="flex-1 py-3 text-sm font-bold border-b-2 border-blue-600 text-blue-600 bg-blue-50 transition-colors">
                  Subject Bank
              </button>
              <button onclick="switchTab('curriculum')" id="tab-curriculum" class="flex-1 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 transition-colors">
                  Class Curriculum
              </button>
          </div>

          <div class="flex flex-col md:flex-row h-full gap-0 md:gap-8 overflow-visible md:overflow-hidden">
              
              <div id="view-bank" class="w-full md:w-1/2 flex flex-col h-[500px] md:h-full bg-white rounded-xl border border-gray-200 shadow-sm md:overflow-hidden">
                  
                  <div class="p-4 border-b border-gray-100 bg-gray-50 shrink-0">
                      <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center justify-between">
                          <span>Subject Bank</span>
                          <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">${subjects.length} Total</span>
                      </h2>
                      <div class="flex gap-2">
                          <input type="text" id="new-subject" placeholder="New Subject Name..." 
                                 class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm">
                          <button onclick="createSubject()" class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black">
                              + Add
                          </button>
                      </div>
                  </div>

                  <div class="flex-1 overflow-y-auto p-2 smooth-scroll">
                      <div class="space-y-1">
                          ${subjects.map((sub, index) => `
                              <div class="group flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-all">
                                  <div class="flex items-center gap-3 flex-1">
                                      <span class="text-xs font-mono text-gray-400 w-6">${index + 1}.</span>
                                      <span id="name-${sub.id}" class="text-sm font-medium text-gray-700">${sub.subject_name}</span>
                                      <form id="form-${sub.id}" onsubmit="updateSubject(event, ${sub.id})" class="hidden flex-1 flex gap-2">
                                          <input type="text" name="name" value="${sub.subject_name}" class="w-full text-sm border rounded px-2 py-1">
                                          <button type="submit" class="text-green-600 text-xs font-bold">Save</button>
                                          <button type="button" onclick="toggleEdit(${sub.id})" class="text-gray-400 text-xs">Cancel</button>
                                      </form>
                                  </div>
                                  <div class="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button onclick="toggleEdit(${sub.id})" class="p-2 text-gray-400 hover:text-blue-600">
                                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                      </button>
                                      <button onclick="deleteSubject(${sub.id})" class="p-2 text-gray-400 hover:text-red-600">
                                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                      </button>
                                  </div>
                              </div>
                          `).join('')}
                          ${subjects.length === 0 ? '<div class="p-8 text-center text-gray-400 text-sm italic">No subjects added yet.</div>' : ''}
                      </div>
                  </div>
              </div>

              <div class="hidden md:block w-px bg-gray-200 h-full"></div>

              <div id="view-curriculum" class="hidden md:flex w-full md:w-1/2 flex-col h-auto md:h-full bg-white rounded-xl border border-gray-200 shadow-sm md:overflow-hidden mt-4 md:mt-0">
                  
                  <div class="p-4 border-b border-gray-100 bg-gray-50 shrink-0">
                      <h2 class="text-lg font-bold text-gray-800">Class Curriculum</h2>
                      <p class="text-xs text-gray-500 mt-1">Assign subjects to classes.</p>
                  </div>

                  <div class="flex-1 overflow-y-auto p-4 space-y-6 smooth-scroll">
                      ${uniqueClassNames.map(className => `
                          <div class="border border-gray-200 rounded-lg overflow-visible bg-white shadow-sm">
                              <div class="px-4 py-3 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                  <div class="font-bold text-gray-800 flex items-center gap-2">
                                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                      ${className}
                                  </div>
                                  
                                  <div class="relative w-full sm:w-64">
                                      <input type="text" placeholder="Search & Add..." 
                                             onkeyup="filterDropdown(this, '${className}')"
                                             onfocus="showDropdown('${className}')"
                                             class="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none">
                                      
                                      <div id="dropdown-${className.replace(/\s/g, '')}" class="hidden absolute top-full left-0 w-full bg-white border border-gray-200 shadow-xl rounded-md mt-1 max-h-48 overflow-y-auto z-50">
                                          ${subjects.map(s => `
                                              <div onclick="assignSubject('${className}', ${s.id})" 
                                                   class="dropdown-item px-3 py-3 text-xs hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 text-gray-700 font-medium">
                                                  ${s.subject_name}
                                              </div>
                                          `).join('')}
                                      </div>
                                  </div>
                              </div>

                              <div class="p-3">
                                  <div class="flex flex-wrap gap-2">
                                      ${(assignedMap[className] || []).map(sub => `
                                          <div class="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 shadow-sm">
                                              <span class="text-xs font-bold">${sub.name}</span>
                                              <button onclick="removeAssignment('${className}', ${sub.id})" class="text-blue-300 hover:text-red-500 p-0.5">
                                                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                              </button>
                                          </div>
                                      `).join('')}
                                      ${!assignedMap[className] ? '<span class="text-xs text-gray-400 italic px-2">Empty. Add subjects above.</span>' : ''}
                                  </div>
                              </div>
                          </div>
                      `).join('')}
                      ${uniqueClassNames.length === 0 ? '<p class="text-center text-gray-400 mt-10">No classes found.</p>' : ''}
                  </div>
              </div>
          </div>
      </div>

      <script>
        function switchTab(tab) {
            const bank = document.getElementById('view-bank');
            const curr = document.getElementById('view-curriculum');
            const bBtn = document.getElementById('tab-bank');
            const cBtn = document.getElementById('tab-curriculum');

            if(tab === 'bank') {
                bank.classList.remove('hidden');
                curr.classList.add('hidden');
                bBtn.className = "flex-1 py-3 text-sm font-bold border-b-2 border-blue-600 text-blue-600 bg-blue-50 transition-colors";
                cBtn.className = "flex-1 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 transition-colors";
            } else {
                bank.classList.add('hidden');
                curr.classList.remove('hidden');
                curr.classList.add('flex');
                cBtn.className = "flex-1 py-3 text-sm font-bold border-b-2 border-blue-600 text-blue-600 bg-blue-50 transition-colors";
                bBtn.className = "flex-1 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 transition-colors";
            }
        }

        function toggleEdit(id) {
            document.getElementById('name-'+id).classList.toggle('hidden');
            document.getElementById('form-'+id).classList.toggle('hidden');
        }

        async function updateSubject(e, id) {
            e.preventDefault();
            const name = e.target.name.value;
            await fetch('/school/subjects', { method: 'POST', body: JSON.stringify({ action: 'rename', id, name }) });
            window.location.reload();
        }

        async function createSubject() {
            const name = document.getElementById('new-subject').value;
            if(!name) return;
            await fetch('/school/subjects', { method: 'POST', body: JSON.stringify({ action: 'create', name }) });
            window.location.reload();
        }

        async function deleteSubject(id) {
            if(!confirm("Delete this subject?")) return;
            await fetch('/school/subjects', { method: 'DELETE', body: JSON.stringify({ id, type: 'bank' }) });
            window.location.reload();
        }

        // DROPDOWN LOGIC
        function showDropdown(className) {
            const id = 'dropdown-' + className.replace(/\\s/g, '');
            document.querySelectorAll('[id^="dropdown-"]').forEach(d => d.classList.add('hidden')); // Close others
            document.getElementById(id).classList.remove('hidden');
        }

        function filterDropdown(input, className) {
            const filter = input.value.toLowerCase();
            const id = 'dropdown-' + className.replace(/\\s/g, '');
            const items = document.getElementById(id).getElementsByClassName('dropdown-item');
            for (let i = 0; i < items.length; i++) {
                const txt = items[i].textContent || items[i].innerText;
                items[i].style.display = txt.toLowerCase().indexOf(filter) > -1 ? "" : "none";
            }
        }

        // Click outside to close
        window.onclick = function(event) {
            if (!event.target.matches('input')) {
                document.querySelectorAll('[id^="dropdown-"]').forEach(d => d.classList.add('hidden'));
            }
        }

        async function assignSubject(className, subId) {
            await fetch('/school/subjects', { method: 'POST', body: JSON.stringify({ action: 'assign', class_name: className, subject_id: subId }) });
            window.location.reload();
        }

        async function removeAssignment(className, subId) {
             if(!confirm("Remove assignment?")) return;
             await fetch('/school/subjects', { method: 'DELETE', body: JSON.stringify({ type: 'curriculum', class_name: className, subject_id: subId }) });
             window.location.reload();
        }
      </script>
    `;
}

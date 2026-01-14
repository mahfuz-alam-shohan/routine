// src/ui/institute/subjects.js (NEW FILE)

export function SubjectsPageHTML(subjects = [], classes = [], allocations = []) {
    
    // Group allocations by Class Name
    const assignedMap = {}; // { "Class 8": ["Science", "Math"] }
    allocations.forEach(a => {
        if(!assignedMap[a.class_name]) assignedMap[a.class_name] = [];
        assignedMap[a.class_name].push(a.subject_name);
    });

    // Unique class names from the classes list (ignoring sections for curriculum)
    const uniqueClassNames = [...new Set(classes.map(c => c.class_name))].sort();

    return `
      <div class="max-w-5xl mx-auto space-y-10">

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div class="flex justify-between items-start mb-6">
                  <div>
                    <h2 class="text-xl font-bold text-gray-900">Subject Bank</h2>
                    <p class="text-sm text-gray-500">Create the list of all subjects taught in your school.</p>
                  </div>
                  <div class="bg-blue-50 px-3 py-2 rounded text-blue-800 text-xs font-bold">
                    Total: ${subjects.length}
                  </div>
              </div>

              <div class="flex gap-4 mb-6 items-end">
                  <div class="flex-1">
                      <input type="text" id="new-subject" placeholder="Enter Subject Name (e.g. Higher Math, BGS)" 
                             class="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  </div>
                  <button onclick="createSubject()" class="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700">
                      + Create Subject
                  </button>
              </div>

              <div class="flex flex-wrap gap-2">
                  ${subjects.map(sub => `
                      <div class="group flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200">
                          <span>${sub.subject_name}</span>
                          <button onclick="deleteSubject(${sub.id})" class="text-gray-400 hover:text-red-500 hidden group-hover:block transition-all">
                              &times;
                          </button>
                      </div>
                  `).join('')}
                  ${subjects.length === 0 ? '<span class="text-gray-400 italic text-sm">No subjects created yet.</span>' : ''}
              </div>
          </div>


          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-900">Class Curriculum</h2>
                <p class="text-sm text-gray-500">Assign subjects from the bank to specific classes.</p>
              </div>

              <div class="space-y-4">
                  ${uniqueClassNames.map(className => `
                      <div class="border border-gray-200 rounded-lg overflow-hidden">
                          <div class="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                              <h3 class="font-bold text-gray-800">${className}</h3>
                              <div class="relative">
                                  <form onsubmit="assignSubject(event, '${className}')" class="flex gap-2">
                                      <select name="subject_id" required class="text-sm border border-gray-300 rounded px-2 py-1 w-48 focus:outline-none">
                                          <option value="">+ Add Subject...</option>
                                          ${subjects.map(s => `<option value="${s.id}">${s.subject_name}</option>`).join('')}
                                      </select>
                                      <button type="submit" class="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700">Add</button>
                                  </form>
                              </div>
                          </div>
                          <div class="p-4 bg-white flex flex-wrap gap-2">
                              ${(assignedMap[className] || []).map(subName => `
                                  <span class="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100">
                                      ${subName}
                                  </span>
                              `).join('')}
                              ${!assignedMap[className] ? '<span class="text-gray-400 text-xs italic">No subjects assigned.</span>' : ''}
                          </div>
                      </div>
                  `).join('')}
                  ${uniqueClassNames.length === 0 ? '<p class="text-red-500">No classes found. Contact Admin to create classes first.</p>' : ''}
              </div>
          </div>
      </div>

      <script>
        async function createSubject() {
            const name = document.getElementById('new-subject').value;
            if(!name) return alert("Enter a name");
            
            try {
                const res = await fetch('/school/subjects', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ action: 'create', name: name })
                });
                if(res.ok) window.location.reload();
            } catch(e) { alert("Error"); }
        }

        async function deleteSubject(id) {
            if(!confirm("Delete this subject from the Bank?")) return;
            await fetch('/school/subjects', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ id })
            });
            window.location.reload();
        }

        async function assignSubject(e, className) {
            e.preventDefault();
            const form = new FormData(e.target);
            const subId = form.get('subject_id');

            try {
                const res = await fetch('/school/subjects', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ action: 'assign', class_name: className, subject_id: subId })
                });
                if(res.ok) window.location.reload();
                else alert("Already added or error");
            } catch(e) { alert("Error"); }
        }
      </script>
    `;
}
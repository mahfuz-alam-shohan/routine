export function SchoolDetailHTML(school, classes = []) {
    
    const classRows = classes.map(c => `
        <div class="flex items-center justify-between p-3 bg-gray-50 border rounded-md mb-2">
            <div>
                <span class="font-bold text-gray-700">${c.class_name}</span>
                <span class="text-sm text-gray-500 mx-2">|</span>
                <span class="text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Sec: ${c.section_name}</span>
                <span class="text-xs text-gray-400 ml-2">(${c.shift})</span>
            </div>
            <button onclick="deleteClass(${c.id})" class="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
        </div>
    `).join('');

    return `
      <div class="space-y-8">
          
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
              <div>
                  <h1 class="text-3xl font-bold text-gray-900">${school.school_name}</h1>
                  <div class="flex items-center gap-2 mt-1">
                      <span class="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">EIIN: ${school.eiin_code || 'N/A'}</span>
                      <span class="text-sm text-gray-500">Auth ID: ${school.auth_id}</span>
                  </div>
              </div>
          </div>
          
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
             <h3 class="font-bold text-gray-900 mb-4 uppercase tracking-wide text-xs">Account Details</h3>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                 <p><strong class="text-gray-500">Email:</strong> <br>${school.email}</p>
                 <p><strong class="text-gray-500">Address:</strong> <br>${school.address || 'N/A'}</p>
             </div>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
             <div class="flex justify-between items-center mb-6">
                 <div>
                    <h3 class="font-bold text-gray-900 text-lg">Class Configuration</h3>
                    <p class="text-sm text-gray-500">Add classes and sections for this client.</p>
                 </div>
             </div>

             <div class="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                <form onsubmit="addClass(event)" class="flex flex-col md:flex-row gap-3 items-end">
                    <div class="flex-1 w-full">
                        <label class="block text-xs font-bold text-blue-800 mb-1">Class Name</label>
                        <input type="text" name="class_name" required placeholder="e.g. Class 10, A-Level" class="w-full border-gray-300 rounded text-sm p-2 border">
                    </div>
                    <div class="flex-1 w-full">
                        <label class="block text-xs font-bold text-blue-800 mb-1">Section Name</label>
                        <input type="text" name="section_name" required placeholder="e.g. A, Rose" class="w-full border-gray-300 rounded text-sm p-2 border">
                    </div>
                    <div class="w-full md:w-32">
                        <label class="block text-xs font-bold text-blue-800 mb-1">Shift</label>
                        <select name="shift" class="w-full border-gray-300 rounded text-sm p-2 border">
                            <option value="Morning">Morning</option>
                            <option value="Day">Day</option>
                            <option value="Evening">Evening</option>
                        </select>
                    </div>
                    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700 shadow-sm w-full md:w-auto">
                        + Add
                    </button>
                </form>
             </div>

             <div class="space-y-2">
                ${classRows.length > 0 ? classRows : '<p class="text-gray-400 italic text-sm">No classes configured yet.</p>'}
             </div>
          </div>
      </div>

      <script>
        const SCHOOL_ID = ${school.id}; 

        async function addClass(e) {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "Saving...";
            btn.disabled = true;

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.school_id = SCHOOL_ID; 

            try {
                const res = await fetch('/admin/school/view?action=add_class', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if(res.ok) window.location.reload();
                else {
                    const err = await res.json();
                    alert("Error: " + err.error);
                }
            } catch(err) {
                alert("Network Error");
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        }

        async function deleteClass(classId) {
            if(!confirm("Delete this section?")) return;
            try {
                const res = await fetch('/admin/school/view?action=delete_class', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: classId })
                });
                if(res.ok) window.location.reload();
            } catch(err) { alert("Network Error"); }
        }
      </script>
    `;
}
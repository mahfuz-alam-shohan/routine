// src/ui/admin/school_classes.js (NEW FILE)

export function SchoolClassesHTML(school, classesData = []) {
    
    // Group flat data into hierarchy: { "Class 9": [section1, section2], "Class 10": [...] }
    const grouped = {};
    classesData.forEach(c => {
        if (!grouped[c.class_name]) grouped[c.class_name] = [];
        grouped[c.class_name].push(c);
    });

    const hierarchyHTML = Object.keys(grouped).sort().map(className => `
        <div class="mb-4 bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div class="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-100">
                <div class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg>
                    <h3 class="font-bold text-gray-800">${className}</h3>
                </div>
                <button onclick="toggleSectionForm('${className}')" class="text-xs bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 text-gray-700">
                    + Add Section
                </button>
            </div>
            
            <div class="divide-y divide-gray-100">
                ${grouped[className].map(sec => `
                    <div class="px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 hover:bg-gray-50">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                            <span class="text-sm font-medium text-gray-700">${sec.section_name}</span>
                            <span class="text-xs text-gray-400 ml-2">(${sec.shift})</span>
                        </div>
                        <button onclick="deleteClass(${sec.id})" class="text-red-400 hover:text-red-600 text-xs self-start sm:self-auto">Remove</button>
                    </div>
                `).join('')}
                
                <div id="form-${className.replace(/\s/g, '')}" class="hidden bg-blue-50 p-3 border-t border-blue-100">
                    <form onsubmit="addSection(event, '${className}')" class="flex flex-col sm:flex-row gap-2 sm:items-center">
                         <input type="text" name="section_name" placeholder="Section Name (e.g. A)" required class="text-sm border rounded px-2 py-1 w-full">
                         <select name="shift" class="text-sm border rounded px-2 py-1 w-full sm:w-auto">
                            <option>Morning</option><option>Day</option>
                         </select>
                         <button type="submit" class="bg-blue-600 text-white text-xs px-3 py-1.5 rounded w-full sm:w-auto">Save</button>
                    </form>
                </div>
            </div>
        </div>
    `).join('');

    return `
      <div>
         <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/admin/school/view?id=${school.auth_id}" class="hover:text-blue-600">Back to Menu</a>
            <span>/</span>
            <span class="text-gray-900 font-bold">Classes & Sections</span>
         </div>

         <div class="mb-6">
             <form onsubmit="createClassGroup(event)" class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-3 md:items-end">
                 <div class="flex-1">
                     <label class="block text-xs font-bold text-gray-500 mb-1">CREATE NEW CLASS FOLDER</label>
                     <input type="text" name="class_name" placeholder="Enter Class Name (e.g. Class 10)" required class="w-full border p-2 rounded text-sm">
                 </div>
                 <div class="flex-1">
                     <label class="block text-xs font-bold text-gray-500 mb-1">FIRST SECTION</label>
                     <input type="text" name="section_name" placeholder="e.g. A" required class="w-full border p-2 rounded text-sm">
                 </div>
                 <button type="submit" class="bg-gray-900 text-white px-5 py-2 rounded text-sm font-bold hover:bg-black w-full md:w-auto">Create Class</button>
             </form>
         </div>

         <div class="space-y-4">
             ${hierarchyHTML.length > 0 ? hierarchyHTML : '<p class="text-gray-400 text-center">No classes found.</p>'}
         </div>
      </div>

      <script>
        const SCHOOL_ID = ${school.id};

        function toggleSectionForm(className) {
            const id = 'form-' + className.replace(/\s/g, '');
            document.getElementById(id).classList.toggle('hidden');
        }

        async function createClassGroup(e) {
            e.preventDefault();
            await submitData(e.target, {});
        }

        async function addSection(e, className) {
            e.preventDefault();
            await submitData(e.target, { class_name: className });
        }

        async function submitData(form, extraData) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            Object.assign(data, extraData);
            data.school_id = SCHOOL_ID;

            try {
                const res = await fetch('/admin/school/classes', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                if(res.ok) window.location.reload();
                else alert("Error saving");
            } catch(e) { alert("Network error"); }
        }

        async function deleteClass(id) {
            if(!confirm("Remove this section?")) return;
            await fetch('/admin/school/classes?id=' + id, { method: 'DELETE' });
            window.location.reload();
        }
      </script>
    `;
}

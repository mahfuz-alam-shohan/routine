// src/ui/admin/school_classes.js (NEW LOGIC)

export function SchoolClassesHTML(school, classesData = [], groupsData = [], sectionsData = []) {
    
    // Group data for easier access
    const classGroups = {};
    groupsData.forEach(g => {
        if (!classGroups[g.class_id]) classGroups[g.class_id] = [];
        classGroups[g.class_id].push(g);
    });
    
    const classSections = {};
    sectionsData.forEach(s => {
        if (!classSections[s.class_id]) classSections[s.class_id] = [];
        classSections[s.class_id].push(s);
    });

    // Build table rows with sections grouped by class
    const tableRows = classesData.map(cls => {
        const groups = classGroups[cls.id] || [];
        const sections = classSections[cls.id] || [];
        const groupNames = groups.map(g => g.group_name).join(', ') || 'None';
        
        // Get section info with group names
        const sectionInfo = sections.map(s => {
            const group = groups.find(g => g.id === s.group_id);
            return {
                name: s.section_name,
                shift: s.shift,
                group: group ? group.group_name : null
            };
        });
        
        const sectionDisplay = sectionInfo.map(si => 
            si.group ? `${si.name} (${si.group})` : si.name
        ).join(', ') || 'No sections';
        
        return \`
            <tr class="hover:bg-gray-50 border-b border-gray-100">
                <td class="px-4 py-3">
                    <div class="font-medium text-gray-900">\${cls.class_name}</div>
                </td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 text-xs rounded-full \${cls.has_groups ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}">
                        \${cls.has_groups ? 'Has Groups' : 'No Groups'}
                    </span>
                </td>
                <td class="px-4 py-3">
                    <div class="text-sm text-gray-600">\${groupNames}</div>
                </td>
                <td class="px-4 py-3">
                    <div class="text-sm text-gray-900 max-w-xs truncate" title="\${sectionDisplay}">\${sectionDisplay}</div>
                </td>
                <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                        \${cls.has_groups ? \`
                            <button onclick="openAddGroupModal(\${cls.id}, '\${cls.class_name}')" class="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                                + Add Group
                            </button>
                        \` : ''}
                        <button onclick="openAddSectionModal(\${cls.id}, '\${cls.class_name}', \${cls.has_groups})" class="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                            + Add Section
                        </button>
                        <button onclick="deleteClass(\${cls.id})" class="text-xs text-red-600 hover:text-red-800">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        \`;
    }).join('');

    return \`
      <div>
         <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/admin/school/view?id=\${school.auth_id}" class="hover:text-blue-600">Back to Menu</a>
            <span>/</span>
            <span class="text-gray-900 font-bold">Classes & Sections</span>
         </div>

         <div class="mb-6">
             <form onsubmit="createClass(event)" class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                 <div class="flex flex-col md:flex-row gap-4 md:items-end">
                     <div class="flex-1">
                         <label class="block text-xs font-bold text-gray-500 mb-1">CLASS NAME</label>
                         <input type="text" name="class_name" placeholder="Enter Class Name (e.g. Class 10)" required class="w-full border p-2 rounded text-sm">
                     </div>
                     <div class="flex items-center gap-2">
                         <input type="checkbox" name="has_groups" id="has_groups" class="rounded">
                         <label for="has_groups" class="text-sm font-medium text-gray-700">Has Groups</label>
                     </div>
                     <button type="submit" class="bg-gray-900 text-white px-5 py-2 rounded text-sm font-bold hover:bg-black">
                         Create Class
                     </button>
                 </div>
             </form>
         </div>

         <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <table class="w-full">
                 <thead class="bg-gray-50 border-b border-gray-200">
                     <tr>
                         <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class Name</th>
                         <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Groups</th>
                         <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Group Names</th>
                         <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sections</th>
                         <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                     </tr>
                 </thead>
                 <tbody>
                     \${tableRows.length > 0 ? tableRows : '<tr><td colspan="5" class="px-4 py-8 text-center text-gray-400">No classes found.</td></tr>'}
                 </tbody>
             </table>
         </div>
      </div>

      <!-- Add Group Modal -->
      <div id="addGroupModal" class="fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center px-4">
          <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">Add Group</h3>
              <form onsubmit="addGroup(event)">
                  <input type="hidden" name="class_id" id="group_class_id">
                  <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
                      <input type="text" name="group_name" required class="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="e.g. Science, Arts">
                  </div>
                  <div class="flex gap-3">
                      <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">Add Group</button>
                      <button type="button" onclick="closeModal('addGroupModal')" class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300">Cancel</button>
                  </div>
              </form>
          </div>
      </div>

      <!-- Add Section Modal -->
      <div id="addSectionModal" class="fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center px-4">
          <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">Add Section</h3>
              <form onsubmit="addSection(event)">
                  <input type="hidden" name="class_id" id="section_class_id">
                  <input type="hidden" name="has_groups" id="section_has_groups">
                  
                  <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Section Name</label>
                      <input type="text" name="section_name" required class="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="e.g. A, B">
                  </div>
                  
                  <div id="groupSelection" class="mb-4 hidden">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Select Group *</label>
                      <select name="group_id" required class="w-full border border-gray-300 rounded-lg px-3 py-2">
                          <option value="">Select a group...</option>
                      </select>
                  </div>
                  
                  <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Shift</label>
                      <select name="shift" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                          <option value="Morning">Morning</option>
                          <option value="Day">Day</option>
                      </select>
                  </div>
                  
                  <div class="flex gap-3">
                      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Add Section</button>
                      <button type="button" onclick="closeModal('addSectionModal')" class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300">Cancel</button>
                  </div>
              </form>
          </div>
      </div>

      <script>
        const SCHOOL_ID = \${school.id};
        const CLASS_GROUPS = \${JSON.stringify(classGroups)};

        function createClass(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.action = 'create_class';
            data.school_id = SCHOOL_ID;
            data.has_groups = formData.has('has_groups');

            fetch('/admin/school/classes', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(res => res.ok ? window.location.reload() : alert('Error creating class'));
        }

        function openAddGroupModal(classId, className) {
            document.getElementById('group_class_id').value = classId;
            document.getElementById('addGroupModal').classList.remove('hidden');
        }

        function openAddSectionModal(classId, className, hasGroups) {
            document.getElementById('section_class_id').value = classId;
            document.getElementById('section_has_groups').value = hasGroups;
            
            const groupSelection = document.getElementById('groupSelection');
            const groupSelect = groupSelection.querySelector('select');
            
            if (hasGroups) {
                groupSelection.classList.remove('hidden');
                groupSelect.innerHTML = '<option value="">Select a group...</option>';
                
                const groups = CLASS_GROUPS[classId] || [];
                groups.forEach(g => {
                    groupSelect.innerHTML += \`<option value="\${g.id}">\${g.group_name}</option>\`;
                });
            } else {
                groupSelection.classList.add('hidden');
            }
            
            document.getElementById('addSectionModal').classList.remove('hidden');
        }

        function addGroup(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.action = 'add_group';
            data.school_id = SCHOOL_ID;

            fetch('/admin/school/classes', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(res => res.ok ? window.location.reload() : alert('Error adding group'));
        }

        function addSection(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.action = 'add_section';
            data.school_id = SCHOOL_ID;

            fetch('/admin/school/classes', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(res => res.ok ? window.location.reload() : alert('Error adding section'));
        }

        function deleteClass(id) {
            if(!confirm("Delete this class and all its data?")) return;
            
            fetch('/admin/school/classes', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete_class', id: id})
            }).then(res => res.ok ? window.location.reload() : alert('Error deleting class'));
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.add('hidden');
        }
      </script>
    \`;
}

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

    // Build hierarchical display
    const classHierarchy = classesData.map(cls => {
        const groups = classGroups[cls.id] || [];
        const sections = classSections[cls.id] || [];
        
        // Group sections by their group
        const sectionsByGroup = {};
        groups.forEach(g => {
            sectionsByGroup[g.id] = {
                group: g,
                sections: sections.filter(s => s.group_id === g.id)
            };
        });
        
        // Sections without groups
        const sectionsWithoutGroup = sections.filter(s => !s.group_id);

        return `
            <div class="mb-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
                <!-- Class Header -->
                <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <h3 class="font-bold text-gray-900">${cls.class_name}</h3>
                            <span class="text-xs text-gray-500">(${groups.length} groups, ${sections.length} sections)</span>
                        </div>
                        <div class="flex items-center gap-2">
                            ${cls.has_groups ? `
                                <button onclick="openAddGroupModal(${cls.id}, '${cls.class_name}')" class="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                                    + Add Group
                                </button>
                            ` : ''}
                            <button onclick="openAddSectionModal(${cls.id}, '${cls.class_name}', ${cls.has_groups})" class="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                                + Add Section
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Groups and Sections -->
                <div class="p-4">
                    ${groups.length > 0 ? `
                        <div class="space-y-4">
                            ${groups.map(g => {
                                const groupSections = sectionsByGroup[g.id]?.sections || [];
                                return `
                                    <div class="border-l-4 border-purple-400 pl-4">
                                        <div class="flex items-center justify-between mb-2">
                                            <div class="flex items-center gap-2">
                                                <span class="font-semibold text-purple-700">${g.group_name}</span>
                                                <span class="text-xs text-gray-500">(${groupSections.length} sections)</span>
                                            </div>
                                            <button onclick="deleteGroup(${g.id})" class="text-xs text-red-600 hover:text-red-800">
                                                Delete Group
                                            </button>
                                        </div>
                                        <div class="flex flex-wrap gap-2">
                                            ${groupSections.map(s => `
                                                <div class="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded border border-purple-200">
                                                    <span class="text-sm font-medium text-gray-900">${s.section_name}</span>
                                                    <button onclick="deleteSection(${s.id})" class="text-xs text-red-500 hover:text-red-700 ml-1">×</button>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : ''}
                    
                    ${sectionsWithoutGroup.length > 0 ? `
                        <div class="border-l-4 border-blue-400 pl-4">
                            <div class="mb-2">
                                <span class="font-semibold text-blue-700">No Group</span>
                                <span class="text-xs text-gray-500 ml-2">(${sectionsWithoutGroup.length} sections)</span>
                            </div>
                            <div class="flex flex-wrap gap-2">
                                ${sectionsWithoutGroup.map(s => `
                                    <div class="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                                        <span class="text-sm font-medium text-gray-900">${s.section_name}</span>
                                        <button onclick="deleteSection(${s.id})" class="text-xs text-red-500 hover:text-red-700 ml-1">×</button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${groups.length === 0 && sectionsWithoutGroup.length === 0 ? `
                        <div class="text-center py-8 text-gray-400">
                            <p class="text-sm">No groups or sections added yet</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    return `
      <div>
         <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/admin/school/view?id=${school.auth_id}" class="hover:text-blue-600">Back to Menu</a>
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

         <div class="space-y-4">
             ${classHierarchy.length > 0 ? classHierarchy : `
                 <div class="bg-white border border-gray-200 rounded-lg p-8 text-center">
                     <p class="text-gray-400">No classes found</p>
                 </div>
             `}
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
                  
                  <div class="flex gap-3">
                      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Add Section</button>
                      <button type="button" onclick="closeModal('addSectionModal')" class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300">Cancel</button>
                  </div>
              </form>
          </div>
      </div>

      <script>
        const SCHOOL_ID = ${school.id};
        const CLASS_GROUPS = ${JSON.stringify(classGroups)};

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
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    alert('Error creating class: ' + (response.error || 'Unknown error'));
                }
            }).catch(error => {
                console.error('Network error:', error);
                alert('Network error. Please check your connection and try again.');
            });
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
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    alert('Error adding group: ' + (response.error || 'Unknown error'));
                }
            }).catch(error => {
                console.error('Network error:', error);
                alert('Network error. Please check your connection and try again.');
            });
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
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    alert('Error adding section: ' + (response.error || 'Unknown error'));
                }
            }).catch(error => {
                console.error('Network error:', error);
                alert('Network error. Please check your connection and try again.');
            });
        }

        function deleteGroup(id) {
            if(!confirm("Delete this group and all its sections?")) return;
            
            fetch('/admin/school/classes', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete_group', id: id})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    alert('Error deleting group: ' + (response.error || 'Unknown error'));
                }
            }).catch(error => {
                console.error('Network error:', error);
                alert('Network error. Please check your connection and try again.');
            });
        }

        function deleteSection(id) {
            if(!confirm("Delete this section?")) return;
            
            fetch('/admin/school/classes', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete_section', id: id})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    alert('Error deleting section: ' + (response.error || 'Unknown error'));
                }
            }).catch(error => {
                console.error('Network error:', error);
                alert('Network error. Please check your connection and try again.');
            });
        }

        function deleteClass(id) {
            if(!confirm("Delete this class and all its groups and sections?")) return;
            
            fetch('/admin/school/classes', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete_class', id: id})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    alert('Error deleting class: ' + (response.error || 'Unknown error'));
                }
            }).catch(error => {
                console.error('Network error:', error);
                alert('Network error. Please check your connection and try again.');
            });
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.add('hidden');
        }
      </script>
    `;
}

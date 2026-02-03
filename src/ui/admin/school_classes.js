// src/ui/admin/school_classes.js - MAIN ADMIN: Classes, Groups & Sections ONLY

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
            <div class="mb-4 border border-gray-300">
                <!-- Class Header -->
                <div class="bg-gray-100 px-3 py-2 border-b">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-sm md:text-base">${cls.class_name}</span>
                            <span class="text-xs text-gray-500">(${groups.length} groups, ${sections.length} sections)</span>
                        </div>
                        <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                            <button onclick="openEditClassModal(${cls.id}, '${cls.class_name}', ${cls.has_groups})" class="text-xs bg-yellow-600 text-white px-2 py-1 hover-lift">
                                Edit
                            </button>
                            <button onclick="deleteClass(${cls.id})" class="text-xs bg-red-600 text-white px-2 py-1 hover-lift">
                                Delete
                            </button>
                            ${cls.has_groups ? `
                                <button onclick="openAddGroupModal(${cls.id}, '${cls.class_name}')" class="text-xs bg-green-600 text-white px-2 py-1 hover-lift">
                                    + Add Group
                                </button>
                            ` : `
                                <button onclick="openAddSectionModal(${cls.id}, '${cls.class_name}', ${cls.has_groups})" class="text-xs bg-blue-600 text-white px-2 py-1 hover-lift">
                                    + Add Section
                                </button>
                            `}
                        </div>
                    </div>
                </div>

                <!-- Groups and Sections -->
                <div class="p-2">
                    ${groups.length > 0 ? `
                        <div class="space-y-2">
                            ${groups.map(g => {
                                const groupSections = sectionsByGroup[g.id]?.sections || [];
                                
                                return `
                                    <div class="border-l-2 border-gray-400 pl-2">
                                        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-1">
                                            <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                                                <span class="font-semibold text-sm md:text-base">${g.group_name}</span>
                                                <span class="text-xs text-gray-500">(${groupSections.length} sections)</span>
                                            </div>
                                            <div class="flex flex-col sm:flex-row sm:items-center gap-1">
                                                <button onclick="openEditGroupModal(${g.id}, '${g.group_name}')" class="text-xs bg-yellow-600 text-white px-2 py-1">
                                                    Edit
                                                </button>
                                                <button onclick="deleteGroup(${g.id})" class="text-xs bg-red-600 text-white px-2 py-1">
                                                    Delete
                                                </button>
                                                <button onclick="openAddSectionModalForGroup(${cls.id}, '${cls.class_name}', ${g.id}, '${g.group_name}')" class="text-xs bg-blue-600 text-white px-2 py-1">
                                                    + Add Section
                                                </button>
                                            </div>
                                        </div>
                                        <div class="flex flex-wrap gap-1">
                                            ${groupSections.map(s => `
                                                <span class="border border-gray-300 px-2 py-1 text-sm flex items-center gap-1">
                                                    ${s.section_name}
                                                    <button onclick="openEditSectionModal(${s.id}, '${s.section_name}')" class="text-xs text-yellow-600 hover:text-yellow-800">✏️</button>
                                                    <button onclick="deleteSection(${s.id})" class="text-xs text-red-500 hover:text-red-700">×</button>
                                                </span>
                                            `).join('')}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : ''}
                    
                    ${sectionsWithoutGroup.length > 0 ? `
                        <div class="border-l-2 border-gray-400 pl-2">
                            <div class="mb-1">
                                <span class="font-semibold">No Group</span>
                                <span class="text-xs text-gray-500 ml-2">(${sectionsWithoutGroup.length} sections)</span>
                            </div>
                            <div class="flex flex-wrap gap-1">
                                ${sectionsWithoutGroup.map(s => `
                                    <span class="border border-gray-300 px-2 py-1 text-sm flex items-center gap-1">
                                        ${s.section_name}
                                        <button onclick="openEditSectionModal(${s.id}, '${s.section_name}')" class="text-xs text-yellow-600 hover:text-yellow-800">✏️</button>
                                        <button onclick="deleteSection(${s.id})" class="text-xs text-red-500 hover:text-red-700">×</button>
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${groups.length === 0 && sectionsWithoutGroup.length === 0 ? `
                        <div class="text-center py-4 text-gray-400 text-sm">
                            No groups or sections added yet
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    return `
      <style>
        /* Enhanced animations and transitions */
        .btn-primary {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(0);
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .btn-primary:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .section-badge {
          transition: all 0.2s ease;
        }
        .section-badge:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        /* Loading skeleton */
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        /* Success animations */
        @keyframes slideInSuccess {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .success-message {
          animation: slideInSuccess 0.3s ease-out;
        }
        
        /* Smooth focus states */
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          transition: all 0.2s ease;
        }
        
        /* Hover states for interactive elements */
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        /* Mobile responsive design */
        @media (max-width: 768px) {
          .class-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .class-header button {
            width: 100%;
            justify-content: center;
          }
          
          .group-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .group-header button {
            width: 100%;
            justify-content: center;
          }
        }
        
        /* Prevent zoom on input focus */
        input, select, textarea {
          font-size: 16px !important;
        }
      </style>
      
      <div>
         <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/admin/school/view?id=${school.auth_id}" class="hover:text-blue-600">Back to Menu</a>
            <span>/</span>
            <span class="text-gray-900 font-bold">Classes & Sections</span>
         </div>

         <div class="mb-4">
             <form onsubmit="createClass(event)" class="border border-gray-300 p-3">
                 <div class="flex flex-col md:flex-row gap-2 items-end">
                     <div class="flex-1">
                         <input type="text" name="class_name" placeholder="Class Name (e.g. Class 10)" required class="w-full border border-gray-300 px-2 py-1 text-sm">
                     </div>
                     <div class="flex items-center gap-1">
                         <input type="checkbox" name="has_groups" id="has_groups">
                         <label for="has_groups" class="text-sm">Has Groups</label>
                     </div>
                     <button type="submit" class="bg-gray-800 text-white px-3 py-1 text-sm">
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
      <div id="addGroupModal" class="fixed inset-0 bg-black/60 z-[9999] hidden flex items-center justify-center px-4">
          <div class="bg-white border border-gray-300 w-full max-w-md p-4 relative">
              <h3 class="font-bold mb-3">Add Group</h3>
              <form onsubmit="addGroup(event)">
                  <input type="hidden" name="class_id" id="group_class_id">
                  <div class="mb-3">
                      <input type="text" name="group_name" required class="w-full border border-gray-300 px-2 py-1" placeholder="e.g. Science, Arts">
                  </div>
                  <div class="flex gap-2">
                      <button type="submit" class="bg-green-600 text-white px-3 py-1 text-sm" id="addGroupBtn">Add Group</button>
                      <button type="button" onclick="closeModal('addGroupModal')" class="bg-gray-200 text-gray-800 px-3 py-1 text-sm">Cancel</button>
                  </div>
              </form>
          </div>
      </div>

      <!-- Add Section Modal -->
      <div id="addSectionModal" class="fixed inset-0 bg-black/60 z-[9999] hidden flex items-center justify-center px-4">
          <div class="bg-white border border-gray-300 w-full max-w-md p-4 relative">
              <h3 class="font-bold mb-3">Add Section</h3>
              <form onsubmit="addSection(event)">
                  <input type="hidden" name="class_id" id="section_class_id">
                  <input type="hidden" name="group_id" id="section_group_id">
                  
                  <div class="mb-3">
                      <input type="text" name="section_name" required class="w-full border border-gray-300 px-2 py-1" placeholder="e.g. A, B">
                  </div>
                  
                  <div class="flex gap-2">
                      <button type="submit" class="bg-blue-600 text-white px-3 py-1 text-sm" id="addSectionBtn">Add Section</button>
                      <button type="button" onclick="closeModal('addSectionModal')" class="bg-gray-200 text-gray-800 px-3 py-1 text-sm">Cancel</button>
                  </div>
              </form>
          </div>
      </div>

      <!-- Edit Class Modal -->
      <div id="editClassModal" class="fixed inset-0 bg-black/60 z-[9999] hidden flex items-center justify-center px-4">
          <div class="bg-white border border-gray-300 w-full max-w-md p-4 relative">
              <h3 class="font-bold mb-3">Edit Class</h3>
              <form onsubmit="editClass(event)">
                  <input type="hidden" name="class_id" id="edit_class_id">
                  <div class="mb-3">
                      <label class="block text-sm font-medium mb-1">Class Name</label>
                      <input type="text" name="class_name" required class="w-full border border-gray-300 px-2 py-1" placeholder="e.g. Class 10">
                  </div>
                  <div class="flex items-center gap-1 mb-3">
                      <input type="checkbox" name="has_groups" id="edit_has_groups">
                      <label for="edit_has_groups" class="text-sm">Has Groups</label>
                  </div>
                  <div class="flex gap-2">
                      <button type="submit" class="bg-yellow-600 text-white px-3 py-1 text-sm" id="editClassBtn">Save Changes</button>
                      <button type="button" onclick="closeModal('editClassModal')" class="bg-gray-200 text-gray-800 px-3 py-1 text-sm">Cancel</button>
                  </div>
              </form>
          </div>
      </div>

      <!-- Edit Group Modal -->
      <div id="editGroupModal" class="fixed inset-0 bg-black/60 z-[9999] hidden flex items-center justify-center px-4">
          <div class="bg-white border border-gray-300 w-full max-w-md p-4 relative">
              <h3 class="font-bold mb-3">Edit Group</h3>
              <form onsubmit="editGroup(event)">
                  <input type="hidden" name="group_id" id="edit_group_id">
                  <div class="mb-3">
                      <label class="block text-sm font-medium mb-1">Group Name</label>
                      <input type="text" name="group_name" required class="w-full border border-gray-300 px-2 py-1" placeholder="e.g. Science, Arts">
                  </div>
                  <div class="flex gap-2">
                      <button type="submit" class="bg-yellow-600 text-white px-3 py-1 text-sm" id="editGroupBtn">Save Changes</button>
                      <button type="button" onclick="closeModal('editGroupModal')" class="bg-gray-200 text-gray-800 px-3 py-1 text-sm">Cancel</button>
                  </div>
              </form>
          </div>
      </div>

      <!-- Edit Section Modal -->
      <div id="editSectionModal" class="fixed inset-0 bg-black/60 z-[9999] hidden flex items-center justify-center px-4">
          <div class="bg-white border border-gray-300 w-full max-w-md p-4 relative">
              <h3 class="font-bold mb-3">Edit Section</h3>
              <form onsubmit="editSection(event)">
                  <input type="hidden" name="section_id" id="edit_section_id">
                  <div class="mb-3">
                      <label class="block text-sm font-medium mb-1">Section Name</label>
                      <input type="text" name="section_name" required class="w-full border border-gray-300 px-2 py-1" placeholder="e.g. A, B">
                  </div>
                  <div class="flex gap-2">
                      <button type="submit" class="bg-yellow-600 text-white px-3 py-1 text-sm" id="editSectionBtn">Save Changes</button>
                      <button type="button" onclick="closeModal('editSectionModal')" class="bg-gray-200 text-gray-800 px-3 py-1 text-sm">Cancel</button>
                  </div>
              </form>
          </div>
      </div>

      <!-- Dependency Warning Modal -->
      <div id="dependencyModal" class="fixed inset-0 bg-black/60 z-[9999] hidden flex items-center justify-center px-4">
          <div class="bg-white border border-gray-300 w-full max-w-lg p-4 relative">
              <h3 class="font-bold mb-3 text-red-600">⚠️ Dependency Warning</h3>
              <div id="dependencyDetails" class="mb-4">
                  <!-- Dependency details will be populated here -->
              </div>
              <div class="flex gap-2">
                  <button onclick="forceDelete()" class="bg-red-600 text-white px-3 py-1 text-sm" id="forceDeleteBtn">Force Delete</button>
                  <button onclick="closeModal('dependencyModal')" class="bg-gray-200 text-gray-800 px-3 py-1 text-sm">Cancel</button>
              </div>
          </div>
      </div>

      <script>
        const SCHOOL_ID = ${school.id};
        const CLASS_GROUPS = ${JSON.stringify(classGroups)};

        function createClass(e) {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button[type="submit"]');
            if (submitBtn.disabled) return; // Prevent multiple submissions
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating...';
            
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
                    showToast('Error creating class: ' + (response.error || 'Unknown error'), 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Create Class';
                }
            }).catch(error => {
                console.error('Network error:', error);
                showToast('Network error. Please check your connection and try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Class';
            });
        }

        function openAddGroupModal(classId, className) {
            document.getElementById('group_class_id').value = classId;
            openModal('addGroupModal');
            setTimeout(() => {
                document.querySelector('#addGroupModal input[name="group_name"]').focus();
            }, 100);
        }

        function openAddSectionModalForGroup(classId, className, groupId, groupName) {
            document.getElementById('section_class_id').value = classId;
            document.getElementById('section_group_id').value = groupId;
            openModal('addSectionModal');
            setTimeout(() => {
                document.querySelector('#addSectionModal input[name="section_name"]').focus();
            }, 100);
        }

        function openAddSectionModal(classId, className, hasGroups) {
            document.getElementById('section_class_id').value = classId;
            document.getElementById('section_group_id').value = '';
            openModal('addSectionModal');
            setTimeout(() => {
                document.querySelector('#addSectionModal input[name="section_name"]').focus();
            }, 100);
        }

        function addGroup(e) {
            e.preventDefault();
            const submitBtn = document.getElementById('addGroupBtn');
            if (submitBtn.disabled) return; // Prevent multiple submissions
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';
            
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
                    showToast('Error adding group: ' + (response.error || 'Unknown error'), 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Add Group';
                }
            }).catch(error => {
                console.error('Network error:', error);
                showToast('Network error. Please check your connection and try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Add Group';
            });
        }

        function addSection(e) {
            e.preventDefault();
            const submitBtn = document.getElementById('addSectionBtn');
            if (submitBtn.disabled) return; // Prevent multiple submissions
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';
            
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
                    showToast('Error adding section: ' + (response.error || 'Unknown error'), 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Add Section';
                }
            }).catch(error => {
                console.error('Network error:', error);
                showToast('Network error. Please check your connection and try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Add Section';
            });
        }

        function deleteClass(id) {
            if(!confirm("Delete this class and all its data? This will remove all groups, sections, subjects, teachers, and routines associated with it.")) return;
            
            fetch('/admin/school/classes', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete_class', id: id, school_id: SCHOOL_ID})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    showToast('Error deleting class: ' + (response.error || 'Unknown error'), 'error');
                }
            }).catch(error => {
                console.error('Network error:', error);
                showToast('Network error. Please check your connection and try again.', 'error');
            });
        }

        function deleteGroup(id) {
            if(!confirm("Delete this group and all its data? This will remove all sections, subjects, teachers, and routines associated with it.")) return;
            
            fetch('/admin/school/classes', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete_group', id: id, school_id: SCHOOL_ID})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    showToast('Error deleting group: ' + (response.error || 'Unknown error'), 'error');
                }
            }).catch(error => {
                console.error('Network error:', error);
                showToast('Network error. Please check your connection and try again.', 'error');
            });
        }

        function deleteSection(id) {
            if(!confirm("Delete this section and all its data? This will remove all teacher assignments and routines associated with it.")) return;
            
            fetch('/admin/school/classes', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete_section', id: id, school_id: SCHOOL_ID})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    showToast('Error deleting section: ' + (response.error || 'Unknown error'), 'error');
                }
            }).catch(error => {
                console.error('Network error:', error);
                showToast('Network error. Please check your connection and try again.', 'error');
            });
        }

        function showDependencyWarning(dependencies, action, id) {
            const detailsDiv = document.getElementById('dependencyDetails');
            const dependencyList = dependencies.map(function(dep) { 
                return '<li class="text-sm text-gray-600">• ' + dep.message + '</li>';
            }).join('');
            
            detailsDiv.innerHTML = 
                '<p class="text-sm text-gray-700 mb-3">This item cannot be deleted because it has the following dependencies:</p>' +
                '<ul class="list-disc pl-5 mb-4">' +
                    dependencyList +
                '</ul>' +
                '<p class="text-sm text-red-600 font-medium">⚠️ Force deleting will permanently remove all dependent data!</p>';
            
            // Store action and id for force delete
            window.pendingDelete = { action: action, id: id };
            
            openModal('dependencyModal');
        }

        function forceDelete() {
            if(!window.pendingDelete) return;
            
            const { action, id } = window.pendingDelete;
            const forceBtn = document.getElementById('forceDeleteBtn');
            forceBtn.disabled = true;
            forceBtn.textContent = 'Deleting...';
            
            fetch('/admin/school/classes', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action, id, school_id: SCHOOL_ID, force: true})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    showToast('Error force deleting: ' + (response.error || 'Unknown error'), 'error');
                    forceBtn.disabled = false;
                    forceBtn.textContent = 'Force Delete';
                }
            }).catch(error => {
                console.error('Network error:', error);
                showToast('Network error. Please check your connection and try again.', 'error');
                forceBtn.disabled = false;
                forceBtn.textContent = 'Force Delete';
            });
        }

        function openEditClassModal(classId, className, hasGroups) {
            document.getElementById('edit_class_id').value = classId;
            document.querySelector('#editClassModal input[name="class_name"]').value = className;
            document.getElementById('edit_has_groups').checked = hasGroups;
            openModal('editClassModal');
            setTimeout(() => {
                document.querySelector('#editClassModal input[name="class_name"]').focus();
            }, 100);
        }

        function openEditGroupModal(groupId, groupName) {
            document.getElementById('edit_group_id').value = groupId;
            document.querySelector('#editGroupModal input[name="group_name"]').value = groupName;
            openModal('editGroupModal');
            setTimeout(() => {
                document.querySelector('#editGroupModal input[name="group_name"]').focus();
            }, 100);
        }

        function openEditSectionModal(sectionId, sectionName) {
            document.getElementById('edit_section_id').value = sectionId;
            document.querySelector('#editSectionModal input[name="section_name"]').value = sectionName;
            openModal('editSectionModal');
            setTimeout(() => {
                document.querySelector('#editSectionModal input[name="section_name"]').focus();
            }, 100);
        }

        function editClass(e) {
            e.preventDefault();
            const submitBtn = document.getElementById('editClassBtn');
            if (submitBtn.disabled) return;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.action = 'edit_class';
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
                    showToast('Error updating class: ' + (response.error || 'Unknown error'), 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Save Changes';
                }
            }).catch(error => {
                console.error('Network error:', error);
                showToast('Network error. Please check your connection and try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Save Changes';
            });
        }

        function editGroup(e) {
            e.preventDefault();
            const submitBtn = document.getElementById('editGroupBtn');
            if (submitBtn.disabled) return;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.action = 'edit_group';
            data.school_id = SCHOOL_ID;

            fetch('/admin/school/classes', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    showToast('Error updating group: ' + (response.error || 'Unknown error'), 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Save Changes';
                }
            }).catch(error => {
                console.error('Network error:', error);
                showToast('Network error. Please check your connection and try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Save Changes';
            });
        }

        function editSection(e) {
            e.preventDefault();
            const submitBtn = document.getElementById('editSectionBtn');
            if (submitBtn.disabled) return;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.action = 'edit_section';
            data.school_id = SCHOOL_ID;

            fetch('/admin/school/classes', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    showToast('Error updating section: ' + (response.error || 'Unknown error'), 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Save Changes';
                }
            }).catch(error => {
                console.error('Network error:', error);
                showToast('Network error. Please check your connection and try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Save Changes';
            });
        }

        // Modal management
        function openModal(modalId) {
            document.getElementById(modalId).classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.add('hidden');
            document.body.style.overflow = '';
            const modal = document.getElementById(modalId);
            const submitBtn = modal.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = submitBtn.id === 'addGroupBtn' ? 'Add Group' : 'Add Section';
            }
            modal.querySelector('form').reset();
        }

        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.fixed.inset-0');
                modals.forEach(modal => {
                    if (!modal.classList.contains('hidden')) {
                        closeModal(modal.id);
                    }
                });
            }
        });

        // Close modal on background click
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('fixed') && e.target.classList.contains('inset-0')) {
                closeModal(e.target.id);
            }
        });

        // Toast notification system
        function showToast(message, type = 'success') {
            const toast = document.createElement('div');
            const bgColor = type === 'success' ? 'bg-green-600' : 
                          type === 'error' ? 'bg-red-600' : 
                          type === 'info' ? 'bg-blue-600' : 'bg-gray-600';
            
            toast.className = 'fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-[10000] success-message ' + bgColor;
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                document.querySelector('input[name="class_name"]').focus();
            }
        });
      </script>
    `;
}

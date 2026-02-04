export function SchoolClassesHTML(school, classesData = [], groupsData = [], sectionsData = [], shiftConfig = null) {
    const shiftsEnabled = !!(shiftConfig && shiftConfig.enabled);
    const shifts = (shiftConfig && Array.isArray(shiftConfig.shifts) && shiftConfig.shifts.length)
        ? shiftConfig.shifts
        : ['Full Day'];
    

    return `
      
      
      <div class="px-3 sm:px-4">
         <div class="flex items-center gap-1 text-sm text-gray-500 mb-6">
            <a href="/admin/school/view?id=${school.auth_id}" class="hover:text-blue-600">Back to Menu</a>
            <span>/</span>
            <span class="text-gray-900 font-bold">Classes & Sections</span>
         </div>

         <div class="mb-3">
             <form onsubmit="createClass(event)" class="border border-gray-300 p-2">
                 <div class="flex flex-col gap-1 md:flex-row md:items-end">
                     <div class="flex-1 min-w-[220px]">
                         <input type="text" name="class_name" placeholder="Class Name (e.g. Class 10)" required class="w-full border border-gray-300 px-2 py-1 text-sm">
                     </div>
                     <div class="flex flex-wrap items-center gap-1">
                         <label class="inline-flex items-center gap-1 text-xs">
                             <input type="checkbox" name="has_groups" id="has_groups" class="w-4 h-4">
                             <span>Has Groups</span>
                         </label>
                         ${shiftsEnabled ? `
                         <label class="inline-flex items-center gap-1 text-xs">
                             <span>Shift</span>
                             <select name="shift_name" id="shift_name" class="border border-gray-300 px-2 py-1 text-sm">
                                 ${shifts.map(shift => `<option value="${shift}">${shift}</option>`).join('')}
                             </select>
                         </label>
                         ` : `<input type="hidden" name="shift_name" value="Full Day">`}
                     </div>
                     <button type="submit" class="bg-gray-800 text-white px-3 py-1 text-xs w-full md:w-auto text-center leading-tight">
                         Create Class
                     </button>
                 </div>
             </form>
         </div>

         <div class="space-y-3" id="classes-hierarchy">
             <div class="bg-white border border-gray-200 p-8 text-center">
                 <p class="text-gray-400">Loading classes...</p>
             </div>
         </div>
      </div>

      <div id="addGroupModal" class="fixed inset-0 bg-black/60 z-[9999] hidden flex items-center justify-center px-4">
          <div class="bg-white border border-gray-300 w-full max-w-md p-4 relative">
              <h3 class="font-bold mb-3">Add Group</h3>
              <form onsubmit="addGroup(event)">
                  <input type="hidden" name="class_id" id="group_class_id">
                  <div class="mb-3">
                      <input type="text" name="group_name" required class="w-full border border-gray-300 px-2 py-1" placeholder="e.g. Science, Arts">
                  </div>
                  <div class="flex gap-1">
                      <button type="submit" class="bg-green-600 text-white px-3 py-1 text-sm" id="addGroupBtn" data-default="Add Group">Add Group</button>
                      <button type="button" onclick="closeModal('addGroupModal')" class="bg-gray-200 text-gray-800 px-3 py-1 text-sm">Cancel</button>
                  </div>
              </form>
          </div>
      </div>

      <div id="addSectionModal" class="fixed inset-0 bg-black/60 z-[9999] hidden flex items-center justify-center px-4">
          <div class="bg-white border border-gray-300 w-full max-w-md p-4 relative">
              <h3 class="font-bold mb-3">Add Section</h3>
              <form onsubmit="addSection(event)">
                  <input type="hidden" name="class_id" id="section_class_id">
                  <input type="hidden" name="group_id" id="section_group_id">
                  
                  <div class="mb-3">
                      <input type="text" name="section_name" required class="w-full border border-gray-300 px-2 py-1" placeholder="e.g. A, B">
                  </div>
                  
                  <div class="flex gap-1">
                      <button type="submit" class="bg-blue-600 text-white px-3 py-1 text-sm" id="addSectionBtn" data-default="Add Section">Add Section</button>
                      <button type="button" onclick="closeModal('addSectionModal')" class="bg-gray-200 text-gray-800 px-3 py-1 text-sm">Cancel</button>
                  </div>
              </form>
          </div>
      </div>

      <div id="editClassModal" class="fixed inset-0 bg-black/60 z-[9999] hidden flex items-center justify-center px-4">
          <div class="bg-white border border-gray-300 w-full max-w-md p-4 relative">
              <h3 class="font-bold mb-3">Edit Class</h3>
              <form onsubmit="editClass(event)">
                  <input type="hidden" name="class_id" id="edit_class_id">
                  <div class="mb-3">
                      <label class="block text-sm font-medium mb-1">Class Name</label>
                      <input type="text" name="class_name" required class="w-full border border-gray-300 px-2 py-1" placeholder="e.g. Class 10">
                  </div>
                  <div class="flex items-center gap-1 mb-2">
                      <input type="checkbox" name="has_groups" id="edit_has_groups">
                      <label for="edit_has_groups" class="text-sm">Has Groups</label>
                  </div>
                  ${shiftsEnabled ? `
                  <div class="mb-3">
                      <label class="block text-xs text-gray-600 mb-1">Shift</label>
                      <select name="shift_name" id="edit_shift_name" class="w-full border border-gray-300 px-2 py-1 text-sm">
                          ${shifts.map(shift => `<option value="${shift}">${shift}</option>`).join('')}
                      </select>
                  </div>
                  ` : `<input type="hidden" name="shift_name" value="Full Day">`}
                  <div class="flex gap-1">
                      <button type="submit" class="bg-yellow-600 text-white px-3 py-1 text-sm" id="editClassBtn" data-default="Save Changes">Save Changes</button>
                      <button type="button" onclick="closeModal('editClassModal')" class="bg-gray-200 text-gray-800 px-3 py-1 text-sm">Cancel</button>
                  </div>
              </form>
          </div>
      </div>

      <div id="editGroupModal" class="fixed inset-0 bg-black/60 z-[9999] hidden flex items-center justify-center px-4">
          <div class="bg-white border border-gray-300 w-full max-w-md p-4 relative">
              <h3 class="font-bold mb-3">Edit Group</h3>
              <form onsubmit="editGroup(event)">
                  <input type="hidden" name="group_id" id="edit_group_id">
                  <div class="mb-3">
                      <label class="block text-sm font-medium mb-1">Group Name</label>
                      <input type="text" name="group_name" required class="w-full border border-gray-300 px-2 py-1" placeholder="e.g. Science, Arts">
                  </div>
                  <div class="flex gap-1">
                      <button type="submit" class="bg-yellow-600 text-white px-3 py-1 text-sm" id="editGroupBtn" data-default="Save Changes">Save Changes</button>
                      <button type="button" onclick="closeModal('editGroupModal')" class="bg-gray-200 text-gray-800 px-3 py-1 text-sm">Cancel</button>
                  </div>
              </form>
          </div>
      </div>

      <div id="editSectionModal" class="fixed inset-0 bg-black/60 z-[9999] hidden flex items-center justify-center px-4">
          <div class="bg-white border border-gray-300 w-full max-w-md p-4 relative">
              <h3 class="font-bold mb-3">Edit Section</h3>
              <form onsubmit="editSection(event)">
                  <input type="hidden" name="section_id" id="edit_section_id">
                  <div class="mb-3">
                      <label class="block text-sm font-medium mb-1">Section Name</label>
                      <input type="text" name="section_name" required class="w-full border border-gray-300 px-2 py-1" placeholder="e.g. A, B">
                  </div>
                  <div class="flex gap-1">
                      <button type="submit" class="bg-yellow-600 text-white px-3 py-1 text-sm" id="editSectionBtn" data-default="Save Changes">Save Changes</button>
                      <button type="button" onclick="closeModal('editSectionModal')" class="bg-gray-200 text-gray-800 px-3 py-1 text-sm">Cancel</button>
                  </div>
              </form>
          </div>
      </div>

      <div id="dependencyModal" class="fixed inset-0 bg-black/60 z-[9999] hidden flex items-center justify-center px-4">
          <div class="bg-white border border-gray-300 w-full max-w-lg p-4 relative">
              <h3 class="font-bold mb-3 text-red-600">&#9888; Dependency Warning</h3>
              <div id="dependencyDetails" class="mb-4">
              </div>
              <div class="flex gap-1">
                  <button onclick="forceDelete()" class="bg-red-600 text-white px-3 py-1 text-sm" id="forceDeleteBtn">Force Delete</button>
                  <button onclick="closeModal('dependencyModal')" class="bg-gray-200 text-gray-800 px-3 py-1 text-sm">Cancel</button>
              </div>
          </div>
      </div>

      <script>
        const SCHOOL_ID = ${school.id};
        const ADMIN_CLASSES = ${JSON.stringify(classesData || []).replace(/</g, '\\u003c')};
        const ADMIN_GROUPS = ${JSON.stringify(groupsData || []).replace(/</g, '\\u003c')};
        const ADMIN_SECTIONS = ${JSON.stringify(sectionsData || []).replace(/</g, '\\u003c')};

        function escapeHtmlClient(text) {
            if (text === null || text === undefined) return '';
            let value = String(text);
            value = value.split('&').join('&amp;');
            value = value.split('<').join('&lt;');
            value = value.split('>').join('&gt;');
            value = value.split('"').join('&quot;');
            value = value.split("'").join('&#39;');
            return value;
        }

        function escapeJsString(text) {
            if (text === null || text === undefined) return '';
            let value = String(text);
            value = value.split('\\\\').join('\\\\\\\\');
            value = value.split("'").join("\\'");
            return value;
        }

        function buildHierarchyHtml() {
            if (!ADMIN_CLASSES.length) {
                return '<div class="bg-white border border-gray-200 p-8 text-center">' +
                    '<p class="text-gray-400">No classes found</p>' +
                '</div>';
            }

            const classGroups = {};
            ADMIN_GROUPS.forEach(g => {
                if (!classGroups[g.class_id]) classGroups[g.class_id] = [];
                classGroups[g.class_id].push(g);
            });

            const classSections = {};
            ADMIN_SECTIONS.forEach(s => {
                if (!classSections[s.class_id]) classSections[s.class_id] = [];
                classSections[s.class_id].push(s);
            });

            const sortedClasses = ADMIN_CLASSES.slice().sort((a, b) => {
                return String(a.class_name || '').localeCompare(String(b.class_name || ''));
            });

            return sortedClasses.map(cls => {
                const groups = classGroups[cls.id] || [];
                const sections = classSections[cls.id] || [];
                const sectionsByGroup = {};
                groups.forEach(g => {
                    sectionsByGroup[g.id] = sections.filter(s => s.group_id === g.id);
                });
                const sectionsWithoutGroup = sections.filter(s => !s.group_id);
                const className = escapeHtmlClient(cls.class_name);
                const classNameJs = escapeJsString(cls.class_name);
                const shiftLabel = escapeHtmlClient(cls.shift_name || 'Full Day');
                const shiftNameJs = escapeJsString(cls.shift_name || 'Full Day');
                const hasGroups = Number(cls.has_groups) === 1;

                const groupBlocks = groups.map(g => {
                    const groupSections = sectionsByGroup[g.id] || [];
                    const groupName = escapeHtmlClient(g.group_name);
                    const groupNameJs = escapeJsString(g.group_name);
                    const sectionChips = groupSections.map(s => {
                        const sectionName = escapeHtmlClient(s.section_name);
                        const sectionNameJs = escapeJsString(s.section_name);
                        return '<span class="border border-gray-300 px-2 py-1 text-sm flex items-center gap-1">' +
                            sectionName +
                            '<button onclick="openEditSectionModal(' + s.id + ', \\''
                            + sectionNameJs + '\\')" class="text-xs text-yellow-600 hover:text-yellow-800">&#9998;</button>' +
                            '<button onclick="deleteSection(' + s.id + ')" class="text-xs text-red-500 hover:text-red-700">&times;</button>' +
                        '</span>';
                    }).join('');

                    return '<div class="border-l-2 border-gray-400 pl-2">' +
                        '<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-1">' +
                            '<div class="flex flex-col sm:flex-row sm:items-center gap-1">' +
                                '<span class="font-semibold text-sm md:text-base">' + groupName + '</span>' +
                                '<span class="text-xs text-gray-500">(' + groupSections.length + ' sections)</span>' +
                            '</div>' +
                            '<div class="flex flex-col sm:flex-row sm:items-center gap-1">' +
                                '<button onclick="openEditGroupModal(' + g.id + ', \\''
                                + groupNameJs + '\\')" class="text-[11px] bg-yellow-600 text-white px-2 py-1 leading-tight w-full sm:w-auto text-center">Edit</button>' +
                                '<button onclick="deleteGroup(' + g.id + ')" class="text-[11px] bg-red-600 text-white px-2 py-1 leading-tight w-full sm:w-auto text-center">Delete</button>' +
                                '<button onclick="openAddSectionModalForGroup(' + cls.id + ', \\''
                                + classNameJs + '\\', ' + g.id + ', \\''
                                + groupNameJs + '\\')" class="text-[11px] bg-blue-600 text-white px-2 py-1 leading-tight w-full sm:w-auto text-center">+ Add Section</button>' +
                            '</div>' +
                        '</div>' +
                        '<div class="flex flex-wrap gap-1">' + sectionChips + '</div>' +
                    '</div>';
                }).join('');

                const noGroupSections = sectionsWithoutGroup.map(s => {
                    const sectionName = escapeHtmlClient(s.section_name);
                    const sectionNameJs = escapeJsString(s.section_name);
                    return '<span class="border border-gray-300 px-2 py-1 text-sm flex items-center gap-1">' +
                        sectionName +
                        '<button onclick="openEditSectionModal(' + s.id + ', \\''
                        + sectionNameJs + '\\')" class="text-xs text-yellow-600 hover:text-yellow-800">&#9998;</button>' +
                        '<button onclick="deleteSection(' + s.id + ')" class="text-xs text-red-500 hover:text-red-700">&times;</button>' +
                    '</span>';
                }).join('');

                const noGroupBlock = sectionsWithoutGroup.length > 0
                    ? '<div class="border-l-2 border-gray-400 pl-2">' +
                        '<div class="mb-1">' +
                            '<span class="font-semibold">No Group</span>' +
                            '<span class="text-xs text-gray-500 ml-2">(' + sectionsWithoutGroup.length + ' sections)</span>' +
                        '</div>' +
                        '<div class="flex flex-wrap gap-1">' + noGroupSections + '</div>' +
                      '</div>'
                    : '';

                const emptyBlock = (groups.length === 0 && sectionsWithoutGroup.length === 0)
                    ? '<div class="text-center py-4 text-gray-400 text-sm">No groups or sections added yet</div>'
                    : '';

                return '<div class="mb-3 border border-gray-300">' +
                    '<div class="bg-gray-100 px-2 py-2 border-b">' +
                        '<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-1">' +
                            '<div class="grid grid-cols-1 sm:auto-cols-max sm:grid-flow-col gap-px bg-gray-300 p-px">' +
                                '<span class="font-bold text-sm md:text-base">' + className + '</span>' +
                                '<span class="text-[11px] text-gray-500">(' + groups.length + ' groups, ' + sections.length + ' sections)</span>' +
                                '<span class="inline-flex items-center gap-1 border border-gray-300 px-1 py-0.5 text-[10px] text-gray-600 bg-white">' +
                                    '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
                                        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 10h10M7 14h10M5 6h14M5 18h14" />' +
                                    '</svg>' +
                                    'Shift: ' + shiftLabel +
                                '</span>' +
                            '</div>' +
                            '<div class="grid grid-cols-1 sm:auto-cols-max sm:grid-flow-col gap-px bg-gray-300 p-px">' +
                                '<button onclick="openEditClassModal(' + cls.id + ', \\'' 
                                + classNameJs + '\\', ' + (hasGroups ? 1 : 0) + ', \\'' + shiftNameJs + '\\')" class="text-[11px] bg-yellow-600 text-white px-2 py-1 leading-tight w-full sm:w-auto text-center">Edit</button>' +
                                '<button onclick="deleteClass(' + cls.id + ')" class="text-[11px] bg-red-600 text-white px-2 py-1 leading-tight w-full sm:w-auto text-center">Delete</button>' +
                                (hasGroups
                                    ? '<button onclick="openAddGroupModal(' + cls.id + ', \\'' 
                                      + classNameJs + '\\')" class="text-[11px] bg-green-600 text-white px-2 py-1 leading-tight w-full sm:w-auto text-center">+ Add Group</button>'
                                    : '<button onclick="openAddSectionModal(' + cls.id + ', \\'' 
                                      + classNameJs + '\\', ' + (hasGroups ? 1 : 0) + ')" class="text-[11px] bg-blue-600 text-white px-2 py-1 leading-tight w-full sm:w-auto text-center">+ Add Section</button>'
                                  ) +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="p-2">' +
                        (groups.length > 0 ? '<div class="space-y-1">' + groupBlocks + '</div>' : '') +
                        noGroupBlock +
                        emptyBlock +
                    '</div>' +
                '</div>';
            }).join('');
        }

        function renderHierarchy() {
            const container = document.getElementById('classes-hierarchy');
            if (!container) return;
            container.innerHTML = buildHierarchyHtml();
        }

        function findById(list, id) {
            return list.find(item => Number(item.id) === Number(id));
        }

        function updateById(list, id, updates) {
            const item = findById(list, id);
            if (item) Object.assign(item, updates);
            return item;
        }

        function removeById(list, id) {
            const index = list.findIndex(item => Number(item.id) === Number(id));
            if (index >= 0) list.splice(index, 1);
            return index >= 0;
        }

        function removeClassData(classId) {
            const classIdNum = Number(classId);
            removeById(ADMIN_CLASSES, classIdNum);

            const removedGroupIds = new Set();
            for (let i = ADMIN_GROUPS.length - 1; i >= 0; i--) {
                if (Number(ADMIN_GROUPS[i].class_id) === classIdNum) {
                    removedGroupIds.add(Number(ADMIN_GROUPS[i].id));
                    ADMIN_GROUPS.splice(i, 1);
                }
            }

            for (let i = ADMIN_SECTIONS.length - 1; i >= 0; i--) {
                const section = ADMIN_SECTIONS[i];
                if (Number(section.class_id) === classIdNum || removedGroupIds.has(Number(section.group_id))) {
                    ADMIN_SECTIONS.splice(i, 1);
                }
            }
        }

        function removeGroupData(groupId) {
            const groupIdNum = Number(groupId);
            removeById(ADMIN_GROUPS, groupIdNum);
            for (let i = ADMIN_SECTIONS.length - 1; i >= 0; i--) {
                if (Number(ADMIN_SECTIONS[i].group_id) === groupIdNum) {
                    ADMIN_SECTIONS.splice(i, 1);
                }
            }
        }

        function removeSectionData(sectionId) {
            removeById(ADMIN_SECTIONS, sectionId);
        }

        function applyLocalDelete(action, id) {
            if (action === 'delete_class') {
                removeClassData(id);
                return;
            }
            if (action === 'delete_group') {
                removeGroupData(id);
                return;
            }
            if (action === 'delete_section') {
                removeSectionData(id);
            }
        }

        function createClass(e) {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button[type="submit"]');
            if (submitBtn.disabled) return;
            
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
                    const classId = response.class?.id ?? response.id;
                    if (classId) {
                        ADMIN_CLASSES.push({
                            id: classId,
                            class_name: data.class_name,
                            has_groups: data.has_groups ? 1 : 0,
                            shift_name: data.shift_name || 'Full Day'
                        });
                        renderHierarchy();
                        showToast('Class created successfully.', 'success');
                    } else {
                        showToast('Class created. Refresh to see updates.', 'info');
                    }
                    e.target.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Create Class';
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
            if (submitBtn.disabled) return;
            
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
                    const groupId = response.group?.id ?? response.id;
                    if (groupId) {
                        ADMIN_GROUPS.push({
                            id: groupId,
                            class_id: Number(data.class_id),
                            group_name: data.group_name
                        });
                        renderHierarchy();
                        showToast('Group added successfully.', 'success');
                    } else {
                        showToast('Group added. Refresh to see updates.', 'info');
                    }
                    closeModal('addGroupModal');
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
            if (submitBtn.disabled) return;
            
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
                    const sectionId = response.section?.id ?? response.id;
                    if (sectionId) {
                        ADMIN_SECTIONS.push({
                            id: sectionId,
                            class_id: Number(data.class_id),
                            group_id: data.group_id ? Number(data.group_id) : null,
                            section_name: data.section_name
                        });
                        renderHierarchy();
                        showToast('Section added successfully.', 'success');
                    } else {
                        showToast('Section added. Refresh to see updates.', 'info');
                    }
                    closeModal('addSectionModal');
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
                    applyLocalDelete('delete_class', id);
                    renderHierarchy();
                    showToast('Class deleted successfully.', 'success');
                } else if (response.dependencies && Array.isArray(response.dependencies)) {
                    showDependencyWarning(response.dependencies, 'delete_class', id);
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
                    applyLocalDelete('delete_group', id);
                    renderHierarchy();
                    showToast('Group deleted successfully.', 'success');
                } else if (response.dependencies && Array.isArray(response.dependencies)) {
                    showDependencyWarning(response.dependencies, 'delete_group', id);
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
                    applyLocalDelete('delete_section', id);
                    renderHierarchy();
                    showToast('Section deleted successfully.', 'success');
                } else if (response.dependencies && Array.isArray(response.dependencies)) {
                    showDependencyWarning(response.dependencies, 'delete_section', id);
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
                return '<li class="text-sm text-gray-600">&bull; ' + dep.message + '</li>';
            }).join('');
            
            detailsDiv.innerHTML = 
                '<p class="text-sm text-gray-700 mb-3">This item cannot be deleted because it has the following dependencies:</p>' +
                '<ul class="list-disc pl-5 mb-4">' +
                    dependencyList +
                '</ul>' +
                '<p class="text-sm text-red-600 font-medium">&#9888; Force deleting will permanently remove all dependent data!</p>';
            
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
                    applyLocalDelete(action, id);
                    renderHierarchy();
                    showToast('Deleted successfully.', 'success');
                    closeModal('dependencyModal');
                    window.pendingDelete = null;
                    forceBtn.disabled = false;
                    forceBtn.textContent = 'Force Delete';
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

        function openEditClassModal(classId, className, hasGroups, shiftName) {
            document.getElementById('edit_class_id').value = classId;
            document.querySelector('#editClassModal input[name="class_name"]').value = className;
            document.getElementById('edit_has_groups').checked = Boolean(Number(hasGroups));
            const shiftSelect = document.getElementById('edit_shift_name');
            if (shiftSelect && shiftName) {
                shiftSelect.value = shiftName;
            }
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
                    updateById(ADMIN_CLASSES, data.class_id, {
                        class_name: data.class_name,
                        has_groups: data.has_groups ? 1 : 0
                    });
                    renderHierarchy();
                    showToast('Class updated successfully.', 'success');
                    closeModal('editClassModal');
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
                    updateById(ADMIN_GROUPS, data.group_id, {
                        group_name: data.group_name
                    });
                    renderHierarchy();
                    showToast('Group updated successfully.', 'success');
                    closeModal('editGroupModal');
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
                    updateById(ADMIN_SECTIONS, data.section_id, {
                        section_name: data.section_name
                    });
                    renderHierarchy();
                    showToast('Section updated successfully.', 'success');
                    closeModal('editSectionModal');
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
                submitBtn.textContent = submitBtn.dataset.default || submitBtn.textContent;
            }
            const form = modal.querySelector('form');
            if (form) form.reset();
        }

        renderHierarchy();

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

        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('fixed') && e.target.classList.contains('inset-0')) {
                closeModal(e.target.id);
            }
        });

        function showToast(message, type = 'success') {
            const toast = document.createElement('div');
            const bgColor = type === 'success' ? 'bg-green-600' : 
                          type === 'error' ? 'bg-red-600' : 
                          type === 'info' ? 'bg-blue-600' : 'bg-gray-600';
            
            toast.className = 'fixed top-4 right-4 px-4 py-2 text-white z-[10000] success-message ' + bgColor;
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                document.querySelector('input[name="class_name"]').focus();
            }
        });
      </script>
    `;
}



// src/ui/institute/teachers_assignment.js - Teacher Assignment Management

function escapeHtml(text) {
    if (!text) return '';
    return text.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function TeachersAssignmentPageHTML(school, classes = [], groups = [], sections = [], subjects = [], classSubjects = [], groupSubjects = [], teachers = [], teacherSubjects = [], teacherAssignments = []) {
    
    // Create lookup objects
    const groupsByClass = {};
    groups.forEach(g => {
        if (!groupsByClass[g.class_id]) groupsByClass[g.class_id] = [];
        groupsByClass[g.class_id].push(g);
    });
    
    const sectionsByGroup = {};
    sections.forEach(s => {
        if (!sectionsByGroup[s.group_id]) sectionsByGroup[s.group_id] = [];
        sectionsByGroup[s.group_id].push(s);
    });
    
    const subjectsById = {};
    subjects.forEach(s => {
        subjectsById[s.id] = s;
    });
    
    const teachersById = {};
    teachers.forEach(t => {
        teachersById[t.id] = t;
    });
    
    // Helper function to find existing assignments (multiple teachers per subject)
    function findAssignments(classId, groupId, sectionId, subjectId) {
        return teacherAssignments.filter(ta => 
            ta.class_id === classId &&
            (ta.group_id === groupId || (ta.group_id === null && groupId === null)) &&
            (ta.section_id === sectionId || (ta.section_id === null && sectionId === null)) &&
            ta.subject_id === subjectId
        );
    }
    
    // Build hierarchical table HTML
    let tableHTML = '';
    let lastClassId = null;
    let lastGroupId = null;
    
    // Sort by class, then group, then subject for proper hierarchy
    const sortedClasses = classes.sort((a, b) => a.class_name.localeCompare(b.class_name));
    
    sortedClasses.forEach(cls => {
        const classGroups = groupsByClass[cls.id] || [];
        
        // Handle class-level subjects (no group)
        const classSubjectsList = classSubjects.filter(cs => cs.class_id === cls.id);
        const classSections = sections.filter(s => s.class_id === cls.id && !s.group_id);
        
        if (classSubjectsList.length > 0) {
            // Class header
            tableHTML += `
                <tr class="bg-gray-50 font-semibold">
                    <td class="p-3 border" colspan="4">${escapeHtml(cls.class_name)}</td>
                    <td class="p-3 border"></td>
                </tr>
            `;
            
            classSubjectsList.forEach(cs => {
                const subject = subjectsById[cs.subject_id];
                if (!subject) return;
                
                if (classSections.length === 0) {
                    // No sections, create one row for the class
                    const existingAssignments = findAssignments(cls.id, null, null, subject.id);
                    tableHTML += `
                        <tr class="border-b">
                            <td class="p-3 border"></td>
                            <td class="p-3 border"></td>
                            <td class="p-3 border"></td>
                            <td class="p-3 border">${escapeHtml(subject.subject_name)}</td>
                            <td class="p-3 border">
                                ${existingAssignments.length === 0 ? `
                                        <div class="flex items-center gap-2">
                                            <span class="text-purple-700 font-medium bg-purple-100 px-2 py-1 rounded">🤖 Auto</span>
                                            <button type="button" onclick="assignTeacher('class-${cls.id}-${subject.id}')" 
                                                    class="bg-green-600 text-white px-2 py-1 text-xs">
                                                Assign Teacher
                                            </button>
                                        </div>
                                    ` : `
                                    <div class="space-y-1">
                                        ${existingAssignments.map(assignment => `
                                            <div class="flex items-center gap-2">
                                                ${assignment.is_auto ? 
                                                    `<span class="text-purple-700 font-medium bg-purple-100 px-2 py-1 rounded">🤖 Auto</span>` :
                                                    `<span class="text-green-700 font-medium">${escapeHtml(assignment.teacher_name || 'Unknown')}</span>`
                                                }
                                                <button type="button" onclick="replaceTeacher(${assignment.id}, '${assignment.is_auto ? 'Auto' : escapeHtml(assignment.teacher_name)}', 'class-${cls.id}-${subject.id}')" 
                                                        class="bg-orange-600 text-white px-2 py-1 text-xs">
                                                    Replace
                                                </button>
                                                <button type="button" onclick="removeTeacher(${assignment.id}, '${assignment.is_auto ? 'Auto' : escapeHtml(assignment.teacher_name)}')" 
                                                        class="bg-red-600 text-white px-2 py-1 text-xs">
                                                    Remove
                                                </button>
                                            </div>
                                        `).join('')}
                                        <div class="flex gap-1 mt-1">
                                            <button type="button" onclick="assignTeacher('class-${cls.id}-${subject.id}')" 
                                                    class="bg-green-600 text-white px-2 py-1 text-xs">
                                                Add Teacher
                                            </button>
                                            <button type="button" onclick="assignAuto('class-${cls.id}-${subject.id}')" 
                                                    class="bg-purple-600 text-white px-2 py-1 text-xs">
                                                Set Auto
                                            </button>
                                        </div>
                                    </div>
                                `}
                            </td>
                        </tr>
                    `;
                } else {
                    // Create rows for each section
                    classSections.forEach(section => {
                        const existingAssignments = findAssignments(cls.id, null, section.id, subject.id);
                        tableHTML += `
                            <tr class="border-b">
                                <td class="p-3 border"></td>
                                <td class="p-3 border"></td>
                                <td class="p-3 border">${escapeHtml(section.section_name)}</td>
                                <td class="p-3 border">${escapeHtml(subject.subject_name)}</td>
                                <td class="p-3 border">
                                    ${existingAssignments.length === 0 ? `
                                        <div class="flex items-center gap-2">
                                            <span class="text-purple-700 font-medium bg-purple-100 px-2 py-1 rounded">🤖 Auto</span>
                                            <button type="button" onclick="assignTeacher('section-${section.id}-${subject.id}')" 
                                                    class="bg-green-600 text-white px-2 py-1 text-xs">
                                                Assign Teacher
                                            </button>
                                        </div>
                                    ` : `
                                        <div class="space-y-1">
                                            ${existingAssignments.map(assignment => `
                                                <div class="flex items-center gap-2">
                                                    ${assignment.is_auto ? 
                                                        `<span class="text-purple-700 font-medium bg-purple-100 px-2 py-1 rounded">🤖 Auto</span>` :
                                                        `<span class="text-green-700 font-medium">${escapeHtml(assignment.teacher_name || 'Unknown')}</span>`
                                                    }
                                                    <button type="button" onclick="replaceTeacher(${assignment.id}, '${assignment.is_auto ? 'Auto' : escapeHtml(assignment.teacher_name)}', 'section-${section.id}-${subject.id}')" 
                                                            class="bg-orange-600 text-white px-2 py-1 text-xs">
                                                        Replace
                                                    </button>
                                                    <button type="button" onclick="removeTeacher(${assignment.id}, '${assignment.is_auto ? 'Auto' : escapeHtml(assignment.teacher_name)}')" 
                                                            class="bg-red-600 text-white px-2 py-1 text-xs">
                                                        Remove
                                                    </button>
                                                </div>
                                            `).join('')}
                                            <div class="flex gap-1 mt-1">
                                                <button type="button" onclick="assignTeacher('section-${section.id}-${subject.id}')" 
                                                        class="bg-green-600 text-white px-2 py-1 text-xs">
                                                    Add Teacher
                                                </button>
                                                <button type="button" onclick="assignAuto('section-${section.id}-${subject.id}')" 
                                                        class="bg-purple-600 text-white px-2 py-1 text-xs">
                                                    Set Auto
                                                </button>
                                            </div>
                                        </div>
                                    `}
                                </td>
                            </tr>
                        `;
                    });
                }
            });
        }
        
        // Handle group-level subjects
        const sortedGroups = classGroups.sort((a, b) => a.group_name.localeCompare(b.group_name));
        
        sortedGroups.forEach(group => {
            const groupSubjectsList = groupSubjects.filter(gs => gs.group_id === group.id);
            const groupSections = sectionsByGroup[group.id] || [];
            
            if (groupSubjectsList.length > 0) {
                // Group header (only show class if different from last)
                if (lastClassId !== cls.id) {
                    tableHTML += `
                        <tr class="bg-gray-50 font-semibold">
                            <td class="p-3 border">${escapeHtml(cls.class_name)}</td>
                            <td class="p-3 border" colspan="3"></td>
                            <td class="p-3 border"></td>
                        </tr>
                    `;
                    lastClassId = cls.id;
                }
                
                // Group name header
                tableHTML += `
                    <tr class="bg-gray-100">
                        <td class="p-3 border"></td>
                        <td class="p-3 border font-medium">${escapeHtml(group.group_name)}</td>
                        <td class="p-3 border" colspan="2"></td>
                        <td class="p-3 border"></td>
                    </tr>
                `;
                
                groupSubjectsList.forEach(gs => {
                    const subject = subjectsById[gs.subject_id];
                    if (!subject) return;
                    
                    if (groupSections.length === 0) {
                        // No sections, create one row for the group
                        const existingAssignments = findAssignments(cls.id, group.id, null, subject.id);
                        tableHTML += `
                            <tr class="border-b">
                                <td class="p-3 border"></td>
                                <td class="p-3 border"></td>
                                <td class="p-3 border"></td>
                                <td class="p-3 border">${escapeHtml(subject.subject_name)}</td>
                                <td class="p-3 border">
                                    ${existingAssignments.length === 0 ? `
                                        <div class="flex items-center gap-2">
                                            <span class="text-purple-700 font-medium bg-purple-100 px-2 py-1 rounded">🤖 Auto</span>
                                            <button type="button" onclick="assignTeacher('group-${group.id}-${subject.id}')" 
                                                    class="bg-green-600 text-white px-2 py-1 text-xs">
                                                Assign Teacher
                                            </button>
                                        </div>
                                    ` : `
                                        <div class="space-y-1">
                                            ${existingAssignments.map(assignment => `
                                                <div class="flex items-center gap-2">
                                                    ${assignment.is_auto ? 
                                                        `<span class="text-purple-700 font-medium bg-purple-100 px-2 py-1 rounded">🤖 Auto</span>` :
                                                        `<span class="text-green-700 font-medium">${escapeHtml(assignment.teacher_name || 'Unknown')}</span>`
                                                    }
                                                    <button type="button" onclick="replaceTeacher(${assignment.id}, '${assignment.is_auto ? 'Auto' : escapeHtml(assignment.teacher_name)}', 'group-${group.id}-${subject.id}')" 
                                                            class="bg-orange-600 text-white px-2 py-1 text-xs">
                                                        Replace
                                                    </button>
                                                    <button type="button" onclick="removeTeacher(${assignment.id}, '${assignment.is_auto ? 'Auto' : escapeHtml(assignment.teacher_name)}')" 
                                                            class="bg-red-600 text-white px-2 py-1 text-xs">
                                                        Remove
                                                    </button>
                                                </div>
                                            `).join('')}
                                            <div class="flex gap-1 mt-1">
                                                <button type="button" onclick="assignTeacher('group-${group.id}-${subject.id}')" 
                                                        class="bg-green-600 text-white px-2 py-1 text-xs">
                                                    Add Teacher
                                                </button>
                                                <button type="button" onclick="assignAuto('group-${group.id}-${subject.id}')" 
                                                        class="bg-purple-600 text-white px-2 py-1 text-xs">
                                                    Set Auto
                                                </button>
                                            </div>
                                        </div>
                                    `}
                                </td>
                            </tr>
                        `;
                    } else {
                        // Create rows for each section in the group
                        groupSections.forEach(section => {
                            const existingAssignments = findAssignments(cls.id, group.id, section.id, subject.id);
                            tableHTML += `
                                <tr class="border-b">
                                    <td class="p-3 border"></td>
                                    <td class="p-3 border"></td>
                                    <td class="p-3 border">${escapeHtml(section.section_name)}</td>
                                    <td class="p-3 border">${escapeHtml(subject.subject_name)}</td>
                                    <td class="p-3 border">
                                        ${existingAssignments.length === 0 ? `
                                            <div class="flex items-center gap-2">
                                                <span class="text-purple-700 font-medium bg-purple-100 px-2 py-1 rounded">🤖 Auto</span>
                                                <button type="button" onclick="assignTeacher('section-${section.id}-${subject.id}')" 
                                                        class="bg-green-600 text-white px-2 py-1 text-xs">
                                                    Assign Teacher
                                                </button>
                                            </div>
                                        ` : `
                                            <div class="space-y-1">
                                                ${existingAssignments.map(assignment => `
                                                    <div class="flex items-center gap-2">
                                                        ${assignment.is_auto ? 
                                                            `<span class="text-purple-700 font-medium bg-purple-100 px-2 py-1 rounded">🤖 Auto</span>` :
                                                            `<span class="text-green-700 font-medium">${escapeHtml(assignment.teacher_name || 'Unknown')}</span>`
                                                        }
                                                        <button type="button" onclick="replaceTeacher(${assignment.id}, '${assignment.is_auto ? 'Auto' : escapeHtml(assignment.teacher_name)}', 'section-${section.id}-${subject.id}')" 
                                                                class="bg-orange-600 text-white px-2 py-1 text-xs">
                                                            Replace
                                                        </button>
                                                        <button type="button" onclick="removeTeacher(${assignment.id}, '${assignment.is_auto ? 'Auto' : escapeHtml(assignment.teacher_name)}')" 
                                                                class="bg-red-600 text-white px-2 py-1 text-xs">
                                                            Remove
                                                        </button>
                                                    </div>
                                                `).join('')}
                                                <button type="button" onclick="assignTeacher('section-${section.id}-${subject.id}')" 
                                                        class="bg-green-600 text-white px-2 py-1 text-xs mt-1">
                                                    Add More
                                                </button>
                                            </div>
                                        `}
                                    </td>
                                </tr>
                            `;
                        });
                    }
                });
            }
        });
    });

    return `
      <div class="p-6">
          <div class="flex justify-between items-center mb-6">
              <h1 class="text-xl font-bold">Teacher Assignment</h1>
              <div class="flex gap-2">
                  <button type="button" onclick="showTeachersList()" class="bg-gray-600 text-white px-4 py-2">
                      Teacher's List
                  </button>
                  <button type="button" onclick="showAddTeacherForm()" class="bg-blue-600 text-white px-4 py-2">
                      Add Teacher
                  </button>
              </div>
          </div>

          <!-- Assignment Table -->
          <div class="border">
              <table class="w-full border-collapse">
                  <thead class="bg-gray-100">
                      <tr>
                          <th class="border p-3 text-left">Class</th>
                          <th class="border p-3 text-left">Group</th>
                          <th class="border p-3 text-left">Section</th>
                          <th class="border p-3 text-left">Subject</th>
                          <th class="border p-3 text-left">Action</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${tableHTML.length > 0 ? tableHTML : `
                          <tr>
                              <td colspan="5" class="border p-8 text-center text-gray-500">
                                  No subjects found in curriculum. Please add subjects to classes first.
                              </td>
                          </tr>
                      `}
                  </tbody>
              </table>
          </div>
      </div>

      <!-- Add Teacher Modal -->
      <div id="add-teacher-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
          <div class="bg-white rounded max-w-md w-full">
              <div class="p-4 border-b">
                  <h3 class="font-semibold">Add New Teacher</h3>
              </div>
              <div class="p-4">
                  <form onsubmit="addTeacher(event)" class="space-y-4">
                      <div>
                          <label class="block text-sm font-medium mb-2">Full Name *</label>
                          <input type="text" name="full_name" required 
                                 class="w-full border px-3 py-2">
                      </div>
                      <div>
                          <label class="block text-sm font-medium mb-2">Email *</label>
                          <input type="email" name="email" required 
                                 class="w-full border px-3 py-2">
                      </div>
                      <div>
                          <label class="block text-sm font-medium mb-2">Phone</label>
                          <input type="text" name="phone" 
                                 class="w-full border px-3 py-2">
                      </div>
                      <div class="flex gap-2 pt-2 border-t">
                          <button type="submit" class="bg-blue-600 text-white px-4 py-2">
                              Add Teacher
                          </button>
                          <button type="button" onclick="closeAddTeacherModal()" class="bg-gray-200 text-gray-800 px-4 py-2">
                              Cancel
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      </div>

      <!-- Assign Teacher Modal -->
      <div id="assign-teacher-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
          <div class="bg-white rounded max-w-md w-full">
              <div class="p-4 border-b">
                  <h3 class="font-semibold">Assign Teacher</h3>
                  <p class="text-sm text-gray-600" id="assignment-details"></p>
              </div>
              <div class="p-4">
                  <form onsubmit="saveAssignment(event)" class="space-y-4">
                      <input type="hidden" id="assignment-data">
                      <div>
                          <label class="block text-sm font-medium mb-2">Select Teacher *</label>
                          <select id="teacher-select" required class="w-full border px-3 py-2">
                              <option value="">Select teacher...</option>
                              ${teachers.map(t => `<option value="${t.id}">${escapeHtml(t.full_name)}</option>`).join('')}
                          </select>
                      </div>
                      <div class="flex gap-2 pt-2 border-t">
                          <button type="submit" class="bg-blue-600 text-white px-4 py-2">
                              Assign
                          </button>
                          <button type="button" onclick="closeAssignModal()" class="bg-gray-200 text-gray-800 px-4 py-2">
                              Cancel
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      </div>

      <script>
        // Store assignment data for lookup
        window.assignmentData = {
            classes: ${JSON.stringify(classes)},
            groups: ${JSON.stringify(groups)},
            sections: ${JSON.stringify(sections)},
            subjects: ${JSON.stringify(subjects)},
            teachers: ${JSON.stringify(teachers)},
            teacherSubjects: ${JSON.stringify(teacherSubjects)},
            teacherAssignments: ${JSON.stringify(teacherAssignments)}
        };
        
        function showTeachersList() {
            window.location.href = '/school/teachers-list';
        }
        
        function showAddTeacherForm() {
            document.getElementById('add-teacher-modal').classList.remove('hidden');
        }
        
        function closeAddTeacherModal() {
            document.getElementById('add-teacher-modal').classList.add('hidden');
            document.querySelector('#add-teacher-modal form').reset();
        }
        
        function addTeacher(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            fetch('/school/teachers', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(r => r.json()).then(result => {
                if (result.success) {
                    closeAddTeacherModal();
                    location.reload();
                } else {
                    alert('Error: ' + (result.error || 'Unknown error'));
                }
            }).catch(err => {
                alert('Network error. Please try again.');
            });
        }
        
        function assignTeacher(assignmentId) {
            const parts = assignmentId.split('-');
            const type = parts[0]; // class, group, or section
            const id = parseInt(parts[1]);
            const subjectId = parseInt(parts[2]);
            
            let assignmentText = '';
            let assignmentData = {
                type: type,
                subject_id: subjectId
            };
            
            // Get teachers who can teach this subject
            const qualifiedTeachers = window.assignmentData.teachers.filter(t => {
                return window.assignmentData.teacherSubjects.some(ts => ts.teacher_id === t.id && ts.subject_id === subjectId);
            });
            
            if (type === 'class') {
                const cls = window.assignmentData.classes.find(c => c.id === id);
                const subject = window.assignmentData.subjects.find(s => s.id === subjectId);
                assignmentText = cls.class_name + ' - ' + subject.subject_name;
                assignmentData.class_id = id;
                assignmentData.group_id = null;
                assignmentData.section_id = null;
            } else if (type === 'group') {
                const group = window.assignmentData.groups.find(g => g.id === id);
                const cls = window.assignmentData.classes.find(c => c.id === group.class_id);
                const subject = window.assignmentData.subjects.find(s => s.id === subjectId);
                assignmentText = cls.class_name + ' - ' + group.group_name + ' - ' + subject.subject_name;
                assignmentData.class_id = cls.id;
                assignmentData.group_id = id;
                assignmentData.section_id = null;
            } else if (type === 'section') {
                const section = window.assignmentData.sections.find(s => s.id === id);
                const subject = window.assignmentData.subjects.find(s => s.id === subjectId);
                let className = '';
                let groupName = '';
                
                if (section.group_id) {
                    const group = window.assignmentData.groups.find(g => g.id === section.group_id);
                    const cls = window.assignmentData.classes.find(c => c.id === group.class_id);
                    className = cls.class_name;
                    groupName = group.group_name;
                } else {
                    const cls = window.assignmentData.classes.find(c => c.id === section.class_id);
                    className = cls.class_name;
                }
                
                assignmentText = groupName ? 
                    className + ' - ' + groupName + ' - ' + section.section_name + ' - ' + subject.subject_name :
                    className + ' - ' + section.section_name + ' - ' + subject.subject_name;
                
                assignmentData.class_id = section.class_id;
                assignmentData.group_id = section.group_id;
                assignmentData.section_id = id;
            }
            
            document.getElementById('assignment-details').textContent = assignmentText;
            document.getElementById('assignment-data').value = JSON.stringify(assignmentData);
            
            // Update teacher dropdown with qualified teachers only
            const teacherSelect = document.getElementById('teacher-select');
            teacherSelect.innerHTML = '<option value="">Select teacher...</option>';
            
            if (qualifiedTeachers.length === 0) {
                teacherSelect.innerHTML = '<option value="">No teachers qualified for this subject</option>';
                teacherSelect.disabled = true;
            } else {
                qualifiedTeachers.forEach(t => {
                    const option = document.createElement('option');
                    option.value = t.id;
                    option.textContent = t.full_name;
                    teacherSelect.appendChild(option);
                });
                teacherSelect.disabled = false;
            }
            
            document.getElementById('assign-teacher-modal').classList.remove('hidden');
        }
        
        function replaceTeacher(assignmentId, currentTeacherName, assignmentKey) {
            const assignment = JSON.parse(document.getElementById('assignment-data').value);
            
            // Set assignment details
            document.getElementById('assignment-details').textContent = 'Replace ' + currentTeacherName + ' for this subject';
            document.getElementById('assignment-data').value = JSON.stringify({
                ...assignment,
                existing_assignment_id: assignmentId,
                is_replacement: true
            });
            
            // Update teacher dropdown with qualified teachers (excluding current teacher) plus auto option
            const teacherSelect = document.getElementById('teacher-select');
            teacherSelect.innerHTML = '<option value="">Select new option...</option>';
            
            const qualifiedTeachers = window.assignmentData.teachers.filter(t => {
                return window.assignmentData.teacherSubjects.some(ts => ts.teacher_id === t.id && ts.subject_id === assignment.subject_id) && t.id !== assignmentId;
            });
            
            // Add qualified teachers
            qualifiedTeachers.forEach(t => {
                const option = document.createElement('option');
                option.value = t.id;
                option.textContent = t.full_name;
                teacherSelect.appendChild(option);
            });
            
            // Always add auto option
            const autoOption = document.createElement('option');
            autoOption.value = 'auto';
            autoOption.textContent = '🤖 Auto-assign (System will decide)';
            teacherSelect.appendChild(autoOption);
            
            if (qualifiedTeachers.length === 0 && !autoOption) {
                teacherSelect.innerHTML = '<option value="">No other options available</option>';
                teacherSelect.disabled = true;
            } else {
                teacherSelect.disabled = false;
            }
            
            document.getElementById('assign-teacher-modal').classList.remove('hidden');
        }
        
        function removeTeacher(assignmentId, teacherName) {
            if (confirm('Remove ' + teacherName + ' from this subject assignment?')) {
                fetch('/school/teacher-assignments', {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        assignment_id: assignmentId,
                        action: 'remove_teacher'
                    })
                }).then(r => r.json()).then(result => {
                    if (result.success) {
                        alert('Teacher removed successfully!');
                        location.reload();
                    } else {
                        alert('Error: ' + (result.error || 'Unknown error'));
                    }
                }).catch(err => {
                    alert('Network error. Please try again.');
                });
            }
        }
        
        function closeAssignModal() {
            document.getElementById('assign-teacher-modal').classList.add('hidden');
            document.getElementById('teacher-select').value = '';
        }
        
        function saveAssignment(e) {
            e.preventDefault();
            
            const assignment = JSON.parse(document.getElementById('assignment-data').value);
            const teacherId = document.getElementById('teacher-select').value;
            
            let data = {
                ...assignment
            };
            
            if (teacherId === 'auto') {
                // Handle auto-assignment
                if (assignment.is_replacement) {
                    data.action = 'set_auto';
                    data.assignment_id = assignment.existing_assignment_id;
                } else {
                    data.action = 'assign_auto';
                }
            } else {
                // Handle manual teacher assignment
                data.teacher_id = parseInt(teacherId);
                data.action = assignment.is_replacement ? 'replace_teacher' : 'assign_teacher';
            }
            
            fetch('/school/teacher-assignments', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(r => r.json()).then(result => {
                if (result.success) {
                    closeAssignModal();
                    const message = teacherId === 'auto' ? 
                        'Auto-assignment set successfully!' : 
                        (assignment.is_replacement ? 'Teacher replaced successfully!' : 'Teacher assigned successfully!');
                    alert(message);
                    location.reload();
                } else {
                    alert('Error: ' + (result.error || 'Unknown error'));
                }
            }).catch(err => {
                alert('Network error. Please try again.');
            });
        }
        
        function assignAuto(assignmentKey) {
            const parts = assignmentKey.split('-');
            const type = parts[0]; // 'class', 'group', or 'section'
            const id = parseInt(parts[1]);
            const subjectId = parseInt(parts[2]);
            
            let assignmentData = {
                subject_id: subjectId
            };
            
            if (type === 'class') {
                assignmentData.class_id = id;
                assignmentData.group_id = null;
                assignmentData.section_id = null;
            } else if (type === 'group') {
                const classAssignment = assignmentKey.match(/class-(\d+)-group/);
                assignmentData.class_id = parseInt(classAssignment[1]);
                assignmentData.group_id = id;
                assignmentData.section_id = null;
            } else if (type === 'section') {
                const classAssignment = assignmentKey.match(/class-(\d+)-section/);
                assignmentData.class_id = parseInt(classAssignment[1]);
                assignmentData.group_id = null;
                assignmentData.section_id = id;
            }
            
            if (confirm('Set this subject to auto-assignment? The system will automatically assign teachers during routine generation.')) {
                fetch('/school/teacher-assignments', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        ...assignmentData,
                        action: 'assign_auto'
                    })
                }).then(r => r.json()).then(result => {
                    if (result.success) {
                        alert('Auto-assignment set successfully!');
                        location.reload();
                    } else {
                        alert('Error: ' + (result.error || 'Unknown error'));
                    }
                }).catch(err => {
                    alert('Network error. Please try again.');
                });
            }
        }
        
        function updateReplaceModalForAuto() {
            const teacherSelect = document.getElementById('teacher-select');
            const currentValue = teacherSelect.value;
            
            // Add "Auto" option to teacher dropdown
            const autoOption = document.createElement('option');
            autoOption.value = 'auto';
            autoOption.textContent = '🤖 Auto-assign (System will decide)';
            
            // Check if auto option already exists
            if (!teacherSelect.querySelector('option[value="auto"]')) {
                teacherSelect.appendChild(autoOption);
            }
        }
        
        // Update replaceTeacher function to handle auto option
        function replaceTeacherWithAuto(assignmentId, currentTeacherName, assignmentKey) {
            const assignment = JSON.parse(document.getElementById('assignment-data').value);
            
            // Set assignment details
            document.getElementById('assignment-details').textContent = 'Replace ' + currentTeacherName + ' for this subject';
            document.getElementById('assignment-data').value = JSON.stringify({
                ...assignment,
                existing_assignment_id: assignmentId,
                is_replacement: true
            });
            
            // Update teacher dropdown with qualified teachers plus auto option
            const teacherSelect = document.getElementById('teacher-select');
            teacherSelect.innerHTML = '<option value="">Select new option...</option>';
            
            const qualifiedTeachers = window.assignmentData.teachers.filter(t => {
                return window.assignmentData.teacherSubjects.some(ts => ts.teacher_id === t.id && ts.subject_id === assignment.subject_id);
            });
            
            // Add qualified teachers
            qualifiedTeachers.forEach(t => {
                const option = document.createElement('option');
                option.value = t.id;
                option.textContent = t.full_name;
                teacherSelect.appendChild(option);
            });
            
            // Add auto option
            const autoOption = document.createElement('option');
            autoOption.value = 'auto';
            autoOption.textContent = '🤖 Auto-assign (System will decide)';
            teacherSelect.appendChild(autoOption);
            
            teacherSelect.disabled = false;
            document.getElementById('assign-teacher-modal').classList.remove('hidden');
        }
      </script>
    `;
}

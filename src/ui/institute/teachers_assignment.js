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
    
    // Debug: Log incoming data
    console.log('TeachersAssignmentPageHTML - Debug:', {
        school: school ? 'found' : 'missing',
        classes: classes.length,
        groups: groups.length,
        sections: sections.length,
        subjects: subjects.length,
        classSubjects: classSubjects.length,
        groupSubjects: groupSubjects.length,
        teachers: teachers.length,
        teacherSubjects: teacherSubjects.length,
        teacherAssignments: teacherAssignments.length
    });
    
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
    
    // Professional color palette for sections
    const sectionColors = [
        '#E8F4FD', // Light Blue
        '#F0F9FF', // Very Light Blue
        '#F8FAFC', // Light Gray Blue
        '#F0FDF4', // Light Green
        '#FEF3C7', // Light Yellow
        '#FEE2E2', // Light Red
        '#F3E8FF', // Light Purple
        '#ECFCCB', // Light Lime
        '#FCE7F3', // Light Pink
        '#E0F2FE'  // Sky Blue
    ];
    
    // Build flat hierarchical table data grouped by sections
    const assignmentRows = [];
    let colorIndex = 0;
    
    try {
        // Sort by class, then group, then section for proper hierarchy
        const sortedClasses = classes.sort((a, b) => a.class_name.localeCompare(b.class_name));
        
        sortedClasses.forEach(cls => {
            const classGroups = groupsByClass[cls.id] || [];
            
            // Class header row
            assignmentRows.push({
                type: 'class',
                class: cls,
                groups: classGroups,
                level: 0
            });
            
            // Handle class-level subjects (no group) - Group by sections
            const classSubjectsList = classSubjects.filter(cs => cs.class_id === cls.id);
            const classSections = sections.filter(s => s.class_id === cls.id && !s.group_id);
            
            if (classSubjectsList.length > 0 && classSections.length > 0) {
                // Group by sections - include ALL class subjects with each section
                classSections.forEach(section => {
                    // Include ALL class subjects for this section, not just ones with existing assignments
                    const sectionSubjects = classSubjectsList; // All class subjects
                    
                    const sectionColor = sectionColors[colorIndex % sectionColors.length];
                    colorIndex++;
                    
                    sectionSubjects.forEach(cs => {
                        const subject = subjectsById[cs.subject_id];
                        if (!subject) return;
                        
                        const existingAssignments = findAssignments(cls.id, null, section.id, subject.id);
                        assignmentRows.push({
                            type: 'section-subject',
                            class: cls,
                            section: section,
                            subject: subject,
                            assignments: existingAssignments,
                            sectionColor: sectionColor,
                            level: 2
                        });
                    });
                });
            }
            
            // Handle group-level subjects - Group by sections
            const sortedGroups = classGroups.sort((a, b) => a.group_name.localeCompare(b.group_name));
            
            sortedGroups.forEach(group => {
                const groupSubjectsList = groupSubjects.filter(gs => gs.group_id === group.id);
                const groupSections = sectionsByGroup[group.id] || [];
                
                if (groupSubjectsList.length > 0) {
                    // Group header row
                    assignmentRows.push({
                        type: 'group',
                        class: cls,
                        group: group,
                        sections: groupSections,
                        level: 1
                    });
                    
                    if (groupSections.length === 0) {
                        // No sections, skip (no teacher assignment needed without sections)
                        // Continue to next group
                    } else {
                        // Group by sections - include ALL group subjects + ALL class subjects with each section
                        groupSections.forEach(section => {
                            // Include ALL group subjects + ALL class subjects for this section
                            const sectionSubjects = [...groupSubjectsList, ...classSubjectsList]; // Group + Class subjects
                            
                            const sectionColor = sectionColors[colorIndex % sectionColors.length];
                            colorIndex++;
                            
                            sectionSubjects.forEach(cs => {
                                const subject = subjectsById[cs.subject_id];
                                if (!subject) return;
                                
                                const existingAssignments = findAssignments(cls.id, group.id, section.id, subject.id);
                                assignmentRows.push({
                                    type: 'group-section-subject',
                                    class: cls,
                                    group: group,
                                    section: section,
                                    subject: subject,
                                    assignments: existingAssignments,
                                    sectionColor: sectionColor,
                                    level: 3
                                });
                            });
                        });
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error in TeachersAssignmentPageHTML:', error);
        return `
            <div class="p-6">
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <h2 class="text-lg font-bold">Error Loading Teacher Assignments</h2>
                    <p>There was an error loading the teacher assignment data. Please try again.</p>
                    <details class="mt-2">
                        <summary class="cursor-pointer">Technical Details</summary>
                        <pre class="mt-2 text-sm bg-gray-100 p-2 rounded">${error.message}</pre>
                    </details>
                </div>
            </div>
        `;
    }

    return `
      <div class="p-6">
          <div class="flex justify-between items-center mb-6">
              <h1 class="text-xl font-bold">Teacher Assignment</h1>
              <div class="flex gap-2">
                  <button type="button" onclick="showTeachersList()" class="bg-gray-600 text-white px-4 py-2">
                      Teacher's List
                  </button>
              </div>
          </div>

          <!-- Assignment Table -->
          <div>
              <table border="1" cellpadding="4" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                  <thead>
                      <tr style="background-color: #f0f0f0;">
                          <th style="border: 1px solid #ccc; padding: 4px;">Class/Group</th>
                          <th style="border: 1px solid #ccc; padding: 4px;">Section</th>
                          <th style="border: 1px solid #ccc; padding: 4px;">Subject</th>
                          <th style="border: 1px solid #ccc; padding: 4px;">Teacher(s)</th>
                          <th style="border: 1px solid #ccc; padding: 4px;">Assign</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${(assignmentRows || []).map(row => {
                          if (row.type === 'class') {
                              return `
                                  <tr style="background-color: #f8f8f8; font-weight: bold;">
                                      <td style="border: 1px solid #ccc; padding: 4px; text-align: left;">${row.class.class_name} (${row.groups.length} groups)</td>
                                      <td style="border: 1px solid #ccc; padding: 4px;" colspan="4"></td>
                                  </tr>
                              `;
                          } else if (row.type === 'section-subject') {
                              return `
                                  <tr style="background-color: ${row.sectionColor};">
                                      <td style="border: 1px solid #ccc; padding: 4px; padding-left: 20px;">&nbsp;</td>
                                      <td style="border: 1px solid #ccc; padding: 4px; text-align: right;">${row.section.section_name}</td>
                                      <td style="border: 1px solid #ccc; padding: 4px;">${row.subject.subject_name}</td>
                                      <td style="border: 1px solid #ccc; padding: 4px;">
                                          ${row.assignments.length === 0 ? '<span style="color: #666; font-style: italic;">Unassigned</span>' : 
                                            row.assignments.map(a => 
                                                `<div style="margin-bottom: 2px;">
                                                    ${a.is_auto ? '<span style="color: #666; font-style: italic;">Auto-Assigned</span>' : (a.teacher_name || (teachersById[a.teacher_id] ? teachersById[a.teacher_id].full_name : '') || `Teacher ${a.teacher_id || 'Unknown'}`)}${a.is_primary ? '<span style="color: #0066cc; font-weight: bold;"> (Primary)</span>' : '<span style="color: #666;"> (Additional)</span>'}
                                                    <div style="margin-top: 2px;">
                                                        <button onclick="replaceTeacher(${a.id}, '${a.is_auto ? 'Auto' : escapeHtml(a.teacher_name || (teachersById[a.teacher_id] ? teachersById[a.teacher_id].full_name : ''))}', 'section-${row.section.id}-${row.subject.id}')" style="background-color: #FF9800; color: white; border: none; padding: 2px 4px; border-radius: 2px; cursor: pointer; font-size: 10px; margin-right: 2px;">Replace</button>
                                                        <button onclick="removeTeacher(${a.id}, '${a.is_auto ? 'Auto' : escapeHtml(a.teacher_name || (teachersById[a.teacher_id] ? teachersById[a.teacher_id].full_name : ''))}')" style="background-color: #f44336; color: white; border: none; padding: 2px 4px; border-radius: 2px; cursor: pointer; font-size: 10px;">Remove</button>
                                                    </div>
                                                </div>`
                                            ).join('')
                                          }
                                      </td>
                                      <td style="border: 1px solid #ccc; padding: 4px; text-align: center; background-color: rgba(240, 248, 255, 0.7);">
                                          <button onclick="assignTeacher('section-${row.section.id}-${row.subject.id}')" style="background-color: #4CAF50; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 12px;">Assign</button>
                                      </td>
                                  </tr>
                              `;
                          } else if (row.type === 'group') {
                              return `
                                  <tr style="background-color: #fafafa; font-weight: bold;">
                                      <td style="border: 1px solid #ccc; padding: 4px; padding-left: 20px; text-align: right;">${row.group.group_name} (${row.sections.length} sections)</td>
                                      <td style="border: 1px solid #ccc; padding: 4px;" colspan="4"></td>
                                  </tr>
                              `;
                          } else if (row.type === 'group-section-subject') {
                              return `
                                  <tr style="background-color: ${row.sectionColor};">
                                      <td style="border: 1px solid #ccc; padding: 4px; padding-left: 40px;">&nbsp;</td>
                                      <td style="border: 1px solid #ccc; padding: 4px; text-align: right;">${row.section.section_name}</td>
                                      <td style="border: 1px solid #ccc; padding: 4px;">${row.subject.subject_name}</td>
                                      <td style="border: 1px solid #ccc; padding: 4px;">
                                          ${row.assignments.length === 0 ? '<span style="color: #666; font-style: italic;">Unassigned</span>' : 
                                            row.assignments.map(a => 
                                                `<div style="margin-bottom: 2px;">
                                                    ${a.is_auto ? '<span style="color: #666; font-style: italic;">Auto-Assigned</span>' : (a.teacher_name || (teachersById[a.teacher_id] ? teachersById[a.teacher_id].full_name : '') || `Teacher ${a.teacher_id || 'Unknown'}`)}${a.is_primary ? '<span style="color: #0066cc; font-weight: bold;"> (Primary)</span>' : '<span style="color: #666;"> (Additional)</span>'}
                                                    <div style="margin-top: 2px;">
                                                        <button onclick="replaceTeacher(${a.id}, '${a.is_auto ? 'Auto' : escapeHtml(a.teacher_name || (teachersById[a.teacher_id] ? teachersById[a.teacher_id].full_name : ''))}', 'section-${row.section.id}-${row.subject.id}')" style="background-color: #FF9800; color: white; border: none; padding: 2px 4px; border-radius: 2px; cursor: pointer; font-size: 10px; margin-right: 2px;">Replace</button>
                                                        <button onclick="removeTeacher(${a.id}, '${a.is_auto ? 'Auto' : escapeHtml(a.teacher_name || (teachersById[a.teacher_id] ? teachersById[a.teacher_id].full_name : ''))}')" style="background-color: #f44336; color: white; border: none; padding: 2px 4px; border-radius: 2px; cursor: pointer; font-size: 10px;">Remove</button>
                                                    </div>
                                                </div>`
                                            ).join('')
                                          }
                                      </td>
                                      <td style="border: 1px solid #ccc; padding: 4px; text-align: center; background-color: rgba(240, 248, 255, 0.7);">
                                          <button onclick="assignTeacher('section-${row.section.id}-${row.subject.id}')" style="background-color: #4CAF50; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 12px;">Assign</button>
                                      </td>
                                  </tr>
                              `;
                          }
                      }).join('')}
                      ${(assignmentRows || []).length === 0 ? '<tr><td colspan="7" style="border: 1px solid #ccc; padding: 4px; text-align: center;">No subjects found in curriculum. Please add subjects to classes first.</td></tr>' : ''}
                  </tbody>
              </table>
          </div>
      </div>

      <!-- Add Teacher Modal -->
      <div id="add-teacher-modal" class="fixed inset-0 bg-black bg-opacity-50 z-[9999] hidden flex items-center justify-center p-4">
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
      <div id="assign-teacher-modal" class="fixed inset-0 bg-black bg-opacity-50 z-[9999] hidden flex items-center justify-center p-4">
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
                          <select id="teacher-select" name="teacher-select" required class="w-full border px-3 py-2">
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
            classes: ${JSON.stringify(classes || [])},
            groups: ${JSON.stringify(groups || [])},
            sections: ${JSON.stringify(sections || [])},
            subjects: ${JSON.stringify(subjects || [])},
            teachers: ${JSON.stringify(teachers || [])},
            teacherSubjects: ${JSON.stringify(teacherSubjects || [])},
            teacherAssignments: ${JSON.stringify(teacherAssignments || [])}
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
        
        function closeAssignModal() {
            document.getElementById('assign-teacher-modal').classList.add('hidden');
            document.querySelector('#assign-teacher-modal form').reset();
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
                
                assignmentText = className + (groupName ? ' - ' + groupName : '') + ' - ' + section.section_name + ' - ' + subject.subject_name;
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
                    body: JSON.stringify({ action: 'remove_teacher', assignment_id: assignmentId })
                }).then(r => r.json()).then(result => {
                    if (result.success) {
                        location.reload();
                    } else {
                        alert('Error: ' + (result.error || 'Unknown error'));
                    }
                }).catch(err => {
                    alert('Network error. Please try again.');
                });
            }
        }
        
        function saveAssignment(e) {
            e.preventDefault();
            const assignmentData = JSON.parse(document.getElementById('assignment-data').value);
            const teacherSelect = document.getElementById('teacher-select');
            const selectedTeacher = teacherSelect.value;
            if (!selectedTeacher || teacherSelect.disabled) {
                alert('Please select a teacher or choose Auto-assign.');
                return;
            }

            const data = {
                action: assignmentData.is_replacement ? 'replace_teacher' : 'assign_teacher',
                class_id: assignmentData.class_id,
                group_id: assignmentData.group_id,
                section_id: assignmentData.section_id,
                subject_id: assignmentData.subject_id,
                teacher_id: selectedTeacher === 'auto' ? null : selectedTeacher,
                is_auto: selectedTeacher === 'auto' ? 1 : 0,
                is_primary: 1
            };
            
            if (assignmentData.is_replacement) {
                data.existing_assignment_id = assignmentData.existing_assignment_id;
            }
            
            fetch('/school/teacher-assignments', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(r => r.json()).then(result => {
                if (result.success) {
                    closeAssignModal();
                    location.reload();
                } else {
                    alert('Error: ' + (result.error || 'Unknown error'));
                }
            }).catch(err => {
                alert('Network error. Please try again.');
            });
        }
      </script>
    `;
}

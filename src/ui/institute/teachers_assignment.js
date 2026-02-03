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
    
    function findAssignments(classId, groupId, sectionId, subjectId) {
        return teacherAssignments.filter(ta => 
            ta.class_id === classId &&
            (ta.group_id === groupId || (ta.group_id === null && groupId === null)) &&
            (ta.section_id === sectionId || (ta.section_id === null && sectionId === null)) &&
            ta.subject_id === subjectId
        );
    }
    
    const sectionColors = ['#ffffff', '#f9fafb'];
    
    const assignmentRows = [];
    let colorIndex = 0;
    
    try {
        const sortedClasses = classes.sort((a, b) => a.class_name.localeCompare(b.class_name));
        
        sortedClasses.forEach(cls => {
            const classGroups = groupsByClass[cls.id] || [];
            
            assignmentRows.push({
                type: 'class',
                class: cls,
                groups: classGroups,
                level: 0
            });
            
            const classSubjectsList = classSubjects.filter(cs => cs.class_id === cls.id);
            const classSections = sections.filter(s => s.class_id === cls.id && !s.group_id);
            
            if (classSubjectsList.length > 0 && classSections.length > 0) {
                classSections.forEach(section => {
                    const sectionSubjects = classSubjectsList;
                    
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
            
            const sortedGroups = classGroups.sort((a, b) => a.group_name.localeCompare(b.group_name));
            
            sortedGroups.forEach(group => {
                const groupSubjectsList = groupSubjects.filter(gs => gs.group_id === group.id);
                const groupSections = sectionsByGroup[group.id] || [];
                
                if (groupSubjectsList.length > 0) {
                    assignmentRows.push({
                        type: 'group',
                        class: cls,
                        group: group,
                        sections: groupSections,
                        level: 1
                    });
                    
                    if (groupSections.length === 0) {
                    } else {
                        groupSections.forEach(section => {
                            const sectionSubjects = [...groupSubjectsList, ...classSubjectsList];
                            
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
                <div class="border border-gray-300 text-gray-700 px-4 py-3">
                    <h2 class="text-lg font-bold">Error Loading Teacher Assignments</h2>
                    <p>There was an error loading the teacher assignment data. Please try again.</p>
                    <details class="mt-2">
                        <summary class="cursor-pointer">Technical Details</summary>
                        <pre class="mt-2 text-sm border border-gray-300 p-2">${error.message}</pre>
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
                                      <td style="border: 1px solid #ccc; padding: 4px;" data-assignment-key="${row.class.id}-${row.section.group_id || 0}-${row.section.id}-${row.subject.id}">
                                          ${row.assignments.length === 0 ? '<span style="color: #666; font-style: italic;">Unassigned</span>' : 
                                            row.assignments.map(a => 
                                                `<div style="margin-bottom: 2px;">
                                                    ${a.is_auto ? '<span style="color: #666; font-style: italic;">Auto-Assigned</span>' : (a.teacher_name || (teachersById[a.teacher_id] ? teachersById[a.teacher_id].full_name : '') || `Teacher ${a.teacher_id || 'Unknown'}`)}${a.is_primary ? '<span style="color: #111827; font-weight: bold;"> (Primary)</span>' : '<span style="color: #666;"> (Additional)</span>'}
                                                    <div style="margin-top: 2px;">
                                                        <button onclick="replaceTeacher(${a.id}, ${row.class.id}, ${row.section.group_id ? row.section.group_id : 'null'}, ${row.section.id}, ${row.subject.id})" style="background-color: #6b7280; color: white; border: none; padding: 2px 4px; cursor: pointer; font-size: 10px; margin-right: 2px;">Replace</button>
                                                        <button onclick="removeTeacher(${a.id}, ${row.class.id}, ${row.section.group_id ? row.section.group_id : 'null'}, ${row.section.id}, ${row.subject.id})" style="background-color: #b91c1c; color: white; border: none; padding: 2px 4px; cursor: pointer; font-size: 10px;">Remove</button>
                                                    </div>
                                                </div>`
                                            ).join('')
                                          }
                                      </td>
                                      <td style="border: 1px solid #ccc; padding: 4px; text-align: center; background-color: rgba(240, 248, 255, 0.7);">
                                          <button onclick="assignTeacher('section-${row.section.id}-${row.subject.id}')" style="background-color: #111827; color: white; border: none; padding: 4px 8px; cursor: pointer; font-size: 12px;">Assign</button>
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
                                      <td style="border: 1px solid #ccc; padding: 4px;" data-assignment-key="${row.class.id}-${row.section.group_id || 0}-${row.section.id}-${row.subject.id}">
                                          ${row.assignments.length === 0 ? '<span style="color: #666; font-style: italic;">Unassigned</span>' : 
                                            row.assignments.map(a => 
                                                `<div style="margin-bottom: 2px;">
                                                    ${a.is_auto ? '<span style="color: #666; font-style: italic;">Auto-Assigned</span>' : (a.teacher_name || (teachersById[a.teacher_id] ? teachersById[a.teacher_id].full_name : '') || `Teacher ${a.teacher_id || 'Unknown'}`)}${a.is_primary ? '<span style="color: #111827; font-weight: bold;"> (Primary)</span>' : '<span style="color: #666;"> (Additional)</span>'}
                                                    <div style="margin-top: 2px;">
                                                        <button onclick="replaceTeacher(${a.id}, ${row.class.id}, ${row.section.group_id ? row.section.group_id : 'null'}, ${row.section.id}, ${row.subject.id})" style="background-color: #6b7280; color: white; border: none; padding: 2px 4px; cursor: pointer; font-size: 10px; margin-right: 2px;">Replace</button>
                                                        <button onclick="removeTeacher(${a.id}, ${row.class.id}, ${row.section.group_id ? row.section.group_id : 'null'}, ${row.section.id}, ${row.subject.id})" style="background-color: #b91c1c; color: white; border: none; padding: 2px 4px; cursor: pointer; font-size: 10px;">Remove</button>
                                                    </div>
                                                </div>`
                                            ).join('')
                                          }
                                      </td>
                                      <td style="border: 1px solid #ccc; padding: 4px; text-align: center; background-color: rgba(240, 248, 255, 0.7);">
                                          <button onclick="assignTeacher('section-${row.section.id}-${row.subject.id}')" style="background-color: #111827; color: white; border: none; padding: 4px 8px; cursor: pointer; font-size: 12px;">Assign</button>
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

      <div id="add-teacher-modal" class="fixed inset-0 bg-black bg-opacity-50 z-[9999] hidden flex items-center justify-center p-4">
          <div class="bg-white border border-gray-300 max-w-md w-full">
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

      <div id="assign-teacher-modal" class="fixed inset-0 bg-black bg-opacity-50 z-[9999] hidden flex items-center justify-center p-4">
          <div class="bg-white border border-gray-300 max-w-md w-full">
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

      <div id="sync-indicator" class="fixed bottom-4 right-4 z-[10000] hidden bg-gray-900 text-white text-xs font-semibold px-3 py-2">Syncing...</div>
      <div id="toast-container" class="fixed bottom-4 left-4 z-[10000] space-y-2"></div>

      <script>
        window.assignmentData = {
            classes: ${JSON.stringify(classes || [])},
            groups: ${JSON.stringify(groups || [])},
            sections: ${JSON.stringify(sections || [])},
            subjects: ${JSON.stringify(subjects || [])},
            teachers: ${JSON.stringify(teachers || [])},
            teacherSubjects: ${JSON.stringify(teacherSubjects || [])},
            teacherAssignments: ${JSON.stringify(teacherAssignments || [])}
        };
        window.assignmentData.teachersById = {};
        window.assignmentData.teachers.forEach(t => {
            window.assignmentData.teachersById[t.id] = t;
        });

        function escapeHtmlClient(text) {
            if (!text) return '';
            return text.toString()
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        function normalizeId(value) {
            if (value === null || value === undefined || value === '' || value === 'null') return null;
            const num = Number(value);
            return Number.isNaN(num) ? null : num;
        }

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        function showSyncIndicator(message) {
            const el = document.getElementById('sync-indicator');
            if (!el) return;
            el.textContent = message || 'Syncing...';
            el.classList.remove('hidden');
        }

        function hideSyncIndicator() {
            const el = document.getElementById('sync-indicator');
            if (!el) return;
            el.classList.add('hidden');
        }

        function showToast(message, type) {
            const container = document.getElementById('toast-container');
            if (!container) return;
            const toast = document.createElement('div');
            const bg = type === 'error' ? 'bg-red-600' : 'bg-green-600';
            toast.className = bg + ' text-white text-xs font-semibold px-3 py-2 transition-opacity';
            toast.textContent = message;
            container.appendChild(toast);
            setTimeout(() => { toast.style.opacity = '0'; }, 2200);
            setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 2600);
        }

        function makeAssignmentKey(classId, groupId, sectionId, subjectId) {
            const g = normalizeId(groupId) || 0;
            const s = normalizeId(sectionId) || 0;
            return String(classId) + '-' + g + '-' + s + '-' + subjectId;
        }

        function getAssignmentCell(context) {
            const key = makeAssignmentKey(context.class_id, context.group_id, context.section_id, context.subject_id);
            return document.querySelector('[data-assignment-key="' + key + '"]');
        }

        function updateAssignmentData(context, assignments) {
            const classId = Number(context.class_id);
            const groupId = normalizeId(context.group_id);
            const sectionId = normalizeId(context.section_id);
            const subjectId = Number(context.subject_id);
            window.assignmentData.teacherAssignments = window.assignmentData.teacherAssignments.filter(a => {
                const sameClass = a.class_id === classId;
                const sameGroup = (a.group_id === groupId) || (a.group_id === null && groupId === null);
                const sameSection = (a.section_id === sectionId) || (a.section_id === null && sectionId === null);
                const sameSubject = a.subject_id === subjectId;
                return !(sameClass && sameGroup && sameSection && sameSubject);
            }).concat(assignments);
        }

        function renderAssignmentsCell(assignments, context) {
            if (!assignments || assignments.length === 0) {
                return '<span style="color: #666; font-style: italic;">Unassigned</span>';
            }
            const classId = Number(context.class_id);
            const groupId = normalizeId(context.group_id);
            const sectionId = normalizeId(context.section_id);
            const subjectId = Number(context.subject_id);
            return assignments.map(a => {
                const teacherName = a.teacher_name || (window.assignmentData.teachersById[a.teacher_id] ? window.assignmentData.teachersById[a.teacher_id].full_name : '') || ('Teacher ' + (a.teacher_id || 'Unknown'));
                const safeName = escapeHtmlClient(teacherName);
                const label = a.is_auto ? '<span style="color: #666; font-style: italic;">Auto-Assigned</span>' : safeName;
                const role = a.is_primary ? '<span style="color: #111827; font-weight: bold;"> (Primary)</span>' : '<span style="color: #666;"> (Additional)</span>';
                const groupLiteral = groupId === null ? 'null' : groupId;
                const sectionLiteral = sectionId === null ? 'null' : sectionId;
                return '<div style="margin-bottom: 2px;">' +
                           label + role +
                           '<div style="margin-top: 2px;">' +
                               '<button onclick="replaceTeacher(' + a.id + ', ' + classId + ', ' + groupLiteral + ', ' + sectionLiteral + ', ' + subjectId + ')" style="background-color: #6b7280; color: white; border: none; padding: 2px 4px; cursor: pointer; font-size: 10px; margin-right: 2px;">Replace</button>' +
                               '<button onclick="removeTeacher(' + a.id + ', ' + classId + ', ' + groupLiteral + ', ' + sectionLiteral + ', ' + subjectId + ')" style="background-color: #b91c1c; color: white; border: none; padding: 2px 4px; cursor: pointer; font-size: 10px;">Remove</button>' +
                           '</div>' +
                       '</div>';
            }).join('');
        }

        async function fetchAssignmentsFor(context) {
            const params = new URLSearchParams({
                class_id: context.class_id,
                group_id: context.group_id '',
                section_id: context.section_id '',
                subject_id: context.subject_id
            });
            const response = await fetch('/school/teacher-assignments?' + params.toString(), {
                headers: { 'Accept': 'application/json' }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch assignments');
            }
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Failed to fetch assignments');
            }
            return result.data || [];
        }

        async function refreshAssignmentCell(context, retries = 2) {
            const cell = getAssignmentCell(context);
            if (!cell) {
                location.reload();
                return;
            }
            try {
                showSyncIndicator('Syncing...');
                const assignments = await fetchAssignmentsFor(context);
                updateAssignmentData(context, assignments);
                cell.innerHTML = renderAssignmentsCell(assignments, context);
                hideSyncIndicator();
                showToast('Updated', 'success');
            } catch (err) {
                if (retries > 0) {
                    await delay(400 * (3 - retries));
                    return refreshAssignmentCell(context, retries - 1);
                }
                hideSyncIndicator();
                showToast('Sync failed. Reloading...', 'error');
                location.reload();
            }
        }
        
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
            const type = parts[0];
            const id = parseInt(parts[1]);
            const subjectId = parseInt(parts[2]);
            
            let assignmentText = '';
            let assignmentData = {
                type: type,
                subject_id: subjectId
            };
            
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
            
            assignmentData.assignment_key = makeAssignmentKey(assignmentData.class_id, assignmentData.group_id, assignmentData.section_id, assignmentData.subject_id);
            document.getElementById('assignment-details').textContent = assignmentText;
            document.getElementById('assignment-data').value = JSON.stringify(assignmentData);
            
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
        
        function getAssignmentById(assignmentId) {
            return window.assignmentData.teacherAssignments.find(a => a.id === assignmentId);
        }

        function getTeacherDisplayName(assignment) {
            if (!assignment) return 'Teacher';
            if (assignment.is_auto) return 'Auto';
            if (assignment.teacher_name) return assignment.teacher_name;
            if (assignment.teacher_id && window.assignmentData.teachersById[assignment.teacher_id]) {
                return window.assignmentData.teachersById[assignment.teacher_id].full_name;
            }
            return assignment.teacher_id ? ('Teacher ' + assignment.teacher_id) : 'Teacher';
        }

        function replaceTeacher(assignmentId, classId, groupId, sectionId, subjectId) {
            const assignment = {
                type: 'section',
                class_id: classId,
                group_id: normalizeId(groupId),
                section_id: normalizeId(sectionId),
                subject_id: subjectId,
                assignment_key: makeAssignmentKey(classId, groupId, sectionId, subjectId)
            };
            const current = getAssignmentById(assignmentId);
            const currentTeacherName = getTeacherDisplayName(current);
            document.getElementById('assignment-details').textContent = 'Replace ' + currentTeacherName + ' for this subject';
            document.getElementById('assignment-data').value = JSON.stringify({
                ...assignment,
                existing_assignment_id: assignmentId,
                is_replacement: true
            });
            
            const teacherSelect = document.getElementById('teacher-select');
            teacherSelect.innerHTML = '<option value="">Select new option...</option>';
            
            const qualifiedTeachers = window.assignmentData.teachers.filter(t => {
                return window.assignmentData.teacherSubjects.some(ts => ts.teacher_id === t.id && ts.subject_id === assignment.subject_id);
            });
            
            qualifiedTeachers.forEach(t => {
                const option = document.createElement('option');
                option.value = t.id;
                option.textContent = t.full_name;
                teacherSelect.appendChild(option);
            });
            
            const autoOption = document.createElement('option');
            autoOption.value = 'auto';
            autoOption.textContent = ' Auto-assign (System will decide)';
            teacherSelect.appendChild(autoOption);
            
            if (qualifiedTeachers.length === 0 && !autoOption) {
                teacherSelect.innerHTML = '<option value="">No other options available</option>';
                teacherSelect.disabled = true;
            } else {
                teacherSelect.disabled = false;
            }
            
            document.getElementById('assign-teacher-modal').classList.remove('hidden');
        }
        
        function removeTeacher(assignmentId, classId, groupId, sectionId, subjectId) {
            const current = getAssignmentById(assignmentId);
            const teacherName = getTeacherDisplayName(current);
            if (confirm('Remove ' + teacherName + ' from this subject assignment?')) {
                showSyncIndicator('Removing...');
                fetch('/school/teacher-assignments', {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ action: 'remove_teacher', assignment_id: assignmentId })
                }).then(r => r.json()).then(result => {
                    if (result.success) {
                        const context = {
                            class_id: classId,
                            group_id: normalizeId(groupId),
                            section_id: normalizeId(sectionId),
                            subject_id: subjectId
                        };
                        refreshAssignmentCell(context).catch(() => location.reload());
                    } else {
                        hideSyncIndicator();
                        alert('Error: ' + (result.error || 'Unknown error'));
                    }
                }).catch(err => {
                    hideSyncIndicator();
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
            
            showSyncIndicator('Saving...');
            fetch('/school/teacher-assignments', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(r => r.json()).then(result => {
                if (result.success) {
                    closeAssignModal();
                    const context = {
                        class_id: assignmentData.class_id,
                        group_id: normalizeId(assignmentData.group_id),
                        section_id: normalizeId(assignmentData.section_id),
                        subject_id: assignmentData.subject_id
                    };
                    refreshAssignmentCell(context).catch(() => location.reload());
                } else {
                    hideSyncIndicator();
                    alert('Error: ' + (result.error || 'Unknown error'));
                }
            }).catch(err => {
                hideSyncIndicator();
                alert('Network error. Please try again.');
            });
        }
      </script>
    `;
}

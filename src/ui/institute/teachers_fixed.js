// src/ui/institute/teachers_fixed.js - Cloudflare Workers Compatible Teacher Management

export function TeachersPageHTML(school, teachers = [], allSubjects = [], teacherSubjects = []) {
    
    // Group subjects by teacher
    const subjectsByTeacher = {};
    teacherSubjects.forEach(ts => {
        if (!subjectsByTeacher[ts.teacher_id]) subjectsByTeacher[ts.teacher_id] = [];
        subjectsByTeacher[ts.teacher_id].push(ts);
    });

    // Build table rows
    const teacherRows = teachers.map(t => {
        const teacherSubjectsList = subjectsByTeacher[t.id] || [];
        const primarySubject = teacherSubjectsList.find(ts => ts.is_primary === 1);
        const additionalSubjects = teacherSubjectsList.filter(ts => ts.is_primary === 0);
        
        return `
            <tr class="border-b hover:bg-gray-50" data-teacher-id="${t.id}">
                <td class="p-4">
                    <div class="font-medium text-gray-900">${escapeHtml(t.full_name)}</div>
                    <div class="text-sm text-gray-500">${escapeHtml(t.email)}</div>
                    <div class="text-sm text-gray-600">${escapeHtml(t.phone)}</div>
                </td>
                <td class="p-4">
                    <div class="space-y-2">
                        ${primarySubject ? `
                            <span class="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                🎯 ${escapeHtml(primarySubject.subject_name)}
                            </span>
                        ` : '<span class="text-gray-400 text-xs">No primary subject</span>'}
                        ${additionalSubjects.length > 0 ? `
                            <div class="flex flex-wrap gap-1">
                                ${additionalSubjects.map(s => `
                                    <span class="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                                        ${escapeHtml(s.subject_name)}
                                    </span>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </td>
                <td class="p-4">
                    <div class="flex gap-2">
                        <button type="button" data-action="edit-subjects" data-teacher-id="${t.id}" data-teacher-name="${escapeHtml(t.full_name)}"
                                class="edit-subjects-btn text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Edit Subjects
                        </button>
                        <button type="button" data-action="remove-teacher" data-teacher-id="${t.id}"
                                class="remove-teacher-btn text-red-600 hover:text-red-800 text-sm font-medium">
                            Remove
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    return `
      <div class="max-w-6xl mx-auto p-6">
          <div class="flex justify-between items-center mb-6">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Teachers Management</h1>
                <p class="text-gray-600">Manage teachers and assign subjects</p>
              </div>
              <button type="button" id="add-teacher-btn" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  + Add Teacher
              </button>
          </div>

          <!-- Add Teacher Form -->
          <div id="add-teacher-form" class="hidden mb-6 bg-white rounded-lg border p-6">
              <h3 class="text-lg font-semibold mb-4">Add New Teacher</h3>
              <form id="add-teacher-form-element" class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                      <input type="text" name="full_name" placeholder="Full Name" required 
                             class="border rounded px-3 py-2">
                      <input type="email" name="email" placeholder="Email" required 
                             class="border rounded px-3 py-2">
                  </div>
                  <div class="flex gap-2">
                      <span class="bg-gray-100 px-3 py-2 rounded text-sm">+880</span>
                      <input type="text" name="phone_digits" placeholder="1XXXXXXXXX" required maxlength="10" 
                             class="flex-1 border rounded px-3 py-2">
                  </div>
                  <div class="flex gap-2">
                      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                          Add Teacher
                      </button>
                      <button type="button" id="cancel-add-teacher" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                          Cancel
                      </button>
                  </div>
              </form>
          </div>

          <!-- Teachers Table -->
          <div class="bg-white rounded-lg border overflow-hidden">
              <table class="w-full">
                  <thead class="bg-gray-50">
                      <tr>
                          <th class="p-4 text-left font-medium text-gray-900">Teacher</th>
                          <th class="p-4 text-left font-medium text-gray-900">Subjects</th>
                          <th class="p-4 text-left font-medium text-gray-900">Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${teacherRows.length > 0 ? teacherRows : `
                          <tr>
                              <td colspan="3" class="p-8 text-center text-gray-500">
                                  <div class="flex flex-col items-center">
                                      <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-12h13a6 6 0 016 12v1m-18 0V7a4 4 0 114 0h4a2 2 0 012 2v1a2 2 0 002 2h4a2 2 0 002-2V9a2 2 0 00-2-2h-4a2 2 0 00-2 2v-1z"></path>
                                      </svg>
                                      <p class="text-lg font-medium mb-2">No teachers added yet</p>
                                      <p class="text-sm">Click "Add Teacher" to get started</p>
                                  </div>
                              </td>
                          </tr>
                      `}
                  </tbody>
              </table>
          </div>
      </div>

      <!-- Subject Assignment Modal -->
      <div id="subject-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
          <div class="bg-white rounded-lg max-w-md w-full">
              <div class="p-4 border-b">
                  <h3 class="font-semibold">Assign Subjects</h3>
                  <p class="text-sm text-gray-600">For <span id="teacher-name-display"></span></p>
              </div>
              
              <div class="p-4">
                  <form id="subject-assignment-form" class="space-y-4">
                      <input type="hidden" name="teacher_id" id="teacher-id">
                      <input type="hidden" name="primary_subject" id="primary-subject">
                      
                      <div>
                          <label class="block text-sm font-medium mb-2">Primary Subject *</label>
                          <select id="primary-subject-select" required class="w-full border rounded px-3 py-2">
                              <option value="">Select primary subject...</option>
                              ${allSubjects.map(subject => 
                                  `<option value="${subject.id}">${escapeHtml(subject.subject_name)}</option>`
                              ).join('')}
                          </select>
                      </div>
                      
                      <div>
                          <label class="block text-sm font-medium mb-2">Additional Subjects</label>
                          <div id="additional-subjects-container" class="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                              ${allSubjects.map(subject => 
                                  `<label class="flex items-center gap-2 text-sm">
                                      <input type="checkbox" name="additional_subjects" value="${subject.id}" class="rounded">
                                      ${escapeHtml(subject.subject_name)}
                                  </label>`
                              ).join('')}
                          </div>
                      </div>
                      
                      <div class="flex gap-2 pt-2 border-t">
                          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                              Save
                          </button>
                          <button type="button" id="cancel-subject-assignment" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                              Cancel
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      </div>

      <script>
        // Store data safely
        const teachersData = ${JSON.stringify({teachers, allSubjects, teacherSubjects})};
        
        // Initialize when DOM is ready
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Teachers module initializing...');
            
            // Add teacher form toggle
            const addTeacherBtn = document.getElementById('add-teacher-btn');
            const addTeacherForm = document.getElementById('add-teacher-form');
            const cancelAddTeacher = document.getElementById('cancel-add-teacher');
            const addTeacherFormElement = document.getElementById('add-teacher-form-element');
            
            if (addTeacherBtn) {
                addTeacherBtn.addEventListener('click', function() {
                    addTeacherForm.classList.toggle('hidden');
                });
            }
            
            if (cancelAddTeacher) {
                cancelAddTeacher.addEventListener('click', function() {
                    addTeacherForm.classList.add('hidden');
                    addTeacherFormElement.reset();
                });
            }
            
            // Add teacher form submission
            if (addTeacherFormElement) {
                addTeacherFormElement.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = Object.fromEntries(formData.entries());
                    
                    const phoneDigits = data.phone_digits.replace(/\\D/g, '');
                    if (phoneDigits.length !== 10) {
                        alert('Please enter a valid 10-digit phone number');
                        return;
                    }
                    
                    data.phone = '+880-' + phoneDigits;
                    delete data.phone_digits;
                    
                    try {
                        const response = await fetch('/school/teachers', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify(data)
                        });
                        
                        const result = await response.json();
                        if (result.success) {
                            window.location.reload();
                        } else {
                            alert('Error: ' + (result.error || 'Unknown error'));
                        }
                    } catch (error) {
                        console.error('Teacher add error:', error);
                        alert('Network error. Please try again.');
                    }
                });
            }
            
            // Edit subjects buttons
            document.querySelectorAll('.edit-subjects-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const teacherId = this.dataset.teacherId;
                    const teacherName = this.dataset.teacherName;
                    openSubjectEditor(teacherId, teacherName);
                });
            });
            
            // Remove teacher buttons
            document.querySelectorAll('.remove-teacher-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const teacherId = this.dataset.teacherId;
                    removeTeacher(teacherId);
                });
            });
            
            // Subject modal controls
            const subjectModal = document.getElementById('subject-modal');
            const cancelSubjectAssignment = document.getElementById('cancel-subject-assignment');
            const subjectAssignmentForm = document.getElementById('subject-assignment-form');
            
            if (cancelSubjectAssignment) {
                cancelSubjectAssignment.addEventListener('click', closeSubjectModal);
            }
            
            if (subjectAssignmentForm) {
                subjectAssignmentForm.addEventListener('submit', saveSubjectAssignments);
            }
            
            // Close modal on escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeSubjectModal();
                }
            });
            
            console.log('Teachers module initialized successfully');
        });
        
        function openSubjectEditor(teacherId, teacherName) {
            document.getElementById('teacher-id').value = teacherId;
            document.getElementById('teacher-name-display').textContent = teacherName;
            document.getElementById('subject-modal').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            loadCurrentSubjects(teacherId);
        }
        
        function closeSubjectModal() {
            document.getElementById('subject-modal').classList.add('hidden');
            document.body.style.overflow = '';
            document.getElementById('subject-assignment-form').reset();
        }
        
        function loadCurrentSubjects(teacherId) {
            const teacherSubjects = teachersData.teacherSubjects.filter(ts => ts.teacher_id == teacherId);
            const primarySubject = teacherSubjects.find(ts => ts.is_primary === 1);
            const additionalSubjects = teacherSubjects.filter(ts => ts.is_primary === 0);
            
            // Set primary subject
            if (primarySubject) {
                document.getElementById('primary-subject-select').value = primarySubject.subject_id;
            }
            
            // Set additional subjects
            document.querySelectorAll('input[name="additional_subjects"]').forEach(checkbox => {
                checkbox.checked = additionalSubjects.some(ts => ts.subject_id == checkbox.value);
            });
        }
        
        async function saveSubjectAssignments(e) {
            e.preventDefault();
            
            const primarySubject = document.getElementById('primary-subject-select').value;
            if (!primarySubject) {
                alert('Please select a primary subject');
                return;
            }
            
            const additionalSubjects = Array.from(document.querySelectorAll('input[name="additional_subjects"]:checked'))
                .map(cb => parseInt(cb.value));
            
            const data = {
                teacher_id: document.getElementById('teacher-id').value,
                primary_subject: parseInt(primarySubject),
                additional_subjects: additionalSubjects,
                action: 'assign_subjects'
            };
            
            try {
                const response = await fetch('/school/teachers', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                if (result.success) {
                    closeSubjectModal();
                    window.location.reload();
                } else {
                    alert('Error: ' + (result.error || 'Unknown error'));
                }
            } catch (error) {
                console.error('Subject assignment error:', error);
                alert('Network error. Please try again.');
            }
        }
        
        async function removeTeacher(teacherId) {
            if (!confirm('Remove this teacher?')) return;
            
            try {
                const response = await fetch('/school/teachers', {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({id: teacherId})
                });
                
                const result = await response.json();
                if (result.success) {
                    window.location.reload();
                } else {
                    alert('Error: ' + (result.error || 'Unknown error'));
                }
            } catch (error) {
                console.error('Remove teacher error:', error);
                alert('Network error. Please try again.');
            }
        }
        
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
      </script>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

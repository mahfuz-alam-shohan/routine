// src/ui/institute/teachers.js - CLEAN TABLE LAYOUT with Subject Editability

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
            <tr class="border-b hover:bg-gray-50">
                <td class="p-3">
                    <div class="font-medium">${t.full_name}</div>
                    <div class="text-sm text-gray-500">${t.email}</div>
                    <div class="text-sm text-gray-600">${t.phone}</div>
                </td>
                <td class="p-3">
                    <div class="space-y-1">
                        ${primarySubject ? `
                            <div class="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                🎯 ${primarySubject.subject_name}
                            </div>
                        ` : '<span class="text-gray-400 text-xs">No primary subject</span>'}
                        ${additionalSubjects.length > 0 ? `
                            <div class="flex flex-wrap gap-1">
                                ${additionalSubjects.map(s => `
                                    <span class="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs">
                                        ${s.subject_name}
                                    </span>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </td>
                <td class="p-3">
                    <div class="flex gap-2">
                        <button onclick="openSubjectEditor(${t.id}, '${t.full_name}')" 
                                class="text-blue-600 hover:text-blue-800 text-sm">
                            Edit Subjects
                        </button>
                        <button onclick="removeTeacher(${t.id})" 
                                class="text-red-600 hover:text-red-800 text-sm">
                            Remove
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    return `
      <style>
        .simple-table {
          border-collapse: collapse;
          width: 100%;
        }
        
        .simple-table th {
          background: #f8f9fa;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .simple-table td {
          padding: 12px;
          vertical-align: top;
        }
        
        .modal-overlay {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(2px);
        }
        
        .subject-checkbox {
          transition: background-color 0.2s;
        }
        
        .subject-checkbox:hover {
          background-color: #f0f9ff;
        }
      </style>
      
      <div>
          <div class="flex justify-between items-center mb-4">
              <div>
                <h1 class="text-2xl font-semibold text-gray-900">Teachers</h1>
                <p class="text-sm text-gray-500">Manage teachers and their subject assignments</p>
              </div>
              <button onclick="toggleAddTeacherForm()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  + Add Teacher
              </button>
          </div>

          <!-- Add Teacher Form -->
          <div id="add-teacher-form" class="hidden mb-4 bg-white border rounded p-4">
              <h3 class="font-semibold mb-3">Add New Teacher</h3>
              <form onsubmit="addTeacher(event)" class="space-y-3">
                  <div class="grid grid-cols-2 gap-3">
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
                          Add
                      </button>
                      <button type="button" onclick="toggleAddTeacherForm()" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                          Cancel
                      </button>
                  </div>
              </form>
          </div>

          <!-- Teachers Table -->
          <div class="bg-white border rounded overflow-hidden">
              <table class="simple-table">
                  <thead>
                      <tr>
                          <th class="w-2/5">Teacher</th>
                          <th class="w-2/5">Subjects</th>
                          <th class="w-1/5">Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${teacherRows.length > 0 ? teacherRows : `
                          <tr>
                              <td colspan="3" class="p-8 text-center text-gray-500">
                                  No teachers added yet. Click "Add Teacher" to get started.
                              </td>
                          </tr>
                      `}
                  </tbody>
              </table>
          </div>
      </div>

      <!-- Subject Editor Modal -->
      <div id="subject-editor-modal" class="fixed inset-0 modal-overlay z-[9999] hidden flex items-center justify-center p-4">
          <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div class="p-4 border-b">
                  <h3 class="font-semibold">Assign Subjects</h3>
                  <p class="text-sm text-gray-600">For <span id="teacher-name-display"></span></p>
              </div>
              
              <div class="p-4">
                  <form id="subject-editor-form" onsubmit="saveSubjectAssignments(event)" class="space-y-4">
                      <input type="hidden" name="teacher_id" id="edit-teacher-id">
                      <input type="hidden" name="primary_subject" id="selected-primary-subject">
                      
                      <!-- Primary Subject Selection -->
                      <div>
                          <label class="block text-sm font-medium mb-2">Primary Subject</label>
                          <div class="relative">
                              <input type="text" id="primary-search" placeholder="Search and select primary subject..." 
                                     class="w-full border rounded px-3 py-2 pr-8"
                                     oninput="searchSubjects('primary', this.value)"
                                     onfocus="showSubjectDropdown('primary')">
                              <div id="primary-dropdown" class="hidden absolute top-full left-0 right-0 bg-white border rounded mt-1 max-h-32 overflow-y-auto z-10 shadow-lg">
                                  <!-- Search results will appear here -->
                              </div>
                          </div>
                          <div id="selected-primary-display" class="mt-2 hidden">
                              <span class="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                  🎯 <span id="primary-name"></span>
                                  <button type="button" onclick="clearPrimarySubject()" class="ml-1 text-green-600 hover:text-green-800">×</button>
                              </span>
                          </div>
                      </div>
                      
                      <!-- Additional Subjects -->
                      <div>
                          <label class="block text-sm font-medium mb-2">Additional Subjects</label>
                          <div class="relative">
                              <input type="text" id="additional-search" placeholder="Search and add additional subjects..." 
                                     class="w-full border rounded px-3 py-2 pr-8"
                                     oninput="searchSubjects('additional', this.value)"
                                     onfocus="showSubjectDropdown('additional')">
                              <div id="additional-dropdown" class="hidden absolute top-full left-0 right-0 bg-white border rounded mt-1 max-h-32 overflow-y-auto z-10 shadow-lg">
                                  <!-- Search results will appear here -->
                              </div>
                          </div>
                          <div id="selected-additional-display" class="mt-2 space-y-1">
                              <!-- Selected additional subjects will appear here -->
                          </div>
                      </div>
                      
                      <div class="flex gap-2 pt-2 border-t">
                          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                              Save
                          </button>
                          <button type="button" onclick="closeSubjectEditor()" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                              Cancel
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      </div>

      <script>
        const SCHOOL_ID = ${school.id};
        const ALL_SUBJECTS = ${JSON.stringify(allSubjects)};
        let selectedPrimarySubject = null;
        let selectedAdditionalSubjects = [];

        function toggleAddTeacherForm() {
            const form = document.getElementById('add-teacher-form');
            form.classList.toggle('hidden');
            if (!form.classList.contains('hidden')) {
                form.querySelector('input[name="full_name"]').focus();
            }
        }

        async function addTeacher(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            const phoneDigits = data.phone_digits.replace(/\D/g, '');
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
                alert('Network error. Please try again.');
            }
        }

        function openSubjectEditor(teacherId, teacherName) {
            document.getElementById('edit-teacher-id').value = teacherId;
            document.getElementById('teacher-name-display').textContent = teacherName;
            document.getElementById('subject-editor-modal').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Reset selections
            selectedPrimarySubject = null;
            selectedAdditionalSubjects = [];
            
            // Load current subjects for this teacher
            loadCurrentSubjects(teacherId);
        }

        function closeSubjectEditor() {
            document.getElementById('subject-editor-modal').classList.add('hidden');
            document.body.style.overflow = '';
            document.getElementById('subject-editor-form').reset();
            clearPrimarySubject();
            clearAdditionalSubjects();
            hideDropdowns();
        }

        function hideDropdowns() {
            document.getElementById('primary-dropdown').classList.add('hidden');
            document.getElementById('additional-dropdown').classList.add('hidden');
        }

        function searchSubjects(type, query) {
            const dropdown = document.getElementById(type + '-dropdown');
            const filteredSubjects = ALL_SUBJECTS.filter(subject => {
                const matchesSearch = subject.subject_name.toLowerCase().includes(query.toLowerCase());
                if (type === 'primary') {
                    return matchesSearch && subject.id !== selectedPrimarySubject?.id;
                } else {
                    return matchesSearch && 
                           subject.id !== selectedPrimarySubject?.id && 
                           !selectedAdditionalSubjects.find(s => s.id === subject.id);
                }
            });
            
            if (query && filteredSubjects.length > 0) {
                dropdown.innerHTML = filteredSubjects.map(subject => 
                    '<div class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm" onclick="selectSubject(\'' + type + '\', ' + subject.id + ', \'' + subject.subject_name + '\')">' + 
                    subject.subject_name + 
                    '</div>'
                ).join('');
                dropdown.classList.remove('hidden');
            } else {
                dropdown.classList.add('hidden');
            }
        }

        function showSubjectDropdown(type) {
            const searchInput = document.getElementById(type + '-search');
            if (searchInput.value) {
                searchSubjects(type, searchInput.value);
            }
        }

        function selectSubject(type, id, name) {
            if (type === 'primary') {
                selectedPrimarySubject = { id, name };
                document.getElementById('selected-primary-subject').value = id;
                document.getElementById('primary-name').textContent = name;
                document.getElementById('selected-primary-display').classList.remove('hidden');
                document.getElementById('primary-search').value = '';
                document.getElementById('primary-dropdown').classList.add('hidden');
            } else {
                selectedAdditionalSubjects.push({ id, name });
                updateAdditionalDisplay();
                document.getElementById('additional-search').value = '';
                document.getElementById('additional-dropdown').classList.add('hidden');
            }
        }

        function clearPrimarySubject() {
            selectedPrimarySubject = null;
            document.getElementById('selected-primary-subject').value = '';
            document.getElementById('selected-primary-display').classList.add('hidden');
            document.getElementById('primary-search').value = '';
        }

        function removeAdditionalSubject(id) {
            selectedAdditionalSubjects = selectedAdditionalSubjects.filter(s => s.id !== id);
            updateAdditionalDisplay();
        }

        function clearAdditionalSubjects() {
            selectedAdditionalSubjects = [];
            updateAdditionalDisplay();
        }

        function updateAdditionalDisplay() {
            const display = document.getElementById('selected-additional-display');
            if (selectedAdditionalSubjects.length > 0) {
                display.innerHTML = selectedAdditionalSubjects.map(subject => 
                    '<span class="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">' + 
                    subject.name + 
                    '<button type="button" onclick="removeAdditionalSubject(' + subject.id + ')" class="ml-1 text-blue-600 hover:text-blue-800">×</button>' + 
                    '</span>'
                ).join('');
            } else {
                display.innerHTML = '';
            }
        }

        function loadCurrentSubjects(teacherId) {
            // Get current subjects from the displayed table
            const teacherRow = document.querySelector('tr:has(button[onclick*="' + teacherId + '"])');
            if (!teacherRow) return;
            
            const subjectsCell = teacherRow.cells[1];
            const primaryBadge = subjectsCell.querySelector('.bg-green-100');
            const additionalBadges = subjectsCell.querySelectorAll('.bg-blue-50');
            
            // Set primary subject
            if (primaryBadge) {
                const primaryText = primaryBadge.textContent.replace('🎯 ', '').trim();
                const primarySubject = ALL_SUBJECTS.find(s => s.subject_name === primaryText);
                if (primarySubject) {
                    selectedPrimarySubject = { id: primarySubject.id, name: primarySubject.subject_name };
                    document.getElementById('selected-primary-subject').value = primarySubject.id;
                    document.getElementById('primary-name').textContent = primarySubject.subject_name;
                    document.getElementById('selected-primary-display').classList.remove('hidden');
                }
            }
            
            // Set additional subjects
            additionalBadges.forEach(badge => {
                const subjectText = badge.textContent.trim();
                const subject = ALL_SUBJECTS.find(s => s.subject_name === subjectText);
                if (subject) {
                    selectedAdditionalSubjects.push({ id: subject.id, name: subject.subject_name });
                }
            });
            updateAdditionalDisplay();
        }

        async function saveSubjectAssignments(e) {
            e.preventDefault();
            
            if (!selectedPrimarySubject) {
                alert('Please select a primary subject');
                return;
            }
            
            const data = {
                teacher_id: document.getElementById('edit-teacher-id').value,
                primary_subject: selectedPrimarySubject.id,
                additional_subjects: selectedAdditionalSubjects.map(s => s.id),
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
                    closeSubjectEditor();
                    window.location.reload();
                } else {
                    alert('Error: ' + (result.error || 'Unknown error'));
                }
            } catch (error) {
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
                alert('Network error. Please try again.');
            }
        }

        // Event listeners
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeSubjectEditor();
            }
        });

        document.getElementById('subject-editor-modal')?.addEventListener('click', function(e) {
            if (e.target === this) {
                closeSubjectEditor();
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('#primary-search') && !e.target.closest('#primary-dropdown')) {
                document.getElementById('primary-dropdown').classList.add('hidden');
            }
            if (!e.target.closest('#additional-search') && !e.target.closest('#additional-dropdown')) {
                document.getElementById('additional-dropdown').classList.add('hidden');
            }
        });
      </script>
    `;
}

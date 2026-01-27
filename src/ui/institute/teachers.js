// src/ui/institute/teachers.js - Cloudflare Workers Compatible Teacher Management

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
                <td class="p-4">
                    <div class="font-medium text-gray-900">${safeHtml(t.full_name)}</div>
                    <div class="text-sm text-gray-500">${safeHtml(t.email)}</div>
                    <div class="text-sm text-gray-600">${safeHtml(t.phone)}</div>
                </td>
                <td class="p-4">
                    <div class="space-y-2">
                        ${primarySubject ? `
                            <span class="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                🎯 ${safeHtml(primarySubject.subject_name)}
                            </span>
                        ` : '<span class="text-gray-400 text-xs">No primary subject</span>'}
                        ${additionalSubjects.length > 0 ? `
                            <div class="flex flex-wrap gap-1">
                                ${additionalSubjects.map(s => `
                                    <span class="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                                        ${safeHtml(s.subject_name)}
                                    </span>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </td>
                <td class="p-4">
                    <div class="flex gap-2">
                        <button type="button" onclick="editSubjects(${t.id}, '${safeHtml(t.full_name)}')" 
                                class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Edit Subjects
                        </button>
                        <button type="button" onclick="removeTeacher(${t.id})" 
                                class="text-red-600 hover:text-red-800 text-sm font-medium">
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
              <button type="button" onclick="toggleAddForm()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  + Add Teacher
              </button>
          </div>

          <!-- Add Teacher Form -->
          <div id="add-form" class="hidden mb-6 bg-white rounded-lg border p-6">
              <h3 class="text-lg font-semibold mb-4">Add New Teacher</h3>
              <form onsubmit="addTeacher(event)" class="space-y-4">
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
                      <button type="button" onclick="toggleAddForm()" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
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

      <!-- Subject Modal -->
      <div id="subject-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
          <div class="bg-white rounded-lg max-w-md w-full">
              <!-- Step 1: Primary Subject Selection -->
              <div id="primary-step" class="p-4">
                  <div class="p-4 border-b">
                      <h3 class="font-semibold">Assign Primary Subject</h3>
                      <p class="text-sm text-gray-600">For <span id="teacher-name"></span></p>
                  </div>
                  <div class="p-4">
                      <form onsubmit="goToOptionalSubjects(event)" class="space-y-4">
                          <input type="hidden" id="modal-teacher-id">
                          <div>
                              <label class="block text-sm font-medium mb-2">Primary Subject *</label>
                              <select id="primary-subject" required class="w-full border rounded px-3 py-2">
                                  <option value="">Select primary subject...</option>
                                  ${allSubjects.map(s => `<option value="${s.id}">${safeHtml(s.subject_name)}</option>`).join('')}
                              </select>
                          </div>
                          <div class="flex gap-2 pt-2 border-t">
                              <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Continue</button>
                              <button type="button" onclick="closeModal()" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Cancel</button>
                          </div>
                      </form>
                  </div>
              </div>

              <!-- Step 2: Optional Subjects Selection -->
              <div id="optional-step" class="p-4 hidden">
                  <div class="p-4 border-b">
                      <h3 class="font-semibold">Assign Optional Subjects</h3>
                      <p class="text-sm text-gray-600">For <span id="teacher-name-optional"></span></p>
                      <p class="text-xs text-blue-600 mt-1">Primary: <span id="selected-primary-name"></span></p>
                  </div>
                  <div class="p-4">
                      <form onsubmit="saveSubjects(event)" class="space-y-4">
                          <input type="hidden" id="modal-teacher-id-optional">
                          <input type="hidden" id="selected-primary-id">
                          <div>
                              <label class="block text-sm font-medium mb-2">Optional Subjects</label>
                              <div class="max-h-40 overflow-y-auto border rounded p-2">
                                  ${allSubjects.map(s => `
                                      <label class="flex items-center gap-2 text-sm optional-subject-item" data-subject-id="${s.id}">
                                          <input type="checkbox" name="optional" value="${s.id}" class="optional-checkbox">
                                          ${safeHtml(s.subject_name)}
                                      </label>
                                  `).join('')}
                              </div>
                              <p class="text-xs text-gray-500 mt-1">Select additional subjects (optional)</p>
                          </div>
                          <div class="flex gap-2 pt-2 border-t">
                              <button type="button" onclick="goBackToPrimary()" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Back</button>
                              <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Confirm</button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>

      <script>
        // Data storage - simple approach
        window.teachersData = {
            teachers: ${JSON.stringify(teachers)},
            allSubjects: ${JSON.stringify(allSubjects)},
            teacherSubjects: ${JSON.stringify(teacherSubjects)}
        };

        // Simple functions
        function toggleAddForm() {
            document.getElementById('add-form').classList.toggle('hidden');
        }

        function addTeacher(e) {
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
            
            fetch('/school/teachers', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
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

        function editSubjects(teacherId, teacherName) {
            document.getElementById('modal-teacher-id').value = teacherId;
            document.getElementById('teacher-name').textContent = teacherName;
            document.getElementById('subject-modal').classList.remove('hidden');
            
            // Reset to primary step
            showPrimaryStep();
            
            // Load current subjects for editing
            const currentSubjects = window.teachersData.teacherSubjects.filter(ts => ts.teacher_id == teacherId);
            const primary = currentSubjects.find(ts => ts.is_primary === 1);
            const additional = currentSubjects.filter(ts => ts.is_primary === 0);
            
            if (primary) {
                document.getElementById('primary-subject').value = primary.subject_id;
            }
            
            // Store additional subjects for later
            window.currentAdditionalSubjects = additional.map(ts => ts.subject_id);
        }

        function showPrimaryStep() {
            document.getElementById('primary-step').classList.remove('hidden');
            document.getElementById('optional-step').classList.add('hidden');
        }

        function showOptionalStep() {
            document.getElementById('primary-step').classList.add('hidden');
            document.getElementById('optional-step').classList.remove('hidden');
        }

        function goToOptionalSubjects(e) {
            e.preventDefault();
            
            const primarySelect = document.getElementById('primary-subject');
            const primaryId = primarySelect.value;
            const primaryName = primarySelect.options[primarySelect.selectedIndex].text;
            
            if (!primaryId) {
                alert('Please select a primary subject');
                return;
            }
            
            // Set data for optional step
            document.getElementById('modal-teacher-id-optional').value = document.getElementById('modal-teacher-id').value;
            document.getElementById('teacher-name-optional').textContent = document.getElementById('teacher-name').textContent;
            document.getElementById('selected-primary-name').textContent = primaryName;
            document.getElementById('selected-primary-id').value = primaryId;
            
            // Update optional subjects list - hide the selected primary subject
            updateOptionalSubjectsList(primaryId);
            
            // Show optional step
            showOptionalStep();
        }

        function updateOptionalSubjectsList(primaryId) {
            const optionalItems = document.querySelectorAll('.optional-subject-item');
            const optionalCheckboxes = document.querySelectorAll('.optional-checkbox');
            
            optionalItems.forEach((item, index) => {
                const subjectId = item.dataset.subjectId;
                const checkbox = optionalCheckboxes[index];
                
                if (subjectId == primaryId) {
                    // Hide the primary subject from optional list
                    item.style.display = 'none';
                    checkbox.checked = false;
                    checkbox.disabled = true;
                } else {
                    // Show other subjects
                    item.style.display = 'flex';
                    checkbox.disabled = false;
                    
                    // Pre-select if it was previously selected
                    if (window.currentAdditionalSubjects && window.currentAdditionalSubjects.includes(parseInt(subjectId))) {
                        checkbox.checked = true;
                    }
                }
            });
        }

        function goBackToPrimary() {
            showPrimaryStep();
        }

        function closeModal() {
            document.getElementById('subject-modal').classList.add('hidden');
            showPrimaryStep(); // Reset to primary step for next time
            window.currentAdditionalSubjects = []; // Clear stored additional subjects
        }

        function saveSubjects(e) {
            e.preventDefault();
            
            const primary = document.getElementById('selected-primary-id').value;
            if (!primary) {
                alert('Please select a primary subject');
                return;
            }
            
            const additional = Array.from(document.querySelectorAll('input[name="optional"]:checked'))
                .map(cb => parseInt(cb.value));
            
            const data = {
                teacher_id: document.getElementById('modal-teacher-id-optional').value,
                primary_subject: parseInt(primary),
                additional_subjects: additional,
                action: 'assign_subjects'
            };
            
            fetch('/school/teachers', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(r => r.json()).then(result => {
                if (result.success) {
                    closeModal();
                    location.reload();
                } else {
                    alert('Error: ' + (result.error || 'Unknown error'));
                }
            }).catch(err => {
                alert('Network error. Please try again.');
            });
        }

        function removeTeacher(teacherId) {
            if (!confirm('Remove this teacher?')) return;
            
            fetch('/school/teachers', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: teacherId})
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

        function safeHtml(text) {
            if (!text) return '';
            return text.toString()
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }
      </script>
    `;
}

function safeHtml(text) {
    if (!text) return '';
    return text.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// src/ui/institute/teachers.js - Clean Minimal Teacher Management

function escapeHtml(text) {
    if (!text) return '';
    return text.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

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
            <tr class="border-b">
                <td class="p-3">${escapeHtml(t.full_name)}</td>
                <td class="p-3">${escapeHtml(t.email)}</td>
                <td class="p-3">${escapeHtml(t.phone || '')}</td>
                <td class="p-3">
                    ${primarySubject ? escapeHtml(primarySubject.subject_name) : 'Not assigned'}
                    ${additionalSubjects.length > 0 ? ', ' + additionalSubjects.map(s => escapeHtml(s.subject_name)).join(', ') : ''}
                </td>
                <td class="p-3">
                    <button type="button" onclick="editSubjects(${t.id}, '${escapeHtml(t.full_name)}')" 
                            class="text-blue-600 hover:text-blue-800 text-sm">
                        Edit
                    </button>
                    <button type="button" onclick="removeTeacher(${t.id})" 
                            class="text-red-600 hover:text-red-800 text-sm ml-3">
                        Remove
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    return `
      <div class="p-6">
          <div class="flex justify-between items-center mb-6">
              <h1 class="text-xl font-bold">Teachers Management</h1>
              <button type="button" onclick="toggleAddForm()" class="bg-blue-600 text-white px-4 py-2">
                  + Add Teacher
              </button>
          </div>

          <!-- Add Teacher Form -->
          <div id="add-form" class="hidden mb-6 border p-4">
              <h3 class="font-semibold mb-4">Add New Teacher</h3>
              <form onsubmit="addTeacher(event)" class="space-y-4">
                  <div class="grid grid-cols-3 gap-4">
                      <input type="text" name="full_name" placeholder="Full Name" required 
                             class="border px-3 py-2">
                      <input type="email" name="email" placeholder="Email" required 
                             class="border px-3 py-2">
                      <input type="text" name="phone" placeholder="Phone" 
                             class="border px-3 py-2">
                  </div>
                  <div class="flex gap-2">
                      <button type="submit" class="bg-blue-600 text-white px-4 py-2">
                          Add Teacher
                      </button>
                      <button type="button" onclick="toggleAddForm()" class="bg-gray-200 text-gray-800 px-4 py-2">
                          Cancel
                      </button>
                  </div>
              </form>
          </div>

          <!-- Teachers Table -->
          <div class="border">
              <table class="w-full border-collapse">
                  <thead class="bg-gray-100">
                      <tr>
                          <th class="border p-3 text-left">Name</th>
                          <th class="border p-3 text-left">Email</th>
                          <th class="border p-3 text-left">Phone</th>
                          <th class="border p-3 text-left">Subjects</th>
                          <th class="border p-3 text-left">Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${teacherRows.length > 0 ? teacherRows : `
                          <tr>
                              <td colspan="5" class="border p-8 text-center text-gray-500">
                                  No teachers added yet
                              </td>
                          </tr>
                      `}
                  </tbody>
              </table>
          </div>
      </div>

      <!-- Subject Modal -->
      <div id="subject-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
          <div class="bg-white rounded max-w-md w-full">
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
                              <select id="primary-subject" required class="w-full border px-3 py-2">
                                  <option value="">Select primary subject...</option>
                                  ${allSubjects.map(s => `<option value="${s.id}">${escapeHtml(s.subject_name)}</option>`).join('')}
                              </select>
                          </div>
                          <div class="flex gap-2 pt-2 border-t">
                              <button type="submit" class="bg-blue-600 text-white px-4 py-2">Continue</button>
                              <button type="button" onclick="closeModal()" class="bg-gray-200 text-gray-800 px-4 py-2">Cancel</button>
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
                              <div class="max-h-40 overflow-y-auto border p-2">
                                  ${allSubjects.map(s => `
                                      <label class="flex items-center gap-2 text-sm optional-subject-item" data-subject-id="${s.id}">
                                          <input type="checkbox" name="optional" value="${s.id}" class="optional-checkbox">
                                          ${escapeHtml(s.subject_name)}
                                      </label>
                                  `).join('')}
                              </div>
                              <p class="text-xs text-gray-500 mt-1">Select additional subjects (optional)</p>
                          </div>
                          <div class="flex gap-2 pt-2 border-t">
                              <button type="button" onclick="goBackToPrimary()" class="bg-gray-200 text-gray-800 px-4 py-2">Back</button>
                              <button type="submit" class="bg-blue-600 text-white px-4 py-2">Confirm</button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>

      <script>
        // Data storage
        window.teachersData = {
            teachers: ${JSON.stringify(teachers)},
            allSubjects: ${JSON.stringify(allSubjects)},
            teacherSubjects: ${JSON.stringify(teacherSubjects)}
        };

        function toggleAddForm() {
            document.getElementById('add-form').classList.toggle('hidden');
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
            
            showPrimaryStep();
            
            const currentSubjects = window.teachersData.teacherSubjects.filter(ts => ts.teacher_id == teacherId);
            const primary = currentSubjects.find(ts => ts.is_primary === 1);
            const additional = currentSubjects.filter(ts => ts.is_primary === 0);
            
            if (primary) {
                document.getElementById('primary-subject').value = primary.subject_id;
            }
            
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
            
            document.getElementById('modal-teacher-id-optional').value = document.getElementById('modal-teacher-id').value;
            document.getElementById('teacher-name-optional').textContent = document.getElementById('teacher-name').textContent;
            document.getElementById('selected-primary-name').textContent = primaryName;
            document.getElementById('selected-primary-id').value = primaryId;
            
            updateOptionalSubjectsList(primaryId);
            showOptionalStep();
        }

        function updateOptionalSubjectsList(primaryId) {
            const optionalItems = document.querySelectorAll('.optional-subject-item');
            const optionalCheckboxes = document.querySelectorAll('.optional-checkbox');
            
            optionalItems.forEach((item, index) => {
                const subjectId = item.dataset.subjectId;
                const checkbox = optionalCheckboxes[index];
                
                if (subjectId == primaryId) {
                    item.style.display = 'none';
                    checkbox.checked = false;
                    checkbox.disabled = true;
                } else {
                    item.style.display = 'flex';
                    checkbox.disabled = false;
                    
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
            showPrimaryStep();
            window.currentAdditionalSubjects = [];
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
      </script>
    `;
}

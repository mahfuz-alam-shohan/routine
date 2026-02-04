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
    
    const subjectsByTeacher = {};
    teacherSubjects.forEach(ts => {
        if (!subjectsByTeacher[ts.teacher_id]) subjectsByTeacher[ts.teacher_id] = [];
        subjectsByTeacher[ts.teacher_id].push(ts);
    });

    const teacherRows = teachers.map(t => {
        const teacherSubjectsList = subjectsByTeacher[t.id] || [];
        const primarySubject = teacherSubjectsList.find(ts => ts.is_primary === 1);
        const additionalSubjects = teacherSubjectsList.filter(ts => ts.is_primary === 0);
        
        return `
            <tr class="border-b" data-teacher-id="${t.id}">
                <td class="p-3" data-teacher-name="${t.id}">${escapeHtml(t.full_name)}</td>
                <td class="p-3 break-words">${escapeHtml(t.email)}</td>
                <td class="p-3">${escapeHtml(t.phone || '')}</td>
                <td class="p-3 break-words" data-subject-cell="${t.id}">
                    ${primarySubject ? escapeHtml(primarySubject.subject_name) : 'Not assigned'}
                    ${additionalSubjects.length > 0 ? ', ' + additionalSubjects.map(s => escapeHtml(s.subject_name)).join(', ') : ''}
                </td>
                <td class="p-3 whitespace-nowrap">
                    <button type="button" onclick="editSubjects(${t.id})" 
                            class="text-blue-700 text-sm">
                        Edit
                    </button>
                    <button type="button" onclick="editTeacherName(${t.id})" 
                            class="text-indigo-700 text-sm ml-3">
                        Rename
                    </button>
                    <button type="button" onclick="removeTeacher(${t.id})" 
                            class="text-red-700 text-sm ml-3">
                        Remove
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    return `
      <div class="p-4 sm:p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h1 class="ui-title">Teachers Management</h1>
              <div class="flex flex-col sm:flex-row gap-2">
                  <button type="button" onclick="toggleBulkUpload()" class="ui-button w-full sm:w-auto">Bulk Upload</button>
                  <button type="button" onclick="toggleAddForm()" class="ui-button ui-button--primary w-full sm:w-auto">
                      Add Teacher
                  </button>
              </div>
          </div>

          <div id="bulk-upload-section" class="hidden mb-6 ui-panel p-4">
              <h3 class="text-sm font-semibold mb-4">Bulk Upload Teachers</h3>
              
              <div class="mb-4 p-3 border border-gray-300">
                  <h4 class="text-xs font-semibold text-gray-800 mb-2">Instructions</h4>
                  <ol class="text-xs text-gray-600 list-decimal list-inside space-y-1">
                      <li>Download the JSON template file below</li>
                      <li>Edit the file with your teacher data</li>
                      <li>Upload the filled JSON file</li>
                      <li>Review and confirm the upload</li>
                  </ol>
              </div>

              <div class="flex flex-col sm:flex-row gap-3 mb-4">
                  <button type="button" onclick="downloadTemplate()" class="ui-button ui-button--primary">Download JSON Template
                  </button>
                  <label class="ui-button cursor-pointer">Upload JSON File
                      <input type="file" id="jsonFileInput" accept=".json" onchange="handleFileUpload()" class="hidden">
                  </label>
              </div>

              <div id="upload-status" class="hidden mb-4 p-3 border border-gray-300 text-xs"></div>

              <div id="preview-section" class="hidden">
                  <h4 class="text-sm font-semibold mb-3">Preview Teachers to Upload</h4>
                  <div class="border border-gray-300 overflow-x-auto bg-white max-h-64 overflow-y-auto">
                      <table class="w-full text-sm">
                          <thead class="bg-gray-100 sticky top-0">
                              <tr>
                                  <th class="border p-2 text-left">Name</th>
                                  <th class="border p-2 text-left">Email</th>
                                  <th class="border p-2 text-left">Phone</th>
                              </tr>
                          </thead>
                          <tbody id="preview-tbody">
                          </tbody>
                      </table>
                  </div>
                  <div class="flex gap-2 mt-3">
                      <button type="button" onclick="confirmBulkUpload()" class="ui-button ui-button--primary">Confirm Upload
                      </button>
                      <button type="button" onclick="cancelBulkUpload()" class="ui-button">Cancel
                  </button>
                  </div>
              </div>
          </div>

          <div id="add-form" class="hidden mb-6 ui-panel p-4">
              <h3 class="text-sm font-semibold mb-4">Add New Teacher</h3>
              <form onsubmit="addTeacher(event)" class="space-y-4">
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                          <label class="block text-sm font-medium mb-1">Full Name *</label>
                          <input type="text" name="full_name" placeholder="e.g. John Smith" required 
                                 class="w-full border border-gray-300 px-3 py-2">
                      </div>
                      <div>
                          <label class="block text-sm font-medium mb-1">Email *</label>
                          <input type="text" name="email" placeholder="e.g. john@school.com" required 
                                 class="w-full border border-gray-300 px-3 py-2">
                      </div>
                      <div>
                          <label class="block text-sm font-medium mb-1">Phone Number</label>
                          <input type="text" name="phone" placeholder="e.g. +1234567890"
                                   class="w-full border border-gray-300 px-3 py-2">
                      </div>
                  </div>
                  <div class="flex flex-col sm:flex-row gap-2">
                      <button type="submit" class="ui-button ui-button--primary w-full sm:w-auto">
                          Add Teacher
                      </button>
                      <button type="button" onclick="toggleAddForm()" class="ui-button w-full sm:w-auto">Cancel
                      </button>
                  </div>
              </form>
          </div>

          <div class="ui-panel overflow-x-auto">
              <table class="w-full min-w-[720px] border-collapse text-sm">
                  <thead class="bg-gray-100">
                      <tr>
                          <th class="border p-3 text-left">Name</th>
                          <th class="border p-3 text-left">Email</th>
                          <th class="border p-3 text-left">Phone</th>
                          <th class="border p-3 text-left">Subjects</th>
                          <th class="border p-3 text-left">Actions</th>
                      </tr>
                  </thead>
                  <tbody id="teachers-tbody">
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

      <div id="subject-modal" class="fixed inset-0 bg-black bg-opacity-50 z-[9999] hidden flex items-center justify-center p-4">
          <div class="bg-white border border-gray-300 max-w-md w-full">
              <div id="primary-step" class="p-4">
                  <div class="p-4 border-b">
                      <h3 class="text-sm font-semibold">Assign Primary Subject</h3>
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
                              <button type="submit" class="ui-button ui-button--primary">Continue</button>
                              <button type="button" onclick="closeModal()" class="ui-button">Cancel</button>
                          </div>
                      </form>
                  </div>
              </div>

              <div id="optional-step" class="p-4 hidden">
                  <div class="p-4 border-b">
                      <h3 class="text-sm font-semibold">Assign Optional Subjects</h3>
                      <p class="text-sm text-gray-600">For <span id="teacher-name-optional"></span></p>
                      <p class="text-xs text-gray-600 mt-1">Primary: <span id="selected-primary-name"></span></p>
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
                              <p class="text-xs text-gray-600 mt-1">Select additional subjects (optional)</p>
                          </div>
                          <div class="flex gap-2 pt-2 border-t">
                              <button type="button" onclick="goBackToPrimary()" class="ui-button">Back</button>
                              <button type="submit" class="ui-button ui-button--primary">Confirm</button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>

      <div id="sync-indicator" class="fixed bottom-4 right-4 z-[10000] hidden bg-gray-900 text-white text-xs font-semibold px-3 py-2">Syncing...</div>
      <div id="toast-container" class="fixed bottom-4 left-4 z-[10000] space-y-2"></div>

      <script>
        window.teachersData = {
            teachers: ${JSON.stringify(teachers)},
            allSubjects: ${JSON.stringify(allSubjects)},
            teacherSubjects: ${JSON.stringify(teacherSubjects)}
        };
        window.nextTeacherId = -1;

        function escapeHtml(text) {
            if (!text) return '';
            return text.toString()
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
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

        function buildSubjectText(teacherId) {
            const list = window.teachersData.teacherSubjects.filter(ts => ts.teacher_id == teacherId);
            const primary = list.find(ts => ts.is_primary === 1);
            const additional = list.filter(ts => ts.is_primary === 0);
            let text = primary ? primary.subject_name : 'Not assigned';
            if (additional.length > 0) {
                text += ', ' + additional.map(s => s.subject_name).join(', ');
            }
            return text;
        }

        function updateSubjectCell(teacherId) {
            const cell = document.querySelector('[data-subject-cell="' + teacherId + '"]');
            if (!cell) return false;
            cell.textContent = buildSubjectText(teacherId);
            return true;
        }

        function updateTeacherNameCell(teacherId, name) {
            const cell = document.querySelector('[data-teacher-name="' + teacherId + '"]');
            if (!cell) return false;
            cell.textContent = name;
            return true;
        }

        function updateTeacherSubjectsData(teacherId, primaryId, additionalIds) {
            window.teachersData.teacherSubjects = window.teachersData.teacherSubjects.filter(ts => ts.teacher_id != teacherId);
            const primarySubject = window.teachersData.allSubjects.find(s => s.id == primaryId);
            if (primarySubject) {
                window.teachersData.teacherSubjects.push({
                    teacher_id: Number(teacherId),
                    subject_id: Number(primaryId),
                    is_primary: 1,
                    subject_name: primarySubject.subject_name
                });
            }
            additionalIds.forEach(subjectId => {
                const subj = window.teachersData.allSubjects.find(s => s.id == subjectId);
                if (subj) {
                    window.teachersData.teacherSubjects.push({
                        teacher_id: Number(teacherId),
                        subject_id: Number(subjectId),
                        is_primary: 0,
                        subject_name: subj.subject_name
                    });
                }
            });
        }

        function buildTeacherSubjectsText(teacherSubjectsList) {
            const primary = teacherSubjectsList.find(ts => ts.is_primary === 1);
            const additional = teacherSubjectsList.filter(ts => ts.is_primary === 0);
            let text = primary ? primary.subject_name : 'Not assigned';
            if (additional.length > 0) {
                text += ', ' + additional.map(s => s.subject_name).join(', ');
            }
            return text;
        }

        function renderTeachersTable() {
            const tbody = document.getElementById('teachers-tbody');
            if (!tbody) return false;
            const teachers = (window.teachersData && window.teachersData.teachers) ? window.teachersData.teachers.slice() : [];
            if (!teachers.length) {
                tbody.innerHTML = '<tr><td colspan="5" class="border p-8 text-center text-gray-500">No teachers added yet</td></tr>';
                return true;
            }
            teachers.sort((a, b) => String(a.full_name || '').localeCompare(String(b.full_name || '')));
            const rows = teachers.map(teacher => {
                const currentSubjects = window.teachersData.teacherSubjects.filter(ts => ts.teacher_id == teacher.id);
                const subjectsText = buildTeacherSubjectsText(currentSubjects);
                return '<tr class="border-b" data-teacher-id="' + teacher.id + '">' +
                    '<td class="p-3" data-teacher-name="' + teacher.id + '">' + escapeHtml(teacher.full_name) + '</td>' +
                    '<td class="p-3 break-words">' + escapeHtml(teacher.email) + '</td>' +
                    '<td class="p-3">' + escapeHtml(teacher.phone || '') + '</td>' +
                    '<td class="p-3 break-words" data-subject-cell="' + teacher.id + '">' + escapeHtml(subjectsText) + '</td>' +
                    '<td class="p-3 whitespace-nowrap">' +
                        '<button type="button" onclick="editSubjects(' + teacher.id + ')" class="text-blue-700 text-sm">Edit</button>' +
                        '<button type="button" onclick="editTeacherName(' + teacher.id + ')" class="text-indigo-700 text-sm ml-3">Rename</button>' +
                        '<button type="button" onclick="removeTeacher(' + teacher.id + ')" class="text-red-700 text-sm ml-3">Remove</button>' +
                    '</td>' +
                '</tr>';
            }).join('');
            tbody.innerHTML = rows;
            return true;
        }

        function addTeacherRow(teacher) {
            const tbody = document.getElementById('teachers-tbody');
            if (!tbody) return false;
            const currentSubjects = window.teachersData.teacherSubjects.filter(ts => ts.teacher_id == teacher.id);
            const subjectsText = buildTeacherSubjectsText(currentSubjects);
            const rowHtml = '<tr class="border-b" data-teacher-id="' + teacher.id + '">' +
                '<td class="p-3" data-teacher-name="' + teacher.id + '">' + escapeHtml(teacher.full_name) + '</td>' +
                '<td class="p-3 break-words">' + escapeHtml(teacher.email) + '</td>' +
                '<td class="p-3">' + escapeHtml(teacher.phone || '') + '</td>' +
                '<td class="p-3 break-words" data-subject-cell="' + teacher.id + '">' + escapeHtml(subjectsText) + '</td>' +
                '<td class="p-3 whitespace-nowrap">' +
                    '<button type="button" onclick="editSubjects(' + teacher.id + ')" class="text-blue-700 text-sm">Edit</button>' +
                    '<button type="button" onclick="editTeacherName(' + teacher.id + ')" class="text-indigo-700 text-sm ml-3">Rename</button>' +
                    '<button type="button" onclick="removeTeacher(' + teacher.id + ')" class="text-red-700 text-sm ml-3">Remove</button>' +
                '</td>' +
            '</tr>';

            const emptyRow = tbody.querySelector('td[colspan="5"]');
            if (emptyRow) {
                tbody.innerHTML = rowHtml;
            } else {
                tbody.insertAdjacentHTML('beforeend', rowHtml);
            }
            return true;
        }

        function toggleAddForm() {
            document.getElementById('add-form').classList.toggle('hidden');
        }

        function toggleBulkUpload() {
            const section = document.getElementById('bulk-upload-section');
            section.classList.toggle('hidden');
            if (!section.classList.contains('hidden')) {
                document.getElementById('add-form').classList.add('hidden');
            }
        }

        function downloadTemplate() {
            const template = {
                "teachers": [
                    {
                        "full_name": "Dr. Sarah Johnson",
                        "email": "sarah.johnson@school.com",
                        "phone": "+1234567890"
                    },
                    {
                        "full_name": "Prof. Michael Chen",
                        "email": "michael.chen@school.com", 
                        "phone": "+1234567891"
                    },
                    {
                        "full_name": "Ms. Emily Rodriguez",
                        "email": "emily.rodriguez@school.com",
                        "phone": "+1234567892"
                    },
                    {
                        "full_name": "Mr. David Kim",
                        "email": "david.kim@school.com",
                        "phone": "+1234567893"
                    },
                    {
                        "full_name": "Dr. Lisa Anderson",
                        "email": "lisa.anderson@school.com",
                        "phone": "+1234567894"
                    },
                    {
                        "full_name": "Prof. James Wilson",
                        "email": "james.wilson@school.com",
                        "phone": "+1234567895"
                    },
                    {
                        "full_name": "Ms. Maria Garcia",
                        "email": "maria.garcia@school.com",
                        "phone": "+1234567896"
                    },
                    {
                        "full_name": "Mr. Robert Taylor",
                        "email": "robert.taylor@school.com",
                        "phone": "+1234567897"
                    },
                    {
                        "full_name": "Dr. Jennifer Brown",
                        "email": "jennifer.brown@school.com",
                        "phone": "+1234567898"
                    },
                    {
                        "full_name": "Prof. William Davis",
                        "email": "william.davis@school.com",
                        "phone": "+1234567899"
                    }
                ],
                "instructions": {
                    "format": "JSON array with 'teachers' key",
                    "required_fields": ["full_name", "email"],
                    "optional_fields": ["phone"],
                    "notes": [
                        "full_name: Teacher's full name (required)",
                        "email: Valid email address (required)", 
                        "phone: Phone number with country code (optional)",
                        "Remove this instructions section before uploading"
                    ]
                }
            };

            const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'teachers_template.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function handleFileUpload() {
            const fileInput = document.getElementById('jsonFileInput');
            const file = fileInput.files[0];
            
            if (!file) return;
            
            const statusDiv = document.getElementById('upload-status');
            const previewSection = document.getElementById('preview-section');
            
            statusDiv.className = 'mb-4 p-3 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-800';
            statusDiv.textContent = 'Reading file...';
            statusDiv.classList.remove('hidden');
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (!data.teachers || !Array.isArray(data.teachers)) {
                        throw new Error('Invalid format: File must contain a "teachers" array');
                    }
                    
                    const validTeachers = [];
                    const errors = [];
                    
                    data.teachers.forEach(function(teacher, index) {
                        if (!teacher.full_name || !teacher.email) {
                            errors.push('Row ' + (index + 1) + ': Missing required fields (full_name, email)');
                            return;
                        }
                        
                        validTeachers.push({
                            full_name: teacher.full_name.trim(),
                            email: teacher.email.trim(),
                            phone: teacher.phone ? teacher.phone.trim() : ''
                        });
                    });
                    
                    if (errors.length > 0) {
                        statusDiv.className = 'mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-800';
                        statusDiv.innerHTML = '<strong>Validation Errors:</strong><br>' + errors.join('<br>');
                        previewSection.classList.add('hidden');
                        return;
                    }
                    
                    if (validTeachers.length === 0) {
                        statusDiv.className = 'mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-800';
                        statusDiv.textContent = 'No valid teachers found in file';
                        previewSection.classList.add('hidden');
                        return;
                    }
                    
                    window.uploadedTeachers = validTeachers;
                    
                    statusDiv.className = 'mb-4 p-3 rounded-lg bg-green-100 border border-green-300 text-green-800';
                    statusDiv.textContent = 'Loaded ' + validTeachers.length + ' teacher(s)';
                    
                    const tbody = document.getElementById('preview-tbody');
                    tbody.innerHTML = validTeachers.map(function(teacher) {
                        return '<tr class="border-b">' +
                            '<td class="border p-2">' + escapeHtml(teacher.full_name) + '</td>' +
                            '<td class="border p-2">' + escapeHtml(teacher.email) + '</td>' +
                            '<td class="border p-2">' + escapeHtml(teacher.phone || '-') + '</td>' +
                        '</tr>';
                    }).join('');
                    
                    previewSection.classList.remove('hidden');
                    
                } catch (error) {
                    statusDiv.className = 'mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-800';
                    statusDiv.textContent = 'Error parsing JSON file: ' + error.message;
                    previewSection.classList.add('hidden');
                }
            };
            
            reader.readAsText(file);
        }

        function confirmBulkUpload() {
            if (!window.uploadedTeachers || window.uploadedTeachers.length === 0) return;
            
            const statusDiv = document.getElementById('upload-status');
            statusDiv.className = 'mb-4 p-3 rounded-lg bg-blue-100 border border-blue-300 text-blue-800';
            statusDiv.textContent = 'Uploading teachers...';
            showSyncIndicator('Uploading...');
            
            let successCount = 0;
            let errorCount = 0;
            const errors = [];
            
            async function uploadNext(index) {
                if (index >= window.uploadedTeachers.length) {
                    if (errorCount === 0) {
                        statusDiv.className = 'mb-4 p-3 rounded-lg bg-green-100 border border-green-300 text-green-800';
                        statusDiv.textContent = 'Uploaded ' + successCount + ' teacher(s)!';
                        hideSyncIndicator();
                        showToast('Bulk upload complete', 'success');
                    } else {
                        statusDiv.className = 'mb-4 p-3 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-800';
                        statusDiv.innerHTML = '<strong>Upload Complete:</strong> ' + successCount + ' uploaded, ' + errorCount + ' failed<br><small>' + errors.join(', ') + '</small>';
                        hideSyncIndicator();
                        showToast('Bulk upload finished with errors', 'error');
                    }
                    return;
                }
                
                const teacher = window.uploadedTeachers[index];
                
                try {
                    const response = await fetch('/school/teachers-list', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(teacher)
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        successCount++;
                        const newTeacher = {
                            id: result.id ? result.id : window.nextTeacherId--,
                            full_name: teacher.full_name,
                            email: teacher.email,
                            phone: teacher.phone || ''
                        };
                        window.teachersData.teachers.push(newTeacher);
                        addTeacherRow(newTeacher);
                    } else {
                        errorCount++;
                        errors.push(teacher.full_name + ': ' + (result.error || 'Unknown error'));
                    }
                } catch (error) {
                    errorCount++;
                    errors.push(teacher.full_name + ': Network error');
                }
                
                statusDiv.textContent = 'Uploading teachers... ' + (index + 1) + '/' + window.uploadedTeachers.length + ' (' + successCount + ' success, ' + errorCount + ' errors)';
                uploadNext(index + 1);
            }
            
            uploadNext(0);
        }

        function cancelBulkUpload() {
            window.uploadedTeachers = [];
            document.getElementById('jsonFileInput').value = '';
            document.getElementById('upload-status').classList.add('hidden');
            document.getElementById('preview-section').classList.add('hidden');
        }

        function addTeacher(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            showSyncIndicator('Adding...');
            
            fetch('/school/teachers-list', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(r => r.json()).then(result => {
                if (result.success) {
                    const newTeacher = {
                        id: result.id ? result.id : window.nextTeacherId--,
                        full_name: data.full_name,
                        email: data.email,
                        phone: data.phone || ''
                    };
                    window.teachersData.teachers.push(newTeacher);
                    addTeacherRow(newTeacher);
                    e.target.reset();
                    toggleAddForm();
                    hideSyncIndicator();
                    showToast('Teacher added', 'success');
                } else {
                    hideSyncIndicator();
                    alert('Error: ' + (result.error || 'Unknown error'));
                }
            }).catch(err => {
                hideSyncIndicator();
                alert('Network error. Please try again.');
            });
        }

        function editSubjects(teacherId) {
            const teacher = window.teachersData.teachers.find(t => t.id == teacherId);
            const teacherName = teacher ? teacher.full_name : 'Teacher';
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

        function editTeacherName(teacherId) {
            const teacher = window.teachersData.teachers.find(t => t.id == teacherId);
            const currentName = teacher ? teacher.full_name : '';
            const newName = prompt('Edit teacher name', currentName);
            if (newName === null) return;
            const trimmed = newName.trim();
            if (!trimmed || trimmed === currentName) return;

            showSyncIndicator('Saving...');
            fetch('/school/teachers-list', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    action: 'update_name',
                    teacher_id: teacherId,
                    full_name: trimmed
                })
            }).then(r => r.json()).then(result => {
                if (result.success) {
                    if (teacher) teacher.full_name = trimmed;
                    const updated = updateTeacherNameCell(teacherId, trimmed);
                    hideSyncIndicator();
                    showToast('Updated', 'success');
                    if (!updated) renderTeachersTable();
                } else {
                    hideSyncIndicator();
                    alert('Error: ' + (result.error || 'Unknown error'));
                }
            }).catch(() => {
                hideSyncIndicator();
                alert('Network error. Please try again.');
            });
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
            
            showSyncIndicator('Saving...');
            fetch('/school/teachers-list', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(r => r.json()).then(result => {
                if (result.success) {
                    closeModal();
                    updateTeacherSubjectsData(data.teacher_id, data.primary_subject, additional);
                    const updated = updateSubjectCell(data.teacher_id);
                    hideSyncIndicator();
                    showToast('Updated', 'success');
                    if (!updated) {
                        renderTeachersTable();
                    }
                } else {
                    hideSyncIndicator();
                    alert('Error: ' + (result.error || 'Unknown error'));
                }
            }).catch(err => {
                hideSyncIndicator();
                alert('Network error. Please try again.');
            });
        }

        function removeTeacher(teacherId) {
            if (!confirm('Remove this teacher? This will delete all their assignments, subjects, and routine data permanently.')) return;
            
            showSyncIndicator('Removing...');
            fetch('/school/teachers-list', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: teacherId})
            }).then(r => r.json()).then(result => {
                if (result.success) {
                    window.teachersData.teachers = window.teachersData.teachers.filter(t => t.id != teacherId);
                    window.teachersData.teacherSubjects = window.teachersData.teacherSubjects.filter(ts => ts.teacher_id != teacherId);
                    const row = document.querySelector('[data-teacher-id="' + teacherId + '"]');
                    if (row && row.parentNode) {
                        row.parentNode.removeChild(row);
                        const tbody = document.getElementById('teachers-tbody');
                        if (tbody && document.querySelectorAll('[data-teacher-id]').length === 0) {
                            tbody.innerHTML = '<tr><td colspan="5" class="border p-8 text-center text-gray-500">No teachers added yet</td></tr>';
                        }
                        hideSyncIndicator();
                        showToast('Removed', 'success');
                    } else {
                        renderTeachersTable();
                    }
                } else {
                    hideSyncIndicator();
                    alert('Error: ' + (result.error || 'Unknown error'));
                }
            }).catch(err => {
                hideSyncIndicator();
                alert('Network error. Please try again.');
            });
        }

        function downloadTemplate() {
            const template = {
                "teachers": [
                    {
                        "full_name": "Dr. Sarah Johnson",
                        "email": "sarah.johnson@school.com",
                        "phone": "+1234567890"
                    },
                    {
                        "full_name": "Prof. Michael Chen",
                        "email": "michael.chen@school.com", 
                        "phone": "+1234567891"
                    },
                    {
                        "full_name": "Ms. Emily Rodriguez",
                        "email": "emily.rodriguez@school.com",
                        "phone": "+1234567892"
                    },
                    {
                        "full_name": "Mr. David Kim",
                        "email": "david.kim@school.com",
                        "phone": "+1234567893"
                    },
                    {
                        "full_name": "Dr. Lisa Anderson",
                        "email": "lisa.anderson@school.com",
                        "phone": "+1234567894"
                    }
                ],
                "instructions": {
                    "format": "JSON array with 'teachers' key",
                    "required_fields": ["full_name", "email"],
                    "optional_fields": ["phone"],
                    "notes": [
                        "full_name: Teacher's full name (required)",
                        "email: Valid email address (required)", 
                        "phone: Phone number with country code (optional)",
                        "Remove this instructions section before uploading"
                    ]
                }
            };

            const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'teachers_template.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function handleFileUpload() {
            const fileInput = document.getElementById('jsonFileInput');
            const file = fileInput.files[0];
            
            if (!file) return;
            
            const statusDiv = document.getElementById('upload-status');
            const previewSection = document.getElementById('preview-section');
            
            statusDiv.className = 'mb-4 p-3 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-800';
            statusDiv.textContent = 'Reading file...';
            statusDiv.classList.remove('hidden');
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (!data.teachers || !Array.isArray(data.teachers)) {
                        throw new Error('Invalid format: File must contain a "teachers" array');
                    }
                    
                    const validTeachers = [];
                    const errors = [];
                    
                    data.teachers.forEach(function(teacher, index) {
                        if (!teacher.full_name || !teacher.email) {
                            errors.push('Row ' + (index + 1) + ': Missing required fields (full_name, email)');
                            return;
                        }
                        
                        validTeachers.push({
                            full_name: teacher.full_name.trim(),
                            email: teacher.email.trim(),
                            phone: teacher.phone ? teacher.phone.trim() : ''
                        });
                    });
                    
                    if (errors.length > 0) {
                        statusDiv.className = 'mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-800';
                        statusDiv.innerHTML = '<strong>Validation Errors:</strong><br>' + errors.join('<br>');
                        previewSection.classList.add('hidden');
                        return;
                    }
                    
                    if (validTeachers.length === 0) {
                        statusDiv.className = 'mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-800';
                        statusDiv.textContent = 'No valid teachers found in file';
                        previewSection.classList.add('hidden');
                        return;
                    }
                    
                    uploadedTeachers = validTeachers;
                    statusDiv.className = 'mb-4 p-3 rounded-lg bg-green-100 border border-green-300 text-green-800';
                    statusDiv.textContent = 'Loaded ' + validTeachers.length + ' teacher(s)';
                    
                    var tbody = document.getElementById('preview-tbody');
                    tbody.innerHTML = validTeachers.map(function(teacher) {
                        return '<tr class="border-b">' +
                            '<td class="border p-2">' + escapeHtml(teacher.full_name) + '</td>' +
                            '<td class="border p-2">' + escapeHtml(teacher.email) + '</td>' +
                            '<td class="border p-2">' + escapeHtml(teacher.phone || '-') + '</td>' +
                        '</tr>';
                    }).join('');
                    
                    previewSection.classList.remove('hidden');
                    
                } catch (error) {
                    statusDiv.className = 'mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-800';
                    statusDiv.textContent = 'Error parsing JSON file: ' + error.message;
                    previewSection.classList.add('hidden');
                }
            };
            
            reader.readAsText(file);
        }

        function confirmBulkUpload() {
            if (uploadedTeachers.length === 0) return;
            
            const statusDiv = document.getElementById('upload-status');
            statusDiv.className = 'mb-4 p-3 rounded-lg bg-blue-100 border border-blue-300 text-blue-800';
            statusDiv.textContent = 'Uploading teachers...';
            showSyncIndicator('Uploading...');
            
            let successCount = 0;
            let errorCount = 0;
            const errors = [];
            
            async function uploadNext(index) {
                if (index >= uploadedTeachers.length) {
                    if (errorCount === 0) {
                        statusDiv.className = 'mb-4 p-3 rounded-lg bg-green-100 border border-green-300 text-green-800';
                        statusDiv.textContent = 'Uploaded ' + successCount + ' teacher(s)!';
                        hideSyncIndicator();
                        showToast('Bulk upload complete', 'success');
                    } else {
                        statusDiv.className = 'mb-4 p-3 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-800';
                        statusDiv.innerHTML = '<strong>Upload Complete:</strong> ' + successCount + ' uploaded, ' + errorCount + ' failed<br><small>' + errors.join(', ') + '</small>';
                        hideSyncIndicator();
                        showToast('Bulk upload finished with errors', 'error');
                    }
                    return;
                }
                
                const teacher = uploadedTeachers[index];
                
                try {
                    const response = await fetch('/school/teachers-list', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(teacher)
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        successCount++;
                        const newTeacher = {
                            id: result.id ? result.id : window.nextTeacherId--,
                            full_name: teacher.full_name,
                            email: teacher.email,
                            phone: teacher.phone || ''
                        };
                        window.teachersData.teachers.push(newTeacher);
                        addTeacherRow(newTeacher);
                    } else {
                        errorCount++;
                        errors.push(teacher.full_name + ': ' + (result.error || 'Unknown error'));
                    }
                } catch (error) {
                    errorCount++;
                    errors.push(teacher.full_name + ': Network error');
                }
                
                statusDiv.textContent = 'Uploading teachers... ' + (index + 1) + '/' + uploadedTeachers.length + ' (' + successCount + ' success, ' + errorCount + ' errors)';
                uploadNext(index + 1);
            }
            
            uploadNext(0);
        }

        function cancelBulkUpload() {
            uploadedTeachers = [];
            document.getElementById('jsonFileInput').value = '';
            document.getElementById('upload-status').classList.add('hidden');
            document.getElementById('preview-section').classList.add('hidden');
        }
      </script>
    `;
}



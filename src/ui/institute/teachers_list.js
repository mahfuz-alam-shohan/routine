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
                <td class="p-3 break-words">${escapeHtml(t.email)}</td>
                <td class="p-3">${escapeHtml(t.phone || '')}</td>
                <td class="p-3 break-words">
                    ${primarySubject ? escapeHtml(primarySubject.subject_name) : 'Not assigned'}
                    ${additionalSubjects.length > 0 ? ', ' + additionalSubjects.map(s => escapeHtml(s.subject_name)).join(', ') : ''}
                </td>
                <td class="p-3 whitespace-nowrap">
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
      <div class="p-4 sm:p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h1 class="text-xl font-bold">Teachers Management</h1>
              <div class="flex flex-col sm:flex-row gap-2">
                  <button type="button" onclick="toggleBulkUpload()" class="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                      📁 Bulk Upload
                  </button>
                  <button type="button" onclick="toggleAddForm()" class="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                      + Add Teacher
                  </button>
              </div>
          </div>

          <!-- Bulk Upload Section -->
          <div id="bulk-upload-section" class="hidden mb-6 border p-4 rounded-lg bg-white">
              <h3 class="font-semibold mb-4">Bulk Upload Teachers</h3>
              
              <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 class="font-medium text-blue-900 mb-2">Instructions:</h4>
                  <ol class="text-sm text-blue-800 list-decimal list-inside space-y-1">
                      <li>Download the JSON template file below</li>
                      <li>Edit the file with your teacher data</li>
                      <li>Upload the filled JSON file</li>
                      <li>Review and confirm the upload</li>
                  </ol>
              </div>

              <div class="flex flex-col sm:flex-row gap-3 mb-4">
                  <button type="button" onclick="downloadTemplate()" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
                      📥 Download JSON Template
                  </button>
                  <label class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition cursor-pointer">
                      📤 Upload JSON File
                      <input type="file" id="jsonFileInput" accept=".json" onchange="handleFileUpload()" class="hidden">
                  </label>
              </div>

              <!-- File Upload Status -->
              <div id="upload-status" class="hidden mb-4 p-3 rounded-lg"></div>

              <!-- Preview Table -->
              <div id="preview-section" class="hidden">
                  <h4 class="font-medium mb-3">Preview Teachers to Upload:</h4>
                  <div class="border rounded-lg overflow-x-auto bg-gray-50 max-h-64 overflow-y-auto">
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
                      <button type="button" onclick="confirmBulkUpload()" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                          ✓ Confirm Upload
                      </button>
                      <button type="button" onclick="cancelBulkUpload()" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition">
                      ✗ Cancel
                  </button>
                  </div>
              </div>
          </div>

          <!-- Add Teacher Form -->
          <div id="add-form" class="hidden mb-6 border p-4 rounded-lg bg-white">
              <h3 class="font-semibold mb-4">Add New Teacher</h3>
              <form onsubmit="addTeacher(event)" class="space-y-4">
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                          <label class="block text-sm font-medium mb-1">Full Name *</label>
                          <input type="text" name="full_name" placeholder="e.g. John Smith" required 
                                 class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                      </div>
                      <div>
                          <label class="block text-sm font-medium mb-1">Email *</label>
                          <input type="text" name="email" placeholder="e.g. john@school.com" required 
                                 class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                      </div>
                      <div>
                          <label class="block text-sm font-medium mb-1">Phone Number</label>
                          <input type="text" name="phone" placeholder="e.g. +1234567890"
                                   class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                      </div>
                  </div>
                  <div class="flex flex-col sm:flex-row gap-2">
                      <button type="submit" class="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                          Add Teacher
                      </button>
                      <button type="button" onclick="toggleAddForm()" class="w-full sm:w-auto bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition">
                          Cancel
                      </button>
                  </div>
              </form>
          </div>

          <!-- Teachers Table -->
          <div class="border rounded-lg overflow-x-auto bg-white">
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
      <div id="subject-modal" class="fixed inset-0 bg-black bg-opacity-50 z-[9999] hidden flex items-center justify-center p-4">
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

        // Helper function for HTML escaping
        function escapeHtml(text) {
            if (!text) return '';
            return text.toString()
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        function toggleAddForm() {
            document.getElementById('add-form').classList.toggle('hidden');
        }

        function toggleBulkUpload() {
            const section = document.getElementById('bulk-upload-section');
            section.classList.toggle('hidden');
            if (!section.classList.contains('hidden')) {
                // Hide add form when opening bulk upload
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
            
            // Show loading status
            statusDiv.className = 'mb-4 p-3 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-800';
            statusDiv.textContent = 'Reading file...';
            statusDiv.classList.remove('hidden');
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validate structure
                    if (!data.teachers || !Array.isArray(data.teachers)) {
                        throw new Error('Invalid format: File must contain a "teachers" array');
                    }
                    
                    // Validate each teacher
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
                    
                    // Store teachers for upload
                    window.uploadedTeachers = validTeachers;
                    
                    // Show success and preview
                    statusDiv.className = 'mb-4 p-3 rounded-lg bg-green-100 border border-green-300 text-green-800';
                    statusDiv.textContent = '✓ Successfully loaded ' + validTeachers.length + ' teacher(s)';
                    
                    // Show preview table
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
            
            // Upload teachers one by one to avoid hitting limits
            let successCount = 0;
            let errorCount = 0;
            const errors = [];
            
            async function uploadNext(index) {
                if (index >= window.uploadedTeachers.length) {
                    // All done
                    if (errorCount === 0) {
                        statusDiv.className = 'mb-4 p-3 rounded-lg bg-green-100 border border-green-300 text-green-800';
                        statusDiv.textContent = '✓ Successfully uploaded ' + successCount + ' teacher(s)!';
                        setTimeout(function() {
                            location.reload();
                        }, 2000);
                    } else {
                        statusDiv.className = 'mb-4 p-3 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-800';
                        statusDiv.innerHTML = '<strong>Upload Complete:</strong> ' + successCount + ' uploaded, ' + errorCount + ' failed<br><small>' + errors.join(', ') + '</small>';
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
                    } else {
                        errorCount++;
                        errors.push(teacher.full_name + ': ' + (result.error || 'Unknown error'));
                    }
                } catch (error) {
                    errorCount++;
                    errors.push(teacher.full_name + ': Network error');
                }
                
                // Update progress and continue
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
            
            fetch('/school/teachers-list', {
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
            
            fetch('/school/teachers-list', {
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
            if (!confirm('Remove this teacher? This will delete all their assignments, subjects, and routine data permanently.')) return;
            
            fetch('/school/teachers-list', {
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
                    statusDiv.textContent = '✓ Successfully loaded ' + validTeachers.length + ' teacher(s)';
                    
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
            
            let successCount = 0;
            let errorCount = 0;
            const errors = [];
            
            async function uploadNext(index) {
                if (index >= uploadedTeachers.length) {
                    if (errorCount === 0) {
                        statusDiv.className = 'mb-4 p-3 rounded-lg bg-green-100 border border-green-300 text-green-800';
                        statusDiv.textContent = '✓ Successfully uploaded ' + successCount + ' teacher(s)!';
                        setTimeout(function() {
                            location.reload();
                        }, 2000);
                    } else {
                        statusDiv.className = 'mb-4 p-3 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-800';
                        statusDiv.innerHTML = '<strong>Upload Complete:</strong> ' + successCount + ' uploaded, ' + errorCount + ' failed<br><small>' + errors.join(', ') + '</small>';
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

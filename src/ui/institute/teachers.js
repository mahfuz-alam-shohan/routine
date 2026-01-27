// src/ui/institute/teachers.js - FIXED: Working Teacher Management

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
                    <div class="font-medium text-gray-900">${t.full_name}</div>
                    <div class="text-sm text-gray-500">${t.email}</div>
                    <div class="text-sm text-gray-600">${t.phone}</div>
                </td>
                <td class="p-4">
                    <div class="space-y-2">
                        ${primarySubject ? `
                            <span class="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                🎯 ${primarySubject.subject_name}
                            </span>
                        ` : '<span class="text-gray-400 text-xs">No primary subject</span>'}
                        ${additionalSubjects.length > 0 ? `
                            <div class="flex flex-wrap gap-1">
                                ${additionalSubjects.map(s => `
                                    <span class="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                                        ${s.subject_name}
                                    </span>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </td>
                <td class="p-4">
                    <div class="flex gap-2">
                        <button onclick="window.openSubjectEditor(${t.id}, '${t.full_name.replace(/'/g, "\\'")}')" 
                                class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Edit Subjects
                        </button>
                        <button onclick="window.removeTeacher(${t.id})" 
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
              <button onclick="window.toggleAddTeacherForm()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  + Add Teacher
              </button>
          </div>

          <!-- Add Teacher Form -->
          <div id="add-teacher-form" class="hidden mb-6 bg-white rounded-lg border p-6">
              <h3 class="text-lg font-semibold mb-4">Add New Teacher</h3>
              <form onsubmit="window.addTeacher(event)" class="space-y-4">
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
                      <button type="button" onclick="window.toggleAddTeacherForm()" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
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
                  <form onsubmit="window.saveSubjectAssignments(event)" class="space-y-4">
                      <input type="hidden" name="teacher_id" id="teacher-id">
                      <input type="hidden" name="primary_subject" id="primary-subject">
                      
                      <div>
                          <label class="block text-sm font-medium mb-2">Primary Subject *</label>
                          <input type="text" id="primary-search" placeholder="Search primary subject..." 
                                 class="w-full border rounded px-3 py-2"
                                 oninput="window.searchPrimarySubjects(this.value)">
                          <div id="primary-results" class="border rounded mt-1 max-h-32 overflow-y-auto hidden"></div>
                          <div id="selected-primary" class="mt-2 hidden">
                              <span class="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                  🎯 <span id="primary-name"></span>
                                  <button type="button" onclick="window.clearPrimarySubject()" class="ml-1">×</button>
                              </span>
                          </div>
                      </div>
                      
                      <div>
                          <label class="block text-sm font-medium mb-2">Additional Subjects</label>
                          <input type="text" id="additional-search" placeholder="Search additional subjects..." 
                                 class="w-full border rounded px-3 py-2"
                                 oninput="window.searchAdditionalSubjects(this.value)">
                          <div id="additional-results" class="border rounded mt-1 max-h-32 overflow-y-auto hidden"></div>
                          <div id="selected-additional" class="mt-2 space-y-1"></div>
                      </div>
                      
                      <div class="flex gap-2 pt-2 border-t">
                          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                              Save
                          </button>
                          <button type="button" onclick="window.closeSubjectModal()" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                              Cancel
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      </div>

      <script>
        console.log('Teachers module loading...');
        console.log('Available subjects:', ${JSON.stringify(allSubjects)});
        
        // Make functions globally available
        window.ALL_SUBJECTS = ${JSON.stringify(allSubjects)};
        window.selectedPrimary = null;
        window.selectedAdditional = [];

        console.log('Functions being defined...');

        window.toggleAddTeacherForm = function() {
            console.log('toggleAddTeacherForm called');
            const form = document.getElementById('add-teacher-form');
            form.classList.toggle('hidden');
        };

        window.addTeacher = async function(e) {
            console.log('addTeacher called');
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
            
            console.log('Sending teacher data:', data);
            
            try {
                const response = await fetch('/school/teachers', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                console.log('Teacher add response:', result);
                if (result.success) {
                    window.location.reload();
                } else {
                    alert('Error: ' + (result.error || 'Unknown error'));
                }
            } catch (error) {
                console.error('Teacher add error:', error);
                alert('Network error. Please try again.');
            }
        };

        window.openSubjectEditor = function(teacherId, teacherName) {
            console.log('openSubjectEditor called with:', teacherId, teacherName);
            document.getElementById('teacher-id').value = teacherId;
            document.getElementById('teacher-name-display').textContent = teacherName;
            document.getElementById('subject-modal').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            window.loadCurrentSubjects(teacherId);
        };

        window.closeSubjectModal = function() {
            console.log('closeSubjectModal called');
            document.getElementById('subject-modal').classList.add('hidden');
            document.body.style.overflow = '';
            document.getElementById('subject-modal').querySelector('form').reset();
            window.clearPrimarySubject();
            window.clearAdditionalSubjects();
        };

        window.searchPrimarySubjects = function(query) {
            console.log('searchPrimarySubjects called with:', query);
            const results = document.getElementById('primary-results');
            const filtered = window.ALL_SUBJECTS.filter(subject => 
                subject.subject_name.toLowerCase().includes(query.toLowerCase()) &&
                subject.id !== window.selectedPrimary?.id
            );
            
            if (query && filtered.length > 0) {
                results.innerHTML = filtered.map(subject => 
                    '<div class="px-3 py-2 hover:bg-gray-100 cursor-pointer" onclick="window.selectPrimarySubject(' + subject.id + ', \'' + subject.subject_name.replace(/'/g, "\\'") + '\')">' + 
                    subject.subject_name + 
                    '</div>'
                ).join('');
                results.classList.remove('hidden');
            } else {
                results.classList.add('hidden');
            }
        };

        window.searchAdditionalSubjects = function(query) {
            console.log('searchAdditionalSubjects called with:', query);
            const results = document.getElementById('additional-results');
            const filtered = window.ALL_SUBJECTS.filter(subject => 
                subject.subject_name.toLowerCase().includes(query.toLowerCase()) &&
                subject.id !== window.selectedPrimary?.id &&
                !window.selectedAdditional.find(s => s.id === subject.id)
            );
            
            if (query && filtered.length > 0) {
                results.innerHTML = filtered.map(subject => 
                    '<div class="px-3 py-2 hover:bg-gray-100 cursor-pointer" onclick="window.selectAdditionalSubject(' + subject.id + ', \'' + subject.subject_name.replace(/'/g, "\\'") + '\')">' + 
                    subject.subject_name + 
                    '</div>'
                ).join('');
                results.classList.remove('hidden');
            } else {
                results.classList.add('hidden');
            }
        };

        window.selectPrimarySubject = function(id, name) {
            console.log('selectPrimarySubject called with:', id, name);
            window.selectedPrimary = { id, name };
            document.getElementById('primary-subject').value = id;
            document.getElementById('primary-name').textContent = name;
            document.getElementById('selected-primary').classList.remove('hidden');
            document.getElementById('primary-search').value = '';
            document.getElementById('primary-results').classList.add('hidden');
        };

        window.selectAdditionalSubject = function(id, name) {
            console.log('selectAdditionalSubject called with:', id, name);
            window.selectedAdditional.push({ id, name });
            window.updateAdditionalDisplay();
            document.getElementById('additional-search').value = '';
            document.getElementById('additional-results').classList.add('hidden');
        };

        window.clearPrimarySubject = function() {
            console.log('clearPrimarySubject called');
            window.selectedPrimary = null;
            document.getElementById('primary-subject').value = '';
            document.getElementById('selected-primary').classList.add('hidden');
        };

        window.removeAdditionalSubject = function(id) {
            console.log('removeAdditionalSubject called with:', id);
            window.selectedAdditional = window.selectedAdditional.filter(s => s.id !== id);
            window.updateAdditionalDisplay();
        };

        window.clearAdditionalSubjects = function() {
            console.log('clearAdditionalSubjects called');
            window.selectedAdditional = [];
            window.updateAdditionalDisplay();
        };

        window.updateAdditionalDisplay = function() {
            const display = document.getElementById('selected-additional');
            if (window.selectedAdditional.length > 0) {
                display.innerHTML = window.selectedAdditional.map(subject => 
                    '<span class="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">' + 
                    subject.name + 
                    '<button type="button" onclick="window.removeAdditionalSubject(' + subject.id + ')" class="ml-1">×</button>' + 
                    '</span>'
                ).join('');
            } else {
                display.innerHTML = '';
            }
        };

        window.loadCurrentSubjects = function(teacherId) {
            console.log('loadCurrentSubjects called with:', teacherId);
            // Find current subjects from the page
            const teacherRow = document.querySelector('tr:has(button[onclick*="' + teacherId + '"])');
            if (!teacherRow) return;
            
            const subjectsCell = teacherRow.cells[1];
            const primaryBadge = subjectsCell.querySelector('.bg-green-100');
            const additionalBadges = subjectsCell.querySelectorAll('.bg-blue-50');
            
            // Load primary subject
            if (primaryBadge) {
                const primaryText = primaryBadge.textContent.replace('🎯 ', '').trim();
                const subject = window.ALL_SUBJECTS.find(s => s.subject_name === primaryText);
                if (subject) {
                    window.selectPrimarySubject(subject.id, subject.subject_name);
                }
            }
            
            // Load additional subjects
            additionalBadges.forEach(badge => {
                const subjectText = badge.textContent.trim();
                const subject = window.ALL_SUBJECTS.find(s => s.subject_name === subjectText);
                if (subject) {
                    window.selectedAdditional.push({ id: subject.id, name: subject.subject_name });
                }
            });
            window.updateAdditionalDisplay();
        };

        window.saveSubjectAssignments = async function(e) {
            console.log('saveSubjectAssignments called');
            e.preventDefault();
            
            if (!window.selectedPrimary) {
                alert('Please select a primary subject');
                return;
            }
            
            const data = {
                teacher_id: document.getElementById('teacher-id').value,
                primary_subject: window.selectedPrimary.id,
                additional_subjects: window.selectedAdditional.map(s => s.id),
                action: 'assign_subjects'
            };
            
            console.log('Saving subject assignments:', data);
            
            try {
                const response = await fetch('/school/teachers', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                console.log('Subject assignment response:', result);
                if (result.success) {
                    window.closeSubjectModal();
                    window.location.reload();
                } else {
                    alert('Error: ' + (result.error || 'Unknown error'));
                }
            } catch (error) {
                console.error('Subject assignment error:', error);
                alert('Network error. Please try again.');
            }
        };

        window.removeTeacher = async function(teacherId) {
            console.log('removeTeacher called with:', teacherId);
            if (!confirm('Remove this teacher?')) return;
            
            try {
                const response = await fetch('/school/teachers', {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({id: teacherId})
                });
                
                const result = await response.json();
                console.log('Remove teacher response:', result);
                if (result.success) {
                    window.location.reload();
                } else {
                    alert('Error: ' + (result.error || 'Unknown error'));
                }
            } catch (error) {
                console.error('Remove teacher error:', error);
                alert('Network error. Please try again.');
            }
        };

        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('#primary-search') && !e.target.closest('#primary-results')) {
                document.getElementById('primary-results').classList.add('hidden');
            }
            if (!e.target.closest('#additional-search') && !e.target.closest('#additional-results')) {
                document.getElementById('additional-results').classList.add('hidden');
            }
        });

        // Close modal on escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                window.closeSubjectModal();
            }
        });

        console.log('Teachers module loaded successfully');
      </script>
    `;
}

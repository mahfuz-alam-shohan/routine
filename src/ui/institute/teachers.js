// src/ui/institute/teachers.js - REDESIGNED: Table Interface + Subject Assignment

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
        const mainSubject = teacherSubjectsList.find(ts => ts.is_primary)?.subject_name || 'Not Assigned';
        const otherSubjects = teacherSubjectsList.filter(ts => !ts.is_primary).map(ts => ts.subject_name);
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                    <div class="text-sm md:text-base font-medium text-gray-900">${t.full_name}</div>
                    <div class="text-xs md:text-sm text-gray-500">${t.email}</div>
                </td>
                <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                    <div class="flex flex-col gap-1">
                        <span class="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium border border-green-100">
                            🎯 ${mainSubject}
                        </span>
                        ${otherSubjects.length > 0 ? `
                            <div class="flex flex-wrap gap-1">
                                ${otherSubjects.map(s => `
                                    <span class="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs border border-blue-100">${s}</span>
                                `).join('')}
                            </div>
                        ` : '<span class="text-xs text-gray-400">No other subjects</span>'}
                    </div>
                </td>
                <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base font-mono text-gray-600">
                    ${t.phone}
                </td>
                <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                    <div class="flex gap-2">
                        <button onclick="openAssignSubjectsModal(${t.id}, '${t.full_name}')" class="text-blue-600 hover:text-blue-900 text-xs md:text-sm font-medium">
                            Assign Subjects
                        </button>
                        <button onclick="removeTeacher(${t.id})" class="text-red-600 hover:text-red-900 text-xs md:text-sm font-medium">
                            Remove
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    return `
      <style>
        /* Enhanced table styling */
        .teacher-table {
          border-collapse: separate;
          border-spacing: 0;
        }
        
        .teacher-table th {
          background: linear-gradient(to bottom, #f9fafb, #f3f4f6);
          border-bottom: 2px solid #e5e7eb;
          font-weight: 600;
        }
        
        .teacher-table td {
          border-bottom: 1px solid #f3f4f6;
        }
        
        /* Modal styling */
        .modal-overlay {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
        }
        
        .modal-content {
          animation: modalSlideIn 0.3s ease-out;
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        /* Checkbox styling */
        .subject-checkbox {
          transition: all 0.2s ease;
        }
        
        .subject-checkbox:hover {
          background-color: #f0f9ff;
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
          .teacher-table {
            font-size: 12px;
          }
          
          .teacher-table th,
          .teacher-table td {
            padding: 8px;
          }
        }
      </style>
      
      <div class="max-w-6xl md:max-w-7xl mx-auto pt-4 md:pt-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
              <div>
                <h1 class="text-2xl md:text-3xl font-semibold text-gray-900">Teachers Management</h1>
                <p class="text-sm md:text-base text-gray-500 mt-1">Add teachers and assign their teaching subjects</p>
              </div>
              <button onclick="toggleAddTeacher()" class="text-sm md:text-base bg-gray-900 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg hover:bg-black transition-colors w-full sm:w-auto">
                  + Add Teacher
              </button>
          </div>

          <!-- Add Teacher Form -->
          <div id="add-teacher-box" class="hidden mb-6 bg-white p-4 md:p-6 border border-gray-200 rounded-lg md:rounded-xl shadow-sm">
              <h3 class="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Add New Teacher</h3>
              <form onsubmit="addTeacher(event)" class="space-y-4 md:space-y-6">
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                          <input type="text" name="full_name" required class="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500">
                      </div>

                      <div>
                          <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                          <input type="email" name="email" required class="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500">
                      </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Phone (Bangladesh)</label>
                          <div class="flex items-center border border-gray-300 rounded overflow-hidden bg-white">
                              <span class="bg-gray-100 text-gray-600 px-3 py-2 text-sm font-bold border-r border-gray-300">+880</span>
                              <input type="text" id="phone-input" name="phone_digits" required oninput="validatePhone(this)" class="w-full p-2 text-sm outline-none font-mono" placeholder="1XXXXXXXXX" maxlength="10">
                          </div>
                          <p id="phone-msg" class="text-xs mt-1 h-4 text-red-500"></p>
                      </div>
                      
                      <div class="flex items-end">
                          <button type="submit" id="submit-btn" class="bg-blue-600 text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                              Add Teacher
                          </button>
                      </div>
                  </div>
              </form>
          </div>

          <!-- Teachers Table -->
          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div class="overflow-x-auto">
                  <table class="min-w-full teacher-table">
                      <thead>
                          <tr class="bg-gray-50">
                              <th class="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Teacher
                              </th>
                              <th class="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Subjects
                              </th>
                              <th class="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Phone
                              </th>
                              <th class="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                              </th>
                          </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                          ${teacherRows.length > 0 ? teacherRows : `
                              <tr>
                                  <td colspan="4" class="px-4 py-8 text-center text-gray-500">
                                      <div class="flex flex-col items-center">
                                          <svg class="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-12h13a6 6 0 016 12v1m-18 0V7a4 4 0 114 0h4a2 2 0 012 2v1a2 2 0 002 2h4a2 2 0 002-2V9a2 2 0 00-2-2h-4a2 2 0 00-2 2v-1z"></path>
                                          </svg>
                                          <p class="text-sm font-medium">No teachers added yet</p>
                                          <p class="text-xs text-gray-400 mt-1">Click "Add Teacher" to get started</p>
                                      </div>
                                  </td>
                              </tr>
                          `}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>

      <!-- Assign Subjects Modal -->
      <div id="assign-subjects-modal" class="fixed inset-0 modal-overlay z-[9999] hidden flex items-center justify-center p-4">
          <div class="bg-white rounded-lg md:rounded-xl shadow-xl w-full max-w-2xl modal-content">
              <div class="p-4 md:p-6 border-b border-gray-200">
                  <h3 class="text-lg font-semibold text-gray-900">Assign Subjects to Teacher</h3>
                  <p class="text-sm text-gray-600 mt-1">Select main subject and additional subjects</p>
              </div>
              
              <div class="p-4 md:p-6">
                  <form id="assign-subjects-form" class="space-y-4">
                      <input type="hidden" name="teacher_id" id="teacher_id">
                      <input type="hidden" name="teacher_name" id="teacher_name">
                      
                      <div>
                          <label class="block text-sm font-medium text-gray-700 mb-3">Main Subject (Primary)</label>
                          <div class="border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
                              ${allSubjects.map(s => `
                                  <label class="flex items-center gap-3 p-2 rounded hover:bg-white cursor-pointer subject-checkbox">
                                      <input type="radio" name="main_subject" value="${s.id}" required class="w-4 h-4 text-blue-600">
                                      <span class="text-sm font-medium">${s.subject_name}</span>
                                  </label>
                              `).join('')}
                              ${allSubjects.length === 0 ? '<p class="text-sm text-red-500 p-3">No subjects found. Add subjects in the Subjects page first.</p>' : ''}
                          </div>
                      </div>
                      
                      <div>
                          <label class="block text-sm font-medium text-gray-700 mb-3">Additional Subjects (Optional)</label>
                          <div class="border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
                              ${allSubjects.map(s => `
                                  <label class="flex items-center gap-3 p-2 rounded hover:bg-white cursor-pointer subject-checkbox">
                                      <input type="checkbox" name="additional_subjects" value="${s.id}" class="w-4 h-4 text-blue-600">
                                      <span class="text-sm font-medium">${s.subject_name}</span>
                                  </label>
                              `).join('')}
                          </div>
                          <p class="text-xs text-gray-500 mt-1">Select all subjects this teacher can teach</p>
                      </div>
                      
                      <div class="flex gap-3 pt-4 border-t border-gray-200">
                          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                              Save Assignments
                          </button>
                          <button type="button" onclick="closeAssignSubjectsModal()" class="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm font-medium hover:bg-gray-300 transition-colors">
                              Cancel
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      </div>

      <script>
        const SCHOOL_ID = ${school.id};

        // Form functions
        function toggleAddTeacher() {
            const box = document.getElementById('add-teacher-box');
            box.classList.toggle('hidden');
            if (!box.classList.contains('hidden')) {
                setTimeout(() => document.querySelector('input[name="full_name"]').focus(), 100);
            }
        }

        function validatePhone(input) {
            const value = input.value.replace(/\D/g, '');
            const msg = document.getElementById('phone-msg');
            
            if (value.length < 10) {
                msg.textContent = 'Phone number must be 10 digits';
                msg.classList.add('text-red-500');
                msg.classList.remove('text-green-500');
                input.setCustomValidity('Invalid phone number');
            } else if (value.length > 10) {
                msg.textContent = 'Phone number must be exactly 10 digits';
                msg.classList.add('text-red-500');
                msg.classList.remove('text-green-500');
                input.setCustomValidity('Invalid phone number');
            } else {
                msg.textContent = '✓ Valid Bangladesh number';
                msg.classList.add('text-green-500');
                msg.classList.remove('text-red-500');
                input.setCustomValidity('');
            }
            
            input.value = value;
        }

        async function addTeacher(e) {
            e.preventDefault();
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn.disabled) return;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.phone = '+880-' + data.phone_digits;
            
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
                    alert('Error adding teacher: ' + (result.error || 'Unknown error'));
                }
            } catch (error) {
                alert('Network error. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Add Teacher';
            }
        }

        // Subject assignment functions
        function openAssignSubjectsModal(teacherId, teacherName) {
            document.getElementById('teacher_id').value = teacherId;
            document.getElementById('teacher_name').value = teacherName;
            document.getElementById('assign-subjects-modal').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeAssignSubjectsModal() {
            document.getElementById('assign-subjects-modal').classList.add('hidden');
            document.body.style.overflow = '';
            document.getElementById('assign-subjects-form').reset();
        }

        async function assignSubjects(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            // Get additional subjects
            const additionalSubjects = Array.from(document.querySelectorAll('input[name="additional_subjects"]:checked'))
                .map(cb => cb.value);
            
            data.additional_subjects = additionalSubjects;
            data.action = 'assign_subjects';
            
            try {
                const response = await fetch('/school/teachers', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                if (result.success) {
                    closeAssignSubjectsModal();
                    window.location.reload();
                } else {
                    alert('Error assigning subjects: ' + (result.error || 'Unknown error'));
                }
            } catch (error) {
                alert('Network error. Please try again.');
            }
        }

        async function removeTeacher(teacherId) {
            if (!confirm('Are you sure you want to remove this teacher?')) return;
            
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
                    alert('Error removing teacher: ' + (result.error || 'Unknown error'));
                }
            } catch (error) {
                alert('Network error. Please try again.');
            }
        }

        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeAssignSubjectsModal();
            }
        });

        // Close modal on background click
        document.getElementById('assign-subjects-modal')?.addEventListener('click', function(e) {
            if (e.target === this) {
                closeAssignSubjectsModal();
            }
        });
      </script>
    `;
}

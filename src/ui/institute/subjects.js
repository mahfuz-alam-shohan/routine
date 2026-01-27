// src/ui/institute/subjects.js - NEW STRUCTURE: Subject Bank + Class Curriculum

export function SubjectsPageHTML(school, subjects = [], classes = [], groups = [], sections = [], classSubjects = [], groupSubjects = [], scheduleConfig = {}) {
    
    // Group data for easier access
    const classGroups = {};
    groups.forEach(g => {
        if (!classGroups[g.class_id]) classGroups[g.class_id] = [];
        classGroups[g.class_id].push(g);
    });
    
    const classSections = {};
    sections.forEach(s => {
        if (!classSections[s.class_id]) classSections[s.class_id] = [];
        classSections[s.class_id].push(s);
    });

    // Group subjects by class and group
    const subjectsByClass = {};
    classSubjects.forEach(cs => {
        if (!subjectsByClass[cs.class_id]) subjectsByClass[cs.class_id] = [];
        subjectsByClass[cs.class_id].push(cs);
    });

    const subjectsByGroup = {};
    groupSubjects.forEach(gs => {
        if (!subjectsByGroup[gs.group_id]) subjectsByGroup[gs.group_id] = [];
        subjectsByGroup[gs.group_id].push(gs);
    });

    // Calculate capacity for each section based on master schedule
    const maxClassesPerSection = scheduleConfig.maxClassesPerSection || 40;
    
    function calculateSectionCapacity(classId, groupId) {
        let totalClasses = 0;
        
        // Add class-level subjects
        const classSubjects = subjectsByClass[classId] || [];
        totalClasses += classSubjects.reduce((sum, s) => sum + (s.classes_per_week || 0), 0);
        
        // Add group-level subjects
        if (groupId) {
            const groupSubjects = subjectsByGroup[groupId] || [];
            totalClasses += groupSubjects.reduce((sum, s) => sum + (s.classes_per_week || 0), 0);
        }
        
        return {
            current: totalClasses,
            max: maxClassesPerSection,
            available: maxClassesPerSection - totalClasses,
            percentage: Math.round((totalClasses / maxClassesPerSection) * 100)
        };
    }

    // Build Subject Bank Tab Content
    const subjectBankContent = `
        <div class="bg-white rounded-lg border border-gray-200">
            <div class="p-4 border-b border-gray-100">
                <h3 class="text-lg font-bold text-gray-800 mb-4">Subject Bank</h3>
                <div class="flex gap-2">
                    <input type="text" id="new-subject" placeholder="New Subject Name..." 
                           class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <button onclick="createSubject()" class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black">
                        + Add Subject
                    </button>
                </div>
            </div>
            <div class="p-4">
                <div class="space-y-2">
                    ${subjects.map((sub, index) => `
                        <div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-all">
                            <div class="flex items-center gap-3 flex-1">
                                <span class="text-sm font-mono text-gray-400 w-6">${index + 1}.</span>
                                <span id="name-${sub.id}" class="text-sm font-medium text-gray-700">${sub.subject_name}</span>
                                <form id="form-${sub.id}" onsubmit="updateSubject(event, ${sub.id})" class="hidden flex-1 flex gap-2">
                                    <input type="text" name="name" value="${sub.subject_name}" class="w-full text-sm border rounded px-2 py-1">
                                    <button type="submit" class="text-green-600 text-xs font-bold">Save</button>
                                    <button type="button" onclick="toggleEdit(${sub.id})" class="text-gray-400 text-xs">Cancel</button>
                                </form>
                            </div>
                            <div class="flex items-center gap-1">
                                <button onclick="toggleEdit(${sub.id})" class="p-2 text-gray-400 hover:text-blue-600">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                </button>
                                <button onclick="deleteSubject(${sub.id})" class="p-2 text-gray-400 hover:text-red-600">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                    ${subjects.length === 0 ? '<div class="p-8 text-center text-gray-400 text-sm italic">No subjects added yet.</div>' : ''}
                </div>
            </div>
        </div>
    `;

    // Build Class Curriculum Tab Content
    const classCurriculumContent = classes.map(cls => {
        const groups = classGroups[cls.id] || [];
        const classSubjects = subjectsByClass[cls.id] || [];
        
        return `
            <div class="mb-6 border border-gray-300">
                <div class="bg-gray-100 px-3 py-2 border-b">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <span class="font-bold text-sm md:text-base">${cls.class_name}</span>
                        <button onclick="openAddClassSubjectModal(${cls.id}, '${cls.class_name}')" class="text-xs bg-blue-600 text-white px-2 py-1 hover-lift">
                            + Add Class Subject
                        </button>
                    </div>
                </div>
                
                <!-- Class-Level Subjects -->
                <div class="p-3">
                    <div class="mb-3">
                        <h4 class="text-sm font-semibold text-gray-700 mb-2">📚 Common Subjects (All Groups)</h4>
                        ${classSubjects.length > 0 ? `
                            <div class="space-y-2">
                                ${classSubjects.map(cs => `
                                    <div class="flex flex-col md:flex-row md:items-center md:justify-between bg-blue-50 p-2 rounded subject-item">
                                        <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                            <span class="font-medium text-sm">${cs.subject_name}</span>
                                            <div class="flex flex-wrap gap-2 text-xs">
                                                <span class="text-gray-600">${cs.classes_per_week} classes/week</span>
                                                <span class="text-gray-500">min: ${cs.min_classes}, max: ${cs.max_classes}</span>
                                            </div>
                                        </div>
                                        <button onclick="deleteClassSubject(${cs.id})" class="text-xs text-red-600 self-end sm:self-auto">Remove</button>
                                    </div>
                                `).join('')}
                            </div>
                        ` : '<p class="text-sm text-gray-400">No common subjects added</p>'}
                    </div>
                    
                    <!-- Group-Level Subjects -->
                    ${groups.map(g => {
                        const groupSubjects = subjectsByGroup[g.id] || [];
                        const capacity = calculateSectionCapacity(cls.id, g.id);
                        
                        return `
                            <div class="mb-3 border-l-2 border-purple-300 pl-3">
                                <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                                    <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <h4 class="text-sm font-semibold text-gray-700">🎯 ${g.group_name} Group</h4>
                                        <span class="text-xs text-gray-500">(${classSections[g.class_id]?.filter(s => s.group_id === g.id).length || 0} sections)</span>
                                        <div class="text-xs px-2 py-1 rounded capacity-indicator ${capacity.percentage >= 90 ? 'bg-red-100 text-red-700' : capacity.percentage >= 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}">
                                            ${capacity.current}/${capacity.max} classes
                                        </div>
                                    </div>
                                    <button onclick="openAddGroupSubjectModal(${g.id}, '${g.group_name}', ${cls.id}, '${cls.class_name}')" class="text-xs bg-purple-600 text-white px-2 py-1">
                                        + Add Subject
                                    </button>
                                </div>
                                ${groupSubjects.length > 0 ? `
                                    <div class="space-y-2">
                                        ${groupSubjects.map(gs => `
                                            <div class="flex flex-col md:flex-row md:items-center md:justify-between bg-purple-50 p-2 rounded subject-item">
                                                <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                                    <span class="font-medium text-sm">${gs.subject_name}</span>
                                                    <div class="flex flex-wrap gap-2 text-xs">
                                                        <span class="text-gray-600">${gs.classes_per_week} classes/week</span>
                                                        <span class="text-gray-500">min: ${gs.min_classes}, max: ${gs.max_classes}</span>
                                                    </div>
                                                </div>
                                                <button onclick="deleteGroupSubject(${gs.id})" class="text-xs text-red-600 self-end sm:self-auto">Remove</button>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : '<p class="text-sm text-gray-400">No subjects added to this group</p>'}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');

    return `
      <style>
        /* Enhanced animations and transitions */
        .btn-primary {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(0);
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .btn-primary:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        /* Tab styling */
        .tab-button {
          transition: all 0.2s ease;
        }
        .tab-button.active {
          border-bottom: 2px solid #3b82f6;
          color: #3b82f6;
        }
        
        /* Mobile responsive design */
        @media (max-width: 768px) {
          .tab-button {
            font-size: 12px;
            padding: 8px 4px;
          }
          
          .capacity-indicator {
            font-size: 10px;
            padding: 2px 4px;
          }
          
          .subject-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .subject-item button {
            align-self: flex-end;
          }
          
          .modal-content {
            margin: 16px;
            max-width: calc(100vw - 32px);
          }
          
          .form-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        /* Prevent zoom on input focus */
        input, select, textarea {
          font-size: 16px !important;
        }
      </style>
      
      <div>
         <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/school/dashboard" class="hover:text-blue-600">Back to Dashboard</a>
            <span>/</span>
            <span class="text-gray-900 font-bold">Subjects Management</span>
         </div>

         <!-- Master Schedule Information (Read-only) -->
         <div class="mb-6 bg-gray-50 p-4 border border-gray-300">
             <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                 <div class="flex flex-col md:flex-row md:items-center gap-4">
                     <span class="font-semibold text-sm md:text-base">📅 Master Schedule Configuration</span>
                     <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                         <span class="text-sm">Working Days: <strong>${scheduleConfig.workingDaysCount || 5}</strong></span>
                         <span class="text-sm">Class Periods/Day: <strong>${scheduleConfig.actualClassPeriodsPerDay || 8}</strong></span>
                     </div>
                 </div>
                 <div class="text-sm text-gray-600">
                     <strong>Total Capacity:</strong> ${maxClassesPerSection} classes/week per section
                     <div class="text-xs text-gray-500 mt-1">
                         (Calculated from master schedule: ${scheduleConfig.workingDaysCount || 5} days × ${scheduleConfig.actualClassPeriodsPerDay || 8} class periods)
                     </div>
                 </div>
             </div>
             <div class="text-xs text-gray-500 mt-2">
                 ⚠️ Schedule configuration is managed in Master Schedule. This ensures consistency with routine generation.
             </div>
         </div>

         <!-- Tab Navigation -->
         <div class="border-b border-gray-300 mb-4">
             <div class="flex space-x-6">
                 <button onclick="switchTab('bank')" id="bank-tab" class="tab-button active pb-2 px-1 text-sm font-medium">
                     📚 Subject Bank
                 </button>
                 <button onclick="switchTab('curriculum')" id="curriculum-tab" class="tab-button pb-2 px-1 text-sm font-medium text-gray-500">
                     🎯 Class Curriculum
                 </button>
             </div>
         </div>

         <!-- Tab Content -->
         <div id="bank-content" class="tab-content">
             ${subjectBankContent}
         </div>

         <div id="curriculum-content" class="tab-content hidden">
             <div class="space-y-4">
                 ${classCurriculumContent.length > 0 ? classCurriculumContent : `
                     <div class="bg-white border border-gray-200 rounded-lg p-8 text-center">
                         <p class="text-gray-400">No classes found</p>
                     </div>
                 `}
             </div>
         </div>
      </div>

      <!-- Add Class Subject Modal -->
      <div id="addClassSubjectModal" class="fixed inset-0 bg-black/60 z-[9999] hidden flex items-center justify-center px-4">
          <div class="bg-white border border-gray-300 w-full max-w-md p-4 relative modal-content">
              <h3 class="font-bold mb-3 text-sm md:text-base">Add Subject to Class</h3>
              <form onsubmit="addClassSubject(event)">
                  <input type="hidden" name="class_id" id="class_subject_class_id">
                  <div class="mb-3">
                      <select name="subject_id" required class="w-full border border-gray-300 px-2 py-2 text-sm">
                          <option value="">Select Subject</option>
                          ${subjects.map(s => `<option value="${s.id}">${s.subject_name}</option>`).join('')}
                      </select>
                  </div>
                  <div class="grid grid-cols-2 gap-2 mb-3 form-grid">
                      <div>
                          <label class="text-xs text-gray-600 block mb-1">Classes/Week</label>
                          <input type="number" name="classes_per_week" required min="1" max="20" class="w-full border border-gray-300 px-2 py-2 text-sm">
                      </div>
                      <div>
                          <label class="text-xs text-gray-600 block mb-1">Min Classes</label>
                          <input type="number" name="min_classes" required min="1" max="20" class="w-full border border-gray-300 px-2 py-2 text-sm">
                      </div>
                  </div>
                  <div class="mb-3">
                      <label class="text-xs text-gray-600 block mb-1">Max Classes</label>
                      <input type="number" name="max_classes" required min="1" max="20" class="w-full border border-gray-300 px-2 py-2 text-sm">
                  </div>
                  <div class="flex flex-col sm:flex-row gap-2">
                      <button type="submit" class="bg-blue-600 text-white px-3 py-2 text-sm" id="addClassSubjectBtn">Add Subject</button>
                      <button type="button" onclick="closeModal('addClassSubjectModal')" class="bg-gray-200 text-gray-800 px-3 py-2 text-sm">Cancel</button>
                  </div>
              </form>
          </div>
      </div>

      <!-- Add Group Subject Modal -->
      <div id="addGroupSubjectModal" class="fixed inset-0 bg-black/60 z-[9999] hidden flex items-center justify-center px-4">
          <div class="bg-white border border-gray-300 w-full max-w-md p-4 relative modal-content">
              <h3 class="font-bold mb-3 text-sm md:text-base">Add Subject to Group</h3>
              <form onsubmit="addGroupSubject(event)">
                  <input type="hidden" name="group_id" id="group_subject_group_id">
                  <input type="hidden" name="class_id" id="group_subject_class_id">
                  <div class="mb-3">
                      <select name="subject_id" required class="w-full border border-gray-300 px-2 py-2 text-sm">
                          <option value="">Select Subject</option>
                          ${subjects.map(s => `<option value="${s.id}">${s.subject_name}</option>`).join('')}
                      </select>
                  </div>
                  <div class="grid grid-cols-2 gap-2 mb-3 form-grid">
                      <div>
                          <label class="text-xs text-gray-600 block mb-1">Classes/Week</label>
                          <input type="number" name="classes_per_week" required min="1" max="20" class="w-full border border-gray-300 px-2 py-2 text-sm">
                      </div>
                      <div>
                          <label class="text-xs text-gray-600 block mb-1">Min Classes</label>
                          <input type="number" name="min_classes" required min="1" max="20" class="w-full border border-gray-300 px-2 py-2 text-sm">
                      </div>
                  </div>
                  <div class="mb-3">
                      <label class="text-xs text-gray-600 block mb-1">Max Classes</label>
                      <input type="number" name="max_classes" required min="1" max="20" class="w-full border border-gray-300 px-2 py-2 text-sm">
                  </div>
                  <div class="flex flex-col sm:flex-row gap-2">
                      <button type="submit" class="bg-purple-600 text-white px-3 py-2 text-sm" id="addGroupSubjectBtn">Add Subject</button>
                      <button type="button" onclick="closeModal('addGroupSubjectModal')" class="bg-gray-200 text-gray-800 px-3 py-2 text-sm">Cancel</button>
                  </div>
              </form>
          </div>
      </div>

      <script>
        const SCHOOL_ID = ${school.id};
        const MAX_CLASSES_PER_SECTION = ${maxClassesPerSection};

        // Tab switching
        function switchTab(tabName) {
            // Hide all content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });
            
            // Remove active class from all tabs
            document.querySelectorAll('.tab-button').forEach(tab => {
                tab.classList.remove('active');
                tab.classList.add('text-gray-500');
            });
            
            // Show selected content
            document.getElementById(tabName + '-content').classList.remove('hidden');
            
            // Add active class to selected tab
            const activeTab = document.getElementById(tabName + '-tab');
            activeTab.classList.add('active');
            activeTab.classList.remove('text-gray-500');
        }

        // Subject Bank functions
        function createSubject() {
            const input = document.getElementById('new-subject');
            const name = input.value.trim();
            if (!name) return;
            
            fetch('/school/subjects', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'create', name: name})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                }
            });
        }

        function toggleEdit(id) {
            document.getElementById('name-'+id).classList.toggle('hidden');
            document.getElementById('form-'+id).classList.toggle('hidden');
        }

        function updateSubject(e, id) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const name = formData.get('name');
            
            fetch('/school/subjects', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'rename', id: id, name: name})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                }
            });
        }

        function deleteSubject(id) {
            if(!confirm("Delete this subject?")) return;
            
            fetch('/school/subjects', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({type: 'bank', id: id})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                }
            });
        }

        // Curriculum functions
        function openAddClassSubjectModal(classId, className) {
            document.getElementById('class_subject_class_id').value = classId;
            openModal('addClassSubjectModal');
            setTimeout(() => {
                document.querySelector('#addClassSubjectModal select[name="subject_id"]').focus();
            }, 100);
        }

        function openAddGroupSubjectModal(groupId, groupName, classId, className) {
            document.getElementById('group_subject_group_id').value = groupId;
            document.getElementById('group_subject_class_id').value = classId;
            openModal('addGroupSubjectModal');
            setTimeout(() => {
                document.querySelector('#addGroupSubjectModal select[name="subject_id"]').focus();
            }, 100);
        }

        function addClassSubject(e) {
            e.preventDefault();
            const submitBtn = document.getElementById('addClassSubjectBtn');
            if (submitBtn.disabled) return;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.action = 'add_class_subject';
            data.school_id = SCHOOL_ID;

            fetch('/school/subjects', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    alert('Error adding subject: ' + (response.error || 'Unknown error'));
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Add Subject';
                }
            });
        }

        function addGroupSubject(e) {
            e.preventDefault();
            const submitBtn = document.getElementById('addGroupSubjectBtn');
            if (submitBtn.disabled) return;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.action = 'add_group_subject';
            data.school_id = SCHOOL_ID;

            fetch('/school/subjects', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    alert('Error adding subject: ' + (response.error || 'Unknown error'));
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Add Subject';
                }
            });
        }

        function deleteClassSubject(id) {
            if(!confirm("Remove this subject from class?")) return;
            
            fetch('/school/subjects', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete_class_subject', id: id})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                }
            });
        }

        function deleteGroupSubject(id) {
            if(!confirm("Remove this subject from group?")) return;
            
            fetch('/school/subjects', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete_group_subject', id: id})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                }
            });
        }

        // Modal management
        function openModal(modalId) {
            document.getElementById(modalId).classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.add('hidden');
            document.body.style.overflow = '';
            const modal = document.getElementById(modalId);
            const submitBtn = modal.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Add Subject';
            }
            modal.querySelector('form').reset();
        }

        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.fixed.inset-0');
                modals.forEach(modal => {
                    if (!modal.classList.contains('hidden')) {
                        closeModal(modal.id);
                    }
                });
            }
        });

        // Close modal on background click
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('fixed') && e.target.classList.contains('inset-0')) {
                closeModal(e.target.id);
            }
        });
      </script>
    `;
}

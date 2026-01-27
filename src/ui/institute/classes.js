// src/ui/institute/classes.js - INSTITUTION ADMIN: Curriculum Management System

export function ClassesPageHTML(school, classes = [], groups = [], sections = [], subjects = [], classSubjects = [], groupSubjects = [], scheduleConfig = {}) {
    
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

    // Calculate capacity for each section
    const maxClassesPerSection = (scheduleConfig.active_days || 5) * (scheduleConfig.periods_per_day || 8);
    
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

    // Build Classes & Groups Tab Content (Read-only view)
    const classesTabContent = classes.map(cls => {
        const groups = classGroups[cls.id] || [];
        const sections = classSections[cls.id] || [];
        
        // Group sections by their group
        const sectionsByGroup = {};
        groups.forEach(g => {
            sectionsByGroup[g.id] = {
                group: g,
                sections: sections.filter(s => s.group_id === g.id)
            };
        });
        
        // Sections without groups
        const sectionsWithoutGroup = sections.filter(s => !s.group_id);

        return `
            <div class="mb-4 border border-gray-300">
                <!-- Class Header -->
                <div class="bg-gray-100 px-3 py-2 border-b">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-sm md:text-base">${cls.class_name}</span>
                            <span class="text-xs text-gray-500">(${groups.length} groups, ${sections.length} sections)</span>
                        </div>
                        <div class="text-xs text-gray-500">
                            ${cls.has_groups ? 'Has Groups' : 'No Groups'}
                        </div>
                    </div>
                </div>

                <!-- Groups and Sections -->
                <div class="p-2">
                    ${groups.length > 0 ? `
                        <div class="space-y-2">
                            ${groups.map(g => {
                                const groupSections = sectionsByGroup[g.id]?.sections || [];
                                const capacity = calculateSectionCapacity(cls.id, g.id);
                                
                                return `
                                    <div class="border-l-2 border-gray-400 pl-2">
                                        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-1">
                                            <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                                                <span class="font-semibold text-sm md:text-base">${g.group_name}</span>
                                                <span class="text-xs text-gray-500">(${groupSections.length} sections)</span>
                                                <div class="text-xs px-2 py-1 rounded capacity-indicator ${capacity.percentage >= 90 ? 'bg-red-100 text-red-700' : capacity.percentage >= 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}">
                                                    ${capacity.current}/${capacity.max} classes
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex flex-wrap gap-1">
                                            ${groupSections.map(s => `
                                                <span class="border border-gray-300 px-2 py-1 text-sm">
                                                    ${s.section_name}
                                                </span>
                                            `).join('')}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : ''}
                    
                    ${sectionsWithoutGroup.length > 0 ? `
                        <div class="border-l-2 border-gray-400 pl-2">
                            <div class="mb-1">
                                <span class="font-semibold">No Group</span>
                                <span class="text-xs text-gray-500 ml-2">(${sectionsWithoutGroup.length} sections)</span>
                                <div class="text-xs px-2 py-1 rounded bg-green-100 text-green-700 inline-block ml-2">
                                    ${calculateSectionCapacity(cls.id, null).current}/${maxClassesPerSection} classes
                                </div>
                            </div>
                            <div class="flex flex-wrap gap-1">
                                ${sectionsWithoutGroup.map(s => `
                                    <span class="border border-gray-300 px-2 py-1 text-sm">
                                        ${s.section_name}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${groups.length === 0 && sectionsWithoutGroup.length === 0 ? `
                        <div class="text-center py-4 text-gray-400 text-sm">
                            No groups or sections added yet
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    // Build Subjects Tab Content (Editable)
    const subjectsTabContent = classes.map(cls => {
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
                        return `
                            <div class="mb-3 border-l-2 border-purple-300 pl-3">
                                <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                                    <h4 class="text-sm font-semibold text-gray-700">🎯 ${g.group_name} Group</h4>
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
        
        .section-badge {
          transition: all 0.2s ease;
        }
        .section-badge:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        /* Loading skeleton */
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        /* Success animations */
        @keyframes slideInSuccess {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .success-message {
          animation: slideInSuccess 0.3s ease-out;
        }
        
        /* Smooth focus states */
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          transition: all 0.2s ease;
        }
        
        /* Hover states for interactive elements */
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
          
          .schedule-config {
            flex-direction: column;
            gap: 12px;
          }
          
          .schedule-config input {
            width: 60px !important;
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
            <span class="text-gray-900 font-bold">Classes & Curriculum</span>
         </div>

         <!-- Schedule Configuration -->
         <div class="mb-6 bg-gray-50 p-4 border border-gray-300 schedule-config">
             <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                 <div class="flex flex-col md:flex-row md:items-center gap-4">
                     <span class="font-semibold text-sm md:text-base">📅 Schedule Configuration</span>
                     <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                         <label class="text-sm">Active Days:</label>
                         <input type="number" id="activeDays" value="${scheduleConfig.active_days || 5}" min="1" max="7" class="w-16 sm:w-20 border border-gray-300 px-2 py-1 text-sm">
                         <label class="text-sm">Periods/Day:</label>
                         <input type="number" id="periodsPerDay" value="${scheduleConfig.periods_per_day || 8}" min="1" max="15" class="w-16 sm:w-20 border border-gray-300 px-2 py-1 text-sm">
                         <button onclick="updateScheduleConfig()" class="bg-blue-600 text-white px-3 py-1 text-sm hover-lift">Update</button>
                     </div>
                 </div>
                 <div class="text-sm text-gray-600">
                     <strong>Total Capacity:</strong> ${maxClassesPerSection} classes/week per section
                 </div>
             </div>
         </div>

         <!-- Tab Navigation -->
         <div class="border-b border-gray-300 mb-4">
             <div class="flex space-x-6">
                 <button onclick="switchTab('classes')" id="classes-tab" class="tab-button active pb-2 px-1 text-sm font-medium">
                     📚 Classes & Groups
                 </button>
                 <button onclick="switchTab('subjects')" id="subjects-tab" class="tab-button pb-2 px-1 text-sm font-medium text-gray-500">
                     🎯 Subjects & Curriculum
                 </button>
             </div>
         </div>

         <!-- Tab Content -->
         <div id="classes-content" class="tab-content">
             <div class="space-y-4">
                 ${classesTabContent.length > 0 ? classesTabContent : `
                     <div class="bg-white border border-gray-200 rounded-lg p-8 text-center">
                         <p class="text-gray-400">No classes found</p>
                     </div>
                 `}
             </div>
         </div>

         <div id="subjects-content" class="tab-content hidden">
             <div class="space-y-4">
                 ${subjectsTabContent.length > 0 ? subjectsTabContent : `
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

        // Update schedule configuration
        function updateScheduleConfig() {
            const activeDays = parseInt(document.getElementById('activeDays').value);
            const periodsPerDay = parseInt(document.getElementById('periodsPerDay').value);
            
            fetch('/school/classes', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    action: 'update_schedule_config',
                    school_id: SCHOOL_ID,
                    active_days: activeDays,
                    periods_per_day: periodsPerDay
                })
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    showToast('Schedule configuration updated successfully', 'success');
                    setTimeout(() => window.location.reload(), 1000);
                } else {
                    showToast('Error updating schedule: ' + (response.error || 'Unknown error'), 'error');
                }
            }).catch(error => {
                console.error('Network error:', error);
                showToast('Network error. Please check your connection and try again.', 'error');
            });
        }

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
            if (submitBtn.disabled) return; // Prevent multiple submissions
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.action = 'add_class_subject';
            data.school_id = SCHOOL_ID;

            fetch('/school/classes', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    showToast('Error adding subject: ' + (response.error || 'Unknown error'), 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Add Subject';
                }
            }).catch(error => {
                console.error('Network error:', error);
                showToast('Network error. Please check your connection and try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Add Subject';
            });
        }

        function addGroupSubject(e) {
            e.preventDefault();
            const submitBtn = document.getElementById('addGroupSubjectBtn');
            if (submitBtn.disabled) return; // Prevent multiple submissions
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.action = 'add_group_subject';
            data.school_id = SCHOOL_ID;

            fetch('/school/classes', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    showToast('Error adding subject: ' + (response.error || 'Unknown error'), 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Add Subject';
                }
            }).catch(error => {
                console.error('Network error:', error);
                showToast('Network error. Please check your connection and try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Add Subject';
            });
        }

        function deleteClassSubject(id) {
            if(!confirm("Remove this subject from class?")) return;
            
            fetch('/school/classes', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete_class_subject', id: id})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    showToast('Error removing subject: ' + (response.error || 'Unknown error'), 'error');
                }
            }).catch(error => {
                console.error('Network error:', error);
                showToast('Network error. Please check your connection and try again.', 'error');
            });
        }

        function deleteGroupSubject(id) {
            if(!confirm("Remove this subject from group?")) return;
            
            fetch('/school/classes', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete_group_subject', id: id})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    showToast('Error removing subject: ' + (response.error || 'Unknown error'), 'error');
                }
            }).catch(error => {
                console.error('Network error:', error);
                showToast('Network error. Please check your connection and try again.', 'error');
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

        // Toast notification system
        function showToast(message, type = 'success') {
            const toast = document.createElement('div');
            const bgColor = type === 'success' ? 'bg-green-600' : 
                          type === 'error' ? 'bg-red-600' : 
                          type === 'info' ? 'bg-blue-600' : 'bg-gray-600';
            
            toast.className = 'fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-[10000] success-message ' + bgColor;
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
      </script>
    `;
}

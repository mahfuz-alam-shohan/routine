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
        totalClasses += classSubjects.reduce((sum, s) => {
            if(s.is_fixed) {
                return sum + (s.classes_per_week || 0);
            } else {
                // For flexible, use the maximum for capacity calculation
                return sum + (s.max_classes || 0);
            }
        }, 0);
        
        // Add group-level subjects
        if (groupId) {
            const groupSubjects = subjectsByGroup[groupId] || [];
            totalClasses += groupSubjects.reduce((sum, s) => {
                if(s.is_fixed) {
                    return sum + (s.classes_per_week || 0);
                } else {
                    // For flexible, use the maximum for capacity calculation
                    return sum + (s.max_classes || 0);
                }
            }, 0);
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
        <div>
            <h3 class="text-lg font-bold mb-4">Subject Bank</h3>
            <div class="mb-4">
                <input type="text" id="new-subject" placeholder="New Subject Name..." 
                       class="border px-2 py-1">
                <button onclick="createSubject()" class="border px-2 py-1 ml-2">
                    + Add Subject
                </button>
            </div>
            <table id="subject-bank-table" border="1" cellpadding="4" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr style="background-color: #f0f0f0;">
                        <th style="border: 1px solid #ccc; padding: 4px;">#</th>
                        <th style="border: 1px solid #ccc; padding: 4px;">Subject Name</th>
                        <th style="border: 1px solid #ccc; padding: 4px;">Edit</th>
                        <th style="border: 1px solid #ccc; padding: 4px;">Delete</th>
                    </tr>
                </thead>
                <tbody id="subject-bank-body">
                    ${subjects.map((sub, index) => `
                        <tr data-subject-id="${sub.id}">
                            <td data-subject-index style="border: 1px solid #ccc; padding: 4px; text-align: center;">${index + 1}</td>
                            <td style="border: 1px solid #ccc; padding: 4px;">
                                <span id="name-${sub.id}">${sub.subject_name}</span>
                                <form id="form-${sub.id}" onsubmit="updateSubject(event, ${sub.id})" style="display: none;">
                                    <input type="text" name="name" value="${sub.subject_name}" style="width: 100%;">
                                    <button type="submit">Save</button>
                                    <button type="button" onclick="toggleEdit(${sub.id})">Cancel</button>
                                </form>
                            </td>
                            <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">
                                <button onclick="toggleEdit(${sub.id})">Edit</button>
                            </td>
                            <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">
                                <button onclick="deleteSubject(${sub.id})">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                    ${subjects.length === 0 ? '<tr data-empty="true"><td colspan="4" style="border: 1px solid #ccc; padding: 4px; text-align: center;">No subjects added yet.</td></tr>' : ''}
                </tbody>
            </table>
        </div>
    `;

    // Build Class Curriculum Tab Content
    const curriculumRows = [];
    
    classes.forEach(cls => {
        const groups = classGroups[cls.id] || [];
        const classSubjects = subjectsByClass[cls.id] || [];
        
        // Class header row
        curriculumRows.push({
            type: 'class',
            class: cls,
            groups: groups,
            subjects: classSubjects,
            level: 0
        });
        
        // Class-level subjects
        classSubjects.forEach(cs => {
            curriculumRows.push({
                type: 'class-subject',
                class: cls,
                subject: cs,
                level: 1
            });
        });
        
        // Groups and their subjects
        groups.forEach(g => {
            const groupSubjects = subjectsByGroup[g.id] || [];
            const capacity = calculateSectionCapacity(cls.id, g.id);
            
            // Group header row
            curriculumRows.push({
                type: 'group',
                class: cls,
                group: g,
                capacity: capacity,
                subjects: groupSubjects,
                level: 1
            });
            
            // Group-level subjects
            groupSubjects.forEach(gs => {
                curriculumRows.push({
                    type: 'group-subject',
                    class: cls,
                    group: g,
                    subject: gs,
                    level: 2
                });
            });
        });
    });
    
    const classCurriculumContent = `
        <div>
            <h3 class="text-lg font-bold mb-4">Class Curriculum</h3>
            <table id="curriculum-table" border="1" cellpadding="4" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr style="background-color: #f0f0f0;">
                        <th style="border: 1px solid #ccc; padding: 4px;">Class/Group</th>
                        <th style="border: 1px solid #ccc; padding: 4px;">Subject</th>
                        <th style="border: 1px solid #ccc; padding: 4px;">Classes/Week</th>
                        <th style="border: 1px solid #ccc; padding: 4px;">Type</th>
                        <th style="border: 1px solid #ccc; padding: 4px;">Capacity</th>
                        <th style="border: 1px solid #ccc; padding: 4px;">Add Subject</th>
                        <th style="border: 1px solid #ccc; padding: 4px;">Remove</th>
                    </tr>
                </thead>
                <tbody id="curriculum-body">
                    ${curriculumRows.map(row => {
                        if (row.type === 'class') {
                            return `
                                <tr data-row="class" data-class-id="${row.class.id}" style="background-color: #f8f8f8; font-weight: bold;">
                                    <td style="border: 1px solid #ccc; padding: 4px; text-align: left;">${row.class.class_name} (${row.groups.length} groups)</td>
                                    <td style="border: 1px solid #ccc; padding: 4px;" colspan="4"></td>
                                    <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">
                                        <button onclick="openAddClassSubjectModal(${row.class.id}, '${row.class.class_name}')">+ Add</button>
                                    </td>
                                    <td style="border: 1px solid #ccc; padding: 4px;"></td>
                                </tr>
                            `;
                        } else if (row.type === 'class-subject') {
                            return `
                                <tr data-row="class-subject" data-class-id="${row.class.id}" data-class-subject-id="${row.subject.id}" data-subject-id="${row.subject.subject_id}">
                                    <td style="border: 1px solid #ccc; padding: 4px; padding-left: 20px;">&nbsp;</td>
                                    <td style="border: 1px solid #ccc; padding: 4px;">${row.subject.subject_name}</td>
                                    <td style="border: 1px solid #ccc; padding: 4px;">
                                        ${row.subject.is_fixed ? 
                                            `${row.subject.classes_per_week} (fixed)` :
                                            `${row.subject.min_classes}-${row.subject.max_classes} (flexible)`
                                        }
                                    </td>
                                    <td style="border: 1px solid #ccc; padding: 4px;">Common</td>
                                    <td style="border: 1px solid #ccc; padding: 4px;"></td>
                                    <td style="border: 1px solid #ccc; padding: 4px;"></td>
                                    <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">
                                        <button onclick="deleteClassSubject(${row.subject.id})">Remove</button>
                                    </td>
                                </tr>
                            `;
                        } else if (row.type === 'group') {
                            return `
                                <tr data-row="group" data-class-id="${row.class.id}" data-group-id="${row.group.id}" style="background-color: #fafafa; font-weight: bold;">
                                    <td style="border: 1px solid #ccc; padding: 4px; padding-left: 20px; text-align: right;">${row.group.group_name} (${classSections[row.group.class_id]?.filter(s => s.group_id === row.group.id).length || 0} sections)</td>
                                    <td style="border: 1px solid #ccc; padding: 4px;" colspan="3"></td>
                                    <td data-capacity-cell="group-${row.group.id}" style="border: 1px solid #ccc; padding: 4px;">${row.capacity.current}/${row.capacity.max}</td>
                                    <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">
                                        <button onclick="openAddGroupSubjectModal(${row.group.id}, '${row.group.group_name}', ${row.class.id}, '${row.class.class_name}')">+ Add</button>
                                    </td>
                                    <td style="border: 1px solid #ccc; padding: 4px;"></td>
                                </tr>
                            `;
                        } else if (row.type === 'group-subject') {
                            return `
                                <tr data-row="group-subject" data-class-id="${row.class.id}" data-group-id="${row.group.id}" data-group-subject-id="${row.subject.id}" data-subject-id="${row.subject.subject_id}">
                                    <td style="border: 1px solid #ccc; padding: 4px; padding-left: 40px;">&nbsp;</td>
                                    <td style="border: 1px solid #ccc; padding: 4px;">${row.subject.subject_name}</td>
                                    <td style="border: 1px solid #ccc; padding: 4px;">
                                        ${row.subject.is_fixed ? 
                                            `${row.subject.classes_per_week} (fixed)` :
                                            `${row.subject.min_classes}-${row.subject.max_classes} (flexible)`
                                        }
                                    </td>
                                    <td style="border: 1px solid #ccc; padding: 4px;">Group</td>
                                    <td style="border: 1px solid #ccc; padding: 4px;"></td>
                                    <td style="border: 1px solid #ccc; padding: 4px;"></td>
                                    <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">
                                        <button onclick="deleteGroupSubject(${row.subject.id})">Remove</button>
                                    </td>
                                </tr>
                            `;
                        }
                    }).join('')}
                    ${curriculumRows.length === 0 ? '<tr><td colspan="7" style="border: 1px solid #ccc; padding: 4px; text-align: center;">No classes found</td></tr>' : ''}
                </tbody>
            </table>
        </div>
    `;

    return `
      
      <style>
        .tab-button {
          border-bottom: 1px solid #d1d5db;
          padding-bottom: 6px;
        }
        .tab-button.active {
          border-bottom: 2px solid #111827;
          color: #111827;
        }
        @media (max-width: 768px) {
          .tab-button { font-size: 12px; }
        }
      </style>

      
      <div>
         <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/school/dashboard" class="hover:text-blue-600">Back to Dashboard</a>
            <span>/</span>
            <span class="text-gray-900 font-bold">Subjects Management</span>
         </div>

         <!-- Master Schedule Information (Read-only) -->
         <div class="mb-6 ui-panel p-4">
             <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                 <div class="flex flex-col md:flex-row md:items-center gap-4">
                     <span class="font-semibold text-sm md:text-base"> Master Schedule Configuration</span>
                     <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                         <span class="text-sm">Working Days: <strong>${scheduleConfig.workingDaysCount || 5}</strong></span>
                         <span class="text-sm">Class Periods/Day: <strong>${scheduleConfig.actualClassPeriodsPerDay || 8}</strong></span>
                     </div>
                 </div>
                 <div class="text-sm text-gray-600">
                     <strong>Total Capacity:</strong> ${maxClassesPerSection} classes/week per section
                     <div class="text-xs text-gray-500 mt-1">
                         (Calculated from master schedule: ${scheduleConfig.workingDaysCount || 5} days x ${scheduleConfig.actualClassPeriodsPerDay || 8} class periods)
                     </div>
                 </div>
             </div>
             <div class="text-xs text-gray-500 mt-2">
                  Schedule configuration is managed in Master Schedule. This ensures consistency with routine generation.
             </div>
         </div>

         <!-- Tab Navigation -->
         <div class="border-b border-gray-300 mb-4">
             <div class="flex space-x-6">
                 <button onclick="switchTab('bank')" id="bank-tab" class="tab-button active pb-2 px-1 text-sm font-medium">
                      Subject Bank
                 </button>
                 <button onclick="switchTab('curriculum')" id="curriculum-tab" class="tab-button pb-2 px-1 text-sm font-medium text-gray-500">
                      Class Curriculum
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
                     <div class="ui-panel p-8 text-center">
                         <p class="text-gray-400">No classes found</p>
                     </div>
                 `}
             </div>
         </div>
      </div>

      <!-- Add Class Subject Modal -->
      <div id="addClassSubjectModal" class="fixed inset-0 bg-black/60 z-[9999] hidden flex items-center justify-center px-4">
          <div class="bg-white border border-gray-300 w-full max-w-md p-4 relative">
              <h3 class="font-bold mb-3 text-sm md:text-base">Add Subject to Class</h3>
              <form onsubmit="addClassSubject(event)">
                  <input type="hidden" name="class_id" id="class_subject_class_id">
                  <div class="mb-3">
                      <select name="subject_id" required class="w-full border border-gray-300 px-2 py-2 text-sm">
                          <option value="">Select Subject</option>
                          ${subjects.map(s => '<option value="' + s.id + '">' + s.subject_name + '</option>').join('')}
                      </select>
                  </div>
                  
                  <!-- Fixed/Flexible Toggle -->
                  <div class="mb-4">
                      <label class="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" name="is_fixed" id="class_is_fixed" checked class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                          <span class="text-sm font-medium text-gray-700">Fixed number of classes per week</span>
                      </label>
                      <p class="text-xs text-gray-500 mt-1">When checked, you set exact classes. When unchecked, you set minimum and maximum range.</p>
                  </div>
                  
                  <!-- Fixed Classes Input -->
                  <div id="fixed-classes-input" class="mb-3">
                      <label class="text-xs text-gray-600 block mb-1">Total Classes Per Week</label>
                      <input type="number" name="classes_per_week" required min="1" max="20" class="w-full border border-gray-300 px-2 py-2 text-sm">
                  </div>
                  
                  <!-- Flexible Range Inputs -->
                  <div id="flexible-classes-input" class="hidden mb-3">
                      <div class="grid grid-cols-2 gap-2">
                          <div>
                              <label class="text-xs text-gray-600 block mb-1">Minimum Classes</label>
                              <input type="number" name="min_classes" min="1" max="20" class="w-full border border-gray-300 px-2 py-2 text-sm">
                          </div>
                          <div>
                              <label class="text-xs text-gray-600 block mb-1">Maximum Classes</label>
                              <input type="number" name="max_classes" min="1" max="20" class="w-full border border-gray-300 px-2 py-2 text-sm">
                          </div>
                      </div>
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
          <div class="bg-white border border-gray-300 w-full max-w-md p-4 relative">
              <h3 class="font-bold mb-3 text-sm md:text-base">Add Subject to Group</h3>
              <form onsubmit="addGroupSubject(event)">
                  <input type="hidden" name="group_id" id="group_subject_group_id">
                  <input type="hidden" name="class_id" id="group_subject_class_id">
                  <div class="mb-3">
                      <select name="subject_id" required class="w-full border border-gray-300 px-2 py-2 text-sm">
                          <option value="">Select Subject</option>
                          ${subjects.map(s => '<option value="' + s.id + '">' + s.subject_name + '</option>').join('')}
                      </select>
                  </div>
                  
                  <!-- Fixed/Flexible Toggle -->
                  <div class="mb-4">
                      <label class="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" name="is_fixed" id="group_is_fixed" checked class="w-4 h-4 text-purple-600 rounded focus:ring-purple-500">
                          <span class="text-sm font-medium text-gray-700">Fixed number of classes per week</span>
                      </label>
                      <p class="text-xs text-gray-500 mt-1">When checked, you set exact classes. When unchecked, you set minimum and maximum range.</p>
                  </div>
                  
                  <!-- Fixed Classes Input -->
                  <div id="group-fixed-classes-input" class="mb-3">
                      <label class="text-xs text-gray-600 block mb-1">Total Classes Per Week</label>
                      <input type="number" name="classes_per_week" required min="1" max="20" class="w-full border border-gray-300 px-2 py-2 text-sm">
                  </div>
                  
                  <!-- Flexible Range Inputs -->
                  <div id="group-flexible-classes-input" class="hidden mb-3">
                      <div class="grid grid-cols-2 gap-2">
                          <div>
                              <label class="text-xs text-gray-600 block mb-1">Minimum Classes</label>
                              <input type="number" name="min_classes" min="1" max="20" class="w-full border border-gray-300 px-2 py-2 text-sm">
                          </div>
                          <div>
                              <label class="text-xs text-gray-600 block mb-1">Maximum Classes</label>
                              <input type="number" name="max_classes" min="1" max="20" class="w-full border border-gray-300 px-2 py-2 text-sm">
                          </div>
                      </div>
                  </div>
                  
                  <div class="flex flex-col sm:flex-row gap-2">
                      <button type="submit" class="bg-purple-600 text-white px-3 py-2 text-sm" id="addGroupSubjectBtn">Add Subject</button>
                      <button type="button" onclick="closeModal('addGroupSubjectModal')" class="bg-gray-200 text-gray-800 px-3 py-2 text-sm">Cancel</button>
                  </div>
              </form>
          </div>
      </div>

      <!-- Replace Subject Confirmation Modal -->
      <div id="replace-subject-modal" class="fixed inset-0 bg-black bg-opacity-50 z-[9999] hidden flex items-center justify-center p-4">
          <div class="bg-white border border-gray-300 max-w-md w-full">
              <div class="p-4 border-b">
                  <h3 class="font-semibold">Subject is Currently in Use</h3>
                  <p class="text-sm text-gray-600" id="replace-subject-details"></p>
              </div>
              <div class="p-4">
                  <div id="subject-usage-list" class="space-y-2 mb-4">
                      <!-- Usage details will be populated here -->
                  </div>
                  
                  <div class="space-y-2">
                      <button type="button" onclick="replaceSubject()" 
                              class="ui-button ui-button--primary w-full">
                          Replace Subject
                      </button>
                      <button type="button" onclick="removeSubjectAndAssignments()" 
                              class="ui-button ui-button--danger w-full">
                          Remove from Curriculum & Delete
                      </button>
                      <button type="button" onclick="closeReplaceModal()" 
                              class="ui-button w-full">
                          Cancel
                      </button>
                  </div>
              </div>
          </div>
      </div>

      <!-- Delete Review Modal -->
      <div id="delete-review-modal" class="fixed inset-0 bg-black bg-opacity-50 z-[9999] hidden flex items-center justify-center p-4">
          <div class="bg-white border border-gray-300 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div class="p-4 border-b bg-red-50">
                  <h3 class="font-semibold text-red-800"> Subject is Currently in Use</h3>
                  <p class="text-sm text-red-600 mt-1">This subject cannot be deleted because it's being used in the following places:</p>
              </div>
              <div class="p-4">
                  <div id="delete-review-usage-list" class="space-y-3 mb-4">
                      <!-- Usage details will be populated here -->
                  </div>
                  
                  <div class="space-y-2 border-t pt-4">
                      <div class="bg-yellow-50 p-3 rounded border border-yellow-200">
                          <p class="text-sm text-yellow-800"><strong>Options:</strong></p>
                          <ul class="text-sm text-yellow-700 mt-1 space-y-1">
                              <li> <strong>Keep Subject:</strong> Cancel this deletion and keep the subject as is</li>
                              <li> <strong>Force Delete:</strong> Remove from all locations and delete permanently (cannot be undone)</li>
                          </ul>
                      </div>
                      
                      <div class="flex gap-2">
                          <button type="button" onclick="forceDeleteSubject()" 
                                  class="ui-button ui-button--danger flex-1">
                               Force Delete (Remove from All)
                          </button>
                          <button type="button" onclick="closeDeleteReviewModal()" 
                                  class="ui-button flex-1">
                              Cancel (Keep Subject)
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <script>
        const SCHOOL_ID = ${school.id};
        const MAX_CLASSES_PER_SECTION = ${maxClassesPerSection};
        
        // Store subjects data for validation
        const CLASS_SUBJECTS = ${JSON.stringify(classSubjects)};
        const GROUP_SUBJECTS = ${JSON.stringify(groupSubjects)};
        const GROUPS = ${JSON.stringify(groups)};

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

        function escapeHtmlClient(text) {
            if (!text) return '';
            return text.toString()
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        function getSubjectTableBody() {
            return document.getElementById('subject-bank-body');
        }

        function reindexSubjectRows() {
            const rows = document.querySelectorAll('tr[data-subject-id]');
            rows.forEach((row, idx) => {
                const cell = row.querySelector('[data-subject-index]');
                if (cell) cell.textContent = String(idx + 1);
            });
        }

        function buildSubjectRowHtml(id, name, index) {
            const safeName = escapeHtmlClient(name);
            return '<tr data-subject-id="' + id + '">' +
                '<td data-subject-index style="border: 1px solid #ccc; padding: 4px; text-align: center;">' + index + '</td>' +
                '<td style="border: 1px solid #ccc; padding: 4px;">' +
                    '<span id="name-' + id + '">' + safeName + '</span>' +
                    '<form id="form-' + id + '" onsubmit="updateSubject(event, ' + id + ')" style="display: none;">' +
                        '<input type="text" name="name" value="' + safeName + '" style="width: 100%;">' +
                        '<button type="submit">Save</button>' +
                        '<button type="button" onclick="toggleEdit(' + id + ')">Cancel</button>' +
                    '</form>' +
                '</td>' +
                '<td style="border: 1px solid #ccc; padding: 4px; text-align: center;">' +
                    '<button onclick="toggleEdit(' + id + ')">Edit</button>' +
                '</td>' +
                '<td style="border: 1px solid #ccc; padding: 4px; text-align: center;">' +
                    '<button onclick="deleteSubject(' + id + ')">Delete</button>' +
                '</td>' +
            '</tr>';
        }

        function addSubjectOption(id, name) {
            const selects = document.querySelectorAll('select[name="subject_id"]');
            selects.forEach(select => {
                if (select.querySelector('option[value="' + id + '"]')) return;
                const option = document.createElement('option');
                option.value = id;
                option.textContent = name;
                select.appendChild(option);
            });
        }

        function updateSubjectOption(id, name) {
            const options = document.querySelectorAll('select[name="subject_id"] option[value="' + id + '"]');
            options.forEach(option => {
                option.textContent = name;
            });
        }

        function removeSubjectOption(id) {
            const options = document.querySelectorAll('select[name="subject_id"] option[value="' + id + '"]');
            options.forEach(option => option.remove());
        }

        function removeEmptySubjectRow(tbody) {
            const emptyRow = tbody.querySelector('tr[data-empty="true"]');
            if (emptyRow) emptyRow.remove();
        }

        function getCurriculumBody() {
            return document.getElementById('curriculum-body');
        }

        function getSubjectLoad(entry) {
            if (!entry) return 0;
            if (entry.is_fixed) return Number(entry.classes_per_week) || 0;
            return Number(entry.max_classes) || 0;
        }

        function getClassSubjectLoad(classId) {
            return CLASS_SUBJECTS.filter(cs => cs.class_id === classId).reduce((sum, cs) => sum + getSubjectLoad(cs), 0);
        }

        function getGroupSubjectLoad(groupId) {
            return GROUP_SUBJECTS.filter(gs => gs.group_id === groupId).reduce((sum, gs) => sum + getSubjectLoad(gs), 0);
        }

        function updateGroupCapacityCell(groupId) {
            const group = GROUPS.find(g => g.id === groupId);
            if (!group) return;
            const current = getClassSubjectLoad(group.class_id) + getGroupSubjectLoad(groupId);
            const cell = document.querySelector('[data-capacity-cell="group-' + groupId + '"]');
            if (cell) {
                cell.textContent = current + '/' + MAX_CLASSES_PER_SECTION;
            }
        }

        function updateGroupCapacitiesForClass(classId) {
            GROUPS.filter(g => g.class_id === classId).forEach(g => updateGroupCapacityCell(g.id));
        }

        function buildClassSubjectRowHtml(entry) {
            const subjectText = entry.is_fixed
                ? (Number(entry.classes_per_week) || 0) + ' (fixed)'
                : (Number(entry.min_classes) || 0) + '-' + (Number(entry.max_classes) || 0) + ' (flexible)';
            const safeName = escapeHtmlClient(entry.subject_name || '');
            return '<tr data-row="class-subject" data-class-id="' + entry.class_id + '" data-class-subject-id="' + entry.id + '" data-subject-id="' + entry.subject_id + '">' +
                '<td style="border: 1px solid #ccc; padding: 4px; padding-left: 20px;">&nbsp;</td>' +
                '<td style="border: 1px solid #ccc; padding: 4px;">' + safeName + '</td>' +
                '<td style="border: 1px solid #ccc; padding: 4px;">' + subjectText + '</td>' +
                '<td style="border: 1px solid #ccc; padding: 4px;">Common</td>' +
                '<td style="border: 1px solid #ccc; padding: 4px;"></td>' +
                '<td style="border: 1px solid #ccc; padding: 4px;"></td>' +
                '<td style="border: 1px solid #ccc; padding: 4px; text-align: center;">' +
                    '<button onclick="deleteClassSubject(' + entry.id + ')">Remove</button>' +
                '</td>' +
            '</tr>';
        }

        function buildGroupSubjectRowHtml(entry) {
            const subjectText = entry.is_fixed
                ? (Number(entry.classes_per_week) || 0) + ' (fixed)'
                : (Number(entry.min_classes) || 0) + '-' + (Number(entry.max_classes) || 0) + ' (flexible)';
            const safeName = escapeHtmlClient(entry.subject_name || '');
            return '<tr data-row="group-subject" data-class-id="' + entry.class_id + '" data-group-id="' + entry.group_id + '" data-group-subject-id="' + entry.id + '" data-subject-id="' + entry.subject_id + '">' +
                '<td style="border: 1px solid #ccc; padding: 4px; padding-left: 40px;">&nbsp;</td>' +
                '<td style="border: 1px solid #ccc; padding: 4px;">' + safeName + '</td>' +
                '<td style="border: 1px solid #ccc; padding: 4px;">' + subjectText + '</td>' +
                '<td style="border: 1px solid #ccc; padding: 4px;">Group</td>' +
                '<td style="border: 1px solid #ccc; padding: 4px;"></td>' +
                '<td style="border: 1px solid #ccc; padding: 4px;"></td>' +
                '<td style="border: 1px solid #ccc; padding: 4px; text-align: center;">' +
                    '<button onclick="deleteGroupSubject(' + entry.id + ')">Remove</button>' +
                '</td>' +
            '</tr>';
        }

        function insertClassSubjectRow(entry) {
            const tbody = getCurriculumBody();
            if (!tbody) return false;
            const header = tbody.querySelector('tr[data-row="class"][data-class-id="' + entry.class_id + '"]');
            if (!header) return false;
            let insertAfter = header;
            let next = header.nextElementSibling;
            while (next && next.dataset && next.dataset.row === 'class-subject' && next.dataset.classId === String(entry.class_id)) {
                insertAfter = next;
                next = next.nextElementSibling;
            }
            insertAfter.insertAdjacentHTML('afterend', buildClassSubjectRowHtml(entry));
            return true;
        }

        function insertGroupSubjectRow(entry) {
            const tbody = getCurriculumBody();
            if (!tbody) return false;
            const header = tbody.querySelector('tr[data-row="group"][data-group-id="' + entry.group_id + '"]');
            if (!header) return false;
            let insertAfter = header;
            let next = header.nextElementSibling;
            while (next && next.dataset && next.dataset.row === 'group-subject' && next.dataset.groupId === String(entry.group_id)) {
                insertAfter = next;
                next = next.nextElementSibling;
            }
            insertAfter.insertAdjacentHTML('afterend', buildGroupSubjectRowHtml(entry));
            return true;
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
                    const tbody = getSubjectTableBody();
                    if (!tbody || !response.id) {
                        window.location.reload();
                        return;
                    }
                    removeEmptySubjectRow(tbody);
                    const index = tbody.querySelectorAll('tr[data-subject-id]').length + 1;
                    tbody.insertAdjacentHTML('beforeend', buildSubjectRowHtml(response.id, name, index));
                    reindexSubjectRows();
                    addSubjectOption(response.id, name);
                    input.value = '';
                    input.focus();
                }
            });
        }

        function toggleEdit(id) {
            const nameEl = document.getElementById('name-' + id);
            const formEl = document.getElementById('form-' + id);
            if (!nameEl || !formEl) return;
            const isEditing = !formEl.classList.contains('hidden') || formEl.style.display === 'block';
            if (isEditing) {
                nameEl.classList.remove('hidden');
                formEl.classList.add('hidden');
                formEl.style.display = 'none';
            } else {
                nameEl.classList.add('hidden');
                formEl.classList.remove('hidden');
                formEl.style.display = 'block';
            }
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
                    const nameEl = document.getElementById('name-' + id);
                    const formEl = document.getElementById('form-' + id);
                    if (nameEl) {
                        nameEl.textContent = name;
                        nameEl.classList.remove('hidden');
                    }
                    if (formEl) {
                        const input = formEl.querySelector('input[name="name"]');
                        if (input) input.value = name;
                        formEl.classList.add('hidden');
                        formEl.style.display = 'none';
                    }
                    updateSubjectOption(id, name);
                }
            });
        }

        function deleteSubject(id) {
            // First check if subject is in use
            fetch('/school/subjects/usagexid=' + id, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            }).then(res => {
                if (!res.ok) {
                    throw new Error('Server returned ' + res.status);
                }
                return res.json();
            }).then(usage => {
                if (usage.success && usage.data && (usage.data.classes?.length > 0 || usage.data.groups?.length > 0 || usage.data.teachers?.length > 0)) {
                    // Subject is in use, show review modal
                    showDeleteReviewModal(id, usage.data);
                } else {
                    // Subject not in use, delete directly
                    if(confirm("Delete this subjectx")) {
                        executeDelete(id);
                    }
                }
            }).catch(error => {
                console.error('Usage check error:', error);
                // If usage check fails, ask user and try direct delete
                if(confirm("Delete this subjectx (Usage check failed, proceeding anyway)")) {
                    executeDelete(id);
                }
            });
        }

        function executeDelete(id) {
            fetch('/school/subjects', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({type: 'bank', id: id})
            }).then(res => {
                if (!res.ok) {
                    throw new Error('Server returned ' + res.status);
                }
                return res.text().then(text => {
                    try {
                        return JSON.parse(text);
                    } catch (e) {
                        console.error('Response not JSON:', text);
                        throw new Error('Server returned HTML instead of JSON');
                    }
                });
            }).then(response => {
                if(response.success) {
                    const row = document.querySelector('tr[data-subject-id="' + id + '"]');
                    if (row) row.remove();
                    removeSubjectOption(id);
                    const tbody = getSubjectTableBody();
                    if (tbody && !tbody.querySelector('tr[data-subject-id]')) {
                        tbody.innerHTML = '<tr data-empty="true"><td colspan="4" style="border: 1px solid #ccc; padding: 4px; text-align: center;">No subjects added yet.</td></tr>';
                    }
                    reindexSubjectRows();
                } else {
                    alert('Error: ' + (response.error || 'Failed to delete subject'));
                }
            }).catch(error => {
                console.error('Delete error:', error);
                alert('Error deleting subject: ' + error.message);
            });
        }

        // Replace Modal Functions
        function showReplaceModal(subjectId, errorMessage) {
            // Fetch current usage data
            fetch('/school/subjects/usagexid=' + subjectId, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            }).then(res => res.json()).then(usage => {
                if (usage.success) {
                    displayReplaceModal(subjectId, usage.data);
                } else {
                    alert('Error checking subject usage');
                }
            }).catch(error => {
                    console.error('Usage check error:', error);
                    // Fallback to simple modal
                    document.getElementById('replace-subject-details').textContent = errorMessage;
                    document.getElementById('subject-usage-list').innerHTML = '<p class="text-sm text-gray-600">Unable to check usage details.</p>';
                    document.getElementById('replace-subject-modal').classList.remove('hidden');
                });
        }

        function displayReplaceModal(subjectId, usageData) {
            document.getElementById('replace-subject-details').textContent = 'Subject ID: ' + subjectId;
            
            let usageHTML = '<div class="space-y-2">';
            
            if (usageData.classes && usageData.classes.length > 0) {
                usageHTML += '<div class="bg-blue-50 p-3 rounded"><strong>Classes:</strong><ul class="mt-2 space-y-1">';
                usageData.classes.forEach(cls => {
                    usageHTML += '<li class="text-sm">' + cls.class_name + ' - ' + cls.classes_per_week + ' classes/week</li>';
                });
                usageHTML += '</ul></div>';
            }
            
            if (usageData.groups && usageData.groups.length > 0) {
                usageHTML += '<div class="bg-green-50 p-3 rounded"><strong>Groups:</strong><ul class="mt-2 space-y-1">';
                usageData.groups.forEach(group => {
                    usageHTML += '<li class="text-sm">' + group.group_name + ' - ' + group.classes_per_week + ' classes/week</li>';
                });
                usageHTML += '</ul></div>';
            }
            
            if (usageHTML === '<div class="space-y-2"></div>') {
                usageHTML = '<p class="text-sm text-gray-600">No current usage found.</p>';
            }
            
            usageHTML += '</div>';
            document.getElementById('subject-usage-list').innerHTML = usageHTML;
            
            // Store subject data for replacement
            window.replaceSubjectData = {
                subjectId: subjectId,
                usageData: usageData
            };
            
            document.getElementById('replace-subject-modal').classList.remove('hidden');
        }

        function closeReplaceModal() {
            document.getElementById('replace-subject-modal').classList.add('hidden');
            window.replaceSubjectData = null;
        }

        function showDeleteReviewModal(subjectId, usageData) {
            let usageHTML = '<div class="space-y-3">';
            
            if (usageData.classes && usageData.classes.length > 0) {
                usageHTML += '<div class="border border-gray-300 p-3"><strong class="text-gray-800"> Used in Classes:</strong><ul class="mt-2 space-y-1">';
                usageData.classes.forEach(cls => {
                    usageHTML += '<li class="text-sm ml-4"> ' + cls.class_name + ' - ' + (cls.classes_per_week || cls.min_classes + '-' + cls.max_classes) + ' classes/week</li>';
                });
                usageHTML += '</ul></div>';
            }
            
            if (usageData.groups && usageData.groups.length > 0) {
                usageHTML += '<div class="border border-gray-300 p-3"><strong class="text-gray-800"> Used in Groups:</strong><ul class="mt-2 space-y-1">';
                usageData.groups.forEach(group => {
                    usageHTML += '<li class="text-sm ml-4"> ' + group.group_name + ' - ' + (group.classes_per_week || group.min_classes + '-' + group.max_classes) + ' classes/week</li>';
                });
                usageHTML += '</ul></div>';
            }
            
            if (usageData.teachers && usageData.teachers.length > 0) {
                usageHTML += '<div class="border border-gray-300 p-3"><strong class="text-gray-800"> Assigned to Teachers:</strong><ul class="mt-2 space-y-1">';
                usageData.teachers.forEach(teacher => {
                    usageHTML += '<li class="text-sm ml-4"> ' + teacher.teacher_name + (teacher.subjects ? ' - ' + teacher.subjects : '') + '</li>';
                });
                usageHTML += '</ul></div>';
            }
            
            if (usageHTML === '<div class="space-y-3"></div>') {
                usageHTML = '<p class="text-sm text-gray-600">No current usage found.</p>';
            }
            
            usageHTML += '</div>';
            document.getElementById('delete-review-usage-list').innerHTML = usageHTML;
            
            // Store subject data for deletion
            window.deleteSubjectData = {
                subjectId: subjectId,
                usageData: usageData
            };
            
            document.getElementById('delete-review-modal').classList.remove('hidden');
        }

        function closeDeleteReviewModal() {
            document.getElementById('delete-review-modal').classList.add('hidden');
            window.deleteSubjectData = null;
        }

        function forceDeleteSubject() {
            const subjectId = window.deleteSubjectData.subjectId;
            
            if (!confirm(' This will permanently remove the subject from ALL classes, groups, and teacher assignments. This action cannot be undone. Continuex')) {
                return;
            }
            
            // First remove from all assignments, then delete
            fetch('/school/subjects/remove-assignments', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    subjectId: subjectId,
                    action: 'remove_assignments_and_delete'
                })
            }).then(res => res.json()).then(response => {
                if (response.success) {
                    closeDeleteReviewModal();
                    window.location.reload();
                } else {
                    alert('Error removing assignments: ' + (response.error || 'Unknown error'));
                }
            }).catch(error => {
                console.error('Force delete error:', error);
                alert('Error deleting subject: ' + error.message);
            });
        }

        function replaceSubject() {
            const subjectId = window.replaceSubjectData.subjectId;
            
            // Show subject selection modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4';
            modal.innerHTML = 
                '<div class="bg-white border border-gray-300 max-w-md w-full">' +
                    '<div class="p-4 border-b">' +
                        '<h3 class="font-semibold">Select Replacement Subject</h3>' +
                        '<p class="text-sm text-gray-600">Choose a subject to replace the current one:</p>' +
                    '</div>' +
                    '<div class="p-4">' +
                        '<select id="replacement-subject-select" class="w-full border px-3 py-2">' +
                            '<option value="">Select replacement subject...</option>' +
                        '</select>' +
                    '</div>' +
                    '<div class="p-4 flex gap-2">' +
                        '<button type="button" onclick="executeReplace()" class="ui-button ui-button--primary">Replace</button>' +
                        '<button type="button" onclick="closeReplaceModal()" class="ui-button">Cancel</button>' +
                    '</div>' +
                '</div>';
            
            document.body.appendChild(modal);
            
            // Populate subject options (excluding current subject)
            fetch('/school/subjects/list', {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            }).then(res => res.json()).then(subjects => {
                const select = document.getElementById('replacement-subject-select');
                subjects.filter(s => s.id !== parseInt(subjectId)).forEach(subject => {
                    const option = document.createElement('option');
                    option.value = subject.id;
                    option.textContent = subject.subject_name;
                    select.appendChild(option);
                });
            }).catch(error => {
                    console.error('Error fetching subjects:', error);
                    alert('Error loading subjects');
                    document.body.removeChild(modal);
                });
        }

        function executeReplace() {
            const subjectId = window.replaceSubjectData.subjectId;
            const replacementId = document.getElementById('replacement-subject-select').value;
            
            if (!replacementId) {
                alert('Please select a replacement subject');
                return;
            }
            
            fetch('/school/subjects/replace', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    oldSubjectId: subjectId,
                    newSubjectId: parseInt(replacementId),
                    action: 'replace_subject'
                })
            }).then(res => res.json()).then(response => {
                if (response.success) {
                    document.body.removeChild(document.querySelector('.fixed.inset-0'));
                    window.location.reload();
                } else {
                    alert('Error replacing subject: ' + (response.error || 'Unknown error'));
                }
            }).catch(error => {
                    console.error('Replace error:', error);
                    alert('Error replacing subject: ' + error.message);
                    document.body.removeChild(document.querySelector('.fixed.inset-0'));
                });
        }

        function removeSubjectAndAssignments() {
            const subjectId = window.replaceSubjectData.subjectId;
            
            if (!confirm('This will remove the subject from all classes/groups and then delete it permanently. Continuex')) {
                return; // User cancelled, do nothing
            }
            
            fetch('/school/subjects/remove-assignments', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    subjectId: subjectId,
                    action: 'remove_assignments_and_delete'
                })
            }).then(res => res.json()).then(response => {
                if (response.success) {
                    document.body.removeChild(document.querySelector('.fixed.inset-0'));
                    window.location.reload();
                } else {
                    alert('Error removing assignments: ' + (response.error || 'Unknown error'));
                }
            }).catch(error => {
                console.error('Remove assignments error:', error);
                alert('Error removing assignments: ' + error.message);
                document.body.removeChild(document.querySelector('.fixed.inset-0'));
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
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            const classId = parseInt(data.class_id);
            const subjectId = parseInt(data.subject_id);
            const subjectSelect = e.target.querySelector('select[name="subject_id"]');
            const subjectName = subjectSelect && subjectSelect.selectedOptions.length ? subjectSelect.selectedOptions[0].textContent : '';
            
            // Check for duplicate using stored data
            const existingClassSubject = CLASS_SUBJECTS.find(cs => 
                cs.class_id === classId && cs.subject_id === subjectId
            );
            
            if (existingClassSubject) {
                alert('This subject is already added to this class!');
                return;
            }
            
            // Check if subject already exists in any group of this class
            const classGroups = GROUPS.filter(g => g.class_id === classId);
            const groupIds = classGroups.map(g => g.id);
            const existingGroupSubject = GROUP_SUBJECTS.find(gs => 
                groupIds.includes(gs.group_id) && gs.subject_id === subjectId
            );
            
            if (existingGroupSubject) {
                alert('This subject is already added to one or more groups in this class. Remove it from groups first, or keep it only in groups.');
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';
            
            data.action = 'add_class_subject';
            data.school_id = SCHOOL_ID;
            
            // Convert checkbox to boolean
            data.is_fixed = formData.has('is_fixed');
            
            // Validation for flexible mode
            if(!data.is_fixed) {
                const min = parseInt(data.min_classes);
                const max = parseInt(data.max_classes);
                if(min >= max) {
                    alert('Minimum classes must be less than maximum classes');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Add Subject';
                    return;
                }
            }

            fetch('/school/subjects', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    if (!response.id) {
                        window.location.reload();
                        return;
                    }
                    const newEntry = {
                        id: response.id,
                        class_id: classId,
                        subject_id: subjectId,
                        subject_name: subjectName,
                        is_fixed: data.is_fixed ? 1 : 0,
                        classes_per_week: data.is_fixed ? Number(data.classes_per_week) || 0 : null,
                        min_classes: data.is_fixed ? null : Number(data.min_classes) || 0,
                        max_classes: data.is_fixed ? null : Number(data.max_classes) || 0
                    };
                    CLASS_SUBJECTS.push(newEntry);
                    const inserted = insertClassSubjectRow(newEntry);
                    closeModal('addClassSubjectModal');
                    if (!inserted) {
                        window.location.reload();
                        return;
                    }
                    updateGroupCapacitiesForClass(classId);
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
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            const groupId = parseInt(data.group_id);
            const subjectId = parseInt(data.subject_id);
            const subjectSelect = e.target.querySelector('select[name="subject_id"]');
            const subjectName = subjectSelect && subjectSelect.selectedOptions.length ? subjectSelect.selectedOptions[0].textContent : '';
            
            // Check for duplicate using stored data
            const existingGroupSubject = GROUP_SUBJECTS.find(gs => 
                gs.group_id === groupId && gs.subject_id === subjectId
            );
            
            if (existingGroupSubject) {
                alert('This subject is already added to this group!');
                return;
            }
            
            // Get the class_id for this group
            const groupInfo = GROUPS.find(g => g.id === groupId);
            if (!groupInfo) {
                alert('Group not found!');
                return;
            }
            
            // Check if subject already exists as class subject for this class
            const existingClassSubject = CLASS_SUBJECTS.find(cs => 
                cs.class_id === groupInfo.class_id && cs.subject_id === subjectId
            );
            
            if (existingClassSubject) {
                alert('This subject is already added to the entire class. Remove it from class first, or keep it only as class subject.');
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';
            
            data.action = 'add_group_subject';
            data.school_id = SCHOOL_ID;
            
            // Convert checkbox to boolean
            data.is_fixed = formData.has('is_fixed');
            
            // Validation for flexible mode
            if(!data.is_fixed) {
                const min = parseInt(data.min_classes);
                const max = parseInt(data.max_classes);
                if(min >= max) {
                    alert('Minimum classes must be less than maximum classes');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Add Subject';
                    return;
                }
            }

            fetch('/school/subjects', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    if (!response.id) {
                        window.location.reload();
                        return;
                    }
                    const newEntry = {
                        id: response.id,
                        class_id: groupInfo.class_id,
                        group_id: groupId,
                        subject_id: subjectId,
                        subject_name: subjectName,
                        is_fixed: data.is_fixed ? 1 : 0,
                        classes_per_week: data.is_fixed ? Number(data.classes_per_week) || 0 : null,
                        min_classes: data.is_fixed ? null : Number(data.min_classes) || 0,
                        max_classes: data.is_fixed ? null : Number(data.max_classes) || 0
                    };
                    GROUP_SUBJECTS.push(newEntry);
                    const inserted = insertGroupSubjectRow(newEntry);
                    closeModal('addGroupSubjectModal');
                    if (!inserted) {
                        window.location.reload();
                        return;
                    }
                    updateGroupCapacityCell(groupId);
                } else {
                    alert('Error adding subject: ' + (response.error || 'Unknown error'));
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Add Subject';
                }
            });
        }

        function deleteClassSubject(id) {
            if(!confirm("Remove this subject from classx")) return;
            
            fetch('/school/subjects', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete_class_subject', id: id})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    const index = CLASS_SUBJECTS.findIndex(cs => cs.id == id);
                    const classId = index >= 0 ? CLASS_SUBJECTS[index].class_id : null;
                    if (index >= 0) CLASS_SUBJECTS.splice(index, 1);
                    const row = document.querySelector('tr[data-class-subject-id="' + id + '"]');
                    if (row && row.parentNode) {
                        row.parentNode.removeChild(row);
                    }
                    if (classId) updateGroupCapacitiesForClass(classId);
                }
            });
        }

        function deleteGroupSubject(id) {
            if(!confirm("Remove this subject from groupx")) return;
            
            fetch('/school/subjects', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete_group_subject', id: id})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    const index = GROUP_SUBJECTS.findIndex(gs => gs.id == id);
                    const groupId = index >= 0 ? GROUP_SUBJECTS[index].group_id : null;
                    if (index >= 0) GROUP_SUBJECTS.splice(index, 1);
                    const row = document.querySelector('tr[data-group-subject-id="' + id + '"]');
                    if (row && row.parentNode) {
                        row.parentNode.removeChild(row);
                    }
                    if (groupId) updateGroupCapacityCell(groupId);
                }
            });
        }

        // Modal management
        function openModal(modalId) {
            document.getElementById(modalId).classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            if (!modal) return;
            
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            
            const submitBtn = modal.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Add Subject';
            }
            
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
            
            // Reset toggle states
            if(modalId === 'addClassSubjectModal') {
                const classToggle = document.getElementById('class_is_fixed');
                if (classToggle) {
                    classToggle.checked = true;
                    toggleFixedFlexible('class', true);
                }
            } else if(modalId === 'addGroupSubjectModal') {
                const groupToggle = document.getElementById('group_is_fixed');
                if (groupToggle) {
                    groupToggle.checked = true;
                    toggleFixedFlexible('group', true);
                }
            }
        }

        // Fixed/Flexible Toggle Function
        function toggleFixedFlexible(type, isFixed) {
            const fixedInput = document.getElementById(type + '-fixed-classes-input');
            const flexibleInput = document.getElementById(type + '-flexible-classes-input');
            
            if (!fixedInput || !flexibleInput) return;
            
            const classesPerWeekInput = fixedInput.querySelector('input[name="classes_per_week"]');
            const minClassesInput = flexibleInput.querySelector('input[name="min_classes"]');
            const maxClassesInput = flexibleInput.querySelector('input[name="max_classes"]');
            
            if(isFixed) {
                fixedInput.classList.remove('hidden');
                flexibleInput.classList.add('hidden');
                if (classesPerWeekInput) classesPerWeekInput.required = true;
                if (minClassesInput) minClassesInput.required = false;
                if (maxClassesInput) maxClassesInput.required = false;
            } else {
                fixedInput.classList.add('hidden');
                flexibleInput.classList.remove('hidden');
                if (classesPerWeekInput) classesPerWeekInput.required = false;
                if (minClassesInput) minClassesInput.required = true;
                if (maxClassesInput) maxClassesInput.required = true;
            }
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

        // Setup toggle event listeners
        document.addEventListener('DOMContentLoaded', function() {
            // Class modal toggle
            const classToggle = document.getElementById('class_is_fixed');
            if(classToggle) {
                classToggle.addEventListener('change', function() {
                    toggleFixedFlexible('class', this.checked);
                });
            }
            
            // Group modal toggle
            const groupToggle = document.getElementById('group_is_fixed');
            if(groupToggle) {
                groupToggle.addEventListener('change', function() {
                    toggleFixedFlexible('group', this.checked);
                });
            }
        });
      </script>
    `;
}

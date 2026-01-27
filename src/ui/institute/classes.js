// src/ui/institute/classes.js - INSTITUTION ADMIN: Read-Only Classes View

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

    // Group subjects by class and group for display
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

    return `
      <style>
        /* Mobile responsive design */
        @media (max-width: 768px) {
          .capacity-indicator {
            font-size: 10px;
            padding: 2px 4px;
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
            <span class="text-gray-900 font-bold">Classes & Groups</span>
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

         <!-- Classes Hierarchy (Read-only) -->
         <div class="space-y-4">
             ${classesTabContent.length > 0 ? classesTabContent : `
                 <div class="bg-white border border-gray-200 rounded-lg p-8 text-center">
                     <p class="text-gray-400">No classes found</p>
                 </div>
             `}
         </div>
      </div>
    `;
}

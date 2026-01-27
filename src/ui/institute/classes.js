export function ClassesPageHTML(classes = [], groups = [], sections = []) {
    
    // Group data by class
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

    // Build class cards with hierarchy
    const classCards = classes.map(cls => {
        const groups = classGroups[cls.id] || [];
        const sections = classSections[cls.id] || [];
        
        // Group sections by group
        const sectionsByGroup = {};
        sections.forEach(s => {
            const groupKey = s.group_id ? `group_${s.group_id}` : 'no_group';
            if (!sectionsByGroup[groupKey]) sectionsByGroup[groupKey] = [];
            sectionsByGroup[groupKey].push(s);
        });

        return `
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4 md:mb-6">
                <!-- Class Header -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 md:px-6 py-4 md:py-5 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl">
                                ${cls.class_name.replace('Class ', '').replace(' ', '')}
                            </div>
                            <div>
                                <h3 class="text-lg md:text-xl font-bold text-gray-900">${cls.class_name}</h3>
                                <p class="text-xs md:text-sm text-gray-600 mt-1">
                                    ${groups.length > 0 ? `${groups.length} Group${groups.length > 1 ? 's' : ''}` : 'No Groups'} • ${sections.length} Section${sections.length > 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                        <div class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs md:text-sm font-medium">
                            Active
                        </div>
                    </div>
                </div>

                <!-- Groups Display -->
                ${groups.length > 0 ? `
                    <div class="px-4 md:px-6 py-3 bg-gray-50 border-b border-gray-200">
                        <div class="flex items-center gap-2 mb-2">
                            <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                            </svg>
                            <span class="text-xs md:text-sm font-semibold text-gray-700 uppercase">Groups</span>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            ${groups.map(g => `
                                <span class="inline-flex items-center px-2.5 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                    ${g.group_name}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Sections Display -->
                <div class="px-4 md:px-6 py-4 md:py-5">
                    <div class="flex items-center gap-2 mb-3 md:mb-4">
                        <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h2a1 1 0 100-2 2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H6z"/>
                        </svg>
                        <span class="text-xs md:text-sm font-semibold text-gray-700 uppercase">Sections</span>
                    </div>
                    
                    ${groups.length > 0 ? 
                        // Display sections grouped by groups
                        Object.entries(sectionsByGroup).map(([groupKey, groupSections]) => {
                            if (groupKey === 'no_group') {
                                return `
                                    <div class="mb-4">
                                        <p class="text-xs text-gray-500 mb-2 italic">No Group</p>
                                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                                            ${groupSections.map(s => `
                                                <div class="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                    <div class="flex items-center gap-2">
                                                        <span class="w-2 h-2 bg-blue-400 rounded-full"></span>
                                                        <span class="text-sm md:text-base font-medium text-gray-900">${s.section_name}</span>
                                                    </div>
                                                    <span class="text-xs md:text-sm text-gray-500 bg-white px-2 py-1 rounded border border-gray-300">${s.shift}</span>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                `;
                            } else {
                                const groupId = parseInt(groupKey.replace('group_', ''));
                                const group = groups.find(g => g.id === groupId);
                                return `
                                    <div class="mb-4">
                                        <div class="flex items-center gap-2 mb-2">
                                            <div class="w-2 h-2 bg-purple-400 rounded-full"></div>
                                            <span class="text-sm font-semibold text-gray-700">${group.group_name}</span>
                                        </div>
                                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                                            ${groupSections.map(s => `
                                                <div class="flex items-center justify-between p-2 md:p-3 bg-purple-50 rounded-lg border border-purple-200">
                                                    <div class="flex items-center gap-2">
                                                        <span class="w-2 h-2 bg-purple-400 rounded-full"></span>
                                                        <span class="text-sm md:text-base font-medium text-gray-900">${s.section_name}</span>
                                                    </div>
                                                    <span class="text-xs md:text-sm text-gray-500 bg-white px-2 py-1 rounded border border-gray-300">${s.shift}</span>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                `;
                            }
                        }).join('')
                    :
                        // Display sections without groups
                        `
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                                ${sections.map(s => `
                                    <div class="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div class="flex items-center gap-2">
                                            <span class="w-2 h-2 bg-blue-400 rounded-full"></span>
                                            <span class="text-sm md:text-base font-medium text-gray-900">${s.section_name}</span>
                                        </div>
                                        <span class="text-xs md:text-sm text-gray-500 bg-white px-2 py-1 rounded border border-gray-300">${s.shift}</span>
                                    </div>
                                `).join('')}
                            </div>
                        `
                    }
                    
                    ${sections.length === 0 ? `
                        <div class="text-center py-8">
                            <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"/>
                            </svg>
                            <p class="text-gray-400 text-sm md:text-base">No sections assigned yet</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    return `
      <div class="max-w-5xl md:max-w-6xl mx-auto pt-6 md:pt-8">
          <div class="flex items-center justify-between mb-6 md:mb-8">
              <div>
                <h1 class="text-2xl md:text-4xl font-light text-gray-900">Classes & Sections</h1>
                <p class="text-sm md:text-base text-gray-500 mt-1">View your institution's class structure.</p>
              </div>
          </div>
          
          <div class="space-y-4 md:space-y-6">
              ${classes.length > 0 ? classCards : `
                  <div class="bg-white rounded-xl border border-gray-200 p-8 md:p-12 text-center">
                      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                          <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h2a1 1 0 100-2 2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H6z"/>
                      </svg>
                      <h3 class="text-lg md:text-xl font-medium text-gray-900 mb-2">No Classes Found</h3>
                      <p class="text-gray-400 text-sm md:text-base">Classes will appear here once assigned by the system administrator.</p>
                  </div>
              `}
          </div>
      </div>
    `;
}
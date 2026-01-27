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

    // Build simple class rows
    const classRows = classes.map(cls => {
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
            <div class="border-b border-gray-200 pb-3 mb-3">
                <!-- Class Header -->
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                        <span class="font-semibold text-gray-900">${cls.class_name}</span>
                        <span class="text-xs text-gray-500">(${sections.length} sections)</span>
                    </div>
                    <span class="text-xs text-green-600">Active</span>
                </div>

                <!-- Groups -->
                ${groups.length > 0 ? `
                    <div class="flex flex-wrap gap-1 mb-2">
                        ${groups.map(g => `
                            <span class="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded">${g.group_name}</span>
                        `).join('')}
                    </div>
                ` : ''}

                <!-- Sections -->
                <div class="text-xs text-gray-600">
                    ${groups.length > 0 ? 
                        // Display sections grouped by groups
                        Object.entries(sectionsByGroup).map(([groupKey, groupSections]) => {
                            if (groupKey === 'no_group') {
                                return groupSections.map(s => `${s.section_name}`).join(', ');
                            } else {
                                const groupId = parseInt(groupKey.replace('group_', ''));
                                const group = groups.find(g => g.id === groupId);
                                return `<span class="font-medium">${group.group_name}:</span> ${groupSections.map(s => s.section_name).join(', ')}`;
                            }
                        }).join(' | ')
                    :
                        // Display sections without groups
                        sections.map(s => s.section_name).join(', ')
                    }
                </div>
            </div>
        `;
    }).join('');

    return `
      <div class="max-w-4xl mx-auto pt-4">
          <div class="mb-4">
              <h1 class="text-xl font-light text-gray-900">Classes & Sections</h1>
              <p class="text-xs text-gray-500">View your institution's class structure.</p>
          </div>
          
          <div class="bg-white border border-gray-200 rounded p-3">
              ${classes.length > 0 ? classRows : `
                  <div class="text-center py-8">
                      <p class="text-gray-400 text-sm">No classes found</p>
                  </div>
              `}
          </div>
      </div>
    `;
}
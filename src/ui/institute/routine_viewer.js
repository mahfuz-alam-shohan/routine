import { PrintLayoutEditorHTML } from './print_layout_editor.js';



export function RoutineViewerHTML(routineData = {}) {
    const {
        routine = {},
        entries = [],
        slots = [],
        classes = [],
        teachers = [],
        subjects = [],
        groups = [],
        sections = [],
        workingDays = [],
        conflictSummary = { entryConflicts: [], missingRequirements: [], gapReasons: [] },
        shiftList: rawShiftList = []
    } = routineData;

    const activeDays = workingDays.length
        ? workingDays
        : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    const sortedSlots = slots.slice().sort((a, b) => a.slot_index - b.slot_index);
    const classSlots = sortedSlots.filter(slot => slot.type !== 'break');
    const shiftList = Array.isArray(rawShiftList) && rawShiftList.length ? rawShiftList.slice() : ['Full Day'];
    if (!shiftList.includes('Full Day')) shiftList.unshift('Full Day');
    const escapeHtml = (value) => String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    const escapeAttr = (value) => escapeHtml(value).replace(/"/g, '&quot;');
    const slotLabelMap = new Map();
    sortedSlots.forEach(slot => {
        const label = slot.label || `${slot.start_time} - ${slot.end_time}`;
        slotLabelMap.set(slot.slot_index, label);
    });
    const getSlotLabel = (slotIndex) => slotLabelMap.get(slotIndex) || `Period ${slotIndex + 1}`;

    const classById = new Map(classes.map(item => [item.id, item]));
    const groupById = new Map(groups.map(item => [item.id, item]));
    const sectionById = new Map(sections.map(item => [item.id, item]));
    const subjectById = new Map(subjects.map(item => [item.id, item]));
    const teacherById = new Map(teachers.map(item => [item.id, item]));

    const classShiftMap = new Map(classes.map(cls => [cls.id, cls.shift_name || 'Full Day']));
    const sectionMap = new Map();
    const addSection = (key, label, shiftName) => {
        if (!sectionMap.has(key)) {
            sectionMap.set(key, { key, label, shift: shiftName || 'Full Day' });
        }
    };

    const normalizeSlotShifts = (slot) => {
        let shifts = [];
        if (Array.isArray(slot.applicable_shifts)) {
            shifts = slot.applicable_shifts.slice();
        } else if (typeof slot.applicable_shifts === 'string') {
            try { shifts = JSON.parse(slot.applicable_shifts); } catch (e) { shifts = []; }
        }
        if (!Array.isArray(shifts)) shifts = [];
        if (!shifts.length || shifts.includes('all')) {
            shifts = shiftList.slice();
        } else {
            shifts = shifts.filter(name => shiftList.includes(name));
            if (!shifts.length) shifts = shiftList.slice();
        }
        if (!shifts.includes('Full Day')) shifts.unshift('Full Day');
        return shifts;
    };

    const shiftSlotMap = {};
    shiftList.forEach(shift => { shiftSlotMap[shift] = []; });
    sortedSlots.forEach(slot => {
        const applicable = normalizeSlotShifts(slot);
        applicable.forEach(shift => {
            if (!shiftSlotMap[shift]) shiftSlotMap[shift] = [];
            shiftSlotMap[shift].push(slot.slot_index);
        });
    });
    Object.keys(shiftSlotMap).forEach(shift => {
        shiftSlotMap[shift] = Array.from(new Set(shiftSlotMap[shift]));
    });

    const classPeriodIndexBySlot = new Map();
    classSlots.forEach((slot, index) => {
        classPeriodIndexBySlot.set(slot.slot_index, index);
    });

    sections.forEach(sec => {
        const cls = classById.get(sec.class_id);
        const grp = groupById.get(sec.group_id);
        const className = cls ? cls.class_name : 'Class';
        const groupName = grp ? ` - ${grp.group_name}` : '';
        const sectionName = sec.section_name ? ` - ${sec.section_name}` : '';
        const label = `${className}${groupName}${sectionName || ' - Main'}`;
        const key = `${sec.class_id}-${sec.group_id || 0}-${sec.id || 0}`;
        addSection(key, label, classShiftMap.get(sec.class_id));
    });

    entries.forEach(entry => {
        const className = entry.class_name || classById.get(entry.class_id)?.class_name || 'Class';
        const groupName = entry.group_name ? ` - ${entry.group_name}` : '';
        const sectionName = entry.section_name ? ` - ${entry.section_name}` : ' - Main';
        const key = `${entry.class_id}-${entry.group_id || 0}-${entry.section_id || 0}`;
        const label = `${className}${groupName}${sectionName}`;
        addSection(key, label, classShiftMap.get(entry.class_id));
    });

    if (sectionMap.size === 0 && classes.length) {
        classes.forEach(cls => {
            const key = `${cls.id}-0-0`;
            addSection(key, `${cls.class_name} - Main`, classShiftMap.get(cls.id));
        });
    }

    const sectionsList = Array.from(sectionMap.values());
    const entriesBySection = {};
    const gapReasonMap = new Map();
    const teacherSchedule = {};
    const teacherLoad = {};
    const teacherDayLoad = {};
    const teacherSubjectCounts = {};

    const getSectionLabel = (entry) => {
        const className = entry.class_name || classById.get(entry.class_id)?.class_name || 'Class';
        const sectionName = entry.section_name || '';
        const groupName = entry.group_name || '';
        if (sectionName) return `${className}${sectionName}`;
        if (groupName) return `${className}${groupName}`;
        return `${className}`;
    };

    sectionsList.forEach(section => {
        entriesBySection[section.key] = {};
        activeDays.forEach(day => {
            entriesBySection[section.key][day] = {};
        });
    });

    (conflictSummary.gapReasons || []).forEach(gap => {
        const key = `${gap.class_id}-${gap.group_id || 0}-${gap.section_id || 0}-${gap.day_of_week}-${gap.slot_index}`;
        gapReasonMap.set(key, gap.reason);
    });

    entries.forEach(entry => {
        const key = `${entry.class_id}-${entry.group_id || 0}-${entry.section_id || 0}`;
        if (!entriesBySection[key]) return;
        if (!entriesBySection[key][entry.day_of_week]) return;
        entriesBySection[key][entry.day_of_week][entry.slot_index] = entry;

        if (entry.teacher_id) {
            if (!teacherSchedule[entry.teacher_id]) teacherSchedule[entry.teacher_id] = {};
            if (!teacherSchedule[entry.teacher_id][entry.day_of_week]) teacherSchedule[entry.teacher_id][entry.day_of_week] = {};
            if (!teacherSchedule[entry.teacher_id][entry.day_of_week][entry.slot_index]) {
                teacherSchedule[entry.teacher_id][entry.day_of_week][entry.slot_index] = [];
            }
            const shiftName = classShiftMap.get(entry.class_id) || 'Full Day';
            teacherSchedule[entry.teacher_id][entry.day_of_week][entry.slot_index].push({
                label: getSectionLabel(entry),
                shift: shiftName
            });
            teacherLoad[entry.teacher_id] = (teacherLoad[entry.teacher_id] || 0) + 1;
            if (!teacherDayLoad[entry.teacher_id]) teacherDayLoad[entry.teacher_id] = {};
            teacherDayLoad[entry.teacher_id][entry.day_of_week] = (teacherDayLoad[entry.teacher_id][entry.day_of_week] || 0) + 1;

            if (!teacherSubjectCounts[entry.teacher_id]) teacherSubjectCounts[entry.teacher_id] = {};
            const subjectName = entry.subject_name || subjectById.get(entry.subject_id)?.subject_name || 'Subject';
            teacherSubjectCounts[entry.teacher_id][subjectName] = (teacherSubjectCounts[entry.teacher_id][subjectName] || 0) + 1;
        }
    });

    const ordinal = (n) => {
        if (n % 100 >= 11 && n % 100 <= 13) return `${n}TH`;
        switch (n % 10) {
            case 1: return `${n}ST`;
            case 2: return `${n}ND`;
            case 3: return `${n}RD`;
            default: return `${n}TH`;
        }
    };

    const getPeriodLabel = (slot) => {
        if (slot.type === 'break') return 'Break Period';
        const index = classPeriodIndexBySlot.get(slot.slot_index);
        return index !== undefined ? ordinal(index + 1) : getSlotLabel(slot.slot_index);
    };

    const subjectPalette = [
        '#E8F4FD',
        '#F0FDF4',
        '#FEF3C7',
        '#FCE7F3',
        '#E0F2FE',
        '#F3E8FF',
        '#ECFCCB',
        '#FFE4E6'
    ];
    const subjectColorMap = {};
    const getSubjectColor = (label) => {
        const safeLabel = label || 'Unassigned';
        if (!subjectColorMap[safeLabel]) {
            const index = Object.keys(subjectColorMap).length % subjectPalette.length;
            subjectColorMap[safeLabel] = subjectPalette[index];
        }
        return subjectColorMap[safeLabel];
    };

    const maxDayPeriods = classSlots.length || 1;
    const getDayLoadClass = (count) => {
        if (count >= Math.ceil(maxDayPeriods * 0.75)) return 'day-load-high';
        if (count >= Math.ceil(maxDayPeriods * 0.4)) return 'day-load-ok';
        return 'day-load-low';
    };

    const teacherPrimarySubject = (teacherId) => {
        const counts = teacherSubjectCounts[teacherId];
        if (!counts) return '';
        let best = '';
        let bestCount = 0;
        Object.entries(counts).forEach(([name, count]) => {
            if (count > bestCount) {
                best = name;
                bestCount = count;
            }
        });
        return best;
    };

    return `
      <div class="max-w-6xl mx-auto pb-20 px-4 md:px-6" id="routine-viewer-app">
          <div class="sticky top-0 z-30 bg-white border-b border-gray-200">
              <div class="py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                      <h2 class="text-lg md:text-xl font-semibold text-gray-900">${routine.name || 'Routine'}</h2>
                      <p class="text-xs md:text-sm text-gray-500 mt-1">Generated ${routine.generated_at ? new Date(routine.generated_at).toLocaleDateString() : ''} - Version ${routine.version || 1}</p>
                  </div>
                  <div class="flex flex-wrap gap-2">
                      <button onclick="app.printRoutine()" class="ui-button">Print</button>
                      <button onclick="app.backToList()" class="ui-button ui-button--primary">Back</button>
                  </div>
              </div>
              <div class="pb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div class="text-xs text-gray-500">
                      <span class="mr-4">Periods: ${routine.total_periods || 0}</span>
                      <span class="mr-4">Teachers: ${teachers.length}</span>
                      <span>Conflicts: ${routine.conflicts_resolved || 0}</span>
                  </div>
                  <div class="flex flex-wrap items-center gap-2">
                      <div class="flex items-center gap-2">
                          <button type="button" class="ui-button view-toggle" data-view="section">Section View</button>
                          <button type="button" class="ui-button view-toggle" data-view="teacher">Teacher View</button>
                      </div>
                      ${shiftList.length > 1 ? `
                      <div class="flex items-center gap-2" id="shift-filter-wrap">
                          <label class="text-xs text-gray-500">Shift</label>
                          <select id="shift-filter" onchange="app.filterByShift(this.value)" class="ui-select text-xs md:text-sm">
                              <option value="all">All Shifts</option>
                              ${shiftList.map(shift => `
                                  <option value="${escapeAttr(shift)}">${escapeHtml(shift)}</option>
                              `).join('')}
                          </select>
                      </div>
                      ` : ''}
                      <div class="flex items-center gap-2" id="section-filter-wrap">
                          <label class="text-xs text-gray-500">Section</label>
                          <select id="section-filter" onchange="app.filterBySection(this.value)" class="ui-select text-xs md:text-sm">
                              <option value="all">All Sections</option>
                              ${sectionsList.map(section => `
                                  <option value="${section.key}">${section.label}</option>
                              `).join('')}
                          </select>
                      </div>
                      <div class="flex items-center gap-2 hidden" id="teacher-day-filter">
                          <label class="text-xs text-gray-500">Day</label>
                          <select id="day-filter" onchange="app.filterByDay(this.value)" class="ui-select text-xs md:text-sm">
                              ${activeDays.map(day => `
                                  <option value="${day}">${day.charAt(0).toUpperCase() + day.slice(1)}</option>
                              `).join('')}
                          </select>
                      </div>
                      <div class="flex items-center gap-2 hidden" id="teacher-filter-wrap">
                          <label class="text-xs text-gray-500">Teacher</label>
                          <select id="teacher-filter" onchange="app.filterByTeacher(this.value)" class="ui-select text-xs md:text-sm">
                              <option value="all">All Teachers</option>
                              ${teachers.map(teacher => `
                                  <option value="${teacher.id}">${teacher.full_name || 'Teacher'}</option>
                              `).join('')}
                          </select>
                      </div>
                  </div>
              </div>
          </div>

          <div class="mt-6 space-y-6">
              <div class="ui-panel" id="conflicts-panel">
                  <div class="px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                          <h3 class="text-sm font-semibold text-gray-900">Conflicts</h3>
                          <p class="text-xs text-gray-500">
                              ${conflictSummary.entryConflicts.length} entry conflicts  ${conflictSummary.missingRequirements.length} missing requirements  ${conflictSummary.gapReasons.length} empty slots
                          </p>
                      </div>
                      <div class="flex gap-2">
                          <button type="button" class="ui-button conflict-tab" data-tab="entry">Entry Conflicts</button>
                          <button type="button" class="ui-button conflict-tab" data-tab="missing">Missing Requirements</button>
                          <button type="button" class="ui-button conflict-tab" data-tab="gaps">Empty Slots</button>
                      </div>
                  </div>
                  <div class="p-4 space-y-4">
                      <div id="conflicts-entry">
                          ${conflictSummary.entryConflicts.length ? `
                              <div class="overflow-x-auto">
                                  <table class="w-full text-xs">
                                      <thead class="bg-gray-50">
                                          <tr>
                                              <th class="px-3 py-2 text-left text-gray-500 font-medium">Day</th>
                                              <th class="px-3 py-2 text-left text-gray-500 font-medium">Period</th>
                                              <th class="px-3 py-2 text-left text-gray-500 font-medium">Section</th>
                                              <th class="px-3 py-2 text-left text-gray-500 font-medium">Subject</th>
                                              <th class="px-3 py-2 text-left text-gray-500 font-medium">Teacher</th>
                                              <th class="px-3 py-2 text-left text-gray-500 font-medium">Reason</th>
                                          </tr>
                                      </thead>
                                      <tbody class="divide-y divide-gray-200">
                                          ${conflictSummary.entryConflicts.map(conflict => {
        const className = classById.get(conflict.class_id)?.class_name || 'Class';
        const groupName = conflict.group_id ? (groupById.get(conflict.group_id)?.group_name || '') : '';
        const sectionName = conflict.section_id ? (sectionById.get(conflict.section_id)?.section_name || 'Main') : 'Main';
        const subjectName = subjectById.get(conflict.subject_id)?.subject_name || 'Subject';
        const teacherName = teacherById.get(conflict.teacher_id)?.full_name || 'Unassigned';
        const periodLabel = getSlotLabel(conflict.slot_index);
        return `
                                                  <tr>
                                                      <td class="px-3 py-2 text-gray-700">${conflict.day_of_week}</td>
                                                      <td class="px-3 py-2 text-gray-700">${periodLabel}</td>
                                                      <td class="px-3 py-2 text-gray-700">${className}${groupName ? ' - ' + groupName : ''} - ${sectionName}</td>
                                                      <td class="px-3 py-2 text-gray-700">${subjectName}</td>
                                                      <td class="px-3 py-2 text-gray-700">${teacherName}</td>
                                                      <td class="px-3 py-2 text-red-600">${conflict.reason || 'Conflict'}</td>
                                                  </tr>
                                              `;
    }).join('')}
                                      </tbody>
                                  </table>
                              </div>
                          ` : `
                              <p class="text-xs text-gray-500">No entry conflicts found.</p>
                          `}
                      </div>
                      <div id="conflicts-missing" class="hidden">
                          ${conflictSummary.missingRequirements.length ? `
                              <div class="overflow-x-auto">
                                  <table class="w-full text-xs">
                                      <thead class="bg-gray-50">
                                          <tr>
                                              <th class="px-3 py-2 text-left text-gray-500 font-medium">Section</th>
                                              <th class="px-3 py-2 text-left text-gray-500 font-medium">Subject</th>
                                              <th class="px-3 py-2 text-left text-gray-500 font-medium">Required</th>
                                              <th class="px-3 py-2 text-left text-gray-500 font-medium">Scheduled</th>
                                              <th class="px-3 py-2 text-left text-gray-500 font-medium">Missing</th>
                                          </tr>
                                      </thead>
                                      <tbody class="divide-y divide-gray-200">
                                          ${conflictSummary.missingRequirements.map(item => `
                                              <tr>
                                                  <td class="px-3 py-2 text-gray-700">${item.class_name}${item.group_name ? ' - ' + item.group_name : ''} - ${item.section_name}</td>
                                                  <td class="px-3 py-2 text-gray-700">${item.subject_name}</td>
                                                  <td class="px-3 py-2 text-gray-700">${item.required}</td>
                                                  <td class="px-3 py-2 text-gray-700">${item.scheduled}</td>
                                                  <td class="px-3 py-2 text-red-600">${item.missing}</td>
                                              </tr>
                                          `).join('')}
                                      </tbody>
                                  </table>
                              </div>
                          ` : `
                              <p class="text-xs text-gray-500">No missing requirements found.</p>
                          `}
                      </div>
                      <div id="conflicts-gaps" class="hidden">
                          ${conflictSummary.gapReasons.length ? `
                              <div class="overflow-x-auto">
                                  <table class="w-full text-xs">
                                      <thead class="bg-gray-50">
                                          <tr>
                                              <th class="px-3 py-2 text-left text-gray-500 font-medium">Day</th>
                                              <th class="px-3 py-2 text-left text-gray-500 font-medium">Period</th>
                                              <th class="px-3 py-2 text-left text-gray-500 font-medium">Section</th>
                                              <th class="px-3 py-2 text-left text-gray-500 font-medium">Reason</th>
                                          </tr>
                                      </thead>
                                      <tbody class="divide-y divide-gray-200">
                                          ${conflictSummary.gapReasons.map(gap => `
                                              <tr>
                                                  <td class="px-3 py-2 text-gray-700">${gap.day_of_week}</td>
                                                  <td class="px-3 py-2 text-gray-700">${getSlotLabel(gap.slot_index)}</td>
                                                  <td class="px-3 py-2 text-gray-700">${gap.class_name}${gap.group_name ? ' - ' + gap.group_name : ''} - ${gap.section_name}</td>
                                                  <td class="px-3 py-2 text-gray-700">${gap.reason}</td>
                                              </tr>
                                          `).join('')}
                                      </tbody>
                                  </table>
                              </div>
                          ` : `
                              <p class="text-xs text-gray-500">No empty slot reasons found.</p>
                          `}
                      </div>
                  </div>
              </div>
          </div>

          <div class="mt-6 space-y-6" id="section-view">
              ${sectionsList.map(section => `
                  <div class="ui-panel" data-section-table="${section.key}" data-shift="${section.shift || 'Full Day'}">
                      <div class="px-4 py-3 border-b border-gray-200">
                          <h3 class="text-sm font-medium text-gray-900">${section.label}</h3>
                      </div>
                      <div class="overflow-x-auto">
                          <table class="w-full text-xs border border-gray-200 border-collapse">
                              <thead class="bg-gray-50">
                                  <tr>
                                      <th class="px-3 py-2 text-left text-gray-500 font-medium border border-gray-200">Day</th>
                                      ${sortedSlots.map(slot => {
        const timeLabel = slot.start_time && slot.end_time ? `${slot.start_time}-${slot.end_time}` : '';
        return `
                                              <th class="px-2 py-2 text-center text-gray-500 font-medium border border-gray-200" data-slot-index="${slot.slot_index}">
                                                  <div>${getPeriodLabel(slot)}</div>
                                                  ${timeLabel ? `<div class="text-[10px] text-gray-400">${timeLabel}</div>` : ''}
                                              </th>
                                          `;
    }).join('')}
                                  </tr>
                              </thead>
                              <tbody class="divide-y divide-gray-200">
                                  ${activeDays.map(day => {
        return `
                                          <tr>
                                              <td class="px-3 py-2 text-gray-700 font-medium border border-gray-200">${day.charAt(0).toUpperCase() + day.slice(1)}</td>
                                              ${sortedSlots.map(slot => {
            if (slot.type === 'break') {
                return `<td class="px-2 py-2 text-center text-gray-400 bg-gray-50 border border-gray-200" data-slot-index="${slot.slot_index}">Break Period</td>`;
            }
            const entry = entriesBySection[section.key]?.[day]?.[slot.slot_index];
            if (!entry) {
                const gapKey = `${section.key}-${day}-${slot.slot_index}`;
                const gapReason = gapReasonMap.get(gapKey);
                const titleAttr = gapReason
                    ? ' title="' + String(gapReason)
                        .replace(/&/g, '&amp;')
                        .replace(/"/g, '&quot;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;') + '"'
                    : '';
                return `<td class="px-2 py-2 text-center text-gray-300 border border-gray-200" data-slot-index="${slot.slot_index}"${titleAttr}>-</td>`;
            }
            const subjectName = entry.subject_name || subjectById.get(entry.subject_id)?.subject_name || 'Subject';
            const teacherName = entry.teacher_name || teacherById.get(entry.teacher_id)?.full_name || 'Unassigned';
            const conflictClass = entry.is_conflict ? 'text-red-600' : 'text-gray-900';
            const conflictTitle = entry.conflict_reason
                ? ' title="' + String(entry.conflict_reason)
                    .replace(/&/g, '&amp;')
                    .replace(/"/g, '&quot;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;') + '"'
                : '';
            return `
                                                      <td class="px-2 py-2 text-center border border-gray-200" data-slot-index="${slot.slot_index}">
                                                          <div class="text-xs font-medium ${conflictClass}"${conflictTitle}>${subjectName}</div>
                                                          <div class="text-[11px] text-gray-500">${teacherName}</div>
                                                      </td>
                                                  `;
        }).join('')}
                                          </tr>
                                      `;
    }).join('')}
                              </tbody>
                          </table>
                      </div>
                  </div>
              `).join('')}
          </div>

          <div class="mt-6 space-y-6 hidden" id="teacher-view">
              ${activeDays.map(day => `
                  <div class="border border-gray-200 teacher-day" data-teacher-day="${day}">
                      <div class="px-4 py-3 border-b border-gray-200">
                          <h3 class="text-sm font-medium text-gray-900">${day.charAt(0).toUpperCase() + day.slice(1)}</h3>
                      </div>
                      <div class="overflow-x-auto">
                          <table class="w-full text-xs border border-gray-200 border-collapse">
                              <thead class="bg-gray-50">
                                  <tr>
                                      <th class="px-3 py-2 text-left text-gray-500 font-medium border border-gray-200">SUB</th>
                                      <th class="px-3 py-2 text-left text-gray-500 font-medium border border-gray-200">SL</th>
                                      <th class="px-3 py-2 text-left text-gray-500 font-medium border border-gray-200">NAME</th>
                                      ${sortedSlots.map(slot => {
        if (slot.type === 'break') {
            return `<th class="px-2 py-2 text-center text-gray-300 font-medium border border-gray-200" data-slot-index="${slot.slot_index}"></th>`;
        }
        const index = classSlots.findIndex(s => s.slot_index === slot.slot_index);
        const label = index >= 0 ? ordinal(index + 1) : '';
        return `<th class="px-2 py-2 text-center text-gray-500 font-medium border border-gray-200" data-slot-index="${slot.slot_index}">${label}</th>`;
    }).join('')}
                                      <th class="px-2 py-2 text-center text-gray-500 font-medium border border-gray-200">Total</th>
                                  </tr>
                                  <tr>
                                      <th class="px-3 py-2 text-left text-gray-400 font-medium border border-gray-200"></th>
                                      <th class="px-3 py-2 text-left text-gray-400 font-medium border border-gray-200"></th>
                                      <th class="px-3 py-2 text-left text-gray-400 font-medium border border-gray-200"></th>
                                      ${sortedSlots.map(slot => {
        if (slot.type === 'break') {
            return `<th class="px-2 py-2 text-center text-gray-300 font-medium border border-gray-200" data-slot-index="${slot.slot_index}"></th>`;
        }
        return `<th class="px-2 py-2 text-center text-gray-400 font-medium border border-gray-200" data-slot-index="${slot.slot_index}">${slot.start_time}-${slot.end_time}</th>`;
    }).join('')}
                                      <th class="px-2 py-2 text-center text-gray-400 font-medium border border-gray-200"></th>
                                  </tr>
                              </thead>
                              <tbody class="divide-y divide-gray-200">
                                  ${teachers
            .slice()
            .sort((a, b) => {
                const aLabel = teacherPrimarySubject(a.id) || 'Unassigned';
                const bLabel = teacherPrimarySubject(b.id) || 'Unassigned';
                if (aLabel !== bLabel) return aLabel.localeCompare(bLabel);
                return (a.full_name || '').localeCompare(b.full_name || '');
            })
            .map((teacher, index) => {
                const subjectLabel = teacherPrimarySubject(teacher.id) || 'Unassigned';
                const dayTotal = teacherDayLoad[teacher.id]?.[day] || 0;
                const dayLoadClass = getDayLoadClass(dayTotal);
                return `
                                          <tr data-teacher-id="${teacher.id}">
                                              <td class="px-3 py-2 text-gray-700 border border-gray-200" style="background-color: ${getSubjectColor(subjectLabel)};">${subjectLabel}</td>
                                              <td class="px-3 py-2 text-gray-700 border border-gray-200">${index + 1}</td>
                                              <td class="px-3 py-2 text-gray-900 font-medium border border-gray-200 ${dayLoadClass}">
                                                  ${teacher.full_name || 'Teacher'}
                                              </td>
                                              ${sortedSlots.map(slot => {
                    if (slot.type === 'break') {
                        return `<td class="px-2 py-2 text-center text-gray-300 border border-gray-200" data-slot-index="${slot.slot_index}"></td>`;
                    }
                    const items = teacherSchedule[teacher.id]?.[day]?.[slot.slot_index] || [];
                    const itemHtml = items.map(item => `<div class="text-[11px] text-gray-700 teacher-cell-item" data-shift="${item.shift || 'Full Day'}">${item.label}</div>`).join('');
                    const emptyDisplay = items.length ? 'none' : 'block';
                    return `
                                                      <td class="px-2 py-2 text-center border border-gray-200 teacher-cell" data-slot-index="${slot.slot_index}">
                                                          ${itemHtml}
                                                          <div class="text-[11px] text-gray-300 teacher-cell-empty" style="display: ${emptyDisplay};">-</div>
                                                      </td>
                                                  `;
                }).join('')}
                                              <td class="px-2 py-2 text-center text-gray-700 font-medium border border-gray-200" data-teacher-total="${teacher.id}" data-total-all="${dayTotal}">${dayTotal}</td>
                                          </tr>
                                      `;
            }).join('')}
                              </tbody>
                          </table>
                      </div>
                  </div>
              `).join('')}
          </div>
      </div>

      <script>
        window.RoutineViewerApp = function() {
            return {
                backToList() {
                    window.location.href = '/school/routine-generator';
                },
                printRoutine() {
                    if (window.PrintLayoutEditor) {
                        window.PrintLayoutEditor.open();
                    } else {
                        window.print();
                    }
                },
                setView(view) {
                    const sectionView = document.getElementById('section-view');
                    const teacherView = document.getElementById('teacher-view');
                    const dayFilter = document.getElementById('teacher-day-filter');
                    const teacherFilter = document.getElementById('teacher-filter-wrap');
                    const sectionFilter = document.getElementById('section-filter-wrap');
                    const toggles = document.querySelectorAll('.view-toggle');

                    toggles.forEach(btn => {
                        if (btn.dataset.view === view) {
                            btn.classList.add('bg-gray-900', 'text-white');
                            btn.classList.remove('border-gray-300', 'text-gray-700');
                        } else {
                            btn.classList.remove('bg-gray-900', 'text-white');
                            btn.classList.add('border-gray-300', 'text-gray-700');
                        }
                    });

                    if (view === 'teacher') {
                        sectionView.classList.add('hidden');
                        teacherView.classList.remove('hidden');
                        dayFilter.classList.remove('hidden');
                        teacherFilter.classList.remove('hidden');
                        sectionFilter.classList.add('hidden');
                    } else {
                        sectionView.classList.remove('hidden');
                        teacherView.classList.add('hidden');
                        dayFilter.classList.add('hidden');
                        teacherFilter.classList.add('hidden');
                        sectionFilter.classList.remove('hidden');
                    }
                },
                filterByDay(day) {
                    document.querySelectorAll('.teacher-day').forEach(table => {
                        if (table.dataset.teacherDay === day) {
                            table.classList.remove('hidden');
                        } else {
                            table.classList.add('hidden');
                        }
                    });
                },
                filterByTeacher(teacherId) {
                    document.querySelectorAll('.teacher-day').forEach(table => {
                        table.querySelectorAll('tbody tr[data-teacher-id]').forEach(row => {
                            if (teacherId === 'all' || row.dataset.teacherId === teacherId) {
                                row.style.display = '';
                            } else {
                                row.style.display = 'none';
                            }
                        });
                    });
                },
                filterBySection(sectionKey) {
                    document.querySelectorAll('[data-section-table]').forEach(table => {
                        if (sectionKey === 'all' || table.dataset.sectionTable === sectionKey) {
                            table.style.display = '';
                        } else {
                            table.style.display = 'none';
                        }
                    });
                },
                filterByShift(shiftName) {
                    const showAll = shiftName === 'all';
                    const allowedSlots = showAll ? null : new Set((window.shiftSlotsMap[shiftName] || []));

                    document.querySelectorAll('[data-section-table]').forEach(panel => {
                        const panelShift = panel.dataset.shift || 'Full Day';
                        if (showAll || panelShift === shiftName) {
                            panel.style.display = '';
                        } else {
                            panel.style.display = 'none';
                        }
                    });

                    document.querySelectorAll('[data-slot-index]').forEach(cell => {
                        if (!allowedSlots) {
                            cell.classList.remove('hidden');
                            return;
                        }
                        const idx = Number(cell.dataset.slotIndex);
                        if (allowedSlots.has(idx)) {
                            cell.classList.remove('hidden');
                        } else {
                            cell.classList.add('hidden');
                        }
                    });

                    document.querySelectorAll('.teacher-cell-item').forEach(item => {
                        if (showAll || item.dataset.shift === shiftName) {
                            item.classList.remove('hidden');
                        } else {
                            item.classList.add('hidden');
                        }
                    });

                    document.querySelectorAll('.teacher-cell').forEach(cell => {
                        const empty = cell.querySelector('.teacher-cell-empty');
                        if (!empty) return;
                        const visibleItems = cell.querySelectorAll('.teacher-cell-item:not(.hidden)');
                        empty.style.display = visibleItems.length ? 'none' : 'block';
                    });

                    document.querySelectorAll('[data-teacher-total]').forEach(totalCell => {
                        const row = totalCell.closest('tr[data-teacher-id]');
                        if (!row) return;
                        if (showAll) {
                            totalCell.textContent = totalCell.dataset.totalAll || '0';
                            return;
                        }
                        const visibleItems = row.querySelectorAll('.teacher-cell-item:not(.hidden)');
                        totalCell.textContent = String(visibleItems.length);
                    });

                    const sectionSelect = document.getElementById('section-filter');
                    if (sectionSelect) {
                        const options = Array.from(sectionSelect.options);
                        options.forEach(option => {
                            if (option.value === 'all') {
                                option.hidden = false;
                                return;
                            }
                            const panel = document.querySelector('[data-section-table="' + option.value + '"]');
                            if (!panel) return;
                            const panelShift = panel.dataset.shift || 'Full Day';
                            option.hidden = !showAll && panelShift !== shiftName;
                        });
                        if (sectionSelect.value !== 'all') {
                            const selectedOption = sectionSelect.selectedOptions[0];
                            if (selectedOption && selectedOption.hidden) {
                                sectionSelect.value = 'all';
                                this.filterBySection('all');
                            }
                        }
                    }
                }
            };
        };

        document.addEventListener('DOMContentLoaded', function() {
            if (window.location.pathname === '/school/routine-viewer') {
                window.app = new RoutineViewerApp();
                const defaultDay = '${activeDays[0] || ''}';
                if (defaultDay) {
                    const daySelect = document.getElementById('day-filter');
                    if (daySelect) daySelect.value = defaultDay;
                    window.app.filterByDay(defaultDay);
                }
                window.shiftSlotsMap = ${JSON.stringify(shiftSlotMap)};
                window.app.setView('section');
                document.querySelectorAll('.view-toggle').forEach(btn => {
                    btn.addEventListener('click', () => window.app.setView(btn.dataset.view));
                });
                const shiftSelect = document.getElementById('shift-filter');
                if (shiftSelect) {
                    window.app.filterByShift(shiftSelect.value || 'all');
                }
                const entryTab = document.querySelector('[data-tab="entry"]');
                const missingTab = document.querySelector('[data-tab="missing"]');
                const gapsTab = document.querySelector('[data-tab="gaps"]');
                const entryPanel = document.getElementById('conflicts-entry');
                const missingPanel = document.getElementById('conflicts-missing');
                const gapsPanel = document.getElementById('conflicts-gaps');
                const resetTabs = () => {
                    [entryTab, missingTab, gapsTab].forEach(tab => {
                        if (!tab) return;
                        tab.classList.remove('bg-gray-900', 'text-white');
                        tab.classList.add('border-gray-300', 'text-gray-700');
                    });
                    [entryPanel, missingPanel, gapsPanel].forEach(panel => {
                        if (panel) panel.classList.add('hidden');
                    });
                };
                const setConflictTab = (tab) => {
                    resetTabs();
                    if (tab === 'missing' && missingTab && missingPanel) {
                        missingPanel.classList.remove('hidden');
                        missingTab.classList.add('bg-gray-900', 'text-white');
                        missingTab.classList.remove('border-gray-300', 'text-gray-700');
                        return;
                    }
                    if (tab === 'gaps' && gapsTab && gapsPanel) {
                        gapsPanel.classList.remove('hidden');
                        gapsTab.classList.add('bg-gray-900', 'text-white');
                        gapsTab.classList.remove('border-gray-300', 'text-gray-700');
                        return;
                    }
                    if (entryTab && entryPanel) {
                        entryPanel.classList.remove('hidden');
                        entryTab.classList.add('bg-gray-900', 'text-white');
                        entryTab.classList.remove('border-gray-300', 'text-gray-700');
                    }
                };
                if (entryTab && missingTab && gapsTab) {
                    entryTab.addEventListener('click', () => setConflictTab('entry'));
                    missingTab.addEventListener('click', () => setConflictTab('missing'));
                    gapsTab.addEventListener('click', () => setConflictTab('gaps'));
                    setConflictTab('entry');
                }
            }
        });

      </script>
      <style>
        .day-load-high { background-color: #fee2e2; }
        .day-load-ok { background-color: #dcfce7; }
        .day-load-low { background-color: #dbeafe; }
      </style>
      ${PrintLayoutEditorHTML()}
    `;
}

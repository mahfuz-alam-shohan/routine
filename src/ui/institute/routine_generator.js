export function RoutineGeneratorHTML(existingRoutines = [], generationSettings = null, schoolData = {}, generationWarnings = { items: [] }, limitInfo = {}) {
    const { classes = [], teachers = [], subjects = [], slots = [] } = schoolData;
    const usedTokens = Number(limitInfo?.used) || 0;
    const maxTokensRaw = limitInfo?.max_routines_yearly;
    const hasLimit = maxTokensRaw !== null && maxTokensRaw !== undefined && maxTokensRaw !== '';
    const maxTokens = hasLimit ? Number(maxTokensRaw) : null;
    const remainingTokens = hasLimit ? Math.max(0, maxTokens - usedTokens) : null;
    const tokenLabel = hasLimit
        ? `Tokens left: ${remainingTokens} / ${maxTokens}`
        : 'Tokens: Unlimited';
    
    return `
      
      <style>
        #routine-generator-app {
          background: #ffffff;
          color: var(--ui-ink, #111827);
          overflow-x: hidden;
        }
        .rg-header {
          background: #ffffff;
          border-bottom: 1px solid var(--ui-line, #d1d5db);
        }
        .rg-card {
          background: #ffffff;
          border: 1px solid var(--ui-line, #d1d5db);
          border-radius: 0;
          padding: 16px;
        }
        .rg-row {
          border: 1px solid var(--ui-line, #d1d5db);
          border-radius: 0;
          padding: 10px 12px;
          background: #ffffff;
          min-width: 0;
          word-break: break-word;
        }
        .rg-row-title {
          min-width: 0;
          word-break: break-word;
        }
        .rg-tag {
          border: 1px solid var(--ui-line, #d1d5db);
          background: #ffffff;
          color: #6b7280;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 0;
          font-weight: 600;
        }
        .rg-btn {
          border: 1px solid var(--ui-line, #d1d5db);
          background: #ffffff;
          color: var(--ui-ink, #111827);
          padding: 6px 10px;
          border-radius: 0;
          font-weight: 600;
          font-size: 12px;
        }
        .rg-btn-primary {
          background: var(--ui-accent, #111827);
          border-color: var(--ui-accent, #111827);
          color: #ffffff;
        }
        .rg-btn-mini {
          border: 1px solid var(--ui-line, #d1d5db);
          background: #ffffff;
          color: var(--ui-ink, #111827);
          padding: 4px 8px;
          border-radius: 0;
          font-size: 11px;
          font-weight: 600;
        }
        .rg-metric {
          border: 1px solid var(--ui-line, #d1d5db);
          border-radius: 0;
          padding: 10px;
          background: #ffffff;
        }
        .rg-metric--ok {
          border-color: var(--ui-line, #d1d5db);
          background: #ffffff;
        }
        .rg-metric--bad {
          border-color: var(--ui-line, #d1d5db);
          background: #ffffff;
        }
        .rg-note {
          border: 1px dashed var(--ui-line, #d1d5db);
          border-radius: 0;
          padding: 12px;
          background: #ffffff;
        }
        .rg-warning {
          border-left: 3px solid #9ca3af;
          background: #ffffff;
        }
        .rg-input {
          border: 1px solid #d1d5db;
          background: #ffffff;
          border-radius: 0;
          padding: 8px 10px;
        }
        .rg-modal {
          border-radius: 0;
          border: 1px solid #d1d5db;
          background: #ffffff;
        }
        .rg-animate { }
        @media (max-width: 768px) {
          .rg-btn { width: 100%; }
        }
        @media (max-width: 640px) {
          .rg-shell { max-width: 100%; padding-bottom: 96px; }
          .rg-card { padding: 12px; }
          .rg-header .rg-title { font-size: 16px; }
          .rg-header .rg-subtitle { font-size: 12px; }
          .rg-row { padding: 8px; }
          .rg-row-meta { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px 10px; font-size: 11px; }
          .rg-row-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; width: 100%; }
          .rg-btn-mini { width: 100%; text-align: center; }
        }
      </style>


      <div class="rg-shell max-w-7xl xl:max-w-8xl mx-auto pb-24 md:pb-10 select-none" id="routine-generator-app">
          
          <div class="rg-header sticky top-0 z-30">
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-4 py-3 md:px-6 md:py-4">
                  <div>
                    <h2 class="rg-title text-lg md:text-2xl font-semibold text-gray-900">Routine Generator</h2>
                    <p class="rg-subtitle text-sm md:text-base text-gray-500 mt-1">Generate class schedules with strict constraints and smart distribution.</p>
                  </div>
                  <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-4">
                       <div class="text-xs text-gray-500 border border-gray-200 px-2 py-1">${tokenLabel}</div>
                       <button onclick="app.generateRoutine()" class="rg-btn rg-btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
                           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                           Generate Routine
                       </button>
                       <button onclick="app.showSettings()" class="rg-btn w-full sm:w-auto">Settings</button>
                  </div>
              </div>
          </div>

          <!-- Existing Routines Section -->
          <div class="mx-3 sm:mx-4 md:mx-6 mt-6">
              <div class="rg-card rg-animate">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Generated Routines</h3>
                  <div id="routine-list">
                      ${existingRoutines.length === 0 ? `
                          <div class="text-center py-8 text-gray-500">
                              <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                              <p class="text-base font-medium">No routines generated yet</p>
                              <p class="text-sm mt-1">Generate your first routine to get started</p>
                          </div>
                      ` : `
                          <div class="space-y-3">
                              ${existingRoutines.map(routine => `
                                  <div class="rg-row flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${routine.is_active ? 'ring-1 ring-[#cbd5e1]' : ''}">
                                      <div class="flex-1 min-w-0">
                                          <div class="flex items-center gap-3">
                                              <h4 class="rg-row-title font-semibold text-gray-900">${routine.name}</h4>
                                              ${routine.is_active ? '<span class="rg-tag">Active</span>' : ''}
                                          </div>
                                          <div class="rg-row-meta flex items-center gap-4 mt-1 text-sm text-gray-500 flex-wrap">
                                              <span>Version ${routine.version}</span>
                                              <span>${routine.total_periods} periods</span>
                                              <span>Generated ${new Date(routine.generated_at).toLocaleDateString()}</span>
                                              ${routine.conflicts_resolved > 0 ? `<span class="text-gray-600">${routine.conflicts_resolved} conflicts</span>` : ''}
                                          </div>
                                      </div>
                                      <div class="rg-row-actions flex items-center gap-2 flex-wrap">
                                          <button onclick="app.viewRoutine(${routine.id})" class="rg-btn-mini">View</button>
                                          <button onclick="app.editRoutine(${routine.id})" class="rg-btn-mini">Edit</button>
                                          ${!routine.is_active ? `<button onclick="app.activateRoutine(${routine.id})" class="rg-btn-mini">Activate</button>` : ''}
                                          <button onclick="app.deleteRoutine(${routine.id})" class="rg-btn-mini">Delete</button>
                                      </div>
                                  </div>
                              `).join('')}
                          </div>
                      `}
                  </div>
              </div>
          </div>

          <!-- Generation Requirements Check -->
          <div class="mx-3 sm:mx-4 md:mx-6 mt-6">
              <div class="rg-card rg-animate">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">System Requirements</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div class="rg-metric ${classes.length > 0 ? 'rg-metric--ok' : 'rg-metric--bad'}">
                          <div class="flex items-center justify-between">
                              <div>
                                  <p class="text-sm font-medium text-gray-900">Classes</p>
                                  <p class="text-2xl font-bold text-gray-900">${classes.length}</p>
                              </div>
                              <div class="${classes.length > 0 ? 'text-gray-700' : 'text-gray-700'}">
                                  ${classes.length > 0 ? 
                                      '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' :
                                      '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
                                  }
                              </div>
                          </div>
                          ${classes.length === 0 ? '<p class="text-xs text-red-600 mt-2">No classes configured</p>' : ''}
                      </div>

                      <div class="rg-metric ${teachers.length > 0 ? 'rg-metric--ok' : 'rg-metric--bad'}">
                          <div class="flex items-center justify-between">
                              <div>
                                  <p class="text-sm font-medium text-gray-900">Teachers</p>
                                  <p class="text-2xl font-bold text-gray-900">${teachers.length}</p>
                              </div>
                              <div class="${teachers.length > 0 ? 'text-gray-700' : 'text-gray-700'}">
                                  ${teachers.length > 0 ? 
                                      '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' :
                                      '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
                                  }
                              </div>
                          </div>
                          ${teachers.length === 0 ? '<p class="text-xs text-red-600 mt-2">No teachers added</p>' : ''}
                      </div>

                      <div class="rg-metric ${subjects.length > 0 ? 'rg-metric--ok' : 'rg-metric--bad'}">
                          <div class="flex items-center justify-between">
                              <div>
                                  <p class="text-sm font-medium text-gray-900">Subjects</p>
                                  <p class="text-2xl font-bold text-gray-900">${subjects.length}</p>
                              </div>
                              <div class="${subjects.length > 0 ? 'text-gray-700' : 'text-gray-700'}">
                                  ${subjects.length > 0 ? 
                                      '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' :
                                      '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
                                  }
                              </div>
                          </div>
                          ${subjects.length === 0 ? '<p class="text-xs text-red-600 mt-2">No subjects configured</p>' : ''}
                      </div>

                      <div class="rg-metric ${slots.length > 0 ? 'rg-metric--ok' : 'rg-metric--bad'}">
                          <div class="flex items-center justify-between">
                              <div>
                                  <p class="text-sm font-medium text-gray-900">Time Slots</p>
                                  <p class="text-2xl font-bold text-gray-900">${slots.length}</p>
                              </div>
                              <div class="${slots.length > 0 ? 'text-gray-700' : 'text-gray-700'}">
                                  ${slots.length > 0 ? 
                                      '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' :
                                      '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
                                  }
                              </div>
                          </div>
                          ${slots.length === 0 ? '<p class="text-xs text-red-600 mt-2">No time slots configured</p>' : ''}
                      </div>
                  </div>

                  ${classes.length === 0 || teachers.length === 0 || subjects.length === 0 || slots.length === 0 ? `
                      <div class="mt-4 rg-note">
                          <div class="flex">
                              <svg class="w-5 h-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                              <div>
                                  <p class="text-sm font-medium text-gray-800">Setup Required</p>
                                  <p class="text-xs text-gray-600 mt-1">Please configure all required sections before generating routines:</p>
                                  <ul class="text-xs text-gray-600 mt-1 list-disc list-inside">
                                      ${classes.length === 0 ? '<li>Add classes from the Classes section</li>' : ''}
                                      ${teachers.length === 0 ? '<li>Add teachers from the Teachers section</li>' : ''}
                                      ${subjects.length === 0 ? '<li>Add subjects from the Subjects section</li>' : ''}
                                      ${slots.length === 0 ? '<li>Configure time slots from the Master Schedule section</li>' : ''}
                                  </ul>
                              </div>
                          </div>
                      </div>
                  ` : `
                      <div class="mt-4 rg-note">
                          <div class="flex">
                              <svg class="w-5 h-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                              <div>
                                  <p class="text-sm font-medium text-gray-800">Ready to Generate</p>
                                  <p class="text-xs text-gray-600 mt-1">All requirements met. You can now generate an optimized routine.</p>
                              </div>
                          </div>
                      </div>
                  `}
              </div>
          </div>

          ${generationWarnings.items && generationWarnings.items.length ? `
              <div class="mx-4 md:mx-6 mt-6">
                  <div class="rg-card rg-warning rg-animate">
                      <div class="flex items-center justify-between">
                          <h3 class="text-lg font-semibold text-gray-900">Generation Warnings</h3>
                          <span class="text-xs text-gray-500">${generationWarnings.items.length} item(s)</span>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">These warnings explain why gaps or conflicts may appear.</p>
                      <ul class="mt-4 space-y-2 text-sm text-gray-700 list-disc list-inside">
                          ${generationWarnings.items.map(item => `<li>${item.message}</li>`).join('')}
                      </ul>
                  </div>
              </div>
          ` : ''}

          <!-- Settings Modal (Hidden by default) -->
          <div id="settings-modal" class="fixed inset-0 bg-gray-900/50 z-[9999] hidden flex items-center justify-center p-4">
              <div class="rg-modal max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div class="p-6 border-b border-gray-200">
                      <div class="flex items-center justify-between">
                          <h3 class="text-lg font-semibold text-gray-900">Generation Settings</h3>
                          <button onclick="app.closeSettings()" class="text-gray-400 hover:text-gray-600">
                              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                      </div>
                  </div>
                  
                  <div class="p-6 space-y-6">
                      <div>
                          <h4 class="text-sm font-medium text-gray-900 mb-3">Generation Preferences</h4>
                          <div class="space-y-3">
                              <label class="flex items-center">
                                  <input type="checkbox" id="prefer-consecutive" ${generationSettings?.prefer_same_teacher_consecutive ? 'checked' : ''} class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                                  <span class="ml-2 text-sm text-gray-700">Prefer same teacher for consecutive periods</span>
                              </label>
                              <label class="flex items-center">
                                  <input type="checkbox" id="avoid-duplicates" ${generationSettings?.avoid_teacher_duplicates ? 'checked' : ''} class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                                  <span class="ml-2 text-sm text-gray-700">Avoid teacher teaching same class multiple times per day</span>
                              </label>
                              <label class="flex items-center">
                                  <input type="checkbox" id="balance-distribution" ${generationSettings?.balance_subject_distribution ? 'checked' : ''} class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                                  <span class="ml-2 text-sm text-gray-700">Balance subject distribution across the week</span>
                              </label>
                              <label class="flex items-center">
                                  <input type="checkbox" id="respect-preferences" ${generationSettings?.respect_preferred_times ? 'checked' : ''} class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                                  <span class="ml-2 text-sm text-gray-700">Respect teacher time preferences</span>
                              </label>
                          </div>
                      </div>

                      <div>
                          <h4 class="text-sm font-medium text-gray-900 mb-3">Conflict Resolution</h4>
                          <div class="space-y-3">
                              <label class="flex items-center">
                                  <input type="checkbox" id="auto-resolve" ${generationSettings?.auto_resolve_conflicts ? 'checked' : ''} class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                                  <span class="ml-2 text-sm text-gray-700">Automatically resolve conflicts</span>
                              </label>
                              <label class="flex items-center">
                                  <input type="checkbox" id="allow-split" ${generationSettings?.allow_split_periods ? 'checked' : ''} class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                                  <span class="ml-2 text-sm text-gray-700">Allow split periods for double classes</span>
                              </label>
                          </div>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label class="block text-sm font-medium text-gray-700 mb-1">Max Teacher Daily Periods</label>
                          <input type="number" id="max-periods" value="${generationSettings?.max_teacher_daily_periods || 8}" min="1" max="12" class="w-full rg-input">
                      </div>
                      <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Break Between Same Subject</label>
                          <input type="number" id="subject-break" value="${generationSettings?.break_between_same_subject || 1}" min="0" max="5" class="w-full rg-input">
                      </div>
                  </div>

                  <div class="flex justify-end gap-3 pt-4 border-t">
                      <button onclick="app.closeSettings()" class="rg-btn">Cancel</button>
                      <button onclick="app.saveSettings()" class="rg-btn rg-btn-primary">Save Settings</button>
                  </div>
              </div>
          </div>
      </div>
      </div>
      
      <script>
        window.routineAppData = {
            routines: ${JSON.stringify(existingRoutines || [])}
        };
        // Routine Generator JavaScript
        window.RoutineGeneratorApp = function() {
            return {
                renderRoutineList() {
                    const container = document.getElementById('routine-list');
                    if (!container) return false;
                    const routines = (window.routineAppData && Array.isArray(window.routineAppData.routines))
                        ? window.routineAppData.routines.slice()
                        : [];
                    if (!routines.length) {
                        container.innerHTML = '<div class="text-center py-8 text-gray-500">' +
                            '<svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01.707.293l5.414 5.414a2 2 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>' +
                            '<p class="text-base font-medium">No routines generated yet</p>' +
                            '<p class="text-sm mt-1">Generate your first routine to get started</p>' +
                        '</div>';
                        return true;
                    }
                    routines.sort((a, b) => {
                        const timeA = a && a.generated_at ? new Date(a.generated_at).getTime() : 0;
                        const timeB = b && b.generated_at ? new Date(b.generated_at).getTime() : 0;
                        return timeB - timeA;
                    });
                    const list = routines.map(routine => {
                        const generatedAt = routine.generated_at ? new Date(routine.generated_at).toLocaleDateString() : '';
                        const version = routine.version || 1;
                        const totalPeriods = routine.total_periods || 0;
                        const conflicts = routine.conflicts_resolved || 0;
                        const rowClass = routine.is_active ? ' ring-1 ring-[#cbd5e1]' : '';
                        const activeTag = routine.is_active ? '<span class="rg-tag">Active</span>' : '';
                        const conflictTag = conflicts > 0 ? '<span class="text-gray-600">' + conflicts + ' conflicts</span>' : '';
                        const activateButton = !routine.is_active
                            ? '<button onclick="app.activateRoutine(' + routine.id + ')" class="rg-btn-mini">Activate</button>'
                            : '';
                        const routineName = routine.name || 'Routine';
                        return '<div class="rg-row flex items-center justify-between' + rowClass + '">' +
                            '<div class="flex-1">' +
                                '<div class="flex items-center gap-3">' +
                                    '<h4 class="font-semibold text-gray-900">' + routineName + '</h4>' +
                                    activeTag +
                                '</div>' +
                                '<div class="flex items-center gap-4 mt-1 text-sm text-gray-500">' +
                                    '<span>Version ' + version + '</span>' +
                                    '<span>' + totalPeriods + ' periods</span>' +
                                    '<span>Generated ' + generatedAt + '</span>' +
                                    conflictTag +
                                '</div>' +
                            '</div>' +
                            '<div class="flex items-center gap-2">' +
                                '<button onclick="app.viewRoutine(' + routine.id + ')" class="rg-btn-mini">View</button>' +
                                '<button onclick="app.editRoutine(' + routine.id + ')" class="rg-btn-mini">Edit</button>' +
                                activateButton +
                                '<button onclick="app.deleteRoutine(' + routine.id + ')" class="rg-btn-mini">Delete</button>' +
                            '</div>' +
                        '</div>';
                    }).join('');
                    container.innerHTML = '<div class="space-y-3">' + list + '</div>';
                    return true;
                },
                createGeneratorWorker() {
                    const workerScript = function() {
                        const shuffleArray = (arr) => {
                            for (let i = arr.length - 1; i > 0; i -= 1) {
                                const j = Math.floor(Math.random() * (i + 1));
                                const temp = arr[i];
                                arr[i] = arr[j];
                                arr[j] = temp;
                            }
                        };

                        const normalizeShiftList = (list) => {
                            if (!Array.isArray(list) || !list.length) return ['Full Day'];
                            const cleaned = list.map(item => String(item).trim()).filter(Boolean);
                            if (!cleaned.includes('Full Day')) cleaned.unshift('Full Day');
                            return Array.from(new Set(cleaned));
                        };

                        const normalizeSlotShifts = (slot, shiftList) => {
                            let shifts = [];
                            if (Array.isArray(slot.applicable_shifts)) {
                                shifts = slot.applicable_shifts.slice();
                            } else if (typeof slot.applicable_shifts === 'string') {
                                try { shifts = JSON.parse(slot.applicable_shifts); } catch (e) { shifts = []; }
                            }
                            if (!Array.isArray(shifts)) shifts = [];
                            if (!shifts.length || shifts.includes('all')) {
                                return shiftList.slice();
                            }
                            const filtered = shifts.filter(name => shiftList.includes(name));
                            const result = filtered.length ? filtered : shiftList.slice();
                            if (shiftList.includes('Full Day') && !result.includes('Full Day')) {
                                result.unshift('Full Day');
                            }
                            return result;
                        };

                        const buildSectionTargets = (section, classSubjects, groupSubjects, workingDays, slotsPerDay) => {
                            const subjectMap = {};
                            const addSubject = (subjectId, minCount, maxCount) => {
                                if (!subjectMap[subjectId]) {
                                    subjectMap[subjectId] = { min: 0, max: 0, fixed: true };
                                }
                                subjectMap[subjectId].min += Math.max(0, minCount || 0);
                                subjectMap[subjectId].max += Math.max(0, maxCount || 0);
                            };

                            classSubjects
                                .filter(cs => cs.class_id === section.class_id)
                                .forEach(cs => {
                                    if (cs.is_fixed) {
                                        addSubject(cs.subject_id, cs.classes_per_week, cs.classes_per_week);
                                    } else {
                                        addSubject(cs.subject_id, cs.min_classes, cs.max_classes);
                                    }
                                });

                            if (section.group_id) {
                                groupSubjects
                                    .filter(gs => gs.group_id === section.group_id)
                                    .forEach(gs => {
                                        if (gs.is_fixed) {
                                            addSubject(gs.subject_id, gs.classes_per_week, gs.classes_per_week);
                                        } else {
                                            addSubject(gs.subject_id, gs.min_classes, gs.max_classes);
                                        }
                                    });
                            }

                            const totalSlots = workingDays.length * slotsPerDay;
                            const subjectIds = Object.keys(subjectMap);
                            const targets = {};
                            let minSum = 0;
                            let maxSum = 0;

                            subjectIds.forEach(subjectId => {
                                const subject = subjectMap[subjectId];
                                const rawMin = subject.min;
                                const rawMax = Math.max(subject.max, rawMin);

                                subjectMap[subjectId].max = rawMax;
                                subjectMap[subjectId].min = rawMin;
                                subjectMap[subjectId].fixed = rawMin === rawMax;

                                targets[subjectId] = rawMin;
                                minSum += rawMin;
                                maxSum += rawMax;
                            });

                            if (minSum > totalSlots) {
                                return { error: 'Minimum required classes exceed available slots.' };
                            }

                            return { targets, totalSlots, subjectMap };
                        };

                        const pickAssignmentsForSection = (assignments, section, subjectId) => {
                            const relevant = assignments.filter(a => a.subject_id === subjectId && a.class_id === section.class_id);
                            const sectionLevel = relevant.filter(a => a.section_id === section.id);
                            if (sectionLevel.length) return sectionLevel;
                            if (section.group_id) {
                                const groupLevel = relevant.filter(a => a.group_id === section.group_id && !a.section_id);
                                if (groupLevel.length) return groupLevel;
                            }
                            const classLevel = relevant.filter(a => !a.group_id && !a.section_id);
                            return classLevel;
                        };

                        const buildTeacherPools = (section, subjectIds, teacherAssignments, teacherSubjects, allowAutoTeachers) => {
                            const pools = {};
                            subjectIds.forEach(subjectId => {
                                const assignments = pickAssignmentsForSection(teacherAssignments || [], section, subjectId);
                                const manualTeachers = assignments.filter(a => a.is_auto === 0 && a.teacher_id).map(a => a.teacher_id);
                                let pool = [];
                                if (manualTeachers.length) {
                                    pool = Array.from(new Set(manualTeachers));
                                } else if (allowAutoTeachers) {
                                    pool = (teacherSubjects || []).filter(ts => ts.subject_id === subjectId).map(ts => ts.teacher_id);
                                }
                                pools[subjectId] = Array.from(new Set(pool));
                            });
                            return pools;
                        };

                        const attemptSchedule = (sectionKeys, sectionData, workingDays, slotGrid, maxTeacherDaily, totalDays, slotsPerDay, options) => {
                            const sectionOrder = sectionKeys.slice();
                            if (options.randomize) shuffleArray(sectionOrder);

                            const entries = [];
                            const usedSubjectsByDay = {};
                            const remainingCounts = {};
                            const remainingTotals = {};

                            const teacherSchedule = {};
                            const teacherDailyCount = {};
                            const teacherWeeklyCount = {};
                            const teacherSubjectCount = {};

                            sectionOrder.forEach(key => {
                                const targets = sectionData[key].targets;
                                remainingCounts[key] = {};
                                let total = 0;
                                Object.keys(targets).forEach(subjectId => {
                                    const count = targets[subjectId] || 0;
                                    remainingCounts[key][subjectId] = count;
                                    total += count;
                                });
                                remainingTotals[key] = total;
                                usedSubjectsByDay[key] = {};
                                workingDays.forEach(day => {
                                    usedSubjectsByDay[key][day] = new Set();
                                });
                            });

                            const maxSteps = options.maxSteps || 400000;
                            let steps = 0;
                            let aborted = false;
                            const startTime = Date.now();
                            const timeBudgetMs = options.timeBudgetMs || 20000;

                            const checkFeasibility = (dayIndex, day, slotOrder, slotsRemainingAfter) => {
                                const futureDays = totalDays - dayIndex - 1;
                                const slotsRemainingAfterSlot = slotsPerDay - slotOrder - 1;
                                for (const key of sectionOrder) {
                                    if (remainingTotals[key] > slotsRemainingAfter) return false;
                                    const remainingMap = remainingCounts[key];
                                    const usedToday = usedSubjectsByDay[key][day];
                                    for (const subjectId in remainingMap) {
                                        const remaining = remainingMap[subjectId];
                                        if (remaining <= 0) continue;
                                        const availableToday = slotsRemainingAfterSlot > 0 && !usedToday.has(Number(subjectId));
                                        const daysLeft = futureDays + (availableToday ? 1 : 0);
                                        if (remaining > daysLeft) return false;
                                    }
                                }
                                return true;
                            };

                            const buildOptions = (sectionKey, day, dayIndex, slotIndex, slotOrder, slotsRemainingInSchedule) => {
                                const optionsList = [];
                                const remainingMap = remainingCounts[sectionKey];
                                const usedToday = usedSubjectsByDay[sectionKey][day];
                                const subjectIds = sectionData[sectionKey].subjectIds;
                                const pools = sectionData[sectionKey].teacherPools;
                                const remainingDaysAfter = totalDays - dayIndex - 1;
                                const mustFill = remainingTotals[sectionKey] >= slotsRemainingInSchedule;

                                subjectIds.forEach(subjectId => {
                                    const remaining = remainingMap[subjectId] || 0;
                                    if (remaining <= 0) return;
                                    if (usedToday.has(subjectId)) return;

                                    const pool = pools[subjectId] || [];
                                    const urgency = (remainingDaysAfter + 1) - remaining;

                                    if (!pool.length) {
                                        optionsList.push({
                                            subjectId,
                                            teacherId: null,
                                            isUnassigned: true,
                                            urgency,
                                            remaining,
                                            poolSize: 999,
                                            weekly: 999,
                                            daily: 999,
                                            subjectCount: 999,
                                            rand: Math.random()
                                        });
                                        return;
                                    }

                                    pool.forEach(teacherId => {
                                        if (teacherSchedule[teacherId] && teacherSchedule[teacherId][day] && teacherSchedule[teacherId][day][slotIndex]) return;
                                        if ((teacherDailyCount[teacherId] && teacherDailyCount[teacherId][day] || 0) >= maxTeacherDaily) return;

                                        const weekly = teacherWeeklyCount[teacherId] || 0;
                                        const daily = (teacherDailyCount[teacherId] && teacherDailyCount[teacherId][day]) || 0;
                                        const subjectCount = (teacherSubjectCount[teacherId] && teacherSubjectCount[teacherId][subjectId]) || 0;

                                        optionsList.push({
                                            subjectId,
                                            teacherId,
                                            urgency,
                                            remaining,
                                            poolSize: pool.length,
                                            weekly,
                                            daily,
                                            subjectCount,
                                            rand: Math.random()
                                        });
                                    });
                                });

                                if (!optionsList.length && !mustFill) {
                                    return [{ isEmpty: true }];
                                }

                                optionsList.sort((a, b) => {
                                    if (a.isEmpty) return 1;
                                    if (b.isEmpty) return -1;
                                    const aUnassigned = !!a.isUnassigned;
                                    const bUnassigned = !!b.isUnassigned;
                                    if (aUnassigned !== bUnassigned) return aUnassigned ? 1 : -1;
                                    if (a.urgency !== b.urgency) return a.urgency - b.urgency;
                                    if (a.remaining !== b.remaining) return b.remaining - a.remaining;
                                    if (a.poolSize !== b.poolSize) return a.poolSize - b.poolSize;
                                    if (a.weekly !== b.weekly) return a.weekly - b.weekly;
                                    if (a.daily !== b.daily) return a.daily - b.daily;
                                    if (a.subjectCount !== b.subjectCount) return a.subjectCount - b.subjectCount;
                                    return a.rand - b.rand;
                                });

                                return optionsList;
                            };

                            const assignSlot = (slotPos) => {
                                if (aborted) return false;
                                if (Date.now() - startTime > timeBudgetMs) {
                                    aborted = true;
                                    return false;
                                }
                                if (slotPos >= slotGrid.length) {
                                    return sectionOrder.every(key => remainingTotals[key] === 0);
                                }

                                const slotMeta = slotGrid[slotPos];
                                const day = slotMeta.day;
                                const dayIndex = slotMeta.dayIndex;
                                const slotIndex = slotMeta.slotIndex;
                                const slotOrder = slotMeta.slotOrder;
                                const slotsRemainingInSchedule = slotGrid.length - slotPos;
                                const slotsRemainingAfter = slotsRemainingInSchedule - 1;

                                const unassigned = new Set(sectionOrder);

                                const assignSection = () => {
                                    if (!unassigned.size) {
                                        if (!checkFeasibility(dayIndex, day, slotOrder, slotsRemainingAfter)) return false;
                                        return assignSlot(slotPos + 1);
                                    }

                                    let selectedKey = null;
                                    let selectedOptions = null;
                                    let selectedRemaining = -1;

                                    unassigned.forEach(key => {
                                        const optionsList = buildOptions(key, day, dayIndex, slotIndex, slotOrder, slotsRemainingInSchedule);
                                        const remaining = remainingTotals[key];
                                        if (!selectedOptions || optionsList.length < selectedOptions.length || (optionsList.length === selectedOptions.length && remaining > selectedRemaining)) {
                                            selectedKey = key;
                                            selectedOptions = optionsList;
                                            selectedRemaining = remaining;
                                        }
                                    });

                                    if (!selectedOptions || selectedOptions.length === 0) return false;

                                    for (const option of selectedOptions) {
                                        if (aborted) return false;
                                        if (Date.now() - startTime > timeBudgetMs) {
                                            aborted = true;
                                            return false;
                                        }
                                        steps += 1;
                                        if (steps > maxSteps) {
                                            aborted = true;
                                            return false;
                                        }

                                        let entryAdded = false;
                                        if (!option.isEmpty) {
                                            const section = sectionData[selectedKey].section;
                                            entries.push({
                                                day_of_week: day,
                                                slot_index: slotIndex,
                                                class_id: section.class_id,
                                                group_id: section.group_id,
                                                section_id: section.id,
                                                subject_id: option.subjectId,
                                                teacher_id: option.teacherId,
                                                is_conflict: 0,
                                                conflict_reason: null
                                            });
                                            entryAdded = true;

                                            remainingCounts[selectedKey][option.subjectId] -= 1;
                                            remainingTotals[selectedKey] -= 1;
                                            usedSubjectsByDay[selectedKey][day].add(option.subjectId);

                                            if (option.teacherId) {
                                                if (!teacherSchedule[option.teacherId]) teacherSchedule[option.teacherId] = {};
                                                if (!teacherSchedule[option.teacherId][day]) teacherSchedule[option.teacherId][day] = {};
                                                teacherSchedule[option.teacherId][day][slotIndex] = true;

                                                if (!teacherDailyCount[option.teacherId]) teacherDailyCount[option.teacherId] = {};
                                                teacherDailyCount[option.teacherId][day] = (teacherDailyCount[option.teacherId][day] || 0) + 1;
                                                teacherWeeklyCount[option.teacherId] = (teacherWeeklyCount[option.teacherId] || 0) + 1;

                                                if (!teacherSubjectCount[option.teacherId]) teacherSubjectCount[option.teacherId] = {};
                                                teacherSubjectCount[option.teacherId][option.subjectId] = (teacherSubjectCount[option.teacherId][option.subjectId] || 0) + 1;
                                            }
                                        }

                                        unassigned.delete(selectedKey);
                                        if (assignSection()) return true;
                                        unassigned.add(selectedKey);

                                        if (entryAdded) {
                                            entries.pop();
                                            remainingCounts[selectedKey][option.subjectId] += 1;
                                            remainingTotals[selectedKey] += 1;
                                            usedSubjectsByDay[selectedKey][day].delete(option.subjectId);

                                            if (option.teacherId) {
                                                if (teacherSchedule[option.teacherId] && teacherSchedule[option.teacherId][day]) {
                                                    delete teacherSchedule[option.teacherId][day][slotIndex];
                                                }
                                                teacherDailyCount[option.teacherId][day] -= 1;
                                                if (teacherDailyCount[option.teacherId][day] <= 0) {
                                                    delete teacherDailyCount[option.teacherId][day];
                                                }
                                                teacherWeeklyCount[option.teacherId] -= 1;
                                                if (teacherWeeklyCount[option.teacherId] <= 0) {
                                                    delete teacherWeeklyCount[option.teacherId];
                                                }
                                                teacherSubjectCount[option.teacherId][option.subjectId] -= 1;
                                                if (teacherSubjectCount[option.teacherId][option.subjectId] <= 0) {
                                                    delete teacherSubjectCount[option.teacherId][option.subjectId];
                                                }
                                            }
                                        }
                                    }

                                    return false;
                                };

                                return assignSection();
                            };

                            const success = assignSlot(0);
                            return { success, entries, aborted };
                        };


                        
                        const assignSubjectsToDays = (subjectIds, targets, workingDays, periodsPerDay) => {
                            const totalRequired = subjectIds.reduce((sum, id) => sum + (targets[id] || 0), 0);
                            const days = workingDays.length;

                            const nodeCount = 2 + subjectIds.length + days;
                            const source = 0;
                            const sink = nodeCount - 1;
                            const subjectOffset = 1;
                            const dayOffset = subjectOffset + subjectIds.length;

                            const graph = Array.from({ length: nodeCount }, () => []);

                            const addEdge = (u, v, cap) => {
                                graph[u].push({ v, cap, rev: graph[v].length });
                                graph[v].push({ v: u, cap: 0, rev: graph[u].length - 1 });
                            };

                            subjectIds.forEach((subjectId, idx) => {
                                addEdge(source, subjectOffset + idx, targets[subjectId] || 0);
                            });

                            subjectIds.forEach((_, sIdx) => {
                                for (let d = 0; d < days; d += 1) {
                                    addEdge(subjectOffset + sIdx, dayOffset + d, 1);
                                }
                            });

                            for (let d = 0; d < days; d += 1) {
                                addEdge(dayOffset + d, sink, periodsPerDay);
                            }

                            const level = new Array(nodeCount);
                            const bfs = () => {
                                level.fill(-1);
                                const queue = [];
                                level[source] = 0;
                                queue.push(source);
                                for (let i = 0; i < queue.length; i += 1) {
                                    const u = queue[i];
                                    for (const edge of graph[u]) {
                                        if (edge.cap > 0 && level[edge.v] < 0) {
                                            level[edge.v] = level[u] + 1;
                                            queue.push(edge.v);
                                        }
                                    }
                                }
                                return level[sink] >= 0;
                            };

                            const iters = new Array(nodeCount).fill(0);
                            const dfs = (u, f) => {
                                if (u === sink) return f;
                                for (; iters[u] < graph[u].length; iters[u] += 1) {
                                    const edge = graph[u][iters[u]];
                                    if (edge.cap <= 0 || level[edge.v] !== level[u] + 1) continue;
                                    const pushed = dfs(edge.v, Math.min(f, edge.cap));
                                    if (pushed > 0) {
                                        edge.cap -= pushed;
                                        graph[edge.v][edge.rev].cap += pushed;
                                        return pushed;
                                    }
                                }
                                return 0;
                            };

                            let flow = 0;
                            while (bfs()) {
                                iters.fill(0);
                                let pushed = dfs(source, Number.MAX_SAFE_INTEGER);
                                while (pushed > 0) {
                                    flow += pushed;
                                    pushed = dfs(source, Number.MAX_SAFE_INTEGER);
                                }
                            }

                            const dayAssignments = {};
                            workingDays.forEach(day => {
                                dayAssignments[day] = [];
                            });

                            subjectIds.forEach((subjectId, sIdx) => {
                                const node = subjectOffset + sIdx;
                                for (const edge of graph[node]) {
                                    if (edge.v >= dayOffset && edge.v < dayOffset + days) {
                                        const dayIdx = edge.v - dayOffset;
                                        const used = graph[edge.v][edge.rev].cap;
                                        if (used > 0) {
                                            for (let k = 0; k < used; k += 1) {
                                                dayAssignments[workingDays[dayIdx]].push(subjectId);
                                            }
                                        }
                                    }
                                }
                            });

                            return { flow, totalRequired, dayAssignments };
                        };

                        const assignTeachersToEntries = (entries, sectionData, workingDays, maxTeacherDaily, getSubjectLabel, getSectionLabel) => {
                            entries.forEach(entry => {
                                entry.teacher_id = null;
                                entry.conflict_reason = null;
                                entry.is_conflict = 0;
                            });
                            const teacherDailyCount = {};
                            const teacherWeeklyCount = {};
                            const teacherSubjectCount = {};

                            const entriesBySlot = {};
                            entries.forEach(entry => {
                                const slotKey = entry.day_of_week + '|' + entry.slot_index;
                                if (!entriesBySlot[slotKey]) entriesBySlot[slotKey] = [];
                                entriesBySlot[slotKey].push(entry);
                            });

                            const dayIndexMap = {};
                            workingDays.forEach((day, idx) => {
                                dayIndexMap[day] = idx;
                            });

                            const slotKeys = Object.keys(entriesBySlot).sort((a, b) => {
                                const partsA = a.split('|');
                                const partsB = b.split('|');
                                const dayDiff = (dayIndexMap[partsA[0]] || 0) - (dayIndexMap[partsB[0]] || 0);
                                if (dayDiff) return dayDiff;
                                return Number(partsA[1]) - Number(partsB[1]);
                            });

                            const getTeacherScore = (teacherId, day, subjectId) => {
                                const weekly = teacherWeeklyCount[teacherId] || 0;
                                const daily = (teacherDailyCount[teacherId] && teacherDailyCount[teacherId][day]) || 0;
                                const subjectCount = (teacherSubjectCount[teacherId] && teacherSubjectCount[teacherId][subjectId]) || 0;
                                return weekly * 10 + daily * 5 + subjectCount + Math.random();
                            };

                            let assignmentFailed = false;
                            let missingCount = 0;
                            const assignmentFailures = [];
                            let failureEntry = null;

                            slotKeys.forEach(slotKey => {
                                if (assignmentFailed) return;
                                const slotEntries = entriesBySlot[slotKey];
                                if (!slotEntries || !slotEntries.length) return;

                                const poolsByEntry = slotEntries.map(entry => {
                                    const sectionKey = entry.class_id + '-' + (entry.group_id || 0) + '-' + (entry.section_id || 0);
                                    const pool = sectionData[sectionKey]?.teacherPools?.[entry.subject_id] || [];
                                    return Array.from(new Set(pool));
                                });

                                const entryOrder = slotEntries.map((_, idx) => idx).sort((a, b) => {
                                    return poolsByEntry[a].length - poolsByEntry[b].length;
                                });

                                const assigned = new Array(slotEntries.length).fill(null);
                                const teacherMatch = {};

                                const tryAssign = (entryIndex, seen) => {
                                    const entry = slotEntries[entryIndex];
                                    const pool = poolsByEntry[entryIndex];
                                    if (!pool.length) return false;
                                    const orderedPool = pool.slice().sort((t1, t2) => {
                                        return getTeacherScore(t1, entry.day_of_week, entry.subject_id) - getTeacherScore(t2, entry.day_of_week, entry.subject_id);
                                    });
                                    for (const teacherId of orderedPool) {
                                        if (seen.has(teacherId)) continue;
                                        if ((teacherDailyCount[teacherId] && teacherDailyCount[teacherId][entry.day_of_week] || 0) >= maxTeacherDaily) continue;
                                        seen.add(teacherId);
                                        if (teacherMatch[teacherId] === undefined || tryAssign(teacherMatch[teacherId], seen)) {
                                            teacherMatch[teacherId] = entryIndex;
                                            assigned[entryIndex] = teacherId;
                                            return true;
                                        }
                                    }
                                    return false;
                                };

                                entryOrder.forEach(entryIndex => {
                                    tryAssign(entryIndex, new Set());
                                });

                                slotEntries.forEach((entry, entryIndex) => {
                                    const pool = poolsByEntry[entryIndex];
                                    const teacherId = assigned[entryIndex];
                                    if (!pool.length) {
                                        entry.conflict_reason = 'No qualified teacher';
                                        return;
                                    }
                                    if (!teacherId) {
                                        missingCount += 1;
                                        if (!failureEntry) {
                                            failureEntry = {
                                                class_id: entry.class_id,
                                                group_id: entry.group_id,
                                                section_id: entry.section_id,
                                                subject_id: entry.subject_id,
                                                day_of_week: entry.day_of_week,
                                                slot_index: entry.slot_index
                                            };
                                        }
                                        if (assignmentFailures.length < 3) {
                                            const sectionLabel = getSectionLabel({
                                                class_id: entry.class_id,
                                                group_id: entry.group_id,
                                                id: entry.section_id
                                            });
                                            assignmentFailures.push(getSubjectLabel(entry.subject_id) + ' in ' + sectionLabel + ' on ' + entry.day_of_week + ' slot ' + entry.slot_index);
                                        }
                                        assignmentFailed = true;
                                        return;
                                    }

                                    entry.teacher_id = teacherId;
                                    if (!teacherDailyCount[teacherId]) teacherDailyCount[teacherId] = {};
                                    teacherDailyCount[teacherId][entry.day_of_week] = (teacherDailyCount[teacherId][entry.day_of_week] || 0) + 1;
                                    teacherWeeklyCount[teacherId] = (teacherWeeklyCount[teacherId] || 0) + 1;

                                    if (!teacherSubjectCount[teacherId]) teacherSubjectCount[teacherId] = {};
                                    teacherSubjectCount[teacherId][entry.subject_id] = (teacherSubjectCount[teacherId][entry.subject_id] || 0) + 1;
                                });
                            });

                            if (assignmentFailed) {
                                const preview = assignmentFailures.join('; ');
                                const extra = missingCount > assignmentFailures.length ? ' ...' : '';
                                return {
                                    success: false,
                                    error: 'No available teacher for some slots (' + missingCount + '). Example: ' + preview + extra,
                                    failureEntry
                                };
                            }

                            return { success: true };
                        };

                        const attemptRepair = (entries, failureEntry, sectionData, workingDays, maxTeacherDaily, getSubjectLabel, getSectionLabel) => {
                            if (!failureEntry) return { success: false, attempts: 0 };
                            const sectionKey = failureEntry.class_id + '-' + (failureEntry.group_id || 0) + '-' + (failureEntry.section_id || 0);
                            const entryIndex = entries.findIndex(entry =>
                                entry.class_id === failureEntry.class_id &&
                                (entry.group_id || 0) === (failureEntry.group_id || 0) &&
                                (entry.section_id || 0) === (failureEntry.section_id || 0) &&
                                entry.subject_id === failureEntry.subject_id &&
                                entry.day_of_week === failureEntry.day_of_week &&
                                entry.slot_index === failureEntry.slot_index
                            );
                            if (entryIndex < 0) return { success: false, attempts: 0 };

                            const entry = entries[entryIndex];
                            const candidateIndexes = [];
                            entries.forEach((candidate, idx) => {
                                if (idx === entryIndex) return;
                                if (candidate.class_id !== entry.class_id) return;
                                if ((candidate.group_id || 0) !== (entry.group_id || 0)) return;
                                if ((candidate.section_id || 0) !== (entry.section_id || 0)) return;
                                if (candidate.subject_id === entry.subject_id) return;
                                candidateIndexes.push(idx);
                            });

                            shuffleArray(candidateIndexes);
                            const maxSwapAttempts = Math.min(40, candidateIndexes.length);
                            let attempts = 0;

                            const hasSubjectOnDay = (subjectId, day, excludeA, excludeB) => {
                                return entries.some(item => {
                                    if (item === excludeA || item === excludeB) return false;
                                    if (item.class_id !== entry.class_id) return false;
                                    if ((item.group_id || 0) !== (entry.group_id || 0)) return false;
                                    if ((item.section_id || 0) !== (entry.section_id || 0)) return false;
                                    return item.subject_id === subjectId && item.day_of_week === day;
                                });
                            };

                            for (let i = 0; i < maxSwapAttempts; i += 1) {
                                const candidate = entries[candidateIndexes[i]];
                                attempts += 1;

                                if (hasSubjectOnDay(entry.subject_id, candidate.day_of_week, entry, candidate)) continue;
                                if (hasSubjectOnDay(candidate.subject_id, entry.day_of_week, entry, candidate)) continue;

                                const originalEntryDay = entry.day_of_week;
                                const originalEntrySlot = entry.slot_index;
                                const originalCandidateDay = candidate.day_of_week;
                                const originalCandidateSlot = candidate.slot_index;

                                entry.day_of_week = originalCandidateDay;
                                entry.slot_index = originalCandidateSlot;
                                candidate.day_of_week = originalEntryDay;
                                candidate.slot_index = originalEntrySlot;

                                const assignmentResult = assignTeachersToEntries(entries, sectionData, workingDays, maxTeacherDaily, getSubjectLabel, getSectionLabel);
                                if (assignmentResult.success) {
                                    return { success: true, attempts };
                                }

                                entry.day_of_week = originalEntryDay;
                                entry.slot_index = originalEntrySlot;
                                candidate.day_of_week = originalCandidateDay;
                                candidate.slot_index = originalCandidateSlot;
                            }

                            return { success: false, attempts };
                        };

const generateGreedyPlan = (sectionKeys, sectionData, workingDays, classSlots) => {
                            const entries = [];
                            const maxTeacherDaily = classSlots.length;
                            const teacherSchedule = {};
                            const teacherDailyCount = {};
                            const teacherWeeklyCount = {};
                            const teacherSubjectCount = {};

                            const plans = sectionKeys.map(key => {
                                const data = sectionData[key];
                                const slotIndexes = (data.slotIndexes && data.slotIndexes.length)
                                    ? data.slotIndexes
                                    : classSlots.map(slot => slot.slot_index);
                                const remaining = {};
                                let remainingTotal = 0;
                                data.subjectIds.forEach(subjectId => {
                                    remaining[subjectId] = data.targets[subjectId] || 0;
                                    remainingTotal += remaining[subjectId];
                                });
                                const usedSubjectsByDay = {};
                                workingDays.forEach(day => {
                                    usedSubjectsByDay[day] = new Set();
                                });
                                return {
                                    key,
                                    section: data.section,
                                    subjectIds: data.subjectIds,
                                    teacherPools: data.teacherPools,
                                    remaining,
                                    remainingTotal,
                                    usedSubjectsByDay,
                                    slotIndexSet: new Set(slotIndexes)
                                };
                            });

                            const pickTeacherCandidateFast = (pool, day, slotIndex, subjectId) => {
                                let best = null;
                                for (const teacherId of pool) {
                                    if (teacherSchedule[teacherId] && teacherSchedule[teacherId][day] && teacherSchedule[teacherId][day][slotIndex]) continue;
                                    if ((teacherDailyCount[teacherId] && teacherDailyCount[teacherId][day] || 0) >= maxTeacherDaily) continue;
                                    const weekly = teacherWeeklyCount[teacherId] || 0;
                                    const daily = (teacherDailyCount[teacherId] && teacherDailyCount[teacherId][day]) || 0;
                                    const subjectCount = (teacherSubjectCount[teacherId] && teacherSubjectCount[teacherId][subjectId]) || 0;
                                    const score = weekly * 10 + daily * 5 + subjectCount;
                                    if (!best || score < best.score) {
                                        best = { teacherId, score };
                                    }
                                }
                                return best ? best.teacherId : null;
                            };

                            const chooseAssignmentForSlotFast = (plan, day, slotIndex) => {
                                const options = [];
                                plan.subjectIds.forEach(subjectId => {
                                    const remaining = plan.remaining[subjectId] || 0;
                                    if (remaining <= 0) return;
                                    if (plan.usedSubjectsByDay[day].has(subjectId)) return;
                                    const pool = plan.teacherPools[subjectId] || [];
                                    if (!pool.length) {
                                        options.push({ subjectId, teacherId: null, score: remaining * 10, unassigned: true });
                                        return;
                                    }
                                    const teacherId = pickTeacherCandidateFast(pool, day, slotIndex, subjectId);
                                    if (!teacherId) return;
                                    const score = remaining * 100 - pool.length * 10;
                                    options.push({ subjectId, teacherId, score, unassigned: false });
                                });

                                if (!options.length) return null;
                                options.sort((a, b) => {
                                    if (a.unassigned !== b.unassigned) return a.unassigned ? 1 : -1;
                                    return b.score - a.score;
                                });
                                return options[0];
                            };

                            workingDays.forEach(day => {
                                classSlots.forEach(slot => {
                                    const orderedPlans = plans.slice().sort((a, b) => b.remainingTotal - a.remainingTotal);
                                    orderedPlans.forEach(plan => {
                                        if (plan.remainingTotal <= 0) return;
                                        if (!plan.slotIndexSet.has(slot.slot_index)) return;
                                        const assignment = chooseAssignmentForSlotFast(plan, day, slot.slot_index);
                                        if (!assignment) return;

                                        entries.push({
                                            day_of_week: day,
                                            slot_index: slot.slot_index,
                                            class_id: plan.section.class_id,
                                            group_id: plan.section.group_id,
                                            section_id: plan.section.id,
                                            subject_id: assignment.subjectId,
                                            teacher_id: assignment.teacherId,
                                            is_conflict: 0,
                                            conflict_reason: null
                                        });

                                        plan.remaining[assignment.subjectId] -= 1;
                                        plan.remainingTotal -= 1;
                                        plan.usedSubjectsByDay[day].add(assignment.subjectId);

                                        if (assignment.teacherId) {
                                            if (!teacherSchedule[assignment.teacherId]) teacherSchedule[assignment.teacherId] = {};
                                            if (!teacherSchedule[assignment.teacherId][day]) teacherSchedule[assignment.teacherId][day] = {};
                                            teacherSchedule[assignment.teacherId][day][slot.slot_index] = true;

                                            if (!teacherDailyCount[assignment.teacherId]) teacherDailyCount[assignment.teacherId] = {};
                                            teacherDailyCount[assignment.teacherId][day] = (teacherDailyCount[assignment.teacherId][day] || 0) + 1;
                                            teacherWeeklyCount[assignment.teacherId] = (teacherWeeklyCount[assignment.teacherId] || 0) + 1;

                                            if (!teacherSubjectCount[assignment.teacherId]) teacherSubjectCount[assignment.teacherId] = {};
                                            teacherSubjectCount[assignment.teacherId][assignment.subjectId] = (teacherSubjectCount[assignment.teacherId][assignment.subjectId] || 0) + 1;
                                        }
                                    });
                                });
                            });

                            let missing = 0;
                            const missingDetails = [];
                            plans.forEach(plan => {
                                plan.subjectIds.forEach(subjectId => {
                                    const remaining = plan.remaining[subjectId] || 0;
                                    if (remaining > 0) {
                                        missing += remaining;
                                        missingDetails.push({ section: plan.section, subjectId, missing: remaining });
                                    }
                                });
                            });

                            return { entries, missing, missingDetails };
                        };

                        self.onmessage = function(event) {
                            const data = event.data || {};
                            if (data.type !== 'start') return;

                            try {
                                const payload = data.payload || {};
                                const sections = payload.sections || [];
                                if (!sections.length) {
                                    self.postMessage({ type: 'error', error: 'No sections configured. Add sections before generating routines.' });
                                    return;
                                }

                                const subjectNameMap = {};
                                (payload.subjects || []).forEach(subject => {
                                    subjectNameMap[subject.id] = subject.subject_name || ('Subject ' + subject.id);
                                });
                                const classNameMap = {};
                                (payload.classes || []).forEach(cls => {
                                    classNameMap[cls.id] = cls.class_name || ('Class ' + cls.id);
                                });
                                const groupNameMap = {};
                                (payload.groups || []).forEach(group => {
                                    groupNameMap[group.id] = group.group_name || ('Group ' + group.id);
                                });
                                const sectionNameMap = {};
                                sections.forEach(section => {
                                    sectionNameMap[section.id] = section.section_name || 'Main';
                                });

                                const getSubjectLabel = (subjectId) => {
                                    return subjectNameMap[subjectId] || ('Subject ' + subjectId);
                                };

                                const getSectionLabel = (section) => {
                                    const className = classNameMap[section.class_id] || ('Class ' + section.class_id);
                                    const groupName = section.group_id ? (groupNameMap[section.group_id] || ('Group ' + section.group_id)) : '';
                                    const sectionName = section.id ? (sectionNameMap[section.id] || ('Section ' + section.id)) : 'Main';
                                    let label = className;
                                    if (groupName) label += ' - ' + groupName;
                                    if (sectionName) label += ' - ' + sectionName;
                                    return label;
                                };

                                const workingDays = payload.workingDays || [];
                                const shifts = normalizeShiftList(payload.shifts || []);
                                const rawClassSlots = payload.classSlots || [];
                                const classSlots = rawClassSlots.map(slot => ({
                                    ...slot,
                                    applicable_shifts: normalizeSlotShifts(slot, shifts)
                                }));
                                const allSlotIndexes = classSlots.map(slot => slot.slot_index).sort((a, b) => a - b);
                                const slotIndexesByShift = {};
                                shifts.forEach(shift => { slotIndexesByShift[shift] = []; });
                                classSlots.forEach(slot => {
                                    const applicable = Array.isArray(slot.applicable_shifts) && slot.applicable_shifts.length
                                        ? slot.applicable_shifts
                                        : shifts;
                                    shifts.forEach(shift => {
                                        if (applicable.includes(shift)) slotIndexesByShift[shift].push(slot.slot_index);
                                    });
                                });
                                Object.keys(slotIndexesByShift).forEach(shift => {
                                    const unique = Array.from(new Set(slotIndexesByShift[shift]));
                                    slotIndexesByShift[shift] = unique.sort((a, b) => a - b);
                                });
                                const classShiftMap = {};
                                (payload.classes || []).forEach(cls => {
                                    classShiftMap[cls.id] = cls.shift_name || 'Full Day';
                                });
                                const allowAutoTeachers = true;

                                const sectionKeys = [];
                                const sectionData = {};
                                let totalRequired = 0;
                                let validationError = null;

                                for (const section of sections) {
                                    const sectionKey = section.class_id + '-' + (section.group_id || 0) + '-' + (section.id || 0);
                                    const rawShiftName = classShiftMap[section.class_id] || 'Full Day';
                                    const shiftName = shifts.includes(rawShiftName) ? rawShiftName : 'Full Day';
                                    let slotIndexes = slotIndexesByShift[shiftName] || [];
                                    if (!slotIndexes.length && !shifts.includes(rawShiftName)) {
                                        slotIndexes = allSlotIndexes.slice();
                                    }
                                    const slotsPerDay = slotIndexes.length;
                                    const targetData = buildSectionTargets(section, payload.classSubjects || [], payload.groupSubjects || [], workingDays, slotsPerDay);
                                    if (targetData.error) {
                                        validationError = targetData.error;
                                        break;
                                    }
                                    const targets = targetData.targets;
                                    const subjectIds = Object.keys(targets).map(id => Number(id));
                                    const teacherPools = buildTeacherPools(
                                        section,
                                        subjectIds,
                                        payload.teacherAssignments || [],
                                        payload.teacherSubjects || [],
                                        allowAutoTeachers
                                    );

                                    subjectIds.forEach(subjectId => {
                                        if (targets[subjectId] > 0 && (!teacherPools[subjectId] || teacherPools[subjectId].length === 0)) {
                                            // Allow unassigned teacher slots when no qualified teacher exists.
                                        }
                                    });

                                    const sectionTotal = subjectIds.reduce((sum, id) => sum + (targets[id] || 0), 0);
                                    totalRequired += sectionTotal;

                                    sectionKeys.push(sectionKey);
                                    sectionData[sectionKey] = {
                                        section,
                                        targets,
                                        subjectIds,
                                        teacherPools,
                                        slotIndexes,
                                        slotsPerDay
                                    };
                                }

                                if (validationError) {
                                    self.postMessage({ type: 'error', error: validationError });
                                    return;
                                }

                                const periodsPerDay = allSlotIndexes.length;
                                const feasibilityErrors = [];

                                sectionKeys.forEach(key => {
                                    const data = sectionData[key];
                                    const subjectIds = data.subjectIds;
                                    const targets = data.targets;
                                    const totalRequired = subjectIds.reduce((sum, id) => sum + (targets[id] || 0), 0);
                                    const slotsPerDay = data.slotsPerDay || 0;
                                    const capacity = workingDays.length * slotsPerDay;
                                    if (slotsPerDay === 0 && totalRequired > 0) {
                                        const sectionLabel = getSectionLabel(data.section);
                                        feasibilityErrors.push('No periods assigned to shift for ' + sectionLabel + '.');
                                        return;
                                    }

                                    subjectIds.forEach(subjectId => {
                                        const required = targets[subjectId] || 0;
                                        if (required > workingDays.length) {
                                            const subjectLabel = getSubjectLabel(subjectId);
                                            const sectionLabel = getSectionLabel(data.section);
                                            feasibilityErrors.push(subjectLabel + ' requires ' + required + ' but only ' + workingDays.length + ' day(s) in ' + sectionLabel + '.');
                                        }
                                    });

                                    if (totalRequired > capacity) {
                                        const sectionLabel = getSectionLabel(data.section);
                                        feasibilityErrors.push('Total required periods ' + totalRequired + ' exceed capacity ' + capacity + ' in ' + sectionLabel + '.');
                                    }
                                });

                                if (feasibilityErrors.length) {
                                    const preview = feasibilityErrors.slice(0, 3).join(' ');
                                    const extra = feasibilityErrors.length > 3 ? ' ...' : '';
                                    self.postMessage({
                                        type: 'error',
                                        error: 'Constraints impossible. ' + preview + extra
                                    });
                                    return;
                                }

                                const maxAttempts = Math.max(1, Number(payload.attempts) || 6);
                                const timeBudgetMs = Math.max(1000, Number(payload.timeBudgetMs) || 20000);
                                const maxTeacherDaily = Math.max(1, Math.min(Number(payload.maxTeacherDaily) || periodsPerDay, periodsPerDay));
                                const startTime = Date.now();
                                let finalEntries = null;
                                let lastError = null;
                                let attemptsTried = 0;
                                let repairAttempts = 0;

                                for (let attempt = 0; attempt < maxAttempts && (Date.now() - startTime) < timeBudgetMs; attempt += 1) {
                                    attemptsTried += 1;
                                    const sectionAssignments = {};
                                    let flowError = null;

                                    sectionKeys.forEach(key => {
                                        if (flowError) return;
                                        const data = sectionData[key];
                                        const subjectIds = data.subjectIds;
                                        const targets = data.targets;
                                        const shuffledDays = workingDays.slice();
                                        shuffleArray(shuffledDays);
                                        const flowResult = assignSubjectsToDays(subjectIds, targets, shuffledDays, data.slotsPerDay || 0);
                                        if (flowResult.flow !== flowResult.totalRequired) {
                                            const sectionLabel = getSectionLabel(data.section);
                                            flowError = 'Unable to place all subjects across days for ' + sectionLabel + '.';
                                            return;
                                        }
                                        sectionAssignments[key] = flowResult.dayAssignments;
                                    });

                                    if (flowError) {
                                        lastError = flowError;
                                        continue;
                                    }

                                    const entries = [];
                                    sectionKeys.forEach(key => {
                                        const data = sectionData[key];
                                        const dayAssignments = sectionAssignments[key] || {};
                                        workingDays.forEach(day => {
                                            const subjectsForDay = dayAssignments[day] ? dayAssignments[day].slice() : [];
                                            shuffleArray(subjectsForDay);
                                            const daySlots = (data.slotIndexes || []).slice();
                                            shuffleArray(daySlots);
                                            for (let i = 0; i < subjectsForDay.length && i < daySlots.length; i += 1) {
                                                entries.push({
                                                    day_of_week: day,
                                                    slot_index: daySlots[i],
                                                    class_id: data.section.class_id,
                                                    group_id: data.section.group_id,
                                                    section_id: data.section.id,
                                                    subject_id: subjectsForDay[i],
                                                    teacher_id: null,
                                                    is_conflict: 0,
                                                    conflict_reason: null
                                                });
                                            }
                                        });
                                    });

                                    const assignmentResult = assignTeachersToEntries(entries, sectionData, workingDays, maxTeacherDaily, getSubjectLabel, getSectionLabel);
                                    if (!assignmentResult.success) {
                                        const repairResult = attemptRepair(entries, assignmentResult.failureEntry, sectionData, workingDays, maxTeacherDaily, getSubjectLabel, getSectionLabel);
                                        repairAttempts += repairResult.attempts || 0;
                                        if (!repairResult.success) {
                                            lastError = assignmentResult.error;
                                            continue;
                                        }
                                    }

                                    finalEntries = entries;
                                    break;
                                }

                                if (!finalEntries) {
                                    const elapsed = Math.round((Date.now() - startTime) / 1000);
                                    self.postMessage({
                                        type: 'error',
                                        error: (lastError || 'Generation failed. Try adjusting teacher assignments or subject counts.')
                                            + ' Tried ' + attemptsTried + ' attempt(s), ' + repairAttempts + ' repair swap(s) in ' + elapsed + 's.'
                                    });
                                    return;
                                }

                                self.postMessage({
                                    type: 'result',
                                    result: {
                                        success: true,
                                        entries: finalEntries,
                                        totalPeriods: finalEntries.length
                                    }
                                });
                            } catch (error) {
                                self.postMessage({ type: 'error', error: error.message || 'Generation failed.' });
                            }
                        };
                    };

                    const blob = new Blob(['(' + workerScript.toString() + ')()'], { type: 'application/javascript' });
                    return new Worker(URL.createObjectURL(blob));
                },
                async generateRoutine() {
                    const button = event.target;
                    const originalText = button.innerHTML;

                    try {
                        button.innerHTML = '<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> Preparing data...';
                        button.disabled = true;

                        const dataResponse = await fetch('/school/api/routine-generation-data');
                        const dataResult = await dataResponse.json();
                        if (!dataResult.success) {
                            this.showNotification(dataResult.error || 'Failed to load generation data', 'error');
                            return;
                        }

                        button.innerHTML = '<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> Generating on device...';

                        const worker = this.createGeneratorWorker();

                        const resultPromise = new Promise((resolve, reject) => {
                            worker.onmessage = (msg) => {
                                const payload = msg.data || {};
                                if (payload.type === 'result') {
                                    resolve(payload.result);
                                } else if (payload.type === 'error') {
                                    reject(new Error(payload.error || 'Generation failed.'));
                                }
                            };
                            worker.onerror = (err) => {
                                reject(new Error(err.message || 'Worker failed.'));
                            };
                        });

                        const maxTeacherDailyInput = document.getElementById('max-periods');
                        const maxTeacherDaily = maxTeacherDailyInput ? parseInt(maxTeacherDailyInput.value, 10) : null;

                        const workingDaysCount = (dataResult.data.workingDays || []).length || 5;
                        const periodCount = (dataResult.data.classSlots || []).length || 0;
                        const sectionCount = (dataResult.data.sections || []).length || (dataResult.data.classes || []).length || 1;
                        const loadFactor = Math.max(1, sectionCount * Math.max(1, workingDaysCount) * Math.max(1, periodCount));
                        const attempts = Math.min(200, Math.max(30, Math.ceil(loadFactor / 10)));
                        const timeBudgetMs = Math.min(300000, Math.max(45000, loadFactor * 120));

                        worker.postMessage({
                            type: 'start',
                            payload: {
                                ...dataResult.data,
                                maxTeacherDaily,
                                attempts,
                                timeBudgetMs
                            }
                        });

                        const routineResult = await resultPromise;
                        worker.terminate();

                        button.innerHTML = '<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> Saving...';

                        const saveResponse = await fetch('/school/api/routine/save-generated', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                name: 'Generated Routine ' + new Date().toLocaleDateString(),
                                entries: routineResult.entries
                            })
                        });

                        const saveResult = await saveResponse.json();
                        if (saveResult.success) {
                            this.showNotification('Routine generated successfully!', 'success');
                            const routineId = saveResult.routineId;
                            if (routineId) {
                                const newRoutine = {
                                    id: routineId,
                                    name: 'Generated Routine ' + new Date().toLocaleDateString(),
                                    version: 1,
                                    is_active: 0,
                                    generated_at: new Date().toISOString(),
                                    total_periods: routineResult.entries ? routineResult.entries.length : 0,
                                    conflicts_resolved: 0
                                };
                                if (!window.routineAppData) window.routineAppData = { routines: [] };
                                if (!Array.isArray(window.routineAppData.routines)) window.routineAppData.routines = [];
                                window.routineAppData.routines.unshift(newRoutine);
                                this.renderRoutineList();
                            }
                        } else {
                            this.showNotification(saveResult.error || 'Failed to save routine', 'error');
                        }
                    } catch (error) {
                        console.error('Generation error:', error);
                        this.showNotification(error.message || 'An error occurred while generating routine', 'error');
                    } finally {
                        button.innerHTML = originalText;
                        button.disabled = false;
                    }
                },

                viewRoutine(routineId) {
                    window.location.href = \`/school/routine-viewer?id=\${routineId}\`;
                },
                
                async editRoutine(routineId) {
                    this.viewRoutine(routineId);
                },
                
                async activateRoutine(routineId) {
                    const routineIdNum = Number(routineId);
                    try {
                        const response = await fetch(\`/school/api/routine/\${routineId}/activate\`, {
                            method: 'POST'
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            this.showNotification('Routine activated successfully!', 'success');
                            if (window.routineAppData && Array.isArray(window.routineAppData.routines)) {
                                window.routineAppData.routines.forEach(r => { r.is_active = 0; });
                                const target = window.routineAppData.routines.find(r => Number(r.id) === routineIdNum);
                                if (target) target.is_active = 1;
                                this.renderRoutineList();
                            }
                        } else {
                            this.showNotification(result.error || 'Failed to activate routine', 'error');
                        }
                    } catch (error) {
                        console.error('Activation error:', error);
                        this.showNotification('An error occurred while activating routine', 'error');
                    }
                },
                
                async deleteRoutine(routineId) {
                    if (!confirm('Are you sure you want to delete this routine? This action cannot be undone.')) {
                        return;
                    }
                    const routineIdNum = Number(routineId);
                    
                    try {
                        const response = await fetch(\`/school/api/routine/\${routineId}\`, {
                            method: 'DELETE'
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            this.showNotification('Routine deleted successfully!', 'success');
                            if (window.routineAppData && Array.isArray(window.routineAppData.routines)) {
                                window.routineAppData.routines = window.routineAppData.routines.filter(r => Number(r.id) !== routineIdNum);
                                this.renderRoutineList();
                            }
                        } else {
                            this.showNotification(result.error || 'Failed to delete routine', 'error');
                        }
                    } catch (error) {
                        console.error('Deletion error:', error);
                        this.showNotification('An error occurred while deleting routine', 'error');
                    }
                },
                
                showSettings() {
                    document.getElementById('settings-modal').classList.remove('hidden');
                    document.getElementById('settings-modal').classList.add('flex');
                },
                
                closeSettings() {
                    document.getElementById('settings-modal').classList.add('hidden');
                    document.getElementById('settings-modal').classList.remove('flex');
                },
                
                async saveSettings() {
                    try {
                        const settings = {
                            prefer_same_teacher_consecutive: document.getElementById('prefer-consecutive').checked,
                            avoid_teacher_duplicates: document.getElementById('avoid-duplicates').checked,
                            balance_subject_distribution: document.getElementById('balance-distribution').checked,
                            respect_preferred_times: document.getElementById('respect-preferences').checked,
                            auto_resolve_conflicts: document.getElementById('auto-resolve').checked,
                            allow_split_periods: document.getElementById('allow-split').checked,
                            max_teacher_daily_periods: parseInt(document.getElementById('max-periods').value),
                            break_between_same_subject: parseInt(document.getElementById('subject-break').value)
                        };
                        
                        this.showNotification('Settings saved successfully!', 'success');
                        this.closeSettings();
                    } catch (error) {
                        console.error('Settings save error:', error);
                        this.showNotification('An error occurred while saving settings', 'error');
                    }
                },
                
                showNotification(message, type = 'info') {
                    const notification = document.createElement('div');
                    notification.className = 'fixed top-4 right-4 z-50 p-4 border border-gray-300 transform transition-all duration-300 opacity-0 translate-y-2';
                    
                    if (type === 'success') {
                        notification.classList.add('bg-green-500', 'text-white');
                    } else if (type === 'error') {
                        notification.classList.add('bg-red-500', 'text-white');
                    } else {
                        notification.classList.add('bg-blue-500', 'text-white');
                    }
                    
                    notification.innerHTML = '<div class="flex items-center">' +
                        '<span>' + message + '</span>' +
                        '<button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">' +
                            '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
                                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>' +
                            '</svg>' +
                        '</button>' +
                    '</div>';
                    
                    document.body.appendChild(notification);
                    
                    setTimeout(() => {
                        notification.classList.remove('opacity-0', 'translate-y-2');
                        notification.classList.add('opacity-100', 'translate-y-0');
                    }, 100);
                    
                    setTimeout(() => {
                        notification.classList.remove('opacity-100', 'translate-y-0');
                        notification.classList.add('opacity-0', 'translate-y-2');
                        setTimeout(() => {
                            if (notification.parentElement) {
                                notification.remove();
                            }
                        }, 300);
                    }, 5000);
                }
            };
        };

        // Initialize app when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            if (window.location.pathname === '/school/routine-generator') {
                window.app = new RoutineGeneratorApp();
            }
        });
      </script>
    `;
}

export function SchedulesPageHTML(config = null, existingSlots = [], shiftConfig = null) {
    // Sort slots by start time
    existingSlots.sort((a, b) => a.start_time.localeCompare(b.start_time));
    const initialSchoolStart = existingSlots.length > 0 ? existingSlots[0].start_time : (config?.start_time || "08:00");
    const shiftsEnabled = !!(shiftConfig && shiftConfig.enabled);
    const shifts = (shiftConfig && Array.isArray(shiftConfig.shifts) && shiftConfig.shifts.length)
        ? shiftConfig.shifts
        : ['Full Day'];
    const showShiftControls = shiftsEnabled && shifts.length > 1;
    const escapeHtml = (value) => String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    return `
      <div class="max-w-6xl xl:max-w-7xl mx-auto pb-20 md:pb-16 min-h-[70vh] select-none" id="schedule-app">
          <div class="bg-white sticky top-0 z-30 border-b border-gray-200">
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-4 py-2 md:px-5 md:py-2">
                  <div>
                    <h2 class="text-sm md:text-lg font-semibold text-gray-900">Schedules</h2>
                    <p class="text-[11px] md:text-xs text-gray-500 mt-0.5">Configure your school's daily schedule</p>
                  </div>
                  <div class="flex flex-col sm:flex-row gap-2 md:gap-3">
                       <button id="reset-btn" onclick="app.reset()" class="w-full sm:w-auto text-gray-600 bg-white px-3 py-1.5 text-xs font-semibold border border-gray-300 rounded-none">Reset</button>
                  </div>
              </div>
          </div>

          <div class="mx-4 md:mx-8 mt-3 md:mt-3 p-3 md:p-3 bg-white border border-gray-200">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div class="flex items-center gap-4">
                      <span class="text-[11px] md:text-xs font-semibold text-gray-700 uppercase tracking-wide">Day Starts At</span>
                      <input type="time" id="school_start_time" value="${initialSchoolStart}" onchange="app.updateStartTime(this.value)" 
                             class="bg-white border border-gray-300 text-gray-900 text-xs font-semibold rounded-none px-2 py-1.5 outline-none w-28 md:w-32 text-center focus:ring-2 focus:ring-gray-300">
                  </div>
                  <div class="flex-1">
                      <div class="text-[11px] md:text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Working Days</div>
                      <div class="grid grid-cols-4 sm:grid-cols-7 border border-gray-200 divide-x divide-gray-200" id="weekday-selector">
                          <label class="flex flex-col items-center justify-center gap-1 cursor-pointer py-1.5">
                              <input type="checkbox" name="weekday" value="monday" class="w-4 h-4 text-gray-900">
                              <span class="text-[10px] font-medium text-gray-700">Mon</span>
                          </label>
                          <label class="flex flex-col items-center justify-center gap-1 cursor-pointer py-1.5">
                              <input type="checkbox" name="weekday" value="tuesday" class="w-4 h-4 text-gray-900">
                              <span class="text-[10px] font-medium text-gray-700">Tue</span>
                          </label>
                          <label class="flex flex-col items-center justify-center gap-1 cursor-pointer py-1.5">
                              <input type="checkbox" name="weekday" value="wednesday" class="w-4 h-4 text-gray-900">
                              <span class="text-[10px] font-medium text-gray-700">Wed</span>
                          </label>
                          <label class="flex flex-col items-center justify-center gap-1 cursor-pointer py-1.5">
                              <input type="checkbox" name="weekday" value="thursday" class="w-4 h-4 text-gray-900">
                              <span class="text-[10px] font-medium text-gray-700">Thu</span>
                          </label>
                          <label class="flex flex-col items-center justify-center gap-1 cursor-pointer py-1.5">
                              <input type="checkbox" name="weekday" value="friday" class="w-4 h-4 text-gray-900">
                              <span class="text-[10px] font-medium text-gray-700">Fri</span>
                          </label>
                          <label class="flex flex-col items-center justify-center gap-1 cursor-pointer py-1.5">
                              <input type="checkbox" name="weekday" value="saturday" class="w-4 h-4 text-gray-900">
                              <span class="text-[10px] font-medium text-gray-700">Sat</span>
                          </label>
                          <label class="flex flex-col items-center justify-center gap-1 cursor-pointer py-1.5">
                              <input type="checkbox" name="weekday" value="sunday" class="w-4 h-4 text-gray-900">
                              <span class="text-[10px] font-medium text-gray-700">Sun</span>
                          </label>
                      </div>
                      <div class="mt-1.5 text-[10px] text-gray-500">
                        <span id="working-days-count">5</span> working days selected
                      </div>
                  </div>
              </div>
          </div>

          ${shiftsEnabled ? `
          <div class="mx-4 md:mx-8 mt-3 md:mt-3 p-3 md:p-3 bg-white border border-gray-200">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                      <div class="text-[11px] md:text-xs font-semibold text-gray-700 uppercase tracking-wide">Shifts</div>
                      <div class="flex flex-wrap gap-2 mt-1" id="shift-tabs">
                          ${shifts.map((shift, index) => `
                              <button type="button" data-shift="${escapeHtml(shift)}" onclick='app.setActiveShift(${JSON.stringify(shift)})'
                                  class="px-2 py-1 text-[11px] font-semibold border border-gray-300 ${index === 0 ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}">
                                  ${escapeHtml(shift)}
                              </button>
                          `).join('')}
                      </div>
                  </div>
                  <div class="text-[10px] text-gray-500 sm:text-right">
                      Select which periods belong to the active shift.
                  </div>
              </div>
          </div>
          ` : ''}

          <div class="mt-3 md:mt-3 bg-white border border-gray-200 md:mx-8 overflow-hidden">
              
              <div class="hidden lg:grid grid-cols-12 gap-0 bg-gray-50 text-[10px] uppercase font-semibold text-gray-500 border-b border-gray-200 divide-x divide-gray-200">
                  <div class="col-span-1 text-center py-2">#</div>
                  <div class="col-span-2 py-2 pl-2">Start</div>
                  <div class="col-span-2 py-2 pl-2">End</div>
                  <div class="col-span-1 py-2 text-center">Mins</div>
                  <div class="col-span-${showShiftControls ? '3' : '4'} py-2 pl-2">Period</div>
                  <div class="col-span-1 py-2 pl-2">Type</div>
                  ${showShiftControls ? `<div class="col-span-1 py-2 text-center">Shift</div>` : ''}
                  <div class="col-span-1 py-2"></div>
              </div>

              <div id="slot-container" class="divide-y divide-gray-200"></div>

              <button id="add-btn" onclick="app.addPeriod()" class="w-full py-2 text-center text-gray-700 font-semibold text-xs border-t border-gray-200">
                  + Add Next Period
              </button>
          </div>
      </div>

      <div id="tutorial-popup" class="fixed inset-0 bg-black/50 z-[9999] hidden flex items-center justify-center px-4 backdrop-blur-sm">
          <div class="bg-white rounded-none border border-gray-300 w-full max-w-xs p-4 transform transition-all scale-100">
              <h3 class="text-xs font-bold text-gray-900 mb-2">Warning: Cannot Change Start Time</h3>
              <p class="text-[11px] text-gray-600 mb-3 leading-relaxed">
                  This period starts automatically when the previous one ends.<br>
                  To change this time, adjust the <b>Duration</b> or <b>End Time</b> of the <u>previous period</u>.
              </p>
              <button onclick="document.getElementById('tutorial-popup').classList.add('hidden')" class="w-full bg-gray-900 text-white py-1.5 rounded-none text-xs font-bold">Okay, Got it</button>
          </div>
      </div>
      <div id="schedule-toast" class="fixed bottom-4 right-4 z-[10000] hidden bg-gray-900 text-white text-xs font-semibold px-3 py-2">Saved</div>

      <script>
        const AppState = {
            slots: ${JSON.stringify(existingSlots)},
            startTime: ${JSON.stringify(initialSchoolStart)},
            workingDays: ${config?.working_days ? JSON.stringify(config.working_days) : '["monday","tuesday","wednesday","thursday","friday"]'},
            shiftsEnabled: ${shiftsEnabled ? 'true' : 'false'},
            shifts: ${JSON.stringify(shifts)},
            activeShift: ${JSON.stringify(shifts[0] || 'Full Day')},
            showShiftControls: ${showShiftControls ? 'true' : 'false'}
        };
        let toastTimer = null;
        let autoSaveTimer = null;

        // --- HELPER FUNCTIONS ---
        const Time = {
            add: (time, mins) => {
                if(!time) return "00:00";
                let [h, m] = time.split(':').map(Number);
                let date = new Date(2000, 0, 1, h, m);
                date.setMinutes(date.getMinutes() + (parseInt(mins) || 0));
                return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
            },
            diff: (start, end) => {
                let [h1, m1] = start.split(':').map(Number);
                let [h2, m2] = end.split(':').map(Number);
                return Math.round((new Date(2000, 0, 1, h2, m2) - new Date(2000, 0, 1, h1, m1)) / 60000);
            }
        };

        const app = {
            ordinal: function(number) {
                const num = Number(number);
                const mod100 = num % 100;
                if (mod100 >= 11 && mod100 <= 13) return num + 'th';
                const mod10 = num % 10;
                if (mod10 === 1) return num + 'st';
                if (mod10 === 2) return num + 'nd';
                if (mod10 === 3) return num + 'rd';
                return num + 'th';
            },

            updateAutoLabels: function() {
                let count = 0;
                AppState.slots.forEach(slot => {
                    if (slot.type === 'break') {
                        slot.label = 'Break';
                        slot.period_index = null;
                        return;
                    }
                    count += 1;
                    slot.label = this.ordinal(count);
                    slot.period_index = count;
                });
            },
            init: function() {
                if(AppState.slots.length === 0) this.addPeriod(false);
                this.normalizeShiftApplicability();
                this.recalculateChain(); 
                this.render();
                // Set working days checkboxes
                this.setWorkingDaysCheckboxes();
                this.updateWorkingDaysCount();
                this.updateShiftTabs();
            },
            showToast: function(message) {
                const toast = document.getElementById('schedule-toast');
                if (!toast) return;
                toast.textContent = message;
                toast.classList.remove('hidden');
                if (toastTimer) clearTimeout(toastTimer);
                toastTimer = setTimeout(() => {
                    toast.classList.add('hidden');
                }, 2200);
            },

            setWorkingDaysCheckboxes: function() {
                const checkboxes = document.querySelectorAll('input[name="weekday"]');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = AppState.workingDays.includes(checkbox.value);
                });
                
                // Add event listeners
                checkboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', () => {
                        this.updateWorkingDays();
                        this.updateWorkingDaysCount();
                    });
                });
            },

            updateWorkingDays: function() {
                const checkboxes = document.querySelectorAll('input[name="weekday"]:checked');
                AppState.workingDays = Array.from(checkboxes).map(cb => cb.value);
            },

            updateWorkingDaysCount: function() {
                const count = document.querySelectorAll('input[name="weekday"]:checked').length;
                document.getElementById('working-days-count').textContent = count;
                this.scheduleAutoSave();
            },

            normalizeShiftApplicability: function() {
                if (!AppState.shiftsEnabled || !Array.isArray(AppState.shifts) || AppState.shifts.length === 0) {
                    AppState.slots.forEach(slot => { slot.applicable_shifts = ['Full Day']; });
                    return;
                }
                const shiftList = AppState.shifts.slice();
                AppState.slots.forEach(slot => {
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
                    slot.applicable_shifts = Array.from(new Set(shifts));
                    if (shiftList.includes('Full Day') && !slot.applicable_shifts.includes('Full Day')) {
                        slot.applicable_shifts.unshift('Full Day');
                    }
                });
            },

            setActiveShift: function(shiftName) {
                if (!AppState.shiftsEnabled) return;
                AppState.activeShift = shiftName;
                this.updateShiftTabs();
                this.render();
            },

            updateShiftTabs: function() {
                const container = document.getElementById('shift-tabs');
                if (!container) return;
                const buttons = container.querySelectorAll('button[data-shift]');
                buttons.forEach(btn => {
                    const shift = btn.getAttribute('data-shift');
                    const active = shift === AppState.activeShift;
                    btn.classList.toggle('bg-gray-900', active);
                    btn.classList.toggle('text-white', active);
                    btn.classList.toggle('bg-white', !active);
                    btn.classList.toggle('text-gray-700', !active);
                });
            },

            toggleShift: function(index, checked) {
                if (!AppState.shiftsEnabled || !AppState.showShiftControls) return;
                const slot = AppState.slots[index];
                if (!slot) return;
                const shiftName = AppState.activeShift;
                if (shiftName === 'Full Day') return;
                if (!Array.isArray(slot.applicable_shifts)) slot.applicable_shifts = [];
                const set = new Set(slot.applicable_shifts);
                if (checked) set.add(shiftName);
                else set.delete(shiftName);
                slot.applicable_shifts = Array.from(set);
                this.scheduleAutoSave();
            },

            updateStartTime: function(val) {
                AppState.startTime = val;
                this.recalculateChain();
                this.render();
                this.scheduleAutoSave();
            },

            addPeriod: function(render = true) {
                AppState.slots.push({
                    id: Date.now(),
                    label: "",
                    duration: 40,
                    type: 'class',
                    applicable_shifts: AppState.shiftsEnabled ? AppState.shifts.slice() : ['Full Day']
                });
                this.recalculateChain();
                if(render) this.render();
                this.scheduleAutoSave();
            },

            removePeriod: function(index) {
                if(AppState.slots.length <= 1) return;
                if (!confirm('Remove this period? This will update all later times.')) return;
                AppState.slots.splice(index, 1);
                this.recalculateChain();
                this.render();
                this.scheduleAutoSave();
            },

            // --- CORE LOGIC ---
            handleInput: function(index, field, value) {
                const slot = AppState.slots[index];

                if(field === 'start_time') {
                    if(index === 0) {
                        if (!confirm('Change start time for the day? This will shift all periods.')) {
                            this.render();
                            return;
                        }
                        this.updateStartTime(value);
                        return;
                    }
                    else {
                        // REVERT & SHOW WARNING
                        document.getElementById('tutorial-popup').classList.remove('hidden');
                        this.render(); // Re-render to revert visually
                        return;
                    }
                }

                if (field === 'duration') {
                    let mins = parseInt(value) || 0;
                    if(mins < 5) mins = 5; 
                    slot.duration = mins;
                } 
                else if (field === 'end_time') {
                    if (!confirm('Change end time for this period? This will update its duration.')) {
                        this.render();
                        return;
                    }
                    const newDiff = Time.diff(slot.start_time, value);
                    if (newDiff > 0) slot.duration = newDiff;
                    else { alert("End time must be after start time"); this.render(); return; }
                }
                else {
                    slot[field] = value;
                }

                this.recalculateChain();
                this.render();
                this.scheduleAutoSave();
            },

            recalculateChain: function() {
                let current = AppState.startTime;
                AppState.slots.forEach(slot => {
                    slot.start_time = current;
                    slot.end_time = Time.add(current, slot.duration);
                    current = slot.end_time; 
                });
            },

            scheduleAutoSave: function() {
                if (autoSaveTimer) clearTimeout(autoSaveTimer);
                autoSaveTimer = setTimeout(() => {
                    this.save(true);
                }, 800);
            },

            save: async function(isAuto = false) {
                try {
                    this.updateAutoLabels();
                    await fetch('/school/schedules', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ 
                            action: 'save_schedule', 
                            slots: AppState.slots,
                            working_days: AppState.workingDays
                        })
                    });
                    if (!isAuto) {
                        this.showToast('Saved');
                    } else {
                        this.showToast('Auto-saved');
                    }
                } catch(e) {
                    alert("Save failed");
                }
            },

            reset: async function() {
                if(confirm("Reset entire schedule?")) {
                    const resetBtn = document.getElementById('reset-btn');
                    try {
                        if (resetBtn) {
                            resetBtn.disabled = true;
                            resetBtn.textContent = 'Resetting...';
                        }
                        await fetch('/school/schedules', { method: 'DELETE' });
                        AppState.slots = [];
                        AppState.startTime = "08:00";
                        AppState.workingDays = ["monday","tuesday","wednesday","thursday","friday"];
                        this.addPeriod(false);
                        this.recalculateChain();
                        this.render();
                        this.setWorkingDaysCheckboxes();
                        this.updateWorkingDaysCount();
                        this.showToast('Reset complete');
                    } catch (e) {
                        alert('Reset failed');
                    } finally {
                        if (resetBtn) {
                            resetBtn.disabled = false;
                            resetBtn.textContent = 'Reset';
                        }
                    }
                }
            },

            // --- RENDER ENGINE ---
            render: function() {
                const container = document.getElementById('slot-container');
                this.updateAutoLabels();
                container.innerHTML = AppState.slots.map((slot, i) => this.renderRow(slot, i)).join('');
            },

            // --- OPTIMIZED ROW DESIGN ---
            renderRow: function(slot, i) {
                const isFirst = i === 0;
                const showShift = AppState.showShiftControls;
                const activeShift = AppState.activeShift;
                const shiftChecked = showShift && Array.isArray(slot.applicable_shifts) && slot.applicable_shifts.includes(activeShift);
                const shiftDisabled = !showShift || activeShift === 'Full Day';
                const labelText = slot.label || '';
                const labelClass = slot.type === 'break' ? 'text-gray-500' : 'text-gray-800';
                const labelBg = slot.type === 'break' ? 'bg-gray-50' : 'bg-white';
                const displayIndex = slot.type === 'break' ? '-' : (slot.period_index || '');
                
                return \`
                <div class="group bg-white relative">
                    <div class="hidden lg:grid grid-cols-12 gap-0 items-center divide-x divide-gray-200">
                        <div class="col-span-1 text-center text-[11px] text-gray-500 font-semibold py-2">\${displayIndex}</div>
                        <div class="col-span-2 px-2 py-1.5">
                             <input type="time" value="\${slot.start_time}" onchange="app.handleInput(\${i}, 'start_time', this.value)" 
                             class="w-full text-[11px] font-mono font-semibold border border-gray-300 rounded-none px-2 py-1 \${!isFirst ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-900'} focus:border-gray-500">
                        </div>
                        <div class="col-span-2 px-2 py-1.5">
                             <input type="time" value="\${slot.end_time}" onchange="app.handleInput(\${i}, 'end_time', this.value)" class="w-full text-[11px] font-mono font-semibold border border-gray-300 rounded-none px-2 py-1 bg-white text-gray-900 focus:border-gray-500">
                        </div>
                        <div class="col-span-1 px-2 py-1.5">
                             <input type="number" value="\${slot.duration}" onchange="app.handleInput(\${i}, 'duration', this.value)" class="w-full text-[11px] text-center font-semibold bg-white text-gray-700 rounded-none px-2 py-1 border border-gray-300">
                        </div>
                        <div class="col-span-\${showShift ? 3 : 4} px-2 py-1.5">
                             <div class="w-full text-[11px] font-semibold border border-gray-300 rounded-none px-2 py-1 \${labelBg} \${labelClass}">\${labelText}</div>
                        </div>
                        <div class="col-span-1 px-2 py-1.5">
                             <select onchange="app.handleInput(\${i}, 'type', this.value)" class="text-[11px] font-semibold uppercase bg-white border border-gray-300 rounded-none px-2 py-1 outline-none text-gray-700">
                                <option value="class" \${slot.type==='class'?'selected':''}>Class</option>
                                <option value="break" \${slot.type==='break'?'selected':''}>Break</option>
                             </select>
                        </div>
                        \${showShift ? \`
                        <div class="col-span-1 px-2 py-1.5 text-center">
                             <input type="checkbox" \${shiftChecked ? 'checked' : ''} \${shiftDisabled ? 'disabled' : ''} onchange="app.toggleShift(\${i}, this.checked)" class="w-4 h-4 text-gray-900 \${shiftDisabled ? 'opacity-50 cursor-not-allowed' : ''}">
                        </div>
                        \` : ''}
                        <div class="col-span-1 text-right px-2 py-1.5">
                             <button onclick="app.removePeriod(\${i})" class="text-gray-500 hover:text-red-600 font-bold text-base transition-colors px-1 py-0.5">&times;</button>
                        </div>
                    </div>

                    <div class="lg:hidden p-3 border-l border-gray-300 bg-white">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-xs font-semibold text-gray-500 w-3">\${displayIndex}</span>
                            
                            <div class="flex-1">
                                <input type="time" value="\${slot.start_time}" onchange="app.handleInput(\${i}, 'start_time', this.value)"
                                class="w-full text-xs font-mono text-center bg-white border border-gray-300 rounded-none py-1 text-gray-600">
                            </div>
                            <span class="text-gray-400 text-xs mx-1">-&gt;</span>
                            
                            <div class="flex-1">
                                <input type="time" value="\${slot.end_time}" onchange="app.handleInput(\${i}, 'end_time', this.value)"
                                class="w-full text-xs font-mono font-semibold text-center bg-white border border-gray-300 rounded-none py-1 text-gray-900">
                            </div>

                            <div class="w-12">
                                <input type="number" value="\${slot.duration}" onchange="app.handleInput(\${i}, 'duration', this.value)"
                                class="w-full text-xs font-semibold text-center bg-white text-gray-700 rounded-none py-1 border border-gray-300">
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <div class="flex-1 text-xs font-semibold border border-gray-300 rounded-none px-2 py-1 \${labelBg} \${labelClass}">\${labelText}</div>
                            
                            <select onchange="app.handleInput(\${i}, 'type', this.value)" 
                            class="text-xs font-semibold uppercase bg-white border border-gray-300 rounded-none px-2 py-1 outline-none text-gray-700">
                                <option value="class" \${slot.type==='class'?'selected':''}>CL</option>
                                <option value="break" \${slot.type==='break'?'selected':''}>BR</option>
                            </select>

                            <button onclick="app.removePeriod(\${i})" class="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-600 bg-white border border-gray-300">
                                <span class="text-xs leading-none">&times;</span>
                            </button>
                        </div>
                        \${showShift ? \`
                        <div class="mt-2 flex items-center justify-between text-[10px] text-gray-500">
                            <span>Shift: \${activeShift}</span>
                            <label class="flex items-center gap-1">
                                <input type="checkbox" \${shiftChecked ? 'checked' : ''} \${shiftDisabled ? 'disabled' : ''} onchange="app.toggleShift(\${i}, this.checked)" class="w-3 h-3 text-gray-900 \${shiftDisabled ? 'opacity-50 cursor-not-allowed' : ''}">
                                <span>Include</span>
                            </label>
                        </div>
                        \` : ''}
                    </div>
                </div>
                \`;
            }
        };

        document.addEventListener('DOMContentLoaded', () => app.init());
      </script>
    `;
}




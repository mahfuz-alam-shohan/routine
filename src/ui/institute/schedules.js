// src/ui/institute/schedules.js

export function SchedulesPageHTML(config = null, existingSlots = []) {
    if (!config) return WizardHTML();

    const shifts = JSON.parse(config.shifts_json || '["Standard"]');
    // Ensure slots are sorted by time
    existingSlots.sort((a, b) => a.start_time.localeCompare(b.start_time));
    
    // Default start time if no slots exist
    const initialSchoolStart = existingSlots.length > 0 ? existingSlots[0].start_time : "08:00";

    return `
      <div class="max-w-5xl mx-auto" id="schedule-app">
          
          <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 border-b border-gray-200 pb-4">
              <div>
                  <h2 class="text-lg font-bold text-gray-900 leading-none">Routine Manager</h2>
                  <p class="text-xs text-gray-500 mt-1">Design the timeline in 'Master', then assign periods to shifts.</p>
              </div>
              <div class="flex gap-2 w-full md:w-auto">
                   <button onclick="app.save()" class="flex-1 md:flex-none bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-black transition-all shadow-sm active:scale-95">
                      Save All Changes
                   </button>
                   <button onclick="app.reset()" class="flex-1 md:flex-none text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                      Reset
                   </button>
              </div>
          </div>

          <div class="mb-0">
              <div class="border-b border-gray-200">
                  <nav class="-mb-px flex space-x-6 overflow-x-auto no-scrollbar" aria-label="Tabs" id="tab-container">
                      </nav>
              </div>
          </div>

          <div class="bg-white border border-gray-200 border-t-0 shadow-sm rounded-b-lg min-h-[400px] relative">
              
              <div id="master-controls" class="hidden p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <label class="flex flex-col w-full md:w-auto">
                      <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">School Starts At</span>
                      <input type="time" id="school_start_time" value="${initialSchoolStart}" onchange="app.updateStartTime(this.value)" 
                             class="border border-gray-300 rounded px-3 py-2 text-base md:text-sm font-mono font-bold text-gray-900 focus:ring-1 focus:ring-blue-500 outline-none w-full md:w-32">
                  </label>
                  <div class="text-xs text-gray-500">
                      <span class="font-bold text-blue-700">Strict Mode:</span> Changes cascade automatically.
                  </div>
              </div>

              <div class="overflow-x-auto w-full">
                  <table class="w-full text-left border-collapse min-w-[350px] md:min-w-full">
                      <thead>
                          <tr class="bg-white text-[10px] uppercase font-bold text-gray-500 border-b border-gray-200" id="table-header">
                              </tr>
                      </thead>
                      <tbody id="table-body" class="text-sm text-gray-800 divide-y divide-gray-100">
                          </tbody>
                  </table>
              </div>

              <div id="add-btn-wrapper" class="hidden p-3 border-t border-gray-100 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors flex justify-center active:bg-gray-200" onclick="app.addPeriod()">
                  <div class="text-sm font-bold text-blue-600 flex items-center gap-2">
                      <span class="text-xl leading-none">+</span>
                      <span>Add Next Period</span>
                  </div>
              </div>
          </div>
      </div>

      <script>
        // --- STATE MANAGEMENT ---
        const AppState = {
            shifts: ${JSON.stringify(shifts)},
            slots: ${JSON.stringify(existingSlots)}.map(s => ({
                ...s,
                applicable_shifts: typeof s.applicable_shifts === 'string' ? JSON.parse(s.applicable_shifts) : (s.applicable_shifts || [])
            })),
            activeTab: 'Master', // 'Master' or Shift Name
            startTime: "${initialSchoolStart}"
        };

        // --- CORE LOGIC ---
        const app = {
            init: () => {
                if(AppState.slots.length === 0) {
                    app.addPeriod(false); // Add initial default row
                }
                app.recalculateTimes(); 
                app.render();
            },

            setTab: (tabName) => {
                AppState.activeTab = tabName;
                app.render();
            },

            updateStartTime: (val) => {
                AppState.startTime = val;
                app.recalculateTimes();
                app.render();
            },

            addPeriod: (render = true) => {
                AppState.slots.push({
                    id: Date.now(), // temp id
                    label: "New Period",
                    duration: 40,
                    type: 'class',
                    applicable_shifts: [...AppState.shifts] // Default to all shifts
                });
                app.recalculateTimes();
                if(render) app.render();
            },

            removePeriod: (index) => {
                AppState.slots.splice(index, 1);
                app.recalculateTimes();
                app.render();
            },

            updateSlot: (index, field, value) => {
                AppState.slots[index][field] = value;
                if(field === 'duration') app.recalculateTimes();
                // We don't re-render entire table on text input to keep focus, 
                // but for select/duration we might need to.
                if(field === 'type' || field === 'duration') app.render();
            },

            toggleShift: (index, shiftName) => {
                const shifts = AppState.slots[index].applicable_shifts;
                if(shifts.includes(shiftName)) {
                    AppState.slots[index].applicable_shifts = shifts.filter(s => s !== shiftName);
                } else {
                    AppState.slots[index].applicable_shifts.push(shiftName);
                }
                app.render(); // Re-render to show visual toggle state
            },

            recalculateTimes: () => {
                let current = AppState.startTime;
                AppState.slots.forEach(slot => {
                    slot.start_time = current;
                    
                    // Add minutes
                    let [h, m] = current.split(':').map(Number);
                    let date = new Date(2000, 0, 1, h, m);
                    date.setMinutes(date.getMinutes() + parseInt(slot.duration));
                    
                    let rh = date.getHours().toString().padStart(2, '0');
                    let rm = date.getMinutes().toString().padStart(2, '0');
                    slot.end_time = \`\${rh}:\${rm}\`;
                    
                    current = slot.end_time;
                });
            },

            save: async () => {
                const btn = document.querySelector('button[onclick="app.save()"]');
                const oldText = btn.innerText;
                btn.innerText = "Saving...";
                btn.disabled = true;

                try {
                    const res = await fetch('/school/schedules', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ action: 'save_routine', slots: AppState.slots })
                    });
                    if(res.ok) window.location.reload();
                    else alert("Save failed");
                } catch(e) {
                    alert("Network Error");
                } finally {
                    btn.innerText = oldText;
                    btn.disabled = false;
                }
            },

            reset: async () => {
                 if(confirm("Reset entire configuration?")) {
                     await fetch('/school/schedules', { method: 'DELETE' });
                     window.location.reload();
                 }
            },

            // --- RENDERING ---
            render: () => {
                app.renderTabs();
                app.renderHeader();
                app.renderBody();
                
                // Show/Hide Controls based on Tab
                const isMaster = AppState.activeTab === 'Master';
                document.getElementById('master-controls').classList.toggle('hidden', !isMaster);
                document.getElementById('add-btn-wrapper').classList.toggle('hidden', !isMaster);
            },

            renderTabs: () => {
                const container = document.getElementById('tab-container');
                const tabs = ['Master', ...AppState.shifts];
                
                container.innerHTML = tabs.map(t => {
                    const isActive = t === AppState.activeTab;
                    const borderClass = isActive ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
                    return \`
                        <button onclick="app.setTab('\${t}')" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors \${borderClass}">
                            \${t === 'Master' ? 'Start Here: Master Timeline' : t + ' Shift'}
                        </button>
                    \`;
                }).join('');
            },

            renderHeader: () => {
                const tr = document.getElementById('table-header');
                const isMaster = AppState.activeTab === 'Master';
                
                if(isMaster) {
                    tr.innerHTML = \`
                        <th class="py-3 px-3 w-12 text-center border-r border-gray-100">#</th>
                        <th class="py-3 px-3 border-r border-gray-100 w-32">Time Slot</th>
                        <th class="py-3 px-3 border-r border-gray-100 w-20">Mins</th>
                        <th class="py-3 px-3 border-r border-gray-100">Period Label</th>
                        <th class="py-3 px-3 border-r border-gray-100 w-32">Type</th>
                        <th class="py-3 px-3 w-10"></th>
                    \`;
                } else {
                    // Shift View Header
                    tr.innerHTML = \`
                        <th class="py-3 px-3 w-12 text-center border-r border-gray-100">#</th>
                        <th class="py-3 px-3 border-r border-gray-100 w-32">Time</th>
                        <th class="py-3 px-3 border-r border-gray-100">Details</th>
                        <th class="py-3 px-3 w-32 text-center">Status in \${AppState.activeTab}</th>
                    \`;
                }
            },

            renderBody: () => {
                const tbody = document.getElementById('table-body');
                const isMaster = AppState.activeTab === 'Master';
                
                tbody.innerHTML = AppState.slots.map((slot, i) => {
                    // Row Logic
                    if(isMaster) {
                        return \`
                        <tr class="group hover:bg-gray-50 transition-colors bg-white">
                            <td class="py-2 px-3 text-center text-xs font-mono text-gray-400 border-r border-gray-100 select-none">\${i + 1}</td>
                            
                            <td class="py-2 px-3 border-r border-gray-100">
                                <div class="text-xs font-mono font-bold text-gray-900 bg-gray-50 px-2 py-1.5 rounded border border-gray-200 text-center whitespace-nowrap">
                                    \${slot.start_time} - \${slot.end_time}
                                </div>
                            </td>
                            
                            <td class="py-2 px-3 border-r border-gray-100">
                                <input type="number" value="\${slot.duration}" step="5" min="5" 
                                    onchange="app.updateSlot(\${i}, 'duration', this.value)"
                                    class="w-full text-sm font-bold text-center border border-transparent hover:border-gray-200 focus:border-blue-500 rounded bg-transparent p-1 outline-none">
                            </td>
                            
                            <td class="py-2 px-3 border-r border-gray-100">
                                <input type="text" value="\${slot.label}" 
                                    onchange="app.updateSlot(\${i}, 'label', this.value)"
                                    class="w-full text-sm font-medium text-gray-800 border-b border-transparent focus:border-blue-500 bg-transparent px-1 py-1 outline-none" placeholder="Period Name">
                            </td>
                            
                            <td class="py-2 px-3 border-r border-gray-100">
                                <select onchange="app.updateSlot(\${i}, 'type', this.value)"
                                    class="w-full text-xs font-medium bg-transparent p-1 outline-none \${slot.type==='break'?'text-orange-600':'text-blue-600'}">
                                    <option value="class" \${slot.type==='class'?'selected':''}>Class</option>
                                    <option value="break" \${slot.type==='break'?'selected':''}>Break</option>
                                    <option value="assembly" \${slot.type==='assembly'?'selected':''}>Assembly</option>
                                </select>
                            </td>

                            <td class="py-2 px-2 text-center">
                                <button onclick="app.removePeriod(\${i})" class="text-gray-300 hover:text-red-500 font-bold text-lg">&times;</button>
                            </td>
                        </tr>
                        \`;
                    } else {
                        // SHIFT VIEW (Read Only + Toggle)
                        const isActive = slot.applicable_shifts.includes(AppState.activeTab);
                        const rowClass = isActive ? 'bg-white' : 'bg-gray-50 opacity-60';
                        const statusColor = isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-400 border-gray-200';
                        const statusText = isActive ? 'Active' : 'Skipped';

                        return \`
                        <tr class="transition-colors \${rowClass}">
                            <td class="py-3 px-3 text-center text-xs font-mono text-gray-400 border-r border-gray-100">\${i + 1}</td>
                            
                            <td class="py-3 px-3 border-r border-gray-100">
                                <span class="text-xs font-mono font-bold text-gray-700">\${slot.start_time} - \${slot.end_time}</span>
                            </td>
                            
                            <td class="py-3 px-3 border-r border-gray-100">
                                <div class="font-bold text-sm text-gray-800">\${slot.label}</div>
                                <div class="text-[10px] uppercase text-gray-500">\${slot.type} • \${slot.duration} min</div>
                            </td>
                            
                            <td class="py-3 px-3 text-center cursor-pointer select-none" onclick="app.toggleShift(\${i}, '\${AppState.activeTab}')">
                                <div class="inline-flex items-center justify-center px-3 py-1.5 rounded-full border text-xs font-bold \${statusColor} w-24">
                                    \${statusText}
                                </div>
                            </td>
                        </tr>
                        \`;
                    }
                }).join('');
            }
        };

        // Initialize
        document.addEventListener('DOMContentLoaded', app.init);
      </script>
    `;
}

// Wizard remains same
function WizardHTML() {
    return `
      <div class="max-w-xl mx-auto py-10 px-4">
          <div class="text-center mb-8">
              <h1 class="text-2xl font-bold text-gray-900">Setup Routine</h1>
              <p class="text-sm text-gray-500">Define your school's operating structure.</p>
          </div>
          
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-6 space-y-4">
              <label class="block relative border rounded-lg p-3 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <input type="radio" name="strategy" value="single" class="peer sr-only" onchange="toggleDetails()">
                  <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 peer-checked:bg-blue-600 peer-checked:text-white">1</div>
                      <div>
                          <h3 class="font-bold text-sm text-gray-900">Single Shift</h3>
                          <p class="text-xs text-gray-500">Entire school runs on one timeline.</p>
                      </div>
                  </div>
              </label>

              <label class="block relative border rounded-lg p-3 cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all">
                  <input type="radio" name="strategy" value="connected" class="peer sr-only" onchange="toggleDetails()">
                  <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 peer-checked:bg-purple-600 peer-checked:text-white">2</div>
                      <div>
                          <h3 class="font-bold text-sm text-gray-900">Multi-Shift (Connected)</h3>
                          <p class="text-xs text-gray-500">Morning/Day shifts share the master bell times.</p>
                      </div>
                  </div>
              </label>

              <div id="shift-names-box" class="hidden mt-3 pl-12">
                  <label class="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Shift Names</label>
                  <input type="text" id="shift-names" placeholder="Morning, Day" class="w-full border border-gray-300 rounded p-2 text-base md:text-sm outline-none">
              </div>

              <button onclick="saveConfig()" class="w-full bg-gray-900 text-white py-3 rounded-lg text-sm font-bold hover:bg-black mt-4">
                  Initialize Schedule
              </button>
          </div>
      </div>
      <script>
        function toggleDetails() {
            const val = document.querySelector('input[name="strategy"]:checked').value;
            const box = document.getElementById('shift-names-box');
            if(val !== 'single') { box.classList.remove('hidden'); document.getElementById('shift-names').value = "Morning, Day"; }
            else box.classList.add('hidden');
        }
        async function saveConfig() {
            const strategyEl = document.querySelector('input[name="strategy"]:checked');
            if(!strategyEl) return alert("Select an option");
            let shifts = ["Standard"];
            if(strategyEl.value !== 'single') {
                const txt = document.getElementById('shift-names').value;
                if(!txt) return alert("Enter shift names");
                shifts = txt.split(',').map(s => s.trim()).filter(s => s);
            }
            await fetch('/school/schedules', { method: 'POST', body: JSON.stringify({ action: 'init_config', strategy: strategyEl.value, shifts }) });
            window.location.reload();
        }
      </script>
    `;
}

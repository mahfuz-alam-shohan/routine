export function SchedulesPageHTML(config = null, existingSlots = []) {
    if (!config) return WizardHTML();

    const shifts = JSON.parse(config.shifts_json || '["Standard"]');
    // Sort logic
    existingSlots.sort((a, b) => a.start_time.localeCompare(b.start_time));
    
    // Default 08:00 if fresh start
    const initialSchoolStart = existingSlots.length > 0 ? existingSlots[0].start_time : "08:00";

    return `
      <div class="max-w-5xl mx-auto pb-24 md:pb-10" id="schedule-app">
          
          <div class="bg-white sticky top-0 z-20 border-b border-gray-200 shadow-sm">
              <div class="flex justify-between items-center px-4 py-3">
                  <h2 class="text-sm font-bold text-gray-900 leading-tight">
                      Routine Manager
                      <span class="block text-[10px] text-gray-500 font-normal">Auto-chain enabled</span>
                  </h2>
                  <div class="flex gap-2">
                       <button onclick="app.save()" class="bg-gray-900 text-white px-3 py-1.5 rounded text-xs font-bold active:bg-black">
                          Save
                       </button>
                       <button onclick="app.reset()" class="text-red-600 bg-red-50 px-3 py-1.5 rounded text-xs font-bold">
                          Reset
                       </button>
                  </div>
              </div>
              
              <div class="px-4 pb-0 overflow-x-auto no-scrollbar flex space-x-4 bg-gray-50/50">
                   <div id="tab-container" class="flex space-x-4 pt-2"></div>
              </div>
          </div>

          <div id="master-controls" class="mx-4 mt-4 p-3 bg-blue-50/50 border border-blue-100 rounded-lg flex items-center justify-between shadow-sm">
              <div class="flex flex-col">
                  <span class="text-[10px] uppercase font-bold text-blue-800 tracking-wider">School Start</span>
                  <span class="text-[10px] text-blue-600">First period begins here</span>
              </div>
              <input type="time" id="school_start_time" value="${initialSchoolStart}" onchange="app.updateStartTime(this.value)" 
                     class="bg-white border border-blue-200 text-blue-900 text-sm font-bold rounded px-2 py-1 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none w-24 text-center">
          </div>

          <div class="mt-4 px-2 md:px-0">
              <div class="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                  
                  <div class="hidden md:grid grid-cols-12 gap-4 p-3 bg-gray-50 border-b border-gray-200 text-[10px] uppercase font-bold text-gray-500">
                      <div class="col-span-1 text-center">#</div>
                      <div class="col-span-2">Start</div>
                      <div class="col-span-2">End</div>
                      <div class="col-span-1">Mins</div>
                      <div class="col-span-3">Label</div>
                      <div class="col-span-2">Type</div>
                      <div class="col-span-1"></div>
                  </div>

                  <div id="slot-container" class="divide-y divide-gray-100">
                      </div>

                  <button id="add-btn" onclick="app.addPeriod()" class="w-full py-4 text-center text-blue-600 font-bold text-sm hover:bg-gray-50 active:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                      <span class="text-lg leading-none">+</span> Add Period
                  </button>
              </div>
          </div>
      </div>

      <div id="tutorial-popup" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4 backdrop-blur-sm transition-opacity opacity-0">
          <div class="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 transform scale-95 transition-transform">
              <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 class="text-lg font-bold text-gray-900 text-center mb-2">Chain Reaction Logic</h3>
              <p class="text-sm text-gray-500 text-center mb-6">
                  You cannot edit the <b>Start Time</b> of middle periods directly because they depend on the previous class finishing.<br><br>
                  👉 <b>Solution:</b> Edit the <span class="text-blue-600 font-bold">End Time</span> or <span class="text-blue-600 font-bold">Duration</span> of the previous period instead.
              </p>
              <button onclick="closeTutorial()" class="w-full bg-gray-900 text-white py-3 rounded-lg font-bold text-sm">Got it!</button>
          </div>
      </div>

      <script>
        const AppState = {
            shifts: ${JSON.stringify(shifts)},
            slots: ${JSON.stringify(existingSlots)}.map(s => ({
                ...s,
                applicable_shifts: typeof s.applicable_shifts === 'string' ? JSON.parse(s.applicable_shifts) : (s.applicable_shifts || [])
            })),
            activeTab: 'Master', 
            startTime: "${initialSchoolStart}"
        };

        // Helper: Add Minutes to HH:MM
        function addMinutes(time, mins) {
            if(!time) return "00:00";
            let [h, m] = time.split(':').map(Number);
            let date = new Date(2000, 0, 1, h, m);
            date.setMinutes(date.getMinutes() + mins);
            return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
        }

        // Helper: Get difference in minutes between HH:MM and HH:MM
        function getDiff(start, end) {
            let [h1, m1] = start.split(':').map(Number);
            let [h2, m2] = end.split(':').map(Number);
            let d1 = new Date(2000, 0, 1, h1, m1);
            let d2 = new Date(2000, 0, 1, h2, m2);
            return Math.round((d2 - d1) / 60000);
        }

        const app = {
            init: function() {
                if(AppState.slots.length === 0) this.addPeriod(false);
                this.recalculateChain(); 
                this.render();
            },

            setTab: function(t) {
                AppState.activeTab = t;
                this.render();
            },

            updateStartTime: function(val) {
                AppState.startTime = val;
                this.recalculateChain();
                this.render();
            },

            addPeriod: function(render = true) {
                AppState.slots.push({
                    label: "",
                    duration: 45, // Standard default
                    type: 'class',
                    applicable_shifts: [...AppState.shifts]
                });
                this.recalculateChain();
                if(render) this.render();
            },

            removePeriod: function(index) {
                if(AppState.slots.length <= 1) return alert("Cannot remove the last period.");
                AppState.slots.splice(index, 1);
                this.recalculateChain();
                this.render();
            },

            // LOGIC ENGINE
            handleInput: function(index, field, value) {
                const slot = AppState.slots[index];

                if (field === 'duration') {
                    // User changed Duration -> Update End Time
                    let mins = parseInt(value) || 0;
                    if(mins < 5) mins = 5; // Minimum 5 mins
                    slot.duration = mins;
                    // End time will be fixed by recalculateChain()
                } 
                else if (field === 'end_time') {
                    // User changed End Time -> Calculate new Duration
                    const newDiff = getDiff(slot.start_time, value);
                    if (newDiff > 0) {
                        slot.duration = newDiff;
                    } else {
                        alert("End time must be after start time");
                        // Revert visual change by re-rendering
                        this.render(); 
                        return;
                    }
                }
                else if (field === 'start_time') {
                    // User tried to change Start Time
                    if (index === 0) {
                        // If it's the first period, update global school start
                        this.updateStartTime(value);
                        return;
                    } else {
                        // BLOCKED: Show Tutorial
                        showTutorial();
                        // Revert input visually
                        document.getElementById('start-time-'+index).value = slot.start_time;
                        return;
                    }
                }
                else {
                    // Label or Type
                    slot[field] = value;
                }

                this.recalculateChain();
                // We re-render to update the subsequent rows that shifted
                this.render(); 
            },

            toggleShift: function(index, shift) {
                const s = AppState.slots[index];
                if(s.applicable_shifts.includes(shift)) s.applicable_shifts = s.applicable_shifts.filter(x => x !== shift);
                else s.applicable_shifts.push(shift);
                this.render();
            },

            recalculateChain: function() {
                let current = AppState.startTime;
                AppState.slots.forEach(slot => {
                    slot.start_time = current;
                    slot.end_time = addMinutes(current, parseInt(slot.duration));
                    current = slot.end_time; // Next starts when this ends
                });
            },

            save: async function() {
                const btn = document.querySelector('button[onclick="app.save()"]');
                const oldText = btn.innerText;
                btn.innerText = "...";
                try {
                    await fetch('/school/schedules', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ action: 'save_routine', slots: AppState.slots })
                    });
                    window.location.reload();
                } catch(e) { alert("Error saving"); }
                finally { btn.innerText = oldText; }
            },

            reset: async function() {
                if(confirm("Reset schedule?")) {
                    await fetch('/school/schedules', { method: 'DELETE' });
                    window.location.reload();
                }
            },

            render: function() {
                this.renderTabs();
                const isMaster = AppState.activeTab === 'Master';
                
                // Show/Hide Start Time Control
                document.getElementById('master-controls').style.display = isMaster ? 'flex' : 'none';
                document.getElementById('add-btn').style.display = isMaster ? 'flex' : 'none';

                const container = document.getElementById('slot-container');
                
                if (isMaster) {
                    // --- MASTER EDIT VIEW ---
                    container.innerHTML = AppState.slots.map((slot, i) => \`
                        <div class="group bg-white p-3 md:grid md:grid-cols-12 md:gap-4 md:items-center border-b border-gray-100 relative">
                            
                            <div class="hidden md:block col-span-1 text-center font-mono text-gray-400 text-xs">\${i + 1}</div>
                            
                            <div class="md:hidden flex flex-col gap-3 w-full">
                                <div class="flex items-center gap-2">
                                    <div class="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center shrink-0">
                                        \${i+1}
                                    </div>
                                    
                                    <div class="relative flex-1">
                                        <label class="text-[9px] text-gray-400 uppercase font-bold absolute -top-1.5 left-1 bg-white px-1">Start</label>
                                        <input type="time" id="start-time-\${i}" value="\${slot.start_time}" 
                                            onchange="app.handleInput(\${i}, 'start_time', this.value)"
                                            class="w-full text-sm font-bold text-gray-700 border border-gray-200 rounded px-2 py-1.5 focus:border-blue-500 outline-none \${i>0 ? 'bg-gray-50 text-gray-500' : 'bg-white'}">
                                    </div>

                                    <div class="text-gray-300 font-bold">-</div>

                                    <div class="relative flex-1">
                                        <label class="text-[9px] text-gray-400 uppercase font-bold absolute -top-1.5 left-1 bg-white px-1">End</label>
                                        <input type="time" value="\${slot.end_time}" 
                                            onchange="app.handleInput(\${i}, 'end_time', this.value)"
                                            class="w-full text-sm font-bold text-gray-900 border border-gray-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm">
                                    </div>

                                    <div class="relative w-16">
                                        <label class="text-[9px] text-gray-400 uppercase font-bold absolute -top-1.5 left-1 bg-white px-1">Min</label>
                                        <input type="number" value="\${slot.duration}" 
                                            onchange="app.handleInput(\${i}, 'duration', this.value)"
                                            class="w-full text-sm font-bold text-center text-blue-600 bg-blue-50 border border-blue-100 rounded py-1.5 outline-none">
                                    </div>
                                </div>

                                <div class="flex gap-2">
                                    <input type="text" value="\${slot.label}" 
                                        onchange="app.handleInput(\${i}, 'label', this.value)"
                                        class="flex-1 text-sm font-medium border-b border-gray-200 focus:border-blue-500 py-1 outline-none rounded-none bg-transparent placeholder-gray-400" 
                                        placeholder="Enter Period Name (e.g. Math)">
                                    
                                    <select onchange="app.handleInput(\${i}, 'type', this.value)"
                                        class="text-xs font-bold uppercase tracking-wide bg-transparent outline-none \${slot.type==='break'?'text-orange-500':'text-blue-600'}">
                                        <option value="class" \${slot.type==='class'?'selected':''}>Class</option>
                                        <option value="break" \${slot.type==='break'?'selected':''}>Break</option>
                                        <option value="assembly" \${slot.type==='assembly'?'selected':''}>Assembly</option>
                                    </select>

                                    <button onclick="app.removePeriod(\${i})" class="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 rounded active:bg-red-50">
                                        &times;
                                    </button>
                                </div>
                            </div>

                            <div class="hidden md:block col-span-2">
                                <input type="time" id="d-start-\${i}" value="\${slot.start_time}" onchange="app.handleInput(\${i}, 'start_time', this.value)" 
                                class="w-full text-sm font-mono border-gray-200 rounded \${i>0?'bg-gray-50 text-gray-400':''}">
                            </div>
                            <div class="hidden md:block col-span-2">
                                <input type="time" value="\${slot.end_time}" onchange="app.handleInput(\${i}, 'end_time', this.value)" class="w-full text-sm font-mono font-bold border-gray-300 rounded shadow-sm focus:ring-1 focus:ring-blue-500">
                            </div>
                            <div class="hidden md:block col-span-1">
                                <input type="number" value="\${slot.duration}" onchange="app.handleInput(\${i}, 'duration', this.value)" class="w-full text-center text-sm font-bold text-blue-600 bg-blue-50 rounded border-none">
                            </div>
                            <div class="hidden md:block col-span-3">
                                <input type="text" value="\${slot.label}" onchange="app.handleInput(\${i}, 'label', this.value)" class="w-full text-sm border-transparent focus:border-gray-300 border-b bg-transparent" placeholder="Period Name">
                            </div>
                            <div class="hidden md:block col-span-2">
                                <select onchange="app.handleInput(\${i}, 'type', this.value)" class="text-xs font-bold uppercase \${slot.type==='break'?'text-orange-500':'text-blue-600'} bg-transparent">
                                    <option value="class" \${slot.type==='class'?'selected':''}>Class</option>
                                    <option value="break" \${slot.type==='break'?'selected':''}>Break</option>
                                </select>
                            </div>
                            <div class="hidden md:block col-span-1 text-right">
                                <button onclick="app.removePeriod(\${i})" class="text-gray-300 hover:text-red-500 text-lg">&times;</button>
                            </div>

                        </div>
                    \`).join('');

                } else {
                    // --- SHIFT TOGGLE VIEW (Read Only) ---
                    container.innerHTML = AppState.slots.map((slot, i) => {
                        const isActive = slot.applicable_shifts.includes(AppState.activeTab);
                        const rowColor = isActive ? 'bg-white' : 'bg-gray-50 opacity-60';
                        const btnColor = isActive ? 'bg-green-500 text-white shadow-md border-green-600' : 'bg-white text-gray-400 border-gray-300';
                        
                        return \`
                        <div class="flex items-center justify-between p-4 border-b border-gray-100 transition-all \${rowColor}" onclick="app.toggleShift(\${i}, '\${AppState.activeTab}')">
                            <div class="flex items-center gap-4">
                                <div class="flex flex-col items-center justify-center w-12 h-12 bg-gray-100 rounded-lg border border-gray-200">
                                    <span class="text-xs font-bold text-gray-800">\${slot.start_time}</span>
                                    <span class="text-[10px] text-gray-400">\${slot.end_time}</span>
                                </div>
                                <div>
                                    <h4 class="font-bold text-sm text-gray-900 leading-tight">\${slot.label || 'Untitled'}</h4>
                                    <p class="text-[10px] uppercase font-bold text-blue-500 mt-0.5">\${slot.type} • \${slot.duration}m</p>
                                </div>
                            </div>
                            
                            <button class="w-14 h-8 rounded-full text-[10px] font-bold border transition-all \${btnColor}">
                                \${isActive ? 'ON' : 'OFF'}
                            </button>
                        </div>
                        \`;
                    }).join('');
                }
            },

            renderTabs: function() {
                const tabs = ['Master', ...AppState.shifts];
                document.getElementById('tab-container').innerHTML = tabs.map(t => {
                    const active = t === AppState.activeTab;
                    return \`<button onclick="app.setTab('\${t}')" class="whitespace-nowrap px-4 py-2 text-xs font-bold rounded-t-lg border-t border-l border-r border-transparent transition-all \${active ? 'bg-white text-blue-600 border-gray-200' : 'text-gray-500 hover:text-gray-700'}">\${t}</button>\`;
                }).join('');
            }
        };

        // --- TUTORIAL LOGIC ---
        function showTutorial() {
            const popup = document.getElementById('tutorial-popup');
            popup.classList.remove('hidden');
            // Small delay to allow CSS transition to catch the removal of 'hidden'
            setTimeout(() => {
                popup.classList.remove('opacity-0');
                popup.querySelector('div').classList.remove('scale-95');
                popup.querySelector('div').classList.add('scale-100');
            }, 10);
        }

        function closeTutorial() {
            const popup = document.getElementById('tutorial-popup');
            popup.classList.add('opacity-0');
            popup.querySelector('div').classList.add('scale-95');
            setTimeout(() => popup.classList.add('hidden'), 200);
        }

        document.addEventListener('DOMContentLoaded', () => app.init());
      </script>
    `;
}

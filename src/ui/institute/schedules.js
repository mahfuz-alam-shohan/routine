export function SchedulesPageHTML(config = null, existingSlots = []) {
    // Sort slots by start time
    existingSlots.sort((a, b) => a.start_time.localeCompare(b.start_time));
    const initialSchoolStart = existingSlots.length > 0 ? existingSlots[0].start_time : (config?.start_time || "08:00");

    return `
      <div class="max-w-6xl mx-auto pb-24 md:pb-10 select-none" id="schedule-app">
          
          <div class="bg-white sticky top-0 z-30 border-b border-gray-200 shadow-sm">
              <div class="flex justify-between items-center px-4 py-3 md:px-5 md:py-4">
                  <div>
                    <h2 class="text-base md:text-xl font-bold text-gray-900">Master Schedule</h2>
                    <p class="text-xs md:text-sm text-gray-500 mt-1">Configure your school's daily routine</p>
                  </div>
                  <div class="flex gap-2 md:gap-3">
                       <button onclick="app.save()" class="bg-black text-white px-3 py-2 md:px-5 md:py-2.5 rounded-lg text-sm md:text-base font-bold active:scale-95 transition-transform">Save</button>
                       <button onclick="app.reset()" class="text-red-600 bg-red-50 px-3 py-2 md:px-4 md:py-2.5 rounded-lg text-sm md:text-base font-bold">Reset</button>
                  </div>
              </div>
          </div>

          <div class="mx-3 md:mx-5 mt-3 md:mt-3 p-3 md:p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
              <span class="text-xs md:text-sm font-bold text-blue-800 uppercase tracking-wide">Day Starts At:</span>
              <input type="time" id="school_start_time" value="${initialSchoolStart}" onchange="app.updateStartTime(this.value)" 
                     class="bg-white border border-blue-200 text-blue-900 text-xs md:text-sm font-bold rounded-lg px-3 py-2 md:px-3 md:py-2 outline-none w-20 md:w-22 text-center focus:ring-2 focus:ring-blue-500">
          </div>

          <div class="mt-3 md:mt-3 bg-white border-t border-b border-gray-200 md:border md:rounded-lg md:mx-5 md:shadow-md overflow-hidden">
              
              <div class="hidden md:grid grid-cols-12 gap-2 md:gap-3 p-3 md:p-4 bg-gray-100 text-xs md:text-sm uppercase font-bold text-gray-500 border-b border-gray-200">
                  <div class="col-span-1 text-center">#</div>
                  <div class="col-span-2">Start</div>
                  <div class="col-span-2">End</div>
                  <div class="col-span-1">Mins</div>
                  <div class="col-span-4">Label</div>
                  <div class="col-span-1">Type</div>
                  <div class="col-span-1"></div>
              </div>

              <div id="slot-container" class="divide-y divide-gray-100"></div>

              <button id="add-btn" onclick="app.addPeriod()" class="w-full py-3 md:py-3 text-center text-blue-600 font-bold text-sm md:text-base hover:bg-gray-50 active:bg-blue-50 transition-colors">
                  + Add Next Period
              </button>
          </div>
      </div>

      <div id="tutorial-popup" class="fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center px-4 backdrop-blur-sm">
          <div class="bg-white rounded-lg shadow-xl w-full max-w-xs p-5 transform transition-all scale-100">
              <h3 class="text-sm font-bold text-gray-900 mb-2">⚠️ Cannot Change Start Time</h3>
              <p class="text-xs text-gray-600 mb-4 leading-relaxed">
                  This period starts automatically when the previous one ends.<br>
                  To change this time, adjust the <b>Duration</b> or <b>End Time</b> of the <u>previous period</u>.
              </p>
              <button onclick="document.getElementById('tutorial-popup').classList.add('hidden')" class="w-full bg-gray-900 text-white py-2 rounded text-xs font-bold">Okay, Got it</button>
          </div>
      </div>

      <script>
        const AppState = {
            slots: ${JSON.stringify(existingSlots)},
            startTime: "${initialSchoolStart}"
        };

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
            init: function() {
                if(AppState.slots.length === 0) this.addPeriod(false);
                this.recalculateChain(); 
                this.render();
            },

            updateStartTime: function(val) {
                AppState.startTime = val;
                this.recalculateChain();
                this.render();
            },

            addPeriod: function(render = true) {
                AppState.slots.push({
                    id: Date.now(),
                    label: "",
                    duration: 40,
                    type: 'class'
                });
                this.recalculateChain();
                if(render) this.render();
            },

            removePeriod: function(index) {
                if(AppState.slots.length <= 1) return;
                AppState.slots.splice(index, 1);
                this.recalculateChain();
                this.render();
            },

            // --- CORE LOGIC ---
            handleInput: function(index, field, value) {
                const slot = AppState.slots[index];

                if(field === 'start_time') {
                    if(index === 0) { this.updateStartTime(value); return; }
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
                    const newDiff = Time.diff(slot.start_time, value);
                    if (newDiff > 0) slot.duration = newDiff;
                    else { alert("End time must be after start time"); this.render(); return; }
                }
                else {
                    slot[field] = value;
                }

                this.recalculateChain();
                this.render();
            },

            recalculateChain: function() {
                let current = AppState.startTime;
                AppState.slots.forEach(slot => {
                    slot.start_time = current;
                    slot.end_time = Time.add(current, slot.duration);
                    current = slot.end_time; 
                });
            },

            save: async function() {
                try {
                    await fetch('/school/schedules', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ action: 'save_schedule', slots: AppState.slots })
                    });
                    window.location.reload();
                } catch(e) { alert("Save failed"); }
            },

            reset: async function() {
                if(confirm("Reset entire schedule?")) {
                    await fetch('/school/schedules', { method: 'DELETE' });
                    window.location.reload();
                }
            },

            // --- RENDER ENGINE ---
            render: function() {
                const container = document.getElementById('slot-container');
                container.innerHTML = AppState.slots.map((slot, i) => this.renderRow(slot, i)).join('');
            },

            // --- COMPACT ROW DESIGN ---
            renderRow: function(slot, i) {
                const isFirst = i === 0;
                
                return \`
                <div class="group bg-white relative">
                    <div class="hidden md:grid grid-cols-12 gap-2 md:gap-3 p-3 md:p-4 items-center hover:bg-gray-50">
                        <div class="col-span-1 text-center text-sm md:text-base text-gray-400 font-bold">\${i+1}</div>
                        <div class="col-span-2">
                             <input type="time" value="\${slot.start_time}" onchange="app.handleInput(\${i}, 'start_time', this.value)" 
                             class="w-full text-sm md:text-base font-mono font-bold border border-gray-300 rounded-lg px-2 py-2 md:px-3 md:py-2 \${!isFirst ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-900'} focus:border-blue-500 focus:ring-2">
                        </div>
                        <div class="col-span-2">
                             <input type="time" value="\${slot.end_time}" onchange="app.handleInput(\${i}, 'end_time', this.value)" class="w-full text-sm md:text-base font-mono font-bold border border-gray-300 rounded-lg px-2 py-2 md:px-3 md:py-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-2">
                        </div>
                        <div class="col-span-1">
                             <input type="number" value="\${slot.duration}" onchange="app.handleInput(\${i}, 'duration', this.value)" class="w-full text-sm md:text-base text-center font-bold bg-blue-50 text-blue-700 rounded-lg px-2 py-2 md:px-2 md:py-2 border-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div class="col-span-4">
                             <input type="text" value="\${slot.label}" onchange="app.handleInput(\${i}, 'label', this.value)" class="w-full text-sm md:text-base border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 bg-transparent py-2 md:py-2 outline-none font-medium placeholder-gray-400" placeholder="Period Name...">
                        </div>
                        <div class="col-span-1">
                             <select onchange="app.handleInput(\${i}, 'type', this.value)" class="text-xs md:text-sm font-bold uppercase bg-transparent outline-none \${slot.type==='break'?'text-orange-500':'text-blue-600'}">
                                <option value="class" \${slot.type==='class'?'selected':''}>Class</option>
                                <option value="break" \${slot.type==='break'?'selected':''}>Break</option>
                             </select>
                        </div>
                        <div class="col-span-1 text-right">
                             <button onclick="app.removePeriod(\${i})" class="text-gray-300 hover:text-red-500 font-bold text-base md:text-lg transition-colors p-2 rounded-lg hover:bg-red-50">&times;</button>
                        </div>
                    </div>

                    <div class="md:hidden p-2 border-l-2 \${slot.type==='break'?'border-orange-300':'border-blue-300'} bg-gray-50">
                        <div class="flex items-center gap-1 mb-1">
                            <span class="text-xs font-bold text-gray-500 w-3">\${i+1}</span>
                            
                            <div class="flex-1">
                                <input type="time" value="\${slot.start_time}" onchange="app.handleInput(\${i}, 'start_time', this.value)"
                                class="w-full text-xs font-mono text-center bg-white border border-gray-200 rounded py-1 text-gray-600">
                            </div>
                            <span class="text-gray-400 text-xs mx-1">→</span>
                            
                            <div class="flex-1">
                                <input type="time" value="\${slot.end_time}" onchange="app.handleInput(\${i}, 'end_time', this.value)"
                                class="w-full text-xs font-mono font-bold text-center bg-white border border-gray-200 rounded py-1 text-gray-900">
                            </div>

                            <div class="w-10">
                                <input type="number" value="\${slot.duration}" onchange="app.handleInput(\${i}, 'duration', this.value)"
                                class="w-full text-xs font-bold text-center bg-blue-50 text-blue-700 rounded py-1 border-none">
                            </div>
                        </div>

                        <div class="flex items-center gap-1">
                            <input type="text" value="\${slot.label}" onchange="app.handleInput(\${i}, 'label', this.value)" 
                            class="flex-1 text-xs font-medium border-b border-gray-200 focus:border-blue-500 py-0.5 outline-none bg-white placeholder-gray-400" placeholder="Label...">
                            
                            <select onchange="app.handleInput(\${i}, 'type', this.value)" 
                            class="text-xs font-bold uppercase bg-white border border-gray-200 rounded px-1 py-0.5 outline-none \${slot.type==='break'?'text-orange-500':'text-blue-500'}">
                                <option value="class" \${slot.type==='class'?'selected':''}>CL</option>
                                <option value="break" \${slot.type==='break'?'selected':''}>BR</option>
                            </select>

                            <button onclick="app.removePeriod(\${i})" class="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 bg-white rounded border border-gray-200">
                                <span class="text-sm leading-none">&times;</span>
                            </button>
                        </div>
                    </div>
                </div>
                \`;
            }
        };

        document.addEventListener('DOMContentLoaded', () => app.init());
      </script>
    `;
}

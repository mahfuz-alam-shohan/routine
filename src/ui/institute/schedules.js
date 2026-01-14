// src/ui/institute/schedules.js

export function SchedulesPageHTML(config = null, slots = []) {
    // 1. IF NO CONFIG, SHOW WIZARD (Step 1)
    if (!config) return WizardHTML();

    // 2. IF CONFIG EXISTS, SHOW DESIGNER (Step 2)
    return DesignerHTML(config, slots);
}

function WizardHTML() {
    return `
      <div class="max-w-2xl mx-auto py-10">
          <div class="text-center mb-10">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Schedule Setup</h1>
              <p class="text-gray-500">How does your school operate?</p>
          </div>
          
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-4">
              <label class="block relative border rounded-xl p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  <input type="radio" name="strategy" value="single" class="peer sr-only" onchange="toggleDetails()">
                  <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 peer-checked:bg-blue-600 peer-checked:text-white">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </div>
                      <div>
                          <h3 class="font-bold text-gray-900">Single Shift</h3>
                          <p class="text-xs text-gray-500">One timeline for everyone (e.g. 8am - 2pm).</p>
                      </div>
                  </div>
                  <div class="absolute top-4 right-4 w-4 h-4 rounded-full border border-gray-300 peer-checked:border-blue-600 peer-checked:bg-blue-600"></div>
              </label>

              <label class="block relative border rounded-xl p-4 cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all group">
                  <input type="radio" name="strategy" value="disconnected" class="peer sr-only" onchange="toggleDetails()">
                  <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 peer-checked:bg-purple-600 peer-checked:text-white">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                      </div>
                      <div>
                          <h3 class="font-bold text-gray-900">Multiple Shifts</h3>
                          <p class="text-xs text-gray-500">Morning, Day, Evening (Separate or Overlapping).</p>
                      </div>
                  </div>
                  <div class="absolute top-4 right-4 w-4 h-4 rounded-full border border-gray-300 peer-checked:border-purple-600 peer-checked:bg-purple-600"></div>
              </label>

              <div id="shift-names-box" class="hidden mt-4 pl-14">
                  <label class="block text-xs font-bold text-gray-500 mb-1">Shift Names (comma separated)</label>
                  <input type="text" id="shift-names" placeholder="Morning, Day" class="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none">
              </div>

              <button onclick="saveConfig()" class="w-full bg-gray-900 text-white py-3 rounded-lg font-bold text-sm hover:bg-black mt-4">
                  Start Designing &rarr;
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

function DesignerHTML(config, slots) {
    const shifts = JSON.parse(config.shifts_json || '["Standard"]');
    
    // Sort slots by start time
    slots.sort((a, b) => a.start_time.localeCompare(b.start_time));

    return `
      <div class="max-w-4xl mx-auto space-y-6">
          
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                  <h1 class="text-2xl font-bold text-gray-900">Schedule Designer</h1>
                  <p class="text-sm text-gray-500">Define the bell times for <span class="font-semibold text-blue-600">${shifts.join(', ')}</span></p>
              </div>
              <div class="flex gap-2">
                  <button onclick="document.getElementById('add-modal').classList.remove('hidden')" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm">
                      + Add Time Slot
                  </button>
                  <button onclick="resetConfig()" class="text-gray-400 hover:text-red-500 px-3 py-2 text-sm font-medium">
                      Reset
                  </button>
              </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div class="grid grid-cols-12 bg-gray-50 border-b border-gray-200 px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <div class="col-span-3 md:col-span-2">Time</div>
                  <div class="col-span-4 md:col-span-3">Label</div>
                  <div class="col-span-3 md:col-span-5">Applies To</div>
                  <div class="col-span-2 text-right">Action</div>
              </div>
              
              <div class="divide-y divide-gray-100">
                  ${slots.map(slot => {
                      const appliedShifts = JSON.parse(slot.applicable_shifts || '[]');
                      const isBreak = slot.type === 'break';
                      return `
                      <div class="grid grid-cols-12 items-center px-4 py-3 hover:bg-gray-50 transition-colors ${isBreak ? 'bg-orange-50/30' : ''}">
                          <div class="col-span-3 md:col-span-2 text-sm font-mono text-gray-700 font-medium">
                              ${slot.start_time}<br><span class="text-gray-400 text-xs">${slot.end_time}</span>
                          </div>
                          
                          <div class="col-span-4 md:col-span-3">
                              <span class="text-sm font-bold ${isBreak ? 'text-orange-600' : 'text-gray-800'}">
                                  ${slot.label}
                              </span>
                              ${isBreak ? '<span class="ml-2 text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded uppercase">Break</span>' : ''}
                          </div>

                          <div class="col-span-3 md:col-span-5 flex flex-wrap gap-1">
                              ${appliedShifts.map(s => `<span class="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">${s}</span>`).join('')}
                          </div>

                          <div class="col-span-2 text-right">
                              <button onclick="deleteSlot(${slot.id})" class="text-gray-400 hover:text-red-600 p-1">
                                  &times;
                              </button>
                          </div>
                      </div>
                      `;
                  }).join('')}
                  ${slots.length === 0 ? '<div class="p-8 text-center text-gray-400 italic">No time slots defined yet. Click "Add Time Slot".</div>' : ''}
              </div>
          </div>

      </div>

      <div id="add-modal" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
              <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 class="font-bold text-gray-800">Add New Slot</h3>
                  <button onclick="document.getElementById('add-modal').classList.add('hidden')" class="text-gray-400 hover:text-gray-600">&times;</button>
              </div>
              
              <form onsubmit="addSlot(event)" class="p-6 space-y-4">
                  
                  <div class="grid grid-cols-2 gap-4">
                      <div>
                          <label class="block text-xs font-bold text-gray-500 mb-1">Start Time</label>
                          <input type="time" name="start_time" required class="w-full border border-gray-300 rounded p-2 text-sm">
                      </div>
                      <div>
                          <label class="block text-xs font-bold text-gray-500 mb-1">End Time</label>
                          <input type="time" name="end_time" required class="w-full border border-gray-300 rounded p-2 text-sm">
                      </div>
                  </div>

                  <div>
                      <label class="block text-xs font-bold text-gray-500 mb-1">Label (e.g. 1st Period)</label>
                      <input type="text" name="label" required placeholder="Period Name" class="w-full border border-gray-300 rounded p-2 text-sm">
                  </div>

                  <div>
                      <label class="block text-xs font-bold text-gray-500 mb-1">Type</label>
                      <select name="type" class="w-full border border-gray-300 rounded p-2 text-sm">
                          <option value="class">Class Period</option>
                          <option value="break">Break / Tiffin</option>
                      </select>
                  </div>

                  <div>
                      <label class="block text-xs font-bold text-gray-500 mb-2">Applicable Shifts</label>
                      <div class="flex flex-wrap gap-2 bg-gray-50 p-3 rounded border border-gray-200">
                          ${shifts.map(s => `
                              <label class="flex items-center gap-2 text-sm cursor-pointer">
                                  <input type="checkbox" name="shifts" value="${s}" checked class="text-blue-600 rounded focus:ring-blue-500">
                                  <span>${s}</span>
                              </label>
                          `).join('')}
                      </div>
                  </div>

                  <button type="submit" class="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 mt-2">
                      Save Slot
                  </button>
              </form>
          </div>
      </div>

      <script>
        async function resetConfig() {
            if(!confirm("This will delete all slots. Reset configuration?")) return;
            await fetch('/school/schedules', { method: 'DELETE' });
            window.location.reload();
        }

        async function deleteSlot(id) {
            if(!confirm("Delete this slot?")) return;
            await fetch('/school/schedules', { 
                method: 'POST', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ action: 'delete_slot', id }) 
            });
            window.location.reload();
        }

        async function addSlot(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            // Collect Checkboxes
            const checkboxes = document.querySelectorAll('input[name="shifts"]:checked');
            const selectedShifts = Array.from(checkboxes).map(cb => cb.value);
            
            if (selectedShifts.length === 0) return alert("Select at least one shift.");

            const data = {
                action: 'add_slot',
                start_time: formData.get('start_time'),
                end_time: formData.get('end_time'),
                label: formData.get('label'),
                type: formData.get('type'),
                applicable_shifts: selectedShifts
            };

            try {
                const res = await fetch('/school/schedules', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                if(res.ok) window.location.reload();
                else alert("Error adding slot");
            } catch(e) { alert("Network Error"); }
        }
      </script>
    `;
}

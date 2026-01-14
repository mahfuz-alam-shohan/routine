// src/ui/institute/schedules.js

export function SchedulesPageHTML(config = null, existingSlots = []) {
    if (!config) return WizardHTML();

    // Parse configuration
    const shifts = JSON.parse(config.shifts_json || '["Standard"]');
    
    // Sort slots just in case, though we will rely on UI order mainly
    existingSlots.sort((a, b) => a.start_time.localeCompare(b.start_time));

    // Convert existing slots to UI format or Default
    // We need to determine the "School Start Time" from the first slot, or default 08:00
    const schoolStartTime = existingSlots.length > 0 ? existingSlots[0].start_time : "08:00";

    return `
      <div class="max-w-5xl mx-auto" id="schedule-app">
          
          <div class="flex justify-between items-end mb-4 border-b border-gray-200 pb-4">
              <div>
                  <h2 class="text-lg font-bold text-gray-900 leading-none">Master Routine Configuration</h2>
                  <p class="text-xs text-gray-500 mt-1">Design the bell times. Sub-shifts are layered on top of the master timeline.</p>
              </div>
              <div class="flex gap-2">
                   <button onclick="saveRoutine()" class="bg-gray-900 text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-black transition-colors shadow-sm">
                      Save Master Schedule
                   </button>
                   <button onclick="resetConfig()" class="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded text-xs font-bold transition-colors">
                      Reset All
                   </button>
              </div>
          </div>

          <div class="bg-white border border-gray-300 rounded mb-4 p-3 flex items-center gap-4 shadow-sm">
              <label class="flex flex-col">
                  <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">School Starts At</span>
                  <input type="time" id="school_start_time" value="${schoolStartTime}" onchange="recalculateTimes()" 
                         class="border border-gray-300 rounded px-2 py-1 text-sm font-mono font-bold text-gray-900 focus:ring-1 focus:ring-blue-500 outline-none w-32">
              </label>
              <div class="h-8 w-px bg-gray-200 mx-2"></div>
              <div class="text-xs text-gray-500">
                  <span class="font-bold text-gray-700">Strict Mode Active:</span> 
                  Classes are continuous. No gaps allowed between periods.
              </div>
          </div>

          <div class="bg-white border border-gray-300 shadow-sm rounded overflow-hidden">
              <table class="w-full text-left border-collapse">
                  <thead>
                      <tr class="bg-gray-100 text-[10px] uppercase font-bold text-gray-500 border-b border-gray-300">
                          <th class="py-2 px-3 w-16 text-center border-r border-gray-200">#</th>
                          <th class="py-2 px-3 border-r border-gray-200 w-32">Start - End</th>
                          <th class="py-2 px-3 border-r border-gray-200 w-24">Duration</th>
                          <th class="py-2 px-3 border-r border-gray-200">Period Label</th>
                          <th class="py-2 px-3 border-r border-gray-200 w-32">Type</th>
                          <th class="py-2 px-3 border-r border-gray-200">Applicable Shifts</th>
                          <th class="py-2 px-3 w-10"></th>
                      </tr>
                  </thead>
                  <tbody id="slot-container" class="text-sm text-gray-800 divide-y divide-gray-200">
                      </tbody>
              </table>
              
              <div class="bg-gray-50 p-2 border-t border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors flex justify-center" onclick="addEmptyRow()">
                  <div class="text-xs font-bold text-blue-600 flex items-center gap-1">
                      <span>+ Add Next Period</span>
                  </div>
              </div>
          </div>

      </div>

      <script>
        // Make shifts available to JS
        const AVAILABLE_SHIFTS = ${JSON.stringify(shifts)};
        // Existing Data from Server
        const SERVER_SLOTS = ${JSON.stringify(existingSlots)};

        document.addEventListener('DOMContentLoaded', () => {
            if(SERVER_SLOTS.length > 0) {
                renderRows(SERVER_SLOTS);
            } else {
                // Default: 1st Period, 45 mins
                addRow({ label: "1st Period", duration: 45, type: 'class', applicable_shifts: AVAILABLE_SHIFTS });
            }
            recalculateTimes();
        });

        function renderRows(data) {
            const container = document.getElementById('slot-container');
            container.innerHTML = '';
            data.forEach(slot => {
                // Calculate duration based on start/end if strictly needed, 
                // but usually we want to respect the stored data or recalculate.
                // For editing, we trust the duration logic.
                const start = new Date("2000-01-01 " + slot.start_time);
                const end = new Date("2000-01-01 " + slot.end_time);
                const diffMins = Math.round((end - start) / 60000); // ms to minutes
                
                const applied = JSON.parse(slot.applicable_shifts || '[]');
                addRow({ 
                    label: slot.label, 
                    duration: diffMins > 0 ? diffMins : 45, 
                    type: slot.type, 
                    applicable_shifts: applied 
                });
            });
        }

        function addEmptyRow() {
            addRow({ label: "New Period", duration: 40, type: 'class', applicable_shifts: AVAILABLE_SHIFTS });
            recalculateTimes();
        }

        function addRow(data) {
            const container = document.getElementById('slot-container');
            const index = container.children.length;
            
            const tr = document.createElement('tr');
            tr.className = "group hover:bg-blue-50 transition-colors bg-white";
            
            // SHIFTS CHECKBOXES HTML
            let shiftsHtml = '<div class="flex flex-wrap gap-2">';
            AVAILABLE_SHIFTS.forEach(s => {
                const checked = data.applicable_shifts.includes(s) ? 'checked' : '';
                shiftsHtml += \`
                    <label class="flex items-center gap-1.5 cursor-pointer select-none">
                        <input type="checkbox" class="shift-check w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-0" value="\${s}" \${checked}>
                        <span class="text-[11px] font-medium text-gray-600">\${s}</span>
                    </label>
                \`;
            });
            shiftsHtml += '</div>';

            tr.innerHTML = \`
                <td class="py-1 px-3 text-center text-xs font-mono text-gray-400 border-r border-gray-200 select-none">\${index + 1}</td>
                
                <td class="py-1 px-3 border-r border-gray-200">
                    <div class="text-xs font-mono font-bold text-gray-900 time-display bg-gray-50 px-2 py-1 rounded border border-gray-200 text-center">
                        --:-- - --:--
                    </div>
                </td>
                
                <td class="py-1 px-3 border-r border-gray-200">
                    <div class="flex items-center">
                        <input type="number" value="\${data.duration}" min="5" step="5" onchange="recalculateTimes()" 
                            class="slot-duration w-full text-xs font-bold text-center border-none bg-transparent focus:ring-0 p-0" placeholder="45">
                        <span class="text-[10px] text-gray-400 ml-1">min</span>
                    </div>
                </td>
                
                <td class="py-1 px-3 border-r border-gray-200 p-0">
                    <input type="text" value="\${data.label}" 
                        class="slot-label w-full text-sm border-none bg-transparent focus:ring-0 px-0 py-1 font-medium text-gray-800 placeholder-gray-400" placeholder="Period Name">
                </td>
                
                <td class="py-1 px-3 border-r border-gray-200">
                    <select class="slot-type w-full text-xs border-none bg-transparent focus:ring-0 p-0 font-medium \${data.type === 'break' ? 'text-orange-600' : 'text-blue-600'}" onchange="updateRowColor(this)">
                        <option value="class" \${data.type === 'class' ? 'selected' : ''}>Class</option>
                        <option value="break" \${data.type === 'break' ? 'selected' : ''}>Break / Tiffin</option>
                        <option value="assembly" \${data.type === 'assembly' ? 'selected' : ''}>Assembly</option>
                    </select>
                </td>

                <td class="py-1 px-3 border-r border-gray-200">
                    \${shiftsHtml}
                </td>

                <td class="py-1 px-2 text-center">
                    <button onclick="removeRow(this)" class="text-gray-300 hover:text-red-500 transition-colors px-2 font-bold text-lg">&times;</button>
                </td>
            \`;
            
            // Apply slight tint if break initially
            if(data.type === 'break') tr.classList.add('bg-orange-50/50');
            
            container.appendChild(tr);
        }

        function removeRow(btn) {
            const row = btn.closest('tr');
            row.remove();
            // Re-index visually
            const rows = document.querySelectorAll('#slot-container tr');
            rows.forEach((r, i) => {
                r.querySelector('td:first-child').innerText = i + 1;
            });
            recalculateTimes();
        }

        function updateRowColor(select) {
            const tr = select.closest('tr');
            if(select.value === 'break') {
                tr.classList.add('bg-orange-50/50');
                select.classList.remove('text-blue-600');
                select.classList.add('text-orange-600');
            } else {
                tr.classList.remove('bg-orange-50/50');
                select.classList.remove('text-orange-600');
                select.classList.add('text-blue-600');
            }
        }

        function recalculateTimes() {
            let currentTimeStr = document.getElementById('school_start_time').value; // "08:00"
            if(!currentTimeStr) return;

            // Helper to add minutes
            const addMinutes = (timeStr, mins) => {
                let [h, m] = timeStr.split(':').map(Number);
                let date = new Date(2000, 0, 1, h, m);
                date.setMinutes(date.getMinutes() + mins);
                return date.toTimeString().substring(0, 5); // "HH:MM"
            };

            const rows = document.querySelectorAll('#slot-container tr');
            
            rows.forEach(row => {
                const duration = parseInt(row.querySelector('.slot-duration').value) || 0;
                const endTimeStr = addMinutes(currentTimeStr, duration);
                
                // Update Display
                row.querySelector('.time-display').innerText = \`\${currentTimeStr} - \${endTimeStr}\`;
                
                // Store calculated start/end data attributes for saving later
                row.dataset.startTime = currentTimeStr;
                row.dataset.endTime = endTimeStr;

                // Move current time forward for next loop
                currentTimeStr = endTimeStr;
            });
        }

        async function saveRoutine() {
            const rows = document.querySelectorAll('#slot-container tr');
            const payload = [];

            rows.forEach(row => {
                const shifts = [];
                row.querySelectorAll('.shift-check:checked').forEach(cb => shifts.push(cb.value));

                payload.push({
                    start_time: row.dataset.startTime,
                    end_time: row.dataset.endTime,
                    label: row.querySelector('.slot-label').value,
                    type: row.querySelector('.slot-type').value,
                    applicable_shifts: shifts
                });
            });

            if(payload.length === 0) return alert("Please add at least one period.");

            const btn = document.querySelector('button[onclick="saveRoutine()"]');
            const originalText = btn.innerText;
            btn.innerText = "Saving...";
            
            try {
                const res = await fetch('/school/schedules', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ action: 'save_routine', slots: payload })
                });
                if(res.ok) window.location.reload();
                else alert("Error saving routine");
            } catch(e) {
                alert("Network error");
            } finally {
                btn.innerText = originalText;
            }
        }

        async function resetConfig() {
             if(!confirm("Reset configuration?")) return;
             await fetch('/school/schedules', { method: 'DELETE' });
             window.location.reload();
        }
      </script>
    `;
}

// ... WizardHTML keeps the same logic as before, just style updates if needed ...
function WizardHTML() {
    return `
      <div class="max-w-xl mx-auto py-10">
          <div class="text-center mb-8">
              <h1 class="text-2xl font-bold text-gray-900">Initial Setup</h1>
              <p class="text-sm text-gray-500">How does your school operate?</p>
          </div>
          
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-6 space-y-4">
              <label class="block relative border rounded-lg p-3 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <input type="radio" name="strategy" value="single" class="peer sr-only" onchange="toggleDetails()">
                  <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 peer-checked:bg-blue-600 peer-checked:text-white">
                        1
                      </div>
                      <div>
                          <h3 class="font-bold text-sm text-gray-900">Single Shift</h3>
                          <p class="text-xs text-gray-500">Everyone follows one timeline.</p>
                      </div>
                  </div>
              </label>

              <label class="block relative border rounded-lg p-3 cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all">
                  <input type="radio" name="strategy" value="connected" class="peer sr-only" onchange="toggleDetails()">
                  <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 peer-checked:bg-purple-600 peer-checked:text-white">
                        2
                      </div>
                      <div>
                          <h3 class="font-bold text-sm text-gray-900">Multiple Shifts (Connected)</h3>
                          <p class="text-xs text-gray-500">Morning/Day shifts share the same bell times.</p>
                      </div>
                  </div>
              </label>

              <div id="shift-names-box" class="hidden mt-3 pl-12">
                  <label class="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Shift Names</label>
                  <input type="text" id="shift-names" placeholder="Morning, Day" class="w-full border border-gray-300 rounded p-2 text-sm outline-none">
              </div>

              <button onclick="saveConfig()" class="w-full bg-gray-900 text-white py-2.5 rounded text-sm font-bold hover:bg-black mt-4">
                  Create Master Schedule
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
            // Ensure 'Full Day' implies capability to cover all if needed, but usually we just name the shifts.
            await fetch('/school/schedules', { method: 'POST', body: JSON.stringify({ action: 'init_config', strategy: strategyEl.value, shifts }) });
            window.location.reload();
        }
      </script>
    `;
}

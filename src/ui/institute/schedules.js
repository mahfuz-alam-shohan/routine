// src/ui/institute/schedules.js

export function SchedulesPageHTML(config = null, existingSlots = []) {
    if (!config) return WizardHTML();

    const shifts = JSON.parse(config.shifts_json || '["Standard"]');
    existingSlots.sort((a, b) => a.start_time.localeCompare(b.start_time));
    const schoolStartTime = existingSlots.length > 0 ? existingSlots[0].start_time : "08:00";

    return `
      <div class="max-w-5xl mx-auto" id="schedule-app">
          
          <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 border-b border-gray-200 pb-4">
              <div>
                  <h2 class="text-lg font-bold text-gray-900 leading-none">Master Routine</h2>
                  <p class="text-xs text-gray-500 mt-1">Design bell times. Shifts are layered on this timeline.</p>
              </div>
              <div class="flex gap-2 w-full md:w-auto">
                   <button onclick="saveRoutine()" class="flex-1 md:flex-none bg-gray-900 text-white px-5 py-2 md:py-1.5 rounded-lg md:rounded text-sm md:text-xs font-bold hover:bg-black transition-colors shadow-sm">
                      Save Schedule
                   </button>
                   <button onclick="resetConfig()" class="flex-1 md:flex-none text-red-600 bg-red-50 hover:bg-red-100 px-5 py-2 md:py-1.5 rounded-lg md:rounded text-sm md:text-xs font-bold transition-colors">
                      Reset
                   </button>
              </div>
          </div>

          <div class="bg-white border border-gray-300 rounded-lg mb-4 p-4 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-sm">
              <label class="flex flex-col w-full md:w-auto">
                  <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">School Starts At</span>
                  <input type="time" id="school_start_time" value="${schoolStartTime}" onchange="recalculateTimes()" 
                         class="border border-gray-300 rounded px-3 py-2 text-base md:text-sm font-mono font-bold text-gray-900 focus:ring-1 focus:ring-blue-500 outline-none w-full md:w-32">
              </label>
              <div class="hidden md:block h-8 w-px bg-gray-200 mx-2"></div>
              <div class="text-xs text-gray-500 bg-blue-50 p-2 rounded w-full md:w-auto">
                  <span class="font-bold text-blue-700">Strict Mode:</span> 
                  Periods are continuous. Changing one duration updates all subsequent times.
              </div>
          </div>

          <div class="bg-white border border-gray-300 shadow-sm rounded-lg overflow-hidden flex flex-col">
              
              <div class="overflow-x-auto w-full">
                  <table class="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                          <tr class="bg-gray-100 text-[10px] uppercase font-bold text-gray-500 border-b border-gray-300">
                              <th class="py-3 px-3 w-12 text-center border-r border-gray-200">#</th>
                              <th class="py-3 px-3 border-r border-gray-200 w-36">Time Slot</th>
                              <th class="py-3 px-3 border-r border-gray-200 w-24">Mins</th>
                              <th class="py-3 px-3 border-r border-gray-200">Period Name</th>
                              <th class="py-3 px-3 border-r border-gray-200 w-32">Type</th>
                              <th class="py-3 px-3 border-r border-gray-200 w-48">Shifts</th>
                              <th class="py-3 px-3 w-12"></th>
                          </tr>
                      </thead>
                      <tbody id="slot-container" class="text-sm text-gray-800 divide-y divide-gray-200">
                          </tbody>
                  </table>
              </div>
              
              <div class="bg-gray-50 p-3 border-t border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors flex justify-center active:bg-gray-200" onclick="addEmptyRow()">
                  <div class="text-sm font-bold text-blue-600 flex items-center gap-2">
                      <span class="text-xl leading-none">+</span>
                      <span>Add Next Period</span>
                  </div>
              </div>
          </div>

      </div>

      <script>
        const AVAILABLE_SHIFTS = ${JSON.stringify(shifts)};
        const SERVER_SLOTS = ${JSON.stringify(existingSlots)};

        document.addEventListener('DOMContentLoaded', () => {
            if(SERVER_SLOTS.length > 0) {
                renderRows(SERVER_SLOTS);
            } else {
                addRow({ label: "1st Period", duration: 45, type: 'class', applicable_shifts: AVAILABLE_SHIFTS });
            }
            recalculateTimes();
        });

        function renderRows(data) {
            const container = document.getElementById('slot-container');
            container.innerHTML = '';
            data.forEach(slot => {
                const start = new Date("2000-01-01 " + slot.start_time);
                const end = new Date("2000-01-01 " + slot.end_time);
                const diffMins = Math.round((end - start) / 60000); 
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
            
            let shiftsHtml = '<div class="flex flex-wrap gap-2">';
            AVAILABLE_SHIFTS.forEach(s => {
                const checked = data.applicable_shifts.includes(s) ? 'checked' : '';
                shiftsHtml += \`
                    <label class="flex items-center gap-1.5 cursor-pointer select-none bg-white border border-gray-200 rounded px-1.5 py-0.5">
                        <input type="checkbox" class="shift-check w-3 h-3 text-blue-600 focus:ring-0" value="\${s}" \${checked}>
                        <span class="text-[10px] font-medium text-gray-600">\${s}</span>
                    </label>
                \`;
            });
            shiftsHtml += '</div>';

            tr.innerHTML = \`
                <td class="py-2 px-3 text-center text-xs font-mono text-gray-400 border-r border-gray-200 select-none">\${index + 1}</td>
                
                <td class="py-2 px-3 border-r border-gray-200">
                    <div class="text-xs font-mono font-bold text-gray-900 time-display bg-gray-50 px-2 py-1.5 rounded border border-gray-200 text-center whitespace-nowrap">
                        --:-- - --:--
                    </div>
                </td>
                
                <td class="py-2 px-3 border-r border-gray-200">
                    <div class="flex items-center relative">
                        <input type="number" value="\${data.duration}" min="5" step="5" onchange="recalculateTimes()" 
                            class="slot-duration w-full text-sm font-bold text-center border border-transparent hover:border-gray-200 focus:border-blue-500 rounded bg-transparent p-1 outline-none" placeholder="45">
                    </div>
                </td>
                
                <td class="py-2 px-3 border-r border-gray-200">
                    <input type="text" value="\${data.label}" 
                        class="slot-label w-full text-sm border-b border-transparent focus:border-blue-500 bg-transparent px-1 py-1 font-medium text-gray-800 placeholder-gray-400 outline-none transition-colors" placeholder="Period Name">
                </td>
                
                <td class="py-2 px-3 border-r border-gray-200">
                    <select class="slot-type w-full text-xs border border-transparent hover:border-gray-200 rounded bg-transparent p-1 font-medium \${data.type === 'break' ? 'text-orange-600' : 'text-blue-600'}" onchange="updateRowColor(this)">
                        <option value="class" \${data.type === 'class' ? 'selected' : ''}>Class</option>
                        <option value="break" \${data.type === 'break' ? 'selected' : ''}>Break</option>
                        <option value="assembly" \${data.type === 'assembly' ? 'selected' : ''}>Assembly</option>
                    </select>
                </td>

                <td class="py-2 px-3 border-r border-gray-200">
                    \${shiftsHtml}
                </td>

                <td class="py-2 px-2 text-center">
                    <button onclick="removeRow(this)" class="w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors font-bold text-lg">&times;</button>
                </td>
            \`;
            
            if(data.type === 'break') tr.classList.add('bg-orange-50/50');
            container.appendChild(tr);
        }

        function removeRow(btn) {
            btn.closest('tr').remove();
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
            let currentTimeStr = document.getElementById('school_start_time').value; 
            if(!currentTimeStr) return;

            const addMinutes = (timeStr, mins) => {
                let [h, m] = timeStr.split(':').map(Number);
                let date = new Date(2000, 0, 1, h, m);
                date.setMinutes(date.getMinutes() + mins);
                // Manual formatting to ensure 24h format HH:MM
                let rh = date.getHours().toString().padStart(2, '0');
                let rm = date.getMinutes().toString().padStart(2, '0');
                return \`\${rh}:\${rm}\`;
            };

            const rows = document.querySelectorAll('#slot-container tr');
            rows.forEach(row => {
                const duration = parseInt(row.querySelector('.slot-duration').value) || 0;
                const endTimeStr = addMinutes(currentTimeStr, duration);
                
                row.querySelector('.time-display').innerText = \`\${currentTimeStr} - \${endTimeStr}\`;
                row.dataset.startTime = currentTimeStr;
                row.dataset.endTime = endTimeStr;
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

// Wizard stays mostly same but responsive wrapper added
function WizardHTML() {
    return `
      <div class="max-w-xl mx-auto py-10 px-4">
          <div class="text-center mb-8">
              <h1 class="text-2xl font-bold text-gray-900">Initial Setup</h1>
              <p class="text-sm text-gray-500">How does your school operate?</p>
          </div>
          
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-6 space-y-4">
              <label class="block relative border rounded-lg p-3 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <input type="radio" name="strategy" value="single" class="peer sr-only" onchange="toggleDetails()">
                  <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 peer-checked:bg-blue-600 peer-checked:text-white">1</div>
                      <div>
                          <h3 class="font-bold text-sm text-gray-900">Single Shift</h3>
                          <p class="text-xs text-gray-500">Everyone follows one timeline.</p>
                      </div>
                  </div>
              </label>

              <label class="block relative border rounded-lg p-3 cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all">
                  <input type="radio" name="strategy" value="connected" class="peer sr-only" onchange="toggleDetails()">
                  <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 peer-checked:bg-purple-600 peer-checked:text-white">2</div>
                      <div>
                          <h3 class="font-bold text-sm text-gray-900">Multiple Shifts</h3>
                          <p class="text-xs text-gray-500">Morning/Day shifts share the same bells.</p>
                      </div>
                  </div>
              </label>

              <div id="shift-names-box" class="hidden mt-3 pl-12">
                  <label class="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Shift Names</label>
                  <input type="text" id="shift-names" placeholder="Morning, Day" class="w-full border border-gray-300 rounded p-2 text-base md:text-sm outline-none">
              </div>

              <button onclick="saveConfig()" class="w-full bg-gray-900 text-white py-3 rounded-lg text-sm font-bold hover:bg-black mt-4">
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
            await fetch('/school/schedules', { method: 'POST', body: JSON.stringify({ action: 'init_config', strategy: strategyEl.value, shifts }) });
            window.location.reload();
        }
      </script>
    `;
}

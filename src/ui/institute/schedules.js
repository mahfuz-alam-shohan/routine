// src/ui/institute/schedules.js

export function SchedulesPageHTML(config = null) {
    // If config exists, we show the viewer (Coming later). 
    // For now, if no config, we show the Wizard.
    if (!config) return WizardHTML();
    
    // Placeholder for Part 2 (The Table)
    return `
        <div class="text-center py-20">
            <h2 class="text-2xl font-bold text-gray-900">Schedule Configured!</h2>
            <p class="text-gray-500">Strategy: ${config.strategy}</p>
            <button onclick="resetConfig()" class="mt-4 text-red-500 underline text-sm">Reset & Start Over</button>
        </div>
        <script>
            async function resetConfig() {
                if(!confirm("Reset configuration?")) return;
                await fetch('/school/schedules', { method: 'DELETE' });
                window.location.reload();
            }
        </script>
    `;
}

function WizardHTML() {
    return `
      <div class="max-w-2xl mx-auto py-10">
          
          <div class="text-center mb-10">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Schedule Designer</h1>
              <p class="text-gray-500">Let's set up your school's timeline structure.</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div class="p-6 border-b border-gray-100 bg-gray-50">
                  <h2 class="font-bold text-gray-800">Step 1: Shift Configuration</h2>
                  <p class="text-xs text-gray-500 mt-1">How does your institution operate?</p>
              </div>

              <div class="p-6 space-y-4">
                  
                  <label class="block relative border rounded-xl p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
                      <input type="radio" name="strategy" value="single" class="peer sr-only" onchange="toggleDetails()">
                      <div class="flex items-center gap-4">
                          <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 peer-checked:bg-blue-600 peer-checked:text-white transition-colors">
                              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          </div>
                          <div>
                              <h3 class="font-bold text-gray-900 group-hover:text-blue-700">Single Shift / Full Day</h3>
                              <p class="text-xs text-gray-500">All classes follow one standard timeline (e.g. 8am - 2pm).</p>
                          </div>
                      </div>
                      <div class="absolute top-4 right-4 w-4 h-4 rounded-full border border-gray-300 peer-checked:border-blue-600 peer-checked:bg-blue-600"></div>
                  </label>

                  <label class="block relative border rounded-xl p-4 cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all group">
                      <input type="radio" name="strategy" value="disconnected" class="peer sr-only" onchange="toggleDetails()">
                      <div class="flex items-center gap-4">
                          <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 peer-checked:bg-purple-600 peer-checked:text-white transition-colors">
                              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                          </div>
                          <div>
                              <h3 class="font-bold text-gray-900 group-hover:text-purple-700">Multiple Disconnected Shifts</h3>
                              <p class="text-xs text-gray-500">Shifts are completely separate (e.g. Morning 7-12, Day 1-6). No overlap.</p>
                          </div>
                      </div>
                      <div class="absolute top-4 right-4 w-4 h-4 rounded-full border border-gray-300 peer-checked:border-purple-600 peer-checked:bg-purple-600"></div>
                  </label>

                  <label class="block relative border rounded-xl p-4 cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all group">
                      <input type="radio" name="strategy" value="connected" class="peer sr-only" onchange="toggleDetails()">
                      <div class="flex items-center gap-4">
                          <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 peer-checked:bg-green-600 peer-checked:text-white transition-colors">
                              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                          </div>
                          <div>
                              <h3 class="font-bold text-gray-900 group-hover:text-green-700">Combined / Overlapping Shifts</h3>
                              <p class="text-xs text-gray-500">Shifts share a timeline or resources (e.g. Primary 8-11, Secondary 11-4, Full 8-2).</p>
                          </div>
                      </div>
                      <div class="absolute top-4 right-4 w-4 h-4 rounded-full border border-gray-300 peer-checked:border-green-600 peer-checked:bg-green-600"></div>
                  </label>

                  <div id="shift-names-box" class="hidden mt-4 pl-14 animate-fade-in">
                      <label class="block text-xs font-bold text-gray-500 mb-1">Define Shift Names (comma separated)</label>
                      <input type="text" id="shift-names" placeholder="e.g. Morning, Day, Evening" 
                             class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  </div>

              </div>

              <div class="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                  <button onclick="saveConfig()" class="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-black transition-transform active:scale-95">
                      Next Step &rarr;
                  </button>
              </div>
          </div>

      </div>

      <script>
        function toggleDetails() {
            const val = document.querySelector('input[name="strategy"]:checked').value;
            const box = document.getElementById('shift-names-box');
            if(val === 'single') {
                box.classList.add('hidden');
            } else {
                box.classList.remove('hidden');
                document.getElementById('shift-names').value = val === 'disconnected' ? "Morning, Day" : "Morning, Day, Full Day";
            }
        }

        async function saveConfig() {
            const strategyEl = document.querySelector('input[name="strategy"]:checked');
            if(!strategyEl) return alert("Please select an option.");
            
            const strategy = strategyEl.value;
            let shifts = ["Standard"];

            if(strategy !== 'single') {
                const txt = document.getElementById('shift-names').value;
                if(!txt) return alert("Please name your shifts.");
                shifts = txt.split(',').map(s => s.trim()).filter(s => s);
            }

            try {
                const res = await fetch('/school/schedules', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ action: 'init_config', strategy, shifts })
                });
                if(res.ok) window.location.reload();
                else alert("Error saving");
            } catch(e) { alert("Network Error"); }
        }
      </script>
    `;
}

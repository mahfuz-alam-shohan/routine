// src/ui/institute/classes.js

export function ClassesPageHTML(classes = []) {
    const rows = classes.map(c => `
        <div class="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors px-2">
            <div>
                <div class="font-medium text-gray-900">${c.class_name}</div>
                <div class="text-xs text-gray-500 mt-0.5 flex gap-2">
                    <span class="bg-blue-50 text-blue-700 px-1.5 rounded">Sec: ${c.section_name}</span>
                    <span class="bg-gray-100 text-gray-600 px-1.5 rounded">${c.shift || 'General'}</span>
                </div>
            </div>
            <div class="text-sm text-gray-400">
                <button class="text-red-400 hover:text-red-600 transition-colors cursor-not-allowed" title="Delete coming soon">Remove</button>
            </div>
        </div>
    `).join('');

    return `
      <div class="max-w-3xl mx-auto pt-6">
          
          <div class="flex items-center justify-between mb-8">
              <div>
                <h1 class="text-2xl font-light text-gray-900">Classes & Sections</h1>
                <p class="text-sm text-gray-500 mt-1">Configure your academic structure.</p>
              </div>
              <button onclick="toggleAdd()" class="text-sm bg-gray-900 text-white px-5 py-2 hover:bg-black transition-colors">
                  + Add Section
              </button>
          </div>

          <div id="add-box" class="hidden mb-10 bg-gray-50 p-6 border border-gray-100 rounded-lg">
              <form onsubmit="addClass(event)" class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  
                  <div>
                      <label class="block text-xs uppercase tracking-wide text-gray-500 mb-2">Class Name</label>
                      <select name="class_name" class="w-full bg-white border border-gray-200 p-2 text-sm focus:outline-none focus:border-gray-400 h-10">
                          <option>Class 6</option>
                          <option>Class 7</option>
                          <option>Class 8</option>
                          <option>Class 9</option>
                          <option>Class 10</option>
                          <option>HSC 1st Year</option>
                          <option>HSC 2nd Year</option>
                      </select>
                  </div>

                  <div>
                      <label class="block text-xs uppercase tracking-wide text-gray-500 mb-2">Section Name</label>
                      <input type="text" name="section_name" required class="w-full bg-white border border-gray-200 p-2 text-sm focus:outline-none focus:border-gray-400 h-10" placeholder="e.g. A, Rose, Science">
                  </div>

                  <button type="submit" class="w-full bg-blue-600 text-white px-6 py-2 text-sm hover:bg-blue-700 h-10 font-medium">
                      Add Class
                  </button>
              </form>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 p-4">
              ${classes.length > 0 ? rows : '<div class="py-12 text-center text-gray-400 font-light">No classes added yet.</div>'}
          </div>

      </div>

      <script>
        function toggleAdd() {
            document.getElementById('add-box').classList.toggle('hidden');
        }

        async function addClass(e) {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "...";
            btn.disabled = true;

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await fetch('/school/classes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if(res.ok) window.location.reload();
                else alert("Failed to add");
            } catch(e) {
                console.error(e);
                alert("Error");
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        }
      </script>
    `;
}
export function TeachersPageHTML(teachers = []) {
    const rows = teachers.map(t => `
        <div class="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors px-2">
            <div>
                <div class="font-medium text-gray-900">${t.full_name}</div>
                <div class="text-xs text-gray-400 mt-0.5">${t.phone || 'No phone'}</div>
            </div>
            <div class="text-sm text-gray-400">
                <button class="hover:text-red-600 transition-colors">Remove</button>
            </div>
        </div>
    `).join('');

    return `
      <div class="max-w-3xl mx-auto pt-6">
          
          <div class="flex items-center justify-between mb-8">
              <div>
                <h1 class="text-2xl font-light text-gray-900">Teachers</h1>
                <p class="text-sm text-gray-500 mt-1">Manage your academic staff.</p>
              </div>
              <button onclick="toggleAdd()" class="text-sm bg-gray-900 text-white px-5 py-2 hover:bg-black transition-colors">
                  + Add New
              </button>
          </div>

          <div id="add-box" class="hidden mb-10 bg-gray-50 p-6 border border-gray-100">
              <form onsubmit="addTeacher(event)" class="flex flex-col md:flex-row gap-4 items-end">
                  <div class="flex-1 w-full">
                      <label class="block text-xs uppercase tracking-wide text-gray-500 mb-2">Full Name</label>
                      <input type="text" name="full_name" required class="w-full bg-white border border-gray-200 p-2 text-sm focus:outline-none focus:border-gray-400 transition-colors" placeholder="e.g. Mr. Rahim">
                  </div>
                  <div class="w-full md:w-48">
                      <label class="block text-xs uppercase tracking-wide text-gray-500 mb-2">Phone (Optional)</label>
                      <input type="text" name="phone" class="w-full bg-white border border-gray-200 p-2 text-sm focus:outline-none focus:border-gray-400 transition-colors" placeholder="017...">
                  </div>
                  <button type="submit" class="w-full md:w-auto bg-blue-600 text-white px-6 py-2 text-sm hover:bg-blue-700">Save</button>
              </form>
          </div>

          <div class="bg-white">
              ${teachers.length > 0 ? rows : '<div class="py-12 text-center text-gray-400 font-light">No teachers added yet.</div>'}
          </div>

      </div>

      <script>
        function toggleAdd() {
            document.getElementById('add-box').classList.toggle('hidden');
        }

        async function addTeacher(e) {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "...";
            btn.disabled = true;

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await fetch('/school/teachers', {
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
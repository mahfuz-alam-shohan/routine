export function SettingsPageHTML(currentSiteName) {
  return `
    <div class="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Global System Settings</h2>
        
        <form onsubmit="saveSettings(event)" class="space-y-4">
            <div>
                <label for="site_name" class="block text-sm font-medium text-gray-700">Application Name</label>
                <input type="text" id="site_name" value="${currentSiteName}" 
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    placeholder="e.g. My School Routine Manager">
                <p class="mt-1 text-sm text-gray-500">This name will appear on the Login page and Public headers.</p>
            </div>

            <div class="pt-2">
                <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Save Changes
                </button>
            </div>
        </form>

        <div id="status-msg" class="mt-4 hidden text-sm font-medium"></div>

        <div class="mt-10 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div class="flex">
                <div class="ml-3">
                    <h3 class="text-sm font-bold text-yellow-800">Database Maintenance</h3>
                    <div class="mt-1 text-sm text-yellow-700">
                        <p>If you have updated the code with new columns or tables, run this to sync the database.</p>
                    </div>
                    <div class="mt-3">
                        <button onclick="runSync(event)" type="button" class="text-sm font-medium text-yellow-800 hover:text-yellow-900 underline">
                            Run Schema Sync Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // 1. Save Settings Logic
        async function saveSettings(e) {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const msg = document.getElementById('status-msg');
            const newName = document.getElementById('site_name').value;

            btn.disabled = true;
            btn.innerText = "Saving...";

            try {
                const res = await fetch('/admin/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ site_name: newName })
                });
                
                const data = await res.json();
                
                msg.classList.remove('hidden', 'text-red-600', 'text-green-600');
                if(data.success) {
                    msg.classList.add('text-green-600');
                    msg.innerText = "Success! Settings saved.";
                } else {
                    msg.classList.add('text-red-600');
                    msg.innerText = "Error: " + data.error;
                }

            } catch(err) {
                console.error(err);
                msg.classList.remove('hidden');
                msg.classList.add('text-red-600');
                msg.innerText = "Network Error";
            } finally {
                btn.disabled = false;
                btn.innerText = "Save Changes";
            }
        }

        // 2. Sync Database Logic
        async function runSync(e) {
            if(!confirm("This will add missing columns and DELETE unused tables/columns. Continue?")) return;
            
            const btn = e.target;
            const originalText = btn.innerText;
            btn.innerText = "Syncing... Please wait...";
            btn.disabled = true;
            
            try {
                const res = await fetch('/admin/settings?action=sync_db');
                const data = await res.json();
                
                if(data.success) {
                    alert("Sync Complete! Log:\\n" + data.report.join("\\n"));
                } else {
                    alert("Sync Failed.");
                }
            } catch (err) {
                alert("Error connecting to server.");
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        }
    </script>
  `;
}
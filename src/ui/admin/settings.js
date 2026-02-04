export function SettingsPageHTML(profile = {}, email = '') {
    const p = profile || {};
    
    return `
      <div class="max-w-2xl mx-auto space-y-6 px-3 sm:px-4">
          
          <div class="text-center">
              <h1 class="text-xl font-bold text-gray-900">Account Settings</h1>
              <p class="text-sm text-gray-500 mt-1">Manage your profile information and security.</p>
          </div>

          <div class="bg-white border border-gray-300">
              <div class="p-4 border-b border-gray-300 bg-gray-50 flex justify-between items-center">
                  <h2 class="text-sm font-bold text-gray-800 uppercase tracking-wide">Personal Information</h2>
                  <span class="text-xs text-gray-400">Admin ID: ${p.auth_id || '-'}</span>
              </div>
              
              <div class="p-6">
                  <div class="flex flex-col items-center mb-6">
                      <div class="w-20 h-20 border border-gray-300 text-gray-900 flex items-center justify-center text-xl font-bold mb-2">
                          ${(p.full_name || email || 'A').charAt(0).toUpperCase()}
                      </div>
                      <h3 class="text-base font-bold text-gray-900">${p.full_name || 'Admin User'}</h3>
                      <p class="text-sm text-gray-500">${email}</p>
                  </div>

                  <form onsubmit="updateProfile(event)" class="space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                              <input type="text" name="full_name" value="${p.full_name || ''}" placeholder="Enter your name" 
                                     class="w-full border border-gray-300 px-3 py-2 text-sm outline-none">
                          </div>
                          <div>
                              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                              <input type="text" name="phone" value="${p.phone || ''}" placeholder="+880..." 
                                     class="w-full border border-gray-300 px-3 py-2 text-sm outline-none">
                          </div>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Date of Birth</label>
                              <input type="date" name="dob" value="${p.dob || ''}" 
                                     class="w-full border border-gray-300 px-3 py-2 text-sm outline-none">
                          </div>
                          <div>
                              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Email (Read Only)</label>
                              <input type="text" value="${email}" disabled 
                                     class="w-full border border-gray-200 bg-gray-50 text-gray-500 px-3 py-2 text-sm cursor-not-allowed">
                          </div>
                      </div>

                      <div class="pt-2 flex justify-end">
                          <button type="submit" class="border border-gray-900 text-gray-900 px-6 py-2 text-sm font-semibold">
                              Save Changes
                          </button>
                      </div>
                  </form>
              </div>
          </div>

          <div class="bg-white border border-gray-300">
              <div class="p-4 border-b border-gray-300 bg-gray-50">
                  <h2 class="text-sm font-bold text-red-600 uppercase tracking-wide">Security</h2>
              </div>
              <div class="p-6">
                  <form onsubmit="changePassword(event)" class="space-y-4">
                      <div>
                          <label class="block text-xs font-bold text-gray-500 uppercase mb-1">New Password</label>
                          <input type="password" name="password" required placeholder="********" 
                                 class="w-full border border-gray-300 px-3 py-2 text-sm outline-none">
                      </div>
                      <div class="flex justify-end">
                          <button type="submit" class="border border-gray-300 text-gray-700 px-6 py-2 text-sm font-semibold">
                              Update Password
                          </button>
                      </div>
                  </form>
              </div>
          </div>

      </div>

      <script>
        async function updateProfile(e) {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "Saving...";
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.action = 'update_profile';

            try {
                const res = await fetch('/admin/settings', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                if(res.ok) alert("Profile updated successfully!");
                else alert("Error saving profile");
            } catch(e) { alert("Network error"); }
            finally { btn.innerText = originalText; }
        }

        async function changePassword(e) {
            e.preventDefault();
            if(!confirm("Are you sure you want to change your password?")) return;
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.action = 'change_password';

            try {
                const res = await fetch('/admin/settings', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                if(res.ok) { alert("Password changed!"); e.target.reset(); }
                else alert("Error changing password");
            } catch(e) { alert("Network error"); }
        }
      </script>
    `;
}

// src/ui/admin/settings.js

export function SettingsPageHTML(profile = {}, email = '') {
    const p = profile || {};
    
    return `
      <div class="max-w-2xl mx-auto space-y-8">
          
          <div class="text-center mb-8">
              <h1 class="text-2xl font-bold text-gray-900">Account Settings</h1>
              <p class="text-sm text-gray-500 mt-1">Manage your profile information and security.</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div class="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <h2 class="text-sm font-bold text-gray-800 uppercase tracking-wide">Personal Information</h2>
                  <span class="text-xs text-gray-400">Admin ID: ${p.auth_id || '-'}</span>
              </div>
              
              <div class="p-8">
                  <div class="flex flex-col items-center mb-8">
                      <div class="w-24 h-24 rounded-full bg-gray-900 text-white flex items-center justify-center text-3xl font-bold mb-4 ring-4 ring-gray-100">
                          ${(p.full_name || email || 'A').charAt(0).toUpperCase()}
                      </div>
                      <h3 class="text-lg font-bold text-gray-900">${p.full_name || 'Admin User'}</h3>
                      <p class="text-sm text-gray-500">${email}</p>
                  </div>

                  <form onsubmit="updateProfile(event)" class="space-y-5">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                              <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Full Name</label>
                              <input type="text" name="full_name" value="${p.full_name || ''}" placeholder="Enter your name" 
                                     class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all">
                          </div>
                          <div>
                              <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Phone Number</label>
                              <input type="text" name="phone" value="${p.phone || ''}" placeholder="+880..." 
                                     class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all">
                          </div>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                              <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Date of Birth</label>
                              <input type="date" name="dob" value="${p.dob || ''}" 
                                     class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all">
                          </div>
                          <div>
                              <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email (Read Only)</label>
                              <input type="text" value="${email}" disabled 
                                     class="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg px-3 py-2.5 text-sm cursor-not-allowed">
                          </div>
                      </div>

                      <div class="pt-4 flex justify-end">
                          <button type="submit" class="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-black transition-transform active:scale-95 shadow-sm">
                              Save Changes
                          </button>
                      </div>
                  </form>
              </div>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div class="p-6 border-b border-gray-100 bg-gray-50/50">
                  <h2 class="text-sm font-bold text-red-600 uppercase tracking-wide">Security</h2>
              </div>
              <div class="p-8">
                  <form onsubmit="changePassword(event)" class="space-y-5">
                      <div>
                          <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">New Password</label>
                          <input type="password" name="password" required placeholder="••••••••" 
                                 class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none">
                      </div>
                      <div class="flex justify-end">
                          <button type="submit" class="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
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

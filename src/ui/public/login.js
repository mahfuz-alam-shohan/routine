export const LOGIN_HTML = `
<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or <a href="/" class="font-medium text-blue-600 hover:text-blue-500">return home</a>
      </p>
    </div>
    
    <form class="mt-8 space-y-6" onsubmit="handleLogin(event)">
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="email-address" class="sr-only">Email address</label>
          <input id="email-address" name="email" type="email" autocomplete="email" required 
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
            placeholder="Email address">
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input id="password" name="password" type="password" autocomplete="current-password" required 
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
            placeholder="Password">
        </div>
      </div>

      <div>
        <button type="submit" id="login-btn" 
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
          Sign in
        </button>
      </div>
      
      <div id="error-msg" class="text-red-500 text-center text-sm font-medium hidden bg-red-50 p-2 rounded"></div>
    </form>
  </div>
</div>

<script>
  async function handleLogin(e) {
    e.preventDefault(); // Stop page reload
    
    const btn = document.getElementById('login-btn');
    const msg = document.getElementById('error-msg');
    const originalText = btn.innerText;
    
    // 1. Show Loading State
    btn.innerText = "Signing in...";
    btn.disabled = true;
    msg.classList.add('hidden'); // Hide previous errors

    // 2. Prepare Data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      // 3. Send Request
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {
        // 4. SUCCESS: Redirect based on Role
        btn.innerText = "Redirecting...";
        
        if (result.role === 'admin') {
            window.location.href = '/admin/dashboard';
        } else if (result.role === 'institute') {
            window.location.href = '/school/dashboard'; // <--- Redirects School Users
        } else {
            // Fallback for unknown roles
            window.location.href = '/'; 
        }
      } else {
        // 5. ERROR: Show message (Invalid password, etc.)
        throw new Error(result.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      msg.innerText = err.message || "Connection error. Please try again.";
      msg.classList.remove('hidden');
      
      // Reset Button
      btn.innerText = originalText;
      btn.disabled = false;
    }
  }
</script>
`;